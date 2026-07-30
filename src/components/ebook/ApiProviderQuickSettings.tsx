import React, { useMemo, useState } from 'react';
import { CheckCircle2, KeyRound, Loader2, Save, Settings2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  type AIProvider,
  formatModelPricing,
  getOpenRouterModel,
  getProvider,
  getProviderKey,
  OPENROUTER_MODELS,
  PROVIDER_KEY_HINT,
  PROVIDER_LABELS,
  setOpenRouterModel,
  setProvider,
  setProviderKey,
  validateKeyFormat,
} from '@/services/aiWritingService';
import { testAIProviderKey } from '@/services/aiProviderKeyTest';
import { GeminiKeyManager } from './GeminiKeyManager';

type TestState = 'idle' | 'testing' | 'ok' | 'fail';

interface ApiProviderQuickSettingsProps {
  onOpenAdvanced?: () => void;
  onStatusChange?: () => void;
}

export const ApiProviderQuickSettings: React.FC<ApiProviderQuickSettingsProps> = ({ onOpenAdvanced, onStatusChange }) => {
  const [provider, setProviderState] = useState<AIProvider>(getProvider());
  const [keys, setKeys] = useState<Record<AIProvider, string>>({
    gemini: getProviderKey('gemini'),
    claude: getProviderKey('claude'),
    openai: getProviderKey('openai'),
    openrouter: getProviderKey('openrouter'),
  });
  const [openrouterModel, setOpenrouterModelState] = useState<string>(getOpenRouterModel());
  const [openrouterCustom, setOpenrouterCustom] = useState<boolean>(
    !OPENROUTER_MODELS.some((m) => m.id === getOpenRouterModel())
  );
  const [providerTest, setProviderTest] = useState<Record<AIProvider, TestState>>({
    gemini: 'idle', claude: 'idle', openai: 'idle', openrouter: 'idle',
  });
  const [dirty, setDirty] = useState(false);

  const currentKey = keys[provider];
  const keyValid = currentKey ? validateKeyFormat(provider, currentKey) : false;
  const activeModel = useMemo(() => OPENROUTER_MODELS.find((m) => m.id === openrouterModel), [openrouterModel]);

  const updateProvider = (p: AIProvider) => {
    setProviderState(p);
    setProvider(p);
    setDirty(false);
    onStatusChange?.();
  };

  const updateKey = (p: AIProvider, value: string) => {
    setKeys((prev) => ({ ...prev, [p]: value }));
    setDirty(true);
    setProviderTest((prev) => ({ ...prev, [p]: 'idle' }));
  };

  const saveCurrentKey = () => {
    if (!currentKey || !validateKeyFormat(provider, currentKey)) {
      toast.error(`Format de clé ${PROVIDER_LABELS[provider]} invalide.`);
      return;
    }
    try {
      setProvider(provider);
      setProviderKey(provider, currentKey);
      const savedKey = getProviderKey(provider);
      if (!savedKey || !validateKeyFormat(provider, savedKey)) {
        throw new Error('La clé n’a pas pu être relue après son enregistrement.');
      }
      setKeys((prev) => ({ ...prev, [provider]: savedKey }));
      setDirty(false);
      setProviderTest((prev) => ({ ...prev, [provider]: 'idle' }));
      onStatusChange?.();
      toast.success(`Clé ${PROVIDER_LABELS[provider]} sauvegardée et activée.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Stockage indisponible dans ce navigateur.';
      toast.error('Impossible de sauvegarder la clé.', { description: message });
    }
  };

  const updateOpenrouterModel = (model: string) => {
    setOpenrouterModelState(model);
    setOpenRouterModel(model);
    onStatusChange?.();
  };

  const validateCurrentKey = async () => {
    if (dirty) {
      toast.error('Sauvegardez d’abord la clé avant de la valider.');
      return;
    }
    setProviderTest((prev) => ({ ...prev, [provider]: 'testing' }));
    const result = await testAIProviderKey(provider, currentKey);
    setProviderTest((prev) => ({ ...prev, [provider]: result.ok ? 'ok' : 'fail' }));
    onStatusChange?.();
    if (result.ok) toast.success(`Clé ${PROVIDER_LABELS[provider]} valide ✓${result.extra || ''}`);
    else toast.error(result.error || `Clé ${PROVIDER_LABELS[provider]} rejetée.`);
  };

  const TestIcon = ({ state }: { state: TestState }) => {
    if (state === 'testing') return <Loader2 className="h-4 w-4 animate-spin" />;
    if (state === 'ok') return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    if (state === 'fail') return <XCircle className="h-4 w-4 text-destructive" />;
    return null;
  };

  return (
    <section className="mt-4 rounded-2xl border p-4" style={{ borderColor: keyValid ? '#1f9d6b55' : '#E8951E66', background: keyValid ? '#1f9d6b0d' : '#FFF3DF' }}>
      <div className="flex flex-wrap items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border" style={{ background: '#fff', color: keyValid ? '#1f9d6b' : '#C97A14', borderColor: keyValid ? '#1f9d6b44' : '#E8951E44' }}>
          {keyValid ? <CheckCircle2 className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black" style={{ color: '#2A2118' }}>Clés API & modèles IA</h3>
            <span className="rounded-full border px-2 py-0.5 text-[10px] font-bold" style={{ borderColor: keyValid ? '#1f9d6b55' : '#E8951E66', color: keyValid ? '#1f9d6b' : '#C97A14', background: '#fff' }}>
              {keyValid ? 'clé prête' : 'clé à valider'}
            </span>
          </div>
          <p className="mt-0.5 text-[12px]" style={{ color: '#6f5e47' }}>
            Choisissez le fournisseur, collez la clé, puis validez-la ici avant de lancer les agents.
          </p>
        </div>
        {onOpenAdvanced && (
          <Button type="button" variant="outline" size="sm" onClick={onOpenAdvanced} className="gap-1.5">
            <Settings2 className="h-4 w-4" /> Réglages complets
          </Button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="space-y-1.5 lg:col-span-3">
          <Label>Fournisseur IA</Label>
          <Select value={provider} onValueChange={(value: AIProvider) => updateProvider(value)}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(['gemini', 'claude', 'openai', 'openrouter'] as AIProvider[]).map((p) => (
                <SelectItem key={p} value={p}>{PROVIDER_LABELS[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 lg:col-span-7">
          <Label>Clé API {PROVIDER_LABELS[provider]}</Label>
          <Input
            type="password"
            value={currentKey}
            onChange={(event) => updateKey(provider, event.target.value)}
            placeholder={PROVIDER_KEY_HINT[provider]}
            className="bg-background"
          />
          <p className="text-[11px]" style={{ color: currentKey ? (keyValid ? '#1f9d6b' : '#c0392b') : '#8a7860' }}>
            {currentKey ? (keyValid ? 'Format de clé valide. Cliquez sur Valider la clé pour tester.' : 'Format inattendu — vérifiez la clé copiée.') : 'Aucune clé saisie pour ce fournisseur.'}
          </p>
        </div>

        <div className="flex items-end gap-2 lg:col-span-2 lg:flex-col lg:justify-end">
          <Button
            type="button"
            disabled={!currentKey || !keyValid || !dirty}
            onClick={saveCurrentKey}
            className="w-full gap-1.5"
          >
            <Save className="h-4 w-4" />
            Sauvegarder
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!currentKey || dirty || providerTest[provider] === 'testing'}
            onClick={validateCurrentKey}
            className="w-full gap-1.5"
          >
            <TestIcon state={providerTest[provider]} />
            Tester
          </Button>
        </div>
      </div>

      {provider === 'gemini' && (
        <GeminiKeyManager onChange={onStatusChange} />
      )}


      {provider === 'openrouter' && (
        <div className="mt-4 rounded-xl border bg-background p-3" style={{ borderColor: '#eadfc9' }}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <Label>Modèle OpenRouter utilisé par les agents</Label>
            <button
              type="button"
              className="text-[11px] font-bold underline"
              style={{ color: '#008296' }}
              onClick={() => setOpenrouterCustom((prev) => !prev)}
            >
              {openrouterCustom ? 'Revenir à la liste' : 'Saisir un slug personnalisé'}
            </button>
          </div>
          {openrouterCustom ? (
            <Input
              value={openrouterModel}
              onChange={(event) => updateOpenrouterModel(event.target.value)}
              placeholder="ex: anthropic/claude-sonnet-4.5"
            />
          ) : (
            <Select value={openrouterModel} onValueChange={updateOpenrouterModel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="max-w-[520px]">
                {OPENROUTER_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col gap-0.5 py-0.5">
                      <span className="font-medium">{model.label}{model.recommended ? ' · recommandé' : ''}</span>
                      <span className="text-[11px] text-muted-foreground">{model.tag}{model.pricing ? ` · ${formatModelPricing(model)}` : ''}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <p className="mt-2 text-[11px]" style={{ color: '#6f5e47' }}>
            Actif : {activeModel?.label || openrouterModel || 'aucun modèle sélectionné'}
          </p>
        </div>
      )}
    </section>
  );
};

export default ApiProviderQuickSettings;