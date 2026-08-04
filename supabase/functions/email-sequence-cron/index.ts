import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ──────────────────────────────────────────────
// Helpers de mise en forme
// ──────────────────────────────────────────────
const btn = (href: string, label: string, bg = '#008296') =>
  `<p style="text-align:center;margin:28px 0;"><a href="${href}" style="display:inline-block;background:${bg};color:#fff;padding:15px 32px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">${label}</a></p>`;

const wrap = (inner: string) =>
  `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#232F3E;">${inner}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">
    <p style="color:#9ca3af;font-size:12px;text-align:center;">EbookStudio · <a href="https://ebookstudio.fr/faq" style="color:#9ca3af;">FAQ</a> · Pour ne plus recevoir ces emails, répondez "STOP".</p>
  </div>`;

type SeqStep = { step: number; daysAfter: number; subject: string };
type Sequence = {
  steps: SeqStep[];
  emails: string[];
  // relative = planification basée sur "maintenant" (relances) plutôt que sur la date d'inscription
  relative?: boolean;
  // séquence enchaînée quand celle-ci se termine sans achat
  chainTo?: string;
};

// ══════════════════════════════════════════════
// Liens communs
// ══════════════════════════════════════════════
const OFFRE = "https://www.ebookstudio.fr/offres";
const EXPAT_PAGE = "https://www.ebookstudio.fr/creer-ebook-kdp-etranger";
const PDF_5_NICHES = "https://www.ebookstudio.fr/lead-magnets/5-niches-rentables-2026.pdf";
const PDF_GUIDE_EBOOKSTUDIO = "https://www.ebookstudio.fr/lead-magnets/guide-generateur-ebookstudio-principal.pdf";
const PDF_EXPAT = "https://www.ebookstudio.fr/lead-magnets/guide-publier-kdp-etranger.pdf";

// ══════════════════════════════════════════════
// SÉQUENCE 1 — promo générique (offre 59€ + 2 cadeaux)
// ══════════════════════════════════════════════
const PROMO_STEPS: SeqStep[] = [
  { step: 0, daysAfter: 0, subject: "🎁 Vos 2 cadeaux : Guide EbookStudio + 5 Niches KDP rentables 2026" },
  { step: 1, daysAfter: 1, subject: "Comment j'écris un livre complet en 2 heures (démo)" },
  { step: 2, daysAfter: 3, subject: "150 pages en 2 jours — mon dernier résultat KDP" },
  { step: 3, daysAfter: 5, subject: "\"C'est trop beau pour être vrai ?\" Ma réponse honnête" },
  { step: 4, daysAfter: 7, subject: "⏰ Offre 59€ à vie — elle peut s'arrêter d'un jour à l'autre" },
  { step: 5, daysAfter: 14, subject: "🎯 Dernière relance : 59€ à vie + garantie 30 jours" },
];

