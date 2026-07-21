import React, { useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, Loader2, Plus, Star, Trash2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  addGeminiKey,
  getActiveGeminiKeyId,
  getGeminiKeys,
  isValidGoogleKey,
  removeGeminiKey,
  setActiveGeminiKeyId,
  updateGeminiKey,
  type GeminiKeyEntry,
} from '@/services/aiWritingService';
import { testAIProviderKey } from '@/services/aiProviderKeyTest';

interface Props { onChange?: () => void }

export const GeminiKeyManager: React.FC<Props> = ({ onChange }) => {
  const [list, setList] = useState<GeminiKeyEntry[]>([]);
  const [activeId, setActive] = useState<string>('');
  const [newLabel, setNewLabel] = useState('');
  const [newKey, setNewKey] = useState('');
  const [testingId, setTestingId] = useState<string>('');

  const refresh = () => {
    setList(getGeminiKeys());
    setActive(getActiveGeminiKeyId());
    onChange?.();
  };

  useEffect(() => { refresh(); }, []);

  const handleAdd = () => {
    const label = newLabel.trim() || `Projet ${list.length + 1}`;
    if (!isValidGoogleKey(newKey)) {
      toast.error('Format de clé Gemini invalide (AIza… ou AQ.Ab…).');
      return;
    }
    const entry = addGeminiKey(label, newKey);
    if (!entry) return;
    toast.success(`Clé « ${entry.label} » ajoutée et activée.`);
    setNewLabel(''); setNewKey('');
    refresh();
  };

  const handleActivate = (id: string) => {
    setActiveGeminiKeyId(id);
    const entry = getGeminiKeys().find((e) => e.id === id);
    toast.success(`Clé active : ${entry?.label || id}`);
    refresh();
  };

  const handleRemove = (id: string) => {
    if (!confirm('Supprimer cette clé Gemini ?')) return;
    removeGeminiKey(id);
    refresh();
  };

  const handleTest = async (entry: GeminiKeyEntry) => {
    setTestingId(entry.id);
    const res = await testAIProviderKey('gemini', entry.key);
    setTestingId('');
    if (res.ok) toast.success(`« ${entry.label} » ✓ valide${res.extra || ''}`);
    else toast.error(`« ${entry.label} » : ${res.error || 'rejetée'}`);
  };

  const handleRelabel = (id: string, label: string) => {
    updateGeminiKey(id, { label });
    refresh();
  };

  return (
    <div className="mt-4 rounded-xl border bg-background p-3" style={{ borderColor: '#eadfc9' }}>
      <div className="mb-3 flex items-center gap-2">
        <KeyRound className="h-4 w-4" style={{ color: '#C97A14' }} />
        <h4 className="text-sm font-black" style={{ color: '#2A2118' }}>
          Mes clés Gemini ({list.length})
        </h4>
        <span className="text-[11px]" style={{ color: '#6f5e47' }}>
          — ajoutez une clé par projet Google Cloud, puis choisissez laquelle est utilisée.
        </span>
      </div>

      {list.length === 0 && (
        <p className="mb-3 text-[12px]" style={{ color: '#6f5e47' }}>
          Aucune clé enregistrée. Ajoutez-en une ci-dessous.
        </p>
      )}

      <ul className="space-y-2">
        {list.map((entry) => {
          const isActive = entry.id === activeId;
          const valid = isValidGoogleKey(entry.key);
          return (
            <li
              key={entry.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border p-2"
              style={{
                borderColor: isActive ? '#1f9d6b66' : '#eadfc9',
                background: isActive ? '#1f9d6b0d' : '#fff',
              }}
            >
              <button
                type="button"
                onClick={() => handleActivate(entry.id)}
                title={isActive ? 'Clé active' : 'Activer cette clé'}
                className="grid h-8 w-8 place-items-center rounded-full border"
                style={{
                  borderColor: isActive ? '#1f9d6b' : '#d8c9a8',
                  background: isActive ? '#1f9d6b' : '#fff',
                  color: isActive ? '#fff' : '#8a7860',
                }}
              >
                <Star className="h-4 w-4" fill={isActive ? '#fff' : 'none'} />
              </button>
              <Input
                value={entry.label}
                onChange={(e) => handleRelabel(entry.id, e.target.value)}
                className="h-8 max-w-[180px] bg-background text-xs"
              />
              <span className="rounded bg-muted px-2 py-1 font-mono text-[11px]" style={{ color: valid ? '#1f9d6b' : '#c0392b' }}>
                {entry.key.slice(0, 8)}…{entry.key.slice(-4)}
              </span>
              {valid ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
              <div className="ml-auto flex items-center gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={testingId === entry.id}
                  onClick={() => handleTest(entry)}
                  className="h-7 gap-1 text-[11px]"
                >
                  {testingId === entry.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  Tester
                </Button>
                {!isActive && (
                  <Button type="button" size="sm" variant="outline" onClick={() => handleActivate(entry.id)} className="h-7 text-[11px]">
                    Activer
                  </Button>
                )}
                <Button type="button" size="icon" variant="ghost" onClick={() => handleRemove(entry.id)} className="h-7 w-7 text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 grid grid-cols-1 gap-2 rounded-lg border border-dashed p-2 md:grid-cols-12" style={{ borderColor: '#d8c9a8' }}>
        <div className="md:col-span-3">
          <Label className="text-[11px]">Nom du projet</Label>
          <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Projet 2" className="h-8 bg-background text-xs" />
        </div>
        <div className="md:col-span-7">
          <Label className="text-[11px]">Nouvelle clé Gemini</Label>
          <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="AIza… ou AQ.Ab…" type="password" className="h-8 bg-background text-xs" />
        </div>
        <div className="flex items-end md:col-span-2">
          <Button type="button" onClick={handleAdd} disabled={!newKey} className="h-8 w-full gap-1 text-xs">
            <Plus className="h-3.5 w-3.5" /> Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeminiKeyManager;
