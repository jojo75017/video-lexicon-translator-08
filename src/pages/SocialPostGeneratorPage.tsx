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
  Copy, Check, ArrowLeft, Facebook, Linkedin, Sparkles,
  RefreshCw, Hash, MessageSquare, Lightbulb
} from 'lucide-react';

interface GeneratedPost {
  id: string;
  platform: 'facebook' | 'linkedin';
  type: string;
  content: string;
  hashtags: string[];
}

const FACEBOOK_TEMPLATES: GeneratedPost[] = [
  {
    id: 'fb-gen-1', platform: 'facebook', type: 'Post groupe "Revenus Passifs"',
    content: `📖 [RETOUR D'EXPÉRIENCE] Comment je publie 3 ebooks/semaine sur Amazon KDP

Salut le groupe 👋

En 2023, je galérais à sortir UN livre en 3 semaines.
Aujourd'hui ? 35+ livres sur Amazon, 2-3 par semaine.

Mon secret ? Un générateur d'ebooks propulsé par l'IA (Gemini 3 Flash).

Ce que l'outil fait :
→ Plan structuré en 30 sec
→ Chapitres rédigés dans MON style
→ Couverture pro générée
→ Mots-clés Amazon optimisés
→ Export PDF/EPUB prêt pour KDP

Coût par ebook : ~0,30€

🆓 Démo gratuite : https://ebookstudio.fr/demo
💰 Offre Fondateur 97€ (au lieu de 297€) : https://ebookstudio.fr/offres

Questions en commentaire ! 👇`,
    hashtags: ['revenuspassifs', 'kdp', 'amazon', 'ebook', 'ia', 'autoedition']
  },
  {
    id: 'fb-gen-2', platform: 'facebook', type: 'Post témoignage',
    content: `🔥 J'aurais aimé avoir cet outil il y a 2 ans...

Quand j'ai commencé sur Amazon KDP, j'ai fait TOUTES les erreurs :
❌ 3 semaines pour écrire un seul livre
❌ 500€ de ghostwriter pour un résultat moyen
❌ Des couvertures amateurs
❌ 0 vente pendant 3 mois

Aujourd'hui avec EbookStudio Pro :
✅ 47 min pour un ebook complet
✅ 0,30€ de coût de production
✅ Couvertures professionnelles en 1 clic
✅ Optimisation Amazon intégrée

La différence ? 35 livres publiés. Vérifiable sur Amazon.

Si vous hésitez encore à vous lancer dans l'édition...
Testez gratuitement : https://ebookstudio.fr/demo

Aucune CB requise. 🙌`,
    hashtags: ['kdp', 'amazon', 'ebook', 'selfpublishing', 'ia', 'business']
  },
  {
    id: 'fb-gen-3', platform: 'facebook', type: 'Post question/engagement',
    content: `💬 Sondage rapide pour les entrepreneurs du groupe :

Si vous pouviez publier un livre sur Amazon en MOINS d'une heure...
Le feriez-vous ?

🅰️ Oui, direct !
🅱️ J'y pense depuis longtemps
🅾️ Trop beau pour être vrai

Je pose la question parce que c'est exactement ce que je fais.
35+ livres publiés. 47 min en moyenne. Coût : 0,30€/livre.

Mon profil Amazon est public, vous pouvez vérifier :
https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7

Si ça vous intrigue, j'ai ouvert une démo gratuite de l'outil : https://ebookstudio.fr/demo

Répondez avec votre lettre ! 👇`,
    hashtags: ['sondage', 'entrepreneur', 'kdp', 'amazon', 'ia']
  },
  {
    id: 'fb-gen-4', platform: 'facebook', type: 'Post "valeur d\'abord"',
    content: `📊 Les 5 niches KDP les plus rentables en 2026 (données réelles) :

1️⃣ Développement personnel — Toujours #1, demande massive
2️⃣ Low-content (carnets, planners) — Facile à produire, volume = revenus
3️⃣ Cuisine/Recettes — Niche evergreen, excellent BSR
4️⃣ Livres enfants illustrés — Marges élevées, peu de concurrence qualitative
5️⃣ Business/Finance perso — Audience qui achète sans hésiter

💡 L'astuce : publier 3-5 titres par niche pour dominer les résultats Amazon.

Avec EbookStudio Pro, je produis un ebook dans chaque niche en ~47 min.
Coût total de production : 0,30€ par titre.

🎁 Je partage gratuitement mon guide "10 Niches KDP Rentables 2026" :
→ Commentez "NICHES" et je vous l'envoie en MP !`,
    hashtags: ['kdp', 'niches', 'amazon', 'revenuspassifs', 'ebook', 'business2026']
  },
  {
    id: 'fb-gen-5', platform: 'facebook', type: 'Post urgence/FOMO',
    content: `⏰ [DERNIÈRE SEMAINE] L'offre Fondateur EbookStudio Pro se termine bientôt

87% de réduction. Après ? Le prix passe à 297€.

Ce que vous obtenez pour 97€ (valeur 749€) :
🔥 Générateur IA illimité
🎨 Créateur de couvertures pro
🔊 Convertisseur livre audio
📊 Dashboard marketing complet
📧 Outils email & réseaux sociaux
📋 Templates et optimisation KDP

+ BONUS : Pack 300+ idées, Guide niches, Groupe privé, MAJ à vie

💳 Paiement en 3x35€ ou 5x22€ disponible

Le calcul est simple : 1 ebook vendu rembourse l'investissement.

👉 https://ebookstudio.fr/offres

Pas convaincu ? Testez la démo gratuite d'abord : https://ebookstudio.fr/demo`,
    hashtags: ['offrelimitee', 'ebookstudio', 'kdp', 'amazon', 'fondateur']
  },
];

