import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Download, Copy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PromptsGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePrompts = async () => {
    setIsGenerating(true);
    
    // Simulation de génération des prompts
    const generatedPrompts = [
      // BUSINESS & ENTREPRENEURIAT (5 prompts)
      `🟣 Prompt 1 : Créer une feuille de route pour débutant entrepreneur
Demande : [Fournir un guide étape par étape pour les débutants contenant des idées de projets qui peuvent se transformer en entreprise]
Rôle : [Vous êtes un coach expérimenté en entrepreneuriat et consultant en innovation.]
Mission : [Créer une feuille de route stratégique avec 3 à 5 idées de projets innovants à potentiel entrepreneurial réel, adaptée au profil de l'utilisateur.]
Structure attendue :
• Évaluation initiale (compétences, intérêts, ressources)
• Génération d'idées via l'intersection technologie/problème/impact
• Évaluation (marché, barrière, alignement, budget, revenus)
• Détails par projet (MVP, calendrier, financement, jalons)
• Sections formatées : <roadmap> <entrepreneur_profile> <project_ideas> <detailed_project_breakdown> <recommended_next_steps>
Style : [Clair, accessible, pragmatique, avec exemples concrets]`,

      `🟣 Prompt 2 : Analyse de marché et positionnement concurrentiel
Demande : [Analyser un marché spécifique et définir un positionnement unique face à la concurrence]
Rôle : [Vous êtes un consultant en stratégie d'entreprise et expert en analyse de marché.]
Mission : [Fournir une analyse complète du marché avec recommandations de positionnement différenciant.]
Structure attendue :
• Analyse des segments de marché et opportunités
• Cartographie concurrentielle détaillée
• Identification des gaps et niches disponibles
• Stratégie de positionnement unique
• Plan d'action pour se démarquer
• Métriques de succès et KPIs à suivre
Style : [Analytique, factuel, orienté action stratégique]`,

      `🟣 Prompt 3 : Plan de financement startup
Demande : [Créer un plan de financement complet pour lever des fonds]
Rôle : [Vous êtes un expert en financement de startups et relations investisseurs.]
Mission : [Concevoir une stratégie de levée de fonds avec pitch deck et projections financières.]
Structure attendue :
• Évaluation des besoins de financement
• Identification des sources de financement adaptées
• Pitch deck professionnel (10-15 slides)
• Projections financières sur 3-5 ans
• Stratégie d'approche des investisseurs
• Négociation et termes de l'accord
Style : [Professionnel, convaincant, basé sur des données]`,

      `🟣 Prompt 4 : Automatisation de processus business
Demande : [Identifier et automatiser les processus répétitifs pour gagner en efficacité]
Rôle : [Vous êtes un consultant en optimisation des processus et automatisation.]
Mission : [Créer un plan d'automatisation personnalisé pour optimiser les opérations.]
Structure attendue :
• Audit des processus actuels et identification des goulots
• Cartographie des tâches automatisables
• Sélection d'outils et technologies adaptés
• Plan de mise en œuvre par priorité
• Formation et accompagnement au changement
• ROI et mesure de l'impact
Style : [Technique, pratique, orienté résultats mesurables]`,

      `🟣 Prompt 5 : Stratégie de croissance et scaling
Demande : [Développer une stratégie pour faire passer son business à l'échelle supérieure]
Rôle : [Vous êtes un expert en croissance d'entreprise et scaling de business models.]
Mission : [Concevoir un plan de croissance structuré avec étapes et ressources nécessaires.]
Structure attendue :
• Diagnostic de la situation actuelle et potentiel
• Identification des leviers de croissance prioritaires
• Stratégie de scaling (équipe, processus, tech)
• Plan de développement commercial et marketing
• Gestion des ressources et financement de la croissance
• Métriques de performance et tableaux de bord
Style : [Stratégique, ambitieux, réaliste et actionnable]`,

      // COPYWRITING & MARKETING (5 prompts)
      `🔵 Prompt 6 : Page de vente haute conversion
Demande : [Créer une page de vente percutante qui convertit les visiteurs en clients]
Rôle : [Vous êtes un copywriter expert spécialisé dans les pages de vente haute conversion.]
Mission : [Rédiger une page de vente complète utilisant les techniques de persuasion les plus efficaces.]
Structure attendue :
• Titre accrocheur avec promesse claire
• Identification du problème et empathie
• Présentation de la solution unique
• Preuves sociales et témoignages
• Offre irrésistible avec urgence/rareté
• FAQ pour lever les objections
• Call-to-action puissant
Style : [Persuasif, émotionnel, orienté bénéfices clients]`,

      `🔵 Prompt 7 : Campagne email marketing séquentielle
Demande : [Créer une séquence d'emails automatisée pour nurturing et conversion]
Rôle : [Vous êtes un expert en email marketing et automation.]
Mission : [Concevoir une séquence d'emails engageante qui guide le prospect vers l'achat.]
Structure attendue :
• Email de bienvenue et présentation de valeur
• Séquence éducative (3-5 emails de contenu)
• Emails de social proof et témoignages
• Offre commerciale progressive
• Emails de relance et urgence
• Suivi post-achat et fidélisation
Style : [Conversationnel, utile, progressivement commercial]`,

      `🔵 Prompt 8 : Stratégie de contenu viral sur réseaux sociaux
Demande : [Créer du contenu engageant qui génère du reach organique massif]
Rôle : [Vous êtes un expert en marketing digital et viralité sur les réseaux sociaux.]
Mission : [Développer une stratégie de contenu viral adaptée à chaque plateforme.]
Structure attendue :
• Analyse des tendances et algorithmes par plateforme
• Types de contenu à fort potentiel viral
• Calendrier éditorial optimisé
• Techniques d'engagement et interaction
• Stratégie de hashtags et timing
• Mesure des performances et ajustements
Style : [Créatif, tendance, orienté engagement maximal]`,

      `🔵 Prompt 9 : Funnel de vente complet multicanal
Demande : [Concevoir un funnel de vente intégré sur plusieurs canaux de communication]
Rôle : [Vous êtes un architecte de funnels de vente et expert en customer journey.]
Mission : [Créer un parcours client optimisé de la découverte à la fidélisation.]
Structure attendue :
• Mapping du customer journey complet
• Points de contact et canaux à chaque étape
• Contenus et messages adaptés par phase
• Outils et technologies nécessaires
• Métriques de conversion par étape
• Optimisation continue et A/B testing
Style : [Structuré, data-driven, centré client]`,

      `🔵 Prompt 10 : Personal branding et influence digitale
Demande : [Construire une marque personnelle forte qui génère autorité et opportunités]
Rôle : [Vous êtes un expert en personal branding et influence digitale.]
Mission : [Développer une stratégie complète de personal branding sur le digital.]
Structure attendue :
• Définition de l'identité et positionnement unique
• Stratégie de contenu et ligne éditoriale
• Optimisation des profils et présence en ligne
• Networking et partenariats stratégiques
• Monétisation de l'influence
• Protection et gestion de la réputation
Style : [Authentique, professionnel, orienté autorité]`,

      // VOYAGE & AVENTURE (5 prompts)
      `🟡 Prompt 11 : Itinéraire de voyage personnalisé optimisé
Demande : [Concevoir un itinéraire de voyage sur mesure avec budget et préférences]
Rôle : [Vous êtes un agent de voyage expert et planificateur d'expériences uniques.]
Mission : [Créer un plan de voyage détaillé et personnalisé incluant logistique, budget et expériences authentiques.]
Structure attendue :
• Analyse des préférences et contraintes
• Itinéraire jour par jour optimisé
• Réservations prioritaires et alternatives
• Budget détaillé par catégorie
• Conseils locaux et expériences cachées
• Kit de voyage (documents, apps, contacts)
Style : [Inspirant, pratique, riche en détails locaux]`,

      `🟡 Prompt 12 : Guide de voyage digital nomad
Demande : [Créer un guide complet pour travailler tout en voyageant]
Rôle : [Vous êtes un digital nomad expérimenté et consultant en remote work.]
Mission : [Fournir un guide pratique pour réussir sa transition vers le nomadisme digital.]
Structure attendue :
• Préparation et planification de la transition
• Destinations nomad-friendly et coworking spaces
• Outils et équipements indispensables
• Gestion des aspects légaux et fiscaux
• Maintien de la productivité en voyage
• Communauté et networking nomade
Style : [Pratique, basé sur l'expérience, actionnable]`,

      `🟡 Prompt 13 : Voyage d'aventure et activités extrêmes
Demande : [Planifier un voyage d'aventure avec activités outdoor et sensations fortes]
Rôle : [Vous êtes un guide d'aventure professionnel et expert en tourisme d'aventure.]
Mission : [Concevoir un séjour d'aventure sécurisé avec activités adaptées au niveau.]
Structure attendue :
• Évaluation du niveau et préparation physique
• Sélection d'activités et destinations adaptées
• Équipement et matériel nécessaire
• Mesures de sécurité et assurances
• Guides locaux et prestataires fiables
• Plan B et gestion des imprévus
Style : [Sécuritaire, passionnant, détaillé sur les risques]`,

      `🟡 Prompt 14 : Voyage culinaire et découvertes gastronomiques
Demande : [Organiser un voyage centré sur la gastronomie locale et les expériences culinaires]
Rôle : [Vous êtes un critique gastronomique et organisateur de voyages culinaires.]
Mission : [Créer un parcours gastronomique authentique avec expériences culinaires uniques.]
Structure attendue :
• Recherche des spécialités et traditions locales
• Sélection de restaurants et expériences authentiques
• Cours de cuisine et rencontres avec chefs
• Marchés locaux et producteurs
• Dégustation de vins et spiritueux régionaux
• Carnet de voyage gastronomique
Style : [Gourmand, culturel, respectueux des traditions]`,

      `🟡 Prompt 15 : Road trip parfait avec van aménagé
Demande : [Planifier un road trip en van avec itinéraire et équipements optimaux]
Rôle : [Vous êtes un expert en van life et road trips longue durée.]
Mission : [Concevoir un road trip complet avec préparation du véhicule et itinéraire adapté.]
Structure attendue :
• Choix et aménagement du véhicule
• Itinéraire optimisé avec étapes clés
• Spots de stationnement et aires de service
• Équipements et provisions nécessaires
• Gestion de l'autonomie (eau, électricité)
• Réglementation et autorisations par pays
Style : [Aventurier, pratique, sécuritaire]`,

      // DÉVELOPPEMENT PERSONNEL (5 prompts)
      `🟢 Prompt 16 : Programme de développement personnel 30 jours
Demande : [Créer un programme de transformation personnelle avec actions quotidiennes]
Rôle : [Vous êtes un coach de vie certifié et expert en psychologie positive.]
Mission : [Concevoir un programme de 30 jours avec exercices pratiques pour atteindre un objectif de développement personnel.]
Structure attendue :
• Évaluation initiale et fixation d'objectifs SMART
• Plan hebdomadaire avec thèmes progressifs
• Exercices quotidiens (réflexion, action, mesure)
• Outils de suivi et d'évaluation
• Stratégies de motivation et résilience
• Plan de maintien post-programme
Style : [Bienveillant, motivant, scientifiquement fondé]`,

      `🟢 Prompt 17 : Gestion du stress et bien-être mental
Demande : [Développer des stratégies efficaces pour gérer le stress et améliorer le bien-être]
Rôle : [Vous êtes un psychologue spécialisé en gestion du stress et bien-être mental.]
Mission : [Créer un programme personnalisé de gestion du stress avec techniques éprouvées.]
Structure attendue :
• Diagnostic des sources de stress personnelles
• Techniques de relaxation et méditation
• Restructuration cognitive et pensée positive
• Gestion du temps et des priorités
• Activités physiques et hygiène de vie
• Suivi et ajustements du programme
Style : [Empathique, scientifique, rassurant]`,

      `🟢 Prompt 18 : Développement de la confiance en soi
Demande : [Construire une confiance en soi solide et durable dans tous les domaines]
Rôle : [Vous êtes un coach en développement personnel spécialisé en confiance et estime de soi.]
Mission : [Élaborer un plan d'action pour développer une confiance authentique et stable.]
Structure attendue :
• Évaluation du niveau de confiance actuel
• Identification des croyances limitantes
• Exercices de renforcement positif quotidiens
• Techniques de sortie de zone de confort
• Célébration des succès et apprentissage des échecs
• Maintien de la confiance à long terme
Style : [Encourageant, progressif, basé sur l'action]`,

      `🟢 Prompt 19 : Amélioration des relations interpersonnelles
Demande : [Développer des compétences relationnelles pour des relations plus épanouissantes]
Rôle : [Vous êtes un thérapeute relationnel et expert en communication interpersonnelle.]
Mission : [Créer un guide pratique pour améliorer la qualité de toutes ses relations.]
Structure attendue :
• Diagnostic des patterns relationnels actuels
• Techniques de communication efficace
• Gestion des conflits et résolution de problèmes
• Développement de l'empathie et écoute active
• Établissement de limites saines
• Renforcement des liens existants et nouveaux
Style : [Humain, pratique, centré sur l'empathie]`,

      `🟢 Prompt 20 : Création d'habitudes positives durables
Demande : [Installer des habitudes positives qui transforment durablement le quotidien]
Rôle : [Vous êtes un expert en sciences comportementales et formation d'habitudes.]
Mission : [Concevoir un système personnalisé pour créer et maintenir des habitudes positives.]
Structure attendue :
• Sélection des habitudes les plus impactantes
• Méthode de mise en place progressive (habit stacking)
• Système de récompenses et motivation
• Gestion des obstacles et rechutes
• Tracking et mesure des progrès
• Évolution et ajustement du système
Style : [Scientifique, motivant, orienté résultats durables]`,

      // AQUARIOPHILIE (10 prompts)
      `🐠 Prompt 21 : Démarrer un aquarium tropical pour débutants
Demande : [Créer un guide complet pour réussir son premier aquarium tropical]
Rôle : [Vous êtes un aquariophile expert avec 20 ans d'expérience et formateur en aquariophilie.]
Mission : [Concevoir un guide pas à pas pour débuter en aquariophilie sans erreurs courantes.]
Structure attendue :
• Choix de l'aquarium et équipements essentiels
• Cycle de l'azote et maturation du bac
• Sélection des premiers poissons compatibles
• Paramètres de l'eau et maintenance quotidienne
• Alimentation équilibrée et calendrier
• Résolution des problèmes fréquents
Style : [Pédagogique, rassurant, basé sur l'expérience]`,

      `🐠 Prompt 22 : Aquascaping et création de paysages aquatiques
Demande : [Concevoir des layouts d'aquascaping esthétiques et naturels]
Rôle : [Vous êtes un aquascaper professionnel et designer d'écosystèmes aquatiques.]
Mission : [Créer des guides de design pour réaliser des aquariums paysagers spectaculaires.]
Structure attendue :
• Principes de composition et règle des tiers
• Sélection des roches, racines et substrats
• Plantation et techniques de croissance
• Éclairage adapté et périodes d'éclairage
• Maintenance de l'équilibre esthétique
• Évolution du paysage dans le temps
Style : [Artistique, technique, inspirant]`,

      `🐠 Prompt 23 : Reproduction et élevage de poissons tropicaux
Demande : [Réussir la reproduction et l'élevage d'espèces tropicaux populaires]
Rôle : [Vous êtes un éleveur professionnel spécialisé en reproduction de poissons d'aquarium.]
Mission : [Développer des protocoles de reproduction pour différentes espèces avec taux de réussite optimaux.]
Structure attendue :
• Sélection des reproducteurs et conditionnement
• Paramètres de l'eau pour déclencher la ponte
• Aménagement du bac de reproduction
• Soins aux œufs et développement des alevins
• Alimentation spécifique par stade de croissance
• Prévention des maladies et mortalité
Style : [Scientifique, détaillé, orienté résultats]`,

      `🐠 Prompt 24 : Aquarium récifal et coraux pour débutants
Demande : [Créer et maintenir un récif corallien artificiel en aquarium marin]
Rôle : [Vous êtes un spécialiste en aquariophilie marine et culture de coraux.]
Mission : [Élaborer un plan complet pour débuter en récifal avec succès.]
Structure attendue :
• Équipement spécifique eau de mer (écumeur, pompes)
• Préparation de l'eau de mer et salinité
• Introduction progressive des coraux
• Éclairage LED spécialisé et programmation
• Supplémentation en calcium et magnésium
• Maintenance et tests réguliers
Style : [Précis, technique, progressif]`,

      `🐠 Prompt 25 : Traitement des maladies et parasites aquatiques
Demande : [Diagnostiquer et traiter efficacement les maladies courantes des poissons]
Rôle : [Vous êtes un vétérinaire spécialisé en pathologies aquatiques.]
Mission : [Créer un guide de diagnostic et traitement des principales maladies.]
Structure attendue :
• Reconnaissance des symptômes par pathologie
• Diagnostic différentiel et examens complémentaires
• Traitements spécifiques et posologies
• Quarantaine et prévention de la propagation
• Désinfection et remise en route du bac
• Prévention et renforcement immunitaire
Style : [Médical, précis, orienté guérison]`,

      `🐠 Prompt 26 : Système de filtration avancée et biologie aquatique
Demande : [Optimiser la filtration pour maintenir un écosystème aquatique stable]
Rôle : [Vous êtes un ingénieur en systèmes aquatiques et biochimiste.]
Mission : [Concevoir des systèmes de filtration performants adaptés à chaque type d'aquarium.]
Structure attendue :
• Types de filtration (mécanique, biologique, chimique)
• Dimensionnement selon volume et population
• Bactéries nitrifiantes et cycles biologiques
• Maintenance préventive et nettoyage optimal
• Ajout de probiotiques et suppléments biologiques
• Surveillance des paramètres et ajustements
Style : [Technique, scientifique, orienté performance]`,

      `🐠 Prompt 27 : Aquarium amazonien biotope naturel
Demande : [Recréer fidèlement un biotope amazonien avec espèces endémiques]
Rôle : [Vous êtes un ichtyologue spécialisé dans les écosystèmes amazoniens.]
Mission : [Développer un biotope authentique avec espèces, plantes et paramètres naturels.]
Structure attendue :
• Recherche géographique et conditions naturelles
• Sélection d'espèces compatibles du même biotope
• Reproduction des paramètres physico-chimiques
• Plantation avec espèces végétales endémiques
• Simulation des variations saisonnières
• Comportements naturels et interactions
Style : [Scientifique, authentique, respectueux de la nature]`,

      `🐠 Prompt 28 : Aquarium automatisé et domotique aquatique
Demande : [Automatiser la maintenance d'aquarium avec la technologie moderne]
Rôle : [Vous êtes un ingénieur en domotique spécialisé dans l'automatisation aquatique.]
Mission : [Créer un système d'automatisation complète pour optimiser la maintenance.]
Structure attendue :
• Capteurs de paramètres et monitoring en temps réel
• Automatisation de l'éclairage et cycles circadiens
• Distribution automatique de nourriture programmable
• Changements d'eau automatiques et osmoseur
• Alertes et notifications sur smartphone
• Interface de contrôle et historiques
Style : [Technologique, innovant, orienté facilité]`,

      `🐠 Prompt 29 : Aquarium thérapeutique et bien-être
Demande : [Utiliser l'aquariophilie comme outil de relaxation et thérapie]
Rôle : [Vous êtes un thérapeute spécialisé en zoothérapie et aquariophilie thérapeutique.]
Mission : [Concevoir des aquariums optimisés pour les bienfaits psychologiques et le bien-être.]
Structure attendue :
• Choix d'espèces apaisantes et comportements relaxants
• Design et éclairage pour ambiance zen
• Intégration dans l'espace de vie ou médical
• Protocoles d'interaction et observation
• Bénéfices mesurables sur stress et anxiété
• Adaptation selon pathologies ou besoins spécifiques
Style : [Thérapeutique, bienveillant, scientifiquement prouvé]`,

      `🐠 Prompt 30 : Business plan élevage aquariophile rentable
Demande : [Créer une activité rentable d'élevage et vente de poissons tropicaux]
Rôle : [Vous êtes un entrepreneur aquariophile et consultant en business aquatique.]
Mission : [Développer un modèle économique viable pour monétiser l'aquariophilie.]
Structure attendue :
• Analyse de marché et niches rentables
• Sélection d'espèces à fort potentiel commercial
• Infrastructure et investissements nécessaires
• Stratégie de reproduction et planning de production
• Circuits de distribution (animaleries, particuliers, export)
• Gestion financière et optimisation des coûts
Style : [Business, pragmatique, orienté rentabilité]`
    ];

    // Simuler un délai de génération
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPrompts(generatedPrompts);
    setIsGenerating(false);
    toast.success("30 prompts professionnels générés avec succès !");
  };

  const copyPrompt = async (prompt: string, index: number) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedIndex(index);
      toast.success("Prompt copié dans le presse-papiers !");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast.error("Erreur lors de la copie");
    }
  };

  const downloadAllPrompts = () => {
    const content = prompts.join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pack-20-prompts-professionnels.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Pack de prompts téléchargé !");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={() => navigate('/ebook-ideas')} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux idées
        </Button>
        <Target className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">🎯 Générateur de Prompts Professionnels</h1>
      </div>

      <div className="text-center mb-8">
        <p className="text-lg text-muted-foreground">
          Générez un pack de 30 prompts IA professionnels, formatés et prêts à vendre
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Regroupés en catégories : Business, Copywriting, Voyage, Développement personnel, Aquariophilie...
        </p>
      </div>

      {prompts.length === 0 ? (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Prêt à générer vos prompts ?</h3>
            <div className="bg-white/50 p-6 rounded-lg mb-6 text-left max-w-2xl mx-auto">
              <h4 className="font-semibold mb-3">✨ Votre pack contiendra :</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 🟣 5 prompts Business & Entrepreneuriat</li>
                <li>• 🔵 5 prompts Copywriting & Marketing</li>
                <li>• 🟡 5 prompts Voyage & Aventure</li>
                <li>• 🟢 5 prompts Développement Personnel</li>
                <li>• 🐠 10 prompts Aquariophilie</li>
              </ul>
              <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                <p className="text-sm font-medium">Format professionnel avec :</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Titre coloré • Demande • Rôle • Mission • Structure • Style
                </p>
              </div>
            </div>
            <Button 
              onClick={generatePrompts}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Target className="h-5 w-5 mr-2" />
                  Générer mes 30 prompts
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Vos 30 Prompts Professionnels</h2>
            <Button onClick={downloadAllPrompts} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Télécharger tout
            </Button>
          </div>

          <div className="grid gap-4">
            {prompts.map((prompt, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {prompt.split('\n')[0]}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPrompt(prompt, index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg overflow-x-auto">
                    {prompt}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => {
                setPrompts([]);
                generatePrompts();
              }}
              variant="outline"
              size="lg"
            >
              <Target className="h-5 w-5 mr-2" />
              Générer un nouveau pack
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptsGeneratorPage;