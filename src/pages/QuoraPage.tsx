import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { PenLine, Search, RefreshCw, ArrowLeft, MessageSquareText, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuoraQuestionForm, { QuoraQuestionFormProps } from '@/components/seo/buttons/QuoraQuestionForm';
import QuoraAnswerForm, { QuoraAnswerFormProps } from '@/components/seo/buttons/QuoraAnswerForm';
import { toast } from 'sonner';
import PageHeader from '@/components/dashboard/PageHeader';
import { useForm } from 'react-hook-form';
import { PageHeaderProps } from '@/components/dashboard/PageHeader.d';

const QuoraPage = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [questionDraft, setQuestionDraft] = useState('');
  const [questionTags, setQuestionTags] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');
  const [answerTarget, setAnswerTarget] = useState('');
  const [answerDraft, setAnswerDraft] = useState('');
  const [answerApproach, setAnswerApproach] = useState('authority');
  const [includeLinks, setIncludeLinks] = useState(true);
  const [includeStatistics, setIncludeStatistics] = useState(true);
  
  // Add state and handlers for QuoraQuestionForm and QuoraAnswerForm
  const [textDetails, setTextDetails] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [textSources, setTextSources] = useState('');
  
  const popularQuestions = [
    "Comment améliorer mon référencement SEO en 2024 ?",
    "Quelles sont les meilleures stratégies de marketing digital ?",
    "Comment optimiser ma présence sur les réseaux sociaux ?"
  ];
  
  const askForm = useForm();
  const answerForm = useForm();
  
  const handleSaveDraft = () => {
    if (activeTab === 'questions' && questionDraft) {
      toast.success('Brouillon de question sauvegardé');
    } else if (activeTab === 'answers' && answerDraft) {
      toast.success('Brouillon de réponse sauvegardé');
    } else {
      toast.error('Veuillez d\'abord écrire du contenu');
    }
  };
  
  const handleGenerateContent = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (activeTab === 'questions') {
        setQuestionDraft("Comment puis-je améliorer efficacement le référencement de mon site e-commerce en 2024 avec un budget limité ?");
      } else {
        setAnswerDraft(`Pour améliorer le référencement de votre site e-commerce avec un budget limité en 2024, concentrez-vous sur ces stratégies éprouvées:

1. **Optimisez votre contenu** - Créez des descriptions de produits uniques et détaillées qui répondent aux intentions de recherche des utilisateurs.

2. **Améliorez la vitesse de votre site** - Utilisez Google PageSpeed Insights pour identifier et corriger les problèmes de performance.

3. **Structurez vos données avec Schema.org** - Implémentez le balisage de schéma pour aider les moteurs de recherche à mieux comprendre votre contenu.

4. **Optimisez pour mobile** - Assurez-vous que votre site offre une expérience parfaite sur tous les appareils.

5. **Créez un blog** - Publiez régulièrement du contenu informatif lié à vos produits pour attirer du trafic organique.

Selon une étude récente de SEMrush, les sites e-commerce qui publient régulièrement du contenu voient une augmentation moyenne de 68% du trafic organique en 6 mois.

N'hésitez pas à me contacter pour des conseils plus personnalisés adaptés à votre niche spécifique.`);
      }
      setIsLoading(false);
      toast.success('Contenu généré avec succès');
    }, 1500);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      toast.success(`Recherche de "${searchTerm}" en cours...`);
    } else {
      toast.error('Veuillez entrer un terme de recherche');
    }
  };
  
  const handleTextSelection = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    // Placeholder for text selection handler
  };
  
  const applyFormatting = (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => {
    // Placeholder for formatting handler
  };
  
  const handleQuoraSubmit = (data: any) => {
    // Placeholder for form submission
    toast.success('Question Quora soumise');
  };
  
  const handleQuoraAnswerSubmit = (data: any) => {
    // Placeholder for form submission
    toast.success('Réponse Quora soumise');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader 
          title="Assistant Quora"
          description="Générez des questions et réponses optimisées pour Quora"
          icon={<MessageSquareText className="h-6 w-6 text-[#b92b27]" />}
        />
        
        <div className="mb-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Link>
        </div>
        
        <Card className="p-6 space-y-6">
          <Tabs defaultValue="questions" className="space-y-4">
            <TabsList className="bg-gray-100 rounded-md p-1">
              <TabsTrigger value="questions" onClick={() => setActiveTab('questions')} className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 font-medium">
                Questions
              </TabsTrigger>
              <TabsTrigger value="answers" onClick={() => setActiveTab('answers')} className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 font-medium">
                Réponses
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions" className="space-y-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Rechercher des questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Rechercher
                    </>
                  )}
                </Button>
              </form>
              
              <Textarea
                placeholder="Rédigez votre question ici..."
                value={questionDraft}
                onChange={(e) => setQuestionDraft(e.target.value)}
                className="min-h-[100px]"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                  <Input
                    type="text"
                    id="tags"
                    placeholder="ex: référencement, SEO, marketing digital"
                    value={questionTags}
                    onChange={(e) => setQuestionTags(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select onValueChange={setQuestionCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="technology">Technologie</SelectItem>
                      <SelectItem value="education">Éducation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="secondary" onClick={handleSaveDraft}>
                  <PenLine className="mr-2 h-4 w-4" />
                  Enregistrer le brouillon
                </Button>
                <Button onClick={handleGenerateContent} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Générer une question
                    </>
                  )}
                </Button>
              </div>
              
              <QuoraQuestionForm 
                form={askForm} 
                textDetails={textDetails}
                setTextDetails={setTextDetails}
                handleTextSelection={handleTextSelection}
                applyFormatting={applyFormatting}
                onSubmit={handleQuoraSubmit}
              />
            </TabsContent>
            
            <TabsContent value="answers" className="space-y-4">
              <Input
                type="search"
                placeholder="Question cible..."
                value={answerTarget}
                onChange={(e) => setAnswerTarget(e.target.value)}
              />
              
              <Textarea
                placeholder="Rédigez votre réponse ici..."
                value={answerDraft}
                onChange={(e) => setAnswerDraft(e.target.value)}
                className="min-h-[150px]"
              />
              
              <div className="space-y-2">
                <Label>Approche de la réponse</Label>
                <RadioGroup defaultValue={answerApproach} className="flex space-x-2" onValueChange={setAnswerApproach}>
                  <RadioGroupItem value="authority" id="approach1" />
                  <Label htmlFor="approach1">Expert (autorité)</Label>
                  <RadioGroupItem value="friendly" id="approach2" />
                  <Label htmlFor="approach2">Amical (conseils)</Label>
                  <RadioGroupItem value="humorous" id="approach3" />
                  <Label htmlFor="approach3">Humoristique</Label>
                </RadioGroup>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-x-4 flex items-center">
                  <div className="flex items-center space-x-2">
                    <Switch id="links" checked={includeLinks} onCheckedChange={(checked) => setIncludeLinks(checked)} />
                    <Label htmlFor="links">Inclure des liens</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="statistics" checked={includeStatistics} onCheckedChange={(checked) => setIncludeStatistics(checked)} />
                    <Label htmlFor="statistics">Inclure des statistiques</Label>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="secondary" onClick={handleSaveDraft}>
                    <PenLine className="mr-2 h-4 w-4" />
                    Enregistrer le brouillon
                  </Button>
                  <Button onClick={handleGenerateContent} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Générer une réponse
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <QuoraAnswerForm 
                form={answerForm}
                popularQuestions={popularQuestions}
                textAnswer={textAnswer}
                setTextAnswer={setTextAnswer}
                textSources={textSources}
                setTextSources={setTextSources}
                handleTextSelection={handleTextSelection}
                applyFormatting={applyFormatting}
                onSubmit={handleQuoraAnswerSubmit}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default QuoraPage;
