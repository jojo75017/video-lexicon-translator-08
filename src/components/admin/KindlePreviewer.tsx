import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Smartphone, Tablet, BookOpen } from 'lucide-react';
import { parseManuscript } from '@/lib/manuscriptParser';

const TEAL = '#008296';

type Device = 'phone' | 'tablet' | 'kindle';

const DEVICES: { id: Device; label: string; icon: React.ElementType; width: number; height: number; pad: number; font: number }[] = [
  { id: 'phone',  label: 'Téléphone', icon: Smartphone, width: 280, height: 520, pad: 18, font: 14 },
  { id: 'tablet', label: 'Tablette',  icon: Tablet,     width: 380, height: 520, pad: 28, font: 16 },
  { id: 'kindle', label: 'Kindle',    icon: BookOpen,   width: 330, height: 520, pad: 24, font: 15 },
];

/**
 * Kindle Previewer simulé — aperçu du rendu typographique sur 3 supports.
 */
const KindlePreviewer: React.FC = () => {
  const [title, setTitle] = useState('Mon livre');
  const [text, setText] = useState(
    '# Chapitre 1\n\nIl était une fois un texte que vous pouvez coller ici pour voir comment il apparaîtra sur les liseuses Kindle, tablettes et téléphones.\n\nLes paragraphes sont automatiquement mis en forme avec une justification et un interligne fidèles au rendu Amazon.'
  );
  const [device, setDevice] = useState<Device>('kindle');
  const [sepia, setSepia] = useState(true);

  const sections = parseManuscript(text, title);
  const cfg = DEVICES.find((d) => d.id === device)!;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Titre</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="flex items-end gap-2">
          {DEVICES.map((d) => {
            const Icon = d.icon;
            const active = device === d.id;
            return (
              <Button key={d.id} variant={active ? 'default' : 'outline'} size="sm"
                onClick={() => setDevice(d.id)}
                style={active ? { background: TEAL, color: 'white' } : undefined}
                className="gap-1.5">
                <Icon className="h-3.5 w-3.5" /> {d.label}
              </Button>
            );
          })}
          <Button variant={sepia ? 'default' : 'outline'} size="sm" onClick={() => setSepia((s) => !s)}
            style={sepia ? { background: '#C9A87C', color: 'white' } : undefined}>
            Sépia
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="text-xs">Texte à prévisualiser</Label>
          <Textarea rows={16} value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <div className="flex justify-center">
          <div
            className="rounded-[28px] border-8 border-gray-800 shadow-xl overflow-hidden"
            style={{ width: cfg.width, height: cfg.height, background: sepia ? '#F4ECD8' : '#FFFFFF' }}
          >
            <div
              className="h-full overflow-y-auto"
              style={{ padding: cfg.pad, color: sepia ? '#5B4636' : '#232F3E', fontSize: cfg.font, lineHeight: 1.6, textAlign: 'justify', fontFamily: 'Georgia, serif' }}
            >
              <div style={{ textAlign: 'center', fontWeight: 700, fontSize: cfg.font + 4, marginBottom: 16 }}>{title}</div>
              {sections.map((s, i) => (
                <div key={i} className="mb-3">
                  <div style={{ fontWeight: 700, fontSize: cfg.font + 1, margin: '12px 0 6px', textAlign: 'left' }}>{s.title}</div>
                  {s.blocks.map((b, j) => (
                    <p key={j} style={{ margin: '0 0 8px', textIndent: '1.2em' }}>{b.text}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KindlePreviewer;
