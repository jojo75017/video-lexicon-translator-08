import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, ChevronLeft, ChevronRight, Headphones, BookOpen, Mic, Volume2, Settings, Zap, HelpCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const audioModules = [
  { 
    id: 1, 
    title: "Introduction au Générateur Audio", 
    description: "Vue d'ensemble et technologie ElevenLabs",
    icon: Headphones,
    color: "from-purple-500 to-violet-500"
  },
  { 
    id: 2, 
    title: "Les 20 Voix Disponibles", 
    description: "Catalogue complet des voix féminines et masculines",
    icon: Mic,
    color: "from-pink-500 to-rose-500"
  },
  { 
    id: 3, 
    title: "Types de Contenu Audio", 
    description: "Sections, ebook complet et texte personnalisé",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500"
  },
  { 
    id: 4, 
    title: "Guide d'Utilisation Étape par Étape", 
    description: "De l'accès au téléchargement final",
    icon: Zap,
    color: "from-amber-500 to-orange-500"
  },
  { 
    id: 5, 
    title: "Optimisation de la Qualité Audio", 
    description: "Ponctuation, structure et bonnes pratiques",
    icon: Settings,
    color: "from-green-500 to-emerald-500"
  },
  { 
    id: 6, 
    title: "Choisir la Bonne Voix", 
    description: "Recommandations par type de contenu",
    icon: Volume2,
    color: "from-indigo-500 to-purple-500"
  },
  { 
    id: 7, 
    title: "Spécifications Techniques", 
    description: "Limites, capacités et temps de génération",
    icon: Settings,
    color: "from-slate-500 to-gray-500"
  },
  { 
    id: 8, 
    title: "FAQ et Résolution des Problèmes", 
    description: "Questions fréquentes et solutions",
    icon: HelpCircle,
    color: "from-red-500 to-pink-500"
  },
  { 
    id: 9, 
    title: "Distribution et Plateformes", 
    description: "Audible, Apple Books, Spotify et plus",
    icon: Share2,
    color: "from-teal-500 to-cyan-500"
  }
];

const voicesFeminines = [
  { name: "Aria", description: "Claire et polyvalente", forChildren: true },
  { name: "Sarah", description: "Douce et narrative", forChildren: true },
  { name: "Laura", description: "Chaleureuse et engageante", forChildren: true },
  { name: "Charlotte", description: "Britannique élégante", forChildren: false },
  { name: "Alice", description: "Britannique confiante", forChildren: false },
  { name: "Matilda", description: "Chaleureuse et américaine", forChildren: true },
  { name: "Jessica", description: "Expressive et américaine", forChildren: false },
  { name: "Lily", description: "Britannique narrative", forChildren: true },
  { name: "River", description: "Non-binaire américain", forChildren: false },
];

const voicesMasculines = [
  { name: "Roger", description: "Profonde et autoritaire", forChildren: false },
  { name: "Charlie", description: "Australien décontracté", forChildren: false },
  { name: "George", description: "Britannique chaleureux", forChildren: true },
  { name: "Callum", description: "Transatlantique", forChildren: false },
  { name: "Liam", description: "Américain articulé", forChildren: true },
  { name: "Will", description: "Américain amical", forChildren: true },
  { name: "Eric", description: "Américain amical", forChildren: false },
  { name: "Chris", description: "Américain décontracté", forChildren: false },
  { name: "Brian", description: "Américain profond", forChildren: false },
  { name: "Daniel", description: "Britannique autoritaire", forChildren: false },
  { name: "Bill", description: "Américain fiable", forChildren: false },
];

