import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

// Vraie deadline du pont de l'Ascension : lundi 18 mai 2026 23h59 (heure Paris)
const DEADLINE = new Date("2026-05-18T23:59:00+02:00").getTime();

const pad = (n: number) => n.toString().padStart(2, "0");

const computeRemaining = () => {
  const diff = DEADLINE - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
};

const CountdownDeadline = () => {
  const [t, setT] = useState(computeRemaining);

  useEffect(() => {
    const id = setInterval(() => setT(computeRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!t) return null;

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToPricing}
      aria-label="Profiter de l'offre lancement avant la fin du compteur"
      className="w-full bg-kdp-orange text-white hover:brightness-105 transition-all border-b-2 border-black/10"
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm md:text-base font-bold">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          Offre lancement −30€ se termine dans
        </span>
        <span className="flex items-center gap-1.5 font-mono tracking-tight tabular-nums">
          <Box value={t.days} label="j" />
          <span className="opacity-70">:</span>
          <Box value={pad(t.hours)} label="h" />
          <span className="opacity-70">:</span>
          <Box value={pad(t.minutes)} label="m" />
          <span className="opacity-70">:</span>
          <Box value={pad(t.seconds)} label="s" />
        </span>
        <span className="hidden sm:inline underline underline-offset-2">
          J'en profite
        </span>
      </div>
    </button>
  );
};

const Box = ({ value, label }: { value: number | string; label: string }) => (
  <span className="inline-flex items-baseline gap-0.5 bg-black/15 rounded-md px-1.5 py-0.5">
    <span>{value}</span>
    <span className="text-[10px] opacity-80">{label}</span>
  </span>
);

export default CountdownDeadline;
