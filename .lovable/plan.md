
# Refonte Premium V3 — Émeraude Prestige

Objectif : passer d'une V3 amateur à une V3 haut de gamme qui justifie le prix, avec **tous** les outils V2 accessibles et une identité visuelle éditoriale forte (émeraude profond + accent or).

---

## 1. Design system Émeraude Prestige

Tokens à installer dans `src/styles/v3-public.css` (variables `--v3-*`) :

- `--v3-ink: #0a1f18` (texte principal, presque noir vert)
- `--v3-emerald: #064e3b` (fond header, boutons primaires)
- `--v3-emerald-600: #0d7a5f` (hover, accents)
- `--v3-gold: #c9a84c` (accent premium, badges, filets)
- `--v3-gold-soft: #f5f0e0` (fonds doux, hover cartes)
- `--v3-paper: #fbfaf6` (fond page, off-white chaud)
- `--v3-line: rgba(6, 78, 59, 0.08)` (séparateurs subtils)
- Ombres douces éditoriales : `--v3-shadow-card`, `--v3-shadow-menu`
- Typo : **Cormorant Garamond** (titres, sérif éditorial) + **Inter** (UI/body). Import via `<link>` dans `index.html`.

Ce palette + typo est appliqué en 3 endroits : header, sidebar, cartes d'outils. Tout le reste hérite via classes utilitaires Tailwind mappées aux variables.

---

## 2. Header premium (2 lignes fixes)

Refonte de `src/components/v3public/V3Header.tsx` + `V3MainTabs.tsx`.

**Ligne 1 — Barre de marque (h-16, fond émeraude `#064e3b`, texte crème)**
```
[Logo EbookStudio V3 + monogramme or]   [Search discrète, w-80]   [Formation] [Support] [Basculer V2] [Avatar/Compte]
```
- Logo : lettrage sérif "EbookStudio" + petit filet or + badge "V3 · Premium" en or fin.
- Search : icône loupe or, placeholder "Rechercher un outil, un guide…".
- Bouton V2 : lien texte discret or, pas un gros bouton flottant.

**Ligne 2 — Mega-menu catégories (h-14, fond crème `--v3-paper`, filet or 1px en bas)**
```
📘 Créer   ✍️ Écrire   🎨 Habiller   🚀 Publier   💛 Vendre   📚 Livres spéciaux         [Tous les outils →]
```
- Chaque item : label sérif, hover = soulignement or animé + ouverture mega-panel.
- Mega-panel : plein largeur `max-w-6xl`, 3 colonnes, filet or en haut, ombre douce. Chaque lien : titre + micro-description grise. Colonne de droite = illustration/CTA premium (ex: "Cover Studio Pro V3").
- Fermeture au blur + délai 150ms (déjà en place).

**Mobile** : ligne 1 conservée, ligne 2 devient tiroir plein écran avec accordéons.

---

## 3. Sidebar épurée (sans doublon)

Refonte de `src/components/v3public/V3Sidebar.tsx` — **uniquement personnel & support**, jamais les catégories du header.

Sections finales :
- **Mon espace** : Accueil V3, Créer un livre, Ma bibliothèque, Mes livres, Brouillons
- **Formation** : Formation vidéo, Masterclass, Bibliothèque vidéo, Séries, Guides & Blog
- **Offres & compte** : Offres & Packs, Mon abonnement, Paramètres, Profil auteur
- **Support** : Contact, FAQ, Assistance

Style : fond blanc pur, item actif = fond `--v3-gold-soft` + barre latérale or 3px + texte émeraude. Collapse iconique conservé.

---

## 4. Réintégration EXHAUSTIVE des outils V2

Audit du registre : 30 outils déjà catalogués mais dispersés/introuvables. Remapper dans `src/data/v3HeaderMenu.ts` pour que chaque outil V2 apparaisse dans le mega-menu de la bonne catégorie premium :

**📘 Créer** → Wizard V3, Plan du livre, Personnages, Import manuscrit, Générateur d'idées, Quiz Auteur, Ambiances d'écriture, Modèles/Fiches pratiques, **Sommaire Ultime** ⭐

**✍️ Écrire** → Ebook Planner V2 (22 agents), Parcours 30 agents, Outils V3, BookPerfect AI, Ebookbot / Chat IA, Assistant IA

**🎨 Habiller** → Cover Studio KDP, **Cover Studio Pro V3** ⭐, BD Studio, Illustrations intérieures, Documentation Studio, Signature auteur

**🚀 Publier** → KDP Pilot / Audit, Audit Pilot, KDP Keywords (KDSpy), 600 Niches, Niches Amazon, Amazon Spy, Séries & Tomes, Compteur de mots KDP, Exporter le livre

**💛 Vendre** → Galerie communauté, Ma page auteur, Signature email, Marketing / Emails, Formation Audio, Séries Audio

**📚 Livres spéciaux** → tous les `SPECIAL_BOOK_TABS` (déjà dynamiques)

**+ Bouton "Tous les outils"** → page `/v3/outils` avec grille searchable premium (fond papier, cartes or/émeraude, filtre par catégorie).

Chaque lien reçoit un `desc` court (1 phrase) et un `badge` (`Nouveau`, `Pro`, `Populaire`) rendu en pastille or.

---

## 5. Page d'accueil V3 premium

Refonte de `V3HomePage.tsx` (`src/pages/v3public/V3HomePage.tsx`) :

1. **Hero éditorial** : fond émeraude profond, titre sérif "Publiez le livre que vous avez en vous.", sous-titre crème, 2 CTA (or plein "Créer mon livre" + outline "Voir la démo"), filet or décoratif.
2. **Bande de confiance** : mini-chiffres (auteurs, livres publiés, notes) sur fond papier, séparateurs or.
3. **6 cartes catégories** (Créer/Écrire/Habiller/Publier/Vendre/Spéciaux), hover soulève + halo or.
4. **Outils vedettes** : 4 cartes premium (Wizard V3, Cover Pro, KDP Pilot, Sommaire Ultime) — image + micro-desc + lien or.
5. **Section formation** : bandeau sérif + preuve sociale.
6. **Footer premium** conservé.

---

## 6. Fichiers touchés

- `src/styles/v3-public.css` — tokens & typo (édit)
- `index.html` — import Google Fonts (édit)
- `src/components/v3public/V3Header.tsx` — refonte complète
- `src/components/v3public/V3MainTabs.tsx` — refonte mega-menu premium
- `src/components/v3public/V3Sidebar.tsx` — épuration
- `src/data/v3HeaderMenu.ts` — remap exhaustif V2 → catégories V3
- `src/pages/v3public/V3HomePage.tsx` — refonte hero + sections
- `src/pages/v3public/V3ToolsIndexPage.tsx` — restyle grille premium

Aucune logique métier touchée (auth, workflow, paiement, edge functions inchangés).

---

## 7. Validation

- Build + typecheck OK
- Playwright : screenshot `/v3`, `/v3/hub`, `/v3/library`, `/v3/outils` en 1440px → header 2 lignes visible, mega-menu s'ouvre, sidebar sans doublon.
- Vérifier que chaque outil V2 du registre a **au moins un point d'entrée** dans le header ou l'index outils.
