import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface CrmContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contact: any) => void;
}

export const CrmContactDialog: React.FC<CrmContactDialogProps> = ({ open, onOpenChange, onSave }) => {
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    company: '',
    source: 'manual',
    status: 'lead',
    temperature: 'cold',
    notes: '',
  });

  const handleSubmit = () => {
    if (!form.email) return;
    onSave(form);
    setForm({ email: '', first_name: '', last_name: '', phone: '', company: '', source: 'manual', status: 'lead', temperature: 'cold', notes: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau contact</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Email *</Label>
            <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="contact@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Prénom</Label>
              <Input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
            </div>
            <div>
              <Label>Nom</Label>
              <Input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Téléphone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <Label>Entreprise</Label>
              <Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Température</Label>
              <Select value={form.temperature} onValueChange={v => setForm(f => ({ ...f, temperature: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">🔵 Chaud</SelectItem>
                  <SelectItem value="warm">🟡 Tiède</SelectItem>
                  <SelectItem value="cold">⚫ Froid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="qualified">Qualifié</SelectItem>
                  <SelectItem value="negotiation">Négociation</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} />
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!form.email}>
            Ajouter le contact
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
