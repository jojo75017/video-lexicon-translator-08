# Studio BD : ne plus jamais consommer les crédits Lovable pour les images

## Ce que vous demandez

Les images de BD doivent être générées **uniquement avec vos clés** : Gemini (dont Nano Banana), OpenAI ou OpenRouter. Aucun basculement automatique vers les crédits inclus Lovable, qui partent trop vite.

## Situation actuelle

Dans `generate-chapter-images`, quand votre clé échoue (ou si le moteur choisi est indisponible), la fonction retombe sur la passerelle Lovable AI (`ai.gateway.lovable.dev`) et consomme vos crédits. C'est ce chemin de secours qu'il faut couper.

## Correction prévue

1. **Suppression du secours Lovable pour les images BD**
   - La branche Lovable AI n'est plus jamais empruntée automatiquement.
   - Ordre d'essai : moteur demandé (ou détection auto par préfixe de clé) → autre clé valide disponible (Gemini ↔ OpenAI ↔ OpenRouter) → **arrêt avec message clair**, plus de crédits consommés.

2. **Choix explicite du modèle image**
   - Sélecteur « Moteur d'images » : Auto (recommandé), Gemini (Nano Banana), OpenAI, OpenRouter.
   - Ajout du modèle **Nano Banana** (`gemini-3.1-flash-image`, rapide et économique) comme choix par défaut côté Gemini, avec option Gemini Pro Image pour plus de qualité.
   - Le choix « Lovable AI / crédits inclus » disparaît du Studio BD.

3. **Échecs visibles au lieu d'images muettes**
   - Plus de placeholder silencieux : chaque case non générée affiche « Image non générée » + motif (clé refusée, quota, contenu bloqué) et un bouton **Régénérer cette case**.
   - Un message global en fin de génération : « 6 cases sur 8 non générées — clé Gemini refusée ».
   - Si aucune clé valide n'est enregistrée, la génération s'arrête d'entrée avec un lien vers le paramétrage des clés.

## Ce qui ne change pas

- Le nombre de cases par page (4), les styles, les prompts et le scénario.
- Les tarifs, les tunnels de commande, les autres modules.
- Les autres fonctions de l'app qui utilisent les crédits inclus (texte, etc.) restent inchangées — seule la génération d'images BD est concernée.

## Détails techniques

- `supabase/functions/generate-chapter-images/index.ts` : retrait de la branche `ai.gateway.lovable.dev` du chemin de secours images ; `usedProvider` ne peut plus valoir `lovable` ; réponse enrichie (`provider`, `providerError`, `reason`) et statut d'échec explicite au lieu d'un placeholder.
- `src/components/ebook/EbookComicBookGenerator.tsx` : sélecteur de moteur sans option Lovable, modèle Nano Banana par défaut, garde-fou « aucune clé », affichage d'erreur par case et régénération unitaire.
- Vérification : test de la fonction déployée avec une clé Gemini valide (image réelle), puis avec une clé invalide (erreur explicite, **aucun** appel à la passerelle Lovable dans les logs).
- Aucun `npm run build`, uniquement l'aperçu de développement.
