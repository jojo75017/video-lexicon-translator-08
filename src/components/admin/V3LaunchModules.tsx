import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Gift, ShoppingCart, Megaphone } from "lucide-react";
import V3OrderForm from "@/components/v3/V3OrderForm";
import { V3_LAUNCH_BONUSES, V3_BONUSES_TOTAL_VALUE } from "@/data/v3Launch";

const AMBER_DEEP = "#C97A14";
const SOFT = "#FFF3DF";

/** Module Hub : Page de commande V3 + order bump (formulaire embarqué). */
export function V3OrderPageModule() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" style={{ color: AMBER_DEEP }} />
          Tunnel de commande live : choix Base 197€ / Pack Pro 547€ + order bump optionnel.
        </p>
        <Link to="/commande-v3" target="_blank">
          <Button variant="outline" size="sm" className="gap-2">
            Ouvrir la page publique <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
      <div className="rounded-2xl border p-3 bg-muted/30">
        <V3OrderForm compact />
      </div>
    </div>
  );
}

/** Module Hub : Page de vente V3 haute conversion. */
export function V3SalesPageModule() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <Megaphone className="w-4 h-4" style={{ color: AMBER_DEEP }} />
        Page commerciale longue (hero, preuves chiffrées, storytelling, bonus, offres, garantie, FAQ, compte à rebours).
      </p>
      <div className="flex flex-wrap gap-2">
        <Link to="/vente-v3" target="_blank">
          <Button size="sm" className="gap-2" style={{ background: AMBER_DEEP }}>
            Voir la page de vente <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <Link to="/commande-v3" target="_blank">
          <Button variant="outline" size="sm" className="gap-2">
            Page de commande <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
      <ul className="text-sm grid gap-1.5 list-disc pl-5 text-muted-foreground">
        <li>Hero accrocheur + double CTA</li>
        <li>Preuves chiffrées réelles du marché KDP</li>
        <li>Bloc VALEUR « Voici ce que vous obtenez » — Base 197€ OU Pack Pro 547€ (OU exclusif)</li>
        <li>Bonus de lancement, garantie 7 jours, compte à rebours et FAQ</li>
      </ul>
    </div>
  );
}

/** Module Hub : Bonus de lancement V3. */
export function V3LaunchBonusesModule() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 text-center" style={{ background: SOFT }}>
        <Gift className="w-6 h-6 mx-auto mb-1" style={{ color: AMBER_DEEP }} />
        <p className="text-sm">
          Bonus offerts mis en avant dans l'offre — valeur totale{" "}
          <strong>{V3_BONUSES_TOTAL_VALUE}€</strong>. Source unique :{" "}
          <code className="text-[11px]">src/data/v3Launch.ts</code>.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {V3_LAUNCH_BONUSES.map((b) => (
          <div key={b.title} className="rounded-2xl border p-4 flex gap-3">
            <span className="text-2xl">{b.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">{b.title}</h3>
                <span className="text-[11px] font-black" style={{ color: AMBER_DEEP }}>{b.value}€</span>
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
