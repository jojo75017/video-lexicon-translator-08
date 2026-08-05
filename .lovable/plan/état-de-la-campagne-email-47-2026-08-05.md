# État de la campagne email 47 €

## Réponse courte : OUI, la campagne est lancée.

### Éléments vérifiés
- `src/data/canonicalEmailCampaign.ts` : `status = 'active'` et `sendingBlocked = false`.
- `supabase/functions/send-sales-email/index.ts` : moteur déployé et `active: true`.
- Table `sales_prospects` : 647 prospects actuellement en `status = 'active'` et `auto_send = true`.
- Table `email_send_log` : envois récents de `offre-47-unique-1` (nouveau modèle canonique) enregistrés le 5 août 2026.

### Prochaines étapes proposées
1. **Surveillance** : consulter l'onglet **Gestion Prospects** → suivi des emails pour voir le nombre de Step 1 envoyés aujourd'hui.
2. **Planification** : envoi du Step 2 prévu J+2 (7 août 2026) si le délai de la séquence est respecté.
3. **Vérification délivrabilité** : s'assurer que les emails atteignent la boîte de réception (pas uniquement spam).

### Option de contrôle immédiat
Lancer un appel admin `/send-sales-email` en mode `status` pour obtenir le nombre exact d'emails envoyés aujourd'hui et vérifier que tout roule.
