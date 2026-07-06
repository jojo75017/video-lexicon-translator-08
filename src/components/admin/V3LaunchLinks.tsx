import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Megaphone, ShoppingCart, Gift, Rocket, Tag } from "lucide-react";

const AMBER = "#E8951E";
const AMBER_DEEP = "#C97A14";
const AMBER_SOFT = "#FFF3DF";

type LaunchLink = {
  to: string;
  title: string;
  desc: string;
  icon: typeof Megaphone;
};

const LINKS: LaunchLink[] = [
  {
    to: "/vente-v3",
    title: "Page de vente V3",
    desc: "Page commerciale longue (style Hypnova) : hero, preuves chiffrées, bonus, garantie, FAQ.",
    icon: Megaphone,
  },
  {
    to: "/commande-v3",
    title: "Page de commande + order bump",
    desc: "Tunnel de paiement : choix Base 197€ OU Pack Pro 347€, order bump optionnel, Stripe + PayPal.",
    icon: ShoppingCart,
  },
  {
    to: "/publication-pro",
    title: "Offre Publication Pro V3",
    desc: "Présentation de l'offre V3 avec les deux paliers (Base 197€ / Pack Pro 347€).",
    icon: Tag,
  },
  {
    to: "/v3-paiement?plan=v3-base",
    title: "Paiement direct — Base 197€",
    desc: "Accès direct au paiement de l'offre Base. Variante Pack Pro : ?plan=v3-pro.",
    icon: Gift,
  },
];

/** Bloc de liens directs vers les nouvelles pages de lancement V3. */
export default function V3LaunchLinks() {
  return (
    <div className="rounded-3xl border p-5 mb-6" style={{ borderColor: "#eadfc9", background: "#fff" }}>
      <div className="flex items-center gap-2 mb-1">
        <Rocket className="w-5 h-5" style={{ color: AMBER_DEEP }} />
        <h2 className="text-lg font-bold" style={{ color: AMBER_DEEP }}>
          Lancement V3 — nouvelles pages
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Accès direct aux pages publiques créées pour le lancement. Ouvrez-les dans un nouvel onglet pour les vérifier ou récupérer les liens à partager.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {LINKS.map((l) => (
          <div
            key={l.to}
            className="rounded-2xl border p-4 flex flex-col gap-3"
            style={{ borderColor: "#eadfc9", background: AMBER_SOFT }}
          >
            <div className="flex items-start gap-3">
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "#fff", color: AMBER_DEEP }}
              >
                <l.icon className="w-4.5 h-4.5" />
              </span>
              <div>
                <h3 className="font-bold text-sm">{l.title}</h3>
                <p className="text-[12px] text-muted-foreground mt-0.5">{l.desc}</p>
              </div>
            </div>
            <Link to={l.to} target="_blank" className="mt-auto">
              <Button size="sm" className="w-full gap-2 text-white" style={{ background: AMBER }}>
                Ouvrir la page <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
