import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Copy, Loader2, Sparkles, Facebook, Linkedin, Instagram, Twitter,
  Share2, Users, Hash, Megaphone, RefreshCw, Save, Pencil, Check,
  AlertTriangle, CheckCircle2, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import PostCard from './social/PostCard';
import { PLATFORMS, PHASES, Platform, LaunchPhase, GeneratedPost } from './social/socialPostTypes';

interface EbookLaunchSocialPostsProps {
  ebookTitle?: string;
  authorName?: string;
  genre?: string;
  amazonLink?: string;
}

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
  const [isSaving, setIsSaving] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  const buildPrompt = useCallback((platform: typeof PLATFORMS[number], phase: typeof PHASES[number], count: number = 3) => {
    return `Tu es un expert en marketing littéraire et réseaux sociaux. Génère ${count} post${count > 1 ? 's' : ''} ${platform.label} pour un livre intitulé "${title}"${author ? ` par ${author}` : ''}${bookGenre ? ` (genre: ${bookGenre})` : ''}${targetAudience ? ` ciblant: ${targetAudience}` : ''}.

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
  }, [title, author, bookGenre, targetAudience, link]);

  const parseResponse = (text: string): Array<{ content: string; hashtags: string[]; visualTip: string }> => {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.posts) return parsed.posts;
      if (parsed.content) return [parsed];
      return [];
    } catch {
      return [];
    }
  };

  const handleGenerate = async () => {
    if (!title.trim()) { toast.error('Titre du livre requis'); return; }
    setIsGenerating(true);
    try {
      const platform = PLATFORMS.find(p => p.id === selectedPlatform)!;
      const phase = PHASES.find(p => p.id === selectedPhase)!;
      const prompt = buildPrompt(platform, phase, 3);

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'social-launch-posts', prompt, maxOutputTokens: 3000, temperature: 0.85 },
      });
      if (error) throw error;

      const items = parseResponse(data?.content || data?.text || '');
      const posts: GeneratedPost[] = items.map(p => ({
        platform: selectedPlatform, phase: selectedPhase,
        content: p.content || '', hashtags: p.hashtags || [], visualTip: p.visualTip || '',
      }));
      setGeneratedPosts(posts);
      toast.success(`${posts.length} posts générés pour ${platform.label}`);
    } catch (err) {
      console.error('Erreur génération posts:', err);
      toast.error('Erreur lors de la génération');
    } finally { setIsGenerating(false); }
  };

  const handleGenerateAll = async () => {
    if (!title.trim()) { toast.error('Titre du livre requis'); return; }
    setIsGenerating(true);
    const allPosts: GeneratedPost[] = [];
    try {
      for (const platform of PLATFORMS.slice(0, 5)) {
        const phase = PHASES.find(p => p.id === selectedPhase)!;
        const prompt = buildPrompt(platform, phase, 1);
        const { data, error } = await supabase.functions.invoke('generate-content', {
          body: { type: 'social-launch-posts', prompt, maxOutputTokens: 1500, temperature: 0.85 },
        });
        if (!error && data) {
          const items = parseResponse(data?.content || data?.text || '');
          if (items.length > 0) {
            allPosts.push({
              platform: platform.id, phase: selectedPhase,
              content: items[0].content || '', hashtags: items[0].hashtags || [], visualTip: items[0].visualTip || '',
            });
          }
        }
      }
      setGeneratedPosts(allPosts);
      toast.success(`${allPosts.length} posts générés pour toutes les plateformes`);
    } catch (err) {
      console.error('Erreur génération multiple:', err);
      toast.error('Erreur lors de la génération');
    } finally { setIsGenerating(false); }
  };

  const handleRegenerateOne = async (index: number) => {
    setRegeneratingIndex(index);
    try {
      const post = generatedPosts[index];
      const platform = PLATFORMS.find(p => p.id === post.platform)!;
      const phase = PHASES.find(p => p.id === post.phase)!;
      const prompt = buildPrompt(platform, phase, 1);
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'social-launch-posts', prompt, maxOutputTokens: 1500, temperature: 0.9 },
      });
      if (error) throw error;
      const items = parseResponse(data?.content || data?.text || '');
      if (items.length > 0) {
        setGeneratedPosts(prev => prev.map((p, i) => i === index ? {
          ...p, content: items[0].content || '', hashtags: items[0].hashtags || [], visualTip: items[0].visualTip || '',
        } : p));
        toast.success('Post régénéré');
      }
    } catch { toast.error('Erreur régénération'); }
    finally { setRegeneratingIndex(null); }
  };

  const handleUpdatePost = (index: number, field: keyof GeneratedPost, value: any) => {
    setGeneratedPosts(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const handleSaveAll = async () => {
    if (generatedPosts.length === 0) return;
    setIsSaving(true);
    try {
      const rows = generatedPosts.map(post => ({
        platform: post.platform,
        post_type: `launch-${post.phase}`,
        content: post.content,
        hashtags: post.hashtags,
        visual_description: post.visualTip,
        status: 'draft' as const,
      }));
      const { error } = await supabase.from('social_posts').insert(rows);
      if (error) throw error;
      toast.success(`${rows.length} posts sauvegardés dans votre calendrier`);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      toast.error('Erreur lors de la sauvegarde');
    } finally { setIsSaving(false); }
  };

  const copyPost = (post: GeneratedPost) => {
    const fullText = post.hashtags.length > 0
      ? `${post.content}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`
      : post.content;
    navigator.clipboard.writeText(fullText);
    toast.success('Post copié !');
  };

  const copyAll = () => {
    const allText = generatedPosts.map(post => {
      const platform = PLATFORMS.find(p => p.id === post.platform);
      const header = `═══ ${platform?.label?.toUpperCase()} ═══`;
      const hashtags = post.hashtags.length > 0 ? `\n\n${post.hashtags.map(h => `#${h}`).join(' ')}` : '';
      return `${header}\n\n${post.content}${hashtags}`;
    }).join('\n\n\n');
    navigator.clipboard.writeText(allText);
    toast.success('Tous les posts copiés !');
  };

  const exportAsText = () => {
    const allText = generatedPosts.map(post => {
      const platform = PLATFORMS.find(p => p.id === post.platform);
      const phase = PHASES.find(p => p.id === post.phase);
      const header = `═══ ${platform?.label?.toUpperCase()} — ${phase?.label} ═══`;
      const hashtags = post.hashtags.length > 0 ? `\n\nHashtags: ${post.hashtags.map(h => `#${h}`).join(' ')}` : '';
      const visual = post.visualTip ? `\n\n🎨 Visuel: ${post.visualTip}` : '';
      return `${header}\n\n${post.content}${hashtags}${visual}`;
    }).join('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
    
    const blob = new Blob([`📚 Posts de lancement — ${title}\n\n${allText}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `posts-lancement-${title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click(); URL.revokeObjectURL(url);
    toast.success('Fichier exporté');
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
                <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs">IA Pro</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Générez, éditez et sauvegardez vos posts pour chaque réseau et phase
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
                  selectedPhase === phase.id ? "border-indigo-500 bg-indigo-500/15" : "border-border/50 hover:bg-card"
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
                    selectedPlatform === platform.id ? "border-indigo-500 bg-indigo-500/15" : "border-border/50 hover:bg-card"
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
        <Button variant="outline" onClick={handleGenerateAll} disabled={isGenerating || !title.trim()}>
          {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Share2 className="h-4 w-4 mr-2" />}
          Toutes les plateformes
        </Button>
        {generatedPosts.length > 0 && (
          <>
            <Button variant="outline" onClick={copyAll}>
              <Copy className="h-4 w-4 mr-2" /> Copier tout
            </Button>
            <Button variant="outline" onClick={exportAsText}>
              <Download className="h-4 w-4 mr-2" /> Exporter .txt
            </Button>
            <Button variant="outline" onClick={handleSaveAll} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Sauvegarder
            </Button>
          </>
        )}
      </div>

      {/* Résultats */}
      <AnimatePresence>
        {generatedPosts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {generatedPosts.map((post, index) => (
              <PostCard
                key={`${post.platform}-${index}`}
                post={post}
                index={index}
                isRegenerating={regeneratingIndex === index}
                onCopy={() => copyPost(post)}
                onRegenerate={() => handleRegenerateOne(index)}
                onUpdate={(field, value) => handleUpdatePost(index, field, value)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EbookLaunchSocialPosts;