const PROMO_EMAILS: string[] = [
  // Email 1 — J+0 : livraison des 2 cadeaux
  wrap(`
    <p>Bonjour,</p>
    <p>Merci de votre intérêt pour l'auto-édition sur Amazon KDP ! Pour vous remercier, voici <strong>2 cadeaux</strong> à télécharger tout de suite :</p>

    <div style="background:#e6f4f5;border-left:4px solid #008296;padding:18px;border-radius:8px;margin:18px 0;">
      <h3 style="margin:0 0 8px 0;color:#008296;">📘 Guide EbookStudio</h3>
      <p style="margin:0 0 12px 0;">Comment créer et publier un livre complet sur Amazon KDP grâce à l'IA, de A à Z.</p>
      <a href="${PDF_GUIDE_EBOOKSTUDIO}" style="color:#008296;font-weight:bold;">📥 Télécharger le guide EbookStudio</a>
    </div>

    <div style="background:#fff7ed;border-left:4px solid #FF9E2D;padding:18px;border-radius:8px;margin:18px 0;">
      <h3 style="margin:0 0 8px 0;color:#FF9E2D;">🎯 5 Niches KDP rentables en 2026</h3>
      <p style="margin:0 0 12px 0;">Les 5 thématiques qui se vendent le mieux cette année, avec exemples concrets.</p>
      <a href="${PDF_5_NICHES}" style="color:#FF9E2D;font-weight:bold;">📥 Télécharger les 5 niches rentables</a>
    </div>

    <p>À très vite,<br><strong>Georges</strong></p>
    <p style="color:#666;font-size:13px;">PS : Demain, je vous montre comment j'écris un livre complet en 2 heures.</p>
  `),

  // Email 2 — J+1 : démo méthode
  wrap(`
    <p>Bonjour,</p>
    <p>Hier je vous ai envoyé le guide EbookStudio + les 5 niches rentables. Les avez-vous téléchargés ?</p>
    <p>👉 Si non : <a href="${PDF_GUIDE_EBOOKSTUDIO}">Guide EbookStudio</a> · <a href="${PDF_5_NICHES}">5 Niches rentables</a></p>

    <p>Aujourd'hui, je vous montre <strong>comment j'écris un livre complet en environ 2 heures</strong>, chapitre par chapitre :</p>
    <ol>
      <li>J'entre mon sujet et mon audience (5 min)</li>
      <li>L'IA génère un plan éditorial complet (2 min)</li>
      <li>Chaque chapitre est rédigé automatiquement</li>
      <li>Je génère une couverture pro en 1 clic</li>
      <li>Export au format Amazon KDP direct</li>
    </ol>

    <p>Tout ça est dans <strong>EbookStudio</strong>, actuellement à <strong>59€ à vie</strong> (offre limitée, peut s'arrêter d'un jour à l'autre).</p>

    ${btn(OFFRE, "👉 Découvrir EbookStudio (59€ à vie)", "#008296")}

    <p>À demain pour un cas concret,<br><strong>Georges</strong></p>
  `),

  // Email 3 — J+3 : cas concret
  wrap(`
    <p>Bonjour,</p>
    <p>Je voulais vous montrer ce que j'ai fait la semaine dernière :</p>

    <div style="background:#fff7ed;border:2px solid #FF9E2D;padding:20px;border-radius:12px;margin:20px 0;text-align:center;">
      <h2 style="color:#FF9E2D;margin:0;">📚 150 pages en 2 jours</h2>
      <p style="margin:10px 0 0 0;">Mon dernier ebook créé de A à Z avec EbookStudio.</p>
    </div>

    <p>Pas en travaillant 12h/jour. En utilisant EbookStudio quelques heures, laissant l'IA rédiger, puis relisant.</p>
    <p><strong>Total : 2 jours au lieu de 2 mois.</strong></p>

    ${btn(OFFRE, "👉 Tester EbookStudio (59€ à vie)", "#008296")}

    <p>L'offre à 59€ est temporaire et peut s'arrêter d'un jour à l'autre.</p>
    <p><strong>Georges</strong></p>
  `),

  // Email 4 — J+5 : lever les objections
  wrap(`
    <p>Bonjour,</p>
    <p>Je reçois souvent cette question :<br><em>« Georges, c'est vraiment possible d'écrire un livre aussi vite ? »</em></p>
    <p><strong>Ma réponse honnête : oui</strong>, mais avec les bons outils. Avant EbookStudio, je passais des semaines sur chaque livre. Maintenant, c'est une question de jours.</p>

    <p>Pour lever tout doute, chaque achat est couvert par :</p>

    <div style="background:#ecfdf5;border:2px solid #10b981;padding:20px;border-radius:10px;margin:20px 0;text-align:center;">
      <h3 style="color:#059669;margin:0;">🛡️ GARANTIE 30 JOURS</h3>
      <p style="margin:10px 0 0 0;">Satisfait ou remboursé, sans question posée.</p>
    </div>

    ${btn(OFFRE, "👉 Essayer sans risque (59€ à vie)", "#008296")}

    <p>À bientôt,<br><strong>Georges</strong></p>
    <p style="color:#666;font-size:13px;">PS : Les 2 cadeaux (Guide EbookStudio + 5 Niches) restent disponibles gratuitement.</p>
  `),

  // Email 5 — J+7 : urgence prix
  wrap(`
    <p>Bonjour,</p>
    <p>Petit rappel important : l'offre à <strong>59€ à vie</strong> sur EbookStudio est <strong>temporaire</strong>. Elle peut s'arrêter d'un jour à l'autre — le tarif normal est de 197€.</p>

    <div style="background:#fef3c7;border:2px solid #f59e0b;padding:20px;border-radius:10px;margin:20px 0;">
      <h3 style="color:#d97706;margin:0 0 12px 0;">Pour 59€ (paiement unique, accès à vie) :</h3>
      <ul style="margin:0;padding-left:20px;">
        <li>✅ Générateur d'ebooks illimité</li>
        <li>✅ Couvertures professionnelles incluses</li>
        <li>✅ Export Amazon KDP direct</li>
        <li>✅ Optimisation mots-clés Amazon</li>
        <li>✅ Toutes les mises à jour futures</li>
        <li>✅ Support inclus</li>
      </ul>
    </div>

    ${btn(OFFRE, "👉 Je profite de l'offre 59€ à vie", "#FF9E2D")}

    <p>Merci de m'avoir lu,<br><strong>Georges</strong></p>
    <p style="color:#666;font-size:13px;">PS : Une question ? Répondez simplement à cet email.</p>
  `),

  // Email 6 — J+14 : dernière relance
  wrap(`
    <p>Bonjour,</p>
    <p>Cela fait 2 semaines que vous avez récupéré mes cadeaux (guide EbookStudio + 5 niches).</p>
    <p><strong>Avez-vous lancé votre premier ebook ?</strong> Si ce n'est pas encore fait, c'est vraiment le bon moment.</p>

    <div style="background:#fff7ed;border:2px solid #FF9E2D;padding:22px;border-radius:12px;margin:20px 0;text-align:center;">
      <h2 style="margin:0;color:#FF9E2D;">🎯 EbookStudio — 59€ à vie</h2>
      <p style="margin:10px 0 0 0;">Offre limitée · Garantie 30 jours satisfait ou remboursé</p>
    </div>

    ${btn(OFFRE, "👉 J'en profite maintenant", "#FF9E2D")}

    <p>C'est ma dernière relance à ce prix. Après ça, je ne vous embêterai plus.</p>
    <p>À bientôt j'espère,<br><strong>Georges</strong></p>
  `),
];

