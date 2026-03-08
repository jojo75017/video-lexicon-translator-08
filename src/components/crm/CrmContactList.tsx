import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Loader2, Mail, Phone } from 'lucide-react';
import { CrmContact } from '@/pages/CrmPage';

interface CrmContactListProps {
  contacts: CrmContact[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterTemperature: string;
  onFilterTemperatureChange: (t: string) => void;
  filterStatus: string;
  onFilterStatusChange: (s: string) => void;
  onSelectContact: (c: CrmContact) => void;
  onUpdateContact: (id: string, updates: Partial<CrmContact>) => void;
  onDeleteContact: (id: string) => void;
  selectedContactId?: string;
}

const temperatureIndicator = (temp: string) => {
  switch (temp) {
    case 'hot': return <span className="inline-block w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.5)]" title="Chaud — a cliqué" />;
    case 'warm': return <span className="inline-block w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_6px_2px_rgba(251,191,36,0.4)]" title="Tiède" />;
    case 'cold': return <span className="inline-block w-3 h-3 rounded-full bg-gray-800 dark:bg-gray-300" title="Froid — à relancer" />;
    default: return <span className="inline-block w-3 h-3 rounded-full bg-muted" />;
  }
};

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    lead: { label: 'Lead', variant: 'outline' },
    qualified: { label: 'Qualifié', variant: 'secondary' },
    negotiation: { label: 'Négociation', variant: 'default' },
    client: { label: 'Client', variant: 'default' },
    converted: { label: 'Converti', variant: 'default' },
    lost: { label: 'Perdu', variant: 'destructive' },
  };
  const info = map[status] || { label: status, variant: 'outline' as const };
  return <Badge variant={info.variant} className="text-xs">{info.label}</Badge>;
};

export const CrmContactList: React.FC<CrmContactListProps> = ({
  contacts, loading, searchQuery, onSearchChange,
  filterTemperature, onFilterTemperatureChange,
  filterStatus, onFilterStatusChange,
  onSelectContact, onUpdateContact, onDeleteContact,
  selectedContactId,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Contacts ({contacts.length})</CardTitle>
        <div className="flex flex-wrap gap-3 pt-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher email, nom, entreprise..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterTemperature} onValueChange={onFilterTemperatureChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Température" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="hot">🔵 Chaud</SelectItem>
              <SelectItem value="warm">🟡 Tiède</SelectItem>
              <SelectItem value="cold">⚫ Froid</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={onFilterStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="qualified">Qualifié</SelectItem>
              <SelectItem value="negotiation">Négociation</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="converted">Converti</SelectItem>
              <SelectItem value="lost">Perdu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">Aucun contact</p>
            <p className="text-sm">Importez vos prospects ou ajoutez un contact manuellement</p>
          </div>
        ) : (
          <div className="space-y-1">
            {contacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedContactId === contact.id ? 'bg-primary/5 border border-primary/20' : ''
                }`}
              >
                {/* Temperature indicator */}
                <div className="flex-shrink-0">
                  {temperatureIndicator(contact.temperature)}
                </div>

                {/* Name & email */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {contact.first_name || contact.last_name
                        ? `${contact.first_name} ${contact.last_name}`.trim()
                        : contact.email}
                    </span>
                    {statusBadge(contact.status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </span>
                    {contact.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                  {contact.tags?.slice(0, 2).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>

                {/* Opens */}
                <div className="flex-shrink-0 text-center">
                  <div className="text-sm font-medium">{contact.total_emails_opened}</div>
                  <div className="text-xs text-muted-foreground">opens</div>
                </div>

                {/* LTV */}
                <div className="flex-shrink-0 text-center">
                  <div className="text-sm font-medium">{contact.lifetime_value}€</div>
                  <div className="text-xs text-muted-foreground">LTV</div>
                </div>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDeleteContact(contact.id); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
