import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { salesEmailSequence, socialMediaPosts } from '@/data/salesEmailCampaign';
import { 
  Mail, Copy, Check, ArrowLeft, Send, Calendar, Target, 
  Zap, TrendingUp, MessageSquare, Linkedin, Hash,
  Instagram, Facebook, Clock
} from 'lucide-react';

const SalesCampaignPage = () => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copié dans le presse-papier !');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllEmails = () => {
    const allText = salesEmailSequence.map(e => 
      `--- ${e.day} ---\nObjet: ${e.subject}\nPré-header: ${e.preheader}\n\n${e.body}`
    ).join('\n\n========================================\n\n');
    navigator.clipboard.writeText(allText);
    toast.success('5 emails copiés !');
  };

  const copyAllPosts = () => {
    const allText = socialMediaPosts.map(p => 
      `[${p.platform.toUpperCase()}] ${p.type}\n\n${p.content}\n\n${p.hashtags.map(h => `#${h}`).join(' ')}`
    ).join('\n\n========================================\n\n');
    navigator.clipboard.writeText(allText);
    toast.success('Tous les posts copiés !');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok': return <Zap className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'pinterest': return <Target className="h-4 w-4" />;
      case 'instagram': return <Instagram className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok': return 'bg-black text-white';
      case 'facebook': return 'bg-blue-600 text-white';
      case 'linkedin': return 'bg-blue-700 text-white';
      case 'pinterest': return 'bg-red-600 text-white';
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStrategyColor = (index: number) => {
    const colors = [
      'from-amber-500/20 to-amber-600/5 border-amber-500/30',
      'from-red-500/20 to-red-600/5 border-red-500/30',
      'from-emerald-500/20 to-emerald-600/5 border-primary/20',
      'from-orange-500/20 to-orange-600/5 border-orange-500/30',
      'from-violet-500/20 to-violet-600/5 border-primary/20',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-3">
            🚀 Campagne Marketing EbookStudio Pro
          </h1>
          <p className="text-muted-foreground text-lg">
            5 emails haute conversion + 8 posts réseaux sociaux prêts à l'emploi
          </p>
        </div>

        <Tabs defaultValue="emails" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card border border-border">
            <TabsTrigger value="emails" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <Mail className="h-4 w-4 mr-2" />
              5 Emails de Vente
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <MessageSquare className="h-4 w-4 mr-2" />
              Posts Réseaux Sociaux
            </TabsTrigger>
          </TabsList>

          {/* EMAILS TAB */}
          <TabsContent value="emails" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Séquence Email — 7 Jours</h2>
                <p className="text-sm text-muted-foreground">De la curiosité au passage à l'action</p>
              </div>
              <Button onClick={copyAllEmails} variant="outline" className="border-gold/30 text-gold-light hover:bg-gold/10">
                <Copy className="h-4 w-4 mr-2" />
                Tout copier
              </Button>
            </div>

            <div className="space-y-6">
              {salesEmailSequence.map((email, index) => (
                <Card key={email.id} className={`bg-gradient-to-br ${getStrategyColor(index)} backdrop-blur-sm overflow-hidden`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold-light font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1 border-gold/30 text-gold-light">
                            <Calendar className="h-3 w-3 mr-1" />
                            {email.day}
                          </Badge>
                          <CardTitle className="text-lg text-foreground">{email.subject}</CardTitle>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(`Objet: ${email.subject}\nPré-header: ${email.preheader}\n\n${email.body}`, email.id)}
                        className="border-gold/30 text-gold-light hover:bg-gold/10"
                      >
                        {copiedId === email.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-gold/15 text-gold-light border-gold/20 text-xs">
                        <Target className="h-3 w-3 mr-1" />
                        {email.strategy}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">Pré-header :</span> {email.preheader}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-80 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-foreground/85 font-sans leading-relaxed">
                        {email.body}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SOCIAL POSTS TAB */}
          <TabsContent value="social" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Posts Multi-Plateformes</h2>
                <p className="text-sm text-muted-foreground">TikTok, Facebook, LinkedIn, Pinterest, Instagram</p>
              </div>
              <Button onClick={copyAllPosts} variant="outline" className="border-gold/30 text-gold-light hover:bg-gold/10">
                <Copy className="h-4 w-4 mr-2" />
                Tout copier
              </Button>
            </div>

            <div className="grid gap-5">
              {socialMediaPosts.map((post) => (
                <Card key={post.id} className="bg-card/80 border-border/60 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getPlatformColor(post.platform)} border-0`}>
                          {getPlatformIcon(post.platform)}
                          <span className="ml-1 capitalize">{post.platform}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">{post.type}</Badge>
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(
                          `${post.content}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`,
                          post.id
                        )}
                        className="border-gold/30 text-gold-light hover:bg-gold/10"
                      >
                        {copiedId === post.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
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
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/30">
                      {post.hashtags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-gold/20 text-gold-light/70">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SalesCampaignPage;
