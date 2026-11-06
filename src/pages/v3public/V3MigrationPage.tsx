import { Link } from "react-router-dom";
import { Check, Crown, Feather, Gift, Infinity as InfinityIcon, Lock } from "lucide-react";
import {
  V2_LEGACY_MODULES,
  V2_LEGACY_QUOTAS,
  V2_LEGACY_EXCLUSIONS,
} from "@/data/v2LegacyAccess";
import { BackButton } from "@/components/v3/BackButton";
import useV3Entitlement from "@/hooks/useV3Entitlement";
import { V2_LEGACY_DISCOUNT, legacyPrice, V3_MONTHLY_OFFERS } from "@/data/v3Pricing";
import fideliteHero from "@/assets/migration-fidelite-hero.jpg";

export default function V3MigrationPage() {
  const { loading, hasV2 } = useV3Entitlement();
  if (loading) {
    return (
      <div className="py-16 grid place-items-center" style={{ background: "#0b1120" }}>
        <p className="text-sm text-slate-500">Vérification de votre accès V2…</p>
      </div>
    );
  }

  if (!hasV2) {
    return (
      <div className="v3-plans-dark py-10 md:py-16 grid place-items-center px-4" style={{ background: "#0b1120" }}>
        <div className="max-w-md w-full rounded-2xl p-8 text-center" style={{ border: "1px solid #2a3448" }}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "#b45309" }}>
            Tarif fidélité -20 % à vie
          </p>
          <h1 className="text-2xl font-serif mb-3" style={{ color: "#f5f5f5" }}>
            Connectez-vous pour voir votre tarif fidélité
          </h1>
          <p className="text-sm mb-6" style={{ color: "#4b5563" }}>
            Utilisez l'adresse email de votre abonnement EbookStudio : votre remise
            d'ancien abonné est reconnue automatiquement.
          </p>
          <Link
            to="/connexion-abonne?redirect=/v3/migration"
            className="block w-full py-3 rounded-lg font-semibold"
            style={{ background: "#008296", color: "#fff" }}
          >
            Me connecter
          </Link>
          <Link to="/v3/forfaits" className="block text-sm mt-4 underline" style={{ color: "#008296" }}>
            Voir les formules au tarif public
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="v3-plans-dark min-h-screen py-12 px-4" style={{ background: "#0b1120" }}>
      <div className="max-w-5xl mx-auto">
        <BackButton className="mb-4" />
        <img
          src={fideliteHero}
          alt="Cadeau fidélité devant une bibliothèque"
          width={1600}
          height={640}
          className="w-full h-48 md:h-64 object-cover rounded-2xl mb-8"
        />

        <header className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "#b45309" }}>
            Ancien client V2
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4" style={{ color: "#f5f5f5" }}>
            Bienvenue dans la V3 — avec votre tarif fidélité
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#4b5563" }}>
            Vos livres et vos projets restent avec vous, et votre espace V2 reste accessible
            jusqu'au 31 décembre 2026. Des modules V3 vous sont offerts, vos droits et avantages fidélité déjà acquis sont conservés.
          </p>
        </header>

        {/* 5 modules offerts */}
        <section
          className="rounded-2xl p-8 mb-10"
          style={{ border: "1px solid #2a3448", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg grid place-items-center" style={{ background: "#12302a", color: "#0b6e4c" }}>
              <Gift size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-serif" style={{ color: "#f5f5f5" }}>
                Offerts : vos modules V3
              </h2>
              <p className="text-sm" style={{ color: "#c4cad6" }}>
                Déjà actives dans votre compte, sans rien payer.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {V2_LEGACY_MODULES.map((m) => (
              <Link
                key={m.key}
                to={m.to}
                className="rounded-xl p-5 transition hover:opacity-90"
                style={{ border: "1px solid #2a3448", background: "#1c2638" }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <Check size={16} className="shrink-0 mt-1" style={{ color: "#0b6e4c" }} />
                  <h3 className="font-semibold text-sm" style={{ color: "#f5f5f5" }}>{m.title}</h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#c4cad6" }}>{m.description}</p>
              </Link>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl p-4" style={{ background: "#12302a", border: "1px solid #0f8a5f33" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#0b6e4c" }}>
                Ce qui est inclus
              </p>
              <ul className="text-sm space-y-1" style={{ color: "#e5e7eb" }}>
                <li>{V2_LEGACY_QUOTAS.booksPerMonth} livres / mois via les nouveautés</li>
                <li>{V2_LEGACY_QUOTAS.chaptersMax} chapitres max · {V2_LEGACY_QUOTAS.wordsPerChapter.toLocaleString("fr-FR")} mots / chapitre</li>
                <li>Export PDF / DOCX / EPUB avec sommaire stylé</li>
                <li className="flex items-center gap-1">
                  <InfinityIcon size={14} /> Votre V2 complète, jusqu'au 31/12/2026
                </li>
              </ul>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#1c2638", border: "1px solid #2a3448" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#9a6b0a" }}>
                Compléments professionnels
              </p>
              <ul className="text-sm space-y-1" style={{ color: "#c4cad6" }}>
                {V2_LEGACY_EXCLUSIONS.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <Lock size={13} className="shrink-0 mt-1" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10" aria-labelledby="fidelite-title">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-2 text-center" style={{ color: "#FF9E2D" }}>
            Votre remise fidélité : -{Math.round(V2_LEGACY_DISCOUNT * 100)} % à vie
          </p>
          <h2 id="fidelite-title" className="text-3xl font-serif text-center mb-2" style={{ color: "#f5f5f5" }}>
            Ce que chaque formule vous apporte en plus
          </h2>
          <p className="text-sm text-center mb-6" style={{ color: "#c4cad6" }}>
            Vous gardez tout ce qui est ci-dessus. Chaque formule ajoute ses outils, et inclut ceux des formules précédentes.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {V3_MONTHLY_OFFERS.map((p) => {
              const Icon = p.id === "vip" ? Crown : p.id === "auteur" ? Feather : Gift;
              const highlight = p.id === "auteur";
              return (
                <article
                  key={p.id}
                  className="flex flex-col rounded-2xl p-6"
                  style={{ background: "#1c2638", border: highlight ? "2px solid #008296" : "1px solid #2a3448" }}
                >
                  <Icon size={22} style={{ color: "#2dd4bf" }} />
                  <h3 className="mt-3 text-xl font-semibold" style={{ color: "#f5f5f5" }}>{p.name}</h3>
                  <p className="mt-3 text-sm line-through" style={{ color: "#8b93a7" }}>{p.price} €/mois</p>
                  <p className="text-3xl font-bold" style={{ color: "#FF9E2D" }}>
                    {legacyPrice(p.price).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    <span className="text-base font-medium" style={{ color: "#c4cad6" }}> /mois</span>
                  </p>
                  <ul className="my-5 flex-1 space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2 text-sm" style={{ color: "#e5e7eb" }}>
                        <Check size={15} className="mt-0.5 shrink-0" style={{ color: "#2dd4bf" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact-support?sujet=remise-fidelite"
                    className="block rounded-lg py-3 text-center font-semibold"
                    style={{ background: "#008296", color: "#fff" }}
                  >
                    Demander mon tarif fidélité
                  </Link>
                </article>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs" style={{ color: "#8b93a7" }}>
            La remise est vérifiée avec l'adresse email de votre achat V2, puis appliquée à votre abonnement.
          </p>
        </section>

        <section className="border-t py-8 text-center">
          <h2 className="text-2xl font-semibold">Vos droits acquis restent conservés</h2>
          <p className="my-4">Aucun nouvel abonnement n’est nécessaire. Retrouvez votre accès actuel dans votre compte et les compléments facultatifs sur la page des offres.</p>
          <Link to="/v3/forfaits" className="underline">Voir les offres à vie et les options</Link>
        </section>

        <p className="text-center text-sm mt-12" style={{ color: "#c4cad6" }}>
          Une question sur votre accès V2 ?{" "}
          <Link to="/contact-support?sujet=migration-v2" className="underline" style={{ color: "#008296" }}>
            Écrivez-nous
          </Link>{" "}
          — réponse sous 24 h.
        </p>
      </div>
    </div>
  );
}