// ══════════════════════════════════════════════
// SÉQUENCE 2 — francophones expatriés (CH/BE/LU/DE/CA)
// ══════════════════════════════════════════════

const EXPAT_STEPS: SeqStep[] = [
  { step: 0, daysAfter: 0, subject: "🌍 Votre guide : publier sur Amazon KDP depuis l'étranger (PDF)" },
  { step: 1, daysAfter: 1, subject: "Oui, KDP fonctionne depuis la Suisse, la Belgique ou le Canada" },
  { step: 2, daysAfter: 3, subject: "Comment êtes-vous payé à l'étranger (CHF, EUR, CAD) ?" },
  { step: 3, daysAfter: 5, subject: "Un auteur francophone, expatrié comme vous (cas concret)" },
  { step: 4, daysAfter: 7, subject: "100% en français, où que vous viviez — 59€ à vie" },
  { step: 5, daysAfter: 14, subject: "⏰ Dernière chance : l'offre 59€ peut s'arrêter" },
];

const EXPAT_EMAILS: string[] = [
  // J+0 — livraison du guide + bonus 5 niches
  wrap(`
    <p>Bonjour,</p>
    <p>Merci ! Voici votre guide gratuit pour <strong>créer et vendre un ebook en français depuis votre pays de résidence</strong>.</p>

    <div style="background:#e6f4f5;border-left:4px solid #008296;padding:18px;border-radius:8px;margin:20px 0;">
      <h3 style="margin:0 0 8px 0;color:#008296;">🌍 Publier sur Amazon KDP depuis l'étranger</h3>
      <p style="margin:0 0 12px 0;">Créer votre compte KDP, être payé localement, le tax interview expliqué simplement.</p>
      <a href="${PDF_EXPAT}" style="color:#008296;font-weight:bold;">📥 Télécharger le guide</a>
    </div>

    <div style="background:#fff7ed;border-left:4px solid #FF9E2D;padding:18px;border-radius:8px;margin:20px 0;">
      <h3 style="margin:0 0 8px 0;color:#FF9E2D;">🎁 BONUS : 5 Niches KDP rentables en 2026</h3>
      <p style="margin:0 0 12px 0;">En cadeau supplémentaire, les niches qui marchent le mieux cette année.</p>
      <a href="${PDF_5_NICHES}" style="color:#FF9E2D;font-weight:bold;">📥 Télécharger les 5 niches</a>
    </div>

    <p>100% en français, où que vous viviez.<br><strong>Georges</strong></p>
  `),

  // J+1 — objection principale
  wrap(`
    <p>Bonjour,</p>
    <p>La question que me posent presque tous les francophones expatriés :</p>
    <p style="font-style:italic;font-size:18px;color:#008296;">« Est-ce que ça marche vraiment depuis mon pays ? »</p>
    <p><strong>Oui.</strong> Amazon KDP accepte les auteurs du monde entier — pas besoin d'être résident en France ni d'avoir une entreprise française.</p>
    <ul style="color:#16a34a;">
      <li>✅ Vous publiez depuis la Suisse, la Belgique, le Canada… sans contrainte</li>
      <li>✅ Vous vendez à toute la francophonie (France incluse)</li>
      <li>✅ Vous gardez votre adresse et votre compte bancaire locaux</li>
    </ul>
    ${btn(EXPAT_PAGE, "👉 Voir comment ça marche")}
    <p>Demain, je vous explique comment vous êtes payé.<br><strong>Georges</strong></p>
  `),

  // J+3 — paiement + fiscalité
  wrap(`
    <p>Bonjour,</p>
    <p>Parlons argent : <strong>comment êtes-vous payé quand vous vivez à l'étranger ?</strong></p>
    <p>Amazon vire vos royalties directement sur votre compte bancaire local, dans votre devise :</p>
    <ul>
      <li>🇨🇭 En Suisse : virement en CHF</li>
      <li>🇧🇪🇱🇺🇩🇪 En zone euro : virement en EUR</li>
      <li>🇨🇦 Au Canada : virement en CAD</li>
    </ul>
    <p>Et le fameux <strong>« tax interview »</strong> ? Un simple formulaire en ligne (3 min) pour éviter la double imposition US. Le guide vous montre exactement quoi cocher.</p>
    ${btn(PDF_EXPAT, "📥 Relire le guide")}
    <p>À bientôt,<br><strong>Georges</strong></p>
  `),

  // J+5 — preuve + démo
  wrap(`
    <p>Bonjour,</p>
    <p>Je voulais vous montrer ce qu'il est possible de faire, même en vivant loin de la France.</p>
    <div style="background:#fff7ed;border:2px solid #FF9E2D;padding:20px;border-radius:12px;margin:20px 0;text-align:center;">
      <h2 style="margin:0;color:#FF9E2D;">📚 Un livre complet en quelques heures</h2>
      <p style="margin:10px 0 0 0;">Plan éditorial, chapitres rédigés, couverture pro, export Amazon KDP — le tout en français.</p>
    </div>
    <p>EbookStudio fait le gros du travail à votre place. Vous gardez la main sur le contenu, l'IA s'occupe de la structure et de la rédaction.</p>
    ${btn(OFFRE, "👉 Voir la démonstration")}
    <p>Demain, je vous parle de l'offre.<br><strong>Georges</strong></p>
  `),

  // J+7 — offre 59€
  wrap(`
    <p>Bonjour,</p>
    <p>Votre plus gros avantage, en tant qu'expatrié francophone : <strong>tout est en français, de A à Z.</strong></p>
    <div style="background:#e6f4f5;border:2px solid #008296;padding:20px;border-radius:12px;margin:20px 0;">
      <h3 style="margin:0 0 12px 0;color:#008296;">Pour 59€ à vie (paiement unique) :</h3>
      <ul style="margin:0;padding-left:20px;">
        <li>✅ Générateur d'ebooks illimité, 100% français</li>
        <li>✅ Couvertures professionnelles incluses</li>
        <li>✅ Export Amazon KDP direct</li>
        <li>✅ Optimisation des mots-clés Amazon</li>
        <li>✅ Mises à jour et support inclus</li>
      </ul>
    </div>
    ${btn(OFFRE, "👉 Profiter du prix à vie (59€)", "#FF9E2D")}
    <p style="color:#666;font-size:13px;">Offre limitée — peut s'arrêter d'un jour à l'autre.</p>
    <p>Accessible où que vous viviez.<br><strong>Georges</strong></p>
  `),

  // J+14 — relance finale
  wrap(`
    <p>Bonjour,</p>
    <p>Cela fait deux semaines que vous avez récupéré le guide. <strong>Avez-vous lancé votre premier ebook ?</strong></p>
    <p>Si ce n'est pas encore fait, c'est le bon moment : l'accès à vie <strong>59€</strong> est temporaire et peut s'arrêter d'un jour à l'autre.</p>
    <div style="background:#fff7ed;border:2px solid #FF9E2D;padding:20px;border-radius:12px;margin:20px 0;text-align:center;">
      <p style="margin:0;font-size:18px;">Accès à vie EbookStudio</p>
      <p style="margin:8px 0 0 0;font-weight:bold;font-size:24px;color:#FF9E2D;">59€ · Garantie 30 jours</p>
    </div>
    ${btn(OFFRE, "👉 J'en profite maintenant", "#FF9E2D")}
    <p>À bientôt j'espère,<br><strong>Georges</strong></p>
  `),
];

