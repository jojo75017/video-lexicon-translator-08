import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SeoHead from "@/components/funnel/SeoHead";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { COMMANDER_URL, BLOG_URL } from "@/data/externalLinks";
import { V3_LAUNCH_BONUSES } from "@/data/v3Launch";
import { trackCaptureEvent } from "@/lib/captureTracking";
import "@/styles/commander-maquette.css";

/** Paiement unique uniquement : plus de 2× ni 3×. */
const PLAN_ID = "v2_1x" as const;

/** Fin de l'offre 47 € : 30 septembre 2026, 23 h 59 (heure de Paris). */
const OFFER_END = new Date("2026-09-30T21:59:59Z");

const INCLUDED = [
  "Génération complète du livre : plan, chapitres et correction en 4 passes",
  "Exports Word et PDF prêts pour Amazon KDP, avec table des matières",
  "Cover Studio : couvertures Kindle, broché, dos et quatrième de couverture",
  "Livres illustrés pour enfants, albums carrés et visuels cohérents",
  "Fiche KDP : description commerciale, mots-clés, catégories et biographie",
  "Livre audio et traduction dans 10 langues",
  "Accès à vie : aucune mensualité, aucune date d'expiration",
];

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Que comprend exactement le paiement de 47 € ?",
    a: "Le paiement ouvre votre accès à vie à EbookStudio V3 et aux fonctionnalités incluses dans cette offre. Il n'y a aucune mensualité à régler.",
  },
  {
    q: "Puis-je payer avec PayPal ?",
    a: "Oui. Le paiement peut être effectué par carte bancaire ou avec PayPal sur la page sécurisée.",
  },
  {
    q: "Faut-il savoir écrire ou être technique ?",
    a: "Non. Le parcours vous guide depuis votre idée jusqu'au manuscrit, à la couverture et aux informations nécessaires pour Amazon KDP.",
  },
  {
    q: "Ai-je besoin de mes propres clés API ?",
    a: "Certains moteurs gratuits peuvent demander une clé personnelle, expliquée pas à pas. Les modules concernés l'indiquent directement.",
  },
  {
    q: "Les livres m'appartiennent-ils ?",
    a: "Oui. Les textes et fichiers que vous créez vous appartiennent et vous pouvez les publier ou les vendre sur Amazon KDP.",
  },
  {
    q: "Et si l'outil ne me convient pas ?",
    a: "Vous disposez d'une garantie satisfait ou remboursé de 30 jours. Un simple message au support suffit.",
  },
  {
    q: "Pourquoi commander maintenant ?",
    a: "Parce que l'offre à 47 € en paiement unique prend fin le 30 septembre. Après cette date, EbookStudio sera proposé uniquement par abonnement.",
  },
  {
    q: "Comment mon accès est-il ouvert après le paiement ?",
    a: "Votre accès est ouvert immédiatement avec l'adresse e-mail utilisée lors de la commande. Vous recevez également les informations de démarrage par e-mail.",
  },
];

interface Testimonial {
  id: string;
  author_name: string;
  book_title: string | null;
  comment: string;
  rating: number | null;
}

/**
 * Page de commande — maquette validée : bleu nuit, doré, orange.
 * Un seul objectif : le paiement unique de 47 € (accès à vie).
 */
