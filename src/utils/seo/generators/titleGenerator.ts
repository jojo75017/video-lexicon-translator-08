
import { geographicTerms } from '../constants/seoConstants';

export const detectGeographicKeyword = (keyword: string): boolean => {
  const lowercaseKeyword = keyword.toLowerCase();
  return geographicTerms.some(term => 
    lowercaseKeyword.includes(term) || 
    lowercaseKeyword.replace(/[-']/g, " ").includes(term)
  );
};

export const generateSeoTitle = (keyword: string): string => {
  if (!keyword || keyword.trim().length === 0) {
    keyword = "contenu optimisé";
  }
  
  const keywordLowerCase = keyword.toLowerCase();
  const isGeographic = detectGeographicKeyword(keyword);
  const containsMultipleEntities = keyword.includes(" et ") || keyword.includes(" & ") || 
                                  keyword.includes(" vs ") || keyword.includes(" ou ");
  
  let title = "";
  
  if (isGeographic) {
    if (containsMultipleEntities) {
      const entities = keyword.split(/ et | & | vs | ou /);
      if (entities.length >= 2) {
        const options = [
          `Circuit ${entities[0]} et ${entities[1]} : Guide Complet | Voyage 2024`,
          `Voyage ${entities[0]}-${entities[1]} : Itinéraire et Conseils Pratiques`,
          `Explorer ${entities[0]} et ${entities[1]} : Circuit Optimal | Guide`,
          `${entities[0]} et ${entities[1]} : Comparatif et Itinéraire | Voyage`,
          `Guide de Voyage : ${entities[0]} et ${entities[1]} | Circuit Idéal`
        ];
        title = options[Math.floor(Math.random() * options.length)];
      }
    } else {
      const options = [
        `Visiter ${keyword} : Sites Incontournables et Activités`,
        `Guide Voyage ${keyword} : Top 10 à Découvrir | 2024`,
        `${keyword} : Que Voir, Que Faire | Guide Local`,
        `Découvrir ${keyword} : Itinéraire et Bons Plans`,
        `${keyword} : Guide du Voyageur | Conseils 2024`
      ];
      title = options[Math.floor(Math.random() * options.length)];
    }
  } else {
    const options = [
      `${keyword} : Guide Complet et Conseils | Expert 2024`,
      `Guide Ultime : ${keyword} | Techniques et Astuces`,
      `${keyword} : Les Meilleures Pratiques | Guide Pro`,
      `Tout Savoir sur ${keyword} | Guide Détaillé`,
      `${keyword} : Solutions et Stratégies | Guide 2024`
    ];
    title = options[Math.floor(Math.random() * options.length)];
  }
  
  if (title.length > 60) {
    title = title.substring(0, 57) + "...";
  } else if (title.length < 60) {
    const padding = " • Guide Expert".substring(0, 60 - title.length);
    title = title + padding;
  }
  
  return title.padEnd(60, ' ');
};
