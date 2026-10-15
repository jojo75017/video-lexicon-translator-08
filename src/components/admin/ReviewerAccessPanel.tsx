import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ReviewerAccessPanel() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [expires, setExpires] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  async function run(action: 'create' | 'status' | 'revoke') {
    if (action === 'revoke' && !window.confirm('Révoquer uniquement l’accès JVZoo de cette adresse ?')) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-reviewer-access', { body: { action, email, access_code: code, expires_at: expires ? new Date(expires).toISOString() : null } });
      if (error || data?.error) throw new Error(data?.error || 'Opération refusée. Vérifiez l’adresse et votre session administrateur.');
      setResult(action === 'create' ? 'Compte Auteur créé, sans paiement ni email. Conservez le code choisi pour JVZoo.' : action === 'revoke' ? 'Accès révoqué et connexion bloquée.' : !data.exists ? 'Aucun compte à cette adresse.' : data.dedicated ? `Compte JVZoo : ${data.status} — expiration ${data.expires_at ? new Date(data.expires_at).toLocaleDateString('fr-FR') : 'non définie'}` : 'Compte existant protégé : aucune modification autorisée ici.');
      if (action === 'create') setCode('');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Erreur'); }
    finally { setBusy(false); }
  }
  return <section id="jvzoo" className="space-y-4 border-y border-border py-6">
    <h2 className="text-xl font-semibold">Compte d’examen JVZoo — Auteur</h2>
    <p className="text-sm text-muted-foreground">Accès offert, sans administration. Utilisez une adresse dédiée qui n’appartient à aucun client.</p>
    <div className="grid gap-4 md:grid-cols-3">
      <div><Label htmlFor="review-email">Email dédié JVZoo</Label><Input id="review-email" type="email" autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div><Label htmlFor="review-code">Code temporaire (EBK-XXXXXX)</Label><Input id="review-code" type="password" autoComplete="new-password" maxLength={10} value={code} onChange={e => setCode(e.target.value.toUpperCase())} /></div>
      <div><Label htmlFor="review-expiry">Fin de l’accès</Label><Input id="review-expiry" type="date" value={expires} onChange={e => setExpires(e.target.value)} /></div>
    </div>
    <p className="text-sm">Connexion JVZoo : <a className="text-primary underline" href="https://ebookstudio.fr/connexion-abonne">https://ebookstudio.fr/connexion-abonne</a> — identifiant : email ; mot de passe à renseigner dans JVZoo : code d’accès choisi, en majuscules.</p>
    <div className="flex flex-wrap gap-3">
      <Button disabled={busy || !email || !/^EBK-[A-Z0-9]{6}$/.test(code.trim()) || !expires} onClick={() => run('create')}>Créer l’accès Auteur</Button>
      <Button variant="outline" disabled={busy || !email} onClick={() => run('status')}>Vérifier l’accès</Button>
      <Button variant="destructive" disabled={busy || !email} onClick={() => run('revoke')}>Révoquer l’accès JVZoo</Button>
    </div>
    {result && <p role="status" className="text-sm font-medium">{result}</p>}
  </section>;
}