export const EbookFormationAudio: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const previewPages = [
    {
      title: "Page de Couverture",
      content: (
        <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/10 h-full flex flex-col items-center justify-center p-8 rounded-lg">
          <Headphones className="w-16 h-16 text-purple-500 mb-4" />
          <h2 className="text-2xl font-bold text-center mb-4">Formation Complète</h2>
          <h3 className="text-xl text-purple-600 dark:text-purple-400 mb-2">Générateur de Livres Audio</h3>
          <p className="text-muted-foreground text-sm">Technologie ElevenLabs - 20 voix HD</p>
        </div>
      )
    },
    {
      title: "Table des Matières",
      content: (
        <div className="p-6 h-full overflow-auto">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">TABLE DES MATIÈRES</h3>
          <ul className="space-y-2 text-sm">
            {audioModules.map((module, index) => (
              <li key={module.id} className="flex gap-2">
                <span className="font-semibold text-purple-600 dark:text-purple-400">Module {index + 1}:</span>
                <span>{module.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    // Module 1: Introduction
    {
      title: "Module 1: Introduction au Générateur Audio",
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge className="mb-2 bg-gradient-to-r from-purple-500 to-violet-500">Module 1</Badge>
          <h3 className="text-lg font-bold mb-2">INTRODUCTION AU GÉNÉRATEUR AUDIO</h3>
          <p className="text-sm text-muted-foreground mb-4">Vue d'ensemble et technologie ElevenLabs</p>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">🎧 Présentation</h4>
              <p className="text-muted-foreground">Le générateur de livres audio utilise la technologie ElevenLabs pour transformer vos textes en audio haute définition avec des voix ultra-réalistes.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">✨ Fonctionnalités principales</h4>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li><strong>Aucune limite de caractères</strong> : Textes découpés automatiquement</li>
                <li><strong>Assemblage automatique</strong> : Fusion en un seul fichier audio</li>
                <li><strong>Qualité HD</strong> : Audio MP3 professionnel</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    // Module 2: Les 20 Voix
    {
      title: "Module 2: Les 20 Voix Disponibles",
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge className="mb-2 bg-gradient-to-r from-pink-500 to-rose-500">Module 2</Badge>
          <h3 className="text-lg font-bold mb-2">LES 20 VOIX DISPONIBLES</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">👩 Voix Féminines (9)</h4>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {voicesFeminines.map(v => (
                  <div key={v.name} className="p-1 bg-pink-50 dark:bg-pink-950/30 rounded">
                    <span className="font-medium">{v.name}</span>
                    {v.forChildren && <span className="text-green-500 ml-1">✓</span>}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">👨 Voix Masculines (11)</h4>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {voicesMasculines.map(v => (
                  <div key={v.name} className="p-1 bg-blue-50 dark:bg-blue-950/30 rounded">
                    <span className="font-medium">{v.name}</span>
                    {v.forChildren && <span className="text-green-500 ml-1">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Module 3: Types de Contenu
    {
      title: "Module 3: Types de Contenu Audio",
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-cyan-500">Module 3</Badge>
          <h3 className="text-lg font-bold mb-2">TYPES DE CONTENU AUDIO</h3>
          
          <div className="space-y-4 text-sm">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-1">📚 Option A : Sections prédéfinies</h4>
              <ul className="list-disc pl-4 text-muted-foreground text-xs">
                <li>Préface</li>
                <li>Chapitres individuels</li>
                <li>Conclusion</li>
              </ul>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-1">📖 Option B : Ebook complet</h4>
              <p className="text-muted-foreground text-xs">Collez l'intégralité de votre texte - découpage automatique</p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-1">✏️ Option C : Texte personnalisé</h4>
              <p className="text-muted-foreground text-xs">Idéal pour des extraits ou tests</p>
            </div>
          </div>
        </div>
      )
    },
    // Module 4: Guide d'utilisation
    {
      title: "Module 4: Guide d'Utilisation",
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge className="mb-2 bg-gradient-to-r from-amber-500 to-orange-500">Module 4</Badge>
          <h3 className="text-lg font-bold mb-2">GUIDE D'UTILISATION ÉTAPE PAR ÉTAPE</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex gap-3 items-start">
              <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span>
              <div>
                <p className="font-medium">Accéder au générateur</p>
                <p className="text-xs text-muted-foreground">Ouvrez votre projet → Onglet "Audio"</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span>
              <div>
                <p className="font-medium">Choisir le type de contenu</p>
                <p className="text-xs text-muted-foreground">Sections, ebook complet ou texte libre</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span>
              <div>
                <p className="font-medium">Sélectionner une voix</p>
                <p className="text-xs text-muted-foreground">Filtrez par genre ou "Pour enfants"</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span>
              <div>
                <p className="font-medium">Générer l'audio</p>
                <p className="text-xs text-muted-foreground">1-2 secondes par partie de 4500 caractères</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">5</span>
              <div>
                <p className="font-medium">Écouter et télécharger</p>
                <p className="text-xs text-muted-foreground">Lecteur intégré + Export MP3</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Module 5: Optimisation
    {
      title: "Module 5: Optimisation de la Qualité",
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge className="mb-2 bg-gradient-to-r from-green-500 to-emerald-500">Module 5</Badge>
          <h3 className="text-lg font-bold mb-2">OPTIMISATION DE LA QUALITÉ AUDIO</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">📝 Ponctuation correcte</h4>
              <ul className="list-disc pl-4 text-muted-foreground text-xs space-y-1">
                <li>Points = pauses longues</li>
                <li>Virgules = pauses courtes</li>
                <li>Points de suspension = pauses dramatiques</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">📄 Structure du texte</h4>
              <ul className="list-disc pl-4 text-muted-foreground text-xs space-y-1">
                <li>Paragraphes logiques</li>
                <li>Phrases &lt;50 mots</li>
                <li>Tirets pour les dialogues</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">⚠️ À éviter</h4>
              <ul className="list-disc pl-4 text-muted-foreground text-xs space-y-1">
                <li>Émojis (non prononcés)</li>
                <li>Abréviations mal interprétées</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    // Module 6: Choisir la voix
    {
      title: "Module 6: Choisir la Bonne Voix",
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge className="mb-2 bg-gradient-to-r from-indigo-500 to-purple-500">Module 6</Badge>
          <h3 className="text-lg font-bold mb-2">CHOISIR LA BONNE VOIX</h3>
          
          <div className="space-y-2 text-sm">
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <span className="font-medium">Roman/Fiction</span>
              <span className="text-xs text-muted-foreground">Sarah, Lily, George</span>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <span className="font-medium">Guide pratique</span>
              <span className="text-xs text-muted-foreground">Aria, Brian, Liam</span>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <span className="font-medium">Livre enfant</span>
              <span className="text-xs text-muted-foreground">Matilda, Will, George</span>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <span className="font-medium">Business</span>
              <span className="text-xs text-muted-foreground">Roger, Daniel, Charlotte</span>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <span className="font-medium">Podcast/Blog</span>
              <span className="text-xs text-muted-foreground">Charlie, Jessica, Chris</span>
            </div>
          </div>
        </div>
      )
    },
    // Module 7: Spécifications
    {
      title: "Module 7: Spécifications Techniques",
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge className="mb-2 bg-gradient-to-r from-slate-500 to-gray-500">Module 7</Badge>
          <h3 className="text-lg font-bold mb-2">SPÉCIFICATIONS TECHNIQUES</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">⚙️ Capacités</h4>
              <ul className="list-disc pl-4 text-muted-foreground text-xs space-y-1">
                <li>Limite par requête : 5000 caractères (auto)</li>
                <li>Découpage intelligent aux fins de phrases</li>
                <li>Format : MP3 haute qualité</li>
                <li>Modèle : ElevenLabs Multilingual v2</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">⏱️ Temps de génération</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between p-1 bg-muted/50 rounded">
                  <span>&lt;5 000 car.</span>
                  <span>2-5 sec</span>
                </div>
                <div className="flex justify-between p-1 bg-muted/50 rounded">
                  <span>10 000 car.</span>
                  <span>5-10 sec</span>
                </div>
                <div className="flex justify-between p-1 bg-muted/50 rounded">
                  <span>50 000 car.</span>
                  <span>30-60 sec</span>
                </div>
                <div className="flex justify-between p-1 bg-muted/50 rounded">
                  <span>100 000 car.</span>
                  <span>1-2 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Module 8: FAQ
    {
      title: "Module 8: FAQ et Résolution des Problèmes",
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge className="mb-2 bg-gradient-to-r from-red-500 to-pink-500">Module 8</Badge>
          <h3 className="text-lg font-bold mb-2">FAQ ET RÉSOLUTION DES PROBLÈMES</h3>
          
          <div className="space-y-3 text-sm">
            <div className="p-2 border rounded-lg">
              <p className="font-medium text-xs">Q: Puis-je générer un livre audio complet ?</p>
              <p className="text-xs text-muted-foreground">R: Oui ! Découpage et assemblage automatiques.</p>
            </div>
            <div className="p-2 border rounded-lg">
              <p className="font-medium text-xs">Q: L'audio est-il professionnel ?</p>
              <p className="text-xs text-muted-foreground">R: Oui, qualité studio ElevenLabs.</p>
            </div>
            <div className="p-2 border rounded-lg">
              <p className="font-medium text-xs">Q: Comment améliorer la prononciation ?</p>
              <p className="text-xs text-muted-foreground">R: Écrivez phonétiquement. Ex: "Lovable" → "Loveabeul"</p>
            </div>
            
            <h4 className="font-semibold mt-4 mb-2">🔧 Problèmes courants</h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Audio ne se génère pas</span>
                <span className="text-muted-foreground">→ Vérifiez connexion</span>
              </div>
              <div className="flex justify-between">
                <span>Qualité médiocre</span>
                <span className="text-muted-foreground">→ Essayez autre voix</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Module 9: Distribution
    {
      title: "Module 9: Distribution et Plateformes",
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge className="mb-2 bg-gradient-to-r from-teal-500 to-cyan-500">Module 9</Badge>
          <h3 className="text-lg font-bold mb-2">DISTRIBUTION ET PLATEFORMES</h3>
          
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground text-xs">Distribuez votre livre audio sur :</p>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 border rounded-lg text-center">
                <p className="font-medium text-xs">Audible</p>
                <p className="text-[10px] text-muted-foreground">(Amazon)</p>
              </div>
              <div className="p-2 border rounded-lg text-center">
                <p className="font-medium text-xs">Apple Books</p>
              </div>
              <div className="p-2 border rounded-lg text-center">
                <p className="font-medium text-xs">Google Play</p>
              </div>
              <div className="p-2 border rounded-lg text-center">
                <p className="font-medium text-xs">Kobo</p>
              </div>
              <div className="p-2 border rounded-lg text-center">
                <p className="font-medium text-xs">Spotify</p>
                <p className="text-[10px] text-muted-foreground">(via distributeur)</p>
              </div>
              <div className="p-2 border rounded-lg text-center">
                <p className="font-medium text-xs">Votre site web</p>
              </div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-lg mt-4">
              <p className="text-xs font-medium text-center">🎯 Workflow recommandé</p>
              <p className="text-[10px] text-muted-foreground text-center mt-1">
                Finalisez texte → Ponctuation → Test extrait → Voix définitive → Génération → Téléchargement → Publication
              </p>
            </div>
          </div>
        </div>
      )
    },
    // Récapitulatif
    {
      title: "Récapitulatif",
      content: (
        <div className="p-6 h-full">
          <h3 className="text-lg font-bold mb-4">RÉCAPITULATIF DES COMPÉTENCES</h3>
          <ul className="space-y-2 text-sm mb-6">
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Maîtrise du générateur audio ElevenLabs</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Connaissance des 20 voix HD</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Création de livres audio professionnels</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Optimisation de la qualité audio</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Choix stratégique des voix</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Distribution multi-plateformes</li>
          </ul>
          <div className="text-center p-4 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-lg">
            <Headphones className="w-8 h-8 mx-auto text-purple-500 mb-2" />
            <p className="text-sm font-medium">Félicitations !</p>
            <p className="text-xs text-muted-foreground">Vous êtes prêt à créer des livres audio de qualité professionnelle.</p>
          </div>
        </div>
      )
    }
  ];

  const totalPages = previewPages.length;

  const exportFormationPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let yPos = 20;

    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, isTitle: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = pdf.splitTextToSize(text, maxWidth);
      for (const line of lines) {
        if (yPos > 275) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += fontSize * 0.45;
      }
      yPos += isTitle ? 6 : 3;
    };

    // Page de titre
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Formation Complete', pageWidth / 2, 60, { align: 'center' });
    pdf.setFontSize(18);
    pdf.text('Generateur de Livres Audio', pageWidth / 2, 75, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Technologie ElevenLabs - 20 voix HD', pageWidth / 2, 90, { align: 'center' });
    
    // Table des matières
    pdf.addPage();
    yPos = 20;
    addText('TABLE DES MATIERES', 16, true, true);
    yPos += 5;
    
    audioModules.forEach((module, index) => {
      addText(`Module ${index + 1}: ${module.title}`, 11);
      addText(`   ${module.description}`, 9);
      yPos += 2;
    });

    // Contenu des modules
    audioModules.forEach((module, index) => {
      pdf.addPage();
      yPos = 20;
      addText(`MODULE ${index + 1}`, 14, true, true);
      addText(module.title.toUpperCase(), 16, true, true);
      yPos += 5;
      addText(module.description, 11);
      yPos += 10;
      addText('Contenu du module:', 12, true);
      addText('- Guide complet et detaille', 10);
      addText('- Captures d\'ecran explicatives', 10);
      addText('- Conseils et astuces', 10);
      addText('- Exercices pratiques', 10);
    });

    // Page finale
    pdf.addPage();
    yPos = 20;
    addText('RECAPITULATIF DES COMPETENCES', 16, true, true);
    yPos += 5;
    
    const competences = [
      'Maitrise du generateur audio ElevenLabs',
      'Connaissance des 20 voix HD',
      'Creation de livres audio professionnels',
      'Optimisation de la qualite audio',
      'Choix strategique des voix',
      'Distribution multi-plateformes'
    ];
    
    competences.forEach(comp => {
      addText('✓ ' + comp, 11);
    });

    pdf.save('Formation_Complete_Generateur_Audio.pdf');
    toast.success('Formation Audio exportée en PDF !');
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-purple-500" />
            Formation Complète - Générateur de Livres Audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Maîtrisez le générateur de livres audio avec la technologie ElevenLabs et ses 20 voix HD professionnelles.
          </p>

          {/* Liste des modules avec boutons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {audioModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <div 
                  key={module.id} 
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${module.color} shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{module.title}</p>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1 h-7 text-xs"
                      onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                    >
                      <BookOpen className="h-3 w-3" />
                      Détails
                    </Button>
                    <Button 
                      size="sm" 
                      className={`flex-1 gap-1 h-7 text-xs bg-gradient-to-r ${module.color} hover:opacity-90`}
                      onClick={() => {
                        setPreviewPage(index + 2);
                        setShowPreview(true);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                      Prévisualiser
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bouton principal */}
          <Button 
            onClick={() => { setPreviewPage(0); setShowPreview(true); }}
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
          >
            <Eye className="h-5 w-5" />
            Prévisualiser et Télécharger le PDF
          </Button>
        </CardContent>
      </Card>

      {/* Dialog de prévisualisation */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Prévisualisation - {previewPages[previewPage]?.title}</span>
              <span className="text-sm font-normal text-muted-foreground">
                Page {previewPage + 1} / {totalPages}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {/* Aperçu de la page */}
          <div className="border rounded-lg bg-white dark:bg-slate-950 text-foreground min-h-[400px] shadow-inner">
            {previewPages[previewPage]?.content}
          </div>

          {/* Navigation et actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPreviewPage(Math.max(0, previewPage - 1))}
                disabled={previewPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPreviewPage(Math.min(totalPages - 1, previewPage + 1))}
                disabled={previewPage === totalPages - 1}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Miniatures */}
            <div className="flex gap-1 overflow-x-auto max-w-xs">
              {previewPages.slice(0, 6).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPreviewPage(idx)}
                  className={`w-8 h-10 rounded border text-xs flex items-center justify-center transition-all ${
                    previewPage === idx 
                      ? 'border-purple-500 bg-purple-500/10 text-purple-500 font-bold' 
                      : 'border-muted hover:border-purple-500/50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              {previewPages.length > 6 && (
                <span className="text-xs text-muted-foreground self-center">+{previewPages.length - 6}</span>
              )}
            </div>

            <Button onClick={exportFormationPDF} className="gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600">
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EbookFormationAudio;