const LINKEDIN_TEMPLATES: GeneratedPost[] = [
  {
    id: 'li-gen-1', platform: 'linkedin', type: 'Post storytelling',
    content: `Il y a 2 ans, j'avais une idée de livre.

Comme tout le monde, je me suis dit "un jour, j'écrirai".

Ce "un jour" a duré des mois.

Puis j'ai découvert l'IA générative. Et j'ai eu une autre idée :
"Et si je construisais un outil qui écrit mieux et plus vite que moi ?"

Résultat en 2026 :
→ 35+ livres publiés sur Amazon
→ Un générateur d'ebooks complet (EbookStudio Pro)
→ Technologie Gemini 3 Flash + Azure Neural
→ Coût de production par livre : 0,30€

Aujourd'hui, je rends cet outil accessible.

Pas pour remplacer les auteurs.
Pour leur donner un avantage injuste.

Un plan structuré en 30 secondes.
Des chapitres rédigés dans votre style.
Des couvertures professionnelles en 1 clic.
Un export KDP prêt à publier.

Si vous êtes entrepreneur, freelance, coach, ou expert...
Vous avez un livre en vous. Cet outil le fait sortir.

🔗 Lien en commentaire pour tester gratuitement.`,
    hashtags: ['IA', 'KDP', 'Amazon', 'Entrepreneuriat', 'SelfPublishing', 'Innovation']
  },
  {
    id: 'li-gen-2', platform: 'linkedin', type: 'Post chiffres',
    content: `📊 Le business model le plus sous-estimé de 2026 :

Publier des ebooks sur Amazon KDP.

Voici pourquoi (avec des vrais chiffres) :

💰 Investissement initial : 97€ (outil) + ~0,30€/livre (API)
📈 Potentiel : 500€ à 5000€/mois en revenus passifs
⏱️ Temps par livre : 47 minutes
📚 Pas de stock, pas de logistique, pas de SAV

Le calcul est simple :
→ 1 ebook/semaine = 52 livres/an
→ Si chaque livre rapporte 50€/mois = 2600€/mois de revenus passifs

Ce n'est pas de la théorie. J'ai 35+ livres publiés.
Mon profil Amazon est public.

L'outil que j'utilise ? Je l'ai construit moi-même et je l'ouvre au public.

Commentez "EBOOK" et je vous envoie le lien de la démo gratuite.`,
    hashtags: ['RevenusPassifs', 'KDP', 'Amazon', 'Business', 'IA', 'Entrepreneuriat']
  },
  {
    id: 'li-gen-3', platform: 'linkedin', type: 'Post leçon apprise',
    content: `J'ai échoué 18 fois avant de réussir sur Amazon KDP.

Mes 18 premiers livres ? Écrits à la main. Des semaines de travail.
Résultat : quelques ventes, beaucoup de frustration.

Puis j'ai compris 3 choses :

1. La VITESSE de publication compte plus que la perfection
2. Le VOLUME multiplie les chances de succès
3. L'OPTIMISATION KDP fait 80% du travail de vente

Alors j'ai automatisé tout le processus.

EbookStudio Pro est né de ces 18 échecs.

Aujourd'hui :
• 35+ livres publiés
• Production en 47 min/livre
• Coût : 0,30€ par titre
• Revenus passifs mensuels

La leçon ? N'essayez pas d'écrire le livre parfait.
Publiez beaucoup, apprenez vite, optimisez toujours.

L'outil est maintenant accessible au public.
Lien de la démo gratuite en commentaire 👇`,
    hashtags: ['Échec', 'Apprentissage', 'KDP', 'Amazon', 'Entrepreneur', 'Mindset']
  },
  {
    id: 'li-gen-4', platform: 'linkedin', type: 'Post éducatif',
    content: `Vous voulez publier un livre mais vous ne savez pas écrire ?

Bonne nouvelle : en 2026, ce n'est plus un obstacle.

Voici le processus exact que j'utilise pour publier 3 ebooks/semaine :

𝟏. Choisir une niche rentable (j'ai un générateur de 300+ idées)
𝟐. Générer le plan complet en 30 secondes (IA)
𝟑. Rédiger les chapitres automatiquement (personnalisé à votre ton)
𝟒. Créer une couverture professionnelle (1 clic)
𝟓. Optimiser titre + mots-clés + description Amazon
𝟔. Exporter en PDF/EPUB et publier sur KDP

Temps total : ~47 minutes
Coût : ~0,30€

J'ai fait ça 35+ fois. Chaque livre est sur Amazon, vérifiable.

Le mythe du "il faut être écrivain pour publier" est mort.

Qui veut tester ? Commentez "DEMO" 👇`,
    hashtags: ['EdTech', 'IA', 'Publication', 'KDP', 'Amazon', 'Productivite']
  },
  {
    id: 'li-gen-5', platform: 'linkedin', type: 'Post controversé',
    content: `Opinion impopulaire : Passer 6 mois à écrire un livre est une perte de temps.

Avant de m'incendier, écoutez-moi :

Je ne parle PAS de littérature ou de romans.
Je parle de livres pratiques, guides, manuels.

Le marché Amazon KDP récompense :
→ La fréquence de publication
→ L'optimisation des mots-clés
→ La qualité "suffisante" (pas la perfection)

Un livre pratique bien optimisé à 47 min > Un chef-d'œuvre invisible à 6 mois.

Les chiffres parlent :
• 35+ livres publiés
• Moyenne : 47 min de production
• Outils utilisés : IA + EbookStudio Pro

Le perfectionnisme est l'ennemi de la rentabilité.

D'accord ? Pas d'accord ? Débattons en commentaires 👇`,
    hashtags: ['Controverse', 'KDP', 'Productivite', 'IA', 'Business', 'Amazon']
  },
];

