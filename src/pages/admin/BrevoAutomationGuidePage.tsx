import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, Clock, ListChecks, PlayCircle } from "lucide-react";

const TEAL = "#008296";

const STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Créez (ou vérifiez) la liste « intéressé ebook »",
    body: (
      <>
        Dans Brevo, ouvrez <strong>Contacts → Listes</strong>. Vérifiez que la liste{" "}
        <strong>« intéressé ebook » (#13)</strong> existe. C'est la liste dédiée à l'automation :
        elle doit rester séparée de votre « Liste Marketing » (#2). Tous les essais gratuits y
        arrivent automatiquement.
      </>
    ),
  },
  {
    title: "2. Créez un modèle par email (7 + 1)",
    body: (
      <>
        Allez dans <strong>Campagnes → Modèles → Nouveau modèle → Créer avec l'éditeur code (HTML)</strong>.
        Revenez sur la page <em>Séquence emails Brevo</em>, cliquez sur « Copier le HTML » de l'Email 1,
        collez-le dans Brevo, mettez l'objet, enregistrez. Répétez pour les 8 emails (7 emails + le J+30 de
        reprise de contact). Nommez-les clairement : <code>Onboarding 1</code>, <code>Onboarding 2</code>…
      </>
    ),
  },
  {
    title: "3. Créez l'automatisation",
    body: (
      <>
        Ouvrez <strong>Automatisations → Créer une automatisation → À partir de zéro</strong>.
        Donnez-lui un nom, par exemple <code>Onboarding Essai Gratuit</code>.
      </>
    ),
  },
  {
    title: "4. Définissez le déclencheur (trigger)",
    body: (
      <>
        Choisissez le point d'entrée <strong>« Un contact est ajouté à une liste »</strong> et
        sélectionnez la liste <strong>« intéressé ebook » (#13)</strong>. Chaque nouvel essai lance
        alors la séquence automatiquement.
      </>
    ),
  },
  {
    title: "5. Ajoutez les emails avec les délais",
    body: (
      <>
        Après le déclencheur, alternez des blocs <strong>« Envoyer un email »</strong> et
        <strong> « Délai »</strong> selon le calendrier ci-dessous. Pour chaque bloc email,
        sélectionnez le modèle correspondant créé à l'étape 2.
      </>
    ),
  },
  {
    title: "6. Activez l'automatisation",
    body: (
      <>
        Cliquez sur <strong>« Activer »</strong> en haut à droite. À partir de là, tout tourne seul :
        chaque nouveau prospect reçoit les 8 emails aux bons moments, sans aucune action de votre part.
      </>
    ),
  },
];

const SCHEDULE = [
  { when: "Immédiat", label: "Email 1 · Bienvenue dans EbookStudio" },
  { when: "Délai J+1", label: "Email 2 · Votre premier ebook en 15 minutes" },
  { when: "Délai J+2", label: "Email 3 · Découvrez les agents IA" },
  { when: "Délai J+4", label: "Email 4 · Les erreurs que font 90 % des auteurs" },
  { when: "Délai J+6", label: "Email 5 · Étude de cas" },
  { when: "Délai J+8", label: "Email 6 · Questions fréquentes" },
  { when: "Délai J+10", label: "Email 7 · Offre de lancement à 67 €" },
  { when: "Délai J+30", label: "Email 8 · Votre projet d'ebook est-il toujours d'actualité ?" },
];

export default function BrevoAutomationGuidePage() {
  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#FAFAFA", color: "#232F3E" }}>
      <Helmet>
        <title>Guide automatisation Brevo — EbookStudio</title>
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <Link
          to="/emails-onboarding"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-6"
          style={{ color: TEAL }}
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux emails
        </Link>

        <h1 className="text-3xl font-extrabold mb-2">Configurer l'automatisation Brevo pas à pas</h1>
        <p className="mb-8" style={{ color: "#5b6472" }}>
          Suivez ces 6 étapes une seule fois. Ensuite, la séquence de 8 emails part toute seule pour
          chaque nouveau prospect.
        </p>

        {/* Étapes */}
        <div className="space-y-4 mb-10">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-5 flex gap-4"
              style={{ border: "1px solid #eef1f4" }}
            >
              <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" style={{ color: TEAL }} />
              <div>
                <h2 className="font-bold text-lg mb-1">{s.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "#5b6472" }}>
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Calendrier */}
        <div className="rounded-2xl bg-white p-6 mb-10" style={{ border: "1px solid #eef1f4" }}>
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: TEAL }} /> Calendrier des envois
          </h2>
          <div className="space-y-2">
            {SCHEDULE.map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-lg px-3 py-2 text-sm"
                style={{ background: "#fbfbfc", border: "1px solid #eef1f4" }}
              >
                <span
                  className="shrink-0 font-semibold text-xs rounded-full px-3 py-1"
                  style={{ background: "#e6f4f6", color: TEAL, minWidth: 92, textAlign: "center" }}
                >
                  {row.when}
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 opacity-50" /> {row.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "#7a8492" }}>
            Les délais sont cumulés depuis l'entrée du contact dans la liste. Vous pouvez ajuster
            chaque délai selon vos préférences.
          </p>
        </div>

        {/* Rappels */}
        <div
          className="rounded-2xl p-6 flex gap-3 items-start"
          style={{ background: "#e6f4f6", border: "1px solid #b8e0e6" }}
        >
          <ListChecks className="w-6 h-6 shrink-0 mt-0.5" style={{ color: TEAL }} />
          <div className="text-sm">
            <strong>À retenir</strong>
            <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: "#5b6472" }}>
              <li>Une seule liste dédiée : « intéressé ebook » (#13), jamais la Liste Marketing.</li>
              <li>Le HTML de chaque email se copie depuis la page « Séquence emails Brevo ».</li>
              <li>Testez l'automation avec votre propre email avant de l'activer pour de bon.</li>
              <li>Une fois activée, tout est automatique — aucun envoi manuel.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            to="/emails-onboarding"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
            style={{ background: TEAL }}
          >
            <PlayCircle className="w-4 h-4" /> Voir les 8 emails à copier
          </Link>
          <a
            href="https://app.brevo.com/automation/list"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
            style={{ border: `1px solid ${TEAL}`, color: TEAL }}
          >
            Ouvrir Brevo Automatisations →
          </a>
        </div>
      </div>
    </div>
  );
}
