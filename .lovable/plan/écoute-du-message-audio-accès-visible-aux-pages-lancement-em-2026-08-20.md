# Écoute du message audio + accès visible aux pages Lancement & Emails

## Ce qui se passe aujourd'hui
- Le lien audio que vous venez de fournir (image2url) répond correctement (fichier MP3 de 4 Mo, accessible publiquement). Le réglage actuel du site pointe encore vers l'ancien fichier hébergé dans le stockage interne, qui n'est pas public : c'est pourquoi rien ne se lit.
- Les pages existent bel et bien mais aucun bouton ne mène vers elles depuis le tableau de bord admin : `/admin/lancement` (pilotage du lancement), `/gestion-prospects` (base emails + envois), `/apercu-emails` (aperçu des emails), `/essai`, `/v3/attente`, `/message`.

## Ce que je vais faire

### 1. Rendre le message audio écoutable partout
- Enregistrer le nouveau lien MP3 (image2url) comme média de lancement, en mode « audio ».
- Vérifier la lecture sur : `/message`, `/essai`, `/v3/attente`, page d'accueil V3 et `/commander`.
- Ajouter un bouton « Télécharger le MP3 » à côté du lecteur, au cas où le navigateur bloque la lecture.

### 2. Un bloc « Lancement & Emails » bien visible dans l'admin
Nouveau panneau en haut du tableau de bord admin, avec 6 tuiles cliquables :
- Pilotage du lancement (`/admin/lancement`) — audio, dates, interrupteurs
- Base emails & envois (`/gestion-prospects`)
- Aperçu des emails (`/apercu-emails`)
- Salle d'attente fondateurs (`/v3/attente`)
- Essai gratuit chapitre 1 (`/essai`)
- Page du message audio (`/message`)

### 3. Accès depuis la barre latérale V3 (admin uniquement)
Une section « Admin — Lancement » repliable dans la barre latérale, visible seulement pour vous, avec les mêmes raccourcis, pour ne plus jamais chercher ces pages.

### 4. Vérification
- Écoute réelle du MP3 depuis `/message` et depuis l'admin.
- Contrôle que chaque tuile ouvre la bonne page sans retomber sur la page de vente.

## Détails techniques
- Mise à jour de la ligne `launch_settings.launch_video` : `{ enabled: true, url: <lien image2url>, kind: 'audio' }`.
- `LaunchVideoBlock` : ajout d'un lien de téléchargement et d'un message d'erreur clair si le fichier ne se charge pas.
- `AdminPage.tsx` : nouveau composant `AdminLaunchQuickLinks` (tuiles).
- `V3Sidebar.tsx` : section admin conditionnée par `useIsAdmin`.
- `/admin/lancement` sera protégé par `AdminGate` comme les autres pages admin.

## 5. Lancer la première vague d'emails (partie 1)
- Séquence `fin-47-lancement-v3-2026`, email n°1 (annonce : 47 € jusqu'au 31 août + lancement V3 le 1er octobre, 1er mois offert).
- Cible : les 627 prospects à l'étape 0, non désabonnés.
- Envoi par lots (pour éviter les erreurs de taille de requête), puis planification automatique des emails suivants selon le calendrier J+3 / J+3 / J+2 / J+2.
- Le lien « Écouter le message (1 min 40) » vers `/message` sera inclus dans l'email, avec le nouveau MP3.
- Après l'envoi : tableau de statut par destinataire (envoyé / en attente / erreur) visible dans `/gestion-prospects`.
