import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { PROMO_END, PROMO_PRICE, REGULAR_PRICE } from "@/data/summerPromo";

const pad = (n: number) => n.toString().padStart(2, "0");

const compute = () => {
  const diff = PROMO_END.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
};

const Box = ({ value, label }: { value: number | string; label: string }) => (
  <span className="inline-flex flex-col items-center bg-foreground text-background rounded-lg px-2.5 py-1.5 min-w-[46px]">
    <span className="text-xl font-black tabular-nums leading-none">{value}</span>
    <span className="text-[9px] uppercase tracking-wide opacity-70 mt-0.5">{label}</span>
  </span>
);

/** Compte à rebours de la promo d'été (jusqu'au 30 septembre). */
const SummerPromoCountdown = () => {
  const [t, setT] = useState(compute);

  useEffect(() => {
    const id = setInterval(() => setT(compute()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!t) {
    return (
      <div className="rounded-2xl bg-secondary/60 border border-border p-4 text-center text-sm text-muted-foreground">
        L'offre d'été est terminée. Tarif habituel : {REGULAR_PRICE}€ à vie.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-accent/10 border border-accent/30 p-4">
      <p className="flex items-center justify-center gap-2 text-sm font-bold text-foreground mb-3">
        <Flame className="w-4 h-4 text-accent" />
        Offre d'été à {PROMO_PRICE}€ — se termine le 30 septembre
      </p>
      <div className="flex items-center justify-center gap-2">
        <Box value={t.days} label="jours" />
        <span className="text-muted-foreground font-black">:</span>
        <Box value={pad(t.hours)} label="h" />
        <span className="text-muted-foreground font-black">:</span>
        <Box value={pad(t.minutes)} label="min" />
        <span className="text-muted-foreground font-black">:</span>
        <Box value={pad(t.seconds)} label="sec" />
      </div>
    </div>
  );
};

export default SummerPromoCountdown;
