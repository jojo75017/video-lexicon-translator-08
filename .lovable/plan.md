
## 1. Débloquer le workflow V3 (blocage "Génération")

**Diagnostic** : `BookCreationStudio` ouvert en `autoRun` appelle `generate({ silent: true })` → `callAIWriting()`. Si le titre est vide ou si aucune clé BYOK n'est configurée, la fonction sort silencieusement → spinner infini sans aucun message.

**Corrections dans `src/components/admin/BookCreationStudio.tsx`** :

- Retirer `silent: true` de l'auto-run pour que les erreurs remontent en toast.
- Avant `callAIWriting`, vérifier `getProviderKey(getProvider())` : si absent → toast « Configurez d'abord votre clé IA » + `window.dispatchEvent(new CustomEvent('open-api-keys'))` pour ouvrir le panneau clés + `setStep(1)` pour ne pas rester bloqué.
- Si `autoRun` mais `!title.trim()` → toast « Renseignez au moins un titre » + `setStep(1)` (afficher les champs pour compléter, au lieu de bloquer).
- Timer de sécurité : si `loading` reste `true` > 90 s → auto-reset avec toast « L'IA ne répond pas, réessayez » + `setStep(1)`.
- Ajouter un bouton **« Annuler »** visible pendant `loading` pour permettre de sortir manuellement.
- Ajouter un écouteur `open-api-keys` dans `ApiKeysFloatingButton.tsx` pour ouvrir automatiquement le dialog quand l'événement est émis.

## 2. Réintégrer tous les outils V2 dans le Hub V3

**Constat** : Vous dites « on n'a pas à chercher » — les outils V2 (KDP Analyzer, Cover Studio, Audiobook, BD Studio, Word Count, Ambiances, Niches 600, etc.) doivent être visibles et lançables directement depuis /hub-v3, pas éparpillés sur d'anciennes routes.

**Approche** :

1. **Inventorier les outils V2** en scannant `src/pages/` (KDP, Cover, Audiobook, BD, Ambiances, WordCount, Niches600, EbookIdeas, PromptsGenerator, ProductGenerator, AuditPilot, PracticalSheets, AiChat, ToolsGuide, Suggestions, etc.).

2. **Créer un registre unifié** `src/data/v3ToolsRegistry.ts` regroupant chaque outil avec :
   ```ts
   { id, label, icon, category: 'ecriture'|'visuel'|'audio'|'kdp'|'marketing'|'analyse', route?, moduleKey?, description, badge?: 'V2'|'V3'|'Nouveau' }
   ```

3. **Ajouter un onglet « Tous les outils »** dans `V3HubPage.tsx` (à côté de Parcours / Roadmap / etc.) affichant une grille catégorisée avec :
   - Recherche par nom
   - Filtre par catégorie
   - Clic → soit ouvre le module V3 en dialog (si `moduleKey` existe), soit navigue vers la route V2 (`route`)
   - Badge visuel V2 / V3 pour clarté

4. **Composant** : `src/components/admin/V3AllToolsTab.tsx` — cartes cliquables format Amazon KDP (fond #FAFAFA, accent #008296, hover #FF9E2D).

5. **Pas de duplication de code** : les outils V2 restent sur leurs routes actuelles, le nouvel onglet est juste un **launcher unifié** qui pointe vers eux (via `<Link to={route}>` ou `onOpenModule(moduleKey)`).

## Fichiers touchés

- `src/components/admin/BookCreationStudio.tsx` — fix autoRun bloqué (garde-fous + timeout + annuler)
- `src/components/ebook/ApiKeysFloatingButton.tsx` — écouter l'événement `open-api-keys`
- `src/data/v3ToolsRegistry.ts` — **nouveau**, registre centralisé des outils V2+V3
- `src/components/admin/V3AllToolsTab.tsx` — **nouveau**, onglet grille catégorisée
- `src/pages/V3HubPage.tsx` — ajouter l'onglet « Tous les outils »

## Non fait volontairement

- **Mailjet** : abandonné selon votre décision, on reste sur Resend + Brevo existants.
- Pas de refactor des pages V2 elles-mêmes — juste un launcher unifié dans le Hub.
