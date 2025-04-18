
export const generateTitleFromLocation = (location: string): string => {
  // Nettoyer et formater la localisation
  const cleanLocation = location.trim().toLowerCase();
  
  // Préfixes variés pour le titre
  const prefixes = [
    "Découvrez",
    "Explorez",
    "Visitez",
    "Voyage à",
    "Les merveilles de"
  ];
  
  // Suffixes spécifiques selon la localisation
  const locationSuffixes: Record<string, string[]> = {
    'finlande': [': nature et lacs', ': aurores boréales', ': magie nordique'],
    'corse': [': île de beauté', ': plages et montagnes', ': nature sauvage'],
    'grece': [': îles et histoire', ': culture millénaire', ': beauté méditerranéenne'],
    'grèce': [': îles et histoire', ': culture millénaire', ': beauté méditerranéenne'],
    'paris': [': ville lumière', ': art et culture', ': ville romantique'],
    'bordeaux': [': ville du vin', ': art de vivre', ': patrimoine unique'],
    'france': [': destination magique', ': art de vivre', ': trésors cachés'],
    'vietnam': [': traditions et paysages', ': saveurs d\'Asie', ': culture authentique']
  };

  // Sélection aléatoire d'un préfixe
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  // Sélection du suffixe approprié
  let suffix = '';
  if (locationSuffixes[cleanLocation]) {
    suffix = locationSuffixes[cleanLocation][Math.floor(Math.random() * locationSuffixes[cleanLocation].length)];
  }

  // Construction du titre
  let title = `${prefix} ${location.charAt(0).toUpperCase() + location.slice(1)}`;
  if (suffix) {
    title += suffix;
  }

  // Limiter à 60 caractères
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }

  return title;
};
