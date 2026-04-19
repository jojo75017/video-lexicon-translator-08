import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Crown, Copy, Mail, Loader2, Users, Search, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Subscriber {
  id: string;
  email: string;
  access_code: string | null;
  plan_type: string;
  plan_tier: string;
  status: string;
  created_at: string;
  expires_at: string | null;
}

interface SubscribersTableProps {
  subscribers: Subscriber[];
  loading: boolean;
  onRefresh: () => void;
}

export const SubscribersTable: React.FC<SubscribersTableProps> = ({ subscribers, loading, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const copyCode = (code: string | null) => {
    if (!code) return toast.error('Pas de code');
    navigator.clipboard.writeText(code);
    toast.success('Code copié !');
  };

  const sendCode = async (sub: Subscriber) => {
    if (!sub.access_code) return toast.error('Pas de code à envoyer');
    setSendingTo(sub.id);
    try {
      const { error } = await supabase.functions.invoke('resend-access-code', {
        body: { email: sub.email },
      });
      if (error) throw error;
      toast.success(`Code envoyé à ${sub.email}`);
    } catch (err: any) {
      toast.error(err.message || 'Erreur d\'envoi');
    } finally {
      setSendingTo(null);
    }
  };

  const getPlanBadge = (tier: string, plan: string) => {
    if (tier === 'vip') {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/40">
          <Crown className="h-3 w-3 mr-1" /> VIP
        </Badge>
      );
    }
    return <Badge variant="outline">{plan}</Badge>;
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <Users className="h-4 w-4 text-emerald-500" />
            </div>
            Mes Abonnés ({filtered.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Rechercher email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 w-56 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Aucun abonné trouvé</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border/50">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-2.5 font-medium">Email</th>
                  <th className="text-left p-2.5 font-medium">Code</th>
                  <th className="text-left p-2.5 font-medium">Plan</th>
                  <th className="text-left p-2.5 font-medium">Statut</th>
                  <th className="text-center p-2.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => (
                  <tr key={sub.id} className="border-t border-border/30 hover:bg-muted/20">
                    <td className="p-2.5 font-medium">{sub.email}</td>
                    <td className="p-2.5">
                      <code className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {sub.access_code || '—'}
                      </code>
                    </td>
                    <td className="p-2.5">{getPlanBadge(sub.plan_tier, sub.plan_type)}</td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                        <span className="text-xs capitalize text-muted-foreground">{sub.status}</span>
                      </div>
                    </td>
                    <td className="p-2.5">
                      <div className="flex justify-center gap-1.5">
                        <Button onClick={() => copyCode(sub.access_code)} variant="ghost" size="sm" className="h-7 px-2">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          onClick={() => sendCode(sub)}
                          disabled={sendingTo === sub.id || !sub.access_code}
                          variant="outline"
                          size="sm"
                          className="h-7 px-2"
                        >
                          {sendingTo === sub.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Mail className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
