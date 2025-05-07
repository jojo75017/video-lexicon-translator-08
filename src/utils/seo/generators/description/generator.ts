
import { DescriptionTemplate } from './types';
import { detectKeywordType, extractEntities } from './detectors';
import { optimizeDescriptionLength } from './utils';
import {
  digitalNomadBaliTemplates,
  soloTravelTemplates,
  baliRiceFieldsTemplates,
  digitalNomadTemplates,
  baliTemplates,
  travelTemplates,
  shortTemplates,
  generateGeographicTemplate,
  generateMultiLocationTemplate,
  generateHowToTemplate,
  generateGeneralTopicTemplate,
  shortGeographicTemplates,
  shortHowToTemplates,
  shortGeneralTopicTemplates,
  shortMultiLocationTemplates,
} from './templates';

/**
 * Selects the appropriate template based on keyword type for long descriptions
 */
export const selectLongDescriptionTemplate = (keyword: string): string[] => {
  const {
    isGeographic,
    hasBali,
    hasDigitalNomad,
    hasRizieres,
    hasVoyage,
    hasSolo,
    isHowTo,
    containsMultipleEntities,
    mainSubject
  } = detectKeywordType(keyword);
  
  // Select appropriate template based on detected features
  if (hasDigitalNomad && hasBali) {
    return digitalNomadBaliTemplates;
  } else if (hasVoyage && hasSolo) {
    return soloTravelTemplates;
  } else if (hasRizieres && hasBali) {
    return baliRiceFieldsTemplates;
  } else if (hasDigitalNomad) {
    return digitalNomadTemplates;
  } else if (hasBali) {
    return baliTemplates;
  } else if (hasVoyage) {
    return travelTemplates;
  } else if (isGeographic) {
    if (containsMultipleEntities) {
      const entities = extractEntities(keyword);
      if (entities.length >= 2) {
        return generateMultiLocationTemplate(entities[0], entities[1]);
      }
    }
    return generateGeographicTemplate(keyword);
  } else if (isHowTo) {
    return generateHowToTemplate(keyword, mainSubject);
  }
  
  // Default to general topic templates
  return generateGeneralTopicTemplate(keyword);
};

/**
 * Selects the appropriate template based on keyword type for short descriptions
 */
export const selectShortDescriptionTemplate = (keyword: string): string[] => {
  const {
    isGeographic,
    hasBali,
    hasDigitalNomad,
    hasRizieres,
    hasVoyage,
    hasSolo,
    isHowTo,
    containsMultipleEntities,
    mainSubject
  } = detectKeywordType(keyword);
  
  // Select appropriate template for short descriptions
  if (hasDigitalNomad && hasBali) {
    return shortTemplates.digitalNomadBali;
  } else if (hasVoyage && hasSolo) {
    return shortTemplates.soloTravel;
  } else if (hasRizieres && hasBali) {
    return shortTemplates.baliRiceFields;
  } else if (hasDigitalNomad) {
    return shortTemplates.digitalNomad;
  } else if (hasBali) {
    return shortTemplates.bali;
  } else if (hasVoyage) {
    return shortTemplates.travel;
  } else if (isGeographic) {
    if (containsMultipleEntities) {
      const entities = extractEntities(keyword);
      if (entities.length >= 2) {
        return shortMultiLocationTemplates(entities[0], entities[1]);
      }
    }
    return shortGeographicTemplates(keyword);
  } else if (isHowTo) {
    return shortHowToTemplates(keyword, mainSubject);
  }
  
  // Default to general topic templates
  return shortGeneralTopicTemplates(keyword);
};

/**
 * Selects a random template from an array of templates
 */
export const selectRandomTemplate = (templates: DescriptionTemplate): string => {
  return templates[Math.floor(Math.random() * templates.length)];
};

/**
 * Generates an SEO description based on a keyword and max length
 */
export const generateSeoDescription = (keyword: string, maxLength: number = 155): string => {
  if (!keyword || keyword.trim().length === 0) {
    keyword = "sujet";
  }
  
  let description = "";
  
  // Use long-form templates for descriptions longer than 155 chars
  if (maxLength > 155) {
    const templates = selectLongDescriptionTemplate(keyword);
    description = selectRandomTemplate(templates);
  } else {
    // Use short-form templates for standard meta descriptions
    const templates = selectShortDescriptionTemplate(keyword);
    description = selectRandomTemplate(templates);
  }
  
  // Optimize the description length to match the target length
  return optimizeDescriptionLength(description, maxLength);
};

/**
 * Generates both short and long descriptions for a keyword
 */
export const generateBothDescriptions = (keyword: string): { short: string; long: string } => {
  return {
    short: generateSeoDescription(keyword, 155),
    long: generateSeoDescription(keyword, 500)
  };
};
