import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Check, Gift, Users, TrendingUp, DollarSign, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AffiliationFormationPage = () => {
  const navigate = useNavigate();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    toast.success('Contenu copié !');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const formationContent = {
    introduction: `🎯 FORMATION COMPLÈTE - PROGRAMME D'AFFILIATION GÉNÉRATEUR D'EBOOK

Bienvenue dans le programme d'affiliation du Générateur d'Ebook Pro !

Cette formation vous explique comment promouvoir efficacement notre générateur d'ebook et générer des revenus passifs grâce à notre système de commission attractif.`,

    presentation: `📚 QU'EST-CE QUE LE GÉNÉRATEUR D'EBOOK PRO ?

Le Générateur d'Ebook Pro est un outil professionnel tout-en-un qui permet de créer des ebooks de qualité en quelques minutes :

✅ Plus de 300 idées de titres par catégories
✅ Génération automatique de plan avec IA (GPT-4)
✅ Éditeur de chapitres et sous-chapitres intuitif
✅ Templates professionnels (Business, Guide, Fiction, Mémoire)
✅ Export PDF/EPUB haute qualité
✅ Outils Amazon KDP intégrés
✅ Génération de couvertures avec IA
✅ Banque d'images professionnelles
✅ Outils de marketing et monétisation

Prix : 47€ - 97€ (selon l'offre)
Cible : Auteurs, entrepreneurs, formateurs, marketeurs, blogueurs`,

    commissions: `💰 VOTRE COMMISSION D'AFFILIATION

🎁 Commission : 30% par vente
💵 Revenus par vente : 14€ - 29€
🔄 Durée du cookie : 30 jours
💳 Paiement : Mensuel (minimum 50€)

EXEMPLES DE REVENUS :
- 10 ventes/mois = 140€ - 290€
- 30 ventes/mois = 420€ - 870€
- 100 ventes/mois = 1 400€ - 2 900€`,

    whoCanPromote: `👥 QUI PEUT DEVENIR AFFILIÉ ?

✅ Blogueurs et créateurs de contenu
✅ Influenceurs sur les réseaux sociaux
✅ YouTubers et podcasteurs
✅ Formateurs et coachs
✅ Community managers
✅ Marketeurs et entrepreneurs
✅ Propriétaires de sites web/forums
✅ Email marketeurs avec liste d'abonnés

AUCUNE COMPÉTENCE TECHNIQUE REQUISE !`,

    howItWorks: `🔧 COMMENT ÇA FONCTIONNE ?

1️⃣ INSCRIPTION (GRATUITE)
   → Créez votre compte affilié
   → Recevez votre lien de parrainage unique
   → Accédez à votre tableau de bord

2️⃣ PROMOTION
   → Partagez votre lien sur vos canaux
   → Utilisez nos ressources marketing (bannières, emails, posts)
   → Créez du contenu autour de la création d'ebooks

3️⃣ SUIVI
   → Trackez vos clics et conversions en temps réel
   → Visualisez vos commissions gagnées
   → Optimisez vos campagnes

4️⃣ PAIEMENT
   → Recevez vos commissions mensuellement
   → Paiement automatique dès 50€ atteints
   → Options : PayPal, virement bancaire`,

    strategies: `🎯 STRATÉGIES DE PROMOTION EFFICACES

1. CONTENU BLOG/ARTICLE
   → "Comment créer un ebook en 1 heure"
   → "Les meilleurs outils pour écrire un ebook"
   → "Guide complet de publication Amazon KDP"
   → Tutoriels et comparatifs d'outils

2. RÉSEAUX SOCIAUX
   → Démonstrations vidéo du générateur
   → Avant/après de création d'ebook
   → Témoignages de vos propres créations
   → Stories Instagram/TikTok montrant le processus

3. EMAIL MARKETING
   → Séquence d'emails sur la création d'ebooks
   → Newsletter hebdomadaire avec tips
   → Offres exclusives pour vos abonnés
   → Cas d'études et success stories

4. YOUTUBE/VIDÉO
   → Tutoriels complets du générateur
   → Reviews honnêtes de l'outil
   → Création d'ebook en direct (speed run)
   → Comparaisons avec d'autres outils

5. COMMUNAUTÉS EN LIGNE
   → Forums d'entrepreneurs
   → Groupes Facebook d'auteurs
   → Reddit (r/selfpublish, r/entrepreneurship)
   → Discord de créateurs de contenu`,

    resources: `📦 RESSOURCES MARKETING FOURNIES

Nous vous fournissons tout le matériel nécessaire :

🎨 VISUELS
   → Bannières (300x250, 728x90, 160x600)
   → Images pour réseaux sociaux
   → GIFs animés de démonstration
   → Screenshots du générateur

✍️ TEXTES PRÉ-ÉCRITS
   → Emails de promotion (10+ modèles)
   → Posts réseaux sociaux (30+ exemples)
   → Scripts de vidéos YouTube
   → Descriptions de produit

📊 STATISTIQUES
   → Tableau de bord en temps réel
   → Rapports de performance
   → Taux de conversion moyen : 8-12%
   → Analytics détaillés`,

    tips: `💡 CONSEILS POUR MAXIMISER VOS VENTES

1. CRÉEZ VOTRE PROPRE EBOOK AVEC L'OUTIL
   → Montrez un exemple concret
   → Partagez votre expérience authentique
   → Générez de la confiance

2. OFFREZ DU BONUS EXCLUSIF
   → Guide complet de publication KDP
   → Templates d'ebook supplémentaires
   → Session de coaching 1-1
   → Groupe privé d'entraide

3. CRÉEZ DU CONTENU ÉDUCATIF
   → Tutoriels gratuits sur la création d'ebooks
   → Webinaires et lives
   → Lead magnets (mini-guides PDF)

4. UTILISEZ LA PREUVE SOCIALE
   → Partagez des témoignages
   → Montrez vos résultats
   → Créez des études de cas

5. TESTEZ ET OPTIMISEZ
   → A/B testez vos messages
   → Analysez vos meilleurs canaux
   → Doublez sur ce qui fonctionne`,

    faqs: `❓ QUESTIONS FRÉQUENTES

Q: Combien de temps dure le cookie de suivi ?
R: 30 jours - Si quelqu'un clique sur votre lien, vous avez 30 jours pour qu'il achète.

Q: Quand suis-je payé ?
R: Mensuellement, dès que vous atteignez 50€ de commissions.

Q: Puis-je promouvoir si je n'ai pas de blog ?
R: Absolument ! Réseaux sociaux, YouTube, email, forums... tous les canaux fonctionnent.

Q: Puis-je utiliser de la publicité payante ?
R: Oui, Google Ads, Facebook Ads sont autorisés (respectez nos guidelines).

Q: Combien de ventes puis-je espérer ?
R: Cela dépend de votre audience et de vos efforts. Moyenne : 5-20 ventes/mois pour les affiliés actifs.

Q: Y a-t-il un quota minimum de ventes ?
R: Non, aucun quota. Vous êtes libre de promouvoir à votre rythme.`,

    actionPlan: `🚀 PLAN D'ACTION IMMÉDIAT (7 JOURS)

JOUR 1-2 : PRÉPARATION
□ Créer votre compte affilié
□ Récupérer votre lien unique
□ Télécharger les ressources marketing
□ Tester le générateur vous-même

JOUR 3-4 : CONTENU
□ Rédiger 1 article de blog
□ Créer 5 posts pour réseaux sociaux
□ Préparer 1 email pour votre liste
□ Créer une vidéo de démonstration (optionnel)

JOUR 5-6 : DIFFUSION
□ Publier votre article
□ Partager sur réseaux sociaux
□ Envoyer l'email à votre liste
□ Rejoindre 2-3 communautés pertinentes

JOUR 7 : OPTIMISATION
□ Analyser vos premiers clics
□ Ajuster votre message si besoin
□ Planifier votre contenu pour la semaine suivante`,

    earnings: `📈 POTENTIEL DE REVENUS RÉALISTE

SCÉNARIO CONSERVATEUR (Débutant)
→ 100 visiteurs/mois sur votre contenu
→ Taux de clic : 10% = 10 clics
→ Taux de conversion : 8% = 0.8 vente/mois ≈ 1 vente
→ Revenus : ~20€/mois

SCÉNARIO MOYEN (Affilié actif)
→ 500 visiteurs/mois
→ 50 clics vers le générateur
→ 4 ventes/mois (8% conversion)
→ Revenus : ~80€/mois

SCÉNARIO AMBITIEUX (Affilié pro)
→ 2 000 visiteurs/mois
→ 200 clics
→ 16 ventes/mois
→ Revenus : ~320€/mois

SCÉNARIO EXPERT (Top affilié)
→ 10 000 visiteurs/mois
→ 1 000 clics
→ 80 ventes/mois
→ Revenus : ~1 600€/mois`,

    conclusion: `🎉 PRÊT À COMMENCER ?

Le programme d'affiliation du Générateur d'Ebook Pro est une opportunité fantastique de générer des revenus passifs en aidant d'autres créateurs.

🔑 CLÉS DU SUCCÈS :
✅ Authenticité - Testez et utilisez vraiment le produit
✅ Constance - Créez du contenu régulièrement
✅ Valeur - Aidez votre audience avant de vendre
✅ Patience - Les premiers résultats prennent 30-60 jours
✅ Optimisation - Testez et améliorez constamment

📧 BESOIN D'AIDE ?
Support affiliés : affiliation@votredomaine.com
Documentation : www.votredomaine.com/affiliation
Groupe privé : [Lien Discord/Telegram]

🚀 REJOIGNEZ-NOUS MAINTENANT !
→ Inscrivez-vous gratuitement
→ Commencez à promouvoir dès aujourd'hui
→ Recevez votre première commission sous 30 jours

Bonne chance dans votre aventure d'affilié ! 💪`
  };

  const sections = [
    { id: 'introduction', title: '🎯 Introduction', content: formationContent.introduction, icon: Rocket },
    { id: 'presentation', title: '📚 Présentation du Produit', content: formationContent.presentation, icon: Gift },
    { id: 'commissions', title: '💰 Structure de Commission', content: formationContent.commissions, icon: DollarSign },
    { id: 'whoCanPromote', title: '👥 Qui peut devenir affilié ?', content: formationContent.whoCanPromote, icon: Users },
    { id: 'howItWorks', title: '🔧 Comment ça fonctionne', content: formationContent.howItWorks, icon: TrendingUp },
    { id: 'strategies', title: '🎯 Stratégies de Promotion', content: formationContent.strategies, icon: TrendingUp },
    { id: 'resources', title: '📦 Ressources Marketing', content: formationContent.resources, icon: Gift },
    { id: 'tips', title: '💡 Conseils Pro', content: formationContent.tips, icon: Rocket },
    { id: 'earnings', title: '📈 Potentiel de Revenus', content: formationContent.earnings, icon: DollarSign },
    { id: 'actionPlan', title: '🚀 Plan d\'Action 7 Jours', content: formationContent.actionPlan, icon: Rocket },
    { id: 'faqs', title: '❓ FAQ', content: formationContent.faqs, icon: Users },
    { id: 'conclusion', title: '🎉 Conclusion', content: formationContent.conclusion, icon: Gift },
  ];

  const copyAllContent = () => {
    const fullContent = Object.values(formationContent).join('\n\n' + '='.repeat(80) + '\n\n');
    copyToClipboard(fullContent, 'all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/ebook-planner')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au Générateur
          </Button>

          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Formation Programme d'Affiliation
            </h1>
            <p className="text-xl text-muted-foreground">
              Générateur d'Ebook Pro - Gagnez 30% de commission
            </p>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Commission : 30% par vente</p>
                    <p className="text-sm text-muted-foreground">14€ - 29€ par vente • Cookie 30 jours</p>
                  </div>
                </div>
                <Button
                  onClick={copyAllContent}
                  size="lg"
                  className="gap-2"
                >
                  {copiedSection === 'all' ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copier Tout
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">{section.title}</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(section.content, section.id)}
                      className="gap-2"
                    >
                      {copiedSection === section.id ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copié
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copier
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed">
                    {section.content}
                  </pre>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer CTA */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold mb-3">Prêt à devenir affilié ?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Rejoignez notre programme d'affiliation et commencez à gagner des commissions dès aujourd'hui !
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => window.open('mailto:affiliation@votredomaine.com', '_blank')}
                className="gap-2"
              >
                <Users className="h-5 w-5" />
                S'inscrire au Programme
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/ebook-planner')}
                className="gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Retour au Générateur
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliationFormationPage;
