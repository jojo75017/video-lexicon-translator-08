
import { detectGeographicKeyword } from './titleGenerator';

export const generateSeoDescription = (keyword: string, maxLength: number = 155): string => {
  if (!keyword || keyword.trim().length === 0) {
    keyword = "sujet";
  }

  const keywordLowerCase = keyword.toLowerCase();
  const isGeographic = detectGeographicKeyword(keyword);
  const containsMultipleEntities = keyword.includes(" et ") || keyword.includes(" & ") || 
                                  keyword.includes(" vs ") || keyword.includes(" ou ");
  
  // Détection de mots-clés spécifiques
  const hasBali = keywordLowerCase.includes("bali");
  const hasDigitalNomad = keywordLowerCase.includes("digital nomad") || 
                          keywordLowerCase.includes("nomade digital") || 
                          keywordLowerCase.includes("nomade numérique") ||
                          keywordLowerCase.includes("travail à distance");
  const hasRizieres = keywordLowerCase.includes("rizière") || keywordLowerCase.includes("rizieres") || 
                     keywordLowerCase.includes("riziere");
  
  let description = "";
  
  // Pour les descriptions longues (500 caractères), on génère un texte plus détaillé
  if (maxLength > 155) {
    // Digital nomad à Bali
    if (hasDigitalNomad && hasBali) {
      const options = [
        `Guide complet pour vivre en tant que digital nomad à Bali : découvrez les meilleures zones pour s'installer, les options de visa, le coût de la vie et les espaces de coworking. Notre article détaille les aspects pratiques comme la recherche de logement, les solutions internet fiables, la communauté d'expatriés et la vie quotidienne. Apprenez à gérer le décalage horaire avec vos clients, à vous intégrer dans la culture balinaise et à maintenir un équilibre entre productivité professionnelle et exploration de cette île paradisiaque.`,
        `Vivre en tant que digital nomad à Bali : notre guide détaillé couvre tous les aspects essentiels pour réussir cette aventure. Trouvez les quartiers adaptés à votre style de vie entre Canggu, Ubud ou les zones moins fréquentées, comprenez les différentes options de visa et leurs contraintes, découvrez comment trouver un logement adapté au travail à distance. Nous partageons des conseils pratiques sur les meilleurs espaces de coworking, les cafés avec WiFi fiable, et comment créer des routines productives tout en profitant pleinement de la culture balinaise.`,
        `Expatriation à Bali en tant que digital nomad : tout ce que vous devez savoir pour transformer ce rêve en réalité. Notre guide exhaustif aborde les questions administratives (visa, fiscalité, assurance santé), les aspects pratiques (recherche de logement, connexion internet, transports locaux) et les dimensions professionnelles (espaces de travail, networking, gestion des clients à distance). Découvrez également les meilleures zones selon vos priorités et les défis culturels à anticiper pour une transition en douceur vers cette nouvelle vie.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Rizières de Bali
    else if (hasRizieres && hasBali) {
      const options = [
        `Explorez les magnifiques rizières en terrasses de Bali, véritables joyaux du patrimoine culturel indonésien. Notre guide détaille les meilleurs sites à visiter comme Tegallalang et Jatiluwih, inscrits au patrimoine mondial de l'UNESCO. Découvrez l'histoire fascinante de ces paysages sculptés par l'homme depuis des siècles, leur importance dans la culture balinaise et le système d'irrigation subak. Nous vous donnons tous les conseils pratiques : meilleure période pour visiter, comment s'y rendre, tarifs d'entrée, options de randonnées guidées et astuces pour des photos spectaculaires.`,
        `Découvrez les spectaculaires rizières de Bali, véritables chefs-d'œuvre agricoles qui façonnent le paysage de l'île depuis des siècles. Notre guide complet vous emmène à travers les plus beaux sites de rizières en terrasses, du célèbre Tegallalang aux vastes étendues de Jatiluwih. Apprenez l'histoire et la signification spirituelle du système d'irrigation subak, reconnu par l'UNESCO comme témoignage du génie agricole balinais. Nous partageons nos conseils d'experts pour une expérience authentique : itinéraires recommandés, expériences immersives avec les communautés locales, et meilleures conditions pour la photographie.`,
        `Guide complet des rizières de Bali : plongez dans la beauté époustouflante des paysages verdoyants qui ont rendu l'île célèbre. Des rizières emblématiques de Tegallalang aux vastes terrasses de Jatiluwih classées à l'UNESCO, découvrez l'art ancestral de la culture du riz à Bali. Notre article détaille l'ingénieux système d'irrigation subak, les pratiques agricoles traditionnelles, et l'importance culturelle et religieuse de ces sites. Nous vous proposons des itinéraires personnalisés pour différents profils de voyageurs et des conseils pour un tourisme responsable.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Digital nomad (général)
    else if (hasDigitalNomad) {
      const options = [
        `Guide complet du digital nomad : découvrez comment transformer votre carrière pour travailler de n'importe où dans le monde. Notre article couvre toutes les étapes essentielles : créer une activité compatible avec le nomadisme digital, sélectionner les destinations idéales selon vos préférences, gérer les aspects administratifs (visa, fiscalité internationale, assurance), et maintenir productivité et équilibre personnel. Nous partageons des retours d'expérience de professionnels établis, des recommandations d'outils indispensables, et des conseils pour rejoindre des communautés de nomades digitaux.`,
        `Tout savoir sur le mode de vie nomade digital : notre guide exhaustif vous accompagne dans chaque étape de cette transition professionnelle et personnelle. De la reconversion vers des métiers adaptés au travail à distance jusqu'à l'organisation quotidienne une fois installé, nous couvrons les aspects pratiques, psychologiques et stratégiques de cette aventure. Découvrez comment choisir vos destinations selon des critères objectifs (coût de la vie, climat, infrastructures internet, communauté) et développer les compétences essentielles à l'autonomie.`,
        `Le guide définitif pour devenir digital nomad : une analyse approfondie de ce mode de vie combinant travail à distance et voyage. Nous abordons les fondamentaux comme les métiers les plus adaptés au nomadisme digital, la préparation nécessaire, la sélection d'équipement optimal pour la mobilité, et les destinations prisées avec leurs avantages comparatifs. Notre article explore également les défis moins discutés : adaptation culturelle, solitude et relations sociales, productivité en environnement changeant, et planification à long terme.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Bali (général)
    else if (hasBali) {
      const options = [
        `Découvrez Bali, l'île des dieux, à travers notre guide complet qui vous dévoile bien plus que ses plages paradisiaques. Explorez la richesse culturelle unique de cette destination indonésienne : temples majestueux, cérémonies traditionnelles, arts ancestraux et spiritualité omniprésente. Notre article vous guide à travers les régions incontournables et les joyaux cachés de l'île, des rizières en terrasses d'Ubud aux spots de surf de Kuta, en passant par les falaises de Uluwatu et les lagons secrets de Nusa Penida.`,
        `Guide ultime pour voyager à Bali : tout ce que vous devez savoir pour organiser un séjour inoubliable sur l'île des dieux. Découvrez les multiples visages de cette destination entre temples séculaires, jungles luxuriantes, villages traditionnels et plages de rêve. Nous détaillons les itinéraires optimaux selon la durée de votre séjour, les activités incontournables et expériences authentiques pour chaque région, et les conseils pratiques pour naviguer comme un local.`,
        `Explorez Bali, perle de l'Indonésie, grâce à notre guide détaillé couvrant tous les aspects de cette destination fascinante. De la spiritualité omniprésente dans les milliers de temples à la nature exubérante des rizières, volcans et plages, découvrez pourquoi Bali captive voyageurs et expatriés du monde entier. Notre article vous accompagne dans la planification de votre voyage avec des itinéraires personnalisés et une immersion dans la gastronomie locale.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Lieux géographiques
    else if (isGeographic) {
      if (containsMultipleEntities) {
        const entities = keyword.split(/ et | & | vs | ou /);
        if (entities.length >= 2) {
          const options = [
            `Découvrez notre guide complet pour explorer ${entities[0]} et ${entities[1]}, deux destinations qui se complètent parfaitement pour un voyage inoubliable. Nous avons conçu plusieurs itinéraires optimisés selon votre durée de séjour, vos centres d'intérêt et votre style de voyage. Profitez de nos recommandations détaillées sur les hébergements adaptés à chaque ville, des options de transport entre les deux destinations, et des visites incontournables comme des expériences hors des sentiers battus.`,
            `Guide détaillé pour visiter ${entities[0]} et ${entities[1]}, deux destinations complémentaires qui méritent votre attention. Notre article présente en profondeur les sites touristiques majeurs de chaque lieu, leur contexte historique et culturel, ainsi que les joyaux cachés connus uniquement des locaux. Explorez la gastronomie unique de chaque région, avec des adresses de restaurants authentiques, des marchés locaux et des spécialités à déguster absolument.`,
            `Planifiez votre voyage entre ${entities[0]} et ${entities[1]} grâce à notre guide d'expert. Nous avons créé plusieurs circuits optimisés qui vous permettent de découvrir le meilleur de ces deux destinations sans perdre de temps. Chaque itinéraire est accompagné d'une sélection d'activités culturelles, sportives et de détente adaptées à différents types de voyageurs. Bénéficiez de nos conseils d'initiés sur les quartiers où séjourner et les meilleures façons de se déplacer.`
          ];
          description = options[Math.floor(Math.random() * options.length)];
        }
      } else {
        const options = [
          `Découvrez ${keyword} à travers notre guide local complet qui vous dévoile les multiples facettes de cette destination fascinante. Explorez les monuments historiques emblématiques qui témoignent du riche passé de la région, émerveillez-vous devant les sites naturels d'exception, et immergez-vous dans les traditions locales préservées depuis des générations. Notre guide vous fait découvrir la gastronomie authentique avec ses plats typiques et les meilleurs endroits pour les déguster.`,
          `Visitez ${keyword} grâce à notre guide détaillé qui couvre tous les aspects de votre voyage. Nous avons sélectionné pour vous les lieux incontournables qui font la renommée de la destination, ainsi que des trésors cachés connus seulement des habitants. Découvrez nos recommandations d'activités variées pour tous les goûts et tous les âges, des suggestions de restaurants allant de la cuisine traditionnelle aux innovations gastronomiques locales.`,
          `Guide complet pour explorer ${keyword}, destination aux multiples attraits qui satisfera tous les types de voyageurs. Notre article détaille les attractions principales à visiter absolument, des sites historiques majestueux aux merveilles naturelles époustouflantes. Suivez nos itinéraires recommandés, soigneusement conçus pour optimiser votre temps et vous permettre de découvrir l'essence du lieu. Profitez de nos conseils d'initiés pour découvrir des expériences authentiques loin des sentiers battus.`
        ];
        description = options[Math.floor(Math.random() * options.length)];
      }
    }
    // Traiter le titre directement s'il contient "comment" ou "découvrez comment"
    else if (keywordLowerCase.includes("comment") || keywordLowerCase.includes("découvrez comment")) {
      // Extraction du vrai sujet après "comment" ou "découvrez comment"
      let realSubject = keyword;
      if (keywordLowerCase.includes("comment ")) {
        realSubject = keyword.substring(keyword.toLowerCase().indexOf("comment ") + 8);
      } else if (keywordLowerCase.includes("découvrez comment ")) {
        realSubject = keyword.substring(keyword.toLowerCase().indexOf("découvrez comment ") + 18);
      }
      
      const options = [
        `${keyword} : guide pratique avec étapes détaillées, astuces et conseils d'experts pour réussir. Nous avons compilé les meilleures méthodes basées sur des expériences réelles et des recherches approfondies. Notre article vous accompagne pas à pas dans ce processus avec des explications claires et des exemples concrets pour faciliter votre apprentissage et obtenir des résultats optimaux.`,
        `${keyword} : découvrez notre méthode complète pour y parvenir efficacement. Ce guide présente des stratégies éprouvées, des techniques accessibles et des recommandations personnalisées pour vous aider à atteindre votre objectif. Nous abordons les défis courants que vous pourriez rencontrer et proposons des solutions pratiques pour les surmonter, en vous guidant à chaque étape du processus.`,
        `${realSubject} : instructions complètes et conseils pratiques dans notre guide détaillé. Notre approche méthodique vous permet de progresser étape par étape, en comprenant les principes fondamentaux et les subtilités importantes. Nous partageons également des retours d'expérience et des exemples de réussite pour vous inspirer et vous motiver dans votre propre parcours.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Sujets généraux (non géographiques, non spécifiques)
    else {
      const options = [
        `Guide pratique sur ${keyword} : techniques éprouvées et solutions concrètes pour maîtriser ce sujet. Notre article explore les fondamentaux théoriques essentiels, puis développe des applications pratiques à travers des études de cas détaillées et des exemples concrets. Vous découvrirez également les dernières innovations dans ce domaine et des recommandations personnalisées pour adapter ces connaissances à votre situation spécifique.`,
        `Tout savoir sur ${keyword} : notre guide combine expertise théorique et expérience pratique pour vous offrir une ressource complète sur ce sujet. Nous présentons des méthodes professionnelles éprouvées, illustrées par des exemples concrets qui démontrent leur efficacité dans différents contextes. Chaque concept est expliqué avec clarté, depuis les principes fondamentaux jusqu'aux stratégies avancées.`,
        `Explorez notre guide détaillé sur ${keyword}, conçu pour vous fournir une compréhension complète de ce domaine. Nos experts ont rassemblé des conseils précieux issus de leur expérience, soutenus par des recherches récentes. À travers des études de cas variées, nous illustrons comment ces principes s'appliquent dans différentes situations. Ce guide présente également une analyse comparative des meilleures pratiques actuelles.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
  } else {
    // DESCRIPTIONS COURTES (155 caractères ou moins)
    
    // Digital nomad à Bali
    if (hasDigitalNomad && hasBali) {
      const options = [
        `Guide pour devenir digital nomad à Bali : visas, logement, espaces de coworking, vie quotidienne et intégration dans la culture locale. Conseils pour réussir votre installation.`,
        `Vivre et travailler à Bali en tant que digital nomad : notre guide détaille tout ce qu'il faut savoir sur les visas, l'hébergement, les espaces de travail et la vie locale.`,
        `S'installer à Bali en tant que digital nomad : démarches administratives, quartiers recommandés, adaptation culturelle et conseils pour une transition réussie.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Rizières de Bali
    else if (hasRizieres && hasBali) {
      const options = [
        `Explorez les magnifiques rizières en terrasses de Bali. Notre guide détaille les meilleurs sites comme Tegallalang et Jatiluwih, quand y aller et comment s'y rendre.`,
        `Découvrez les spectaculaires rizières de Bali, joyaux du patrimoine culturel indonésien. Histoire, culture locale et conseils pratiques pour une visite inoubliable.`,
        `Guide des rizières de Bali : sites UNESCO, rencontre avec les agriculteurs locaux, randonnées panoramiques et photographie. Tout pour planifier votre visite.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Digital nomad (général)
    else if (hasDigitalNomad) {
      const options = [
        `Guide du digital nomad : comment travailler depuis n'importe où dans le monde. Conseils pratiques, destinations recommandées et outils indispensables.`,
        `Devenir nomade digital : notre guide pour réussir votre transition vers le travail à distance. Méthodes, destinations et stratégies d'experts.`,
        `Mode de vie nomade digital : comment concilier voyage et carrière. Conseils pour trouver des missions, gérer votre activité à distance et choisir vos destinations.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Bali (général)
    else if (hasBali) {
      const options = [
        `Découvrez Bali : guide de l'île des dieux avec ses temples, plages, rizières et culture unique. Conseils pratiques et itinéraires recommandés pour un séjour inoubliable.`,
        `Guide de voyage à Bali : explorez les trésors de l'île entre plages paradisiaques, temples majestueux et villages authentiques. Conseils d'initiés pour votre séjour.`,
        `Bali : l'essentiel à savoir pour visiter l'île des dieux. Notre guide couvre hébergements, transports, sites incontournables et expériences authentiques.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Lieux géographiques
    else if (isGeographic) {
      if (containsMultipleEntities) {
        const entities = keyword.split(/ et | & | vs | ou /);
        if (entities.length >= 2) {
          const options = [
            `Découvrez notre guide pour explorer ${entities[0]} et ${entities[1]}. Itinéraires recommandés, hébergements, transports et bons plans pour un voyage réussi.`,
            `Guide détaillé pour visiter ${entities[0]} et ${entities[1]}. Sites touristiques, gastronomie locale et conseils pratiques pour profiter au maximum de votre séjour.`,
            `Planifiez votre voyage entre ${entities[0]} et ${entities[1]}. Notre guide propose des circuits optimisés, activités et recommandations d'experts locaux.`
          ];
          description = options[Math.floor(Math.random() * options.length)];
        }
      } else {
        const options = [
          `Découvrez ${keyword} avec notre guide local : monuments historiques, sites naturels, traditions et gastronomie. Conseils pratiques pour un séjour authentique.`,
          `Visitez ${keyword} : notre guide détaille les lieux incontournables, activités, restaurants et hébergements. Tout pour réussir votre voyage !`,
          `Guide complet pour explorer ${keyword}. Attractions principales, itinéraires recommandés et conseils d'initiés pour une expérience inoubliable.`
        ];
        description = options[Math.floor(Math.random() * options.length)];
      }
    }
    // Traiter le titre directement s'il contient "comment" ou "découvrez comment"
    else if (keywordLowerCase.includes("comment") || keywordLowerCase.includes("découvrez comment")) {
      // Extraction du vrai sujet après "comment" ou "découvrez comment"
      let realSubject = keyword;
      if (keywordLowerCase.includes("comment ")) {
        realSubject = keyword.substring(keyword.toLowerCase().indexOf("comment ") + 8);
      } else if (keywordLowerCase.includes("découvrez comment ")) {
        realSubject = keyword.substring(keyword.toLowerCase().indexOf("découvrez comment ") + 18);
      }
      
      const options = [
        `${keyword} : guide pratique étape par étape avec conseils d'experts et astuces pour réussir facilement ce processus.`,
        `${keyword} : méthodes efficaces et conseils pratiques pour atteindre votre objectif. Techniques éprouvées expliquées simplement.`,
        `${realSubject} : instructions détaillées et conseils pratiques dans notre guide méthodique pour réussir à chaque étape.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
    // Sujets généraux (non géographiques, non spécifiques)
    else {
      const options = [
        `Guide pratique sur ${keyword} : techniques éprouvées et conseils d'experts pour maîtriser ce sujet. Découvrez nos recommandations pour des résultats optimaux.`,
        `Tout savoir sur ${keyword} : méthodes professionnelles et astuces pratiques. Guide complet pour comprendre et appliquer efficacement ces concepts.`,
        `Explorez notre guide détaillé sur ${keyword}. Conseils d'experts, méthodes éprouvées et bonnes pratiques pour atteindre vos objectifs.`
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
