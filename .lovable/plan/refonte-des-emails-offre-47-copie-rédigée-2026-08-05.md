# Refonte des emails « Offre 47 € » — copie rédigée

## Ce qui change
Ta base est bonne : ton professionnel, vouvoiement, bénéfices clairs. Je la garde et j'ajoute ce qui manque pour faire cliquer : le résultat concret (un livre publiable), le détail de ce que l'abonné découvre en entrant, la levée des doutes, et un bouton visible répété deux fois.

---

## Email 1 — copie complète (J+0)

**Objet :** Votre idée de livre peut être publiée sur Amazon ce mois-ci
**Objet alternatif (A/B) :** Transformez votre idée en livre publiable — accès à 47 €
**Aperçu (preheader) :** Plan, rédaction, couverture KDP et fiche Amazon réunis dans un seul espace.

---

Bonjour [Prénom],

Vous avez une idée de livre. Peut-être depuis des mois. Ce qui bloque, ce n'est presque jamais l'idée : c'est le plan à structurer, les chapitres à écrire, le fichier à mettre aux normes, la couverture à fabriquer et la fiche Amazon à remplir.

EbookStudio prend en charge cette chaîne complète, de la première idée jusqu'à la mise en vente.

**Ce que vous obtenez concrètement :**

- **Un plan structuré** : chapitres et sous-parties générés à partir de votre sujet, que vous validez et modifiez librement.
- **La rédaction chapitre par chapitre** : vous gardez la main, vous relisez et ajustez le texte à chaque étape.
- **L'export prêt à publier** : fichiers Word et PDF conformes aux exigences Amazon KDP, sommaire propre, mise en page respectée.
- **La couverture KDP complète** : face avant, dos calculé selon votre nombre de pages, 4e de couverture, au format exact demandé par Amazon.
- **La fiche Amazon préparée** : titre, description, mots-clés et catégories, l'étape que la plupart des auteurs bâclent et qui décide de la visibilité du livre.
- **Les livres illustrés pour enfants 3-7 ans** : histoires et illustrations générées, format carré aux normes KDP.
- **Les outils annexes** : traduction, studio de couverture, recherche de niches, analyse de la concurrence Amazon.
- **La V3 incluse** : les évolutions à venir sont ajoutées à votre accès, sans repayer.

**Le résultat :** vous ne repartez pas avec des conseils, mais avec un manuscrit complet, une couverture au bon format et une fiche produit prête à être publiée. Un projet qui traînait depuis des mois devient un livre disponible sur Amazon.

Tout est réuni dans un seul espace : pas d'outils à assembler, pas de logiciel à apprendre, pas de compétence technique requise. Même s'il s'agit de votre premier livre.

**Jusqu'au 30 septembre, l'accès complet est à 47 € au lieu de 59 €.**
Un seul paiement. Pas d'abonnement, pas de prélèvement mensuel, accès conservé à vie.

👉 **[ Découvrir EbookStudio et profiter de l'offre à 47 € ]**

C'est le prix d'un repas au restaurant, pour un outil que vous gardez.

Et si vous hésitez, répondez simplement à cet email : je vous réponds personnellement.

Votre idée est déjà là. EbookStudio vous aide maintenant à en faire un véritable livre.

Bien à vous,
**Georges Boubet**
EbookStudio

👉 **[ J'accède à EbookStudio pour 47 € ]**

*Offre valable jusqu'au 30 septembre 2026, sous réserve des conditions indiquées sur le site.*

---

## Les 4 emails suivants (mêmes principes, angles différents)

| Step | Objet | Angle |
|---|---|---|
| 2 (J+2) | De trois lignes d'idée à un manuscrit complet | Avant / après : ce que vous saisissez, ce que vous récupérez |
| 3 (J+5) | Les 5 étapes qui créent votre livre | Le workflow détaillé, ce que vous voyez à l'écran à chaque étape |
| 4 (J+7) | « Je n'écris pas bien », « c'est trop technique » : réponses claires | Levée des objections + paiement unique, accès à vie |
| 5 (J+10) | Le tarif de 47 € se termine le 30 septembre | Échéance honnête : retour à 59 €, dernier message de la séquence |

---

## Habillage de l'email
Toujours en tables HTML avec styles inline (compatible Gmail, Outlook, Apple Mail) :
- bandeau EbookStudio teal + badge « OFFRE 47 € AU LIEU DE 59 € »
- bloc prix mis en valeur (47 € barré 59 €)
- liste de bénéfices avec pastilles ✓ lisibles, titres en gras
- bouton orange large, répété au milieu et en fin d'email
- pied de page : mention légale + lien de désinscription, pixel de suivi conservé

## Détails techniques
- Réécriture du tableau `STEPS` dans `supabase/functions/send-sales-email/index.ts` : chaque step reçoit `heading`, `intro`, `bullets[]`, `result`, `reassurance`, `cta`, `ps`.
- Refonte de `render()` : nouveau gabarit (bloc prix, liste ✓, double CTA), liens de tracking et pixel inchangés.
- Mise à jour des `subject` dans `src/data/canonicalEmailCampaign.ts`. Les noms de templates `offre-47-unique-1..5` restent identiques : anti-doublon et statistiques du tableau de bord Perf & CA préservés.
- Redéploiement de `send-sales-email`, puis envoi de test sur ton adresse avant toute relance.
- Aucun envoi de masse déclenché par ce plan : le Step 2 du 7 août partira avec ces nouveaux textes.

## Ce qu'il me manque pour aller plus loin
Aucun chiffre ni témoignage n'est inventé dans cette copie. Si tu me donnes des éléments réels (nombre de livres déjà produits, retours de bêta-testeurs, lien d'une vidéo de démo, capture d'un livre publié), je les intègre comme preuve dans les emails 1, 3 et 4 — c'est le levier qui manque le plus aujourd'hui.
