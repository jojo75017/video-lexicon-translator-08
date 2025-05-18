
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface KeywordTableProps {
  keywords: KeywordSuggestion[];
  toggleKeywordSelection: (keyword: string) => void;
  selectedKeywords?: string[];
}

const KeywordTable: React.FC<KeywordTableProps> = ({ 
  keywords, 
  toggleKeywordSelection,
  selectedKeywords = []
}) => {
  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return 'bg-gray-100 text-gray-600';
    if (difficulty < 30) return 'bg-green-100 text-green-800 border-green-200';
    if (difficulty < 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };
  
  const getCompetitionBadge = (competition?: number) => {
    if (competition === undefined) return <Badge variant="outline">N/A</Badge>;
    if (competition < 0.3) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Faible</Badge>;
    if (competition < 0.7) return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Moyenne</Badge>;
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Élevée</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"></TableHead>
          <TableHead>Mot-clé</TableHead>
          <TableHead className="hidden md:table-cell">Volume</TableHead>
          <TableHead className="hidden md:table-cell">Difficulté</TableHead>
          <TableHead className="hidden lg:table-cell">CPC</TableHead>
          <TableHead className="hidden lg:table-cell">Compétition</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keywords.map((keyword, index) => (
          <TableRow key={index}>
            <TableCell>
              <Checkbox 
                checked={selectedKeywords?.includes(keyword.keyword)}
                onCheckedChange={() => toggleKeywordSelection(keyword.keyword)}
              />
            </TableCell>
            <TableCell className="font-medium">{keyword.keyword}</TableCell>
            <TableCell className="hidden md:table-cell">{keyword.searchVolume?.toLocaleString() || 'N/A'}</TableCell>
            <TableCell className="hidden md:table-cell">
              <Badge variant="outline" className={getDifficultyColor(keyword.difficulty)}>
                {keyword.difficulty || 'N/A'}
              </Badge>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              {keyword.cpc ? `${keyword.cpc.toFixed(2)}€` : 'N/A'}
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              {getCompetitionBadge(keyword.competition)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Voir détails</DropdownMenuItem>
                  <DropdownMenuItem>Ajouter au groupe</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleKeywordSelection(keyword.keyword)}>
                    {selectedKeywords?.includes(keyword.keyword) ? 'Désélectionner' : 'Sélectionner'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default KeywordTable;