// ══════════════════════════════════════════════
// SÉQUENCE 3 — relance des non-acheteurs expatriés
// ══════════════════════════════════════════════
const EXPAT_REACT_STEPS: SeqStep[] = [
  { step: 0, daysAfter: 0, subject: "Une dernière idée pour votre projet de livre 📖" },
  { step: 1, daysAfter: 9, subject: "🎁 Offre 59€ à vie — elle peut s'arrêter" },
];

const EXPAT_REACT_EMAILS: string[] = [
  wrap(`
    <p>Bonjour,</p>
    <p>Je ne veux pas vous harceler — c'est l'un de mes derniers emails.</p>
    <p>Beaucoup d'auteurs francophones à l'étranger me disent la même chose : « j'aurais aimé commencer plus tôt ». Le seul vrai obstacle, c'est de se lancer.</p>
    <p>Avec EbookStudio, votre premier livre peut être prêt ce week-end, en français, prêt pour Amazon.</p>
    ${btn(OFFRE, "👉 Reprendre mon projet")}
    <p><strong>Georges</strong></p>
  `),
  wrap(`
    <p>Bonjour,</p>
    <p>Pour vous remercier de votre patience, un rappel de l'<strong>offre en cours</strong> :</p>
    <div style="background:#fff7ed;border:2px solid #FF9E2D;padding:22px;border-radius:12px;margin:20px 0;text-align:center;">
      <h2 style="margin:0;color:#FF9E2D;">🎁 Accès à vie — 59€</h2>
      <p style="margin:8px 0 0 0;">Tout EbookStudio, 100% en français, où que vous viviez.</p>
      <p style="margin:12px 0 0 0;font-size:13px;color:#C2410C;">⏳ Offre limitée — peut s'arrêter d'un jour à l'autre</p>
    </div>
    ${btn(OFFRE, "👉 J'en profite (59€ à vie)", "#FF9E2D")}
    <p>Après ça, je ne reviendrai plus vers vous à ce sujet. Merci de m'avoir lu,<br><strong>Georges</strong></p>
  `),
];

