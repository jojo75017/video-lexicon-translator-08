import React, { useState, useMemo, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, Target, FileText, Sparkles, TrendingUp, Clock, 
  Smartphone, Tablet, Monitor, BookMarked, CheckCircle2, AlertCircle,
  Palette, Eye, RotateCcw
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Environment, PresentationControls } from '@react-three/drei';
import { Chapter } from '@/hooks/useSubscriptionGeneration';

interface EbookDashboardProps {
  ebookTitle: string;
  authorName: string;
  chapters: Chapter[];
  preface: string;
  conclusion: string;
  coverImageUrl?: string;
  targetWordsPerChapter: number;
  kdpDescription?: string;
  kdpKeywords?: string;
}

// Composant 3D du livre
const Book3D = ({ 
  title, 
  author, 
  coverColor = '#6366f1',
  progress = 0 
}: { 
  title: string; 
  author: string; 
  coverColor?: string;
  progress?: number;
}) => {
  const spineWidth = 0.15 + (progress / 100) * 0.25;
  
  return (
    <group rotation={[0, -0.3, 0]}>
      {/* Couverture avant */}
      <mesh position={[spineWidth / 2, 0, 0.01]}>
        <boxGeometry args={[2, 3, 0.02]} />
        <meshStandardMaterial color={coverColor} roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Tranche */}
      <mesh position={[-0.99 + spineWidth / 2, 0, 0]}>
        <boxGeometry args={[spineWidth, 3, 2]} />
        <meshStandardMaterial color={coverColor} roughness={0.4} metalness={0.05} />
      </mesh>
      
      {/* Pages intérieures */}
      <mesh position={[spineWidth / 2, 0, -0.01]}>
        <boxGeometry args={[1.96, 2.96, spineWidth * 0.9]} />
        <meshStandardMaterial color="#f8f8f0" roughness={0.8} />
      </mesh>
      
      {/* Couverture arrière */}
      <mesh position={[spineWidth / 2, 0, -spineWidth - 0.01]}>
        <boxGeometry args={[2, 3, 0.02]} />
        <meshStandardMaterial color={coverColor} roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Titre sur la couverture */}
      <Text
        position={[spineWidth / 2 + 0.1, 0.5, 0.03]}
        fontSize={0.15}
        color="white"
        maxWidth={1.6}
        textAlign="center"
        font="/fonts/inter-bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        {title || 'Mon Ebook'}
      </Text>
      
      {/* Auteur */}
      <Text
        position={[spineWidth / 2 + 0.1, -0.8, 0.03]}
        fontSize={0.1}
        color="rgba(255,255,255,0.9)"
        maxWidth={1.6}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {author || 'Auteur'}
      </Text>
      
      {/* Titre sur la tranche */}
      <Text
        position={[-0.99 + spineWidth / 2, 0, 1.01]}
        fontSize={0.08}
        color="white"
        rotation={[0, Math.PI / 2, Math.PI / 2]}
        maxWidth={2.5}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {title || 'Mon Ebook'}
      </Text>
    </group>
  );
};

