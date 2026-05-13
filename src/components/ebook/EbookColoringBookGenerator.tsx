import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, RefreshCw, Sparkles, Baby, BookOpen, AlertTriangle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { useProjectSave } from '@/hooks/useProjectSave';
import { KdpQuickTools } from './KdpQuickTools';

interface ColoringPage {
  id: string;
  title: string;
  imageUrl: string;
}

interface ColoringBookGeneratorProps {
  ebookTitle?: string;
}

const THEMES: { value: string; label: string; subjects: string[] }[] = [
  {
    value: 'animals',
    label: '🐾 Animaux',
    subjects: [
      'un lion souriant', 'un éléphant joyeux', 'un papillon aux ailes déployées',
      'un chat avec une pelote', 'un chien qui court', 'une grenouille sur un nénuphar',
      'un hibou sur une branche', 'un lapin dans le jardin', 'un ours en peluche',
      'une girafe', 'un zèbre', 'un singe dans un arbre',
      'un panda qui mange du bambou', 'un koala', 'un pingouin sur la glace',
      'un perroquet', 'un flamant rose', 'une coccinelle sur une feuille',
      'une abeille et une fleur', 'un écureuil avec une noisette', 'un renard',
      'un hérisson', 'une chouette', 'un canard sur l\'eau',
      'un cheval qui galope', 'une vache dans un pré', 'un mouton',
      'un cochon', 'un coq', 'une poule avec ses poussins',
    ],
  },
  {
    value: 'fantasy',
    label: '🦄 Fantaisie',
    subjects: [
      'une licorne magique', 'un dragon gentil', 'une fée des fleurs',
      'un château de princesse', 'une sirène sur un rocher', 'un magicien',
      'une étoile filante', 'un arc-en-ciel avec des nuages', 'une baguette magique',
      'un chevalier et son cheval', 'un coffre au trésor', 'un dragon dans le ciel',
      'une couronne royale', 'une carrosse magique', 'un lutin dans la forêt',
      'une boule de cristal', 'un tapis volant', 'une potion magique',
      'un griffon', 'un phénix', 'une licorne et un arc-en-ciel',
      'une fée et son papillon', 'une princesse au balcon', 'un dragon endormi',
      'un nuage souriant', 'des étoiles dans le ciel', 'une lune avec un visage',
      'un soleil souriant', 'un arbre enchanté', 'une fontaine magique',
    ],
  },
  {
    value: 'nature',
    label: '🌸 Nature',
    subjects: [
      'une fleur épanouie', 'un grand arbre', 'un paysage de montagne',
      'un champ de tournesols', 'une cascade', 'un jardin fleuri',
      'une forêt avec des sapins', 'un lever de soleil', 'un coquelicot',
      'une marguerite', 'une rose', 'un bouquet de fleurs',
      'un arbre fruitier', 'une feuille d\'automne', 'un nid avec des œufs',
      'une rivière qui serpente', 'un pont sur la rivière', 'un champignon',
      'un trèfle à 4 feuilles', 'un pissenlit', 'une libellule sur une feuille',
      'un papillon dans un jardin', 'un escargot sur une feuille', 'une chenille',
      'une plage avec des coquillages', 'un nuage avec la pluie', 'une rainbow',
      'un cactus en fleur', 'un tournesol géant', 'un jardin potager',
    ],
  },
  {
    value: 'vehicles',
    label: '🚗 Véhicules',
    subjects: [
      'une voiture de course', 'un avion qui décolle', 'un bateau à voile',
      'un camion de pompier', 'une moto', 'un train',
      'un bus scolaire', 'un tracteur', 'un hélicoptère',
      'une fusée spatiale', 'un sous-marin', 'une montgolfière',
      'un vélo', 'une trottinette', 'un skateboard',
      'une ambulance', 'une voiture de police', 'un camion de chantier',
      'une voiture vintage', 'un kart', 'une jeep tout-terrain',
      'un yacht', 'un canoë', 'un ferry',
      'une calèche', 'une planche à voile', 'un voilier',
      'un avion en papier', 'un planeur', 'un ballon dirigeable',
    ],
  },
  {
    value: 'dinosaurs',
    label: '🦕 Dinosaures',
    subjects: [
      'un T-Rex rugissant', 'un Tricératops', 'un Brachiosaure au long cou',
      'un Stégosaure avec ses plaques', 'un Vélociraptor', 'un Ptérodactyle en vol',
      'un bébé dinosaure', 'un dinosaure avec un volcan', 'des œufs de dinosaure',
      'un Diplodocus', 'un Ankylosaure', 'un Spinosaure',
      'un dinosaure dans la jungle', 'un dinosaure et un palmier', 'une famille de dinosaures',
      'un dinosaure aquatique', 'un dinosaure mignon', 'un troupeau de dinosaures',
      'un dinosaure carnivore', 'un dinosaure herbivore', 'un Iguanodon',
      'un Parasaurolophus', 'un Allosaure', 'un Carnotaurus',
      'un dinosaure avec des plumes', 'un fossile de dinosaure', 'un squelette de T-Rex',
      'un dinosaure et son bébé', 'un dinosaure mangeant des feuilles', 'deux dinosaures qui jouent',
    ],
  },
  {
    value: 'ocean',
    label: '🐠 Océan',
    subjects: [
      'un poisson coloré', 'un dauphin qui saute', 'une tortue de mer',
      'une étoile de mer', 'un hippocampe', 'une méduse',
      'un poulpe', 'un crabe sur la plage', 'un requin',
      'une baleine', 'un coquillage', 'un récif de corail',
      'un poisson clown', 'un poisson-lune', 'un homard',
      'un banc de poissons', 'une raie manta', 'un lamantin',
      'un cheval de mer', 'un narval', 'une orque',
      'un phoque', 'une otarie', 'un pélican près de l\'eau',
      'un château de sable', 'une bouée colorée', 'des vagues de la mer',
      'un sous-marin avec des poissons', 'un trésor au fond de l\'océan', 'une sirène et son ami poisson',
    ],
  },
];

