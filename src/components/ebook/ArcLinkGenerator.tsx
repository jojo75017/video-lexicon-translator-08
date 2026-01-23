import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link2, QrCode, Copy, Check, BookOpen, ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";

interface ArcLinkGeneratorProps {
  ebookTitle?: string;
  authorName?: string;
  genre?: string;
}

const ArcLinkGenerator = ({ 
  ebookTitle = "Mon livre", 
  authorName = "L'auteur",
  genre = "Fiction"
}: ArcLinkGeneratorProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState(ebookTitle);
  const [customAuthor, setCustomAuthor] = useState(authorName);
  const [customGenre, setCustomGenre] = useState(genre);

  // Generate the ARC signup URL with parameters
  const baseUrl = window.location.origin;
  const arcUrl = `${baseUrl}/arc-signup?author=${encodeURIComponent(customAuthor)}&book=${encodeURIComponent(customTitle)}&genre=${encodeURIComponent(customGenre)}`;

  // QR Code URL using external service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(arcUrl)}&bgcolor=FFFBEB&color=D97706`;

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success("Copié dans le presse-papier !");
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error("Erreur lors de la copie");
    }
  };

  // HTML snippet for ebook integration
  const htmlSnippet = `<!-- Invitation ARC à intégrer dans votre ebook -->
<div style="text-align: center; padding: 30px; margin: 40px 0; background: linear-gradient(135deg, #FEF3C7, #FFEDD5); border-radius: 12px; border: 2px solid #F59E0B;">
  <h3 style="color: #92400E; margin: 0 0 10px 0; font-size: 1.3em;">📚 Aimez-vous ce livre ?</h3>
  <p style="color: #78350F; margin: 0 0 15px 0;">Rejoignez mon équipe de lecteurs VIP et recevez mes prochains livres en avant-première !</p>
  <a href="${arcUrl}" style="display: inline-block; background: linear-gradient(to right, #F59E0B, #EA580C); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
    ⭐ Rejoindre l'équipe ARC
  </a>
  <p style="color: #92400E; font-size: 0.8em; margin: 15px 0 0 0;">Gratuit • Livres en avant-première • Avis honnête uniquement</p>
</div>`;

  // Plain text version for print books
  const plainTextSnippet = `═══════════════════════════════════════════
📚 REJOIGNEZ MON ÉQUIPE DE LECTEURS VIP
═══════════════════════════════════════════

Vous avez aimé "${customTitle}" ?

Recevez mes prochains livres GRATUITEMENT 
en avant-première en rejoignant mon équipe 
de lecteurs ARC (Advance Review Copy) !

👉 Inscrivez-vous ici :
${arcUrl}

En échange, laissez simplement un avis 
honnête le jour du lancement.

Merci de votre soutien !
${customAuthor}
═══════════════════════════════════════════`;

  // Markdown version
  const markdownSnippet = `---

## 📚 Rejoignez mon équipe de lecteurs VIP

**Vous avez aimé "${customTitle}" ?**

Recevez mes prochains livres **gratuitement en avant-première** en rejoignant mon équipe de lecteurs ARC !

👉 **[Cliquez ici pour vous inscrire](${arcUrl})**

En échange, laissez simplement un avis honnête le jour du lancement.

*Merci de votre soutien !*  
— ${customAuthor}

---`;

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-amber-600" />
            Générateur de lien ARC
          </CardTitle>
          <CardDescription>
            Créez un lien personnalisé à intégrer dans vos ebooks pour recruter des lecteurs ARC
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du livre</Label>
              <Input
                id="title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Mon livre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Nom d'auteur</Label>
              <Input
                id="author"
                value={customAuthor}
                onChange={(e) => setCustomAuthor(e.target.value)}
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                placeholder="Fiction, Romance..."
              />
            </div>
          </div>

          {/* Generated URL */}
          <div className="space-y-2">
            <Label>Lien d'inscription généré</Label>
            <div className="flex gap-2">
              <Input value={arcUrl} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                onClick={() => handleCopy(arcUrl, "url")}
                className="flex-shrink-0"
              >
                {copied === "url" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(arcUrl, "_blank")}
                className="flex-shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Options */}
      <Tabs defaultValue="qrcode" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="qrcode" className="flex items-center gap-1">
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">QR Code</span>
          </TabsTrigger>
          <TabsTrigger value="html" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">HTML</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Texte</span>
          </TabsTrigger>
          <TabsTrigger value="markdown" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Markdown</span>
          </TabsTrigger>
        </TabsList>

        {/* QR Code Tab */}
        <TabsContent value="qrcode">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">QR Code pour livres imprimés</CardTitle>
              <CardDescription>
                Idéal pour les livres papier - les lecteurs scannent et s'inscrivent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code ARC" 
                    className="w-48 h-48"
                  />
                </div>
                <div className="space-y-3 text-center md:text-left">
                  <p className="text-sm text-gray-600">
                    Faites un clic droit sur le QR code pour le sauvegarder, puis intégrez-le dans votre livre imprimé.
                  </p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = qrCodeUrl;
                        link.download = `qr-arc-${customTitle.replace(/\s+/g, '-')}.png`;
                        link.click();
                      }}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Télécharger le QR Code
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 text-sm text-amber-800">
                <strong>💡 Conseil :</strong> Placez ce QR code à la fin de votre livre avec un texte comme "Scannez pour rejoindre mon équipe de lecteurs VIP"
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HTML Tab */}
        <TabsContent value="html">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Code HTML pour ebooks</CardTitle>
              <CardDescription>
                À intégrer dans vos fichiers EPUB/MOBI pour ebooks numériques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={htmlSnippet}
                  readOnly
                  className="font-mono text-xs h-64"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(htmlSnippet, "html")}
                >
                  {copied === "html" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Aperçu :</strong>
                </p>
                <div 
                  className="mt-3 bg-white rounded-lg p-4"
                  dangerouslySetInnerHTML={{ __html: htmlSnippet }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plain Text Tab */}
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Version texte simple</CardTitle>
              <CardDescription>
                Pour livres imprimés ou formats qui n'acceptent pas le HTML
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={plainTextSnippet}
                  readOnly
                  className="font-mono text-sm h-64"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(plainTextSnippet, "text")}
                >
                  {copied === "text" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Markdown Tab */}
        <TabsContent value="markdown">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Version Markdown</CardTitle>
              <CardDescription>
                Pour les plateformes qui supportent le Markdown (Gumroad, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={markdownSnippet}
                  readOnly
                  className="font-mono text-sm h-64"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(markdownSnippet, "markdown")}
                >
                  {copied === "markdown" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-amber-800 mb-3">📍 Où placer cette invitation ?</h4>
          <ul className="text-sm text-amber-700 space-y-2">
            <li>• <strong>Ebook :</strong> À la fin du dernier chapitre, avant la conclusion ou les remerciements</li>
            <li>• <strong>Livre papier :</strong> Sur la dernière page ou dans les pages bonus</li>
            <li>• <strong>Site web :</strong> Sur votre page auteur ou page de livres</li>
            <li>• <strong>Newsletter :</strong> Dans vos emails de remerciement post-achat</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArcLinkGenerator;
