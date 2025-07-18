import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Trash2, FileText, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface Chapter {
  id: string;
  title: string;
  subChapters: SubChapter[];
}

interface SubChapter {
  id: string;
  title: string;
}

const EbookPlannerPage: React.FC = () => {
  const [ebookTitle, setEbookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [preface, setPreface] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: '',
      subChapters: []
    };
    setChapters([...chapters, newChapter]);
  };

  const removeChapter = (chapterId: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== chapterId));
  };

  const updateChapterTitle = (chapterId: string, title: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId ? { ...chapter, title } : chapter
    ));
  };

  const addSubChapter = (chapterId: string) => {
    const newSubChapter: SubChapter = {
      id: Date.now().toString(),
      title: ''
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
          model: 'gpt-4',
          messages: [{
            role: 'user',
            content: `Crée un plan détaillé d'ebook sur le sujet: "${ebookTitle}". 
            
            Génère:
            1. Un nom d'auteur approprié
            2. Une préface courte et engageante (2-3 phrases)
            3. 8-12 chapitres avec des titres accrocheurs
            4. 3-5 sous-chapitres pour chaque chapitre
            
            Réponds uniquement au format JSON:
            {
              "author": "Nom de l'auteur",
              "preface": "Texte de la préface",
              "chapters": [
                {
                  "title": "Titre du chapitre",
                  "subChapters": ["Sous-chapitre 1", "Sous-chapitre 2", ...]
                }
              ]
            }`
          }],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const data = await response.json();
      const planData = JSON.parse(data.choices[0].message.content);
      
      // Remplir automatiquement tous les champs
      setAuthorName(planData.author);
      setPreface(planData.preface);
      
      const generatedChapters = planData.chapters.map((chapter: any, index: number) => ({
        id: (Date.now() + index).toString(),
        title: chapter.title,
        subChapters: chapter.subChapters.map((sub: string, subIndex: number) => ({
          id: (Date.now() + index * 100 + subIndex).toString(),
          title: sub
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

    // Copy to clipboard
    navigator.clipboard.writeText(plan);
    toast.success('Plan d\'ebook copié dans le presse-papiers !');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Générateur de Plan d'Ebook</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de création */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Pour utiliser la génération automatique, configurez votre clé API OpenAI
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Chapitres
                <Button onClick={addChapter} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un chapitre
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {chapters.map((chapter, index) => (
                <div key={chapter.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Chapitre {index + 1}:</span>
                    <Input
                      placeholder="Titre du chapitre"
                      value={chapter.title}
                      onChange={(e) => updateChapterTitle(chapter.id, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeChapter(chapter.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="ml-4 space-y-2">
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
              ))}
            </CardContent>
          </Card>

          <Button onClick={generatePlan} className="w-full" size="lg">
            <FileText className="h-4 w-4 mr-2" />
            Générer le plan d'ebook
          </Button>
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
              <div className="bg-muted p-4 rounded-lg min-h-[400px] font-mono text-sm">
                {ebookTitle || authorName || chapters.length > 0 ? (
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
                            <div>{index + 1}. {chapter.title || 'Titre du chapitre'}</div>
                            {chapter.subChapters.map((subChapter, subIndex) => (
                              <div key={subChapter.id} className="ml-4 text-xs">
                                {index + 1}.{subIndex + 1}. {subChapter.title || 'Titre du sous-chapitre'}
                              </div>
                            ))}
                          </div>
                        ))}
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