import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Trash2, FileText, Wand2, Settings, RotateCcw, ArrowLeft, GripVertical, Split, Merge, Upload, Scissors, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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

const EbookPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [ebookTitle, setEbookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [preface, setPreface] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [numberOfChapters, setNumberOfChapters] = useState(8);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [importText, setImportText] = useState('');

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
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setChapters(items);
    toast.success('Chapitres réorganisés !');
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
          model: 'gpt-4o-mini',
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
          model: 'gpt-4o-mini',
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
          model: 'gpt-4o-mini',
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
          onClick={() => navigate('/')} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Générateur de Plan d'Ebook Avancé</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de création */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Configurez votre clé API OpenAI et les paramètres de génération
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="api" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="api">API OpenAI</TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-1" />
                    Paramètres
                  </TabsTrigger>
                  <TabsTrigger value="import">
                    <Upload className="h-4 w-4 mr-1" />
                    Import
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="api" className="mt-4">
                  <div>
                    <Label htmlFor="apikey">Clé API OpenAI</Label>
                    <Input
                      id="apikey"
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        localStorage.setItem('openai_api_key', e.target.value);
                      }}
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
                    <Label htmlFor="import-text">Importer du texte existant</Label>
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
                      {isGenerating ? 'Analyse en cours...' : 'Analyser et structurer'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
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
                Chapitres
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
            </CardHeader>
            <CardContent className="space-y-4">
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="chapters">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {chapters.map((chapter, index) => (
                        <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border rounded-lg p-4 space-y-3 transition-colors ${
                                snapshot.isDragging ? 'bg-accent' : ''
                              } ${selectedChapters.includes(chapter.id) ? 'border-primary bg-primary/5' : ''}`}
                            >
                              <div className="flex items-center gap-2">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                </div>
                                <input
                                  type="checkbox"
                                  checked={selectedChapters.includes(chapter.id)}
                                  onChange={() => toggleChapterSelection(chapter.id)}
                                  className="mr-2"
                                />
                                <span className="font-medium">Chapitre {index + 1}:</span>
                                <Input
                                  placeholder="Titre du chapitre"
                                  value={chapter.title}
                                  onChange={(e) => updateChapterTitle(chapter.id, e.target.value)}
                                  className="flex-1"
                                />
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => moveChapter(chapter.id, 'up')}
                                    disabled={index === 0}
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => moveChapter(chapter.id, 'down')}
                                    disabled={index === chapters.length - 1}
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => duplicateChapter(chapter.id)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => splitChapterAutomatically(chapter.id)}
                                    disabled={isGenerating || !apiKey}
                                  >
                                    <Split className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeChapter(chapter.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              <div className="ml-6">
                                <Textarea
                                  placeholder="Contenu du chapitre (optionnel, pour la division automatique)"
                                  value={chapter.content || ''}
                                  onChange={(e) => updateChapterContent(chapter.id, e.target.value)}
                                  rows={3}
                                  className="mb-3"
                                />
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
                                      onChange={(e) => updateSubChapterTitle(chapter.id, subChapter.id, e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeSubChapter(chapter.id, subChapter.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addSubChapter(chapter.id)}
                                  className="ml-8"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Ajouter un sous-chapitre
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={generatePlan} className="flex-1" size="lg">
              <FileText className="h-4 w-4 mr-2" />
              Générer le plan d'ebook
            </Button>
            <Button onClick={resetPlan} variant="outline" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Effacer
            </Button>
          </div>
        </div>

        {/* Aperçu du plan */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Aperçu du plan</CardTitle>
              <CardDescription>
                Voici à quoi ressemblera votre plan d'ebook
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg min-h-[400px] font-mono text-sm max-h-[600px] overflow-y-auto">
                {ebookTitle || authorName || chapters.length > 0 || preface || conclusion ? (
                  <div>
                    <div className="font-bold text-center mb-4">PLAN D'EBOOK</div>
                    {ebookTitle && <div><strong>Titre:</strong> {ebookTitle}</div>}
                    {authorName && <div><strong>Auteur:</strong> {authorName}</div>}
                    
                    {preface && (
                      <div className="mt-4">
                        <div className="font-bold">PRÉFACE</div>
                        <div className="text-xs mt-1">{preface}</div>
                      </div>
                    )}
                    
                    {chapters.length > 0 && (
                      <div className="mt-4">
                        <div className="font-bold mb-2">SOMMAIRE</div>
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
                        <div className="font-bold">MOT DE LA FIN</div>
                        <div className="text-xs mt-1">{conclusion}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center">
                    Remplissez les informations pour voir l'aperçu du plan
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EbookPlannerPage;