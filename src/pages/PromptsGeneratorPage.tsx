import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, Download, Copy, CheckCircle, Wand2, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';

const PromptsGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomGeneration, setShowCustomGeneration] = useState(false);
  
  const { apiKey, model, hasValidApiKey, getConfig } = useOpenAIConfig();

  const categories = [
    { id: 'all', name: 'Tous', emoji: '🌟' },
    { id: 'business', name: 'Business', emoji: '🟣' },
    { id: 'marketing', name: 'Marketing', emoji: '🔵' },
    { id: 'voyage', name: 'Voyage', emoji: '🟡' },
    { id: 'personnel', name: 'Personnel', emoji: '🟢' },
    { id: 'aquariophilie', name: 'Aquariophilie', emoji: '🐠' }
  ];

  const generateCustomPrompts = async () => {
    if (!hasValidApiKey() || !customTopic.trim()) {
      toast.error("Veuillez configurer votre clé API OpenAI et saisir un sujet");
      return;
    }

    setIsGenerating(true);
    
    try {
      const config = getConfig();
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: `Tu es un expert en création de prompts professionnels. Tu dois créer 10 prompts détaillés et professionnels sur le sujet demandé. Chaque prompt doit suivre cette structure exacte :

🎯 Prompt [numéro] : [Titre accrocheur]
Demande : [Description claire de ce qui est demandé]
Rôle : [Tu es un expert en...]
Mission : [Objectif précis à accomplir]
Structure attendue :
• Point 1
• Point 2
• Point 3
• Point 4
• Point 5
• Point 6
Style : [Ton et approche à adopter]

Les prompts doivent être variés, couvrir différents aspects du sujet, et être immédiatement utilisables.`
            },
            {
              role: 'user',
              content: `Crée 10 prompts professionnels détaillés sur le sujet : "${customTopic}"`
            }
          ],
          temperature: 0.8,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      const generatedContent = data.choices[0].message.content;
      
      // Séparer les prompts générés
      const generatedPrompts = generatedContent.split(/🎯 Prompt \d+/).filter(p => p.trim()).map((prompt, index) => `🎯 Prompt ${index + 1}${prompt.trim()}`);
      
      setPrompts(generatedPrompts);
      toast.success(`${generatedPrompts.length} prompts personnalisés générés !`);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error("Erreur lors de la génération des prompts");
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePrompts = async () => {
    setIsGenerating(true);
    
    const generatedPrompts = [
      // BUSINESS (5 prompts)
      `🟣 Prompt 1 : Stratégie de croissance pour PME
Demande : [Développer une stratégie de croissance complète pour une PME en phase d'expansion]
Rôle : [Vous êtes un consultant en stratégie d'entreprise avec 15 ans d'expérience.]
Mission : [Concevoir un plan de croissance sur 3 ans avec objectifs chiffrés et étapes concrètes.]
Structure attendue :
• Analyse de la position concurrentielle actuelle
• Identification des opportunités de marché
• Plan d'investissement et ressources nécessaires
• Stratégie marketing et commerciale
• Indicateurs de performance et suivi
• Gestion des risques et plan de contingence
Style : [Professionnel, orienté résultats, basé sur des données]`,

      `🟣 Prompt 2 : Optimisation des processus internes
Demande : [Améliorer l'efficacité opérationnelle et réduire les coûts de 20%]
Rôle : [Vous êtes un expert en lean management et optimisation des processus.]
Mission : [Identifier les goulots d'étranglement et proposer des solutions d'amélioration continue.]
Structure attendue :
• Cartographie des processus actuels
• Identification des inefficacités et gaspillages
• Solutions d'automatisation et digitalisation
• Plan de formation des équipes
• Métriques de performance et ROI
• Calendrier de mise en œuvre
Style : [Analytique, pragmatique, orienté amélioration continue]`,

      `🟣 Prompt 3 : Transformation digitale d'entreprise
Demande : [Accompagner une entreprise traditionnelle dans sa transformation numérique]
Rôle : [Vous êtes un consultant en transformation digitale et innovation.]
Mission : [Élaborer une roadmap de digitalisation adaptée aux enjeux et ressources de l'entreprise.]
Structure attendue :
• Audit digital et maturité technologique
• Définition de la vision et objectifs digitaux
• Sélection des outils et technologies
• Plan de conduite du changement
• Formation et accompagnement des équipes
• Mesure de l'impact et ajustements
Style : [Innovant, pédagogique, centré sur l'humain]`,

      `🟣 Prompt 4 : Gestion de crise et continuité d'activité
Demande : [Préparer l'entreprise à gérer efficacement les crises et maintenir son activité]
Rôle : [Vous êtes un expert en gestion de crise et continuité d'activité.]
Mission : [Développer un plan de continuité robuste et des procédures de gestion de crise.]
Structure attendue :
• Analyse des risques et scénarios de crise
• Plan de continuité d'activité (PCA)
• Procédures d'urgence et communication de crise
• Organisation de la cellule de crise
• Tests et simulations régulières
• Retour d'expérience et amélioration continue
Style : [Rigoureux, anticipatif, orienté résilience]`,

      `🟣 Prompt 5 : Développement du leadership et management
Demande : [Former les managers à développer leur leadership et motiver leurs équipes]
Rôle : [Vous êtes un coach en leadership et développement managérial.]
Mission : [Créer un programme de développement du leadership adapté aux enjeux actuels.]
Structure attendue :
• Évaluation des compétences managériales actuelles
• Modules de formation au leadership situationnel
• Techniques de motivation et engagement des équipes
• Communication efficace et feedback constructif
• Gestion des conflits et médiation
• Plan de développement personnel et suivi
Style : [Inspirant, pratique, basé sur l'expérience]`,

      // MARKETING (5 prompts)
      `🔵 Prompt 6 : Stratégie de contenu et storytelling de marque
Demande : [Développer une stratégie de contenu qui raconte l'histoire de la marque et engage l'audience]
Rôle : [Vous êtes un expert en marketing de contenu et storytelling.]
Mission : [Créer une stratégie narrative cohérente sur tous les canaux de communication.]
Structure attendue :
• Définition de l'identité et des valeurs de marque
• Création du storytelling principal et déclinaisons
• Calendrier éditorial multi-canaux
• Formats de contenu adaptés à chaque plateforme
• Métriques d'engagement et performance
• Optimisation continue basée sur les données
Style : [Créatif, authentique, orienté engagement]`,

      `🔵 Prompt 7 : Marketing d'influence et partenariats stratégiques
Demande : [Développer une stratégie d'influence marketing pour augmenter la notoriété de 50%]
Rôle : [Vous êtes un spécialiste en marketing d'influence et partenariats.]
Mission : [Identifier et collaborer avec les bons influenceurs pour maximiser l'impact.]
Structure attendue :
• Mapping des influenceurs pertinents par segment
• Critères de sélection et grille d'évaluation
• Stratégie de collaboration et types de partenariats
• Négociation et contractualisation
• Suivi des performances et ROI
• Développement de relations long terme
Style : [Relationnel, stratégique, orienté performance]`,

      `🔵 Prompt 8 : Marketing automation et nurturing leads
Demande : [Automatiser le parcours client pour convertir 30% de leads supplémentaires]
Rôle : [Vous êtes un expert en marketing automation et CRM.]
Mission : [Concevoir des workflows automatisés pour optimiser la conversion.]
Structure attendue :
• Mapping du parcours client et points de contact
• Segmentation avancée et personas détaillés
• Création de workflows de nurturing personnalisés
• Contenus adaptés à chaque étape du funnel
• Scoring des leads et déclencheurs automatiques
• Analyse des performances et optimisation
Style : [Technique, orienté données, centré sur la conversion]`,

      `🔵 Prompt 9 : Stratégie omnicanale et expérience client
Demande : [Créer une expérience client fluide et cohérente sur tous les points de contact]
Rôle : [Vous êtes un expert en expérience client et stratégie omnicanale.]
Mission : [Harmoniser tous les canaux pour offrir une expérience client exceptionnelle.]
Structure attendue :
• Cartographie de l'expérience client actuelle
• Identification des points de friction et opportunités
• Stratégie d'intégration des canaux online/offline
• Personnalisation de l'expérience par segment
• Outils de mesure de satisfaction et NPS
• Plan d'amélioration continue de l'expérience
Style : [Centré client, holistique, orienté satisfaction]`,

      `🔵 Prompt 10 : Growth hacking et croissance virale
Demande : [Implémenter des techniques de growth hacking pour une croissance exponentielle]
Rôle : [Vous êtes un growth hacker expérimenté et expert en croissance virale.]
Mission : [Identifier et exploiter les leviers de croissance les plus efficaces.]
Structure attendue :
• Analyse des métriques AARRR (Acquisition, Activation, Rétention, Referral, Revenue)
• Identification des quick wins et expérimentations
• Mécaniques de viralité et programmes de parrainage
• Optimisation du funnel de conversion
• Tests A/B et itérations rapides
• Scaling des tactiques qui fonctionnent
Style : [Expérimental, data-driven, orienté croissance rapide]`,

      // VOYAGE (5 prompts)
      `🟡 Prompt 11 : Planification de voyage sur mesure et budget optimisé
Demande : [Organiser un voyage personnalisé en optimisant le budget et les expériences]
Rôle : [Vous êtes un travel planner expert avec 10 ans d'expérience mondiale.]
Mission : [Créer un itinéraire détaillé qui maximise les expériences tout en respectant le budget.]
Structure attendue :
• Analyse des préférences et contraintes du voyageur
• Recherche et sélection des destinations optimales
• Planification détaillée jour par jour
• Optimisation des coûts (transport, hébergement, activités)
• Conseils pratiques et préparatifs
• Plan B et alternatives en cas d'imprévus
Style : [Personnalisé, pratique, orienté expérience]`,

      `🟡 Prompt 12 : Guide de voyage responsable et écotourisme
Demande : [Voyager de manière responsable en minimisant l'impact environnemental]
Rôle : [Vous êtes un expert en tourisme durable et écotourisme.]
Mission : [Concevoir des voyages qui respectent l'environnement et les communautés locales.]
Structure attendue :
• Sélection de destinations et prestataires éco-responsables
• Moyens de transport à faible empreinte carbone
• Hébergements durables et certifiés
• Activités respectueuses de l'environnement
• Interaction positive avec les communautés locales
• Compensation carbone et actions concrètes
Style : [Conscient, respectueux, orienté impact positif]`,

      `🟡 Prompt 13 : Voyage d'affaires efficace et networking
Demande : [Optimiser les déplacements professionnels pour maximiser les opportunités business]
Rôle : [Vous êtes un consultant en voyages d'affaires et networking professionnel.]
Mission : [Transformer chaque voyage d'affaires en opportunité de développement business.]
Structure attendue :
• Planification stratégique des déplacements
• Optimisation du temps et des rencontres
• Techniques de networking efficace
• Gestion du jet lag et maintien de la performance
• Outils digitaux pour rester productif
• Suivi et capitalisation sur les contacts
Style : [Professionnel, efficace, orienté ROI]`,

      `🟡 Prompt 14 : Voyage solo sécurisé et enrichissant
Demande : [Partir seul en voyage en toute sécurité tout en vivant des expériences authentiques]
Rôle : [Vous êtes un expert en voyage solo et sécurité des voyageurs.]
Mission : [Préparer un voyage solo mémorable en minimisant les risques.]
Structure attendue :
• Évaluation des risques par destination
• Préparation sécuritaire et documents essentiels
• Stratégies pour rencontrer des locaux et autres voyageurs
• Gestion de la solitude et du mal du pays
• Applications et outils de sécurité
• Développement personnel à travers le voyage
Style : [Sécuritaire, encourageant, orienté découverte de soi]`,

      `🟡 Prompt 15 : Voyage culinaire et découverte gastronomique
Demande : [Explorer une destination à travers sa gastronomie et ses traditions culinaires]
Rôle : [Vous êtes un expert en tourisme culinaire et critique gastronomique.]
Mission : [Créer un parcours gastronomique authentique qui révèle l'âme d'une destination.]
Structure attendue :
• Recherche des spécialités locales et restaurants authentiques
• Expériences culinaires immersives (cours de cuisine, marchés)
• Rencontres avec des producteurs et artisans locaux
• Dégustation de vins et accords mets-vins
• Documentation et partage de l'expérience
• Reproduction des recettes à la maison
Style : [Gourmand, authentique, orienté découverte culturelle]`,

      // PERSONNEL (5 prompts)
      `🟢 Prompt 16 : Développement personnel et confiance en soi
Demande : [Renforcer l'estime de soi et développer une confiance durable]
Rôle : [Vous êtes un coach en développement personnel certifié.]
Mission : [Accompagner la transformation personnelle vers plus de confiance et d'épanouissement.]
Structure attendue :
• Évaluation de l'estime de soi et identification des blocages
• Techniques de reprogrammation mentale positive
• Exercices pratiques de sortie de zone de confort
• Développement de l'assertivité et communication
• Gestion des émotions et du stress
• Plan d'action personnalisé et suivi des progrès
Style : [Bienveillant, motivant, orienté transformation]`,

      `🟢 Prompt 17 : Gestion du temps et productivité personnelle
Demande : [Optimiser son organisation personnelle pour gagner 2h par jour]
Rôle : [Vous êtes un expert en productivité et gestion du temps.]
Mission : [Développer un système d'organisation personnel efficace et durable.]
Structure attendue :
• Audit de l'utilisation actuelle du temps
• Identification des priorités et objectifs personnels
• Méthodes de planification et outils adaptés
• Techniques de concentration et élimination des distractions
• Automatisation des tâches récurrentes
• Équilibre vie professionnelle/personnelle
Style : [Pragmatique, systémique, orienté efficacité]`,

      `🟢 Prompt 18 : Reconversion professionnelle réussie
Demande : [Changer de carrière en sécurisant la transition et maximisant les chances de succès]
Rôle : [Vous êtes un conseiller en évolution professionnelle et coach de carrière.]
Mission : [Accompagner une reconversion professionnelle stratégique et épanouissante.]
Structure attendue :
• Bilan de compétences et identification des motivations
• Exploration des métiers et secteurs d'avenir
• Plan de formation et développement des compétences
• Stratégie de transition financière et temporelle
• Réseau professionnel et recherche d'opportunités
• Préparation mentale et gestion du changement
Style : [Stratégique, rassurant, orienté réussite]`,

      `🟢 Prompt 19 : Relations interpersonnelles et communication
Demande : [Améliorer ses relations personnelles et professionnelles]
Rôle : [Vous êtes un thérapeute spécialisé en relations humaines et communication.]
Mission : [Développer des compétences relationnelles pour des interactions plus harmonieuses.]
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

    // Attendre 2 secondes pour simuler la génération
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPrompts(generatedPrompts);
    setIsGenerating(false);
    toast.success("30 prompts professionnels générés !");
  };

  const exportAllPrompts = () => {
    const content = prompts.join('\n\n' + '='.repeat(50) + '\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompts-${selectedCategory}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Prompts exportés avec succès !');
  };

  const copyPrompt = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast.success('Prompt copié !');
    } catch (err) {
      toast.error('Erreur lors de la copie');
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory === 'all') return matchesSearch;
    
    const categoryEmojis = {
      business: '🟣',
      marketing: '🔵', 
      voyage: '🟡',
      personnel: '🟢',
      aquariophilie: '🐠'
    };
    
    return matchesSearch && prompt.includes(categoryEmojis[selectedCategory as keyof typeof categoryEmojis]);
  });

  const downloadAllPrompts = () => {
    const content = prompts.join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prompts-professionnels.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Prompts téléchargés avec succès !");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Dashboard
          </Button>
        </div>

        {/* Titre et description */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-primary">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Générateur de Prompts Pro
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez 30 prompts professionnels ou générez des prompts personnalisés avec l'IA
          </p>
        </div>

        {/* Configuration OpenAI pour génération personnalisée */}
        {showCustomGeneration && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                Génération Personnalisée avec IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OpenAIConfigPanel />
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sujet pour vos prompts personnalisés</label>
                  <Input
                    placeholder="Ex: Marketing digital, Photographie, Cuisine végétarienne..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={generateCustomPrompts}
                  disabled={isGenerating || !hasValidApiKey() || !customTopic.trim()}
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Génération IA en cours...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Générer des Prompts Personnalisés
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {prompts.length === 0 ? (
          // Vue génération
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Prompts Prédéfinis */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Prompts Professionnels Prêts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-6">
                      30 prompts professionnels organisés par catégories
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {categories.slice(1).map(category => (
                        <div key={category.id} className="p-3 bg-card/50 rounded-lg border">
                          <div className="text-xl mb-1">{category.emoji}</div>
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.id === 'aquariophilie' ? '10 prompts' : '5 prompts'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={generatePrompts}
                    disabled={isGenerating}
                    className="w-full bg-gradient-primary hover:opacity-90 py-3"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Générer 30 Prompts Professionnels
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Génération Personnalisée */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Wand2 className="w-6 h-6 text-primary" />
                  Génération Personnalisée IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-6">
                      Créez des prompts sur mesure avec l'IA selon votre domaine d'expertise
                    </p>
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                        <div className="text-2xl mb-2">🎯</div>
                        <div className="font-medium">Prompts Personnalisés</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Générez 10 prompts adaptés à votre domaine
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setShowCustomGeneration(true)}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 py-3"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Activer la Génération IA
                  </Button>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    Nécessite une clé API OpenAI
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Vue des prompts générés
          <div>
            {/* Header avec actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  Prompts Professionnels
                </h2>
                <p className="text-muted-foreground">
                  {filteredPrompts.length} prompts {filteredPrompts.length !== prompts.length ? `(${prompts.length} au total)` : 'disponibles'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    setPrompts([]);
                    setCopiedIndex(null);
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setShowCustomGeneration(false);
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Nouveaux Prompts
                </Button>
                
                <Button
                  onClick={() => setShowCustomGeneration(!showCustomGeneration)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Génération IA
                </Button>
                
                <Button
                  onClick={downloadAllPrompts}
                  className="flex items-center gap-2 bg-gradient-primary hover:opacity-90"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </Button>
              </div>
            </div>

            {/* Filtres et recherche */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Rechercher dans les prompts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1 ${
                      selectedCategory === category.id 
                        ? "bg-gradient-primary text-white" 
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="mr-1">{category.emoji}</span>
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Liste des prompts */}
            <div className="grid gap-6">
              {filteredPrompts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun prompt trouvé</h3>
                    <p className="text-muted-foreground">
                      Essayez de modifier vos filtres ou votre recherche
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredPrompts.map((prompt, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono">
                            {prompt}
                          </pre>
                        </div>
                        
                        <Button
                          onClick={() => copyPrompt(prompt, index)}
                          variant="outline"
                          size="sm"
                          className={`ml-4 flex-shrink-0 transition-all duration-200 ${
                            copiedIndex === index
                              ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
                              : 'hover:bg-primary/10 hover:border-primary/30'
                          }`}
                        >
                          {copiedIndex === index ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Copié !
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copier
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptsGeneratorPage;
