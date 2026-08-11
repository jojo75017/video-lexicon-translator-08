import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Download, Facebook, Image as ImageIcon, MessageSquare, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import {
  FACEBOOK_POSTS,
  PINTEREST_PINS,
  FACEBOOK_COMMENTS,
  GROUP_RULES,
} from '@/data/socialLaunchKit';

function CopyButton({ value, label = 'Copier le texte' }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-1.5"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        toast.success('Copié');
        setTimeout(() => setDone(false), 1600);
      }}
    >
      {done ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {label}
    </Button>
  );
}

function DownloadButton({ src, filename }: { src: string; filename: string }) {
  return (
    <Button size="sm" variant="secondary" className="gap-1.5" asChild>
      <a href={src} download={filename}>
        <Download className="w-3.5 h-3.5" /> Visuel
      </a>
    </Button>
  );
}

export default function AdminPublishingKitPage({ embedded = false }: { embedded?: boolean }) {
  const navigate = useNavigate();

  const content = (
      <div className={embedded ? "space-y-6" : "max-w-6xl mx-auto px-4 py-8 space-y-6"}>
        {!embedded && <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Button>
        </div>}

        <header className="space-y-2">
          <Badge variant="outline" className="text-xs">Campagne 47 € — jusqu'au 30/09/2026</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Kit de publication</h1>
          <p className="text-muted-foreground max-w-2xl">
            {FACEBOOK_POSTS.length} posts Facebook et {PINTEREST_PINS.length} épingles Pinterest, visuels inclus.
            Tous les liens pointent vers la démo du Génie avec leur balise de suivi, pour savoir quel canal
            amène les inscriptions.
          </p>
        </header>

        <Tabs defaultValue="facebook">
          <TabsList>
            <TabsTrigger value="facebook" className="gap-1.5"><Facebook className="w-4 h-4" /> Facebook</TabsTrigger>
            <TabsTrigger value="pinterest" className="gap-1.5"><ImageIcon className="w-4 h-4" /> Pinterest</TabsTrigger>
            <TabsTrigger value="regles" className="gap-1.5"><ShieldAlert className="w-4 h-4" /> Règles & commentaires</TabsTrigger>
          </TabsList>

          <TabsContent value="facebook" className="space-y-4 mt-5">
            {FACEBOOK_POSTS.map((post, i) => (
              <Card key={post.id} className="p-4">
                <div className="grid md:grid-cols-[220px_1fr] gap-4">
                  <img
                    src={post.image}
                    alt={post.goal}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="w-full rounded-lg border object-cover aspect-square"
                  />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="text-xs">Post {i + 1}</Badge>
                      <span className="text-sm font-medium">{post.goal}</span>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
                      {post.text}
                    </pre>
                    <div className="flex flex-wrap gap-2">
                      <CopyButton value={post.text} />
                      <CopyButton value={post.link} label="Copier le lien" />
                      <DownloadButton src={post.image} filename={post.imageFile} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pinterest" className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PINTEREST_PINS.map((pin) => (
              <Card key={pin.id} className="p-3 space-y-3">
                <img
                  src={pin.image}
                  alt={pin.title}
                  loading="lazy"
                  width={1024}
                  height={1536}
                  className="w-full rounded-lg border object-cover aspect-[2/3]"
                />
                <Badge variant="outline" className="text-xs">Tableau : {pin.board}</Badge>
                <p className="text-sm font-semibold leading-snug">{pin.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{pin.description}</p>
                <div className="flex flex-wrap gap-2">
                  <CopyButton value={pin.title} label="Titre" />
                  <CopyButton value={pin.description} label="Description" />
                  <CopyButton value={pin.link} label="Lien" />
                  <DownloadButton src={pin.image} filename={pin.imageFile} />
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="regles" className="mt-5 grid md:grid-cols-2 gap-4">
            <Card className="p-4 space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Règles anti-spam dans les groupes
              </h2>
              <ul className="space-y-3">
                {GROUP_RULES.map((r) => (
                  <li key={r.title} className="text-sm">
                    <span className="font-medium">{r.title}</span>
                    <p className="text-muted-foreground text-xs mt-0.5">{r.detail}</p>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-4 space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Commentaires utiles (sans lien)
              </h2>
              <ul className="space-y-3">
                {FACEBOOK_COMMENTS.map((c, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="flex-1 leading-relaxed">{c}</span>
                    <CopyButton value={c} label="" />
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );

  if (embedded) return content;

  return (
    <div className="min-h-screen bg-background">
      <AdminPanelNav />
      {content}
    </div>
  );
}
