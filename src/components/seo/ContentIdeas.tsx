
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Pinterest, BookOpen, ArrowRight } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onKeywordChange) {
      onKeywordChange(inputKeyword);
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4">
        {ideas.map((idea, index) => (
          <Card key={index} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-medium">
                <a href={idea.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  {idea.title}
                </a>
              </h3>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {idea.visits.toLocaleString()} visites
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  {idea.backlinks.toLocaleString()} backlinks
                </div>
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  {idea.socialShares.facebook.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <Pinterest className="h-4 w-4" />
                  {idea.socialShares.pinterest.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentIdeas;
