import { Check, Video } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/boubetgeorges/nouvelle-reunion";

const BENEFITS = [
  "Appel de 30 minutes pour concevoir ensemble votre itinéraire idéal.",
  "Conseils d'experts personnalisés selon vos envies et votre budget.",
  "Aucun engagement : vous repartez avec des réponses claires et précises.",
];

const TravelConsultCTA = () => {
  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{ backgroundColor: "#f1f5f9", fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Colonne gauche — Contenu */}
        <div className="text-center md:text-left">
          <span
            className="inline-block uppercase tracking-wide text-xs font-bold px-3 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: "#e0f2ff", color: "#199CFA" }}
          >
            Service 100% Gratuit
          </span>
          <h2
            className="text-3xl md:text-4xl font-extrabold leading-tight mb-4"
            style={{ color: "#0f172a" }}
          >
            Parlons de Votre Projet de Voyage !
          </h2>
          <p className="text-base md:text-lg mb-7" style={{ color: "#475569" }}>
            Vous avez un projet en tête mais vous ne savez pas par où commencer ?
            Échangeons de vive voix.
          </p>
          <ul className="space-y-4 inline-block text-left">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#dcfce7" }}
                >
                  <Check className="w-4 h-4" style={{ color: "#16a34a" }} strokeWidth={3} />
                </span>
                <span className="text-sm md:text-base" style={{ color: "#334155" }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne droite — Carte d'action */}
        <div
          className="bg-white p-8 md:p-10 text-center"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 10px 30px -5px rgba(15, 23, 42, 0.1)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl"
            style={{ backgroundColor: "#dcfce7" }}
          >
            <span role="img" aria-label="visioconférence">🎥</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: "#0f172a" }}>
            Rendez-vous en Visioconférence
          </h3>
          <p className="text-sm md:text-base mb-7" style={{ color: "#64748b" }}>
            Simple, rapide et convivial via Google Meet (recommandé).
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 w-full font-bold text-white py-4 px-6 rounded-xl transition-all duration-300 hover:-translate-y-1"
            style={{ backgroundColor: "#199CFA" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0d7fd1")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#199CFA")}
          >
            <Video className="w-5 h-5" />
            Planifier mon appel de 30 min gratuit →
          </a>
          <p className="text-xs mt-4" style={{ color: "#94a3b8" }}>
            Sélectionnez le jour et l'heure de votre choix
          </p>
        </div>
      </div>
    </section>
  );
};

export default TravelConsultCTA;
