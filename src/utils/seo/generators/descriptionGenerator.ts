
import { detectGeographicKeyword } from './titleGenerator';

export const generateSeoDescription = (keyword: string, maxLength: number = 155): string => {
  if (!keyword || keyword.trim().length === 0) {
    keyword = "sujet";
  }

  const keywordLowerCase = keyword.toLowerCase();
  const isGeographic = detectGeographicKeyword(keyword);
  const containsMultipleEntities = keyword.includes(" et ") || keyword.includes(" & ") || 
                                  keyword.includes(" vs ") || keyword.includes(" ou ");
  const hasBali = keywordLowerCase.includes("bali");
  const hasRizieres = keywordLowerCase.includes("rizière") || keywordLowerCase.includes("rizieres") || 
                     keywordLowerCase.includes("riziere");
  
  let description = "";
  
  // Pour les descriptions longues (500 caractères), on génère un texte plus détaillé
  if (maxLength > 155) {
    if (hasRizieres && hasBali) {
      const options = [
        `Explorez les magnifiques rizières en terrasses de Bali, véritables joyaux du patrimoine culturel indonésien. Notre guide détaille les meilleurs sites à visiter comme Tegallalang et Jatiluwih, inscrits au patrimoine mondial de l'UNESCO. Découvrez l'histoire fascinante de ces paysages sculptés par l'homme depuis des siècles, leur importance dans la culture balinaise et le système d'irrigation subak. Nous vous donnons tous les conseils pratiques : meilleure période pour visiter, comment s'y rendre, tarifs d'entrée, options de randonnées guidées et astuces pour des photos spectaculaires au lever et coucher du soleil. Rencontrez les agriculteurs locaux et découvrez leurs techniques traditionnelles préservées de génération en génération.`,
        `Découvrez les spectaculaires rizières de Bali, véritables chefs-d'œuvre agricoles qui façonnent le paysage de l'île depuis des siècles. Notre guide complet vous emmène à travers les plus beaux sites de rizières en terrasses, du célèbre Tegallalang aux vastes étendues de Jatiluwih. Apprenez l'histoire et la signification spirituelle du système d'irrigation subak, reconnu par l'UNESCO comme témoignage du génie agricole balinais. Nous partageons nos conseils d'experts pour une expérience authentique : itinéraires recommandés, expériences immersives avec les communautés locales, meilleures conditions pour la photographie, et informations pratiques sur l'accessibilité, l'hébergement et les services disponibles à proximité.`,
        `Guide complet des rizières de Bali : plongez dans la beauté époustouflante des paysages verdoyants qui ont rendu l'île célèbre. Des rizières emblématiques de Tegallalang aux vastes terrasses de Jatiluwih classées à l'UNESCO, découvrez l'art ancestral de la culture du riz à Bali. Notre article détaille l'ingénieux système d'irrigation subak, les pratiques agricoles traditionnelles, et l'importance culturelle et religieuse de ces sites. Nous vous proposons des itinéraires personnalisés pour différents profils de voyageurs, des informations sur les cérémonies liées aux récoltes, des recommandations pour un tourisme responsable, et des conseils techniques pour capturer la magie de ces paysages à travers votre objectif photographique.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    } else if (isGeographic) {
      if (containsMultipleEntities) {
        const entities = keyword.split(/ et | & | vs | ou /);
        if (entities.length >= 2) {
          const options = [
            `Découvrez notre guide complet pour explorer ${entities[0]} et ${entities[1]}, deux destinations qui se complètent parfaitement pour un voyage inoubliable. Nous avons conçu plusieurs itinéraires optimisés selon votre durée de séjour, vos centres d'intérêt et votre budget. Profitez de nos recommandations détaillées sur les hébergements adaptés à chaque ville, des options de transport les plus efficaces entre les deux destinations, et des visites incontournables comme des expériences hors des sentiers battus. Notre guide inclut également des conseils pratiques sur les meilleures périodes pour visiter, les spécialités culinaires à ne pas manquer, et des astuces pour économiser sur votre voyage tout en maximisant vos expériences.`,
            `Guide détaillé pour visiter ${entities[0]} et ${entities[1]}, deux destinations complémentaires qui méritent votre attention. Notre article présente en profondeur les sites touristiques majeurs de chaque lieu, leur contexte historique et culturel, ainsi que les joyaux cachés connus uniquement des locaux. Explorez la gastronomie unique de chaque région, avec des adresses de restaurants authentiques, des marchés locaux et des spécialités à déguster absolument. Nous partageons également des conseils logistiques essentiels : options de transport optimales entre les deux destinations, comparatifs d'hébergements selon votre style de voyage, et recommandations saisonnières pour profiter pleinement de votre séjour.`,
            `Planifiez votre voyage entre ${entities[0]} et ${entities[1]} grâce à notre guide d'expert. Nous avons créé plusieurs circuits optimisés qui vous permettent de découvrir le meilleur de ces deux destinations sans perdre de temps en déplacements inutiles. Chaque itinéraire est accompagné d'une sélection d'activités culturelles, sportives et de détente adaptées à différents types de voyageurs. Bénéficiez de nos conseils d'initiés sur les quartiers où séjourner, les meilleures façons de se déplacer, les fêtes et événements locaux à ne pas manquer, et des astuces pour vivre des expériences authentiques loin des foules touristiques. Notre guide aborde également les aspects pratiques comme les budgets à prévoir et les précautions à prendre.`
          ];
          description = options[Math.floor(Math.random() * options.length)];
        }
      } else {
        const options = [
          `Découvrez ${keyword} à travers notre guide local complet qui vous dévoile les multiples facettes de cette destination fascinante. Explorez les monuments historiques emblématiques qui témoignent du riche passé de la région, émerveillez-vous devant les sites naturels d'exception, et immergez-vous dans les traditions locales préservées depuis des générations. Notre guide vous fait découvrir la gastronomie authentique avec ses plats typiques et les meilleurs endroits pour les déguster. Nous partageons également des conseils pratiques essentiels pour organiser votre séjour : recommandations d'hébergements selon votre budget, moyens de transport locaux, événements saisonniers, et astuces pour vivre une expérience véritablement authentique.`,
          `Visitez ${keyword} grâce à notre guide détaillé qui couvre tous les aspects de votre voyage. Nous avons sélectionné pour vous les lieux incontournables qui font la renommée de la destination, ainsi que des trésors cachés connus seulement des habitants. Découvrez nos recommandations d'activités variées pour tous les goûts et tous les âges, des suggestions de restaurants allant de la cuisine traditionnelle aux innovations gastronomiques locales, et un éventail d'options d'hébergement adaptées à chaque style de voyage. Notre guide inclut également des itinéraires jour par jour selon la durée de votre séjour, des informations sur les événements culturels à ne pas manquer, et des conseils pratiques pour une expérience de voyage fluide et mémorable.`,
          `Guide complet pour explorer ${keyword}, destination aux multiples attraits qui satisfera tous les types de voyageurs. Notre article détaille les attractions principales à visiter absolument, des sites historiques majestueux aux merveilles naturelles époustouflantes. Suivez nos itinéraires recommandés, soigneusement conçus pour optimiser votre temps et vous permettre de découvrir l'essence du lieu. Profitez de nos conseils d'initiés pour découvrir des expériences authentiques loin des sentiers battus, des rencontres privilégiées avec les habitants, et des moments de pure magie que seule cette destination peut offrir. Nous abordons également les questions pratiques comme la meilleure saison pour visiter, les options de transport local, et les considérations budgétaires pour planifier un voyage sur mesure.`
        ];
        description = options[Math.floor(Math.random() * options.length)];
      }
    } else {
      const options = [
        `Guide pratique complet sur ${keyword} : plongez dans une analyse approfondie de ce sujet avec des techniques éprouvées par les professionnels du secteur, des conseils d'experts reconnus et des solutions concrètes pour relever tous les défis associés. Notre article explore les fondamentaux théoriques essentiels à maîtriser, puis développe des applications pratiques à travers des études de cas détaillées et des exemples concrets tirés d'expériences réelles. Vous découvrirez également les dernières innovations et tendances dans ce domaine, une comparaison des différentes approches méthodologiques, et des recommandations personnalisées pour adapter ces connaissances à votre situation spécifique. Un guide indispensable pour quiconque souhaite obtenir des résultats optimaux et durables.`,
        `Tout savoir sur ${keyword} : notre guide exhaustif combine expertise théorique et expérience pratique pour vous offrir une ressource complète sur ce sujet complexe. Nous présentons des méthodes professionnelles éprouvées, illustrées par des exemples concrets qui démontrent leur efficacité dans différents contextes. Chaque concept est expliqué avec clarté, depuis les principes fondamentaux jusqu'aux stratégies avancées, permettant aussi bien aux débutants qu'aux experts d'approfondir leurs connaissances. Notre guide aborde également les erreurs courantes à éviter, les outils et ressources recommandés par les spécialistes, et des exercices pratiques pour vous aider à maîtriser le sujet en profondeur et à obtenir des résultats tangibles.`,
        `Explorez notre guide détaillé sur ${keyword}, conçu pour vous fournir une compréhension complète et nuancée de ce domaine passionnant. Nos experts ont rassemblé des conseils précieux issus de leur expérience professionnelle, soutenus par des recherches récentes et des données probantes. À travers des études de cas variées et représentatives, nous illustrons comment ces principes s'appliquent dans différentes situations et contextes. Ce guide présente également une analyse comparative des meilleures pratiques actuelles, des témoignages de réussite inspirants, et des stratégies d'implémentation progressive pour vous permettre d'atteindre vos objectifs efficacement. Que vous soyez novice ou praticien expérimenté, vous trouverez des insights précieux pour perfectionner votre approche.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
  } else {
    // Conservation de la logique existante pour les descriptions courtes (155 caractères)
    if (hasRizieres && hasBali) {
      const options = [
        `Explorez les magnifiques rizières en terrasses de Bali. Notre guide détaille les meilleurs sites comme Tegallalang et Jatiluwih, quand y aller et comment s'y rendre.`,
        `Découvrez les spectaculaires rizières de Bali, joyaux du patrimoine culturel indonésien. Histoire, culture locale et conseils pratiques pour une visite inoubliable.`,
        `Guide complet des rizières de Bali : sites UNESCO, rencontre avec les agriculteurs locaux, randonnées panoramiques et photographie. Tout pour planifier votre visite.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    } else if (isGeographic) {
      if (containsMultipleEntities) {
        const entities = keyword.split(/ et | & | vs | ou /);
        if (entities.length >= 2) {
          const options = [
            `Découvrez notre guide complet pour explorer ${entities[0]} et ${entities[1]}. Itinéraires recommandés, hébergements, transports et bons plans pour un voyage réussi.`,
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
    } else {
      const options = [
        `Guide pratique sur ${keyword} : techniques éprouvées, conseils d'experts et solutions concrètes. Découvrez nos recommandations pour des résultats optimaux.`,
        `Tout savoir sur ${keyword} : méthodes professionnelles, exemples pratiques et astuces. Guide complet pour maîtriser le sujet en profondeur.`,
        `Explorez notre guide détaillé sur ${keyword}. Conseils d'experts, études de cas et bonnes pratiques pour atteindre vos objectifs.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
  }
  
  // Ajustement de la longueur selon la limite maximale
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + "...";
  } else if (description.length < maxLength) {
    const extraContext = " Informations vérifiées par nos experts pour des résultats garantis.";
    description = description + extraContext.substring(0, maxLength - description.length);
  }
  
  return description;
};
