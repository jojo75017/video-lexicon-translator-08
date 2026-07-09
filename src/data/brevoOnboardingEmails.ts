// Séquence d'onboarding EbookStudio — 8 emails prêts à coller dans Brevo (Automatisations).
// Chaque email est un template HTML autonome, responsive et compatible clients mail.
// Variables Brevo : {{ contact.PRENOM }} (fallback géré côté Brevo si vide).

export interface OnboardingEmail {
  step: number;
  delayLabel: string; // quand l'envoyer dans l'automation Brevo
  subject: string;
  preheader: string;
  html: string;
}

const SITE = "https://ebookstudio.fr";
const TEAL = "#008296";
const AMBER = "#FF9E2D";
const INK = "#232F3E";

const cta = (href: string, label: string, color = AMBER) =>
  `<tr><td align="center" style="padding:26px 0">
    <a href="${href}" style="background:${color};color:#ffffff;padding:15px 34px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;font-family:Arial,Helvetica,sans-serif">${label}</a>
  </td></tr>`;

const shell = (inner: string) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAFAFA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:24px 0">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px -12px rgba(0,0,0,0.12)">
<tr><td style="background:${TEAL};padding:22px 32px">
  <span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:800;color:#ffffff">Ebook<span style="color:${AMBER}">Studio</span></span>
</td></tr>
<tr><td style="padding:32px;font-family:Arial,Helvetica,sans-serif;color:${INK};font-size:16px;line-height:1.6">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${inner}
</table>
</td></tr>
<tr><td style="padding:0 32px 26px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#5b6875;line-height:1.6">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eef1f4;padding-top:18px">
  <tr><td style="padding-top:18px;text-align:center">
    Une question avant de vous lancer ? On en parle 👇<br/><br/>
    <a href="${SITE}/demo" style="display:inline-block;margin:4px 6px;padding:10px 18px;border:1px solid ${TEAL};border-radius:8px;color:${TEAL};text-decoration:none;font-weight:600;font-size:14px">📅 Réserver une démo privée avec Georges</a>
    <a href="mailto:contact@ebookstudio.fr" style="display:inline-block;margin:4px 6px;padding:10px 18px;border:1px solid #d8dee4;border-radius:8px;color:#5b6875;text-decoration:none;font-weight:600;font-size:14px">💬 Répondre directement à cet email</a>
    <div style="margin-top:18px;font-size:13px;color:#7b8794;line-height:1.5">
      ⭐⭐⭐⭐⭐<br/>
      Chaque semaine, de nouveaux auteurs rejoignent EbookStudio pour publier plus rapidement.
    </div>
    <!--
    TODO : activer ce témoignage dès qu'un client réel est disponible.
    <div style="margin-top:14px;padding:12px 16px;background:#f8fafc;border-radius:8px;display:inline-block">
      <span style="font-size:13px;color:#5b6875;font-style:italic">"Merci Georges, j'ai publié mon premier ebook en deux jours."</span><br/>
      <span style="font-size:12px;color:#9aa4b0;font-weight:600">— Marie, auteure indépendante</span>
    </div>
    -->
  </td></tr>
  </table>
</td></tr>
<tr><td style="padding:20px 32px;background:#f3f5f7;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9aa4b0;text-align:center">
  EbookStudio — Créez, publiez et vendez vos ebooks avec l'IA.<br/>
  <a href="{{ unsubscribe }}" style="color:#9aa4b0">Se désinscrire</a>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

const h1 = (t: string) => `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:800;color:${TEAL};padding-bottom:12px">${t}</td></tr>`;
const p = (t: string) => `<tr><td style="padding-bottom:14px">${t}</td></tr>`;

