import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Copy, Loader2, Sparkles, Facebook, Linkedin, Instagram, Twitter,
  Share2, Users, MessageSquare, Hash, Megaphone, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EbookLaunchSocialPostsProps {
  ebookTitle?: string;
  authorName?: string;
  genre?: string;
  amazonLink?: string;
}

type Platform = 'facebook-group' | 'facebook-page' | 'linkedin' | 'instagram' | 'twitter' | 'tiktok' | 'pinterest';
type LaunchPhase = 'teaser' | 'launch-day' | 'social-proof' | 'promo' | 'storytelling';

interface GeneratedPost {
  platform: Platform;
  phase: LaunchPhase;
  content: string;
  hashtags: string[];
  visualTip: string;
}

const PLATFORMS: { id: Platform; label: string; icon: React.ElementType; color: string; maxChars: number }[] = [
  { id: 'facebook-group', label: 'Groupes Facebook', icon: Users, color: 'from-blue-600 to-blue-500', maxChars: 2000 },
  { id: 'facebook-page', label: 'Page Facebook', icon: Facebook, color: 'from-blue-700 to-blue-600', maxChars: 2000 },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'from-sky-700 to-sky-600', maxChars: 3000 },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'from-pink-600 to-purple-600', maxChars: 2200 },
  { id: 'twitter', label: 'X (Twitter)', icon: Twitter, color: 'from-zinc-800 to-zinc-700', maxChars: 280 },
  { id: 'tiktok', label: 'TikTok', icon: Share2, color: 'from-zinc-900 to-pink-600', maxChars: 2200 },
  { id: 'pinterest', label: 'Pinterest', icon: Hash, color: 'from-red-600 to-red-500', maxChars: 500 },
];

const PHASES: { id: LaunchPhase; label: string; emoji: string; description: string }[] = [
  { id: 'teaser', label: 'Teaser (J-7 à J-1)', emoji: '🔮', description: 'Créer l\'attente et la curiosité' },
  { id: 'launch-day', label: 'Jour de lancement', emoji: '🚀', description: 'Annonce officielle avec lien' },
  { id: 'social-proof', label: 'Preuve sociale', emoji: '⭐', description: 'Partager reviews et témoignages' },
  { id: 'promo', label: 'Promotion', emoji: '🎁', description: 'Offres spéciales et urgence' },
  { id: 'storytelling', label: 'Storytelling', emoji: '📖', description: 'L\'histoire derrière le livre' },
];

