import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, GripVertical } from 'lucide-react';
import { CrmContact } from '@/pages/CrmPage';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CrmKanbanProps {
  contacts: CrmContact[];
  onUpdateContact: (id: string, updates: Partial<CrmContact>) => void;
  onSelectContact: (contact: CrmContact) => void;
}

const COLUMNS: { id: string; label: string; emoji: string; color: string }[] = [
  { id: 'lead', label: 'Lead', emoji: '🎯', color: 'border-t-slate-400' },
  { id: 'qualified', label: 'Qualifié', emoji: '✅', color: 'border-t-amber-400' },
  { id: 'negotiation', label: 'Négociation', emoji: '🤝', color: 'border-t-purple-400' },
  { id: 'client', label: 'Client', emoji: '💎', color: 'border-t-emerald-400' },
  { id: 'converted', label: 'Converti', emoji: '🏆', color: 'border-t-blue-400' },
  { id: 'lost', label: 'Perdu', emoji: '❌', color: 'border-t-red-400' },
];

const temperatureIndicator = (temp: string) => {
  switch (temp) {
    case 'hot': return <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_1px_rgba(59,130,246,0.5)]" />;
    case 'warm': return <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />;
    case 'cold': return <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-800 dark:bg-gray-400" />;
    default: return <span className="inline-block w-2.5 h-2.5 rounded-full bg-muted" />;
  }
};

// Sortable contact card
const SortableContactCard: React.FC<{
  contact: CrmContact;
  onSelect: (c: CrmContact) => void;
}> = ({ contact, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: contact.id,
    data: { contact },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ContactCardContent contact={contact} onSelect={onSelect} dragListeners={listeners} />
    </div>
  );
};

// The visual card (also used for overlay)
const ContactCardContent: React.FC<{
  contact: CrmContact;
  onSelect: (c: CrmContact) => void;
  dragListeners?: any;
}> = ({ contact, onSelect, dragListeners }) => {
  const name = contact.first_name || contact.last_name
    ? `${contact.first_name} ${contact.last_name}`.trim()
    : null;

  return (
    <div
      className="bg-card border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow group"
      onClick={() => onSelect(contact)}
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing" {...dragListeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {temperatureIndicator(contact.temperature)}
            <span className="font-medium text-sm truncate">{name || contact.email.split('@')[0]}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
          {contact.tags && contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {contact.tags.slice(0, 2).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
              ))}
            </div>
          )}
          {contact.lifetime_value > 0 && (
            <div className="text-xs font-medium text-emerald-600 mt-1">{contact.lifetime_value}€</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Droppable column
const KanbanColumn: React.FC<{
  column: typeof COLUMNS[0];
  contacts: CrmContact[];
  onSelectContact: (c: CrmContact) => void;
}> = ({ column, contacts, onSelectContact }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[220px] w-full rounded-xl border-t-4 ${column.color} bg-muted/30 ${
        isOver ? 'ring-2 ring-primary/30 bg-primary/5' : ''
      }`}
    >
      <div className="px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{column.emoji}</span>
          <span className="font-semibold text-sm">{column.label}</span>
        </div>
        <Badge variant="secondary" className="text-xs">{contacts.length}</Badge>
      </div>
      <div className="px-2 pb-2 flex-1 space-y-2 min-h-[100px]">
        <SortableContext items={contacts.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {contacts.map(contact => (
            <SortableContactCard key={contact.id} contact={contact} onSelect={onSelectContact} />
          ))}
        </SortableContext>
        {contacts.length === 0 && (
          <div className="text-xs text-muted-foreground text-center py-8 italic">
            Glissez un contact ici
          </div>
        )}
      </div>
    </div>
  );
};

export const CrmKanban: React.FC<CrmKanbanProps> = ({ contacts, onUpdateContact, onSelectContact }) => {
  const [activeContact, setActiveContact] = React.useState<CrmContact | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const contactsByStatus = React.useMemo(() => {
    const map: Record<string, CrmContact[]> = {};
    COLUMNS.forEach(col => { map[col.id] = []; });
    contacts.forEach(c => {
      const key = COLUMNS.some(col => col.id === c.status) ? c.status : 'lead';
      map[key].push(c);
    });
    return map;
  }, [contacts]);

  const handleDragStart = (event: DragStartEvent) => {
    const contact = contacts.find(c => c.id === event.active.id);
    if (contact) setActiveContact(contact);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Visual feedback handled by useDroppable isOver
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveContact(null);
    const { active, over } = event;
    if (!over) return;

    const contactId = active.id as string;
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    // The "over" could be a column id or another contact id
    let newStatus: string | null = null;

    // Check if dropped over a column
    if (COLUMNS.some(col => col.id === over.id)) {
      newStatus = over.id as string;
    } else {
      // Dropped over a contact — find which column that contact is in
      const overContact = contacts.find(c => c.id === over.id);
      if (overContact) {
        newStatus = overContact.status;
      }
    }

    if (newStatus && newStatus !== contact.status) {
      onUpdateContact(contactId, { status: newStatus });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          📋 Pipeline
          <Badge variant="secondary">{contacts.length} contacts</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                column={col}
                contacts={contactsByStatus[col.id] || []}
                onSelectContact={onSelectContact}
              />
            ))}
          </div>

          <DragOverlay>
            {activeContact ? (
              <div className="w-[220px]">
                <ContactCardContent contact={activeContact} onSelect={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </CardContent>
    </Card>
  );
};