const AGE_GROUPS = [
  { value: '2-4', label: '2-4 ans (très simple)' },
  { value: '4-6', label: '4-6 ans (simple)' },
  { value: '6-8', label: '6-8 ans (moyen)' },
  { value: '8-12', label: '8-12 ans (détaillé)' },
];

const FORMATS: { value: string; label: string; w: number; h: number }[] = [
  { value: '8.5x11', label: '8.5×11" Letter (KDP standard)', w: 215.9, h: 279.4 },
  { value: '8.5x8.5', label: '8.5×8.5" Carré (KDP)', w: 215.9, h: 215.9 },
  { value: '8x10', label: '8×10" Portrait', w: 203.2, h: 254 },
  { value: 'a4', label: 'A4 européen', w: 210, h: 297 },
];

export const EbookColoringBookGenerator: React.FC<ColoringBookGeneratorProps> = ({ ebookTitle }) => {
  const { apiKey: userApiKey, isValid: isUserKeyValid } = useOpenAIConfig();
  const hasKey = Boolean(userApiKey) && isUserKeyValid === true;
  const { saveSpecializedProject } = useProjectSave();

  const [theme, setTheme] = useState('animals');
  const [ageGroup, setAgeGroup] = useState('4-6');
  const [numberOfPages, setNumberOfPages] = useState(25);
  const [bookFormat, setBookFormat] = useState('8.5x11');
  const [bookTitle, setBookTitle] = useState(ebookTitle || 'Mon livre de coloriage');

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const buildSubjects = (): string[] => {
    const themeData = THEMES.find(t => t.value === theme);
    const list = themeData?.subjects || [];
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return Array.from({ length: numberOfPages }, (_, i) => shuffled[i % shuffled.length]);
  };

  const generateOnePage = async (subject: string): Promise<ColoringPage | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-chapter-images', {
        body: {
          chapterTitle: subject,
          ebookTitle: bookTitle,
          style: 'line art sketch',
          ratio: 'square',
          quality: 'high',
          colorScheme: 'monochrome',
          useOpenAI: false,
          forceLovable: true,
          userGeminiApiKey: userApiKey || undefined,
          isColoringBook: true,
          coloringBookAgeGroup: ageGroup,
        },
      });
      if (error) throw error;
      const imageUrl = data?.imageUrl || data?.url;
      if (!imageUrl) return null;
      return { id: `p-${Date.now()}-${Math.random()}`, title: subject, imageUrl };
    } catch (e) {
      console.error('Erreur génération page:', e);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (!hasKey) {
      toast.error('Configurez votre clé Gemini dans Paramètres avant de générer');
      return;
    }
    setIsGenerating(true);
    setPages([]);
    setProgress(0);
    const subjects = buildSubjects();
    const out: ColoringPage[] = [];
    const BATCH = 5;
    toast.info(`Génération de ${numberOfPages} pages…`);
    for (let i = 0; i < subjects.length; i += BATCH) {
      const slice = subjects.slice(i, i + BATCH);
      const results = await Promise.all(slice.map(s => generateOnePage(s)));
      results.forEach(r => r && out.push(r));
      setPages([...out]);
      setProgress(Math.round(((i + slice.length) / subjects.length) * 100));
      if (i + BATCH < subjects.length) await new Promise(r => setTimeout(r, 800));
    }
    setIsGenerating(false);
    if (out.length === 0) toast.error('Aucune page générée. Vérifiez votre clé API.');
    else toast.success(`${out.length}/${numberOfPages} pages générées !`);
  };

  const regenerateOne = async (idx: number) => {
    const old = pages[idx];
    if (!old) return;
    setIsGenerating(true);
    const fresh = await generateOnePage(old.title);
    if (fresh) {
      const next = [...pages];
      next[idx] = fresh;
      setPages(next);
      toast.success('Page régénérée');
    }
    setIsGenerating(false);
  };

  const exportPDF = async () => {
    if (pages.length === 0) {
      toast.error('Générez d\'abord des pages');
      return;
    }
    setIsExporting(true);
    try {
      const fmt = FORMATS.find(f => f.value === bookFormat)!;
      const pdf = new jsPDF({
        orientation: fmt.w > fmt.h ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [fmt.w, fmt.h],
        compress: true,
      });
      const mTop = 12.7, mBot = 12.7, mOut = 12.7, mIn = 9.5;
      const cx = fmt.w / 2;

      // Title page
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(28);
      pdf.text(bookTitle, cx, mTop + 60, { align: 'center' });
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(16);
      pdf.text(`${pages.length} dessins a colorier`, cx, mTop + 90, { align: 'center' });
      pdf.setFontSize(13);
      pdf.text(`Pour les ${ageGroup} ans`, cx, mTop + 105, { align: 'center' });

      // Copyright
      pdf.addPage();
      pdf.setFontSize(10);
      const year = new Date().getFullYear();
      const copy = [
        `(c) ${year} - Tous droits reserves`,
        '',
        bookTitle,
        '',
        'Aucune partie de ce livre ne peut etre reproduite',
        'sans l\'autorisation ecrite prealable de l\'editeur.',
        '',
        'Cree avec EbookStudio - www.ebookstudio.fr',
      ];
      let y = mTop + 50;
      copy.forEach(l => { pdf.text(l, cx, y, { align: 'center' }); y += 7; });

      // Coloring pages
      for (let i = 0; i < pages.length; i++) {
        pdf.addPage();
        try {
          const r = await fetch(pages[i].imageUrl);
          const blob = await r.blob();
          const b64 = await new Promise<string>(res => {
            const fr = new FileReader();
            fr.onloadend = () => res(fr.result as string);
            fr.readAsDataURL(blob);
          });
          const availW = fmt.w - mOut - mIn;
          const availH = fmt.h - mTop - mBot - 10;
          const sz = Math.min(availW, availH);
          const x = (fmt.w - sz) / 2;
          pdf.addImage(b64, 'PNG', x, mTop + 2, sz, sz);
          pdf.setFontSize(8);
          pdf.text(`${i + 1}`, cx, fmt.h - mBot + 5, { align: 'center' });
        } catch (err) {
          console.error('image err', err);
          pdf.setFontSize(11);
          pdf.text(`[Image indisponible: ${pages[i].title}]`, cx, fmt.h / 2, { align: 'center' });
        }
      }

      const fileName = `livre-coloriage-${theme}-${Date.now()}.pdf`;
      pdf.save(fileName);
      toast.success(`PDF exporté: ${pages.length + 2} pages`);
    } catch (e) {
      console.error(e);
      toast.error('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const saveProject = async () => {
    setIsSaving(true);
    await saveSpecializedProject({
      title: bookTitle,
      project_type: 'coloring',
      target_audience: ageGroup,
      ebook_images: pages.map(p => ({ url: p.imageUrl, title: p.title })),
      number_of_chapters: pages.length,
      book_summary: `Livre de coloriage thème ${THEMES.find(t => t.value === theme)?.label || theme}`,
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-700">
            <Baby className="h-6 w-6" />
            Générateur Livre de Coloriage
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">Simple & rapide</Badge>
          </CardTitle>
          <CardDescription>
            4 réglages, 1 clic, et votre livre KDP est prêt.
          </CardDescription>
        </CardHeader>
      </Card>

      {!hasKey && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-amber-700">Clé Gemini requise</p>
              <p className="text-sm text-muted-foreground">
                Ajoutez votre clé API dans <strong>Paramètres</strong> pour générer les illustrations.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-2">
            <Label>Titre du livre</Label>
            <Input value={bookTitle} onChange={e => setBookTitle(e.target.value)} placeholder="Mon livre de coloriage" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Thème</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {THEMES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tranche d'âge</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AGE_GROUPS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format KDP</Label>
              <Select value={bookFormat} onValueChange={setBookFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FORMATS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nombre de pages : <span className="font-semibold">{numberOfPages}</span></Label>
              <Input
                type="number"
                min={10}
                max={50}
                value={numberOfPages}
                onChange={e => setNumberOfPages(Math.max(10, Math.min(50, parseInt(e.target.value) || 25)))}
              />
              <p className="text-xs text-muted-foreground">
                {numberOfPages < 24 ? '⚠️ KDP exige 24 pages minimum' : '✅ Compatible KDP'}
              </p>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !hasKey}
            size="lg"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Génération… {progress}%</>
            ) : (
              <><Sparkles className="mr-2 h-5 w-5" /> Générer {numberOfPages} pages</>
            )}
          </Button>
        </CardContent>
      </Card>

      {pages.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              {pages.length} pages générées
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={saveProject} variant="outline" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Sauvegarder
              </Button>
              <Button onClick={exportPDF} disabled={isExporting} className="bg-primary">
                {isExporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Exporter PDF KDP
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pages.map((p, i) => (
                <div key={p.id} className="border rounded-lg overflow-hidden bg-white">
                  <div className="relative aspect-square">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-contain" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => regenerateOne(i)} disabled={isGenerating}>
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-7 w-7" asChild>
                        <a href={p.imageUrl} download={`coloriage-${i + 1}.png`} target="_blank" rel="noopener noreferrer">
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="p-2 text-xs text-center text-muted-foreground truncate">{i + 1}. {p.title}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pages.length > 0 && (
        <KdpQuickTools
          productType="coloring"
          title={bookTitle}
          pageCount={pages.length + 2}
          targetAudience={ageGroup}
          theme={theme}
          defaultOpen={false}
        />
      )}
    </div>
  );
};

export default EbookColoringBookGenerator;
