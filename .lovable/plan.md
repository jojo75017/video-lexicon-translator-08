## Lancement public ebookstudio.fr — ce que reçoivent les abonnés

Tu offres déjà à tes abonnés actuels :
1. **−30 % à vie** sur tout upsell / pack / formation
2. **30 min de coaching Zoom 1:1 offert** → https://calendly.com/boubetgeorges/nouvelle-reunion

Objectif : transformer ces abonnés en **ambassadeurs** (parrainage = bouche-à-oreille).

---

### 1. Email "Cadeau lancement" (à envoyer le jour J)

Sujet : `🎁 Pour toi, avant tout le monde : 30 min en visio avec moi + −30 %`

Corps (résumé) :
- "Le grand lancement public démarre aujourd'hui. Avant les nouveaux, **toi tu as deux cadeaux** :"
- 🎯 **30 min Zoom 1:1 offert** pour bloquer ton plan d'attaque KDP — bouton CTA → Calendly
- 💸 **−30 % à vie** sur les upsells (formation, coaching VIP, packs prompts)
- 🤝 **Ton lien de parrainage perso** — gagne 30 % sur chaque vente (lien dynamique vers `/parrainage`)
- P.S. : "Partage ton lien aujourd'hui = double effet (tu aides un proche + tu touches une commission)."

### 2. Bannière persistante dans /espace (header abonné)

Une **bandeau jovial teal** affiché 7 jours :
```text
🎉 Lancement en cours — Ton cadeau VIP : 30 min Zoom + −30 % à vie  [Réserver] [Mon lien parrainage]
```

### 3. Page dédiée /espace/lancement (one-pager)

3 blocs verticaux :
1. **Ton coaching offert** → embed Calendly + rappel "1 fois, pas renouvelable"
2. **Ton code −30 %** → code affiché en gros (ex: `MERCIVIP30`) + liste des produits éligibles
3. **Ton kit ambassadeur** → lien parrainage + 3 textes pré-rédigés (Facebook, WhatsApp, email à un ami) à copier-coller

### 4. Post forum épinglé

Annonce dans la communauté : "Lancement en cours, voici vos 2 cadeaux + appel à partager."

### 5. Reminder J+3

Email court : "T'as réservé ton Zoom ? Il reste X créneaux cette semaine."

---

### Côté technique (à faire dans l'app)

- **Composant `LaunchVipBanner`** dans `EspaceHeader` (au-dessus de la nav, dismissible, dates de lancement codées en dur).
- **Page `/espace/lancement`** (lazy route) avec :
  - Iframe Calendly
  - Code promo affiché + bouton "copier"
  - Pull du `referral_code` de l'utilisateur depuis la table `referral_codes` + 3 templates de partage
- **Edge function `send-launch-vip-email`** :
  - Cible : tous les `subscribers` avec `status='active'`
  - Resend API, template HTML aux couleurs KDP (teal #008296)
  - Inclut le lien parrainage personnalisé de chaque abonné
- **Tracking** : ajouter une ligne dans `admin_launches` (déjà créé) pour ce lancement avec date et lien vers les 2 cadeaux dans `notes`.

---

### Ce que tu dois me valider avant que je code

1. **Date du lancement public** (pour figer les bannières et l'envoi email)
2. **Code promo −30 %** : tu veux un code unique (ex: `MERCIVIP30`) ou un code par abonné ?
3. **Sur quoi s'applique le −30 %** : formation seule ? coaching VIP ? tout l'écosystème ?
4. **Limite Calendly** : 1 créneau / abonné ou illimité ?

Réponds-moi à ces 4 points et je passe en mode build pour créer la bannière, la page `/espace/lancement` et l'email VIP.