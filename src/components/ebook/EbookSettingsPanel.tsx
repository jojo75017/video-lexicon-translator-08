import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings2, KeyRound, Type, Image as ImageIcon, Loader2, CheckCircle2, XCircle, Palette } from 'lucide-react';
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
  sanitizeKey,
  OPENROUTER_MODELS,
  getOpenRouterModel,
  setOpenRouterModel,
} from '@/services/aiWritingService';
import {
  DEFAULT_TYPOGRAPHY,
  type EbookExportTypography,
  type ExportFontFamily,
  type ExportLineHeight,
  type ExportMargin,
  COLOR_PRESETS,
  TYPO_PRESETS,
  loadTypography,
  saveTypography,
  getOpenRouterImageKey,
  setOpenRouterImageKey,
} from '@/lib/ebookExportOptions';
import { formatModelPricing } from '@/services/aiWritingService';

// Re-export pour compat avec imports existants
export { loadTypography, saveTypography };
export const getOpenRouterKey = getOpenRouterImageKey;
export const setOpenRouterKey = setOpenRouterImageKey;

interface Props {
  onTypographyChange?: (t: EbookExportTypography) => void;
}

export const EbookSettingsPanel: React.FC<Props> = ({ onTypographyChange }) => {
  const [provider, setProviderState] = useState<AIProvider>(getProvider());
  const [keys, setKeys] = useState<Record<AIProvider, string>>({
    gemini: getProviderKey('gemini'),
    claude: getProviderKey('claude'),
    openai: getProviderKey('openai'),
    openrouter: getProviderKey('openrouter'),
  });
  const [openrouterModel, setOpenrouterModelState] = useState<string>(getOpenRouterModel());
  const [openrouterCustom, setOpenrouterCustom] = useState<boolean>(
    !OPENROUTER_MODELS.some(m => m.id === getOpenRouterModel())
  );
  const [typo, setTypo] = useState<EbookExportTypography>(loadTypography());

  type TestState = 'idle' | 'testing' | 'ok' | 'fail';
  const [providerTest, setProviderTest] = useState<Record<AIProvider, TestState>>({
    gemini: 'idle', claude: 'idle', openai: 'idle', openrouter: 'idle',
  });

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
  const updateOpenrouterModel = (m: string) => {
    setOpenrouterModelState(m);
    setOpenRouterModel(m);
  };
  const updateTypo = (patch: Partial<EbookExportTypography>) => {
    const next = { ...typo, ...patch };
    setTypo(next);
    saveTypography(next);
  };

  const applyColorPreset = (id: string) => {
    const p = COLOR_PRESETS.find(p => p.id === id);
    if (p) updateTypo({ headingColor: p.headingColor, bodyColor: p.bodyColor });
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
      let extra = '';
      if (p === 'gemini') {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`);
        ok = r.ok || r.status === 429;
      } else if (p === 'openai') {
        const r = await fetch('https://api.openai.com/v1/models', { headers: { Authorization: `Bearer ${key}` } });
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
        ok = r.ok || r.status === 429;
      } else if (p === 'openrouter') {
        const r = await fetch('https://openrouter.ai/api/v1/auth/key', {
          headers: { Authorization: `Bearer ${key}` },
        });
        ok = r.ok;
        if (ok) {
          const j = await r.json().catch(() => ({}));
          const credits = j?.data?.limit_remaining ?? j?.data?.usage;
          if (credits != null) extra = ` (crédits: ${credits})`;
        }
      }
      setProviderTest(s => ({ ...s, [p]: ok ? 'ok' : 'fail' }));
      ok ? toast.success(`Clé ${PROVIDER_LABELS[p]} valide ✓${extra}`) : toast.error(`Clé ${PROVIDER_LABELS[p]} rejetée.`);
    } catch (e) {
      console.error('[KeyTest]', p, e);
      setProviderTest(s => ({ ...s, [p]: 'fail' }));
      toast.error('Erreur réseau lors du test.');
    }
  };

  const TestIcon = ({ s }: { s: TestState }) =>
    s === 'testing' ? <Loader2 className="w-4 h-4 animate-spin" /> :
    s === 'ok' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
    s === 'fail' ? <XCircle className="w-4 h-4 text-destructive" /> : null;

  const currentKey = keys[provider];
  const keyValid = currentKey ? validateKeyFormat(provider, currentKey) : null;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings2 className="w-5 h-5 text-primary" />
          Réglages avancés (rédaction, images, mise en page)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* === Provider rédaction === */}
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
                  {(['gemini', 'claude', 'openai', 'openrouter'] as AIProvider[]).map(p => (
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

          {/* Choix du modèle OpenRouter */}
          {provider === 'openrouter' && (
            <div className="space-y-2 p-3 rounded-md bg-muted/40 border">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Modèle OpenRouter</Label>
                <button
                  type="button"
                  className="text-xs text-primary underline"
                  onClick={() => setOpenrouterCustom(c => !c)}
                >
                  {openrouterCustom ? '← Liste suggérée' : 'Saisir un slug personnalisé →'}
                </button>
              </div>
              {openrouterCustom ? (
                <Input
                  value={openrouterModel}
                  onChange={e => updateOpenrouterModel(e.target.value)}
                  placeholder="ex: anthropic/claude-sonnet-4"
                />
              ) : (
                <Select value={openrouterModel} onValueChange={updateOpenrouterModel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-w-[460px]">
                    {OPENROUTER_MODELS.map(m => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex flex-col gap-0.5 py-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{m.label}</span>
                            {m.recommended && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">⭐ Recommandé</span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {m.tag}{m.pricing ? ` · ${formatModelPricing(m)}` : ''}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-muted-foreground">
                Tous les agents (P1-P15, chat, génération de chapitres…) utiliseront ce modèle via votre clé OpenRouter.
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Vos clés restent stockées sur votre navigateur (BYOK). Elles ne sont jamais transmises à nos serveurs.
          </p>
        </section>

        {/* === Note OpenRouter pour les images === */}
        <section className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ImageIcon className="w-4 h-4" /> Générateur d'illustrations
          </div>
          <p className="text-xs text-muted-foreground">
            Si vous avez configuré une clé <code className="px-1 bg-muted rounded">OpenRouter</code> ci-dessus, elle est aussi utilisée pour les illustrations IA (sinon les crédits Lovable sont utilisés).
          </p>
        </section>

        {/* === Typographie export === */}
        <section className="space-y-3 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Type className="w-4 h-4" /> Mise en page de l'export (DOCX & PDF)
          </div>

          {/* Presets 1-clic */}
          <div className="space-y-2">
            <Label className="text-xs">Style en 1 clic</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {TYPO_PRESETS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { updateTypo(p.values); toast.success(`Style appliqué : ${p.label}`); }}
                  className="text-left px-3 py-2 rounded-lg border hover:border-[#008296] hover:bg-[#008296]/5 transition-colors"
                >
                  <div className="text-sm font-semibold">{p.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{p.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Aperçu live */}
          <div className="rounded-lg border bg-white p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Aperçu en temps réel</div>
            <div
              style={{
                fontFamily: typo.fontFamily === 'Calibri' ? 'Calibri, system-ui, sans-serif'
                          : typo.fontFamily === 'Helvetica' ? 'Helvetica, Arial, sans-serif'
                          : typo.fontFamily === 'Georgia' ? 'Georgia, serif'
                          : 'Garamond, "EB Garamond", serif',
                fontSize: `${typo.headingSize + 2}px`,
                color: typo.headingColor,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Chapitre 1 — Le commencement
            </div>
            <div
              style={{
                fontFamily: typo.fontFamily === 'Calibri' ? 'Calibri, system-ui, sans-serif'
                          : typo.fontFamily === 'Helvetica' ? 'Helvetica, Arial, sans-serif'
                          : typo.fontFamily === 'Georgia' ? 'Georgia, serif'
                          : 'Garamond, "EB Garamond", serif',
                fontSize: `${typo.bodySize + 2}px`,
                color: typo.bodyColor,
                lineHeight: typo.lineHeight,
                textAlign: typo.justify ? 'justify' : 'left',
              }}
            >
              Voici un aperçu de votre corps de texte. Vous pouvez glisser une phrase en <em>italique</em> en l'entourant de <code className="text-xs">_underscores_</code> dans vos chapitres.{' '}
              {typo.italicQuotes && (
                <span className="block mt-2 pl-3 border-l-2 border-current italic opacity-90">
                  « Une citation mise en italique automatiquement. »
                </span>
              )}
            </div>
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

          {/* Couleurs */}
          <div className="space-y-2 pt-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Palette className="w-3.5 h-3.5" /> Couleurs des titres et du texte
            </div>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyColorPreset(p.id)}
                  className="px-3 py-1.5 rounded-md border text-xs hover:bg-muted flex items-center gap-2"
                >
                  <span className="w-3 h-3 rounded-sm border" style={{ background: p.headingColor }} />
                  <span className="w-3 h-3 rounded-sm border" style={{ background: p.bodyColor }} />
                  {p.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Couleur des titres</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={typo.headingColor}
                    onChange={e => updateTypo({ headingColor: e.target.value })}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={typo.headingColor}
                    onChange={e => updateTypo({ headingColor: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Couleur du texte</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={typo.bodyColor}
                    onChange={e => updateTypo({ bodyColor: e.target.value })}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={typo.bodyColor}
                    onChange={e => updateTypo({ bodyColor: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Astuce : un texte plus clair (gris #4B5563) fatigue moins les yeux sur de longues lectures.
            </p>
          </div>

          {/* Italique + interligne + marges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
            <div className="space-y-2">
              <Label>Italique automatique</Label>
              <div className="flex items-center h-10 gap-2">
                <Checkbox
                  id="italic-toggle"
                  checked={typo.italicQuotes}
                  onCheckedChange={(checked) => updateTypo({ italicQuotes: checked === true })}
                />
                <label htmlFor="italic-toggle" className="text-xs text-muted-foreground cursor-pointer">
                  Citations (&gt;) en italique
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Interligne</Label>
              <Select
                value={String(typo.lineHeight)}
                onValueChange={(v) => updateTypo({ lineHeight: Number(v) as ExportLineHeight })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.15">1.15 (compact)</SelectItem>
                  <SelectItem value="1.5">1.5 (standard)</SelectItem>
                  <SelectItem value="2">2.0 (aéré)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Marges PDF</Label>
              <Select
                value={typo.margin}
                onValueChange={(v: ExportMargin) => updateTypo({ margin: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tight">Serrées (1.3 cm)</SelectItem>
                  <SelectItem value="standard">Standard (1.8 cm)</SelectItem>
                  <SelectItem value="wide">Larges (2.3 cm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Vous pouvez aussi utiliser <code className="px-1 bg-muted rounded">_texte_</code> dans vos chapitres pour mettre un passage en italique manuellement.
          </p>
        </section>
      </CardContent>
    </Card>
  );
};
