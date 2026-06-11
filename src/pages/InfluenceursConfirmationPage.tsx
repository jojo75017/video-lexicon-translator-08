import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CheckCircle2, Mail, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';

const TEAL = '#008296';
const ORANGE = '#FF9E2D';
const TEXT = '#232F3E';

const InfluenceursConfirmationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Empêcher retour arrière au formulaire vide
    const handlePop = () => {
      navigate('/influenceurs', { replace: true });
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [navigate]);

  return (
    <FunnelLayout>
      <SeoHead
        title="Message envoyé — Programme Ambassadeur Ebookstudio"
        description="Ta demande de contact a bien été envoyée. Je te réponds personnellement dès que possible."
        canonical="/influenceurs/merci"
      />

      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full space-y-8 text-center">
          {/* Icône */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-pulse" />
            <div className="relative w-full h-full rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
          </div>

          {/* Titre */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: TEXT }}>
              Message envoyé !
            </h1>
            <p className="text-lg text-[#232F3E]/70 leading-relaxed">
              Merci pour ton intérêt. Je lis chaque message personnellement et je te réponds par email dès que possible — généralement sous 24h.
            </p>
            <p className="text-sm text-[#232F3E]/50">
              Pense à vérifier tes spams si tu ne vois pas ma réponse rapidement.
            </p>
          </div>

          {/* Étapes suivantes */}
          <div className="bg-white border border-[#232F3E]/10 rounded-2xl p-6 space-y-4 text-left">
            <h2 className="font-bold text-[#232F3E] flex items-center gap-2">
              <Mail className="w-5 h-5" style={{ color: TEAL }} />
              Et maintenant ?
            </h2>
            <ul className="space-y-3 text-sm text-[#232F3E]/75">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#008296]/10 text-[#008296] text-xs font-bold shrink-0">1</span>
                <span>Vérifie ta boîte email (et tes spams) pour ma réponse.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#008296]/10 text-[#008296] text-xs font-bold shrink-0">2</span>
                <span>Télécharge le kit ambassadeur pour préparer ton contenu.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#008296]/10 text-[#008296] text-xs font-bold shrink-0">3</span>
                <span>Suis-nous pour voir les autres ambassadeurs en action.</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/influenceurs">
              <Button
                variant="outline"
                className="border-[#008296] text-[#008296] font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Retour au programme
              </Button>
            </Link>
            <a href="/kit-influenceurs.pdf" download>
              <Button
                style={{ background: ORANGE, color: TEXT }}
                className="font-semibold"
              >
                <FileText className="w-4 h-4 mr-1.5" />
                Télécharger le kit
              </Button>
            </a>
          </div>

          {/* Micro-copy */}
          <p className="text-xs text-[#232F3E]/40">
            Une question urgente ? Écris-moi directement sur georges@ebookstudio.fr
          </p>
        </div>
      </section>
    </FunnelLayout>
  );
};

export default InfluenceursConfirmationPage;
