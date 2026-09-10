import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Copy, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import rawScript from '@/data/scriptLoomV3.md?raw';

type Section = { title: string; body: string };

function parseScript(md: string): { intro: string; sections: Section[] } {
  const blocks = md.split(/\n##\s+/);
  const intro = blocks[0].replace(/^#\s+.*\n/, '').replace(/\n?---\n?/g, '').trim();
  const sections = blocks.slice(1).map((block) => {
    const newline = block.indexOf('\n');
    const title = (newline === -1 ? block : block.slice(0, newline)).trim();
    const body = (newline === -1 ? '' : block.slice(newline + 1))
      .replace(/\n?---\n?/g, '')
      .trim();
    return { title, body };
  });
  return { intro, sections };
}

function CopyButton({ value, label = 'Copier' }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }}
    >
      {done ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
      {done ? 'Copié' : label}
    </Button>
  );
}

export default function AdminScriptVideoPage() {
  const navigate = useNavigate();
  const { intro, sections } = useMemo(() => parseScript(rawScript), []);

  const words = useMemo(
    () => rawScript.split(/\s+/).filter(Boolean).length,
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminPanelNav />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate('/admin')}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Retour au dashboard
        </Button>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Video className="h-6 w-6" />
            Script vidéo V3 (Loom)
          </h1>
          <Badge variant="secondary">{sections.length} parties</Badge>
          <Badge variant="secondary">≈ {Math.round(words / 140)} min de lecture</Badge>
          <CopyButton value={rawScript} label="Copier tout le script" />
        </div>

        <Card className="mb-6 p-4">
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{intro}</p>
        </Card>

        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.title} className="p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <CopyButton value={`${section.title}\n\n${section.body}`} />
              </div>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{section.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
