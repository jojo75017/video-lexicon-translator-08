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
// SÉQUENCE 1 — promo générique (10 niches)
// ══════════════════════════════════════════════
const PROMO_STEPS: SeqStep[] = [
  { step: 0, daysAfter: 0, subject: "🎁 Votre cadeau : 10 Niches KDP Rentables (PDF 40 pages)" },
  { step: 1, daysAfter: 1, subject: "Pourquoi 90% des auteurs abandonnent (et comment éviter ça)" },
  { step: 2, daysAfter: 3, subject: "150 pages en 2 jours (mon dernier résultat)" },
  { step: 3, daysAfter: 5, subject: "\"C'est trop beau pour être vrai ?\" (Ma réponse honnête)" },
  { step: 4, daysAfter: 7, subject: "⏰ Dernière chance : le prix augmente bientôt" },
  { step: 5, daysAfter: 14, subject: "🎯 Une opportunité exclusive pour vous (valable 48h)" },
];

const PROMO_EMAILS: string[] = [
  // Email 1 - J+0
  `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Bonjour,</p>
    <p>Merci de votre intérêt pour l'auto-édition sur Amazon KDP !</p>
    <p>Pour vous remercier, j'ai préparé un cadeau spécial :</p>
    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0;">📘 "10 Niches KDP Rentables en 2025"</h3>
      <p style="margin: 0;">Un guide PDF de 40+ pages avec les niches les plus lucratives et un plan d'action concret.</p>
    </div>
    <p style="text-align: center;">
      <a href="https://ebookstudio.fr/offres" style="display: inline-block; background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">👉 Récupérez votre cadeau ici</a>
    </p>
    <p>À très vite,<br><strong>Georges</strong></p>
    <p style="color: #666; font-size: 14px;">PS : Ce guide m'a pris 3 semaines à créer. Il est offert, profitez-en !</p>
  </div>`,
  // Email 2 - J+1
  `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Bonjour,</p>
    <p>Hier, je vous ai envoyé le guide des 10 niches rentables. L'avez-vous téléchargé ?</p>
    <p>👉 Si non : <a href="https://ebookstudio.fr/offres">https://ebookstudio.fr/offres</a></p>
    <p>Aujourd'hui, parlons d'un problème que je connais trop bien...</p>
    <ul style="color: #dc2626;">
      <li>❌ La page blanche</li>
      <li>❌ Les semaines de rédaction</li>
      <li>❌ Les couvertures qui coûtent 100€+</li>
      <li>❌ L'optimisation Amazon qu'on ne comprend pas</li>
    </ul>
    <p><strong>Résultat ?</strong> 90% des aspirants auteurs abandonnent avant de publier.</p>
    <p>J'ai créé <strong>EbookStudio Pro</strong> pour résoudre ce problème.</p>
    <ul style="color: #16a34a;">
      <li>✅ Structurer votre livre automatiquement</li>
      <li>✅ Rédiger chaque chapitre pour vous</li>
      <li>✅ Créer des couvertures pro en 1 clic</li>
      <li>✅ Optimiser vos mots-clés Amazon</li>
    </ul>
    <p>Le tout pour <strong>67€ une seule fois</strong> (accès à vie).</p>
    <p style="text-align: center;">
      <a href="https://ebookstudio.fr/offres" style="display: inline-block; background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">👉 Découvrez comment ça marche</a>
    </p>
    <p>À demain pour un cas concret,<br><strong>Georges</strong></p>
  </div>`,
  // Email 3 - J+3
  `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Bonjour,</p>
    <p>Je voulais vous montrer ce que j'ai fait la semaine dernière...</p>
    <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
      <h2 style="color: #8b5cf6; margin: 0;">📚 150 pages en 2 jours</h2>
      <p style="margin: 10px 0 0 0;">Mon dernier ebook créé avec EbookStudio Pro</p>
    </div>
    <p>Pas en travaillant 12h/jour. En utilisant EbookStudio Pro pendant quelques heures.</p>
    <p><strong>Voici le processus :</strong></p>
    <ol>
      <li>J'entre mon sujet et mon audience (5 min)</li>
      <li>L'IA génère un plan éditorial complet (2 min)</li>
      <li>Chaque chapitre est rédigé automatiquement (1h)</li>
      <li>Je génère une couverture pro (1 min)</li>
      <li>Export au format Amazon KDP (1 clic)</li>
    </ol>
    <p><strong>Total : 2 jours au lieu de 2 mois.</strong></p>
    <p style="text-align: center;">
      <a href="https://ebookstudio.fr/offres" style="display: inline-block; background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">👉 Testez par vous-même</a>
    </p>
    <p>Le prix de lancement à 67€ ne durera pas éternellement.</p>
    <p><strong>Georges</strong></p>
    <p style="color: #666; font-size: 14px;">PS : N'oubliez pas de récupérer le guide gratuit sur la page !</p>
  </div>`,
  // Email 4 - J+5
  `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Bonjour,</p>
    <p>Je reçois souvent cette question :<br><em>"Georges, c'est vraiment possible de créer un ebook si vite ?"</em></p>
    <p><strong>Ma réponse honnête : OUI</strong>, mais avec les bons outils.</p>
    <p>Avant EbookStudio Pro, je passais des semaines sur chaque livre. Maintenant, c'est une question de jours.</p>
    <p>Mais je comprends vos doutes. C'est pourquoi j'offre :</p>
    <div style="background: #ecfdf5; border: 2px solid #10b981; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
      <h3 style="color: #059669; margin: 0;">🛡️ GARANTIE 30 JOURS</h3>
      <p style="margin: 10px 0 0 0;">Satisfait ou Remboursé - Sans question posée</p>
    </div>
    <p>Vous ne risquez absolument rien.</p>
    <p style="text-align: center;">
      <a href="https://ebookstudio.fr/offres" style="display: inline-block; background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">👉 Essayez sans risque</a>
    </p>
    <p>À bientôt,<br><strong>Georges</strong></p>
    <p style="color: #666; font-size: 14px;">PS : Le guide "10 Niches KDP Rentables" est toujours disponible gratuitement sur la page.</p>
  </div>`,
  // Email 5 - J+7
  `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Bonjour,</p>
    <p>C'est mon dernier email de cette série.</p>
    <p>Je voulais vous rappeler que le <strong>prix de lancement de 67€ est temporaire</strong>.</p>
    <p>Après le lancement, le prix passera à 147€.</p>
    <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h3 style="color: #d97706; margin: 0 0 15px 0;">Pour 67€, vous obtenez :</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li>✅ Accès à vie au générateur d'ebooks</li>
        <li>✅ Créations illimitées</li>
        <li>✅ Couvertures pro incluses</li>
        <li>✅ Export Amazon KDP direct</li>
        <li>✅ Toutes les mises à jour futures</li>
        <li>✅ Support inclus</li>
        <li>✅ + Le guide "10 Niches KDP" offert</li>
      </ul>
    </div>
    <p style="text-align: center;">
      <a href="https://ebookstudio.fr/offres" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">👉 Profitez du prix de lancement</a>
    </p>
    <p>Après ça, je ne vous embêterai plus avec des emails promotionnels.</p>
    <p>Merci de m'avoir lu,<br><strong>Georges</strong></p>
    <p style="color: #666; font-size: 14px;">PS : Si vous avez la moindre question, répondez simplement à cet email.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      <a href="https://ebookstudio.fr/faq" style="color: #9ca3af;">FAQ</a> | 
      Pour ne plus recevoir ces emails, répondez avec "STOP"
    </p>
  </div>`,
  // Email 6 - J+14
  `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Bonjour,</p>
    <p>Cela fait 2 semaines que vous avez téléchargé notre guide des niches KDP...</p>
    <p>Et je me demandais : <strong>avez-vous enfin lancé votre premier ebook ?</strong></p>
    <p>Si ce n'est pas encore fait, j'ai une offre exclusive pour vous :</p>
    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 25px; border-radius: 15px; margin: 20px 0; text-align: center;">
      <h2 style="margin: 0 0 15px 0; font-size: 24px;">🎯 Offre VIP 48h</h2>
      <p style="margin: 0 0 15px 0; font-size: 18px;">Accès à vie à EbookStudio Pro</p>
      <div style="background: white; color: #8b5cf6; display: inline-block; padding: 10px 25px; border-radius: 10px; font-weight: bold;">
        <span style="text-decoration: line-through; opacity: 0.6;">147€</span> → <span style="font-size: 28px;">67€</span>
      </div>
      <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;">Cette offre expire dans 48 heures</p>
    </div>
    <p><strong>Ce qui vous attend :</strong></p>
    <ul style="color: #16a34a;">
      <li>✅ Votre premier ebook créé en quelques heures</li>
      <li>✅ Une couverture professionnelle générée par IA</li>
      <li>✅ Tout optimisé pour Amazon KDP</li>
      <li>✅ Formation complète incluse</li>
    </ul>
    <p style="text-align: center; margin: 30px 0;">
      <a href="https://ebookstudio.fr/offres" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">👉 Profiter de l'offre VIP</a>
    </p>
    <p>C'est vraiment ma dernière proposition à ce prix.</p>
    <p>À bientôt j'espère,<br><strong>Georges</strong></p>
    <p style="color: #666; font-size: 14px;">PS : Garantie satisfait ou remboursé 30 jours, vous ne risquez rien.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      <a href="https://ebookstudio.fr/faq" style="color: #9ca3af;">FAQ</a> | 
      Pour ne plus recevoir ces emails, répondez avec "STOP"
    </p>
  </div>`,
];

