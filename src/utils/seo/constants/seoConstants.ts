
// Mots à ignorer dans l'analyse
export const stopWords = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'est', 'et', 'en', 'à', 'pour',
  'dans', 'par', 'sur', 'de', 'du', 'ce', 'cette', 'ces', 'mon', 'ton',
  'son', 'notre', 'votre', 'leur', 'qui', 'que', 'quoi', 'dont', 'où'
]);

// Termes géographiques pour la détection
export const geographicTerms = [
  // Pays 
  "france", "espagne", "italie", "allemagne", "portugal", "états-unis", "canada", 
  "japon", "chine", "australie", "brésil", "mexique", "maroc", "égypte", "thaïlande",
  "vietnam", "cambodge", "inde", "namibie", "botswana", "afrique", "europe", "asie",
  "amérique", "océanie",
  
  // Villes
  "paris", "lyon", "marseille", "bordeaux", "lille", "toulouse", "nice", "nantes",
  "strasbourg", "montpellier", "barcelone", "madrid", "rome", "berlin", "munich",
  "londres", "new york", "tokyo", "kyoto", "bangkok", "prague", "vienne", "amsterdam",
  "lisbonne", "porto",
  
  // Régions
  "bretagne", "normandie", "provence", "alsace", "corse", "alpes", "pyrénées",
  "côte d'azur", "toscane", "andalousie", "bavière", "catalogne"
];
