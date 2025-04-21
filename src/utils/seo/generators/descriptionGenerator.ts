
import { detectGeographicKeyword } from './titleGenerator';

export const generateSeoDescription = (keyword: string): string => {
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
  
  if (hasRizieres && hasBali) {
    // Descriptions spécifiques pour les rizières de Bali
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
  
  if (description.length > 155) {
    description = description.substring(0, 152) + "...";
    
    if (description.length > 155) {
      // Assurer que la longueur ne dépasse jamais 155 après l'ajout des points de suspension
      description = description.substring(0, 152) + "...";
    }
  } else if (description.length < 155) {
    const extraContext = " Informations vérifiées par nos experts pour des résultats garantis.";
    description = description + extraContext.substring(0, 155 - description.length);
  }
  
  return description.padEnd(155, ' ');
};