// Composant aperçu responsive
const ResponsivePreview = ({ 
  content, 
  device 
}: { 
  content: string; 
  device: 'mobile' | 'tablet' | 'kindle' | 'desktop';
}) => {
  const dimensions = {
    mobile: { width: 180, height: 320, name: 'Mobile', icon: Smartphone },
    tablet: { width: 280, height: 380, name: 'Tablette', icon: Tablet },
    kindle: { width: 220, height: 320, name: 'Kindle', icon: BookMarked },
    desktop: { width: 360, height: 280, name: 'Desktop', icon: Monitor },
  };

  const { width, height, name, icon: Icon } = dimensions[device];
  
  const fontSizes = {
    mobile: 'text-[8px]',
    tablet: 'text-[10px]',
    kindle: 'text-[9px] font-serif',
    desktop: 'text-[11px]',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{name}</span>
      </div>
      <div 
        className={`bg-background border-4 border-foreground/20 rounded-lg overflow-hidden shadow-lg ${
          device === 'kindle' ? 'bg-[#f5f5dc]' : ''
        }`}
        style={{ width, height }}
      >
        <div className={`p-2 h-full overflow-y-auto ${fontSizes[device]} leading-relaxed`}>
          <div className={device === 'kindle' ? 'text-gray-800' : 'text-foreground'}>
            {content || 'Prévisualisez votre contenu ici...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const EbookDashboard: React.FC<EbookDashboardProps> = ({
  ebookTitle,
  authorName,
  chapters,
  preface,
  conclusion,
  coverImageUrl,
  targetWordsPerChapter,
  kdpDescription,
  kdpKeywords,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'kindle' | 'desktop'>('kindle');
  const [coverColor, setCoverColor] = useState('#6366f1');
  const [showAllDevices, setShowAllDevices] = useState(false);

  // Calcul des statistiques
  const stats = useMemo(() => {
    const totalChapters = chapters.length;
    const chaptersWithContent = chapters.filter(c => c.content && c.content.length > 50).length;
    const subChaptersTotal = chapters.reduce((acc, c) => acc + c.subChapters.length, 0);
    const subChaptersWithContent = chapters.reduce(
      (acc, c) => acc + c.subChapters.filter(sc => sc.content && sc.content.length > 50).length, 
      0
    );
    
    const totalWords = chapters.reduce((acc, c) => {
      const chapterWords = c.content ? c.content.split(/\s+/).length : 0;
      const subChapterWords = c.subChapters.reduce(
        (subAcc, sc) => subAcc + (sc.content ? sc.content.split(/\s+/).length : 0), 
        0
      );
      return acc + chapterWords + subChapterWords;
    }, 0);
    
    const prefaceWords = preface ? preface.split(/\s+/).length : 0;
    const conclusionWords = conclusion ? conclusion.split(/\s+/).length : 0;
    const grandTotalWords = totalWords + prefaceWords + conclusionWords;
    
    const targetWords = totalChapters * targetWordsPerChapter;
    const progressPercent = targetWords > 0 ? Math.min(100, (grandTotalWords / targetWords) * 100) : 0;
    
    const estimatedPages = Math.ceil(grandTotalWords / 250);
    const estimatedReadingTime = Math.ceil(grandTotalWords / 200);

    return {
      totalChapters,
      chaptersWithContent,
      subChaptersTotal,
      subChaptersWithContent,
      totalWords: grandTotalWords,
      targetWords,
      progressPercent,
      estimatedPages,
      estimatedReadingTime,
      hasPreface: preface.length > 50,
      hasConclusion: conclusion.length > 50,
      hasKdpDescription: (kdpDescription?.length || 0) > 50,
      hasKdpKeywords: (kdpKeywords?.length || 0) > 10,
    };
  }, [chapters, preface, conclusion, targetWordsPerChapter, kdpDescription, kdpKeywords]);

  // Contenu pour l'aperçu
  const previewContent = useMemo(() => {
    if (chapters.length === 0) return '';
    const firstChapter = chapters[0];
    const content = firstChapter.content || firstChapter.subChapters[0]?.content || '';
    return content.substring(0, 500) + (content.length > 500 ? '...' : '');
  }, [chapters]);

  const colorOptions = [
    { color: '#6366f1', name: 'Indigo' },
    { color: '#ec4899', name: 'Rose' },
    { color: '#10b981', name: 'Émeraude' },
    { color: '#f59e0b', name: 'Ambre' },
    { color: '#3b82f6', name: 'Bleu' },
    { color: '#8b5cf6', name: 'Violet' },
    { color: '#ef4444', name: 'Rouge' },
    { color: '#1f2937', name: 'Noir' },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec titre du projet */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{ebookTitle || 'Mon Projet Ebook'}</h2>
          <p className="text-muted-foreground">par {authorName || 'Auteur'}</p>
        </div>
        <Badge variant={stats.progressPercent >= 100 ? 'default' : 'secondary'} className="text-lg px-4 py-2">
          {Math.round(stats.progressPercent)}% complet
        </Badge>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mockup 3D */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Mockup 3D de votre livre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] bg-gradient-to-br from-background to-muted rounded-lg">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <Suspense fallback={null}>
                  <PresentationControls
                    global
                    rotation={[0.13, 0.1, 0]}
                    polar={[-0.4, 0.4]}
                    azimuth={[-1, 0.75]}
                    config={{ mass: 2, tension: 400 }}
                    snap={{ mass: 4, tension: 400 }}
                  >
                    <Book3D 
                      title={ebookTitle} 
                      author={authorName}
                      coverColor={coverColor}
                      progress={stats.progressPercent}
                    />
                  </PresentationControls>
                  <Environment preset="city" />
                </Suspense>
                <OrbitControls enableZoom={true} enablePan={false} />
              </Canvas>
            </div>
            
            {/* Sélecteur de couleur */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <Palette className="h-4 w-4" />
                Couleur de couverture
              </p>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map(({ color, name }) => (
                  <button
                    key={color}
                    onClick={() => setCoverColor(color)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      coverColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    title={name}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques de progression */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progression en temps réel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Barre de progression principale */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progression globale</span>
                <span className="text-sm text-muted-foreground">
                  {stats.totalWords.toLocaleString()} / {stats.targetWords.toLocaleString()} mots
                </span>
              </div>
              <Progress value={stats.progressPercent} className="h-3" />
            </div>

            {/* Grille de stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stats.estimatedPages}</p>
                <p className="text-xs text-muted-foreground">Pages estimées</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stats.estimatedReadingTime}</p>
                <p className="text-xs text-muted-foreground">Min de lecture</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stats.chaptersWithContent}/{stats.totalChapters}</p>
                <p className="text-xs text-muted-foreground">Chapitres rédigés</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stats.subChaptersWithContent}/{stats.subChaptersTotal}</p>
                <p className="text-xs text-muted-foreground">Sous-chapitres</p>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <p className="text-sm font-medium mb-3">Checklist de publication</p>
              <div className="space-y-2">
                {[
                  { label: 'Préface rédigée', done: stats.hasPreface },
                  { label: 'Conclusion rédigée', done: stats.hasConclusion },
                  { label: 'Description KDP', done: stats.hasKdpDescription },
                  { label: 'Mots-clés KDP', done: stats.hasKdpKeywords },
                  { label: 'Tous les chapitres', done: stats.chaptersWithContent === stats.totalChapters && stats.totalChapters > 0 },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2 text-sm">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className={done ? 'text-muted-foreground line-through' : ''}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aperçu Responsive */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Aperçu responsive
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={showAllDevices ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowAllDevices(!showAllDevices)}
              >
                {showAllDevices ? 'Vue unique' : 'Tous les appareils'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showAllDevices ? (
            <div className="flex flex-wrap justify-center gap-6 py-4">
              {(['mobile', 'tablet', 'kindle', 'desktop'] as const).map((device) => (
                <ResponsivePreview key={device} content={previewContent} device={device} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Sélecteur d'appareil */}
              <div className="flex justify-center gap-2">
                {[
                  { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                  { id: 'tablet', icon: Tablet, label: 'Tablette' },
                  { id: 'kindle', icon: BookMarked, label: 'Kindle' },
                  { id: 'desktop', icon: Monitor, label: 'Desktop' },
                ].map(({ id, icon: Icon, label }) => (
                  <Button
                    key={id}
                    variant={selectedDevice === id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDevice(id as any)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
              
              {/* Aperçu */}
              <div className="flex justify-center py-4">
                <ResponsivePreview content={previewContent} device={selectedDevice} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conseil du jour */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">Conseil du jour</p>
              <p className="text-sm text-muted-foreground">
                {stats.progressPercent < 30 
                  ? "Commencez par rédiger une ébauche rapide de chaque chapitre avant de peaufiner les détails."
                  : stats.progressPercent < 70
                  ? "Vous avancez bien ! Pensez à relire vos chapitres précédents pour maintenir la cohérence."
                  : stats.progressPercent < 100
                  ? "La ligne d'arrivée est proche ! Concentrez-vous sur la conclusion et les derniers ajustements."
                  : "Félicitations ! Votre ebook est complet. N'oubliez pas de vérifier l'orthographe et la mise en page finale."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
