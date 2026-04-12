

## Audit des bugs et problemes restants

Voici la liste complete des problemes identifies dans l'application, classes par gravite.

---

### CRITIQUE — Securite

| # | Probleme | Detail |
|---|----------|--------|
| 1 | **Admin via sessionStorage** | `App.tsx` ligne 96 : le statut admin est stocke dans `sessionStorage.getItem('is_admin')`. Un utilisateur peut ouvrir la console et taper `sessionStorage.setItem('is_admin', 'true')` pour devenir admin. Le `SubscriberGate` rattrape partiellement via une verification serveur, mais le flag initial est exploitable. |
| 2 | **Email admin hardcode** | `App.tsx` ligne 101 : `PERMANENT_ADMIN_EMAIL = 'boubetgeorges@gmail.com'` en clair dans le code source. Visible par n'importe qui dans le bundle JS. |
| 3 | **8 policies RLS trop permissives** | Tables `subscribers`, `referrals`, `payment_confirmations`, `email_opens`, `email_sequences` ont des policies `WITH CHECK (true)` ou `USING (true)` qui permettent a n'importe qui d'inserer/modifier des donnees sans authentification. |
| 4 | **Protection mots de passe fuites desactivee** | Le linter Supabase signale que la protection contre les mots de passe compromis est desactivee. |

---

### MAJEUR — Fonctionnel

| # | Probleme | Detail |
|---|----------|--------|
| 5 | **EbookPlannerPage toujours 3107 lignes** | Fichier monstre avec 47 switch cases. Risque de lenteur et de bugs difficiles a isoler. |
| 6 | **Cle API Gemini stockee en localStorage** | `useOpenAIConfig.ts` : la cle API Gemini de l'utilisateur est en localStorage sans chiffrement. Accessible via XSS ou console. |
| 7 | **Pages SaaS orphelines** | 5 pages SaaS (`SaasDashboard`, `SaasAnalytics`, `SaasBilling`, `SaasSettings`, `SaasAuthPage`) sont importees et routees mais semblent etre un systeme parallele non utilise par les abonnes. |
| 8 | **64 routes dans App.tsx** | Beaucoup de pages de vente/marketing/SEO encore actives alors que la commercialisation est suspendue. |

---

### MOYEN — UX / Performance

| # | Probleme | Detail |
|---|----------|--------|
| 9 | **Safety timer auth 3s** | `App.tsx` ligne 108 : si l'auth prend plus de 3s, l'ecran de chargement disparait et l'utilisateur peut voir un etat intermediaire non authentifie. |
| 10 | **Browserslist obsolete** | Warning dans les logs : `caniuse-lite is 14 months old`. Impacte la compilation CSS/JS. |
| 11 | **TrelloBoardView compteur statique** | Le compteur "Tous les outils (44)" est hardcode — si on ajoute/supprime des outils, il sera faux. |

---

### MINEUR — Code / Dette technique

| # | Probleme | Detail |
|---|----------|--------|
| 12 | **Nommage trompeur** | `useOpenAIConfig` et `openaiApiUtils.ts` gerent en realite Gemini, pas OpenAI. Confusion garantie. |
| 13 | **Workflow data en localStorage** | `useWorkflowSync.ts` : toutes les donnees du workflow sont en localStorage. Limite a ~5MB, pas synchronise entre appareils. |
| 14 | **ModulesDiagnosticService** | Service de monitoring en memoire qui ne persiste rien — les stats sont perdues a chaque refresh. |

---

### Recommandation de priorite

1. **Securite d'abord** : Corriger l'admin sessionStorage (#1), supprimer l'email hardcode (#2), resserrer les RLS (#3)
2. **Stabilite** : Nettoyer les pages SaaS orphelines (#7), reduire les routes (#8)
3. **UX** : Ameliorer le safety timer (#9), rendre le compteur dynamique (#11)
4. **Dette technique** : Renommer les fichiers OpenAI→Gemini (#12), migrer le workflow sync vers la base de donnees (#13)

Voulez-vous que je commence par les corrections de securite, ou par un autre groupe ?