const SEQUENCES: Record<string, Sequence> = {
  promo_funnel: { steps: PROMO_STEPS, emails: PROMO_EMAILS },
  expat_funnel: { steps: EXPAT_STEPS, emails: EXPAT_EMAILS, chainTo: 'expat_reactivation' },
  expat_reactivation: { steps: EXPAT_REACT_STEPS, emails: EXPAT_REACT_EMAILS, relative: true },
};

const DEFAULT_SEQUENCE = 'promo_funnel';

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Ancien moteur marketing neutralisé. Les séquences historiques restent en
  // base pour l'audit mais aucun envoi automatique ne doit repartir.
  return new Response(JSON.stringify({ success: true, disabled: true, processed: 0, sent: 0 }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

  /* Legacy implementation retained temporarily for audit history.
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date();
    console.log(`[CRON] Running email sequence at ${now.toISOString()}`);

    const { data: pendingEmails, error: fetchError } = await supabaseAdmin
      .from('email_sequences')
      .select('*')
      .eq('completed', false)
      .eq('unsubscribed', false)
      .lte('next_email_at', now.toISOString())
      .limit(50);

    if (fetchError) {
      console.error('Error fetching pending emails:', fetchError);
      throw fetchError;
    }

    console.log(`[CRON] Found ${pendingEmails?.length || 0} emails to send`);

    let sentCount = 0;
    let errorCount = 0;

    for (const sequence of pendingEmails || []) {
      try {
        const seqName = sequence.sequence_name && SEQUENCES[sequence.sequence_name]
          ? sequence.sequence_name
          : DEFAULT_SEQUENCE;
        const seq = SEQUENCES[seqName];

        const currentStep = sequence.current_step;
        const emailConfig = seq.steps[currentStep];

        if (!emailConfig) {
          await supabaseAdmin
            .from('email_sequences')
            .update({ completed: true, updated_at: now.toISOString() })
            .eq('id', sequence.id);
          continue;
        }

        const emailHtml = seq.emails[currentStep] || seq.emails[0];

        const { error: sendError } = await resend.emails.send({
          from: "EbookStudio Pro <noreply@ebookstudio.fr>",
          to: [sequence.email],
          subject: emailConfig.subject,
          html: emailHtml,
        });

        if (sendError) {
          console.error(`Error sending email to ${sequence.email}:`, sendError);
          errorCount++;
          continue;
        }

        console.log(`[CRON] Sent ${seqName} step ${currentStep + 1}/${seq.steps.length} to ${sequence.email}`);
        sentCount++;

        const nextStep = currentStep + 1;
        const nextEmailConfig = seq.steps[nextStep];

        let nextEmailAt: Date | null = null;
        let completed = false;
        let newSequenceName: string | null = null;
        let newCurrentStep: number = nextStep;

        if (nextEmailConfig) {
          // Planification du prochain email de la même séquence
          if (seq.relative) {
            const gap = nextEmailConfig.daysAfter - emailConfig.daysAfter;
            nextEmailAt = new Date(now);
            nextEmailAt.setDate(nextEmailAt.getDate() + gap);
            nextEmailAt.setHours(9, 0, 0, 0);
          } else {
            nextEmailAt = new Date(sequence.subscribed_at);
            nextEmailAt.setDate(nextEmailAt.getDate() + nextEmailConfig.daysAfter);
            nextEmailAt.setHours(9, 0, 0, 0);

            // Accélération si le prospect n'a pas cliqué
            try {
              const { count: clickCount } = await supabaseAdmin
                .from('email_clicks')
                .select('id', { count: 'exact', head: true })
                .eq('prospect_email', sequence.email);
              const hasClicked = (clickCount || 0) > 0;
              if (!hasClicked) {
                const accelerated = new Date(now);
                accelerated.setDate(accelerated.getDate() + 1);
                accelerated.setHours(9, 0, 0, 0);
                if (accelerated < nextEmailAt) {
                  console.log(`[CRON] Non-cliqueur ${sequence.email} → relance accélérée étape ${nextStep + 1}`);
                  nextEmailAt = accelerated;
                }
              }
            } catch (clickErr) {
              console.error('Erreur vérification clics (accélération):', clickErr);
            }
          }
        } else if (seq.chainTo && SEQUENCES[seq.chainTo]) {
          // Fin de séquence → relance des non-acheteurs (sauf si déjà client)
          let hasPaid = false;
          try {
            const { count: paidCount } = await supabaseAdmin
              .from('funnel_orders')
              .select('id', { count: 'exact', head: true })
              .ilike('email', sequence.email)
              .eq('status', 'paid');
            hasPaid = (paidCount || 0) > 0;
          } catch (payErr) {
            console.error('Erreur vérification commande payée:', payErr);
          }

          if (hasPaid) {
            completed = true;
          } else {
            newSequenceName = seq.chainTo;
            newCurrentStep = 0;
            nextEmailAt = new Date(now);
            nextEmailAt.setDate(nextEmailAt.getDate() + 7); // ~J21
            nextEmailAt.setHours(9, 0, 0, 0);
          }
        } else {
          completed = true;
        }

        const updatePayload: Record<string, unknown> = {
          current_step: newCurrentStep,
          last_email_sent_at: now.toISOString(),
          next_email_at: nextEmailAt?.toISOString() || null,
          completed,
          updated_at: now.toISOString(),
        };
        if (newSequenceName) updatePayload.sequence_name = newSequenceName;

        await supabaseAdmin
          .from('email_sequences')
          .update(updatePayload)
          .eq('id', sequence.id);

      } catch (emailError) {
        console.error(`Error processing sequence ${sequence.id}:`, emailError);
        errorCount++;
      }
    }

    const result = {
      success: true,
      processed: pendingEmails?.length || 0,
      sent: sentCount,
      errors: errorCount,
      timestamp: now.toISOString(),
    };

    console.log('[CRON] Result:', result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in email-sequence-cron:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  */
};

serve(handler);
