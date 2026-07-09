import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { BREVO_ONBOARDING_EMAILS } from "@/data/brevoOnboardingEmails";
import { Copy, Check, Mail, Info, BookOpen } from "lucide-react";
import { toast } from "sonner";

const TEAL = "#008296";

export default function BrevoOnboardingEmailsPage() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const email = BREVO_ONBOARDING_EMAILS[active];

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success("Copié dans le presse-papiers");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#FAFAFA", color: "#232F3E" }}>
      <Helmet>
        <title>Séquence emails Brevo — EbookStudio</title>
      </Helmet>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Séquence d'onboarding Brevo</h1>
        <p className="text-muted-foreground mb-6" style={{ color: "#5b6472" }}>
          7 emails prêts à coller dans Brevo (Automatisations). Copiez le HTML de chaque email.
        </p>

        <div
          className="rounded-xl p-4 mb-8 flex gap-3 items-start"
          style={{ background: "#e6f4f6", border: "1px solid #b8e0e6" }}
        >
          <Info className="w-5 h-5 mt-0.5 shrink-0" style={{ color: TEAL }} />
          <div className="text-sm">
            <strong>Où mettre les nouveaux abonnés ?</strong> Ne les envoyez pas dans la « Liste Marketing » (#2, 636
            contacts) qui mélange tous vos anciens contacts. Utilisez plutôt une liste dédiée à l'automation :{" "}
            <strong>« intéressé ebook » (#13, dossier marketing_automation)</strong> — elle est vide et prévue pour ça.
            Les inscriptions d'essai y arrivent automatiquement si vous définissez <code>BREVO_TRIAL_LIST_ID = 13</code>.
            Créez ensuite une automation Brevo déclenchée par l'ajout à cette liste, avec ces 7 emails dans l'ordre.
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Liste des emails */}
          <div className="space-y-2">
            {BREVO_ONBOARDING_EMAILS.map((e, i) => (
              <button
                key={e.step}
                onClick={() => setActive(i)}
                className="w-full text-left rounded-xl p-3 transition-all"
                style={{
                  background: i === active ? TEAL : "#fff",
                  color: i === active ? "#fff" : "#232F3E",
                  border: "1px solid #eef1f4",
                }}
              >
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <Mail className="w-3.5 h-3.5" /> Email {e.step} · {e.delayLabel}
                </div>
                <div className="font-semibold text-sm mt-1">{e.subject}</div>
              </button>
            ))}
          </div>

          {/* Détail */}
          <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #eef1f4" }}>
            <div className="flex flex-wrap gap-3 mb-4">
              <Field label="Objet" value={email.subject} onCopy={() => copy(email.subject, "subj")} copied={copied === "subj"} />
              <Field label="Preheader" value={email.preheader} onCopy={() => copy(email.preheader, "pre")} copied={copied === "pre"} />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">Code HTML</span>
              <button
                onClick={() => copy(email.html, "html")}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
                style={{ background: TEAL }}
              >
                {copied === "html" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copier le HTML
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <textarea
                readOnly
                value={email.html}
                className="w-full h-[480px] text-xs font-mono rounded-lg p-3"
                style={{ border: "1px solid #eef1f4", background: "#fbfbfc" }}
              />
              <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #eef1f4" }}>
                <iframe title="preview" srcDoc={email.html} className="w-full h-[480px] bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="flex-1 min-w-[220px]">
      <div className="text-xs text-muted-foreground mb-1" style={{ color: "#7a8492" }}>{label}</div>
      <button
        onClick={onCopy}
        className="w-full text-left rounded-lg px-3 py-2 text-sm flex items-center justify-between gap-2"
        style={{ border: "1px solid #eef1f4", background: "#fbfbfc" }}
      >
        <span className="truncate">{value}</span>
        {copied ? <Check className="w-4 h-4 shrink-0" style={{ color: TEAL }} /> : <Copy className="w-4 h-4 shrink-0 opacity-50" />}
      </button>
    </div>
  );
}
