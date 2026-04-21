

## Ajouter l'extension Chrome dans la navigation

**Problème :** La page `/extension-chrome` existe mais n'est accessible nulle part — ni depuis la page de vente `/offres`, ni depuis la sidebar de l'app. L'utilisateur doit deviner l'URL.

**Objectif :** Rendre l'extension Chrome visible et accessible en 1 clic depuis tous les endroits stratégiques.

### Modifications

**1. Bandeau visible en haut de la page `/offres`**
Ajouter un bandeau orange/teal **fin et accrocheur** juste sous le compte à rebours, visible dès l'arrivée :
> 🚀 **NOUVEAU** — Extension Chrome gratuite : score de niche Amazon en 1 clic → [Télécharger]

Cliquable, redirige vers `/extension-chrome`.

**2. Bouton dans la sidebar (pilier 📣 Vendre)**
Ajouter un nouvel item dans `allToolGroups` de `ModernSidebar.tsx`, dans le groupe "📣 Vendre" :
- ID : `chrome-extension`
- Label : `Extension Chrome` (avec badge "GRATUIT")
- Icône : `Chrome` (lucide-react)
- Type : lien externe vers `/extension-chrome` (ouvre dans la même fenêtre via `navigate`)

Mise à jour également de :
- `modernSidebarSections.ts` : ajouter `chrome-extension` dans le groupe `📣 Vendre`
- `ESSENTIAL_TOOL_IDS['📣 Vendre']` : inclure `chrome-extension` pour qu'il soit visible par défaut (pas masqué derrière "+ Voir avancés")

**3. Carte CTA dans la grille de la page `/offres`** (optionnel mais recommandé)
Ajouter une petite carte "Bonus gratuit" entre les sections existantes pour mettre en avant l'extension comme cadeau d'entrée.

### Fichiers touchés
- `src/pages/SalesPage.tsx` → bandeau haut + carte bonus
- `src/components/layout/ModernSidebar.tsx` → item `chrome-extension` dans pilier Vendre + handler de navigation
- `src/components/layout/modernSidebarSections.ts` → ajout dans `Vendre` + `ESSENTIAL_TOOL_IDS`

### Résultat attendu
- Visiteur sur `/offres` : voit le bandeau immédiatement, peut télécharger sans inscription
- Abonné dans l'app : voit "Extension Chrome 🎁" dans le menu Vendre, accès permanent
- Tout le monde peut atteindre `/extension-chrome` sans connaître l'URL