const EbookLaunchSocialPosts: React.FC<EbookLaunchSocialPostsProps> = ({
  ebookTitle = '',
  authorName = '',
  genre = '',
  amazonLink = '',
}) => {
  const [title, setTitle] = useState(ebookTitle);
  const [author, setAuthor] = useState(authorName);
  const [bookGenre, setBookGenre] = useState(genre);
  const [link, setLink] = useState(amazonLink);
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('facebook-group');
  const [selectedPhase, setSelectedPhase] = useState<LaunchPhase>('launch-day');
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error('Titre du livre requis');
      return;
    }

    setIsGenerating(true);
    try {
      const platform = PLATFORMS.find(p => p.id === selectedPlatform)!;
      const phase = PHASES.find(p => p.id === selectedPhase)!;

      const prompt = `Tu es un expert en marketing littéraire et réseaux sociaux. Génère 3 posts ${platform.label} pour un livre intitulé "${title}"${author ? ` par ${author}` : ''}${bookGenre ? ` (genre: ${bookGenre})` : ''}${targetAudience ? ` ciblant: ${targetAudience}` : ''}.

Phase de lancement : ${phase.label} — ${phase.description}
${link ? `Lien Amazon : ${link}` : ''}

CONTRAINTES STRICTES :
- Maximum ${platform.maxChars} caractères par post
- Ton adapté à ${platform.label} (${platform.id === 'linkedin' ? 'professionnel et narratif' : platform.id === 'twitter' ? 'percutant et concis' : platform.id === 'instagram' ? 'émotionnel avec emojis' : platform.id.includes('facebook') ? 'conversationnel et engageant' : platform.id === 'tiktok' ? 'dynamique et tendance' : 'descriptif et visuel'})
- ${platform.id === 'facebook-group' ? 'Post conçu pour engager la conversation dans un groupe thématique, avec une QUESTION ouverte à la fin' : ''}
- ${platform.id === 'instagram' ? 'Inclure 15-20 hashtags pertinents séparés du texte' : ''}
- ${platform.id === 'twitter' ? 'Thread de 3 tweets liés, chacun < 280 caractères' : ''}
- Inclure un appel à l'action clair
- NE PAS utiliser de markdown (pas de ** ni de #)
- Écrire en français

Réponds en JSON strict :
{
  "posts": [
    {
      "content": "texte du post prêt à copier-coller",
      "hashtags": ["hashtag1", "hashtag2"],
      "visualTip": "description courte du visuel recommandé pour ce post"
    }
  ]
}`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          type: 'social-launch-posts',
          prompt,
          maxOutputTokens: 3000,
          temperature: 0.85,
        },
      });

      if (error) throw error;

      const text = data?.content || data?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const posts: GeneratedPost[] = (parsed.posts || []).map((p: any) => ({
          platform: selectedPlatform,
          phase: selectedPhase,
          content: p.content || '',
          hashtags: p.hashtags || [],
          visualTip: p.visualTip || '',
        }));
        setGeneratedPosts(posts);
        toast.success(`${posts.length} posts générés pour ${platform.label}`);
      } else {
        toast.error('Format de réponse inattendu');
      }
    } catch (err: any) {
      console.error('Erreur génération posts:', err);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!title.trim()) {
      toast.error('Titre du livre requis');
      return;
    }

    setIsGenerating(true);
    const allPosts: GeneratedPost[] = [];

    try {
      for (const platform of PLATFORMS.slice(0, 4)) { // FB group, FB page, LinkedIn, Instagram
        const phase = PHASES.find(p => p.id === selectedPhase)!;

        const prompt = `Tu es un expert en marketing littéraire. Génère 1 post ${platform.label} optimisé pour un livre "${title}"${author ? ` par ${author}` : ''}${bookGenre ? ` (genre: ${bookGenre})` : ''}.

Phase : ${phase.label} — ${phase.description}
${link ? `Lien Amazon : ${link}` : ''}
Max ${platform.maxChars} caractères. Ton adapté à ${platform.label}.
${platform.id === 'facebook-group' ? 'Finir par une question ouverte pour engager.' : ''}
${platform.id === 'instagram' ? 'Ajouter 15 hashtags.' : ''}
Français uniquement. Pas de markdown.

Réponds en JSON : {"content": "...", "hashtags": [...], "visualTip": "..."}`;

        const { data, error } = await supabase.functions.invoke('generate-content', {
          body: { type: 'social-launch-posts', prompt, maxOutputTokens: 1500, temperature: 0.85 },
        });

        if (!error && data) {
          const text = data?.content || data?.text || '';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            allPosts.push({
              platform: platform.id,
              phase: selectedPhase,
              content: parsed.content || '',
              hashtags: parsed.hashtags || [],
              visualTip: parsed.visualTip || '',
            });
          }
        }
      }

      setGeneratedPosts(allPosts);
      toast.success(`${allPosts.length} posts générés pour toutes les plateformes`);
    } catch (err) {
      console.error('Erreur génération multiple:', err);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPost = (post: GeneratedPost) => {
    const fullText = post.hashtags.length > 0
      ? `${post.content}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`
      : post.content;
    navigator.clipboard.writeText(fullText);
    toast.success('Post copié dans le presse-papier !');
  };

  const copyAll = () => {
    const allText = generatedPosts.map((post, i) => {
      const platform = PLATFORMS.find(p => p.id === post.platform);
      const header = `═══ ${platform?.label?.toUpperCase()} ═══`;
      const hashtags = post.hashtags.length > 0 ? `\n\n${post.hashtags.map(h => `#${h}`).join(' ')}` : '';
      return `${header}\n\n${post.content}${hashtags}`;
    }).join('\n\n\n');
    navigator.clipboard.writeText(allText);
    toast.success('Tous les posts copiés !');
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card className="bg-gradient-to-br from-indigo-900/30 to-violet-900/20 border-indigo-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
              <Megaphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                Posts de Lancement
                <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs">
                  IA Pro
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Générez des posts optimisés pour chaque réseau et phase de lancement
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Titre du livre *</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Mon livre incroyable" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Auteur</label>
              <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Votre nom" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Genre / Niche</label>
              <Input value={bookGenre} onChange={e => setBookGenre(e.target.value)} placeholder="Ex: développement personnel, romance..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Lien Amazon</label>
              <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://amazon.fr/dp/..." />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Public cible (optionnel)</label>
            <Input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="Ex: entrepreneurs débutants, mamans actives..." />
          </div>
        </CardContent>
      </Card>

      {/* Sélection phase + plateforme */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Phase de lancement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {PHASES.map(phase => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3",
                  selectedPhase === phase.id
                    ? "border-indigo-500 bg-indigo-500/15"
                    : "border-border/50 hover:bg-card"
                )}
              >
                <span className="text-lg">{phase.emoji}</span>
                <div>
                  <div className="text-sm font-medium">{phase.label}</div>
                  <div className="text-xs text-muted-foreground">{phase.description}</div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plateforme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {PLATFORMS.map(platform => {
              const Icon = platform.icon;
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3",
                    selectedPlatform === platform.id
                      ? "border-indigo-500 bg-indigo-500/15"
                      : "border-border/50 hover:bg-card"
                  )}
                >
                  <div className={cn("p-1.5 rounded-md bg-gradient-to-r text-white", platform.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{platform.label}</div>
                    <div className="text-xs text-muted-foreground">Max {platform.maxChars} caractères</div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !title.trim()}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Générer 3 posts ({PLATFORMS.find(p => p.id === selectedPlatform)?.label})
        </Button>
        <Button
          variant="outline"
          onClick={handleGenerateAll}
          disabled={isGenerating || !title.trim()}
        >
          {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Share2 className="h-4 w-4 mr-2" />}
          Générer pour toutes les plateformes
        </Button>
        {generatedPosts.length > 0 && (
          <Button variant="outline" onClick={copyAll}>
            <Copy className="h-4 w-4 mr-2" />
            Copier tout
          </Button>
        )}
      </div>

      {/* Résultats */}
      <AnimatePresence>
        {generatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {generatedPosts.map((post, index) => {
              const platform = PLATFORMS.find(p => p.id === post.platform)!;
              const Icon = platform.icon;

              return (
                <motion.div
                  key={`${post.platform}-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card/50 border-border/50 hover:border-indigo-500/30 transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={cn("p-1.5 rounded-md bg-gradient-to-r text-white", platform.color)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-sm">{platform.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {post.content.length}/{platform.maxChars} car.
                          </Badge>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => copyPost(post)}>
                          <Copy className="h-4 w-4 mr-1" />
                          Copier
                        </Button>
                      </div>

                      <div className="p-4 rounded-lg bg-background/50 border border-border/30 whitespace-pre-wrap text-sm leading-relaxed">
                        {post.content}
                      </div>

                      {post.hashtags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {post.hashtags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {post.visualTip && (
                        <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <p className="text-xs text-amber-300 flex items-start gap-2">
                            <Sparkles className="h-3 w-3 mt-0.5 shrink-0" />
                            <span><strong>Visuel suggéré :</strong> {post.visualTip}</span>
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EbookLaunchSocialPosts;