export default function V3CommanderPage() {
  const [params] = useSearchParams();
  const src = params.get("src") || undefined;
  const ref = params.get("ref") || params.get("aff") || undefined;

  const [email, setEmail] = useState(() => (params.get("email") || "").trim().toLowerCase());
  const [loading, setLoading] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const offerOver = Date.now() > OFFER_END.getTime();

  // Email du prospect connecté récupéré automatiquement s'il n'est pas dans l'URL.
  useEffect(() => {
    if (email) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      const sessionEmail = data.session?.user?.email;
      if (active && sessionEmail) setEmail(sessionEmail.toLowerCase());
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Avis réels et approuvés uniquement : aucun témoignage fabriqué.
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("book_testimonials")
        .select("id,author_name,book_title,comment,rating")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (active && data) setTestimonials(data as Testimonial[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    void trackCaptureEvent("commander", "view");
  }, []);

  /**
   * Paiement PayPal du même produit (47 € une fois).
   * La commande est enregistrée côté serveur, puis PayPal s'ouvre avec le montant prérempli.
   */
  const startPaypal = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      toast.error("Merci de saisir un email valide — c'est lui qui ouvrira votre accès.");
      return;
    }
    void trackCaptureEvent("commander", "checkout_click", { leadMagnet: "paypal_47" });
    setPaypalLoading(true);
    try {
      const { error } = await supabase.functions.invoke("funnel-create-order", {
        body: { email: e, product_key: "v3_lifetime", payment_method: "paypal", ref_code: ref },
      });
      if (error) throw new Error(error.message);
      window.open("https://paypal.me/ebookstudio/47", "_blank", "noopener,noreferrer");
      toast.success("PayPal est ouvert. Indiquez votre email dans la note du paiement.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "PayPal indisponible pour le moment.");
    } finally {
      setPaypalLoading(false);
    }
  };

  const startPayment = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      toast.error("Merci de saisir un email valide — c'est lui qui ouvrira votre accès.");
      return;
    }
    void trackCaptureEvent("commander", "checkout_click", { leadMagnet: PLAN_ID });
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("v3-pack-checkout", {
        body: {
          plan: PLAN_ID,
          email: e,
          src,
          ref,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/paiement-succes?session_id={CHECKOUT_SESSION_ID}`,
        },
      });
      if (error) {
        let message = error.message;
        const context = error.context;
        if (context instanceof Response) {
          const payload = (await context.clone().json().catch(() => null)) as { error?: string } | null;
          if (payload?.error) message = payload.error;
        }
        throw new Error(message);
      }
      const secret = (data as { clientSecret?: string })?.clientSecret;
      if (!secret) throw new Error("Session de paiement indisponible.");
      void trackCaptureEvent("commander", "checkout_ready", { leadMagnet: PLAN_ID });
      setClientSecret(secret);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Paiement impossible pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cmdq">
      <SeoHead
        title="Commander EbookStudio — 47 € accès à vie"
        description="Accédez à EbookStudio V3 à vie pour 47 € en paiement unique jusqu'au 30 septembre. Carte bancaire ou PayPal, accès immédiat, garantie 30 jours."
        canonical={COMMANDER_URL}
      />
      <PaymentTestModeBanner />

      <div className="topbar">
        <b>OFFRE FONDATEUR</b>
        <span className="desktop-only">47 € à vie jusqu'au 30 septembre</span>
        <span>Ensuite, uniquement par abonnement</span>
      </div>

      <div className="container">
        <header>
          <div className="brand">
            <span className="brand-icon">📖</span> EbookStudio
          </div>
          <a className="author-link" href={BLOG_URL} target="_blank" rel="noopener noreferrer">
            Le blog de Georges Boubet ↗
          </a>
        </header>

        {/* HERO */}
        <section className="hero">
          <div>
            <span className="eyebrow">✨ Dernière étape avant votre premier livre</span>
            <h1>
              Votre accès à vie à EbookStudio,
              <strong>pour 47 € une seule fois.</strong>
            </h1>
            <p className="lead">
              De l'idée au livre prêt pour Amazon KDP : EbookStudio vous aide à structurer,
              rédiger, corriger, habiller et préparer votre publication dans un seul atelier.
            </p>
            <div className="hero-price">
              <b>47 €</b>
              <span>paiement unique · accès immédiat · garantie 30 jours</span>
            </div>
            <div className="trust-row">
              <span>✓ Accès à vie</span>
              <span>🔒 Paiement sécurisé</span>
              <span>🛡 Garantie 30 jours</span>
            </div>
          </div>

          <div className="result-card">
            <div className="result-head">
              <span>EbookStudio V3</span>
              <span>✓</span>
            </div>
            <div className="manuscript">
              <small>PROJET DE LIVRE</small>
              <h2>Votre idée devient un véritable manuscrit</h2>
              <div className="line" />
              <div className="line" />
              <div className="line short" />
              <div className="line" />
              <div className="line short" />
            </div>
            <div className="outputs">
              <span>Manuscrit</span>
              <span>Couverture</span>
              <span>Word &amp; PDF</span>
              <span>Données KDP</span>
            </div>
          </div>
        </section>

        {/* OFFRE + PAIEMENT */}
        <section className="purchase">
          <div className="left-column">
            <div className="panel">
              <div className="panel-kicker">L'ATELIER COMPLET</div>
              <h2>Tout ce qui est inclus</h2>
              <ul className="checklist">
                {INCLUDED.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="fine-print">
                Les évolutions du forfait EbookStudio V3 sont incluses.
                Les extensions premium indépendantes restent optionnelles.
              </p>
            </div>

            <div className="panel">
              <div className="panel-kicker">OFFERTS AVEC VOTRE COMMANDE</div>
              <h2>Vos bonus de démarrage</h2>
              <div className="bonuses">
                {V3_LAUNCH_BONUSES.map((b) => (
                  <div className="bonus" key={b.title}>
                    <span>
                      <b>{b.title}</b>
                      <span>{b.desc}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="founder">
              <div className="founder-number">71</div>
              <div>
                <small>CRÉÉ PAR UN AUTEUR, POUR LES AUTEURS</small>
                <h2>Georges Boubet</h2>
                <p>
                  Auteur de 71 livres publiés : thrillers, sagas, jeunesse et guides pratiques.
                  EbookStudio est né d'un parcours réel d'auteur indépendant.
                </p>
                <a href={BLOG_URL} target="_blank" rel="noopener noreferrer">
                  Découvrir mon univers d'auteur ↗
                </a>
              </div>
            </div>
          </div>

          {/* Colonne paiement */}
          <div className="checkout" id="paiement">
            {!clientSecret ? (
              <>
                <div className="deadline">● Accès à vie disponible jusqu'au 30 septembre</div>

                <div className="checkout-price">
                  <b>47 €</b>
                  <span>paiement unique</span>
                </div>
                <p className="subscription">
                  {offerOver
                    ? "EbookStudio est désormais accessible uniquement par abonnement."
                    : "Après le 30 septembre, EbookStudio sera accessible uniquement par abonnement."}
                </p>

                <label htmlFor="cmdq-email">Votre adresse e-mail</label>
                <input
                  id="cmdq-email"
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="vous@email.fr"
                  autoComplete="email"
                />

                <div className="price-choice">
                  <span>
                    <b>47 € en une fois</b>
                    <span>Accès immédiat et à vie</span>
                  </span>
                  <i>✓</i>
                </div>

                <p className="guarantee">
                  🛡 <b>Garantie 30 jours</b> — remboursement sur simple demande.
                </p>

                <button
                  id="ebookstudio-payment-button"
                  className="pay"
                  onClick={startPayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Préparation du paiement…
                    </>
                  ) : (
                    <>Payer 47 € →</>
                  )}
                </button>

                <button
                  type="button"
                  className="pay pay-paypal"
                  onClick={startPaypal}
                  disabled={paypalLoading}
                >
                  {paypalLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Ouverture de PayPal…
                    </>
                  ) : (
                    <>Payer 47 € avec PayPal</>
                  )}
                </button>

                <p className="secure">🔒 Carte bancaire ou PayPal · paiement sécurisé</p>
              </>
            ) : (
              <div>
                <h2 style={{ marginBottom: 14, fontSize: 18, fontWeight: 800 }}>Paiement sécurisé</h2>
                <div style={{ background: "#fff", borderRadius: 12, padding: 8 }}>
                  <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* POURQUOI MAINTENANT */}
        <section className="why">
          <div className="why-icon">∞</div>
          <div>
            <small>POURQUOI MAINTENANT ?</small>
            <h2>L'accès à vie disparaît le 30 septembre</h2>
            <p>
              À partir du 1<sup>er</sup> octobre, EbookStudio sera proposé uniquement par abonnement.
              Aujourd'hui, vous payez 47 € une seule fois et conservez votre accès à vie, sans mensualité.
            </p>
          </div>
        </section>

        {/* TÉMOIGNAGES RÉELS */}
        {testimonials.length > 0 && (
          <section className="testimonials">
            <div className="section-title">
              <small>DES RÉSULTATS CONCRETS</small>
              <h2>Ce qu'en disent les auteurs</h2>
            </div>
            <div className="quotes">
              {testimonials.map((t) => (
                <div className="quote" key={t.id}>
                  {t.rating ? <div className="stars">{"★".repeat(t.rating)}</div> : null}
                  <blockquote>« {t.comment} »</blockquote>
                  <footer>
                    {t.author_name}
                    {t.book_title && <span>{t.book_title}</span>}
                  </footer>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="faq" id="faq">
          <div className="section-title">
            <small>TOUT EST CLAIR AVANT DE COMMANDER</small>
            <h2>Questions fréquentes</h2>
          </div>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
          <p className="secure" style={{ marginTop: 22, fontSize: 11 }}>
            Une autre question ? <a href="mailto:contact@ebookstudio.fr" style={{ textDecoration: "underline" }}>contact@ebookstudio.fr</a> — réponse sous 24 h ouvrées.
          </p>
        </section>

        {/* RAPPEL FINAL */}
        <section className="final">
          <small>VOTRE PROCHAIN LIVRE PEUT COMMENCER AUJOURD'HUI</small>
          <h2>Votre livre est déjà dans votre tête.</h2>
          <p>Dans quelques soirées, il peut être en ligne. Ou rester une idée de plus.</p>
          <a
            className="final-cta"
            href="#paiement"
            onClick={() => trackCaptureEvent("commander", "click")}
          >
            Obtenir l'accès à vie — 47 € →
          </a>
          <em>Garantie 30 jours · paiement unique · accès immédiat</em>
        </section>

        <footer className="site-footer">
          <span>EbookStudio — créé par Georges Boubet</span>
          <span>
            <a href="/mentions-legales">Mentions légales</a>
            {" · "}
            <a href="/cgv">CGV</a>
            {" · "}
            <a href="/politique-confidentialite">Confidentialité</a>
            {" · "}
            <a href="mailto:contact@ebookstudio.fr">contact@ebookstudio.fr</a>
          </span>
        </footer>
      </div>
    </div>
  );
}
