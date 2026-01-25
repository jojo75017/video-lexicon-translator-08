import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Target, MessageSquare, Linkedin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Template {
  id: string;
  title: string;
  content: string;
  hashtags?: string[];
  platform: 'pinterest' | 'quora' | 'linkedin';
  category: string;
}

const templates: Template[] = [
  // Pinterest Templates
  {
    id: 'pin-1',
    platform: 'pinterest',
    category: 'Idées Ebooks',
    title: '📚 50 Idées d\'Ebooks Rentables',
    content: `📚 50 IDÉES D'EBOOKS RENTABLES EN 2025 📚

Vous rêvez de devenir auteur mais vous ne savez pas par où commencer ?

Voici les niches les plus rentables pour votre premier ebook :

✅ Développement personnel
✅ Finances personnelles  
✅ Recettes healthy
✅ Productivité & organisation
✅ Parentalité positive

🔥 Bonus : Avec l'IA, vous pouvez créer votre ebook en quelques heures seulement !

📌 Enregistrez cette épingle pour plus tard !

👉 Lien en bio pour découvrir l'outil qui révolutionne l'écriture`,
    hashtags: ['ebook', 'autoedition', 'kdp', 'ecriture', 'auteur', 'passifrevenu', 'ia', 'writingcommunity', 'selfpublishing', 'ebookstudio']
  },
  {
    id: 'pin-2',
    platform: 'pinterest',
    category: 'KDP Tips',
    title: '💰 Gagner de l\'argent avec KDP',
    content: `💰 COMMENT GAGNER DE L'ARGENT AVEC AMAZON KDP 💰

L'auto-édition n'a jamais été aussi accessible !

Voici le secret des auteurs qui réussissent sur Amazon :

1️⃣ Choisir une niche rentable (pas trop de concurrence)
2️⃣ Créer du contenu de qualité (l'IA peut vous aider !)
3️⃣ Optimiser le SEO Amazon (mots-clés stratégiques)
4️⃣ Designer une couverture professionnelle
5️⃣ Lancer et promouvoir intelligemment

📊 Certains auteurs gagnent 1000€+ par mois en passif !

📌 Sauvegardez ce guide pour le relire !

🔗 Découvrez comment créer votre ebook en 24h → lien en bio`,
    hashtags: ['amazonkdp', 'revenuspassifs', 'autoedition', 'ebook', 'auteurindependant', 'kdptips', 'selfpublish', 'writingtips', 'ebookwriting', 'iawriting']
  },
  {
    id: 'pin-3',
    platform: 'pinterest',
    category: 'IA & Écriture',
    title: '🤖 Écrire avec l\'IA',
    content: `🤖 ÉCRIRE UN LIVRE AVEC L'IA : LE GUIDE COMPLET 🤖

Vous pensez que l'IA va remplacer les auteurs ? 
FAUX ! Elle les aide à être plus productifs.

Voici comment utiliser l'IA intelligemment :

✨ Brainstorming d'idées
✨ Structure et plan détaillé
✨ Premier jet rapide
✨ Suggestions d'amélioration
✨ Correction et édition

⚠️ MAIS l'IA ne remplace pas :
→ Votre voix unique
→ Votre expertise
→ Votre créativité

Le combo parfait = Votre talent + IA = Livre publié rapidement !

📌 Épinglez pour ne pas oublier !

🚀 Testez gratuitement l'outil → lien en bio`,
    hashtags: ['iawriting', 'chatgpt', 'ecriture', 'auteur', 'ebookia', 'writingtools', 'autoedition', 'productivite', 'creationcontenu', 'digitalwriting']
  },
  {
    id: 'pin-4',
    platform: 'pinterest',
    category: 'Couvertures',
    title: '🎨 Créer une couverture pro',
    content: `🎨 CRÉER UNE COUVERTURE D'EBOOK PROFESSIONNELLE 🎨

La couverture = 80% de la décision d'achat !

Voici les secrets d'une couverture qui VEND :

📐 Format : 1600x2560 pixels (ratio 1:1.6)
🎨 Couleurs : Contrastées et lisibles en miniature
📝 Typographie : Max 2 polices, lisible en petit
🖼️ Image : Haute qualité, évocatrice
✨ Style : Cohérent avec le genre du livre

❌ À éviter :
• Trop de texte
• Images floues
• Polices illisibles
• Design amateur

💡 Astuce : L'IA peut générer des couvertures pro en quelques clics !

📌 Sauvegardez ce checklist !

→ Créez votre couverture gratuite en bio`,
    hashtags: ['bookcover', 'coverdesign', 'ebookcover', 'graphicdesign', 'kdpcover', 'autoedition', 'bookdesign', 'selfpublishing', 'authorlife', 'writingcommunity']
  },
  {
    id: 'pin-5',
    platform: 'pinterest',
    category: 'Niches rentables',
    title: '💎 Niches les plus rentables',
    content: `💎 TOP 10 NICHES EBOOK LES PLUS RENTABLES EN 2025 💎

Analysé sur des milliers de bestsellers Amazon :

🥇 1. Finances personnelles & Investissement
🥈 2. Développement personnel
🥉 3. Régimes & Nutrition
4️⃣ Productivité & Organisation
5️⃣ Relations & Communication
6️⃣ Business en ligne
7️⃣ Parentalité
8️⃣ Bien-être mental
9️⃣ Recettes spécialisées
🔟 Guides pratiques DIY

📊 Chiffres clés :
• Moyenne : 5-15€ par ebook
• Top auteurs : 1000+ ventes/mois
• ROI potentiel : 500%+

📌 Épinglez cette liste !

🔍 Analysez votre niche → lien en bio`,
    hashtags: ['nichebook', 'kdpniches', 'amazonkdp', 'ebookrentable', 'autoedition', 'revenuspassifs', 'businessenligne', 'auteurindependant', 'marketresearch', 'selfpublish']
  },

  // Quora Templates
  {
    id: 'quora-1',
    platform: 'quora',
    category: 'Écrire avec IA',
    title: 'Comment écrire un livre avec ChatGPT ?',
    content: `Comment écrire un livre avec ChatGPT ou une IA ?

C'est une excellente question que beaucoup se posent en 2025. Voici ma méthode après avoir aidé des dizaines d'auteurs :

**1. L'IA ne remplace pas l'auteur**
Elle amplifie vos idées. Vous restez le chef d'orchestre.

**2. Mon workflow en 5 étapes :**

📋 **Étape 1 - Brainstorming**
Utilisez l'IA pour générer 50+ idées de sujets. Filtrez celles qui vous passionnent ET qui ont un marché.

📝 **Étape 2 - Structure**
Demandez à l'IA de créer un plan détaillé. Ajustez selon votre vision.

✍️ **Étape 3 - Premier jet**
L'IA génère un premier brouillon chapitre par chapitre. Vous corrigez et personnalisez.

🔍 **Étape 4 - Humanisation**
Relisez, ajoutez votre voix, vos anecdotes, votre expertise.

📚 **Étape 5 - Publication**
Formatez pour Amazon KDP ou autres plateformes.

**Résultat typique :** Un ebook de 15 000 mots en 1-2 semaines au lieu de 6 mois.

**Conseil bonus :** Il existe des outils spécialisés qui automatisent tout ce processus. Personnellement j'utilise un générateur d'ebooks qui fait tout ça en quelques clics.

J'espère que ça aide ! N'hésitez pas si vous avez des questions.`,
  },
  {
    id: 'quora-2',
    platform: 'quora',
    category: 'KDP Amazon',
    title: 'Est-ce rentable de vendre des ebooks sur Amazon ?',
    content: `Est-ce vraiment rentable de vendre des ebooks sur Amazon KDP ?

Oui, mais avec les bonnes stratégies. Voici ce que j'ai appris après 2 ans d'expérience :

**Les chiffres réalistes :**
- Auteur débutant : 50-200€/mois après 3-6 mois
- Auteur intermédiaire : 500-1500€/mois
- Top auteurs : 5000€+ /mois (rare mais possible)

**Ce qui fait la différence :**

✅ **Niche research** : Trouver des marchés avec demande mais concurrence gérable

✅ **Qualité du contenu** : Les lecteurs laissent des avis. Mauvais contenu = mauvaises reviews = mort du livre

✅ **SEO Amazon** : Mots-clés dans le titre, sous-titre, description. Crucial !

✅ **Couverture professionnelle** : 80% de la décision d'achat se fait sur la cover

✅ **Série de livres** : Un lecteur satisfait achète les suivants

**Mon conseil pour débuter :**

1. Commencez par un livre court (10-15k mots)
2. Testez une niche précise
3. Analysez les résultats
4. Itérez et améliorez

**L'outil qui m'a aidé :** J'utilise un générateur d'ebooks IA qui accélère tout le processus de création. De l'idée au livre publié en quelques jours au lieu de mois.

Bonne chance dans votre aventure !`,
  },
  {
    id: 'quora-3',
    platform: 'quora',
    category: 'Débutant',
    title: 'Comment auto-publier son premier livre ?',
    content: `Comment auto-publier son premier livre ? Guide complet pour débutants

Je vais vous partager le processus exact que j'utilise :

**Phase 1 : Préparation (1-2 semaines)**

📊 **Étude de marché**
- Analysez les bestsellers de votre catégorie
- Notez les thèmes, longueurs, prix
- Identifiez ce qui manque (votre opportunité)

📝 **Planification**
- Créez un plan détaillé
- Définissez votre lecteur cible
- Choisissez votre angle unique

**Phase 2 : Création (2-4 semaines)**

✍️ **Rédaction**
- Écrivez régulièrement (objectif quotidien)
- Utilisez l'IA pour accélérer si besoin
- Ne cherchez pas la perfection au premier jet

🔍 **Édition**
- Auto-correction
- Beta-lecteurs si possible
- Relecture finale

**Phase 3 : Publication (1 semaine)**

🎨 **Design**
- Couverture professionnelle (essentiel !)
- Formatage ebook (Kindle Create gratuit)

📋 **Amazon KDP**
- Créez votre compte (gratuit)
- Uploadez manuscrit + couverture
- Optimisez titre, description, mots-clés

🚀 **Lancement**
- Prix de lancement réduit
- Demandez des avis
- Promouvez sur vos réseaux

**Astuce finale :** Des outils existent pour automatiser 80% de ce processus. Cherchez "générateur ebook IA" - ça change la donne !

Bon courage pour votre premier livre ! 📚`,
  },
  {
    id: 'quora-4',
    platform: 'quora',
    category: 'Revenus passifs',
    title: 'Comment créer des revenus passifs avec les ebooks ?',
    content: `Comment créer des revenus passifs avec les ebooks en 2025 ?

Les ebooks sont l'un des meilleurs actifs numériques pour générer des revenus passifs. Voici pourquoi et comment :

**Pourquoi les ebooks ?**

💰 **Marges élevées** : Coût de production quasi nul après création
📈 **Scalable** : Vendre 10 ou 10 000 copies = même effort
🌍 **Global** : Amazon = accès à des millions de lecteurs
⏰ **Passif** : Travail initial, puis revenus récurrents

**Ma stratégie pour des revenus passifs durables :**

**1. Créer une "machine à contenu"**
- Publiez 1-2 livres par mois
- Chaque livre = un nouvel actif qui génère
- L'effet cumulé est puissant

**2. Diversifier les niches**
- Ne mettez pas tout dans un panier
- 3-5 niches différentes = sécurité

**3. Créer des séries**
- Un lecteur satisfait = 3-5 ventes potentielles
- Les séries fidélisent

**4. Automatiser la création**
- L'IA réduit le temps de création de 70%
- Des outils spécialisés existent pour tout automatiser

**Exemple concret :**
- 10 ebooks à 4,99€
- 50 ventes/mois chacun (conservateur)
- = 1 750€/mois de revenus quasi-passifs

**Mon secret :** J'utilise un générateur d'ebooks basé sur l'IA qui me permet de créer un livre complet en 1 journée au lieu de 2-3 mois. Le ROI est énorme.

Des questions ? Je suis là !`,
  },
  {
    id: 'quora-5',
    platform: 'quora',
    category: 'Outils',
    title: 'Quels outils pour écrire un ebook rapidement ?',
    content: `Quels sont les meilleurs outils pour écrire un ebook rapidement en 2025 ?

Voici ma stack d'outils après avoir testé des dizaines de solutions :

**🔍 Recherche & Idéation**
- **Amazon Bestsellers** : Gratuit, pour voir ce qui se vend
- **Google Trends** : Identifier les sujets montants
- **Outils IA** : Génération d'idées en masse

**✍️ Rédaction**
- **Outils IA spécialisés** : Génération de contenu structuré
- **Google Docs** : Collaboration et backup cloud
- **Notion** : Organisation du projet

**🎨 Design couverture**
- **Canva Pro** : Templates ebook, facile
- **Générateurs IA** : Couvertures uniques en 1 clic
- **Adobe Express** : Alternative gratuite

**📝 Formatage**
- **Kindle Create** : Gratuit, officiel Amazon
- **Calibre** : Conversion tous formats
- **Vellum** : Premium, résultats pro (Mac only)

**📊 Publication & Analytics**
- **Amazon KDP** : Plateforme principale
- **KDP Reports** : Suivi des ventes

**🚀 Mon outil favori :**
Honnêtement, j'ai découvert un générateur d'ebooks tout-en-un basé sur l'IA qui fait : recherche de niche, création de plan, rédaction, design couverture et formatage. Tout en un seul endroit. C'est un game-changer pour la productivité.

Ça m'a fait passer de 1 livre/trimestre à 2-3 livres/mois.

N'hésitez pas si vous voulez plus de détails sur un outil spécifique !`,
  },

  // LinkedIn Templates
  {
    id: 'li-1',
    platform: 'linkedin',
    category: 'Success Story',
    title: '🚀 De 0 à auteur publié',
    content: `🚀 De 0 à auteur publié en 30 jours : mon parcours

Il y a un mois, je n'avais jamais écrit plus de 10 pages.

Aujourd'hui, mon premier ebook est disponible sur Amazon.

Voici ce que j'ai appris :

━━━━━━━━━━━━━━━━━━━━━

📌 Mythe #1 : "Il faut des années pour écrire un livre"
→ Réalité : Avec les bons outils et méthodes, 30 jours suffisent.

📌 Mythe #2 : "L'IA va remplacer les auteurs"
→ Réalité : L'IA est un assistant, pas un remplaçant. Ma voix reste unique.

📌 Mythe #3 : "L'auto-édition, ce n'est pas sérieux"
→ Réalité : Amazon KDP = accès à des millions de lecteurs. Certains auteurs font 6 chiffres/an.

━━━━━━━━━━━━━━━━━━━━━

🔑 Les 3 clés de mon succès :

1️⃣ J'ai arrêté de procrastiner et commencé
2️⃣ J'ai utilisé l'IA intelligemment (pas pour remplacer, pour accélérer)
3️⃣ J'ai suivi un processus structuré

━━━━━━━━━━━━━━━━━━━━━

💡 Leçon finale :

Le meilleur moment pour commencer était hier.
Le deuxième meilleur moment, c'est maintenant.

Et vous, quel projet repoussez-vous depuis trop longtemps ?

#autoedition #ebook #auteur #entrepreneuriat #productivite #ia #amazon`,
  },
  {
    id: 'li-2',
    platform: 'linkedin',
    category: 'Tips',
    title: '💡 5 erreurs d\'auteurs débutants',
    content: `💡 5 erreurs que font 90% des auteurs débutants (et comment les éviter)

Après avoir accompagné des dizaines d'auteurs, voici les pièges les plus fréquents :

━━━━━━━━━━━━━━━━━━━━━

❌ Erreur #1 : Écrire sans étudier le marché
→ ✅ Analysez les bestsellers de votre niche AVANT d'écrire

❌ Erreur #2 : Négliger la couverture
→ ✅ 80% des décisions d'achat = la cover. Investissez-y.

❌ Erreur #3 : Un titre générique
→ ✅ Titre accrocheur + sous-titre explicatif + mots-clés

❌ Erreur #4 : Publier et... attendre
→ ✅ Préparez votre lancement : emails, réseaux, promos

❌ Erreur #5 : Abandonner après 1 livre
→ ✅ Le succès vient avec la consistance. Visez 5-10 livres.

━━━━━━━━━━━━━━━━━━━━━

🎯 La bonne nouvelle ?

Ces erreurs sont 100% évitables avec la bonne préparation.

Des outils existent aujourd'hui pour automatiser la recherche de marché, la création de contenu et le design. L'IA a révolutionné le processus.

━━━━━━━━━━━━━━━━━━━━━

Quelle erreur vous parle le plus ? 👇

#ecriture #auteur #autoedition #kdp #amazon #ebook #tips`,
  },
  {
    id: 'li-3',
    platform: 'linkedin',
    category: 'IA & Business',
    title: '🤖 L\'IA et l\'avenir de l\'édition',
    content: `🤖 L'IA va-t-elle tuer les auteurs ? Mon avis après 6 mois d'utilisation intensive.

La réponse courte : Non.

La réponse longue :

━━━━━━━━━━━━━━━━━━━━━

📊 Ce que l'IA fait TRÈS bien :
• Brainstorming d'idées (100+ en 5 min)
• Structuration de contenu
• Premier jet rapide
• Recherche et synthèse
• Suggestions d'amélioration

📊 Ce que l'IA fait MAL :
• Voix authentique et unique
• Expériences personnelles
• Nuances émotionnelles
• Expertise approfondie
• Créativité originale

━━━━━━━━━━━━━━━━━━━━━

💡 Ma conclusion :

L'IA est le meilleur assistant qu'un auteur puisse avoir.

Elle me permet de :
→ Publier 3x plus de livres
→ Avec la même qualité
→ En travaillant 2x moins

Mais chaque mot reste validé par MOI.
Chaque idée est enrichie de MON expertise.
Chaque livre porte MA signature.

━━━━━━━━━━━━━━━━━━━━━

🚀 Le futur appartient aux auteurs qui :
1. Embrassent l'IA comme outil
2. Gardent leur voix unique
3. Produisent plus, mieux, plus vite

Êtes-vous prêt pour cette révolution ?

#ia #artificialintelligence #ecriture #auteur #futuroftwork #productivite #edition`,
  },
  {
    id: 'li-4',
    platform: 'linkedin',
    category: 'Revenus',
    title: '💰 Revenus passifs avec les ebooks',
    content: `💰 J'ai créé 5 sources de revenus passifs avec des ebooks. Voici mon bilan transparent.

Beaucoup parlent de "revenus passifs".
Peu montrent les vrais chiffres.

Voici les miens après 1 an d'auto-édition :

━━━━━━━━━━━━━━━━━━━━━

📚 Mon portfolio :
• 12 ebooks publiés
• 3 niches différentes
• Temps moyen par livre : 2-3 semaines

💵 Revenus mensuels moyens :
• Livre 1-3 : 150-200€/mois chacun
• Livre 4-8 : 50-100€/mois chacun
• Livre 9-12 : 20-50€/mois chacun

Total : ~1 200-1 500€/mois

━━━━━━━━━━━━━━━━━━━━━

🔑 Ce qui a fait la différence :

1️⃣ Recherche de niche AVANT d'écrire
(J'utilise un outil d'analyse de marché)

2️⃣ Couvertures professionnelles
(L'IA génère des covers incroyables maintenant)

3️⃣ SEO Amazon optimisé
(Mots-clés stratégiques partout)

4️⃣ Consistency > Perfection
(Publier régulièrement bat publier parfaitement)

━━━━━━━━━━━━━━━━━━━━━

📈 Objectif 2025 : 3 000€/mois passifs

C'est réaliste avec 25-30 ebooks bien positionnés.

Et vous, avez-vous déjà envisagé l'auto-édition ?

#revenuspassifs #ebook #autoedition #amazon #kdp #entrepreneuriat #sidehustle`,
  },
  {
    id: 'li-5',
    platform: 'linkedin',
    category: 'Process',
    title: '📋 Mon workflow d\'écriture',
    content: `📋 Mon workflow pour écrire un ebook en 7 jours (au lieu de 7 mois)

"Tu écris trop vite, ça ne peut pas être de la qualité."

C'est ce qu'on me disait.

Puis mes lecteurs ont donné 4.5 étoiles en moyenne.

Voici ma méthode :

━━━━━━━━━━━━━━━━━━━━━

📅 Jour 1 : Recherche & Validation
• Analyser le marché (2h)
• Valider la demande
• Identifier l'angle unique

📅 Jour 2 : Structure
• Plan détaillé 10-15 chapitres
• Sous-sections définies
• Flow logique validé

📅 Jour 3-4 : Premier jet
• Rédaction assistée par IA
• 3000-5000 mots/jour
• Sans perfectionnisme

📅 Jour 5 : Édition
• Relecture complète
• Ajout voix personnelle
• Humanisation du contenu

📅 Jour 6 : Design
• Couverture (IA + retouches)
• Formatage Kindle
• Vérification technique

📅 Jour 7 : Publication
• Upload KDP
• Optimisation SEO
• Description + mots-clés

━━━━━━━━━━━━━━━━━━━━━

🎯 Le secret ?

Ce n'est pas la vitesse. C'est le système.

Un processus reproductible + les bons outils = résultats prévisibles.

Sauvegardez ce post pour votre prochain projet ! 📌

#productivite #ecriture #auteur #workflow #autoedition #ebook #efficiency`,
  },
];

