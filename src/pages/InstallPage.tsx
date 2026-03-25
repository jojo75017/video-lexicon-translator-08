import { Smartphone, Download, Share, Plus, MoreVertical, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const InstallPage = () => {
  const navigate = useNavigate();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </Button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Installer EbookStudio
          </h1>
          <p className="text-muted-foreground text-lg">
            Accédez à l'app directement depuis votre écran d'accueil, comme une vraie application mobile.
          </p>
        </div>

        {/* iOS Instructions */}
        <Card className={`mb-6 border-2 ${isIOS ? 'border-primary shadow-lg' : 'border-border'}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-sm">iOS</div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">iPhone / iPad</h2>
                <p className="text-sm text-muted-foreground">Safari uniquement</p>
              </div>
              {isIOS && <span className="ml-auto text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">Votre appareil</span>}
            </div>
            <ol className="space-y-5">
              <Step number={1} icon={<Share className="w-5 h-5" />}>
                Ouvrez cette page dans <strong>Safari</strong>, puis appuyez sur le bouton <strong>Partager</strong> (carré avec une flèche vers le haut) en bas de l'écran.
              </Step>
              <Step number={2} icon={<Plus className="w-5 h-5" />}>
                Faites défiler et appuyez sur <strong>« Sur l'écran d'accueil »</strong>.
              </Step>
              <Step number={3} icon={<Download className="w-5 h-5" />}>
                Appuyez sur <strong>« Ajouter »</strong> en haut à droite. L'icône EbookStudio apparaît sur votre écran d'accueil !
              </Step>
            </ol>
          </CardContent>
        </Card>

        {/* Android Instructions */}
        <Card className={`mb-6 border-2 ${isAndroid ? 'border-primary shadow-lg' : 'border-border'}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold text-sm">A</div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Android</h2>
                <p className="text-sm text-muted-foreground">Chrome recommandé</p>
              </div>
              {isAndroid && <span className="ml-auto text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">Votre appareil</span>}
            </div>
            <ol className="space-y-5">
              <Step number={1} icon={<MoreVertical className="w-5 h-5" />}>
                Ouvrez cette page dans <strong>Chrome</strong>, puis appuyez sur les <strong>trois points</strong> (⋮) en haut à droite.
              </Step>
              <Step number={2} icon={<Download className="w-5 h-5" />}>
                Appuyez sur <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
              </Step>
              <Step number={3} icon={<Smartphone className="w-5 h-5" />}>
                Confirmez en appuyant sur <strong>« Installer »</strong>. L'app se lance en plein écran !
              </Step>
            </ol>
          </CardContent>
        </Card>

        {/* Desktop hint */}
        {!isIOS && !isAndroid && (
          <Card className="mb-6 border-2 border-primary shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">💻</div>
                <h2 className="text-xl font-semibold text-foreground">Ordinateur</h2>
              </div>
              <p className="text-muted-foreground">
                Sur Chrome ou Edge, cliquez sur l'icône <strong>d'installation</strong> (⊕) dans la barre d'adresse, puis confirmez. Ou ouvrez cette page sur votre téléphone pour l'installer sur mobile.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8 p-6 rounded-2xl bg-primary/5">
          <p className="text-sm text-muted-foreground">
            ✨ Une fois installée, l'app fonctionne en plein écran sans barre de navigateur — comme une vraie application mobile.
          </p>
        </div>
      </div>
    </div>
  );
};

const Step = ({ number, icon, children }: { number: number; icon: React.ReactNode; children: React.ReactNode }) => (
  <li className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
      {number}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1 text-muted-foreground">{icon}</div>
      <p className="text-foreground leading-relaxed">{children}</p>
    </div>
  </li>
);

export default InstallPage;