// ══════════════════════════════════════════════
// SÉQUENCE 2 — francophones expatriés (CH/BE/LU/DE/CA)
// ══════════════════════════════════════════════
const EXPAT_PAGE = "https://ebookstudio.fr/creer-ebook-kdp-etranger";
const OFFRE = "https://ebookstudio.fr/offres";

const EXPAT_STEPS: SeqStep[] = [
  { step: 0, daysAfter: 0, subject: "🌍 Votre guide : publier sur Amazon KDP depuis l'étranger (PDF)" },
  { step: 1, daysAfter: 1, subject: "Oui, KDP fonctionne depuis la Suisse, la Belgique ou le Canada" },
  { step: 2, daysAfter: 3, subject: "Comment êtes-vous payé à l'étranger (CHF, EUR, CAD) ?" },
  { step: 3, daysAfter: 5, subject: "Un auteur francophone, expatrié comme vous (cas concret)" },
  { step: 4, daysAfter: 7, subject: "100% en français, où que vous viviez — 67€ à vie" },
  { step: 5, daysAfter: 14, subject: "⏰ Dernière chance avant la hausse de prix" },
];

const EXPAT_EMAILS: string[] = [
  // J+0 — livraison du guide
  wrap(`
    <p>Bonjour,</p>
    <p>Merci ! Voici votre guide gratuit pour <strong>créer et vendre un ebook en français depuis votre pays de résidence</strong>.</p>
    <div style="background:#e6f4f5;border-left:4px solid #008296;padding:18px;border-radius:8px;margin:20px 0;">
      <h3 style="margin:0 0 8px 0;color:#008296;">🌍 Publier sur Amazon KDP depuis l'étranger</h3>
      <p style="margin:0;">Créer votre compte KDP, être payé localement, le tax interview expliqué simplement, et la checklist avant publication.</p>
    </div>
    ${btn("https://ebookstudio.fr/lead-magnets/guide-publier-kdp-etranger.pdf", "📥 Télécharger mon guide")}
    <p>Que vous viviez en Suisse, en Belgique, au Luxembourg, en Allemagne ou au Canada : la méthode est la même, et tout reste <strong>100% en français</strong>.</p>
    <p>À très vite,<br><strong>Georges</strong></p>
  `),
  // J+1 — lever l'objection n°1
  wrap(`
    <p>Bonjour,</p>
    <p>La question que me posent presque tous les francophones expatriés :</p>
    <p style="font-style:italic;font-size:18px;color:#008296;">« Est-ce que ça marche vraiment depuis mon pays ? »</p>
    <p><strong>Oui.</strong> Amazon KDP accepte les auteurs du monde entier. Vous n'avez pas besoin d'être résident en France, ni d'avoir une entreprise française.</p>
    <ul style="color:#16a34a;">
      <li>✅ Vous publiez depuis la Suisse, la Belgique, le Canada… sans contrainte</li>
      <li>✅ Vous vendez à toute la francophonie (France incluse, le plus gros marché)</li>
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
    <p>Et le fameux <strong>« tax interview »</strong> ? C'est un simple formulaire en ligne (3 minutes) pour éviter la double imposition US. Mon guide vous montre exactement quoi cocher.</p>
    ${btn("https://ebookstudio.fr/lead-magnets/guide-publier-kdp-etranger.pdf", "📥 Relire le guide")}
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
    <p>EbookStudio fait le gros du travail à votre place. Vous gardez la main sur le contenu, l'IA s'occupe de la structure, de la rédaction et de la mise en forme.</p>
    ${btn(OFFRE, "👉 Voir la démonstration")}
    <p>Demain, je vous parle de l'offre.<br><strong>Georges</strong></p>
  `),
  // J+7 — l'offre
  wrap(`
    <p>Bonjour,</p>
    <p>Le plus gros avantage pour vous, expatrié francophone : <strong>tout est en français, de A à Z.</strong> Aucune traduction, aucun outil anglais à dompter.</p>
    <div style="background:#e6f4f5;border:2px solid #008296;padding:20px;border-radius:12px;margin:20px 0;">
      <h3 style="margin:0 0 12px 0;color:#008296;">Pour 67€ une seule fois (accès à vie) :</h3>
      <ul style="margin:0;padding-left:20px;">
        <li>✅ Générateur d'ebooks illimité, 100% français</li>
        <li>✅ Couvertures professionnelles incluses</li>
        <li>✅ Export Amazon KDP direct</li>
        <li>✅ Optimisation des mots-clés Amazon</li>
        <li>✅ Mises à jour et support inclus</li>
      </ul>
    </div>
    ${btn(OFFRE, "👉 Profiter du prix à vie (67€)", "#FF9E2D")}
    <p>Accessible où que vous viviez.<br><strong>Georges</strong></p>
  `),
  // J+14 — relance finale
  wrap(`
    <p>Bonjour,</p>
    <p>Cela fait deux semaines que vous avez récupéré le guide. <strong>Avez-vous lancé votre premier ebook ?</strong></p>
    <p>Si ce n'est pas encore fait, c'est le bon moment : le tarif à vie de <strong>67€</strong> est temporaire et passera ensuite à 147€.</p>
    <div style="background:#fff7ed;border:2px solid #FF9E2D;padding:20px;border-radius:12px;margin:20px 0;text-align:center;">
      <p style="margin:0;font-size:18px;">Accès à vie EbookStudio Pro</p>
      <p style="margin:8px 0 0 0;font-weight:bold;font-size:24px;color:#FF9E2D;"><span style="text-decoration:line-through;opacity:.6;font-size:18px;">147€</span> → 67€</p>
    </div>
    ${btn(OFFRE, "👉 J'en profite maintenant", "#FF9E2D")}
    <p>À bientôt j'espère,<br><strong>Georges</strong></p>
    <p style="color:#666;font-size:14px;">PS : Garantie satisfait ou remboursé 30 jours.</p>
  `),
];

// ══════════════════════════════════════════════
// SÉQUENCE 3 — relance des non-acheteurs expatriés
// ══════════════════════════════════════════════
const EXPAT_REACT_STEPS: SeqStep[] = [
  { step: 0, daysAfter: 0, subject: "Une dernière idée pour votre projet de livre 📖" },
  { step: 1, daysAfter: 9, subject: "🎁 Offre privée 48h pour vous (puis c'est terminé)" },
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
    <p>Pour vous remercier de votre patience, voici une <strong>offre privée valable 48h</strong> :</p>
    <div style="background:#fff7ed;border:2px solid #FF9E2D;padding:22px;border-radius:12px;margin:20px 0;text-align:center;">
      <h2 style="margin:0;color:#FF9E2D;">🎁 Accès à vie — 67€</h2>
      <p style="margin:8px 0 0 0;">Tout EbookStudio Pro, 100% en français, où que vous viviez.</p>
    </div>
    ${btn(OFFRE, "👉 J'en profite (48h)", "#FF9E2D")}
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
};

serve(handler);
