import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  ALL_TEMPLATES, PLATFORM_CONFIG, SocialPlatform, SocialPostTemplate,
  DEMO_LINK, OFFRES_LINK, AMAZON_PROFILE, LINKEDIN_PROFILE, FACEBOOK_PAGE,
} from '@/data/socialPostTemplates';
import SocialCalendar from '@/components/social/SocialCalendar';
import SocialAnalytics from '@/components/social/SocialAnalytics';
import {
  Copy, Check, Facebook, Linkedin, Sparkles,
  RefreshCw, Lightbulb, Calendar, BarChart3, Zap, Target,
  Image, MessageSquare, Twitter
} from 'lucide-react';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';

const SocialPostGeneratorPage = () => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<SocialPlatform | 'all'>('all');
  const [customTopic, setCustomTopic] = useState('');
  const [customTone, setCustomTone] = useState('professionnel');
  const [customPlatform, setCustomPlatform] = useState<SocialPlatform>('facebook');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState<string | null>(null);
  const [aiPosts, setAiPosts] = useState<SocialPostTemplate[]>([]);

  const filteredTemplates = activePlatform === 'all'
    ? [...aiPosts, ...ALL_TEMPLATES]
    : [...aiPosts.filter(p => p.platform === activePlatform), ...ALL_TEMPLATES.filter(t => t.platform === activePlatform)];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copié !');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAll = () => {
    const allText = filteredTemplates.map(p =>
      `[${PLATFORM_CONFIG[p.platform].label}] ${p.type}\n\n${p.content}\n\n${p.hashtags.map(h => `#${h}`).join(' ')}`
    ).join('\n\n========================================\n\n');
    navigator.clipboard.writeText(allText);
    toast.success(`${filteredTemplates.length} posts copiés !`);
  };

  const generateWithAI = async () => {
    if (!customTopic.trim()) { toast.error('Entrez un sujet'); return; }
    setIsGenerating(true);
    toast.loading('Génération IA...', { id: 'ai-gen' });

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt: `Tu es un expert en marketing digital et copywriting.

Génère EXACTEMENT 2 posts pour ${PLATFORM_CONFIG[customPlatform].label}.

Contexte : EbookStudio Pro — générateur d'ebooks IA. 150 pages en 47 min pour ~0,30€. 35+ livres publiés par Georges Boubet.

Liens :
- Démo : ${DEMO_LINK}
- Offres : ${OFFRES_LINK}
- Amazon : ${AMAZON_PROFILE}
- Facebook : ${FACEBOOK_PAGE}
- LinkedIn : ${LINKEDIN_PROFILE}

Sujet : ${customTopic}
Ton : ${customTone}
Plateforme : ${PLATFORM_CONFIG[customPlatform].label}

Réponds UNIQUEMENT en JSON valide, sans markdown :
[
  {"type":"description courte","content":"le post complet","hashtags":["h1","h2","h3","h4","h5"],"visualDescription":"description d'un visuel idéal pour accompagner ce post"}
]`,
          max_tokens: 3000,
        }
      });

      if (error) throw error;
      const text = data?.content || data?.text || '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Format invalide');

      const parsed = JSON.parse(jsonMatch[0]);
      const newPosts: SocialPostTemplate[] = parsed.map((p: any, i: number) => ({
        id: `ai-${Date.now()}-${i}`,
        platform: customPlatform,
        type: p.type,
        content: p.content,
        hashtags: p.hashtags || [],
        visualDescription: p.visualDescription,
      }));

      setAiPosts(prev => [...newPosts, ...prev]);
      toast.success(`${newPosts.length} posts générés !`, { id: 'ai-gen' });
    } catch (err) {
      console.error(err);
      toast.error('Erreur de génération', { id: 'ai-gen' });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateVisualDescription = async (post: SocialPostTemplate) => {
    setIsGeneratingVisual(post.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt: `Tu es un directeur artistique spécialisé en réseaux sociaux.

Pour ce post ${PLATFORM_CONFIG[post.platform].label}, génère une description détaillée du visuel idéal à créer.

Post : "${post.content.substring(0, 200)}..."
Type : ${post.type}

Inclus :
1. Format recommandé (ex: 1080x1080 pour Instagram, 1000x1500 pour Pinterest)
2. Composition et layout
3. Couleurs dominantes
4. Texte à mettre sur le visuel (max 6 mots)
5. Style graphique (photo, illustration, flat design, etc.)
6. Éléments visuels spécifiques

Réponds en texte simple, pas de JSON.`,
          max_tokens: 500,
        }
      });

      if (error) throw error;
      const description = data?.content || data?.text || '';
      
      // Update the post's visual description
      if (post.id.startsWith('ai-')) {
        setAiPosts(prev => prev.map(p => p.id === post.id ? { ...p, visualDescription: description } : p));
      }
      toast.success('Description visuelle générée !');
      // Also copy to clipboard
      navigator.clipboard.writeText(description);
    } catch {
      toast.error('Erreur de génération visuelle');
    } finally {
      setIsGeneratingVisual(null);
    }
  };

  const saveCalendarToDb = async (calendarPosts: any[]) => {
    const rows = calendarPosts.map(cp => ({
      platform: cp.platform,
      content: cp.template.content,
      hashtags: cp.template.hashtags,
      visual_description: cp.template.visualDescription || null,
      scheduled_date: cp.date,
      scheduled_time: cp.time,
      status: 'scheduled',
      post_type: cp.template.type,
    }));

    const { error } = await supabase.from('social_posts').insert(rows);
    if (error) throw error;
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'tiktok': return <Zap className="h-4 w-4" />;
      case 'pinterest': return <Target className="h-4 w-4" />;
      case 'x': return <Twitter className="h-4 w-4" />;
    }
  };

  const renderPost = (post: SocialPostTemplate) => (
    <Card key={post.id} className="bg-card/80 border-border/60 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${PLATFORM_CONFIG[post.platform].color} border-0`}>
              {getPlatformIcon(post.platform)}
              <span className="ml-1">{PLATFORM_CONFIG[post.platform].label}</span>
            </Badge>
            <Badge variant="outline" className="text-xs">{post.type}</Badge>
            {post.id.startsWith('ai-') && (
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 text-xs">
                <Sparkles className="h-3 w-3 mr-1" /> IA
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm" variant="ghost"
              onClick={() => generateVisualDescription(post)}
              disabled={isGeneratingVisual === post.id}
              title="Générer description visuelle"
            >
              <Image className={`h-4 w-4 ${isGeneratingVisual === post.id ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              size="sm" variant="outline"
              onClick={() => copyToClipboard(`${post.content}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`, post.id)}
              className="border-gold/30 text-gold-light hover:bg-gold/10"
            >
              {copiedId === post.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {post.hook && (
          <p className="text-xs text-amber-400 mt-2">
            <Zap className="h-3 w-3 inline mr-1" />
            <span className="font-medium">Hook :</span> {post.hook}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <pre className="whitespace-pre-wrap text-sm text-foreground/85 font-sans leading-relaxed">
          {post.content}
        </pre>
        
        {post.visualDescription && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <p className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-1">
              <Image className="h-3 w-3" /> Description visuelle
            </p>
            <p className="text-xs text-foreground/70">{post.visualDescription}</p>
            <Button
              size="sm" variant="ghost" className="mt-1 h-6 text-xs text-purple-400"
              onClick={() => copyToClipboard(post.visualDescription!, `vis-${post.id}`)}
            >
              {copiedId === `vis-${post.id}` ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              Copier la description
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/30">
          {post.hashtags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs border-gold/20 text-gold-light/70">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <AdminPanelNav className="mb-8" />

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-3">
            📱 Suite Marketing Sociale
          </h1>
          <p className="text-muted-foreground text-lg">
            {ALL_TEMPLATES.length}+ templates • 5 plateformes • IA • Calendrier • Analytics
          </p>
        </div>

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
            <TabsTrigger value="generator" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <Sparkles className="h-4 w-4 mr-2" /> Générateur
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <Calendar className="h-4 w-4 mr-2" /> Calendrier
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <BarChart3 className="h-4 w-4 mr-2" /> Analytics
            </TabsTrigger>
          </TabsList>

          {/* GENERATOR TAB */}
          <TabsContent value="generator" className="space-y-6">
            {/* AI Generator */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-purple-400" /> Générer avec l'IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <Textarea
                      placeholder="Ex: Résultats du mois, témoignage client, astuce KDP..."
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      className="bg-background/50 min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Select value={customPlatform} onValueChange={v => setCustomPlatform(v as SocialPlatform)}>
                      <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(PLATFORM_CONFIG) as SocialPlatform[]).map(p => (
                          <SelectItem key={p} value={p}>{PLATFORM_CONFIG[p].label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={customTone} onValueChange={setCustomTone}>
                      <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professionnel">🎯 Professionnel</SelectItem>
                        <SelectItem value="decontracte">😎 Décontracté</SelectItem>
                        <SelectItem value="inspirant">🚀 Inspirant</SelectItem>
                        <SelectItem value="urgent">⚡ Urgent/FOMO</SelectItem>
                        <SelectItem value="educatif">📚 Éducatif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={generateWithAI}
                    disabled={isGenerating}
                    className="bg-purple-600 hover:bg-purple-700 text-white h-full min-h-[80px]"
                  >
                    {isGenerating ? (
                      <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Génération...</>
                    ) : (
                      <><Sparkles className="h-4 w-4 mr-2" /> Générer</>
                    )}
                  </Button>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Lightbulb className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>Idées : "témoignage client", "calcul ROI", "erreurs KDP", "comparaison freelance vs IA", "thread viral"</span>
                </div>
              </CardContent>
            </Card>

            {/* Platform filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant={activePlatform === 'all' ? 'default' : 'outline'}
                onClick={() => setActivePlatform('all')}
              >
                Tous ({ALL_TEMPLATES.length + aiPosts.length})
              </Button>
              {(Object.keys(PLATFORM_CONFIG) as SocialPlatform[]).map(p => {
                const count = ALL_TEMPLATES.filter(t => t.platform === p).length + aiPosts.filter(t => t.platform === p).length;
                return (
                  <Button
                    key={p}
                    size="sm"
                    variant={activePlatform === p ? 'default' : 'outline'}
                    onClick={() => setActivePlatform(p)}
                    className={activePlatform === p ? PLATFORM_CONFIG[p].color : ''}
                  >
                    {getPlatformIcon(p)}
                    <span className="ml-1">{PLATFORM_CONFIG[p].label} ({count})</span>
                  </Button>
                );
              })}
            </div>

            {/* Copy all */}
            <div className="flex justify-end">
              <Button onClick={copyAll} variant="outline" className="border-gold/30 text-gold-light hover:bg-gold/10">
                <Copy className="h-4 w-4 mr-2" /> Tout copier ({filteredTemplates.length})
              </Button>
            </div>

            {/* Posts */}
            <div className="grid gap-5">
              {filteredTemplates.map(renderPost)}
            </div>
          </TabsContent>

          {/* CALENDAR TAB */}
          <TabsContent value="calendar">
            <SocialCalendar onSaveToDb={saveCalendarToDb} />
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics">
            <SocialAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialPostGeneratorPage;
