
import React from 'react';
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ExternalLink, Share2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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
}

const ContentIdeas = ({ keyword, ideas }: ContentIdeasProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Idées de contenu
          <span className="text-gray-500 font-normal">: {keyword}</span>
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            EXPORTER EN FORMAT CSV
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            COPIER DANS LE PRESSE-PAPIERS
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[45%]">TITRE DE LA PAGE / URL</TableHead>
            <TableHead className="text-right">VISITES EST.</TableHead>
            <TableHead className="text-right">BACKLINKS</TableHead>
            <TableHead className="text-center">PARTAGES SOCIAUX</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas.map((idea, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <div className="space-y-1">
                  <div className="font-semibold text-blue-600 hover:underline cursor-pointer">
                    {idea.title}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    {idea.url}
                    <ExternalLink className="h-4 w-4 cursor-pointer hover:text-blue-600" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">{idea.visits.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                  {idea.backlinks.toLocaleString()}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded">
                      {idea.socialShares.facebook}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
                      {idea.socialShares.pinterest}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded">
                      {idea.socialShares.reddit}
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ContentIdeas;
