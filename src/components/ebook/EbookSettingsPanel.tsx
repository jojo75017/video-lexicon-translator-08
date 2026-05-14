import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings2, KeyRound, Type, Image as ImageIcon, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  type AIProvider,
  PROVIDER_LABELS,
  PROVIDER_KEY_HINT,
  getProvider,
  setProvider,
  getProviderKey,
  setProviderKey,
  validateKeyFormat,
} from '@/services/aiWritingService';
import {
  DEFAULT_TYPOGRAPHY,
  type EbookExportTypography,
  type ExportFontFamily,
} from '@/lib/ebookExportOptions';

const TYPO_LS = 'ebook_export_typography_v1';
const OPENROUTER_LS = 'openrouter_image_api_key';

export const loadTypography = (): EbookExportTypography => {
  if (typeof window === 'undefined') return DEFAULT_TYPOGRAPHY;
  try {
    const raw = localStorage.getItem(TYPO_LS);
    if (raw) return { ...DEFAULT_TYPOGRAPHY, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_TYPOGRAPHY;
};
export const saveTypography = (t: EbookExportTypography) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TYPO_LS, JSON.stringify(t));
};

export const getOpenRouterKey = (): string => {
  if (typeof window === 'undefined') return '';
  return (localStorage.getItem(OPENROUTER_LS) || '').trim();
};
export const setOpenRouterKey = (k: string) => {
  if (typeof window === 'undefined') return;
  const v = (k || '').trim();
  if (v) localStorage.setItem(OPENROUTER_LS, v);
  else localStorage.removeItem(OPENROUTER_LS);
};

interface Props {
  onTypographyChange?: (t: EbookExportTypography) => void;
}

