import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings2, KeyRound, Type, Image as ImageIcon } from 'lucide-react';
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

  useEffect(() => { onTypographyChange?.(typo); }, [typo, onTypographyChange]);

  const updateProvider = (p: AIProvider) => {
    setProviderState(p);
    setProvider(p);
  };
  const updateKey = (p: AIProvider, v: string) => {
    setKeys(k => ({ ...k, [p]: v }));
    setProviderKey(p, v);
  };
  const updateOpenRouter = (v: string) => {
    setOpenrouter(v);
    setOpenRouterKey(v);
  };
  const updateTypo = (patch: Partial<EbookExportTypography>) => {
    const next = { ...typo, ...patch };
    setTypo(next);
    saveTypography(next);
  };

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
              <Input
                type="password"
                value={currentKey}
                onChange={e => updateKey(provider, e.target.value)}
                placeholder={PROVIDER_KEY_HINT[provider]}
              />
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
            <Input
              type="password"
              value={openrouter}
              onChange={e => updateOpenRouter(e.target.value)}
              placeholder="sk-or-v1-… (laissez vide pour utiliser les crédits Lovable)"
            />
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
                <Switch
                  checked={typo.justify}
                  onCheckedChange={(checked) => updateTypo({ justify: checked })}
                />
                <span className="text-xs text-muted-foreground">
                  {typo.justify ? 'Justifié (livre)' : 'Aligné à gauche'}
                </span>
              </div>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};
