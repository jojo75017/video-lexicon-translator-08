## Objectif

Aujourd'hui tu envoies des DM Instagram/TikTok avec un lien → ils tombent dans les "demandes de message" (jamais lus) et tu n'as aucun retour. On résout les 3 points que tu as choisis :

1. **Des messages qui déclenchent une réponse** (DM en 2 temps : pas de lien au 1er message).
2. **Un suivi de tes envois** (mini-CRM : qui contacté, sur quel réseau, qui a répondu/s'est inscrit, quand relancer).
3. **Une page candidature auto-service** (ils s'inscrivent seuls et reçoivent leur lien par email, sans que tu aies à répondre un par un).

Le tout regroupé dans un nouvel onglet **"Recruter"** sur la page `/influenceurs` (visible seulement pour toi).

---

## 1. Pourquoi tes DM ne marchent pas (et la parade)

Sur Instagram/TikTok, un message à un inconnu qui contient un **lien** est filtré : il part dans "Demandes" sans notification, et le lien est souvent grisé. La méthode qui convertit = **DM en 2 temps** :

- **Message 1 (zéro lien)** : court, personnalisé, finit par une question fermée qui demande UNE réaction simple → "réponds-moi **LIVRE** et je t'envoie tout".
- **Message 2 (le lien)** : envoyé seulement quand ils ont répondu → là Instagram t'autorise les liens car la conversation est "acceptée".

Cette mécanique force une **manifestation** de leur part (ton idée d'accusé de réception) et fait sauter le filtre anti-spam.

---

## 2. Scripts DM 2 temps (nouveaux, copiables)

Ajout d'une bibliothèque de scripts dans l'onglet "Recruter", chacun avec bouton Copier :

- **Approche 1 — Compliment + mot-clé** : "Hello [prénom] 👋 ton contenu sur [niche] est top. Je bosse sur un outil qui génère un livre Amazon complet en 30 min avec l'IA, et je cherche 2-3 ambassadeurs (30% par vente). Ça t'intéresse d'en savoir plus ? Réponds-moi **LIVRE** 📚"
- **Approche 2 — Question directe** : "Salut ! Tu monétises déjà ton audience [niche] ? J'ai un programme ambassadeur qui pourrait coller (commission 30%). Je t'envoie le détail si tu réponds **OUI** 🚀"
- **Message 2 (relance avec lien)** : "Super ! Voilà tout : [lien kit + lien perso]. 30% à vie par vente, paiement auto, zéro avance. Dis-moi si tu veux que je te crée ton lien perso ✨"
- **Relance J+3 sans réponse** : "Je remonte mon message au cas où il serait passé dans tes demandes 🙂 toujours partant pour en parler ?"

Les variables (`[prénom]`, `[niche]`, lien) sont remplies via 2 champs en haut de l'onglet, et les scripts se mettent à jour en direct avant copie.

---

## 3. Mini-CRM de suivi des envois

Une nouvelle table en base (`ambassador_outreach`) liée à ton compte, avec une vue type liste/kanban dans l'onglet "Recruter" :

Champs par contact : pseudo/handle, réseau (Instagram/TikTok/Autre), niche, **statut** (À contacter → Message 1 envoyé → A répondu → Inscrit → Pas intéressé), date du dernier contact, **date de relance**, notes.

Fonctions :
- Ajout rapide d'un contact (handle + réseau).
- Changement de statut en 1 clic.
- Mise en évidence des contacts **à relancer** (J+3 sans réponse).
- Compteurs en haut : contactés / réponses / inscrits + **taux de réponse** et **taux de conversion**.

Important : Instagram ne fournit aucun "accusé de lecture" exploitable de l'extérieur — impossible techniquement de savoir s'ils ont *lu*. Le CRM suit donc ce qui est réellement mesurable (envoyé / répondu / inscrit), ce qui est l'info qui compte pour piloter ta prospection.

---

## 4. Page candidature auto-service

Pour arrêter de répondre un par un : un bloc public sur `/influenceurs` (et lien direct partageable) où un créateur entre **email + pseudo + réseau + niche** → il reçoit automatiquement par email son **lien d'affiliation + le kit**, et tu le vois apparaître dans ton CRM en statut "Inscrit".

Réutilise l'edge function existante `send-influencer-invite` (déjà branchée sur Resend) pour l'envoi automatique. La candidature crée aussi son `referral_code` et une ligne dans `ambassador_outreach`.

---

## Détails techniques

- **Table `ambassador_outreach`** (migration) : `id`, `owner_id` (auth.uid), `handle`, `platform`, `niche`, `status`, `last_contact_at`, `follow_up_at`, `notes`, `email` (nullable), `created_at`. GRANTs + RLS (owner-only) ; pour les candidatures auto-service, insertion via l'edge function en `service_role` avec `owner_id` = id admin/fondateur.
- **Edge function** : nouvelle `submit-ambassador-application` (publique, validation Zod) qui : crée le `referral_code`, insère dans `ambassador_outreach` (statut "Inscrit"), puis appelle l'envoi email. Ou extension de `send-influencer-invite`.
- **UI** : nouvel onglet "Recruter" dans `InfluenceursPage.tsx` (gardé derrière un check admin via `has_role`/`adminAccess`), nouveaux composants `AmbassadorOutreachTracker.tsx` et `AmbassadorScripts.tsx`, et un `AmbassadorApplyForm.tsx` public.
- **Pas de fausses données** (respect mémoire) : tous les compteurs viennent des vraies lignes du CRM.

---

## Hors périmètre

- Pas d'envoi automatique de DM Instagram (l'API Instagram ne permet pas le cold DM ; ça resterait manuel — seul le copier-coller est fiable et conforme).
- Pas de scraping de comptes Instagram.