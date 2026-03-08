import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Download, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CrmHeaderProps {
  onImportProspects: () => void;
  onImportSubscribers: () => void;
  onAddContact: () => void;
}

export const CrmHeader: React.FC<CrmHeaderProps> = ({
  onImportProspects,
  onImportSubscribers,
  onAddContact,
}) => {
  const navigate = useNavigate();

  return (
    <div className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">CRM</h1>
              <p className="text-sm text-muted-foreground">Gestion des contacts & prospects</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Importer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onImportProspects}>
                📧 Depuis Prospects (sales_prospects)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onImportSubscribers}>
                👤 Depuis Abonnés (subscribers)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={onAddContact} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contact
          </Button>
        </div>
      </div>
    </div>
  );
};
