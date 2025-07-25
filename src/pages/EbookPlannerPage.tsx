import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Plus, Trash2, FileText, Wand2, Settings, RotateCcw, ArrowLeft, 
  GripVertical, Split, Merge, Upload, Copy, ArrowUp, ArrowDown, Move 
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Chapter {
  id: string;
  title: string;
  subChapters: SubChapter[];
  content?: string;
}

interface SubChapter {
  id: string;
  title: string;
  content?: string;
}

interface SortableChapterProps {
  chapter: Chapter;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateContent: (id: string, content: string) => void;
  onAddSubChapter: (id: string) => void;
  onRemoveSubChapter: (chapterId: string, subChapterId: string) => void;
  onUpdateSubChapterTitle: (chapterId: string, subChapterId: string, title: string) => void;
  onMoveChapter: (id: string, direction: 'up' | 'down') => void;
  onDuplicateChapter: (id: string) => void;
  onSplitChapter: (id: string) => void;
  onGenerateChapterContent: (id: string) => void;
  onRemoveChapter: (id: string) => void;
  isGenerating: boolean;
  apiKey: string;
  totalChapters: number;
}

function SortableChapter({
  chapter,
  index,
  isSelected,
  onSelect,
  onUpdateTitle,
  onUpdateContent,
  onAddSubChapter,
  onRemoveSubChapter,
  onUpdateSubChapterTitle,
  onMoveChapter,
  onDuplicateChapter,
  onSplitChapter,
  onGenerateChapterContent,
  onRemoveChapter,
  isGenerating,
  apiKey,
  totalChapters
}: SortableChapterProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 space-y-3 transition-colors ${
        isDragging ? 'bg-accent' : ''
      } ${isSelected ? 'border-primary bg-primary/5' : ''}`}
    >
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(chapter.id)}
          className="mr-2"
        />
        <span className="font-medium">Chapitre {index + 1}:</span>
        <Input
          placeholder="Titre du chapitre"
          value={chapter.title}
          onClick={() => onSelect(chapter.id)}
          onChange={(e) => onUpdateTitle(chapter.id, e.target.value)}
          className={`flex-1 cursor-pointer transition-colors ${
            isSelected ? 'border-blue-500 bg-blue-50 text-blue-900' : ''
          }`}
        />
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveChapter(chapter.id, 'up')}
            disabled={index === 0}
            title="Déplacer vers le haut"
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveChapter(chapter.id, 'down')}
            disabled={index === totalChapters - 1}
            title="Déplacer vers le bas"
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicateChapter(chapter.id)}
            title="Dupliquer le chapitre"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSplitChapter(chapter.id)}
            disabled={isGenerating || !apiKey}
            title="Diviser automatiquement"
          >
            <Split className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGenerateChapterContent(chapter.id)}
            disabled={isGenerating || !apiKey || !chapter.title}
            title="Rédiger le chapitre (350 mots)"
          >
            <FileText className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemoveChapter(chapter.id)}
            title="Supprimer le chapitre"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="ml-6">
        {chapter.content ? (
          <div className="bg-muted p-3 rounded-lg mb-3 text-sm leading-relaxed whitespace-pre-wrap">
            {/* Rendu du contenu avec formatage */}
            {chapter.content.split('\n').map((line, lineIndex) => (
              <p key={lineIndex} className="mb-2">
                {line.split(/(\*[^*]+\*|"[^"]+"|(\([^)]+\)))/).map((part, partIndex) => {
                  if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={partIndex} className="font-medium text-primary">{part.slice(1, -1)}</em>;
                  }
                  if (part.startsWith('"') && part.endsWith('"')) {
                    return <span key={partIndex} className="text-accent-foreground font-medium">"{part.slice(1, -1)}"</span>;
                  }
                  if (part.startsWith('(') && part.endsWith(')')) {
                    return <span key={partIndex} className="text-muted-foreground italic">{part}</span>;
                  }
                  return part;
                })}
              </p>
            ))}
          </div>
        ) : (
          <Textarea
            placeholder="Contenu du chapitre (optionnel, pour la division automatique)"
            value=""
            onChange={(e) => onUpdateContent(chapter.id, e.target.value)}
            rows={3}
            className="mb-3"
          />
        )}
      </div>
      
      <div className="ml-6 space-y-2">
        {chapter.subChapters.map((subChapter, subIndex) => (
          <div key={subChapter.id} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {index + 1}.{subIndex + 1}:
            </span>
            <Input
              placeholder="Titre du sous-chapitre"
              value={subChapter.title}
              onChange={(e) => onUpdateSubChapterTitle(chapter.id, subChapter.id, e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemoveSubChapter(chapter.id, subChapter.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddSubChapter(chapter.id)}
          className="ml-8"
        >
          <Plus className="h-3 w-3 mr-1" />
          Ajouter un sous-chapitre
        </Button>
      </div>
    </div>
  );
}

const EbookPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [ebookTitle, setEbookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [preface, setPreface] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [numberOfChapters, setNumberOfChapters] = useState(8);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [importText, setImportText] = useState('');

  // Charger la clé API au démarrage
  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Sauvegarder automatiquement la clé API
  const updateApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    if (newApiKey.trim()) {
      localStorage.setItem('openai_api_key', newApiKey);
      toast.success('Clé API sauvegardée !');
    } else {
      localStorage.removeItem('openai_api_key');
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: '',
      subChapters: [],
      content: ''
    };
    setChapters([...chapters, newChapter]);
  };

  const removeChapter = (chapterId: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== chapterId));
    setSelectedChapters(selectedChapters.filter(id => id !== chapterId));
  };

  const updateChapterTitle = (chapterId: string, title: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId ? { ...chapter, title } : chapter
    ));
  };

  const updateChapterContent = (chapterId: string, content: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId ? { ...chapter, content } : chapter
    ));
  };

  const addSubChapter = (chapterId: string) => {
    const newSubChapter: SubChapter = {
      id: Date.now().toString(),
      title: '',
      content: ''
    };
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, subChapters: [...chapter.subChapters, newSubChapter] }
        : chapter
    ));
  };

  const removeSubChapter = (chapterId: string, subChapterId: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, subChapters: chapter.subChapters.filter(sub => sub.id !== subChapterId) }
        : chapter
    ));
  };

  const updateSubChapterTitle = (chapterId: string, subChapterId: string, title: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId 
        ? { 
            ...chapter, 
            subChapters: chapter.subChapters.map(sub => 
              sub.id === subChapterId ? { ...sub, title } : sub
            )
          }
        : chapter
    ));
  };

  // Nouvelle fonctionnalité : Glisser-déposer pour réorganiser les chapitres
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setChapters((chapters) => {
        const oldIndex = chapters.findIndex(chapter => chapter.id === active.id);
        const newIndex = chapters.findIndex(chapter => chapter.id === over?.id);

        const newChapters = arrayMove(chapters, oldIndex, newIndex);
        toast.success('Chapitres réorganisés !');
        return newChapters;
      });
    }
  };

  // Nouvelle fonctionnalité : Sélection de chapitres
  const toggleChapterSelection = (chapterId: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  // Nouvelle fonctionnalité : Fusion de chapitres sélectionnés
  const mergeSelectedChapters = () => {
    if (selectedChapters.length < 2) {
      toast.error('Sélectionnez au moins 2 chapitres à fusionner');
      return;
    }

    const chaptersToMerge = chapters.filter(c => selectedChapters.includes(c.id));
    const otherChapters = chapters.filter(c => !selectedChapters.includes(c.id));
    
    const mergedChapter: Chapter = {
      id: Date.now().toString(),
      title: `${chaptersToMerge[0].title} (fusionné)`,
      subChapters: chaptersToMerge.flatMap(c => c.subChapters),
      content: chaptersToMerge.map(c => c.content).join('\n\n')
    };

    // Trouve la position du premier chapitre sélectionné
    const firstSelectedIndex = chapters.findIndex(c => c.id === selectedChapters[0]);
    const newChapters = [...otherChapters];
    newChapters.splice(firstSelectedIndex, 0, mergedChapter);

    setChapters(newChapters);
    setSelectedChapters([]);
    toast.success(`${chaptersToMerge.length} chapitres fusionnés !`);
  };

  // Nouvelle fonctionnalité : Diviser un chapitre automatiquement
  const splitChapterAutomatically = async (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter || !chapter.content || !apiKey) {
      toast.error('Chapitre non trouvé, pas de contenu ou clé API manquante');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [{
            role: 'user',
            content: `Analyse ce contenu de chapitre et propose une division logique en sous-chapitres :

"${chapter.content}"

Réponds uniquement au format JSON:
{
  "subChapters": [
    {
      "title": "Titre du sous-chapitre 1",
      "content": "Contenu correspondant..."
    },
    {
      "title": "Titre du sous-chapitre 2", 
      "content": "Contenu correspondant..."
    }
  ]
}`
          }],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      const newSubChapters = result.subChapters.map((sub: any, index: number) => ({
        id: (Date.now() + index).toString(),
        title: sub.title,
        content: sub.content
      }));

      setChapters(chapters.map(c => 
        c.id === chapterId 
          ? { ...c, subChapters: [...c.subChapters, ...newSubChapters] }
          : c
      ));

      toast.success(`Chapitre divisé en ${newSubChapters.length} sous-chapitres !`);
    } catch (error) {
      toast.error('Erreur lors de la division automatique');
    } finally {
      setIsGenerating(false);
    }
  };

  // Nouvelle fonctionnalité : Import et analyse de texte
  const analyzeImportedText = async () => {
    if (!importText || !apiKey) {
      toast.error('Ajoutez du texte et configurez votre clé API');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [{
            role: 'user',
            content: `Analyse ce texte et suggère une structure de chapitres et sous-chapitres :

"${importText}"

Réponds uniquement au format JSON:
{
  "suggestedTitle": "Titre suggéré pour l'ebook",
  "chapters": [
    {
      "title": "Titre du chapitre",
      "content": "Extrait du contenu correspondant...",
      "subChapters": [
        {
          "title": "Sous-chapitre",
          "content": "Contenu du sous-chapitre..."
        }
      ]
    }
  ]
}`
          }],
          temperature: 0.7,
          max_tokens: 3000
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      if (result.suggestedTitle && !ebookTitle) {
        setEbookTitle(result.suggestedTitle);
      }

      const importedChapters = result.chapters.map((chapter: any, index: number) => ({
        id: (Date.now() + index).toString(),
        title: chapter.title,
        content: chapter.content,
        subChapters: chapter.subChapters?.map((sub: any, subIndex: number) => ({
          id: (Date.now() + index * 100 + subIndex).toString(),
          title: sub.title,
          content: sub.content
        })) || []
      }));

      setChapters([...chapters, ...importedChapters]);
      setImportText('');
      toast.success(`Structure analysée ! ${importedChapters.length} chapitres ajoutés.`);
    } catch (error) {
      toast.error('Erreur lors de l\'analyse du texte');
    } finally {
      setIsGenerating(false);
    }
  };

  // Nouvelle fonctionnalité : Dupliquer un chapitre
  const duplicateChapter = (chapterId: string) => {
    const chapterToDuplicate = chapters.find(c => c.id === chapterId);
    if (!chapterToDuplicate) return;

    const duplicatedChapter: Chapter = {
      ...chapterToDuplicate,
      id: Date.now().toString(),
      title: `${chapterToDuplicate.title} (copie)`,
      subChapters: chapterToDuplicate.subChapters.map(sub => ({
        ...sub,
        id: (Date.now() + Math.random()).toString()
      }))
    };

    const chapterIndex = chapters.findIndex(c => c.id === chapterId);
    const newChapters = [...chapters];
    newChapters.splice(chapterIndex + 1, 0, duplicatedChapter);
    setChapters(newChapters);
    toast.success('Chapitre dupliqué !');
  };

  // Nouvelle fonctionnalité : Déplacer un chapitre
  const moveChapter = (chapterId: string, direction: 'up' | 'down') => {
    const currentIndex = chapters.findIndex(c => c.id === chapterId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= chapters.length) return;

    const newChapters = [...chapters];
    [newChapters[currentIndex], newChapters[newIndex]] = [newChapters[newIndex], newChapters[currentIndex]];
    
    setChapters(newChapters);
    toast.success(`Chapitre déplacé vers le ${direction === 'up' ? 'haut' : 'bas'} !`);
  };

  // Nouvelle fonctionnalité : Rédiger un chapitre avec IA (350 mots)
  const generateChapterContent = async (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter || !chapter.title || !apiKey) {
      toast.error('Chapitre non trouvé, pas de titre ou clé API manquante');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [{
            role: 'user',
            content: `Rédige un chapitre complet de 350 mots exactement sur le sujet : "${chapter.title}".
            
Le contenu doit être :
- Informatif et engageant
- Bien structuré avec des paragraphes
- Professionnel mais accessible
- Exactement 350 mots
- Utiliser des éléments de formatage variés comme :
  * Du texte en *italique* pour l'emphase
  * Des "citations" entre guillemets 
  * Des commentaires entre parenthèses (comme des précisions)
  * Des expressions clés importantes
${ebookTitle ? `- En lien avec le thème général : "${ebookTitle}"` : ''}
${chapter.subChapters.length > 0 ? `- Couvrir ces sous-sujets : ${chapter.subChapters.map(sub => sub.title).join(', ')}` : ''}

Exemple de formatage attendu :
"L'art de la persuasion" est *fondamental* dans ce domaine. Comme le dit souvent (et à juste titre) les experts : "La première impression compte". Il faut donc *absolument* maîtriser ces techniques.

Réponds uniquement avec le texte du chapitre formaté, sans JSON.`
          }],
          temperature: 0.7,
          max_tokens: 600
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const generatedContent = data.choices[0].message.content.trim();
      
      setChapters(chapters.map(c => 
        c.id === chapterId 
          ? { ...c, content: generatedContent }
          : c
      ));

      toast.success('Chapitre de 350 mots généré !');
    } catch (error) {
      toast.error('Erreur lors de la génération du chapitre');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAutomaticPlan = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez entrer un titre ou mot-clé pour votre ebook');
      return;
    }

    if (!apiKey) {
      toast.error('Veuillez configurer votre clé API OpenAI');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [{
            role: 'user',
            content: `Crée un plan détaillé d'ebook sur le sujet: "${ebookTitle}". 
            
            Génère:
            1. ${authorName ? `Garde le nom d'auteur: "${authorName}"` : 'Un nom d\'auteur approprié'}
            2. Une préface d'au moins 500 caractères ou 350 mots, engageante et professionnelle
            3. Exactement ${numberOfChapters} chapitres avec des titres accrocheurs
            4. 2-4 sous-chapitres pour chaque chapitre
            5. Une conclusion/mot de la fin de 300 mots environ qui remercie le lecteur, résume les points clés, et inclut cette phrase : "Si vous avez apprécié ce livre, dites-le nous en commentaire. Voici mon email : [email@exemple.com]"
            
            Réponds uniquement au format JSON:
            {
              "author": "${authorName || 'Nom de l\'auteur'}",
              "preface": "Texte de la préface",
              "chapters": [
                {
                  "title": "Titre du chapitre",
                  "subChapters": ["Sous-chapitre 1", "Sous-chapitre 2", ...]
                }
              ],
              "conclusion": "Texte de la conclusion de 300 mots"
            }`
          }],
          temperature: 0.7,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const data = await response.json();
      const planData = JSON.parse(data.choices[0].message.content);
      
      // Remplir automatiquement tous les champs (en gardant l'auteur s'il était déjà rempli)
      if (!authorName) {
        setAuthorName(planData.author);
      }
      setPreface(planData.preface);
      setConclusion(planData.conclusion);
      
      const generatedChapters = planData.chapters.map((chapter: any, index: number) => ({
        id: (Date.now() + index).toString(),
        title: chapter.title,
        content: '',
        subChapters: chapter.subChapters.map((sub: string, subIndex: number) => ({
          id: (Date.now() + index * 100 + subIndex).toString(),
          title: sub,
          content: ''
        }))
      }));
      
      setChapters(generatedChapters);
      toast.success('Plan d\'ebook généré automatiquement !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération. Veuillez vérifier votre clé API OpenAI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPlan = () => {
    setEbookTitle('');
    setAuthorName('');
    setPreface('');
    setConclusion('');
    setChapters([]);
    setNumberOfChapters(8);
    setSelectedChapters([]);
    setImportText('');
    toast.success('Plan réinitialisé !');
  };

  // Templates prédéfinis par domaine
  const templates = {
    business: {
      title: "Stratégie Business Efficace",
      author: "Expert Business",
      preface: "Dans un monde en constante évolution, maîtriser les stratégies business est devenu essentiel. Ce guide vous accompagne vers le succès.",
      conclusion: "Vous avez maintenant toutes les clés pour réussir. Appliquez ces stratégies et transformez votre business !",
      chapters: [
        { title: "Analyse du marché et opportunités", subChapters: ["Étude de marché", "Identification des niches", "Analyse concurrentielle"] },
        { title: "Développement du business model", subChapters: ["Canvas business model", "Proposition de valeur", "Sources de revenus"] },
        { title: "Stratégies marketing et vente", subChapters: ["Marketing digital", "Funnel de vente", "Fidélisation client"] },
        { title: "Gestion financière et croissance", subChapters: ["Prévisions financières", "Levée de fonds", "Optimisation des coûts"] },
        { title: "Leadership et équipe", subChapters: ["Recrutement", "Management", "Culture d'entreprise"] }
      ]
    },
    guide: {
      title: "Guide Pratique Complet",
      author: "Guide Expert",
      preface: "Ce guide pratique vous accompagne étape par étape pour maîtriser votre sujet. Découvrez les méthodes qui fonctionnent vraiment.",
      conclusion: "Félicitations ! Vous avez maintenant toutes les compétences nécessaires. Passez à l'action et observez les résultats.",
      chapters: [
        { title: "Les fondamentaux à connaître", subChapters: ["Concepts de base", "Erreurs à éviter", "Prérequis essentiels"] },
        { title: "Préparation et planification", subChapters: ["Définir ses objectifs", "Créer un plan d'action", "Organiser ses ressources"] },
        { title: "Mise en pratique étape par étape", subChapters: ["Première étape", "Techniques avancées", "Optimisation"] },
        { title: "Résolution des problèmes courants", subChapters: ["Diagnostic des difficultés", "Solutions pratiques", "Cas d'étude"] },
        { title: "Perfectionnement et évolution", subChapters: ["Techniques avancées", "Veille et actualisation", "Communauté et ressources"] }
      ]
    },
    fiction: {
      title: "Histoire Captivante",
      author: "Auteur Fiction",
      preface: "Plongez dans une aventure extraordinaire où chaque page vous réserve des surprises. Laissez-vous emporter par cette histoire unique.",
      conclusion: "Cette aventure touche à sa fin, mais les émotions et les leçons resteront gravées. Merci de m'avoir accompagné dans ce voyage.",
      chapters: [
        { title: "Le commencement", subChapters: ["Présentation des personnages", "Le décor", "L'élément déclencheur"] },
        { title: "Premiers défis", subChapters: ["La découverte", "Les obstacles", "Les alliés inattendus"] },
        { title: "Le tournant", subChapters: ["La révélation", "Le conflit majeur", "Les enjeux grandissent"] },
        { title: "L'épreuve finale", subChapters: ["La confrontation", "Le sacrifice", "La résolution"] },
        { title: "L'épilogue", subChapters: ["Les conséquences", "Les nouveaux équilibres", "L'ouverture vers l'avenir"] }
      ]
    },
    memoir: {
      title: "Mon Parcours de Vie",
      author: "Votre Nom",
      preface: "Partager son histoire, c'est offrir un morceau de son âme. Ces pages retracent un parcours unique fait de joies, d'épreuves et d'apprentissages.",
      conclusion: "Chaque vie est une histoire unique qui mérite d'être racontée. J'espère que mon parcours vous inspirera dans le vôtre.",
      chapters: [
        { title: "Les origines", subChapters: ["Enfance", "Famille", "Premiers souvenirs"] },
        { title: "Formation et découvertes", subChapters: ["Études", "Premières passions", "Rencontres marquantes"] },
        { title: "Les défis de l'âge adulte", subChapters: ["Premiers emplois", "Relations importantes", "Épreuves surmontées"] },
        { title: "Accomplissements et leçons", subChapters: ["Réussites professionnelles", "Vie familiale", "Sagesse acquise"] },
        { title: "Réflexions et perspective", subChapters: ["Bilan de vie", "Valeurs importantes", "Messages aux générations futures"] }
      ]
    }
  };

  const applyTemplate = (templateType: keyof typeof templates) => {
    const template = templates[templateType];
    setEbookTitle(template.title);
    setAuthorName(template.author);
    setPreface(template.preface);
    setConclusion(template.conclusion);
    
    const templateChapters = template.chapters.map((chapter, index) => ({
      id: (Date.now() + index).toString(),
      title: chapter.title,
      content: '',
      subChapters: chapter.subChapters.map((sub, subIndex) => ({
        id: (Date.now() + index * 100 + subIndex).toString(),
        title: sub,
        content: ''
      }))
    }));
    
    setChapters(templateChapters);
    toast.success(`Template ${templateType} appliqué avec succès !`);
  };

  // Génération de table des matières avec pagination
  const generateTableOfContents = () => {
    if (chapters.length === 0) {
      toast.error('Ajoutez des chapitres pour générer la table des matières');
      return;
    }

    let toc = `📚 TABLE DES MATIÈRES\n`;
    toc += `${'='.repeat(50)}\n\n`;
    
    if (preface) {
      toc += `Préface ................................................ Page 3\n\n`;
    }
    
    let currentPage = preface ? 5 : 3;
    
    chapters.forEach((chapter, index) => {
      const chapterNumber = index + 1;
      const pageNumber = currentPage;
      
      // Titre du chapitre
      toc += `${chapterNumber}. ${chapter.title}`;
      const dots = Math.max(2, 45 - chapter.title.length - chapterNumber.toString().length);
      toc += `${'.'.repeat(dots)} Page ${pageNumber}\n`;
      
      // Sous-chapitres
      chapter.subChapters.forEach((subChapter, subIndex) => {
        const subNumber = `${chapterNumber}.${subIndex + 1}`;
        toc += `   ${subNumber} ${subChapter.title}`;
        const subDots = Math.max(2, 42 - subChapter.title.length - subNumber.length);
        toc += `${'.'.repeat(subDots)} Page ${pageNumber + subIndex + 1}\n`;
      });
      
      toc += '\n';
      currentPage += Math.max(5, chapter.subChapters.length + 3); // Estimation de pages par chapitre
    });
    
    if (conclusion) {
      toc += `Conclusion/Mot de la fin ................................ Page ${currentPage + 2}\n`;
    }
    
    toc += `\n${'='.repeat(50)}\n`;
    toc += `Total estimé: ${currentPage + (conclusion ? 4 : 2)} pages\n`;

    navigator.clipboard.writeText(toc);
    toast.success('Table des matières copiée dans le presse-papiers !');
  };

  const generatePlan = () => {
    if (!ebookTitle || !authorName || chapters.length === 0) {
      toast.error('Veuillez remplir au minimum le titre, l\'auteur et ajouter des chapitres');
      return;
    }

    let plan = `PLAN D'EBOOK\n\n`;
    plan += `Titre: ${ebookTitle}\n`;
    plan += `Auteur: ${authorName}\n\n`;
    
    if (preface) {
      plan += `PRÉFACE\n${preface}\n\n`;
    }
    
    plan += `SOMMAIRE\n\n`;
    
    chapters.forEach((chapter, index) => {
      plan += `${index + 1}. ${chapter.title}\n`;
      chapter.subChapters.forEach((subChapter, subIndex) => {
        plan += `   ${index + 1}.${subIndex + 1}. ${subChapter.title}\n`;
      });
      plan += '\n';
    });

    if (conclusion) {
      plan += `MOT DE LA FIN\n${conclusion}\n\n`;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(plan);
    toast.success('Plan d\'ebook copié dans le presse-papiers !');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={() => navigate('/dashboard')} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">🚀 Générateur de Plan d'Ebook Avancé</h1>
          {ebookTitle && (
            <p className="text-lg text-muted-foreground mt-1">Sujet : {ebookTitle}</p>
          )}
        </div>
      </div>

      {/* Encart pour contenu lié à l'ebook - VISIBLE */}
      <div className="mb-8 mt-6">
        <Card className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-primary shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <Label htmlFor="ebookContext" className="text-base font-semibold text-gray-900 mb-2 block">
                  📝 Description et contexte de votre ebook
                </Label>
                <Textarea
                  id="ebookContext"
                  placeholder="Décrivez le contexte, l'objectif, le public cible de votre ebook..."
                  className="min-h-[100px] bg-white border-2 border-primary/30 focus:ring-2 focus:ring-primary/40 text-base"
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  Cette description aidera l'IA à générer un contenu plus précis et adapté
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de création */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Configuration</CardTitle>
              <CardDescription>
                Configurez votre clé API OpenAI et les paramètres de génération
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="templates">📋 Templates</TabsTrigger>
                  <TabsTrigger value="api">🔑 API OpenAI</TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-1" />
                    Paramètres
                  </TabsTrigger>
                  <TabsTrigger value="import">
                    <Upload className="h-4 w-4 mr-1" />
                    Import IA
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="templates" className="mt-4">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">🚀 Modèles d'ebook prédéfinis</Label>
                    <p className="text-sm text-muted-foreground">Choisissez un template pour commencer rapidement avec une structure complète</p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/5"
                        onClick={() => applyTemplate('business')}
                      >
                        <div className="flex items-center gap-2 font-semibold">
                          💼 Template Business
                        </div>
                        <p className="text-xs text-muted-foreground text-left">
                          Stratégie business, analyse de marché, business model, marketing, leadership
                        </p>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/5"
                        onClick={() => applyTemplate('guide')}
                      >
                        <div className="flex items-center gap-2 font-semibold">
                          📚 Template Guide Pratique
                        </div>
                        <p className="text-xs text-muted-foreground text-left">
                          Structure pédagogique étape par étape, fondamentaux, mise en pratique
                        </p>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/5"
                        onClick={() => applyTemplate('fiction')}
                      >
                        <div className="flex items-center gap-2 font-semibold">
                          📖 Template Fiction
                        </div>
                        <p className="text-xs text-muted-foreground text-left">
                          Structure narrative classique : commencement, défis, tournant, résolution
                        </p>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/5"
                        onClick={() => applyTemplate('memoir')}
                      >
                        <div className="flex items-center gap-2 font-semibold">
                          ✍️ Template Biographie
                        </div>
                        <p className="text-xs text-muted-foreground text-left">
                          Parcours de vie : origines, formation, accomplissements, réflexions
                        </p>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="api" className="mt-4">
                  <div>
                    <Label htmlFor="apikey">Clé API OpenAI</Label>
                    <Input
                      id="apikey"
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => updateApiKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Obtenez votre clé sur <a href="https://platform.openai.com/api-keys" target="_blank" className="text-primary hover:underline">platform.openai.com</a>
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="chapters-range">Nombre de chapitres: {numberOfChapters}</Label>
                      <div className="mt-2">
                        <input
                          id="chapters-range"
                          type="range"
                          min="5"
                          max="20"
                          value={numberOfChapters}
                          onChange={(e) => setNumberOfChapters(parseInt(e.target.value))}
                          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>5 chapitres</span>
                          <span>20 chapitres</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="import" className="mt-4">
                  <div className="space-y-4">
                    <Label htmlFor="import-text">🧠 Importer du texte existant</Label>
                    <Textarea
                      id="import-text"
                      placeholder="Collez votre texte ici pour l'analyser et générer une structure automatiquement..."
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      rows={6}
                    />
                    <Button 
                      onClick={analyzeImportedText}
                      disabled={isGenerating || !importText || !apiKey}
                      className="w-full"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Analyse en cours...' : 'Analyser et structurer avec IA'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📖 Informations générales</CardTitle>
              <CardDescription>
                Renseignez les informations de base de votre ebook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de l'ebook</Label>
                <div className="flex gap-2">
                  <Input
                    id="title"
                    placeholder="Entrez le titre ou mot-clé de votre ebook"
                    value={ebookTitle}
                    onChange={(e) => setEbookTitle(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={generateAutomaticPlan}
                    disabled={isGenerating || !ebookTitle}
                    size="sm"
                  >
                    <Wand2 className="h-4 w-4 mr-1" />
                    {isGenerating ? 'Génération...' : 'Générer auto'}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="author">Nom de l'auteur</Label>
                <Input
                  id="author"
                  placeholder="Nom de l'auteur"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="preface">Préface (optionnel)</Label>
                <Textarea
                  id="preface"
                  placeholder="Rédigez votre préface..."
                  value={preface}
                  onChange={(e) => setPreface(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="conclusion">Mot de la fin / Conclusion (optionnel)</Label>
                <Textarea
                  id="conclusion"
                  placeholder="Rédigez votre conclusion avec remerciements et email de contact..."
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                📚 Chapitres Avancés
                <div className="flex gap-2">
                  {selectedChapters.length > 1 && (
                    <Button onClick={mergeSelectedChapters} size="sm" variant="outline">
                      <Merge className="h-4 w-4 mr-1" />
                      Fusionner ({selectedChapters.length})
                    </Button>
                  )}
                  <Button onClick={addChapter} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un chapitre
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                ✨ Glissez-déposez pour réorganiser • ✂️ Divisez automatiquement • 📋 Sélectionnez pour fusionner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={chapters.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {chapters.map((chapter, index) => (
                      <SortableChapter
                        key={chapter.id}
                        chapter={chapter}
                        index={index}
                        isSelected={selectedChapters.includes(chapter.id)}
                        onSelect={toggleChapterSelection}
                        onUpdateTitle={updateChapterTitle}
                        onUpdateContent={updateChapterContent}
                        onAddSubChapter={addSubChapter}
                        onRemoveSubChapter={removeSubChapter}
                        onUpdateSubChapterTitle={updateSubChapterTitle}
                        onMoveChapter={moveChapter}
                        onDuplicateChapter={duplicateChapter}
                        onSplitChapter={splitChapterAutomatically}
                        onGenerateChapterContent={generateChapterContent}
                        onRemoveChapter={removeChapter}
                        isGenerating={isGenerating}
                        apiKey={apiKey}
                        totalChapters={chapters.length}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Button onClick={generatePlan} className="flex-1" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                📋 Générer le plan d'ebook
              </Button>
              <Button onClick={resetPlan} variant="outline" size="lg">
                <RotateCcw className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            </div>
            <Button onClick={generateTableOfContents} variant="secondary" className="w-full" size="lg">
              <BookOpen className="h-4 w-4 mr-2" />
              📖 Générer la table des matières (avec pagination)
            </Button>
          </div>
        </div>

        {/* Aperçu du plan */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>👀 Aperçu du plan</CardTitle>
              <CardDescription>
                Voici à quoi ressemblera votre plan d'ebook
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg min-h-[400px] font-mono text-sm max-h-[600px] overflow-y-auto">
                {ebookTitle || authorName || chapters.length > 0 || preface || conclusion ? (
                  <div>
                    <div className="font-bold text-center mb-4">📖 PLAN D'EBOOK</div>
                    {ebookTitle && <div><strong>Titre:</strong> {ebookTitle}</div>}
                    {authorName && <div><strong>Auteur:</strong> {authorName}</div>}
                    
                    {preface && (
                      <div className="mt-4">
                        <div className="font-bold">📝 PRÉFACE</div>
                        <div className="text-xs mt-1">{preface}</div>
                      </div>
                    )}
                    
                    {chapters.length > 0 && (
                      <div className="mt-4">
                        <div className="font-bold mb-2">📚 SOMMAIRE</div>
                        {chapters.map((chapter, index) => (
                          <div key={chapter.id} className="mb-2">
                            <div className={`${selectedChapters.includes(chapter.id) ? 'bg-primary/20 px-1 rounded' : ''}`}>
                              {index + 1}. {chapter.title || 'Titre du chapitre'}
                            </div>
                            {chapter.subChapters.map((subChapter, subIndex) => (
                              <div key={subChapter.id} className="ml-4 text-xs">
                                {index + 1}.{subIndex + 1}. {subChapter.title || 'Titre du sous-chapitre'}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {conclusion && (
                      <div className="mt-4">
                        <div className="font-bold">🎯 MOT DE LA FIN</div>
                        <div className="text-xs mt-1">{conclusion}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center">
                    ✏️ Remplissez les informations pour voir l'aperçu du plan
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Légende d'aide pour le contenu */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <h3 className="text-sm font-medium text-foreground mb-2">💡 Conseils pour enrichir vos chapitres</h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Utilisez *des italiques* pour mettre l'accent sur des mots importants</p>
          <p>• Ajoutez "des citations" pour illustrer vos propos</p>
          <p>• Insérez (des commentaires explicatifs) pour clarifier des concepts</p>
          <p>• Structurez avec des paragraphes courts et des exemples concrets</p>
        </div>
      </div>
    </div>
  );
};

export default EbookPlannerPage;