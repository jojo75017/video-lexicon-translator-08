# Exploiter les visiteurs francophones expatriés

Objectif : transformer le trafic SEO "expatriés" (CH/BE/LU/DE/CA) en inscrits, puis en clients, avec un message **pertinent** à chaque étape. Aujourd'hui tout le monde reçoit la même séquence générique "10 niches" — ce qui casse la conversion pour ce nouveau segment.

## Constat technique
- `funnel-capture-lead` capte l'email et inscrit le lead dans `email_sequences` (`sequence_name = "promo_funnel"`), **mais ne transmet pas quel lead magnet** a été téléchargé.
- `email-sequence-cron` lit `email_sequences` mais **ignore `sequence_name`** : il applique une seule séquence codée en dur (10 niches, signée Georges) à tous.
- Résultat : un expatrié qui télécharge le guide "KDP étranger" reçoit 6 emails parlant de niches → hors-sujet → faible conversion.

---

## 1. Séquence email dédiée expatriés (priorité)

**Backend — `funnel-capture-lead`**
- Mapper le `lead_magnet` reçu vers un `sequence_name` :
  - `publier-kdp-etranger` → `expat_funnel`
  - autres / défaut → `promo_funnel`
- Enregistrer ce `sequence_name` dans l'upsert `email_sequences`.

**Backend — `email-sequence-cron`**
- Remplacer la séquence unique par un dictionnaire `SEQUENCES[sequence_name]`.
- Lire `sequence.sequence_name` pour choisir la bonne suite d'emails et le bon contenu.
- Sécuriser : si `sequence_name` inconnu → repli sur `promo_funnel`.

**Contenu — nouvelle séquence `expat_funnel`** (6 emails, signés Georges, ton rassurant "depuis votre pays") :
- J0 : livraison du guide PDF "Publier sur KDP depuis l'étranger" + bienvenue
- J1 : « Oui, KDP fonctionne depuis la Suisse / Belgique / Canada » (lève l'objection n°1)
- J3 : « Comment vous êtes payé à l'étranger (CHF, EUR, CAD) » + le tax interview simplifié
- J5 : preuve / cas concret d'un auteur francophone expatrié + démo EbookStudio
- J7 : l'offre 67€ à vie, pourquoi c'est adapté aux expatriés (100% français, pas de trad)
- J14 : relance finale avec urgence douce

Chaque email pointe vers `/creer-ebook-kdp-etranger` et `/offres`.

## 2. Mieux convertir les curieux (anonymes → inscrits)
- Sur `/creer-ebook-kdp-etranger`, rendre le bloc de capture plus visible : le remonter au-dessus de la ligne de flottaison (juste après le hero) en plus de sa position actuelle.
- Adapter le pop-up de sortie (`LeadCapturePopup`) pour proposer le **guide expatriés** quand le visiteur est sur cette page (au lieu du guide générique 10 niches), via détection du `pathname`.
- Ajouter une preuve sociale courte (drapeaux + « déjà X auteurs francophones à l'étranger ») près du formulaire.

## 3. Tableau de bord prospects (page `/n`, admin)
La page existe (`ProspectManagerPage`, protégée admin). Ajout d'une vue dédiée aux leads :
- Lire `funnel_leads` joint à `email_sequences` : email, pays/segment (déduit du `sequence_name` + `lead_magnet`), date, source UTM, étape de séquence atteinte, guide envoyé ou non.
- Filtres : segment (expatriés / général), statut séquence (en cours / terminée / désinscrit), période.
- Stat cards : total inscrits, % expatriés, en cours de séquence, terminés sans achat.
- Identifier les "prospects chauds" : ceux qui ont ouvert/cliqué (via `email_opens` / `email_clicks`).

## 4. Relancer les non-acheteurs
- À la fin de `expat_funnel` (après J14), au lieu de marquer `completed`, basculer le lead vers une mini-séquence de réactivation `expat_reactivation` (2 emails à J21 et J30) : offre limitée + témoignage, sinon arrêt.
- Exclure automatiquement quiconque a une commande payée (`funnel_orders.status = 'paid'` pour cet email) pour ne pas relancer un client.

---

## Détails techniques
- **Aucune migration lourde** : `email_sequences.sequence_name` existe déjà ; on l'utilise enfin. Optionnel : ajouter une colonne `lead_magnet` à `funnel_leads` pour le reporting (avec GRANT service_role/authenticated).
- Fichiers touchés : `supabase/functions/funnel-capture-lead/index.ts`, `supabase/functions/email-sequence-cron/index.ts` (refactor en multi-séquences), page admin prospects, `LeadCapturePopup.tsx`, `SeoFrancophonesEtrangerPage.tsx`.
- Déploiement des deux edge functions après modification.
- Le cron existant continue de tourner sans changement de planification.

## Hors périmètre
- Pas de version anglaise / i18n (le projet reste 100% français).
- Pas de nouveau provider email (on garde Resend déjà en place).

## Étape de validation
Inscrire un email test via la page expatriés, vérifier dans `email_sequences` que `sequence_name = expat_funnel`, et confirmer dans `email_send` / logs que le 1er email est le bon (guide expatriés, pas 10 niches).
