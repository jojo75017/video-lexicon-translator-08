import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Headphones, BookOpen, Mic, Volume2, Settings, Zap, HelpCircle, Share2, ChevronDown, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const audioModules = [
  { 
    id: 1, 
    title: "Introduction au Générateur Audio", 
    description: "Vue d'ensemble et technologie ElevenLabs",
    icon: Headphones,
    color: "from-purple-500 to-violet-500",
    content: [
      {
        subtitle: "🎧 Présentation",
        text: "Le générateur de livres audio utilise la technologie ElevenLabs pour transformer vos textes en audio haute définition avec des voix ultra-réalistes. C'est l'outil idéal pour créer des audiobooks professionnels à partir de vos ebooks."
      },
      {
        subtitle: "✨ Fonctionnalités principales",
        items: [
          "Aucune limite de caractères : Textes découpés automatiquement en segments de 5000 caractères",
          "Assemblage automatique : Fusion intelligente en un seul fichier audio continu",
          "Qualité HD : Audio MP3 professionnel 44.1kHz, 128kbps",
          "20 voix disponibles : 9 féminines et 11 masculines, toutes en qualité studio",
          "Multi-langue : Modèle multilingue v2 pour une prononciation parfaite du français"
        ]
      },
      {
        subtitle: "🚀 Avantages clés",
        items: [
          "Pas besoin de studio d'enregistrement ni de narrateur professionnel",
          "Génération en quelques secondes par section",
          "Résultat professionnel prêt pour la distribution",
          "Coût réduit comparé à un enregistrement traditionnel (500-5000€)"
        ]
      }
    ]
  },
  { 
    id: 2, 
    title: "Les 20 Voix Disponibles", 
    description: "Catalogue complet des voix féminines et masculines",
    icon: Mic,
    color: "from-pink-500 to-rose-500",
    content: [
      {
        subtitle: "👩 Voix Féminines (9)",
        items: [
          "Aria — Claire et polyvalente ✓ Pour enfants",
          "Sarah — Douce et narrative ✓ Pour enfants",
          "Laura — Chaleureuse et engageante ✓ Pour enfants",
          "Charlotte — Britannique élégante",
          "Alice — Britannique confiante",
          "Matilda — Chaleureuse et américaine ✓ Pour enfants",
          "Jessica — Expressive et américaine",
          "Lily — Britannique narrative ✓ Pour enfants",
          "River — Non-binaire américain"
        ]
      },
      {
        subtitle: "👨 Voix Masculines (11)",
        items: [
          "Roger — Profonde et autoritaire (Business, Thriller)",
          "Charlie — Australien décontracté (Podcast, Blog)",
          "George — Britannique chaleureux ✓ Pour enfants",
          "Callum — Transatlantique (Documentaire)",
          "Liam — Américain articulé ✓ Pour enfants",
          "Will — Américain amical ✓ Pour enfants",
          "Eric — Américain amical (Guide pratique)",
          "Chris — Américain décontracté (Podcast)",
          "Brian — Américain profond (Non-fiction)",
          "Daniel — Britannique autoritaire (Business)",
          "Bill — Américain fiable (Formation)"
        ]
      },
      {
        subtitle: "💡 Conseil",
        text: "Testez toujours 2-3 voix sur un extrait de votre texte avant de générer l'intégralité du livre audio. Chaque voix a une personnalité unique qui convient mieux à certains genres."
      }
    ]
  },
  { 
    id: 3, 
    title: "Types de Contenu Audio", 
    description: "Sections, ebook complet et texte personnalisé",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    content: [
      {
        subtitle: "📚 Option A : Sections prédéfinies",
        text: "Générez l'audio section par section à partir de votre ebook. Chaque chapitre, la préface et la conclusion sont convertis individuellement pour un contrôle précis.",
        items: ["Préface et introduction", "Chapitres individuels avec sous-chapitres", "Conclusion et épilogue", "Lecture séquentielle automatique"]
      },
      {
        subtitle: "📖 Option B : Ebook complet",
        text: "Collez l'intégralité de votre texte et laissez le système le découper intelligemment en segments. Idéal pour les textes déjà finalisés.",
        items: ["Découpage automatique aux fins de phrases", "Aucune perte de contexte entre les segments", "Assemblage transparent"]
      },
      {
        subtitle: "✏️ Option C : Texte personnalisé",
        text: "Idéal pour tester une voix, générer un extrait promotionnel ou créer un audio à partir d'un texte libre. Pas besoin d'avoir un ebook complet."
      }
    ]
  },
  { 
    id: 4, 
    title: "Guide d'Utilisation Étape par Étape", 
    description: "De l'accès au téléchargement final",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    content: [
      {
        subtitle: "Étape 1 — Accéder au générateur",
        text: "Ouvrez votre projet ebook depuis le générateur, puis cliquez sur l'onglet « Audio ». Le contenu de votre ebook est automatiquement chargé."
      },
      {
        subtitle: "Étape 2 — Choisir le type de contenu",
        text: "Sélectionnez entre les sections prédéfinies (préface, chapitres, conclusion), l'ebook complet ou un texte personnalisé."
      },
      {
        subtitle: "Étape 3 — Sélectionner une voix",
        text: "Parcourez les 20 voix disponibles. Filtrez par genre (féminin/masculin) ou par compatibilité enfants. Écoutez un aperçu si possible."
      },
      {
        subtitle: "Étape 4 — Générer l'audio",
        text: "Cliquez sur « Générer ». Le texte est découpé automatiquement en segments de 5000 caractères maximum. Chaque segment prend 1-2 secondes."
      },
      {
        subtitle: "Étape 5 — Écouter et télécharger",
        text: "Utilisez le lecteur intégré pour écouter le résultat. Téléchargez en MP3 haute qualité. Vous pouvez aussi mettre en ligne votre livre audio directement depuis la plateforme."
      }
    ]
  },
  { 
    id: 5, 
    title: "Optimisation de la Qualité Audio", 
    description: "Ponctuation, structure et bonnes pratiques",
    icon: Settings,
    color: "from-green-500 to-emerald-500",
    content: [
      {
        subtitle: "📝 Ponctuation correcte",
        items: [
          "Points (.) = pauses longues et naturelles",
          "Virgules (,) = pauses courtes pour reprendre son souffle",
          "Points de suspension (...) = pauses dramatiques ou hésitations",
          "Points d'exclamation (!) = emphase et émotion",
          "Points d'interrogation (?) = intonation montante naturelle"
        ]
      },
      {
        subtitle: "📄 Structure du texte",
        items: [
          "Paragraphes courts et logiques (3-5 phrases)",
          "Phrases de moins de 50 mots pour une diction claire",
          "Utilisez des tirets (—) pour les dialogues",
          "Évitez les parenthèses longues qui cassent le rythme"
        ]
      },
      {
        subtitle: "⚠️ À éviter absolument",
        items: [
          "Émojis (non prononcés, créent des silences)",
          "Abréviations ambiguës (écrivez « Monsieur » pas « M. »)",
          "URLs et adresses email (décrivez-les plutôt)",
          "Tableaux et listes à puces (reformulez en prose)",
          "Caractères spéciaux (@, #, %, etc.)"
        ]
      }
    ]
  },
  { 
    id: 6, 
    title: "Choisir la Bonne Voix", 
    description: "Recommandations par type de contenu",
    icon: Volume2,
    color: "from-indigo-500 to-purple-500",
    content: [
      {
        subtitle: "🎭 Recommandations par genre",
        items: [
          "Roman / Fiction → Sarah, Lily, George (voix narratives et immersives)",
          "Guide pratique / How-to → Aria, Brian, Liam (voix claires et articulées)",
          "Livre pour enfants → Matilda, Will, George (voix chaleureuses et rassurantes)",
          "Business / Non-fiction → Roger, Daniel, Charlotte (voix autoritaires et crédibles)",
          "Podcast / Blog → Charlie, Jessica, Chris (voix décontractées et engageantes)",
          "Thriller / Suspense → Roger, Daniel (voix profondes et captivantes)",
          "Romance → Sarah, Laura, Charlotte (voix douces et émotionnelles)",
          "Développement personnel → Aria, Liam, Matilda (voix inspirantes)"
        ]
      },
      {
        subtitle: "🎯 Règle d'or",
        text: "La voix doit correspondre à votre audience cible, pas à vos préférences personnelles. Un livre pour ados de 14 ans ne devrait pas avoir la voix grave de Roger, même si vous l'aimez bien !"
      }
    ]
  },
  { 
    id: 7, 
    title: "Spécifications Techniques", 
    description: "Limites, capacités et temps de génération",
    icon: Settings,
    color: "from-slate-500 to-gray-500",
    content: [
      {
        subtitle: "⚙️ Capacités techniques",
        items: [
          "Limite par requête : 5000 caractères (découpage automatique)",
          "Découpage intelligent aux fins de phrases (pas de coupure en plein mot)",
          "Format de sortie : MP3 haute qualité (44.1kHz, 128kbps)",
          "Modèle IA : ElevenLabs Multilingual v2",
          "Stockage cloud inclus pour mise en ligne"
        ]
      },
      {
        subtitle: "⏱️ Temps de génération estimés",
        items: [
          "< 5 000 caractères → 2-5 secondes",
          "10 000 caractères → 5-10 secondes",
          "50 000 caractères → 30-60 secondes",
          "100 000 caractères → 1-2 minutes",
          "Livre complet (200 pages) → 3-5 minutes"
        ]
      },
      {
        subtitle: "📊 Équivalences",
        text: "1 page standard ≈ 2000 caractères ≈ 300 mots ≈ 2 minutes d'audio. Un livre de 200 pages = environ 6-7 heures d'écoute."
      }
    ]
  },
  { 
    id: 8, 
    title: "FAQ et Résolution des Problèmes", 
    description: "Questions fréquentes et solutions",
    icon: HelpCircle,
    color: "from-red-500 to-pink-500",
    content: [
      {
        subtitle: "❓ Questions fréquentes",
        items: [
          "Q: Puis-je générer un livre audio complet ? → Oui ! Le découpage et l'assemblage sont automatiques.",
          "Q: L'audio est-il professionnel ? → Oui, qualité studio ElevenLabs, identique aux audiobooks commerciaux.",
          "Q: Comment améliorer la prononciation ? → Écrivez phonétiquement. Ex: « Lovable » → « Loveabeul ».",
          "Q: Puis-je changer de voix en cours de route ? → Oui, mais gardez la même voix pour la cohérence.",
          "Q: Les droits d'utilisation ? → Vous êtes propriétaire de l'audio généré, usage commercial inclus."
        ]
      },
      {
        subtitle: "🔧 Problèmes courants et solutions",
        items: [
          "L'audio ne se génère pas → Vérifiez votre connexion internet et réessayez",
          "Qualité médiocre → Essayez une autre voix, vérifiez la ponctuation du texte",
          "Prononciation incorrecte → Réécrivez le mot phonétiquement",
          "Audio trop rapide → Ajoutez des pauses (points, virgules, points de suspension)",
          "Coupure au milieu d'un mot → Le système coupe aux fins de phrases, vérifiez la ponctuation"
        ]
      }
    ]
  },
  { 
    id: 9, 
    title: "Distribution et Mise en Ligne", 
    description: "Hébergement, partage et plateformes de distribution",
    icon: Share2,
    color: "from-teal-500 to-cyan-500",
    content: [
      {
        subtitle: "🌐 Mise en ligne sur EbookStudio",
        text: "Hébergez votre livre audio directement sur la plateforme ! Chaque audiobook obtient une page publique avec lecteur intégré et un code d'intégration pour l'embarquer sur votre site.",
        items: [
          "Page publique avec lecteur audio professionnel",
          "Lien partageable sur les réseaux sociaux",
          "Code embed pour intégrer le lecteur sur votre site",
          "Statistiques de lecture (nombre d'écoutes)"
        ]
      },
      {
        subtitle: "📦 Distribution externe",
        items: [
          "Audible (Amazon) — La plus grande plateforme d'audiobooks",
          "Apple Books — Écosystème Apple",
          "Google Play Livres — Android et web",
          "Kobo — International",
          "Spotify (via distributeur type Findaway) — Streaming",
          "Votre propre site web — Vente directe avec meilleure marge"
        ]
      },
      {
        subtitle: "🎯 Workflow recommandé",
        text: "1. Finalisez votre texte → 2. Vérifiez la ponctuation → 3. Testez sur un extrait → 4. Choisissez la voix définitive → 5. Générez l'intégralité → 6. Mettez en ligne → 7. Distribuez et partagez !"
      }
    ]
  }
];

