## Objectif

Ajouter un bouton **"✨ Auto-remplir avec l'IA"** dans le formulaire `EbookCompleteWorkflow` qui, à partir du **titre + sous-titre + introduction** déjà saisis, demande à Gemini de remplir automatiquement les **8 champs** des deux accordéons "🎯 Cible idéale" et "✨ Promesse centrale".

## Champs auto-remplis

**Cible idéale (4 champs)**
- `cibleProfil` — Profil du lecteur
- `cibleNiveau` — Niveau (énum : `debutant` / `intermediaire` / `avance` / `tous`)
- `cibleBesoins` — Besoins / attentes
- `cibleFrustrations` — Frustrations / douleurs

**Promesse centrale (4 champs)**
- `promesseCentrale` — Promesse principale en 1 phrase
- `promesseBenefices` — 3 bénéfices (liste à puces)
- `promesseDifferenciation` — Différenciation
- `promesseEmotion` — Émotion visée

## UX

Un seul bouton placé **juste au-dessus des deux accordéons** (avant `<AccordionItem value="cible">`), pleine largeur, joyeux :
- Style : `bg-joy-sun` + bordure `joy-ink/10`, icône `Sparkles`, texte "✨ Auto-remplir Cible & Promesse avec l'IA".
- État `disabled` si `title` ou `bookIntroduction` est vide → tooltip "Remplis d'abord le titre et l'introduction".
- État `loading` avec spinner pendant l'appel.
- Toast succès "Cible & Promesse remplies, vérifie/ajuste si besoin 🌈" + ouverture automatique des deux accordéons.
- Toast erreur explicite si la clé Gemini manque ou si l'API échoue.
- Si les champs étaient déjà remplis : `confirm()` avant écrasement.

## Backend — nouvelle edge function

**Fichier** : `supabase/functions/autofill-target-promise/index.ts`

- Reçoit : `{ title, subtitle?, bookIntroduction, language?, userApiKey }` (BYOK Gemini, validation `AIza` prefix conforme à la mémoire `Access Control & AI Configuration Policy`).
- Auth : `supabase.auth.getUser()` (mémoire Core).
- Appelle Gemini `gemini-2.5-flash` via `generativelanguage.googleapis.com` (même pattern que les autres functions BYOK du projet) avec `responseMimeType: application/json` et un schéma JSON strict pour les 8 champs.
- Si `userApiKey` invalide ou absent → 400 avec message clair.
- Renvoie `{ cibleProfil, cibleNiveau, cibleBesoins, cibleFrustrations, promesseCentrale, promesseBenefices, promesseDifferenciation, promesseEmotion }`.
- CORS standard, gestion 429 / quota Gemini selon mémoire `Gemini Rate Limits`.

## Frontend — modifications

**Fichier modifié** : `src/components/ebook/EbookCompleteWorkflow.tsx` uniquement.

- Ajouter `const [autofillLoading, setAutofillLoading] = useState(false);`
- Ajouter `handleAutofill()` : appelle `supabase.functions.invoke('autofill-target-promise', { body: { title, subtitle, bookIntroduction, language, userApiKey: normalizedUserApiKey } })`, puis appelle les 8 setters `setCibleProfil(...)` etc.
- Insérer le bouton avant l'`<AccordionItem value="cible">` (vers la ligne ~1478).
- Forcer l'ouverture des accordéons "cible" et "promesse" via le state `value` de l'`Accordion` après succès.

## Hors-scope

- Ne touche pas à `EbookEditorialDirector` (autre composant, déjà autonome avec son P1).
- Ne modifie pas l'edge function `complete-book-workflow`.
- Pas de migration DB, pas de nouvelle table.
- Aucun changement de logique de génération P1-P15.

## Détails techniques

- **Modèle** : `google/gemini-2.5-flash` via la clé Gemini de l'abonné (BYOK), prompt en français, `responseSchema` JSON strict pour fiabilité.
- **Sécurité** : `verify_jwt = true` côté config (par défaut), rate limit côté provider. La clé utilisateur n'est jamais loggée.
- **Fallback** : si la réponse n'est pas un JSON valide, on renvoie 502 avec message + le bouton reste utilisable pour réessayer.

## Résultat attendu

L'abonné saisit titre + intro, clique sur le bouton → en 3-5 secondes les 8 champs sont pré-remplis intelligemment et il peut juste les ajuster. Gain de temps massif sur l'étape la plus coûteuse de la rédaction.