import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CrmHeader } from '@/components/crm/CrmHeader';
import { CrmStats } from '@/components/crm/CrmStats';
import { CrmContactList } from '@/components/crm/CrmContactList';
import { CrmContactDialog } from '@/components/crm/CrmContactDialog';
import { CrmActivityPanel } from '@/components/crm/CrmActivityPanel';
import { CrmKanban } from '@/components/crm/CrmKanban';
import { CrmAnalytics } from '@/components/crm/CrmAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface CrmContact {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  company: string;
  source: string;
  status: string;
  temperature: string;
  tags: string[];
  notes: string;
  last_interaction_at: string | null;
  total_emails_opened: number;
  total_clicks: number;
  lifetime_value: number;
  created_at: string;
  updated_at: string;
}

export interface CrmActivity {
  id: string;
  contact_id: string;
  activity_type: string;
  description: string;
  metadata: any;
  created_at: string;
}

const CrmPage: React.FC = () => {
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemperature, setFilterTemperature] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<CrmContact | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showActivityPanel, setShowActivityPanel] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      toast.error('Erreur chargement contacts');
      console.error(error);
    } else {
      setContacts((data as any[]) || []);
    }
    setLoading(false);
  }, []);

  const fetchActivities = useCallback(async (contactId: string) => {
    const { data, error } = await supabase
      .from('crm_activities')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error) {
      setActivities((data as any[]) || []);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) fetchContacts();
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) fetchContacts();
    });
    return () => subscription.unsubscribe();
  }, [fetchContacts]);

  const importFromProspects = async () => {
    const { data: prospects, error } = await supabase
      .from('sales_prospects')
      .select('*');

    if (error || !prospects) {
      toast.error('Erreur import prospects');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Get existing emails to avoid duplicates
    const existingEmails = new Set(contacts.map(c => c.email.toLowerCase()));

    // Get email opens data
    const { data: opens } = await supabase.from('email_opens').select('*');
    const opensByEmail = new Map<string, number>();
    opens?.forEach(o => {
      const count = opensByEmail.get(o.prospect_email) || 0;
      opensByEmail.set(o.prospect_email, count + 1);
    });

    const newContacts = prospects
      .filter(p => !existingEmails.has(p.email.toLowerCase()))
      .map(p => {
        const emailOpens = opensByEmail.get(p.email) || 0;
        const isHot = emailOpens > 0 || (p.current_step && p.current_step >= 2);
        return {
          user_id: session.user.id,
          email: p.email,
          first_name: p.first_name || '',
          last_name: '',
          source: p.source || 'prospect_import',
          status: p.completed ? 'converted' : p.unsubscribed ? 'lost' : 'lead',
          temperature: isHot ? 'hot' : 'cold',
          total_emails_opened: emailOpens,
          tags: [p.source || 'prospect'].filter(Boolean),
          notes: `Importé depuis prospects. Step: ${p.current_step || 0}`,
          last_interaction_at: p.last_email_sent_at,
        };
      });

    if (newContacts.length === 0) {
      toast.info('Aucun nouveau prospect à importer');
      return;
    }

    const { error: insertError } = await supabase
      .from('crm_contacts')
      .insert(newContacts as any);

    if (insertError) {
      toast.error('Erreur lors de l\'import');
      console.error(insertError);
    } else {
      toast.success(`${newContacts.length} prospects importés !`);
      fetchContacts();
    }
  };

  const importFromSubscribers = async () => {
    const { data: subs, error } = await supabase
      .from('subscribers')
      .select('*');

    if (error || !subs) {
      toast.error('Erreur import abonnés');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const existingEmails = new Set(contacts.map(c => c.email.toLowerCase()));

    const newContacts = subs
      .filter(s => !existingEmails.has(s.email.toLowerCase()))
      .map(s => ({
        user_id: session.user.id,
        email: s.email,
        first_name: '',
        last_name: '',
        source: 'subscriber',
        status: 'client',
        temperature: 'hot',
        tags: [s.plan_type, s.plan_tier].filter(Boolean),
        notes: `Abonné ${s.plan_type} (${s.plan_tier}). Code: ${s.access_code || 'N/A'}`,
        lifetime_value: s.plan_tier === 'vip' ? 67 : s.plan_type === 'lifetime' ? 47 : 0,
      }));

    if (newContacts.length === 0) {
      toast.info('Aucun nouvel abonné à importer');
      return;
    }

    const { error: insertError } = await supabase
      .from('crm_contacts')
      .insert(newContacts as any);

    if (insertError) {
      toast.error('Erreur import');
      console.error(insertError);
    } else {
      toast.success(`${newContacts.length} abonnés importés !`);
      fetchContacts();
    }
  };

  const updateContact = async (id: string, updates: Partial<CrmContact>) => {
    const { error } = await supabase
      .from('crm_contacts')
      .update(updates as any)
      .eq('id', id);

    if (error) {
      toast.error('Erreur mise à jour');
    } else {
      toast.success('Contact mis à jour');
      fetchContacts();
      if (selectedContact?.id === id) {
        setSelectedContact(prev => prev ? { ...prev, ...updates } : null);
      }
    }
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase
      .from('crm_contacts')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur suppression');
    } else {
      toast.success('Contact supprimé');
      fetchContacts();
      if (selectedContact?.id === id) {
        setSelectedContact(null);
        setShowActivityPanel(false);
      }
    }
  };

  const addActivity = async (contactId: string, type: string, description: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('crm_activities')
      .insert({
        contact_id: contactId,
        user_id: session.user.id,
        activity_type: type,
        description,
      } as any);

    if (!error) {
      // Update last_interaction_at
      await supabase
        .from('crm_contacts')
        .update({ last_interaction_at: new Date().toISOString() } as any)
        .eq('id', contactId);

      fetchActivities(contactId);
      fetchContacts();
    }
  };

  const openContactDetail = (contact: CrmContact) => {
    setSelectedContact(contact);
    setShowActivityPanel(true);
    fetchActivities(contact.id);
  };

  const filteredContacts = contacts.filter(c => {
    const matchSearch = !searchQuery ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTemp = filterTemperature === 'all' || c.temperature === filterTemperature;
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;

    return matchSearch && matchTemp && matchStatus;
  });

  // Stats
  const stats = {
    total: contacts.length,
    hot: contacts.filter(c => c.temperature === 'hot').length,
    warm: contacts.filter(c => c.temperature === 'warm').length,
    cold: contacts.filter(c => c.temperature === 'cold').length,
    leads: contacts.filter(c => c.status === 'lead').length,
    clients: contacts.filter(c => c.status === 'client').length,
    converted: contacts.filter(c => c.status === 'converted').length,
    lost: contacts.filter(c => c.status === 'lost').length,
    totalRevenue: contacts.reduce((sum, c) => sum + (c.lifetime_value || 0), 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <CrmHeader
        onImportProspects={importFromProspects}
        onImportSubscribers={importFromSubscribers}
        onAddContact={() => setShowAddDialog(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <CrmStats stats={stats} />

        <Tabs defaultValue="kanban" className="w-full">
          <TabsList>
            <TabsTrigger value="kanban">📋 Pipeline</TabsTrigger>
            <TabsTrigger value="list">📃 Liste</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-4">
            <div className="flex gap-6">
              <div className={`flex-1 ${showActivityPanel ? 'max-w-[65%]' : ''}`}>
                <CrmKanban
                  contacts={filteredContacts}
                  onUpdateContact={updateContact}
                  onSelectContact={openContactDetail}
                />
              </div>
              {showActivityPanel && selectedContact && (
                <div className="w-[35%]">
                  <CrmActivityPanel
                    contact={selectedContact}
                    activities={activities}
                    onClose={() => { setShowActivityPanel(false); setSelectedContact(null); }}
                    onAddActivity={addActivity}
                    onUpdateContact={updateContact}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <div className="flex gap-6">
              <div className={`flex-1 ${showActivityPanel ? 'max-w-[60%]' : ''}`}>
                <CrmContactList
                  contacts={filteredContacts}
                  loading={loading}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterTemperature={filterTemperature}
                  onFilterTemperatureChange={setFilterTemperature}
                  filterStatus={filterStatus}
                  onFilterStatusChange={setFilterStatus}
                  onSelectContact={openContactDetail}
                  onUpdateContact={updateContact}
                  onDeleteContact={deleteContact}
                  selectedContactId={selectedContact?.id}
                />
              </div>
              {showActivityPanel && selectedContact && (
                <div className="w-[40%]">
                  <CrmActivityPanel
                    contact={selectedContact}
                    activities={activities}
                    onClose={() => { setShowActivityPanel(false); setSelectedContact(null); }}
                    onAddActivity={addActivity}
                    onUpdateContact={updateContact}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <CrmAnalytics contacts={contacts} />
          </TabsContent>
        </Tabs>
      </div>

      <CrmContactDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={async (contact) => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;

          const { error } = await supabase
            .from('crm_contacts')
            .insert({ ...contact, user_id: session.user.id } as any);

          if (error) {
            toast.error('Erreur création contact');
          } else {
            toast.success('Contact ajouté');
            setShowAddDialog(false);
            fetchContacts();
          }
        }}
      />
    </div>
  );
};

export default CrmPage;
