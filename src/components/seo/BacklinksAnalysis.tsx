
import React from 'react';
import { BacklinkInfo } from '@/types/seo';
import { Card } from '@/components/ui/card';
import { Link2, ArrowUpRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BacklinksAnalysisProps {
  backlinks: number;
  backlinkDetails: BacklinkInfo[];
  topBacklinkDomains: { domain: string; count: number }[];
  doFollowBacklinks: number;
  noFollowBacklinks: number;
}

const BacklinksAnalysis = ({
  backlinks,
  backlinkDetails,
  topBacklinkDomains,
  doFollowBacklinks,
  noFollowBacklinks,
}: BacklinksAnalysisProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5 text-blue-500" />
        <h3 className="text-xl font-semibold">Analyse des Backlinks</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Backlinks</p>
          <p className="text-2xl font-bold text-blue-600">{backlinks}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Backlinks DoFollow</p>
          <p className="text-2xl font-bold text-green-600">{doFollowBacklinks}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600">Backlinks NoFollow</p>
          <p className="text-2xl font-bold text-orange-600">{noFollowBacklinks}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium">Domaines Principaux</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {topBacklinkDomains.map((domain, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <p className="text-sm font-medium text-gray-800">{domain.domain}</p>
              <p className="text-xs text-gray-600">{domain.count} backlinks</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium">Détails des Backlinks</h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domaine</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Autorité</TableHead>
                <TableHead>Texte d'Ancrage</TableHead>
                <TableHead>Date de Première Vue</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backlinkDetails.map((backlink, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{backlink.domain}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      backlink.isDoFollow 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {backlink.isDoFollow ? 'DoFollow' : 'NoFollow'}
                    </span>
                  </TableCell>
                  <TableCell>{backlink.authority}</TableCell>
                  <TableCell>{backlink.anchorText}</TableCell>
                  <TableCell>
                    {new Date(backlink.firstSeen).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <a 
                      href={backlink.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                    >
                      Voir <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default BacklinksAnalysis;