export const EbookSettingsPanel: React.FC<Props> = ({ onTypographyChange }) => {
  const [provider, setProviderState] = useState<AIProvider>(getProvider());
  const [keys, setKeys] = useState<Record<AIProvider, string>>({
    gemini: getProviderKey('gemini'),
    claude: getProviderKey('claude'),
    openai: getProviderKey('openai'),
  });
  const [openrouter, setOpenrouter] = useState<string>(getOpenRouterKey());
  const [typo, setTypo] = useState<EbookExportTypography>(loadTypography());

  type TestState = 'idle' | 'testing' | 'ok' | 'fail';
  const [providerTest, setProviderTest] = useState<Record<AIProvider, TestState>>({
    gemini: 'idle', claude: 'idle', openai: 'idle',
  });
  const [openrouterTest, setOpenrouterTest] = useState<TestState>('idle');

  useEffect(() => { onTypographyChange?.(typo); }, [typo, onTypographyChange]);

  const updateProvider = (p: AIProvider) => {
    setProviderState(p);
    setProvider(p);
  };
  const updateKey = (p: AIProvider, v: string) => {
    setKeys(k => ({ ...k, [p]: v }));
    setProviderKey(p, v);
    setProviderTest(s => ({ ...s, [p]: 'idle' }));
  };
  const updateOpenRouter = (v: string) => {
    setOpenrouter(v);
    setOpenRouterKey(v);
    setOpenrouterTest('idle');
  };
  const updateTypo = (patch: Partial<EbookExportTypography>) => {
    const next = { ...typo, ...patch };
    setTypo(next);
    saveTypography(next);
  };

  const testProviderKey = async (p: AIProvider) => {
    const key = (keys[p] || '').trim();
    if (!key) { toast.error('Saisissez d\'abord la clé.'); return; }
    if (!validateKeyFormat(p, key)) {
      setProviderTest(s => ({ ...s, [p]: 'fail' }));
      toast.error(`Format de clé ${PROVIDER_LABELS[p]} invalide.`);
      return;
    }
    setProviderTest(s => ({ ...s, [p]: 'testing' }));
    try {
      let ok = false;
      if (p === 'gemini') {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`);
        ok = r.ok || r.status === 429;
      } else if (p === 'openai') {
        const r = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${key}` },
        });
        ok = r.ok || r.status === 429;
      } else if (p === 'claude') {
        const r = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'ping' }],
          }),
        });
        // 200 = ok, 429 = quota mais clé valide, 400 (bad request) peut indiquer clé valide selon la réponse
        ok = r.ok || r.status === 429;
      }
      setProviderTest(s => ({ ...s, [p]: ok ? 'ok' : 'fail' }));
      ok ? toast.success(`Clé ${PROVIDER_LABELS[p]} valide ✓`) : toast.error(`Clé ${PROVIDER_LABELS[p]} rejetée.`);
    } catch (e) {
      console.error('[KeyTest]', p, e);
      setProviderTest(s => ({ ...s, [p]: 'fail' }));
      toast.error('Erreur réseau lors du test.');
    }
  };

  const testOpenRouter = async () => {
    const key = openrouter.trim();
    if (!key) { toast.error('Saisissez d\'abord la clé OpenRouter.'); return; }
    if (!key.startsWith('sk-or-')) {
      setOpenrouterTest('fail');
      toast.error('Une clé OpenRouter commence par sk-or-');
      return;
    }
    setOpenrouterTest('testing');
    try {
      const r = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: { Authorization: `Bearer ${key}` },
      });
      const ok = r.ok;
      setOpenrouterTest(ok ? 'ok' : 'fail');
      if (ok) {
        const j = await r.json().catch(() => ({}));
        const credits = j?.data?.limit_remaining ?? j?.data?.usage;
        toast.success(`Clé OpenRouter valide ✓${credits != null ? ` (crédits: ${credits})` : ''}`);
      } else {
        toast.error('Clé OpenRouter rejetée.');
      }
    } catch (e) {
      console.error('[OpenRouterTest]', e);
      setOpenrouterTest('fail');
      toast.error('Erreur réseau lors du test.');
    }
  };

  const TestIcon = ({ s }: { s: TestState }) =>
    s === 'testing' ? <Loader2 className="w-4 h-4 animate-spin" /> :
    s === 'ok' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
    s === 'fail' ? <XCircle className="w-4 h-4 text-destructive" /> : null;

  const currentKey = keys[provider];
  const keyValid = currentKey ? validateKeyFormat(provider, currentKey) : null;
  const openrouterValid = openrouter ? openrouter.startsWith('sk-or-') : null;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings2 className="w-5 h-5 text-primary" />
          Réglages avancés (rédaction, images, mise en page)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* === Lot 3 : provider rédaction === */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <KeyRound className="w-4 h-4" /> Moteur de rédaction
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={provider} onValueChange={(v: AIProvider) => updateProvider(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['gemini', 'claude', 'openai'] as AIProvider[]).map(p => (
                    <SelectItem key={p} value={p}>{PROVIDER_LABELS[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Clé API {PROVIDER_LABELS[provider]}</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={currentKey}
                  onChange={e => updateKey(provider, e.target.value)}
                  placeholder={PROVIDER_KEY_HINT[provider]}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!currentKey || providerTest[provider] === 'testing'}
                  onClick={() => testProviderKey(provider)}
                  className="gap-1"
                >
                  <TestIcon s={providerTest[provider]} />
                  Tester
                </Button>
              </div>
              {currentKey && (
                <p className={`text-xs ${keyValid ? 'text-emerald-600' : 'text-destructive'}`}>
                  {keyValid ? '✓ Format de clé valide' : '⚠️ Format inattendu — vérifiez la clé'}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Vos clés restent stockées sur votre navigateur (BYOK). Elles ne sont jamais transmises à nos serveurs.
          </p>
        </section>

        {/* === Lot 2 : OpenRouter pour les images === */}
        <section className="space-y-3 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ImageIcon className="w-4 h-4" /> Générateur d'illustrations (optionnel)
          </div>
          <div className="space-y-2">
            <Label>Clé OpenRouter (sk-or-…)</Label>
            <div className="flex gap-2">
              <Input
                type="password"
                value={openrouter}
                onChange={e => updateOpenRouter(e.target.value)}
                placeholder="sk-or-v1-… (laissez vide pour utiliser les crédits Lovable)"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!openrouter || openrouterTest === 'testing'}
                onClick={testOpenRouter}
                className="gap-1"
              >
                <TestIcon s={openrouterTest} />
                Tester
              </Button>
            </div>
            {openrouter && (
              <p className={`text-xs ${openrouterValid ? 'text-emerald-600' : 'text-destructive'}`}>
                {openrouterValid ? '✓ Clé OpenRouter détectée — vos images utiliseront vos crédits OpenRouter' : '⚠️ Une clé OpenRouter commence par sk-or-'}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Avec votre propre clé OpenRouter, les images sont facturées sur votre compte OpenRouter (et non sur les crédits Lovable).
            </p>
          </div>
        </section>

        {/* === Lot 1 : typographie export === */}
        <section className="space-y-3 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Type className="w-4 h-4" /> Mise en page de l'export (DOCX & PDF)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label>Police</Label>
              <Select
                value={typo.fontFamily}
                onValueChange={(v: ExportFontFamily) => updateTypo({ fontFamily: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Calibri">Calibri (sans serif)</SelectItem>
                  <SelectItem value="Helvetica">Helvetica (sans serif)</SelectItem>
                  <SelectItem value="Georgia">Georgia (serif)</SelectItem>
                  <SelectItem value="Garamond">Garamond (serif classique)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Taille des titres</Label>
              <Select
                value={String(typo.headingSize)}
                onValueChange={(v) => updateTypo({ headingSize: Number(v) as 14 | 16 })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="14">14 pt</SelectItem>
                  <SelectItem value="16">16 pt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Taille du corps</Label>
              <Select
                value={String(typo.bodySize)}
                onValueChange={(v) => updateTypo({ bodySize: Number(v) as 11 | 12 | 14 })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="11">11 pt</SelectItem>
                  <SelectItem value="12">12 pt</SelectItem>
                  <SelectItem value="14">14 pt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Texte justifié</Label>
              <div className="flex items-center h-10 gap-2">
                <Checkbox
                  id="justify-toggle"
                  checked={typo.justify}
                  onCheckedChange={(checked) => updateTypo({ justify: checked === true })}
                />
                <label htmlFor="justify-toggle" className="text-xs text-muted-foreground cursor-pointer">
                  {typo.justify ? 'Justifié (livre)' : 'Aligné à gauche'}
                </label>
              </div>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};
