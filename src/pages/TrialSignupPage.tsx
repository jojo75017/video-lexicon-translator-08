import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getStoredUtm } from "@/lib/utmTracking";
import { trackCaptureEvent } from "@/lib/captureTracking";
import {
  Rocket,
  Mail,
  ShieldCheck,
  Gift,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Copy,
  Check,
  Crown,
} from "lucide-react";

const TEAL = "#008296";
const AMBER = "#FF9E2D";
const INK = "#232F3E";

const BENEFITS = [
  "Accès immédiat au générateur d'ebooks IA",
  "7 jours d'essai gratuit, sans carte bancaire",
  "Votre guide offert : Les 5 niches rentables 2026",
];

export default function TrialSignupPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyUsed, setAlreadyUsed] = useState(false);

  const copyCode = async () => {
    if (!accessCode) return;
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError("Merci d'entrer une adresse email valide.");
      return;
    }
    setLoading(true);
    try {
      const utm = getStoredUtm();
      trackCaptureEvent("inline", "click", { leadMagnet: "essai-gratuit" });
      const { data, error: fnError } = await supabase.functions.invoke("trial-signup", {
        body: {
          email: normalized,
          first_name: firstName.trim(),
          website,
          utm_source: utm.utm_source || null,
          utm_medium: utm.utm_medium || null,
          utm_campaign: utm.utm_campaign || null,
          landing_url: utm.landing_url || null,
        },
      });
      if (fnError) throw fnError;
      if (data && data.ok === false) {
        setError(
          data.alreadyUsed
            ? (data.error as string) ||
              "Vous avez déjà utilisé votre essai gratuit avec cet email."
            : (data.error as string) || "Une erreur est survenue. Réessayez.",
        );
        return;
      }
      if (data && data.access_code) setAccessCode(data.access_code as string);
      setDone(true);
    } catch (err) {
      setError(
        "Une erreur est survenue. Vérifiez votre email et réessayez dans un instant.",
      );
      console.error("trial-signup failed:", err);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: "#FAFAFA", color: INK }}>
      <Helmet>
        <title>Recevez votre accès gratuit — EbookStudio Pro</title>
        <meta name="description" content="Activez votre essai gratuit de 7 jours à EbookStudio Pro et recevez en bonus le guide des 5 niches d'ebooks rentables 2026." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Colonne gauche — argumentaire */}
        <div className="hidden md:block">
          <Link to="/offres" className="inline-flex items-center gap-2 mb-8 font-extrabold text-xl">
            <BookOpen className="w-6 h-6" style={{ color: TEAL }} />
            EbookStudio<span style={{ color: TEAL }}>Pro</span>
          </Link>
          <h1 className="text-4xl font-extrabold leading-tight mb-5">
            Votre premier ebook, <span style={{ color: TEAL }}>propulsé par l'IA</span>.
          </h1>
          <p className="text-lg text-muted-foreground mb-8" style={{ color: "#5b6472" }}>
            Entrez votre email et recevez immédiatement votre accès gratuit au logiciel, plus votre guide bonus.
          </p>
          <ul className="space-y-4">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: TEAL }} />
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne droite — formulaire / confirmation */}
        <div
          className="rounded-3xl p-8 md:p-10 bg-white"
          style={{ boxShadow: "0 20px 60px -20px rgba(0,130,150,0.35)", border: "1px solid rgba(0,130,150,0.12)" }}
        >
          {done ? (
            <div className="text-center py-6">
              <div className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(0,130,150,0.1)" }}>
                <CheckCircle2 className="w-9 h-9" style={{ color: TEAL }} />
              </div>
              <h2 className="text-2xl font-extrabold mb-3">C'est parti ! 🎉</h2>

              {accessCode && (
                <div
                  className="rounded-2xl p-5 mb-5 text-center"
                  style={{ background: "#fff", border: `2px solid ${TEAL}` }}
                >
                  <p className="text-xs font-semibold mb-2" style={{ color: "#5b6472" }}>
                    ✅ Votre code d'accès (notez-le pour commencer tout de suite)
                  </p>
                  <p
                    className="text-3xl font-black tracking-wider mb-3"
                    style={{ fontFamily: "monospace", color: TEAL }}
                  >
                    {accessCode}
                  </p>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
                    style={{ background: copied ? "#e6f4f1" : "#f1f5f7", color: TEAL }}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copié !" : "Copier le code"}
                  </button>
                </div>
              )}

              <p className="text-muted-foreground mb-6" style={{ color: "#5b6472" }}>
                Votre accès gratuit et votre guide <strong>« Les 5 niches rentables 2026 »</strong> viennent aussi d'être envoyés à <strong>{email}</strong>.
                L'email contient votre code, le bonus PDF et votre lien de connexion. Pensez à vérifier vos spams.
              </p>
              <div className="rounded-2xl p-4 mb-6 text-sm" style={{ background: "#FFF7EC", border: `1px solid ${AMBER}55` }}>
                <Gift className="inline w-4 h-4 mr-1" style={{ color: AMBER }} />
                Cliquez sur « Me connecter maintenant » et saisissez votre code pour démarrer.
              </div>
              <Link
                to="/subscription"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white w-full"
                style={{ background: TEAL }}
              >
                Me connecter maintenant <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 text-sm font-semibold" style={{ background: "rgba(0,130,150,0.1)", color: TEAL }}>
                <Sparkles className="w-4 h-4" /> Essai gratuit 7 jours
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Recevez votre accès gratuit</h2>
              <p className="text-muted-foreground mb-6" style={{ color: "#5b6472" }}>
                + votre guide offert <strong>« Les 5 niches d'eBooks rentables 2026 »</strong> 🎁
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Prénom <span className="font-normal text-muted-foreground">(facultatif)</span></label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Votre prénom"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
                    style={{ borderColor: "#dbe1e8" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Adresse email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@email.com"
                      className="w-full rounded-xl border pl-11 pr-4 py-3 outline-none focus:ring-2"
                      style={{ borderColor: "#dbe1e8" }}
                    />
                  </div>
                </div>

                {/* Honeypot anti-bot */}
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 font-bold text-white text-lg disabled:opacity-70 transition-transform hover:-translate-y-0.5"
                  style={{ background: AMBER }}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                  {loading ? "Activation..." : "Recevoir mon accès gratuit"}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-center text-muted-foreground pt-1" style={{ color: "#7a8492" }}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Votre adresse email reste confidentielle. Aucun spam. Désinscription à tout moment.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
