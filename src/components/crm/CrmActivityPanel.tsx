import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Send, Mail, Phone, MessageSquare, Calendar, Star } from 'lucide-react';
import { CrmContact, CrmActivity } from '@/pages/CrmPage';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CrmActivityPanelProps {
  contact: CrmContact;
  activities: CrmActivity[];
  onClose: () => void;
  onAddActivity: (contactId: string, type: string, description: string) => void;
  onUpdateContact: (id: string, updates: Partial<CrmContact>) => void;
}

const activityIcon = (type: string) => {
  switch (type) {
    case 'email': return <Mail className="h-4 w-4 text-blue-500" />;
    case 'call': return <Phone className="h-4 w-4 text-emerald-500" />;
    case 'meeting': return <Calendar className="h-4 w-4 text-purple-500" />;
    case 'note': return <MessageSquare className="h-4 w-4 text-amber-500" />;
    default: return <Star className="h-4 w-4 text-muted-foreground" />;
  }
};

const temperatureOptions = [
  { value: 'hot', label: '🔵 Chaud', desc: 'A cliqué / engagé' },
  { value: 'warm', label: '🟡 Tiède', desc: 'Intéressé' },
  { value: 'cold', label: '⚫ Froid', desc: 'À relancer' },
];

export const CrmActivityPanel: React.FC<CrmActivityPanelProps> = ({
  contact, activities, onClose, onAddActivity, onUpdateContact,
}) => {
  const [newActivityType, setNewActivityType] = useState('note');
  const [newActivityText, setNewActivityText] = useState('');

  const handleAddActivity = () => {
    if (!newActivityText.trim()) return;
    onAddActivity(contact.id, newActivityType, newActivityText);
    setNewActivityText('');
  };

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {contact.first_name || contact.last_name
              ? `${contact.first_name} ${contact.last_name}`.trim()
              : contact.email}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{contact.email}</p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Quick temperature change */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Température</p>
          <div className="flex gap-2">
            {temperatureOptions.map(opt => (
              <Button
                key={opt.value}
                variant={contact.temperature === opt.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdateContact(contact.id, { temperature: opt.value })}
                className="text-xs"
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick status change */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Statut</p>
          <Select
            value={contact.status}
            onValueChange={v => onUpdateContact(contact.id, { status: v })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="qualified">Qualifié</SelectItem>
              <SelectItem value="negotiation">Négociation</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="converted">Converti</SelectItem>
              <SelectItem value="lost">Perdu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">Emails ouverts</span>
            <p className="font-medium">{contact.total_emails_opened}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Clics</span>
            <p className="font-medium">{contact.total_clicks}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">LTV</span>
            <p className="font-medium">{contact.lifetime_value}€</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Source</span>
            <p className="font-medium">{contact.source}</p>
          </div>
        </div>

        {/* Tags */}
        {contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {contact.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}

        {/* Notes */}
        {contact.notes && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
            {contact.notes}
          </div>
        )}

        {/* Add activity */}
        <div className="border-t pt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Nouvelle activité</p>
          <div className="flex gap-2 mb-2">
            <Select value={newActivityType} onValueChange={setNewActivityType}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">📝 Note</SelectItem>
                <SelectItem value="email">📧 Email</SelectItem>
                <SelectItem value="call">📞 Appel</SelectItem>
                <SelectItem value="meeting">📅 RDV</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={newActivityText}
              onChange={e => setNewActivityText(e.target.value)}
              placeholder="Description..."
              className="h-8 text-sm"
              onKeyDown={e => e.key === 'Enter' && handleAddActivity()}
            />
            <Button size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleAddActivity}>
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Activity timeline */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune activité</p>
          ) : (
            activities.map(a => (
              <div key={a.id} className="flex gap-3 text-sm">
                <div className="flex-shrink-0 mt-0.5">{activityIcon(a.activity_type)}</div>
                <div className="flex-1">
                  <p>{a.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(a.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