const SocialPostGeneratorPage = () => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'facebook' | 'linkedin'>('facebook');
  const [customTopic, setCustomTopic] = useState('');
  const [customTone, setCustomTone] = useState('professionnel');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPosts, setAiPosts] = useState<GeneratedPost[]>([]);

  const allFacebookPosts = [...FACEBOOK_TEMPLATES, ...aiPosts.filter(p => p.platform === 'facebook')];
  const allLinkedinPosts = [...LINKEDIN_TEMPLATES, ...aiPosts.filter(p => p.platform === 'linkedin')];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copié !');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllForPlatform = (platform: 'facebook' | 'linkedin') => {
    const posts = platform === 'facebook' ? allFacebookPosts : allLinkedinPosts;
    const allText = posts.map(p =>
      `[${p.type}]\n\n${p.content}\n\n${p.hashtags.map(h => `#${h}`).join(' ')}`
    ).join('\n\n========================================\n\n');
    navigator.clipboard.writeText(allText);
    toast.success(`${posts.length} posts ${platform} copiés !`);
  };

  const generateWithAI = async () => {
    if (!customTopic.trim()) {
      toast.error('Entrez un sujet ou angle pour la génération');
      return;
    }

    setIsGenerating(true);
    toast.loading('Génération IA en cours...', { id: 'ai-gen' });

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt: `Tu es un expert en marketing digital et copywriting pour les réseaux sociaux.

Génère EXACTEMENT 2 posts : 1 pour Facebook et 1 pour LinkedIn.

Contexte : EbookStudio Pro est un générateur d'ebooks propulsé par l'IA (Gemini 3 Flash). Il permet de créer un ebook complet (150 pages) en 47 minutes pour ~0,30€. Le créateur (Georges Boubet) a publié 35+ livres sur Amazon KDP. L'offre Fondateur est à 97€ (au lieu de 297€).

Liens à inclure :
- Démo gratuite : https://ebookstudio.fr/demo
- Offres : https://ebookstudio.fr/offres
- Profil Amazon : https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7
- Pour les posts Facebook, inclure le lien de la page : https://www.facebook.com/formationenaffiliation/
- Pour les posts LinkedIn, inclure le profil : https://www.linkedin.com/in/consultantwebmaster/

Sujet/Angle demandé : ${customTopic}
Ton : ${customTone}

Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks :
[
  {
    "platform": "facebook",
    "type": "description courte du type de post",
    "content": "le contenu complet du post facebook",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
  },
  {
    "platform": "linkedin",
    "type": "description courte du type de post",
    "content": "le contenu complet du post linkedin",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
  }
]`,
          max_tokens: 3000,
        }
      });

      if (error) throw error;

      const text = data?.content || data?.text || '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Format de réponse invalide');

      const parsed = JSON.parse(jsonMatch[0]) as Array<{
        platform: 'facebook' | 'linkedin';
        type: string;
        content: string;
        hashtags: string[];
      }>;

      const newPosts: GeneratedPost[] = parsed.map((p, i) => ({
        id: `ai-${Date.now()}-${i}`,
        platform: p.platform,
        type: p.type,
        content: p.content,
        hashtags: p.hashtags,
      }));

      setAiPosts(prev => [...newPosts, ...prev]);
      toast.success('2 posts générés par l\'IA !', { id: 'ai-gen' });
    } catch (err) {
      console.error('AI generation error:', err);
      toast.error('Erreur de génération. Réessayez.', { id: 'ai-gen' });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPost = (post: GeneratedPost) => (
    <Card key={post.id} className="bg-card/80 border-border/60 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={`${post.platform === 'facebook' ? 'bg-blue-600' : 'bg-blue-700'} text-white border-0`}>
              {post.platform === 'facebook' ? <Facebook className="h-4 w-4 mr-1" /> : <Linkedin className="h-4 w-4 mr-1" />}
              {post.platform === 'facebook' ? 'Facebook' : 'LinkedIn'}
            </Badge>
            <Badge variant="outline" className="text-xs">{post.type}</Badge>
            {post.id.startsWith('ai-') && (
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 text-xs">
                <Sparkles className="h-3 w-3 mr-1" /> IA
              </Badge>
            )}
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
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-3">
            📱 Générateur de Posts Sociaux
          </h1>
          <p className="text-muted-foreground text-lg">
            {allFacebookPosts.length} posts Facebook + {allLinkedinPosts.length} posts LinkedIn prêts à publier
          </p>
        </div>

        {/* AI Generator Card */}
        <Card className="mb-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Générer avec l'IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Textarea
                  placeholder="Ex: Post sur les résultats d'un client, Comparaison avant/après, Astuce KDP du jour..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="bg-background/50 min-h-[80px]"
                />
              </div>
              <div className="space-y-3">
                <Select value={customTone} onValueChange={setCustomTone}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professionnel">🎯 Professionnel</SelectItem>
                    <SelectItem value="decontracte">😎 Décontracté</SelectItem>
                    <SelectItem value="inspirant">🚀 Inspirant</SelectItem>
                    <SelectItem value="urgent">⚡ Urgent/FOMO</SelectItem>
                    <SelectItem value="educatif">📚 Éducatif</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={generateWithAI}
                  disabled={isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isGenerating ? (
                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Génération...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" /> Générer 2 posts</>
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Idées : "témoignage client", "calcul ROI", "erreurs courantes KDP", "comparaison freelance vs IA", "résultats du mois"</span>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'facebook' | 'linkedin')} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card border border-border">
            <TabsTrigger value="facebook" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">
              <Facebook className="h-4 w-4 mr-2" />
              Facebook ({allFacebookPosts.length})
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-300">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn ({allLinkedinPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="facebook" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Posts Facebook</h2>
                <p className="text-sm text-muted-foreground">Groupes, pages, profil personnel</p>
              </div>
              <Button onClick={() => copyAllForPlatform('facebook')} variant="outline" className="border-gold/30 text-gold-light hover:bg-gold/10">
                <Copy className="h-4 w-4 mr-2" /> Tout copier
              </Button>
            </div>
            <div className="grid gap-5">
              {allFacebookPosts.map(renderPost)}
            </div>
          </TabsContent>

          <TabsContent value="linkedin" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Posts LinkedIn</h2>
                <p className="text-sm text-muted-foreground">Storytelling, chiffres, engagement pro</p>
              </div>
              <Button onClick={() => copyAllForPlatform('linkedin')} variant="outline" className="border-gold/30 text-gold-light hover:bg-gold/10">
                <Copy className="h-4 w-4 mr-2" /> Tout copier
              </Button>
            </div>
            <div className="grid gap-5">
              {allLinkedinPosts.map(renderPost)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialPostGeneratorPage;
