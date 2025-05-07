
/**
 * Adjusts the description length to match the target length without cutting words mid-sentence
 */
export const adjustDescriptionLength = (description: string, maxLength: number): string => {
  // If description exceeds max length, truncate it properly
  if (description.length > maxLength) {
    // Find the last space before the limit
    const lastSpace = description.lastIndexOf(' ', maxLength - 3);
    if (lastSpace !== -1) {
      return description.substring(0, lastSpace) + "...";
    } else {
      // As last resort, cut strictly
      return description.substring(0, maxLength - 3) + "...";
    }
  }
  return description;
};

/**
 * Extends a description that's too short to reach closer to the target length
 */
export const extendDescription = (description: string, maxLength: number): string => {
  if (description.length < maxLength - 5) {
    const extensions = [
      " Découvrez nos conseils exclusifs!",
      " Informations à jour pour 2024.",
      " Guide complet et détaillé.",
      " Expertise reconnue dans le domaine.",
      " Ressource indispensable pour réussir."
    ];
    
    for (const extension of extensions) {
      if (description.length + extension.length <= maxLength) {
        return description + extension;
      }
    }
  }
  return description;
};

/**
 * Ensures the meta description has proper length for SEO (especially for standard 155 char limit)
 */
export const optimizeDescriptionLength = (description: string, maxLength: number): string => {
  // First truncate if needed
  let result = adjustDescriptionLength(description, maxLength);
  
  // Then extend if too short
  result = extendDescription(result, maxLength);
  
  // Special case for standard meta descriptions
  if (maxLength === 155 && result.length < 150) {
    // Add extra content for short standard descriptions
    result = result.replace("...", "") + 
      " Conseils d'experts et astuces exclusives pour optimiser votre expérience.";
    
    // Recheck length after adding content
    if (result.length > maxLength) {
      const lastSpace = result.lastIndexOf(' ', maxLength - 3);
      result = result.substring(0, lastSpace) + "...";
    }
  }
  
  return result;
};
