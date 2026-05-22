import { ShieldCheck } from "lucide-react";

/**
 * Bandeau garantie compact à placer juste avant un CTA d'achat.
 * Lève le frein "et si ça marche pas ?" sans répéter la grande section garantie.
 */
const GuaranteeBlock = () => {
  return (
    <section className="px-4 pt-8 pb-2">
      <div className="max-w-3xl mx-auto flex items-center gap-4 bg-white border-2 border-emerald-500/40 rounded-2xl p-4 md:p-5 shadow-joy">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="text-sm md:text-base text-joy-ink leading-snug">
          <strong className="font-black">Garantie 30 jours, sans question.</strong>{" "}
          Tu testes Ebookstudio Pro V2. Si ça ne te convient pas, tu m'écris un email
          et je te rembourse intégralement. Aucun risque pour toi.
        </div>
      </div>
    </section>
  );
};

export default GuaranteeBlock;