const MarketingTemplates: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pinterest' | 'quora' | 'linkedin'>('pinterest');

  const copyToClipboard = async (template: Template) => {
    let textToCopy = template.content;
    if (template.hashtags) {
      textToCopy += '\n\n' + template.hashtags.map(h => `#${h}`).join(' ');
    }
    
    await navigator.clipboard.writeText(textToCopy);
    setCopiedId(template.id);
    toast.success('Copié dans le presse-papiers !');
    
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'pinterest': return <Target className="h-4 w-4" />;
      case 'quora': return <MessageSquare className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'pinterest': return 'from-pink-500 to-red-500';
      case 'quora': return 'from-orange-500 to-red-600';
      case 'linkedin': return 'from-blue-600 to-blue-800';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredTemplates = templates.filter(t => t.platform === activeTab);

  return (
    <Card className="border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Templates Prêts à Copier
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Posts optimisés pour Pinterest, Quora et LinkedIn - Copiez et personnalisez !
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="pinterest" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Pinterest ({templates.filter(t => t.platform === 'pinterest').length})
            </TabsTrigger>
            <TabsTrigger value="quora" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Quora ({templates.filter(t => t.platform === 'quora').length})
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn ({templates.filter(t => t.platform === 'linkedin').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid gap-4">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${getPlatformColor(template.platform)}`} />
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getPlatformIcon(template.platform)}
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold">{template.title}</h3>
                      </div>
                      <Button
                        size="sm"
                        variant={copiedId === template.id ? "default" : "outline"}
                        onClick={() => copyToClipboard(template)}
                        className="shrink-0"
                      >
                        {copiedId === template.id ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Copié !
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copier
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-4 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto border">
                      {template.content}
                    </div>
                    
                    {template.hashtags && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {template.hashtags.slice(0, 8).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {template.hashtags.length > 8 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.hashtags.length - 8}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <h4 className="font-semibold text-green-400 mb-2">💡 Conseils d'utilisation</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Pinterest</strong> : Publiez 5-10 épingles/jour avec Tailwind ou Buffer</li>
            <li>• <strong>Quora</strong> : Répondez à 2-3 questions/jour. Restez authentique, pas promotionnel</li>
            <li>• <strong>LinkedIn</strong> : 1 post/jour aux heures de pointe (8h-9h ou 17h-18h)</li>
            <li>• Personnalisez toujours avec votre touche personnelle avant de publier !</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingTemplates;
