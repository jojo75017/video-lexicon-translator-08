
import { detectGeographicKeyword } from './titleGenerator';

export const generateSeoDescription = (keyword: string, maxLength: number = 155): string => {
  if (!keyword || keyword.trim().length === 0) {
    keyword = "sujet";
  }

  // Nettoyage et préparation du mot-clé
  const keywordLowerCase = keyword.toLowerCase().trim();
  const isGeographic = detectGeographicKeyword(keyword);
  const containsMultipleEntities = keyword.includes(" et ") || keyword.includes(" & ") || 
                                  keyword.includes(" vs ") || keyword.includes(" ou ");
  
  // Détection de mots-clés spécifiques et de patterns courants
  const hasBali = keywordLowerCase.includes("bali");
  const hasDigitalNomad = keywordLowerCase.includes("digital nomad") || 
                          keywordLowerCase.includes("nomade digital") || 
                          keywordLowerCase.includes("nomade numérique") ||
                          keywordLowerCase.includes("travail à distance");
  const hasRizieres = keywordLowerCase.includes("rizière") || keywordLowerCase.includes("rizieres") || 
                     keywordLowerCase.includes("riziere");
  const hasVoyage = keywordLowerCase.includes("voyage") || keywordLowerCase.includes("voyager") ||
                    keywordLowerCase.includes("voyageur") || keywordLowerCase.includes("tourisme");
  const hasSolo = keywordLowerCase.includes("solo") || keywordLowerCase.includes("seul");
  
  // Analyser le pattern "comment [faire quelque chose]"
  const isHowTo = keywordLowerCase.startsWith("comment ") || 
                  keywordLowerCase.startsWith("découvrez comment ") ||
                  keywordLowerCase.includes("guide") || 
                  keywordLowerCase.includes("tutoriel") ||
                  keywordLowerCase.includes("conseil");
  
  // Extraire le sujet principal après "comment" si présent
  let mainSubject = keyword;
  if (keywordLowerCase.startsWith("comment ")) {
    mainSubject = keyword.substring("comment ".length);
  } else if (keywordLowerCase.startsWith("découvrez comment ")) {
    mainSubject = keyword.substring("découvrez comment ".length);
  }
  
  let description = "";
  
  // Pour les descriptions longues (plus de 155 caractères)
  if (maxLength > 155) {
    // Digital nomad à Bali
    if (hasDigitalNomad && hasBali) {
      const options = [
        `Guide complet pour vivre en tant que digital nomad à Bali : visa, logement, coût de la vie, espaces de coworking et intégration locale. Découvrez les meilleurs quartiers pour s'installer, comment trouver un appartement adapté au travail à distance, les solutions internet fiables et les aspects fiscaux à considérer. Apprenez à concilier productivité professionnelle et exploration de cette île paradisiaque.`,
        `Vivre et travailler à Bali comme nomade digital : tout ce que vous devez savoir pour réussir votre expatriation. Notre guide détaille les différents types de visa, le budget mensuel nécessaire, où trouver une communauté d'expatriés et comment gérer les aspects pratiques du quotidien. Découvrez les cafés avec WiFi fiable, les espaces de coworking populaires et les astuces pour une transition en douceur.`,
        `S'installer à Bali en tant que digital nomad : conseils pratiques d'expatriés expérimentés. Nous couvrons les démarches administratives, les options d'hébergement selon votre budget, les meilleures zones selon votre style de vie et comment créer des routines productives. Notre guide aborde également la santé, les assurances et les bonnes pratiques pour respecter la culture balinaise.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Voyage en solo
    else if (hasVoyage && hasSolo) {
      const options = [
        `Voyager en solo : guide complet avec conseils pratiques, astuces de sécurité et recommandations pour vivre une expérience enrichissante. Découvrez comment planifier votre itinéraire, rencontrer d'autres voyageurs, surmonter l'appréhension de partir seul et profiter pleinement de cette aventure transformatrice. Notre article partage des témoignages inspirants et des stratégies pour tous les profils de voyageurs solitaires.`,
        `Explorer le monde en solo : notre guide détaillé vous accompagne à chaque étape de cette aventure personnelle. De la préparation psychologique aux aspects pratiques comme la sécurité et la gestion du budget, nous couvrons tout ce dont vous avez besoin pour voyager seul en toute confiance. Découvrez comment cette expérience peut transformer votre vie, développer votre autonomie et vous ouvrir à de nouvelles perspectives.`,
        `Comment voyager seul et en profiter pleinement : conseils d'experts pour les voyageurs solitaires. Notre guide aborde les défis spécifiques du voyage en solo comme la solitude occasionnelle, la sécurité personnelle et l'organisation logistique. Nous partageons des techniques éprouvées pour faire des rencontres enrichissantes, négocier les meilleurs tarifs et créer des souvenirs inoubliables en toute indépendance.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Rizières de Bali
    else if (hasRizieres && hasBali) {
      const options = [
        `Explorez les magnifiques rizières en terrasses de Bali, véritables joyaux du patrimoine culturel indonésien. Notre guide détaille les meilleurs sites comme Tegallalang et Jatiluwih (UNESCO), leur histoire fascinante et l'ingénieux système d'irrigation subak. Découvrez quand visiter pour la plus belle lumière, comment s'y rendre depuis les principales zones touristiques, et comment interagir respectueusement avec les agriculteurs locaux.`,
        `Les rizières de Bali : découvrez ces paysages emblématiques qui font la réputation de l'île. Notre guide vous emmène à travers les plus beaux sites, des célèbres terrasses de Tegallalang aux vastes étendues de Jatiluwih moins fréquentées des touristes. Apprenez l'importance spirituelle et culturelle de la culture du riz à Bali, participez à des randonnées guidées et capturez des photos spectaculaires à différentes heures de la journée.`,
        `Guide complet des rizières balinaises : immergez-vous dans ces paysages verdoyants qui symbolisent l'âme de Bali. Nous détaillons chaque site majeur, les rituels agricoles traditionnels, et comment observer le processus complet de culture du riz. Notre article inclut des recommandations de circuits personnalisés selon votre temps disponible, ainsi que des conseils pour un tourisme responsable qui soutient les communautés locales.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Digital nomad (général)
    else if (hasDigitalNomad) {
      const options = [
        `Devenir digital nomad : guide complet pour transformer votre carrière et travailler depuis n'importe où. Découvrez comment choisir un métier compatible avec le nomadisme, sélectionner vos destinations selon vos critères personnels, gérer les aspects administratifs et fiscaux, et maintenir une productivité optimale en déplacement. Notre guide partage des conseils d'experts pour une transition réussie vers ce style de vie libérateur.`,
        `Le guide définitif du nomadisme digital : tout ce que vous devez savoir pour vivre et travailler en voyageant. Nous couvrons le choix des destinations idéales selon le coût de la vie et la qualité des infrastructures, les outils indispensables pour le travail à distance, les stratégies pour trouver des clients ou un emploi flexible, et comment créer une routine efficace malgré les changements d'environnement.`,
        `Comment devenir nomade digital en 2024 : stratégies pratiques et conseils concrets pour réaliser ce projet de vie. Notre guide aborde les compétences demandées sur le marché du travail à distance, la gestion de l'équilibre vie professionnelle-personnelle en voyage, les communautés à rejoindre pour combattre l'isolement et les solutions pour résoudre les problèmes courants comme les décalages horaires et la connexion internet.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Bali (général)
    else if (hasBali) {
      const options = [
        `Découvrez Bali, l'île des dieux : guide complet pour planifier votre séjour sur cette destination paradisiaque. Explorez ses plages idylliques, temples majestueux, rizières verdoyantes et villages authentiques. Notre guide détaille les régions à ne pas manquer, les activités incontournables, où séjourner selon votre budget et comment vous déplacer efficacement sur l'île pour une expérience authentique.`,
        `Visiter Bali : guide pratique et conseils d'initiés pour découvrir le meilleur de l'île indonésienne. Nous vous guidons à travers les sites emblématiques et les joyaux cachés, de la spiritualité d'Ubud aux plages de surf de Canggu, en passant par les falaises spectaculaires d'Uluwatu. Profitez de nos recommandations pour la gastronomie locale, les hébergements de charme et les expériences culturelles immersives.`,
        `Bali : itinéraires, conseils et bonnes adresses pour un voyage inoubliable sur l'île des dieux. Notre guide propose plusieurs circuits selon votre durée de séjour, des suggestions d'activités pour chaque profil de voyageur, et des recommandations authentiques loin des pièges à touristes. Découvrez comment vivre pleinement l'expérience balinaise, de ses traditions séculaires à sa scène artistique contemporaine.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Voyage (général)
    else if (hasVoyage) {
      const options = [
        `Guide complet pour préparer votre voyage et vivre une expérience inoubliable. Nous partageons nos meilleures astuces de planification, de la réservation de vols aux économies sur l'hébergement, en passant par la préparation d'un itinéraire équilibré. Découvrez comment voyager de façon plus authentique, respectueuse et enrichissante, avec des conseils pratiques adaptés à tous les styles de voyage.`,
        `Voyager efficacement et sereinement : notre guide regorge de conseils pratiques pour optimiser chaque aspect de votre aventure. Apprenez à faire vos valises intelligemment, à naviguer dans les transports locaux, à surmonter la barrière de la langue et à gérer votre budget. Nous partageons également des recommandations pour découvrir la culture locale et créer des connexions significatives lors de vos déplacements.`,
        `L'art du voyage : guide complet pour transformer vos déplacements en expériences transformatrices. De la préparation mentale aux astuces pratiques sur le terrain, notre article couvre tous les aspects essentiels pour voyager avec confiance et curiosité. Découvrez comment sortir des sentiers battus, capturer des souvenirs mémorables et revenir enrichi de chaque aventure.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Lieux géographiques
    else if (isGeographic) {
      if (containsMultipleEntities) {
        const entities = keyword.split(/ et | & | vs | ou /);
        if (entities.length >= 2) {
          const options = [
            `Guide complet pour explorer ${entities[0]} et ${entities[1]} : découvrez les attraits uniques de ces deux destinations complémentaires. Notre itinéraire optimisé vous permet de profiter pleinement des sites incontournables comme des trésors cachés de chaque lieu. Nous partageons nos recommandations d'hébergements, restaurants authentiques et moyens de transport entre les deux destinations pour un voyage fluide et mémorable.`,
            `Visiter ${entities[0]} et ${entities[1]} : notre guide détaillé pour combiner ces destinations dans un seul voyage. Découvrez l'histoire, la culture et les paysages distinctifs de chaque lieu, avec des itinéraires sur mesure selon votre durée de séjour. Nos conseils pratiques couvrent la logistique, les meilleures périodes pour visiter et comment maximiser votre expérience sans vous épuiser.`,
            `${entities[0]} et ${entities[1]} : circuit idéal pour découvrir ces deux destinations fascinantes. Notre guide propose plusieurs itinéraires selon vos centres d'intérêt, que vous soyez passionné d'histoire, de gastronomie, de nature ou d'art. Profitez de nos conseils d'experts locaux pour éviter les foules, dénicher des expériences authentiques et créer des souvenirs inoubliables dans ces lieux emblématiques.`
          ];
          description = options[Math.floor(Math.random() * options.length)];
        }
      } else {
        const options = [
          `Découvrez ${keyword} : guide complet pour explorer cette destination fascinante aux multiples facettes. Notre article détaille les sites incontournables, les expériences authentiques et les conseils pratiques pour optimiser votre séjour. Profitez de nos recommandations d'hébergements, restaurants locaux et activités adaptées à tous les profils de voyageurs pour une immersion réussie.`,
          `Visiter ${keyword} : tout ce que vous devez savoir pour préparer un voyage inoubliable dans cette destination exceptionnelle. Notre guide partage les meilleurs itinéraires, les périodes idéales pour s'y rendre, les moyens de transport sur place et les incontournables culturels. Découvrez également nos conseils pour sortir des sentiers battus et vivre des expériences uniques loin des foules.`,
          `Guide de voyage à ${keyword} : conseils d'experts et bonnes adresses pour un séjour réussi. Nous vous guidons à travers les quartiers à explorer, les sites historiques majeurs, les merveilles naturelles et les traditions locales à découvrir. Notre article inclut des informations pratiques sur le budget nécessaire, les démarches administratives et les aspects culturels à respecter.`
        ];
        description = options[Math.floor(Math.random() * options.length)];
      }
    }
    // Guide pratique ou tutoriels (comment faire...)
    else if (isHowTo) {
      const options = [
        `${keyword} : guide pratique étape par étape pour réussir facilement. Notre article détaille la méthode complète avec des instructions claires, des exemples concrets et des astuces d'experts. Vous découvrirez les techniques les plus efficaces, les erreurs courantes à éviter et des conseils personnalisés pour adapter ces connaissances à votre situation particulière.`,
        `${keyword} : méthodes prouvées et conseils d'experts dans notre guide détaillé. Nous avons rassemblé les meilleures pratiques, techniques avancées et étapes progressives pour vous accompagner tout au long du processus. Notre approche pédagogique vous permet d'acquérir rapidement les compétences nécessaires et d'obtenir des résultats concrets et durables.`,
        `Comment ${mainSubject} : instructions complètes et recommandations pratiques pour réussir à chaque étape. Notre guide méthodique vous présente les fondamentaux essentiels, les outils recommandés et des exemples de réussites inspirantes. Vous bénéficierez également de solutions aux défis fréquemment rencontrés et d'un suivi progressif pour atteindre vos objectifs.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Sujets généraux (non spécifiques)
    else {
      const options = [
        `${keyword} : guide complet avec analyses approfondies et conseils pratiques pour maîtriser ce sujet. Notre article combine approche théorique et applications concrètes pour une compréhension globale. Découvrez les principes fondamentaux, les dernières tendances et des études de cas inspirantes qui illustrent comment appliquer ces concepts dans différents contextes.`,
        `Tout savoir sur ${keyword} : ressource complète avec explications détaillées et méthodes applicables. Nous explorons les aspects essentiels de ce domaine, depuis les principes de base jusqu'aux stratégies avancées, en passant par des exemples réels qui démontrent l'impact de ces connaissances. Notre guide s'adapte à tous les niveaux, du débutant à l'expert.`,
        `${keyword} : analyse approfondie et guide pratique pour développer votre expertise sur ce sujet. Notre article présente une vision complète avec des données récentes, des techniques éprouvées et des perspectives d'évolution. Vous y trouverez également des recommandations personnalisées et des ressources complémentaires pour approfondir vos connaissances.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
  } else {
    // DESCRIPTIONS COURTES (155 caractères ou moins)
    
    // Digital nomad à Bali
    if (hasDigitalNomad && hasBali) {
      const options = [
        `Guide pour devenir digital nomad à Bali : visa, logement, coworking, coût de la vie et intégration culturelle. Conseils pratiques pour une installation réussie sur l'île des dieux.`,
        `Vivre et travailler à Bali en tant que nomade numérique : notre guide couvre les visas, l'hébergement, les espaces de travail et la communauté d'expatriés.`,
        `S'installer à Bali comme digital nomad : démarches administratives, quartiers recommandés, budget mensuel et conseils pour une transition en douceur.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Voyage en solo
    else if (hasVoyage && hasSolo) {
      const options = [
        `Guide du voyage en solo : conseils pratiques, astuces de sécurité et recommandations pour profiter pleinement de cette aventure enrichissante et transformatrice.`,
        `Voyager seul : notre guide complet aborde les aspects pratiques, psychologiques et sociaux du voyage en solo pour une expérience inoubliable.`,
        `Comment voyager seul en toute confiance : préparation, sécurité, rencontres et conseils pour surmonter l'appréhension et vivre une aventure épanouissante.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Rizières de Bali
    else if (hasRizieres && hasBali) {
      const options = [
        `Explorez les magnifiques rizières en terrasses de Bali. Guide complet des sites incontournables comme Tegallalang et Jatiluwih, histoire du système subak et conseils pratiques.`,
        `Les rizières de Bali : sites UNESCO, traditions agricoles, meilleurs points de vue et conseils pour photographier ces paysages emblématiques de l'île des dieux.`,
        `Guide des rizières balinaises : découvrez ces joyaux culturels, leur importance spirituelle, les meilleurs moments pour visiter et comment soutenir les agriculteurs locaux.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Digital nomad (général)
    else if (hasDigitalNomad) {
      const options = [
        `Guide complet pour devenir digital nomad : métiers compatibles, destinations recommandées, aspects administratifs et conseils pour travailler efficacement en voyageant.`,
        `Le nomadisme digital : notre guide pour travailler depuis n'importe où dans le monde. Stratégies, outils indispensables et communautés à rejoindre.`,
        `Comment devenir nomade numérique : compétences requises, gestion du quotidien, équilibre vie-travail et astuces pour réussir ce mode de vie alternatif.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Bali (général)
    else if (hasBali) {
      const options = [
        `Découvrez Bali : guide complet de l'île des dieux avec ses plages, temples, rizières et villages traditionnels. Conseils pratiques pour un voyage inoubliable.`,
        `Visiter Bali : itinéraires recommandés, hébergements, transports et activités incontournables pour profiter pleinement de cette destination paradisiaque.`,
        `Guide de voyage à Bali : explorez cette île fascinante entre tradition et modernité. Sites à voir, expériences authentiques et astuces pour éviter les pièges à touristes.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Voyage (général)
    else if (hasVoyage) {
      const options = [
        `Guide pratique du voyage : préparation, astuces pour économiser, conseils de sécurité et recommandations pour vivre des expériences authentiques lors de vos déplacements.`,
        `L'art de voyager : notre guide partage les techniques essentielles pour planifier, organiser et profiter pleinement de chaque aventure, quel que soit votre budget.`,
        `Conseils de voyage : préparez-vous efficacement, découvrez des destinations authentiques et créez des souvenirs inoubliables avec nos recommandations d'experts.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Lieux géographiques
    else if (isGeographic) {
      if (containsMultipleEntities) {
        const entities = keyword.split(/ et | & | vs | ou /);
        if (entities.length >= 2) {
          const options = [
            `Découvrez notre guide pour explorer ${entities[0]} et ${entities[1]}. Itinéraires optimisés, sites incontournables et conseils pratiques pour un circuit idéal.`,
            `Visiter ${entities[0]} et ${entities[1]} : notre guide complet propose des circuits sur mesure, bonnes adresses et astuces pour combiner ces destinations.`,
            `${entities[0]} et ${entities[1]} : comment organiser votre voyage entre ces deux destinations. Transports, hébergements et expériences authentiques recommandés.`
          ];
          description = options[Math.floor(Math.random() * options.length)];
        }
      } else {
        const options = [
          `Découvrez ${keyword} avec notre guide de voyage complet : sites incontournables, expériences locales et conseils pratiques pour un séjour mémorable.`,
          `Visiter ${keyword} : itinéraires recommandés, meilleures périodes, hébergements et activités pour profiter pleinement de cette destination exceptionnelle.`,
          `Guide de voyage à ${keyword} : tout ce que vous devez savoir pour préparer et réussir votre séjour. Bonnes adresses et astuces d'initiés incluses.`
        ];
        description = options[Math.floor(Math.random() * options.length)];
      }
    }
    // Guide pratique ou tutoriels (comment faire...)
    else if (isHowTo) {
      const options = [
        `${keyword} : guide pratique avec instructions détaillées et conseils d'experts pour réussir facilement. Techniques éprouvées et erreurs à éviter.`,
        `${keyword} : méthode complète étape par étape pour atteindre vos objectifs. Astuces pratiques et solutions aux problèmes courants.`,
        `Comment ${mainSubject} : instructions claires, outils recommandés et techniques efficaces pour des résultats garantis. Guide adapté à tous les niveaux.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Sujets généraux (non spécifiques)
    else {
      const options = [
        `${keyword} : guide complet avec informations essentielles et conseils pratiques pour maîtriser ce sujet. Approche méthodique et recommandations d'experts.`,
        `Tout savoir sur ${keyword} : analyse approfondie, méthodes éprouvées et applications concrètes pour développer vos compétences dans ce domaine.`,
        `${keyword} : ressource complète combinant théorie et pratique pour une compréhension globale. Stratégies efficaces et exemples inspirants.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
  }
  
  // Ajustement de la longueur selon la limite maximale
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + "...";
  }
  
  return description;
};

// Fonction pour générer à la fois une description courte et longue
export const generateBothDescriptions = (keyword: string): { short: string; long: string } => {
  return {
    short: generateSeoDescription(keyword, 155),
    long: generateSeoDescription(keyword, 500)
  };
};