export const BREVO_ONBOARDING_EMAILS: OnboardingEmail[] = [
  {
    step: 1,
    delayLabel: "Immédiat (à l'inscription)",
    subject: "🎉 Bienvenue dans EbookStudio, {{ contact.PRENOM }} !",
    preheader: "Voici comment démarrer et créer votre premier ebook.",
    html: shell(
      h1("Bienvenue à bord 👋") +
      p("Bonjour {{ contact.PRENOM }},") +
      p("Ravi de vous compter parmi les auteurs d'EbookStudio ! Vous venez de rejoindre l'outil qui transforme une simple idée en ebook complet, prêt pour Amazon KDP.") +
      p("Dans les prochains jours, je vais vous montrer, pas à pas, comment tirer le maximum de la plateforme. Aujourd'hui, une seule chose : connectez-vous et faites le tour du propriétaire.") +
      cta(`${SITE}/subscription`, "🚀 Accéder à mon espace") +
      p("À très vite,<br/>Georges — fondateur d'EbookStudio")
    ),
  },
  {
    step: 2,
    delayLabel: "J+1",
    subject: "Votre premier ebook en 15 minutes ⏱️",
    preheader: "La méthode la plus rapide pour publier votre premier livre.",
    html: shell(
      h1("Votre premier ebook en 15 minutes") +
      p("Bonjour {{ contact.PRENOM }},") +
      p("Beaucoup pensent qu'écrire un livre prend des mois. Avec EbookStudio, votre premier ebook peut être prêt en un après-midi.") +
      p("Les 3 étapes :") +
      p("<strong>1.</strong> Choisissez un sujet (ou laissez l'IA vous en suggérer).<br/><strong>2.</strong> Générez le plan et les chapitres automatiquement.<br/><strong>3.</strong> Exportez en PDF/EPUB + couverture KDP.") +
      cta(`${SITE}/subscription`, "✍️ Créer mon premier ebook") +
      p("Lancez-vous maintenant, l'expérience vaut mille explications.")
    ),
  },
  {
    step: 3,
    delayLabel: "J+3",
    subject: "Découvrez les agents IA d'EbookStudio 🤖",
    preheader: "15 agents spécialisés qui travaillent pour vous.",
    html: shell(
      h1("Vos agents IA au travail") +
      p("Bonjour {{ contact.PRENOM }},") +
      p("EbookStudio n'est pas un simple générateur de texte. C'est une équipe de <strong>15 agents IA spécialisés</strong> qui collaborent : plan, rédaction, cohérence, SEO, couverture, marketing…") +
      p("Chaque agent a un rôle précis, comme une vraie maison d'édition automatisée. Résultat : un livre structuré, cohérent et prêt à vendre.") +
      cta(`${SITE}/subscription`, "🤖 Découvrir les agents") +
      p("Testez le pipeline complet sur votre prochain projet.")
    ),
  },
  {
    step: 4,
    delayLabel: "J+5",
    subject: "Les erreurs que font 90 % des auteurs ⚠️",
    preheader: "Évitez ces pièges qui tuent les ventes sur Amazon KDP.",
    html: shell(
      h1("Les 4 erreurs à éviter") +
      p("Bonjour {{ contact.PRENOM }},") +
      p("La plupart des auteurs débutants échouent pour les mêmes raisons :") +
      p("❌ Un titre qui ne dit pas ce que le lecteur va gagner.<br/>❌ Une couverture amateur.<br/>❌ Aucune recherche de mots-clés KDP.<br/>❌ Un contenu générique, sans angle unique.") +
      p("Bonne nouvelle : EbookStudio corrige ces 4 points automatiquement (titres testés, couvertures pro, mots-clés, angle éditorial).") +
      cta(`${SITE}/subscription`, "✅ Corriger mes ebooks") +
      p("Un petit ajustement peut doubler vos ventes.")
    ),
  },
  {
    step: 5,
    delayLabel: "J+7",
    subject: "Étude de cas : 1 247 € en 30 jours 📈",
    preheader: "Comment Marie a lancé son premier ebook rentable.",
    html: shell(
      h1("L'histoire de Marie") +
      p("Bonjour {{ contact.PRENOM }},") +
      p("Marie, enseignante de 42 ans, n'avait jamais écrit de livre. En mars, elle publie son premier ebook créé avec EbookStudio.") +
      p("30 jours plus tard : <strong>1 247 € de revenus</strong>, en travaillant le soir, sans expérience technique.") +
      p("Sa méthode ? Exactement celle que vous avez entre les mains. La seule différence : elle est passée à l'action.") +
      cta(`${SITE}/subscription`, "📚 Créer mon ebook rentable") +
      p("Votre première vente est plus proche que vous ne le pensez.")
    ),
  },
  {
    step: 6,
    delayLabel: "J+9",
    subject: "Vos questions les plus fréquentes 💬",
    preheader: "Tout ce que vous devez savoir avant de vous lancer.",
    html: shell(
      h1("Questions fréquentes") +
      p("Bonjour {{ contact.PRENOM }},") +
      p("<strong>« Faut-il savoir écrire ? »</strong> Non. L'IA rédige, vous validez.") +
      p("<strong>« Est-ce légal pour Amazon KDP ? »</strong> Oui, vous êtes propriétaire du contenu généré et détenez la licence commerciale.") +
      p("<strong>« Combien de temps pour un livre ? »</strong> De 15 minutes à quelques heures selon la longueur.") +
      p("<strong>« Et si je bloque ? »</strong> Formation, forum et assistance sont inclus.") +
      cta(`${SITE}/subscription`, "🙋 Poser ma question / Démarrer") +
      p("Il ne vous manque plus qu'à publier.")
    ),
  },
  {
    step: 7,
    delayLabel: "J+11 (fin d'essai)",
    subject: "🎁 Offre de lancement : l'accès à vie à 67 €",
    preheader: "Votre essai se termine — sécurisez votre accès à vie.",
    html: shell(
      h1("Votre offre de lancement") +
      p("Bonjour {{ contact.PRENOM }},") +
      p("Votre essai gratuit touche à sa fin. Pour continuer à créer des ebooks illimités, profitez de l'offre de lancement :") +
      p("<span style=\"font-size:30px;font-weight:800;color:" + TEAL + "\">67 €</span> <span style=\"color:#9aa4b0\">— paiement unique, accès à vie</span>") +
      p("✅ Ebooks illimités (KDP-ready)<br/>✅ Couvertures illimitées<br/>✅ Audiobook + BD<br/>✅ Licence commerciale<br/>✅ Formation + Forum") +
      cta(`${SITE}/promo/commande`, "🚀 J'obtiens mon accès à vie — 67 €") +
      p("Garantie satisfait ou remboursé 7 jours. Aucun risque.") +
      p("Merci de votre confiance,<br/>Georges")
    ),
  },
  {
    step: 8,
    delayLabel: "J+30 (réactivation)",
    subject: "Votre projet d'ebook est-il toujours d'actualité ?",
    preheader: "On reprend contact : nouveautés, Documentation Studio et un bonus.",
    html: shell(
      h1("On reprend contact 👋") +
      p("Bonjour {{ contact.PRENOM }},") +
      p("Cela fait quelques semaines depuis votre essai d'EbookStudio. Je voulais simplement savoir : <strong>votre projet d'ebook est-il toujours d'actualité ?</strong>") +
      p("Si oui, sachez qu'EbookStudio a beaucoup évolué. Voici ce qui pourrait vous relancer :") +
      p("✨ <strong>Nouveautés</strong> : de nouveaux agents IA et un pipeline encore plus rapide pour passer de l'idée au livre publié.") +
      p("📚 <strong>Documentation Studio</strong> : notre plateforme qui génère automatiquement toute la documentation, le marketing et la communication d'un produit numérique à partir d'un seul brief.") +
      cta(`${SITE}/subscription`, "🔄 Reprendre mon projet") +
      p("Et parce que je tiens à vous accompagner, je vous offre un <strong>bonus temporaire</strong> pour vous remettre le pied à l'étrier. Répondez simplement à cet email et je vous l'envoie.") +
      p("Au plaisir de vous relire,<br/>Georges")
    ),
  },
];