export const EbookFormationAudio: React.FC = () => {
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  const toggleComplete = (moduleId: number) => {
    setCompletedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const progress = Math.round((completedModules.length / audioModules.length) * 100);

  const exportFormationPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let yPos = 20;

    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = pdf.splitTextToSize(text, maxWidth);
      for (const line of lines) {
        if (yPos > 275) { pdf.addPage(); yPos = 20; }
        pdf.text(line, margin, yPos);
        yPos += fontSize * 0.45;
      }
      yPos += 3;
    };

    // Title page
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Formation Complete', pageWidth / 2, 60, { align: 'center' });
    pdf.setFontSize(18);
    pdf.text('Generateur de Livres Audio', pageWidth / 2, 75, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Technologie ElevenLabs - 20 voix HD', pageWidth / 2, 90, { align: 'center' });
    
    // TOC
    pdf.addPage();
    yPos = 20;
    addText('TABLE DES MATIERES', 16, true);
    yPos += 5;
    audioModules.forEach((module, index) => {
      addText(`Module ${index + 1}: ${module.title}`, 11);
      addText(`   ${module.description}`, 9);
      yPos += 2;
    });

    // Module content
    audioModules.forEach((module, index) => {
      pdf.addPage();
      yPos = 20;
      addText(`MODULE ${index + 1}`, 14, true);
      addText(module.title.toUpperCase(), 16, true);
      yPos += 5;
      addText(module.description, 11);
      yPos += 5;
      
      module.content.forEach(section => {
        addText(section.subtitle, 12, true);
        if (section.text) addText(section.text, 10);
        if (section.items) {
          section.items.forEach(item => addText('• ' + item, 10));
        }
        yPos += 3;
      });
    });

    pdf.save('Formation_Complete_Generateur_Audio.pdf');
    toast.success('Formation Audio exportée en PDF !');
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-background to-violet-500/5">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
                <Headphones className="h-4 w-4" />
                Formation Audio
                <Badge variant="secondary" className="bg-white/20 text-white text-[10px]">
                  {audioModules.length} Modules
                </Badge>
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Maîtrisez le Générateur de Livres Audio
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Technologie ElevenLabs • 20 voix HD • Mise en ligne incluse
              </p>
            </div>
            <Button 
              onClick={exportFormationPDF}
              className="gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
            >
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{completedModules.length}/{audioModules.length} modules terminés</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-purple-500 to-violet-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Accordion 
            type="multiple" 
            value={openModules}
            onValueChange={setOpenModules}
            className="space-y-3"
          >
            {audioModules.map((module, index) => {
              const Icon = module.icon;
              const isCompleted = completedModules.includes(module.id);
              
              return (
                <AccordionItem 
                  key={module.id} 
                  value={module.id.toString()}
                  className="border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="hover:no-underline px-4 py-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shrink-0`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">Module {index + 1}</span>
                          {isCompleted && (
                            <Badge className="bg-green-500/10 text-green-600 text-[10px] px-1.5 py-0 border-green-500/20">
                              <CheckCircle2 className="h-3 w-3 mr-0.5" />
                              Terminé
                            </Badge>
                          )}
                        </div>
                        <p className="font-semibold text-sm">{module.title}</p>
                        <p className="text-xs text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-4 pb-4 space-y-4">
                      {module.content.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-2">
                          <h4 className="font-semibold text-sm">{section.subtitle}</h4>
                          {section.text && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{section.text}</p>
                          )}
                          {section.items && (
                            <ul className="space-y-1.5 ml-1">
                              {section.items.map((item, iIdx) => (
                                <li key={iIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-purple-500 mt-1 shrink-0">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                      
                      {/* Mark as complete button */}
                      <div className="pt-3 border-t">
                        <Button 
                          variant={isCompleted ? "outline" : "default"}
                          size="sm"
                          className={`gap-2 ${!isCompleted ? `bg-gradient-to-r ${module.color} hover:opacity-90` : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleComplete(module.id); }}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {isCompleted ? 'Marquer non terminé' : 'Marquer comme terminé'}
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Completion banner */}
          {progress === 100 && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
              <Headphones className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <p className="font-semibold text-green-700 dark:text-green-400">🎉 Félicitations !</p>
              <p className="text-sm text-muted-foreground">Vous avez terminé la formation complète. Vous êtes prêt à créer des livres audio professionnels !</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookFormationAudio;
