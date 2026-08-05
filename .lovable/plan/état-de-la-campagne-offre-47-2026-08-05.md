# État de la campagne Offre 47 €

## Réponse : OUI, tout est en ligne.

### Éléments confirmés
- **Campagne active** : `ACTIVE_EMAIL_CAMPAIGN.status = 'active'` et `sendingBlocked = false` dans `src/data/canonicalEmailCampaign.ts`.
- **Moteur d'envoi prêt** : `supabase/functions/send-sales-email/index.ts` répond `active: true` et utilise le template canonique `offre-47-unique-1`.
- **Lien de paiement fonctionnel** : `ebookstudio.fr/commander` est la source unique de vérité (`supabase/functions/_shared/checkoutUrl.ts`).
- **PayPal affiché** : la session Stripe pour le paiement unique 1×47 € force explicitement `payment_method_types: card + paypal` (`supabase/functions/v3-pack-checkout/index.ts`).
- **Prix promo appliqué** : le plan `v2_1x` est à 47 € jusqu'au 30 septembre 2026.

### Ce que voit un prospect qui clique
1. Lien tracké dans l'email → redirection vers `/commander?src=offre-47-sequence-2026-1&email=...`.
2. Page `/commander` avec le formulaire email + choix de formule (1× / 2× / 3×).
3. Checkout Stripe embarqué en français, avec **Carte** et **PayPal** disponibles pour le paiement en 1 fois.

### Prochaines étapes proposées
1. **Vérifier l'envoi du Step 1** : consulter l'onglet **Gestion Prospects** pour voir combien d'emails `offre-47-unique-1` ont été envoyés aujourd'hui.
2. **Surveillance délivrabilité** : s'assurer que les emails atterrissent dans la boîte principale (pas spam).
3. **Planifier Step 2** : envoi automatique J+2 (7 août 2026) selon les délais `DELAYS = [0, 2, 3, 2, 3]`.
4. **Contrôle immédiat** : lancer un appel admin `/send-sales-email` en mode `status` pour confirmer le compte d'envois réels.
