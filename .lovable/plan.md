## Plan d’action

### Objectif
Rendre l’affiliation impossible à rater depuis l’application principale, pas seulement depuis le tunnel `/promo/*`, et regrouper tout au même endroit : lien affilié, commissions, kit de promotion, textes à copier et page publique.

### 1. Ajouter une vraie entrée visible dans la sidebar
Dans la sidebar principale de l’app :
- Remplacer l’ancien item `Parrainage 30€` par `Affiliation 30%`
- Le faire pointer directement vers `/promo/affilie`
- Mettre à jour sa description : `Lien affilié, commissions et kit de promotion prêt à copier`
- Le garder dans la section `Communauté`, ou créer une petite section dédiée `Business` / `Monétisation` si la structure actuelle le permet proprement

### 2. Rediriger l’ancien système `/parrainage`
Pour éviter que toi ou un affilié tombiez sur l’ancienne page sans kit :
- Transformer `/parrainage` en redirection vers `/promo/affilie`
- Garder la route existante pour ne pas casser les anciens liens

### 3. Faire de `/promo/affilie` la page centrale
La page `/promo/affilie` doit rester le centre unique avec :
- Code affilié
- Lien affilié principal
- Statistiques : clics, inscrits, conversions, gains
- Kit de promotion
- Liens préremplis avec `?ref=CODE`
- Templates email / réseaux sociaux / tweet / Reel
- FAQ objections

### 4. Ajouter des onglets clairs dans la page affiliation
Au lieu d’un long bloc confus, organiser la page avec des onglets visibles :
- `Tableau de bord`
- `Mes liens`
- `Kit email`
- `Réseaux sociaux`
- `FAQ objections`
- `Visuels`

### 5. Corriger les anciens textes incohérents
Corriger toutes les références restantes à :
- `30€ par filleul`
- `abonnement`
- `commission récurrente`

Pour les remplacer par :
- `30% par vente`
- `20,10€ par vente`
- `paiement unique 67€ à vie`

### 6. Vérification
Après modification :
- Vérifier que `/promo/affilie` est accessible depuis la sidebar depuis `/ebook-planner`
- Vérifier que `/parrainage` redirige bien vers `/promo/affilie`
- Vérifier que le kit s’affiche sur la page affiliation
