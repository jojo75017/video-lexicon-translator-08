import React, { useEffect, useState, useCallback } from 'react';
import { Ticket, Plus, Copy, Check, RefreshCw, Loader2, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';

interface BetaCode {
  id: string;
  code: string;
  status: string;
  used_by_email: string | null;
  used_at: string | null;
  created_at: string;
}

const AdminBetaCodesPage: React.FC = () => {
  const [codes, setCodes] = useState<BetaCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [quantity, setQuantity] = useState(5);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendDialog, setSendDialog] = useState<BetaCode | null>(null);
  const [sendEmail, setSendEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendEmail = async () => {
    if (!sendDialog) return;
    const email = sendEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      toast.error('Adresse email invalide');
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-beta-code', {
        body: { email, code: sendDialog.code },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Échec de l'envoi");
      toast.success(`Code envoyé à ${email}`);
      setSendDialog(null);
      setSendEmail('');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Impossible d'envoyer l'email");
    } finally {
      setSending(false);
    }
  };

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('beta_promo_codes')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error(error);
      toast.error('Impossible de charger les codes');
    } else {
      setCodes(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const usedCount = codes.filter((c) => c.status === 'used').length;
  const availableCount = codes.length - usedCount;

  const handleGenerate = async () => {
    const qty = Math.max(1, Math.min(50, Number(quantity) || 0));
    setGenerating(true);
    try {
      const existing = new Set(codes.map((c) => c.code));
      const newCodes: string[] = [];
      let attempts = 0;
      while (newCodes.length < qty && attempts < 500) {
        attempts++;
        const num = Math.floor(1000 + Math.random() * 9000); // 4 digits
        const code = `BETA-EBOOK-${num}`;
        if (!existing.has(code) && !newCodes.includes(code)) {
          newCodes.push(code);
        }
      }

      const { error } = await supabase
        .from('beta_promo_codes')
        .insert(newCodes.map((code) => ({ code })));

      if (error) throw error;

      toast.success(`${newCodes.length} code(s) généré(s)`);
      await fetchCodes();
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de la génération des codes");
    } finally {
      setGenerating(false);
    }
  };

  const copyCode = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      toast.success('Code copié');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Impossible de copier');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-5xl space-y-6">
        <AdminPanelNav />

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#008296]/10 p-2.5">
            <Ticket className="h-6 w-6 text-[#008296]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Codes Bêta</h1>
            <p className="text-sm text-muted-foreground">
              Gérez les codes promo bêta-testeurs (accès gratuit à vie). Chaque code est à usage unique.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-foreground">{codes.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-[#008296]">{availableCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Disponibles</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-muted-foreground">{usedCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Utilisés</div>
          </Card>
        </div>

        {/* Generate */}
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Générer de nouveaux codes</label>
              <p className="text-xs text-muted-foreground mb-2">
                Format BETA-EBOOK-XXXX (4 chiffres uniques).
              </p>
              <Input
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Générer
            </Button>
            <Button variant="outline" onClick={fetchCodes} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card className="p-0 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Chargement...
            </div>
          ) : codes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Aucun code pour le moment.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Utilisé par</TableHead>
                  <TableHead>Date d'activation</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono font-medium">{c.code}</TableCell>
                    <TableCell>
                      {c.status === 'used' ? (
                        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                          Utilisé
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#008296]/10 text-[#008296] border border-[#008296]/30">
                          Disponible
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{c.used_by_email || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.used_at
                        ? new Date(c.used_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyCode(c.id, c.code)}
                      >
                        {copiedId === c.id ? (
                          <Check className="h-4 w-4 text-[#008296]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminBetaCodesPage;
