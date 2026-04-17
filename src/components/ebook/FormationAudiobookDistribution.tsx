import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, BookOpen, Globe, DollarSign, Megaphone, Upload, 
  CheckCircle2, ChevronDown, Download, Store, Mic, Share2, 
  BarChart3, ShieldCheck, Sparkles, Target, Users, TrendingUp,
  FileAudio, Layers, Palette, Clock, Award, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';

interface FormationModule {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  content: { subtitle: string; text?: string; items?: string[] }[];
}

const distributionModules: FormationModule[] = [
  {
    id: 1,
    title: "Pourquoi créer un livre audio ?",
    description: "Le marché en pleine explosion et les opportunités",
    icon: TrendingUp,
    color: "from-emerald-500 to-green-500",
    content: [
      {
        subtitle: "📈 Un marché en pleine croissance",
        text: "Le marché mondial du livre audio atteint 7,7 milliards $ en 2025, avec une croissance annuelle de 26%. En France, le marché a doublé en 3 ans. C'est LE moment idéal pour se positionner."
      },
      {
        subtitle: "💡 Pourquoi vous devez vous lancer",
        items: [
          "Revenus passifs : Un livre audio génère des ventes 24h/24 sans effort supplémentaire",
          "Nouveau public : 65% des auditeurs n'achètent PAS la version écrite — c'est un marché différent",
          "Prix plus élevés : Un audiobook se vend 15-30€ vs 5-15€ pour un ebook",
          "Fidélisation : Les auditeurs consomment 2x plus de livres que les lecteurs traditionnels",
          "Faible concurrence : Seulement 5% des ebooks ont une version audio — opportunité massive"
        ]
      },
      {
        subtitle: "🎯 Profils qui réussissent",
        items: [
          "Auteurs KDP qui veulent multiplier leurs revenus par 2-3x",
          "Créateurs de contenu qui veulent monétiser leurs écrits différemment",
          "Entrepreneurs qui veulent créer des formations audio premium",
          "Blogueurs et experts qui veulent toucher un public mobile"
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Préparer son livre audio",
    description: "Adapter le texte et choisir la bonne voix",
    icon: FileAudio,
    color: "from-blue-500 to-indigo-500",
    content: [
      {
        subtitle: "📝 Adapter le texte pour l'audio",
        text: "Un texte écrit n'est pas toujours adapté à l'écoute. Voici les ajustements essentiels à faire avant la génération."
      },
      {
        subtitle: "✏️ Modifications à apporter",
        items: [
          "Supprimer les références visuelles : 'voir le tableau ci-dessous', 'comme illustré'...",
          "Épeler les abréviations : 'M.' → 'Monsieur', 'ex.' → 'par exemple'",
          "Simplifier les phrases longues : Maximum 25 mots par phrase pour la clarté",
          "Ajouter des transitions orales : 'Passons maintenant à...', 'Comme nous l'avons vu...'",
          "Convertir les listes en phrases : Les bullet points ne fonctionnent pas à l'oral",
          "Vérifier les noms propres et chiffres : Les voix IA peuvent mal prononcer certains mots"
        ]
      },
      {
        subtitle: "🎙️ Choisir la bonne voix",
        items: [
          "Non-fiction / business : Voix posée et autoritaire (Roger, Brian, Daniel)",
          "Romance / fiction : Voix chaleureuse et expressive (Sarah, Lily, Jessica)",
          "Jeunesse / enfants : Voix dynamique et enjouée (Alice, Matilda)",
          "Thriller / suspense : Voix grave et captivante (Eric, Chris, George)",
          "Développement personnel : Voix rassurante et bienveillante (Laura, Callum)",
          "ASTUCE : Testez 2-3 voix sur le premier chapitre avant de générer tout le livre"
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Générer avec EbookStudio",
    description: "Guide pas à pas de la génération audio",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    content: [
      {
        subtitle: "🚀 Étapes de génération",
        items: [
          "1. Ouvrez votre projet ebook dans EbookStudio",
          "2. Allez dans l'onglet '🎙️ Livre Audio' dans la sidebar",
          "3. Votre texte (préface, chapitres, conclusion) est automatiquement synchronisé",
          "4. Sélectionnez une voix dans le menu déroulant",
          "5. Ajustez les paramètres : vitesse, stabilité, expressivité",
          "6. Cliquez sur 'Générer tout' pour lancer la conversion complète",
          "7. Chaque section est générée puis assemblée automatiquement",
          "8. Écoutez le résultat et ajustez si nécessaire"
        ]
      },
      {
        subtitle: "⚙️ Paramètres recommandés",
        items: [
          "Stabilité : 0.5 pour le naturel, 0.8 pour la constance (narration longue)",
          "Similarité : 0.75 pour un bon équilibre voix/naturel",
          "Style : 0.3-0.5 pour la fiction, 0.1-0.3 pour la non-fiction",
          "Vitesse : 1.0 par défaut, 0.9 pour du contenu technique",
          "Format : MP3 44.1kHz 128kbps — standard de l'industrie"
        ]
      },
      {
        subtitle: "💡 Astuces pro",
        items: [
          "Générez chapitre par chapitre pour pouvoir corriger facilement",
          "Utilisez la lecture séquentielle pour vérifier les transitions",
          "Exportez le script en PDF pour référence pendant l'écoute",
          "Gardez le fichier audio original avant toute modification"
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Publier avec le Publisher intégré",
    description: "Héberger et partager gratuitement vos audiobooks",
    icon: Upload,
    color: "from-purple-500 to-violet-500",
    content: [
      {
        subtitle: "🌐 Le Publisher AudioBook d'EbookStudio",
        text: "EbookStudio inclut un système de publication gratuit qui vous permet d'héberger vos livres audio avec une page publique et un lecteur intégrable."
      },
      {
        subtitle: "📋 Comment publier",
        items: [
          "1. Dans la section Audio, cliquez sur 'Publier un livre audio en ligne'",
          "2. Remplissez : titre, auteur, description, voix utilisée",
          "3. Uploadez le fichier MP3 ou utilisez l'audio généré automatiquement",
          "4. Choisissez la visibilité : public ou privé",
          "5. Cliquez sur 'Publier' — votre page est créée instantanément",
          "6. Partagez le lien public ou copiez le code embed pour votre site"
        ]
      },
      {
        subtitle: "🔗 Fonctionnalités du Publisher",
        items: [
          "Page publique avec design professionnel et lecteur audio intégré",
          "Code iframe embed pour intégrer le lecteur sur n'importe quel site",
          "Compteur d'écoutes pour suivre votre audience",
          "Gestion public/privé pour contrôler la visibilité",
          "Slug personnalisé pour une URL mémorable",
          "Parfait pour : site personnel, blog, réseaux sociaux, newsletter"
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Vendre sur Audible / ACX",
    description: "La plus grande plateforme de livres audio",
    icon: Store,
    color: "from-orange-500 to-red-500",
    content: [
      {
        subtitle: "🎧 Audible — Le géant du livre audio",
        text: "Audible (Amazon) représente 60% du marché mondial des audiobooks. C'est LA plateforme incontournable pour maximiser vos ventes. Distribution via ACX (Audiobook Creation Exchange)."
      },
      {
        subtitle: "📋 Processus de publication sur ACX",
        items: [
          "1. Créez un compte sur acx.com (gratuit)",
          "2. Revendiquez les droits de votre livre (ISBN ou preuve de propriété)",
          "3. Uploadez votre fichier audio (format requis : MP3 192kbps ou WAV)",
          "4. Ajoutez la couverture (2400x2400px minimum, carré)",
          "5. Renseignez le résumé, les catégories et les tags",
          "6. Choisissez le mode de distribution : exclusif ou non-exclusif",
          "7. Soumettez — validation en 10-15 jours ouvrés",
          "8. Disponible sur Audible, Amazon et iTunes automatiquement"
        ]
      },
      {
        subtitle: "💰 Modèles de rémunération ACX",
        items: [
          "Exclusif (7 ans) : 40% de royalties — distribué UNIQUEMENT sur Audible/Amazon/iTunes",
          "Non-exclusif : 25% de royalties — libre de vendre partout ailleurs aussi",
          "Bounty : 75$ par nouveau membre Audible qui achète votre livre en premier",
          "CONSEIL : Commencez en exclusif pour les 40%, puis passez en non-exclusif si vous avez d'autres canaux"
        ]
      },
      {
        subtitle: "⚠️ Exigences techniques ACX",
        items: [
          "Format : MP3 192kbps CBR ou WAV, mono ou stéréo",
          "Durée minimale : 3 heures de contenu audio (sinon rejeté)",
          "Room tone : 0.5-1 seconde de silence au début et fin de chaque chapitre",
          "Niveaux : -23dB à -18dB RMS, pic max -3dB",
          "Bruit de fond : <-60dB (les voix IA respectent généralement cette norme)",
          "Fichiers séparés par chapitre (facilite la navigation pour l'auditeur)"
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Vendre sur les autres plateformes",
    description: "Findaway, Google Play, Kobo, Apple Books...",
    icon: Globe,
    color: "from-teal-500 to-cyan-500",
    content: [
      {
        subtitle: "🌍 Au-delà d'Audible",
        text: "Ne mettez pas tous vos œufs dans le même panier. Diversifier vos plateformes de distribution augmente significativement vos revenus totaux."
      },
      {
        subtitle: "🏪 Plateformes majeures",
        items: [
          "Findaway Voices : Distribue sur 40+ plateformes (Spotify, Apple, Kobo...) — 80% de royalties",
          "Google Play Livres : Directement via Google Play Console — 52% de royalties",
          "Apple Books : Via iTunes Connect — 70% de royalties, mais processus exigeant",
          "Kobo : Via Kobo Writing Life — Forte présence au Canada et en Europe",
          "BookBeat : Très populaire en Europe du Nord, modèle abonnement",
          "Spotify (via Findaway) : En forte croissance, audience massive"
        ]
      },
      {
        subtitle: "🇫🇷 Plateformes françaises",
        items: [
          "Audible.fr : Version française d'Audible, même processus via ACX",
          "Nextory : Abonnement populaire en France, accès via Findaway",
          "Youboox / Vivlio : Plateformes françaises en croissance",
          "Cultura / Fnac : Distributeurs traditionnels avec section audiobooks",
          "StreetLib : Agrégateur européen, distribue sur 50+ plateformes internationales"
        ]
      },
      {
        subtitle: "💡 Stratégie multi-plateforme",
        items: [
          "Utilisez Findaway comme hub central pour la distribution large",
          "Gardez la vente directe pour maximiser vos marges (voir Module 7)",
          "Adaptez vos métadonnées pour chaque plateforme",
          "Surveillez les performances par plateforme chaque mois"
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Vente directe et site personnel",
    description: "Maximiser ses marges en vendant sans intermédiaire",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500",
    content: [
      {
        subtitle: "💰 Pourquoi la vente directe ?",
        text: "Sur les plateformes, vous touchez 25-52% du prix. En vente directe, vous gardez 90-97% après les frais de paiement. Sur un livre à 20€ : 5€ via Audible vs 19€ en direct."
      },
      {
        subtitle: "🛒 Solutions de vente directe",
        items: [
          "Gumroad : Simple, 10% de commission. Idéal pour débuter",
          "Payhip : 5% de commission, support TVA EU automatique",
          "Podia : Tunnel de vente complet + email marketing inclus (plan gratuit disponible)",
          "WooCommerce : Sur votre propre WordPress, frais minimaux",
          "Shopify : Boutique professionnelle, à partir de 29€/mois",
          "SendOwl : Spécialisé dans la vente de fichiers numériques"
        ]
      },
      {
        subtitle: "📋 Mise en place",
        items: [
          "1. Créez une page de vente dédiée avec extraits audio (2-3 min)",
          "2. Ajoutez des témoignages et avis de lecteurs",
          "3. Proposez un prix légèrement inférieur à Audible (-20%)",
          "4. Offrez un bonus exclusif : chapitre bonus, guide complémentaire...",
          "5. Mettez en place un système de livraison automatique du fichier MP3",
          "6. Intégrez le lecteur embed d'EbookStudio pour l'aperçu"
        ]
      },
      {
        subtitle: "🎁 Stratégie Bundle",
        items: [
          "Ebook + Audiobook : Vendez le pack à prix réduit (ex: 25€ au lieu de 35€)",
          "Série complète : Proposez la saga entière en audio à prix avantageux",
          "Abonnement : Accès mensuel à tous vos audiobooks (Patreon, MemberSpace)",
          "Formation + Audiobook : Combinez avec du contenu éducatif premium"
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Optimiser sa fiche produit",
    description: "Titre, description, catégories et mots-clés",
    icon: Target,
    color: "from-pink-500 to-rose-500",
    content: [
      {
        subtitle: "📝 L'art de la fiche produit audiobook",
        text: "Une fiche produit optimisée peut multiplier vos ventes par 3-5x. Chaque élément compte pour convertir un visiteur en acheteur."
      },
      {
        subtitle: "🏷️ Le titre parfait",
        items: [
          "Gardez le même titre que l'ebook pour la cohérence",
          "Ajoutez '(Livre Audio)' ou '(Version Audio)' dans le sous-titre",
          "Incluez le nom de la série si applicable",
          "Mentionnez 'Lu par [Nom de la voix]' pour l'authenticité"
        ]
      },
      {
        subtitle: "📄 Description optimisée",
        items: [
          "Commencez par un hook émotionnel en 2 lignes max",
          "Résumé du contenu en 150-200 mots",
          "Mentionnez la durée d'écoute (ex: '6h30 d'écoute')",
          "Ajoutez 3-5 bullet points avec les bénéfices clés",
          "Incluez une section 'À propos du narrateur'",
          "Terminez par un appel à l'action clair"
        ]
      },
      {
        subtitle: "🔍 Mots-clés et catégories",
        items: [
          "Utilisez les mêmes 7 mots-clés que votre ebook KDP",
          "Ajoutez des variantes 'audiobook', 'livre audio', 'audio'",
          "Choisissez 2 catégories BISAC pertinentes",
          "Ciblez des niches spécifiques plutôt que des catégories larges",
          "Analysez les bestsellers de votre catégorie sur Audible pour inspiration"
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Marketing et promotion",
    description: "Stratégies pour vendre plus d'audiobooks",
    icon: Megaphone,
    color: "from-red-500 to-pink-500",
    content: [
      {
        subtitle: "📢 Stratégies de lancement",
        items: [
          "Offrez les 3 premiers chapitres en écoute gratuite sur votre site",
          "Envoyez un email à votre liste avec un extrait audio de 5 min",
          "Publiez un teaser de 60s sur Instagram Reels et TikTok",
          "Contactez des booktubers/bookstagrammeurs pour des codes promo Audible",
          "Lancez une promo de lancement : -30% la première semaine"
        ]
      },
      {
        subtitle: "🎯 Marketing continu",
        items: [
          "Créez un podcast gratuit avec des extraits de vos audiobooks",
          "Utilisez les codes promo Audible (vous en avez 25 gratuits par titre)",
          "Publiez régulièrement des citations audio de votre livre sur les réseaux",
          "Proposez des échanges de codes promo avec d'autres auteurs",
          "Collectez et affichez les avis des auditeurs"
        ]
      },
      {
        subtitle: "📧 Email Marketing",
        items: [
          "Séquence de bienvenue : Offrez un chapitre audio gratuit à l'inscription",
          "Newsletter mensuelle : Nouveaux titres, coulisses de la création",
          "Séquence de lancement : J-7, J-3, J-1, Jour J, J+3",
          "Relance panier abandonné si vente directe",
          "Séquence post-achat : Demande d'avis + upsell série"
        ]
      },
      {
        subtitle: "💰 Amazon Ads pour Audiobooks",
        items: [
          "Ciblez les auditeurs de livres similaires dans votre niche",
          "Budget : Commencez à 5€/jour, augmentez ce qui fonctionne",
          "Utilisez les mots-clés 'audiobook + [votre niche]'",
          "ACoS cible : <50% pour la rentabilité"
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Monétisation avancée",
    description: "Maximiser les revenus avec des stratégies pro",
    icon: BarChart3,
    color: "from-amber-500 to-yellow-500",
    content: [
      {
        subtitle: "💎 Stratégies avancées de monétisation",
        text: "Au-delà de la simple vente, plusieurs stratégies permettent de multiplier vos revenus avec le même contenu audio."
      },
      {
        subtitle: "📚 Multiplication des formats",
        items: [
          "Ebook → Audiobook → Livre broché → Version premium → Cours en ligne",
          "Chaque format touche un public différent et génère des revenus supplémentaires",
          "Un même contenu peut générer 3-5 flux de revenus différents",
          "Proposez des 'box sets' : série complète en audio à prix réduit"
        ]
      },
      {
        subtitle: "🎓 Transformer en formation audio",
        items: [
          "Ajoutez des exercices pratiques entre les chapitres",
          "Créez un workbook PDF complémentaire",
          "Vendez l'ensemble comme formation premium (97-297€)",
          "Utilisez des plateformes comme Teachable ou Podia",
          "Proposez un accès communautaire en bonus"
        ]
      },
      {
        subtitle: "🔄 Revenus récurrents",
        items: [
          "Patreon / MemberSpace : Abonnement mensuel pour accès à tous vos audiobooks",
          "Série en cours : 1 nouveau tome audio par mois = abonnés fidèles",
          "Programme d'affiliation : Offrez 30% aux affiliés qui recommandent vos audiobooks",
          "Licence entreprise : Vendez des accès groupés aux entreprises (formation interne)"
        ]
      }
    ]
  },
  {
    id: 11,
    title: "Aspects légaux et droits",
    description: "Copyright, contrats et protection de votre œuvre",
    icon: ShieldCheck,
    color: "from-slate-500 to-gray-600",
    content: [
      {
        subtitle: "⚖️ Droits et propriété intellectuelle",
        text: "Protéger vos droits est essentiel. Voici les points juridiques clés à connaître pour publier sereinement vos audiobooks."
      },
      {
        subtitle: "📜 Ce que vous devez savoir",
        items: [
          "Vous êtes propriétaire des droits audio si vous êtes l'auteur du texte",
          "Les voix IA d'ElevenLabs sont utilisables commercialement avec un abonnement",
          "L'ISBN audio est différent de l'ISBN ebook — obtenez-en un nouveau (gratuit via Bowker ou BnF)",
          "Déposez votre œuvre à la BnF ou via Copyright.gov pour preuve de paternité",
          "Les contrats d'exclusivité ACX durent 7 ans — réfléchissez bien avant de signer"
        ]
      },
      {
        subtitle: "💼 Statut fiscal",
        items: [
          "Auto-entrepreneur : Régime micro-BNC, abattement 34% sur les revenus",
          "Droits d'auteur : Déclaration en BNC ou traitements et salaires",
          "TVA : Exonéré sous le seuil de franchise (34 400€ pour les services)",
          "International : Les royalties Audible sont soumises à la retenue à la source US (30% sans W-8BEN)",
          "IMPORTANT : Remplissez le formulaire W-8BEN pour réduire la retenue à 0-10%"
        ]
      }
    ]
  },
  {
    id: 12,
    title: "Checklist de publication",
    description: "Liste complète avant de publier votre audiobook",
    icon: CheckCircle2,
    color: "from-green-600 to-emerald-600",
    content: [
      {
        subtitle: "✅ Avant la génération",
        items: [
          "□ Texte relu et corrigé (pas de fautes d'orthographe)",
          "□ Texte adapté pour l'audio (pas de références visuelles)",
          "□ Abréviations remplacées par les mots complets",
          "□ Noms propres et chiffres vérifiés",
          "□ Voix testée sur un chapitre de test"
        ]
      },
      {
        subtitle: "✅ Après la génération",
        items: [
          "□ Écoute complète du livre audio (pas de mots coupés ou mal prononcés)",
          "□ Transitions entre chapitres vérifiées",
          "□ Qualité audio constante du début à la fin",
          "□ Durée totale notée (minimum 3h pour ACX)",
          "□ Fichier sauvegardé en backup (Google Drive, Dropbox...)"
        ]
      },
      {
        subtitle: "✅ Avant la publication",
        items: [
          "□ Couverture carrée 2400x2400px préparée",
          "□ Description optimisée rédigée",
          "□ 7 mots-clés choisis",
          "□ 2 catégories BISAC sélectionnées",
          "□ ISBN audio obtenu (si nécessaire)",
          "□ Stratégie de prix définie",
          "□ Plan de lancement marketing prêt",
          "□ Page de vente directe créée (optionnel mais recommandé)"
        ]
      },
      {
        subtitle: "✅ Après la publication",
        items: [
          "□ Lien partagé sur les réseaux sociaux",
          "□ Email envoyé à votre liste",
          "□ Codes promo distribués pour les premières reviews",
          "□ Suivi des ventes activé",
          "□ Prochaine date de promotion planifiée"
        ]
      }
    ]
  }
];

const FormationAudiobookDistribution: React.FC = () => {
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  const toggleComplete = (moduleId: number) => {
    setCompletedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const progress = Math.round((completedModules.length / distributionModules.length) * 100);

  const exportFormationPDF = () => {
    const pdf = new jsPDF();
    let y = 20;

    pdf.setFontSize(22);
    pdf.setTextColor(128, 0, 255);
    pdf.text('Formation Complète', 105, y, { align: 'center' });
    y += 10;
    pdf.setFontSize(16);
    pdf.text('Exploiter & Distribuer vos Livres Audio', 105, y, { align: 'center' });
    y += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text('EbookStudio Pro — Guide complet de distribution audiobook', 105, y, { align: 'center' });
    y += 15;

    distributionModules.forEach((module) => {
      if (y > 260) { pdf.addPage(); y = 20; }
      
      pdf.setFontSize(14);
      pdf.setTextColor(80, 0, 180);
      pdf.text(`Module ${module.id} — ${module.title}`, 15, y);
      y += 7;
      pdf.setFontSize(9);
      pdf.setTextColor(120);
      pdf.text(module.description, 15, y);
      y += 8;

      module.content.forEach(section => {
        if (y > 260) { pdf.addPage(); y = 20; }
        pdf.setFontSize(11);
        pdf.setTextColor(60);
        pdf.text(section.subtitle, 15, y);
        y += 6;

        if (section.text) {
          pdf.setFontSize(9);
          pdf.setTextColor(80);
          const lines = pdf.splitTextToSize(section.text, 175);
          pdf.text(lines, 18, y);
          y += lines.length * 5 + 3;
        }

        if (section.items) {
          section.items.forEach(item => {
            if (y > 270) { pdf.addPage(); y = 20; }
            pdf.setFontSize(9);
            pdf.setTextColor(80);
            const lines = pdf.splitTextToSize(`• ${item}`, 170);
            pdf.text(lines, 20, y);
            y += lines.length * 5 + 1;
          });
          y += 3;
        }
      });
      y += 5;
    });

    pdf.save('Formation_Distribution_Audiobooks.pdf');
    toast.success('Formation exportée en PDF !');
  };

  return (
    <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-background to-indigo-500/5">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Headphones className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                Formation : Exploiter vos Livres Audio
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px]">
                  {distributionModules.length} Modules
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Guide complet pour publier, distribuer et monétiser vos audiobooks
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={exportFormationPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Télécharger PDF
          </Button>
        </div>

        {/* Barre de progression */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{completedModules.length}/{distributionModules.length} modules terminés</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <Accordion 
          type="multiple" 
          value={openModules} 
          onValueChange={setOpenModules}
          className="space-y-2"
        >
          {distributionModules.map((module) => {
            const Icon = module.icon;
            const isCompleted = completedModules.includes(module.id);
            return (
              <AccordionItem 
                key={module.id} 
                value={module.id.toString()} 
                className={`border rounded-xl px-4 transition-all ${isCompleted ? 'bg-green-500/5 border-green-500/30' : 'bg-card'}`}
              >
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center shrink-0`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Module {module.id} — {module.title}</span>
                        {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 pt-2">
                    {module.content.map((section, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-sm mb-2">{section.subtitle}</h4>
                        {section.text && (
                          <p className="text-sm text-muted-foreground mb-2">{section.text}</p>
                        )}
                        {section.items && (
                          <ul className="space-y-1.5">
                            {section.items.map((item, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                    <Button 
                      variant={isCompleted ? "secondary" : "outline"} 
                      size="sm" 
                      onClick={() => toggleComplete(module.id)} 
                      className="gap-2 mt-2"
                    >
                      <CheckCircle2 className={`h-4 w-4 ${isCompleted ? 'text-green-500' : ''}`} />
                      {isCompleted ? 'Terminé ✓' : 'Marquer comme terminé'}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {progress === 100 && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 text-center">
            <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="font-bold text-green-700 dark:text-green-400">🎉 Formation terminée !</p>
            <p className="text-sm text-muted-foreground mt-1">
              Vous maîtrisez maintenant la distribution d'audiobooks. Lancez votre premier titre !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormationAudiobookDistribution;
