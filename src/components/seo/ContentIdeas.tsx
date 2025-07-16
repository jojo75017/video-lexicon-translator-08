
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  BookOpen, 
  ArrowRight, 
  Share2, 
  ExternalLink, 
  Copy, 
  Bookmark,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ContentIdea {
  title: string;
  url: string;
  visits: number;
  backlinks: number;
  socialShares: {
    facebook: number;
    pinterest: number;
    reddit: number;
  };
}

interface ContentIdeasProps {
  keyword: string;
  ideas: ContentIdea[];
  onKeywordChange?: (keyword: string) => void;
}

const ContentIdeas = ({ keyword, ideas, onKeywordChange }: ContentIdeasProps) => {
  const [inputKeyword, setInputKeyword] = useState(keyword);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onKeywordChange) {
      onKeywordChange(inputKeyword);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiée dans le presse-papier");
  };

  const toggleSaved = (url: string) => {
    setSavedArticles(prev => 
      prev.includes(url) 
        ? prev.filter(savedUrl => savedUrl !== url)
        : [...prev, url]
    );
    toast.success(
      savedArticles.includes(url) 
        ? "Article retiré des favoris" 
        : "Article ajouté aux favoris"
    );
  };

  const toggleLiked = (url: string) => {
    setLikedArticles(prev => 
      prev.includes(url) 
        ? prev.filter(likedUrl => likedUrl !== url)
        : [...prev, url]
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Idées de Contenu</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Entrez un mot-clé pour générer des idées..."
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            Rechercher
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="grid gap-4">
        {ideas.map((idea, index) => (
          <Card 
            key={index} 
            className="p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium flex-1">
                  <a 
                    href={idea.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-blue-600 transition-colors inline-flex items-center gap-2 group-hover:underline"
                  >
                    {idea.title}
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleLiked(idea.url)}
                    className={`hover:text-blue-600 ${likedArticles.includes(idea.url) ? 'text-blue-600' : ''}`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSaved(idea.url)}
                    className={`hover:text-blue-600 ${savedArticles.includes(idea.url) ? 'text-blue-600' : ''}`}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-2 cursor-help">
                      <BookOpen className="h-4 w-4" />
                      {idea.visits.toLocaleString()} visites
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="text-sm">
                      Visites mensuelles moyennes sur les 6 derniers mois
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-2 cursor-help">
                      <ArrowRight className="h-4 w-4" />
                      {idea.backlinks.toLocaleString()} backlinks
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="text-sm">
                      Nombre total de liens externes pointant vers cet article
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-2 cursor-help">
                      <Share2 className="h-4 w-4" />
                      {Object.values(idea.socialShares).reduce((a, b) => a + b, 0).toLocaleString()} partages
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="text-sm space-y-2">
                      <div>Détail des partages sociaux :</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>Facebook : {idea.socialShares.facebook.toLocaleString()}</div>
                        <div>Pinterest : {idea.socialShares.pinterest.toLocaleString()}</div>
                        <div>Reddit : {idea.socialShares.reddit.toLocaleString()}</div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyUrl(idea.url)}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copier URL
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.open(idea.url, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Voir l'article
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentIdeas;

