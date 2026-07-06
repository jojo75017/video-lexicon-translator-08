import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SeoHead from "@/components/funnel/SeoHead";
import V3OrderForm from "@/components/v3/V3OrderForm";
import type { V3OfferKey } from "@/data/v3Launch";

const CREAM = "#FBF6EC";
const INK = "#2A2118";

const V3CommandePage = () => {
  const [params] = useSearchParams();
  const raw = params.get("offre") || params.get("plan");
  const defaultOffer: V3OfferKey = raw === "v3-pro" ? "v3-pro" : "v3-base";

  return (
    <div style={{ background: CREAM, color: INK }} className="min-h-screen py-8 px-4">
      <SeoHead
        title="Commande — Publication Assistée Pro V3"
        description="Finalisez votre commande V3 : choisissez l'offre Base 197€ ou le Pack Pro 347€. Paiement carte sécurisé ou PayPal."
        canonical="https://www.ebookstudio.fr/commande-v3"
        noindex
      />
      <div className="max-w-xl mx-auto">
        <Link to="/publication-pro" className="inline-flex items-center gap-2 text-[#7a6c58] hover:text-[#2A2118] mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour à l'offre
        </Link>
      </div>
      <V3OrderForm defaultOffer={defaultOffer} />
    </div>
  );
};

export default V3CommandePage;
