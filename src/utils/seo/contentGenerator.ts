
// Utility for generating travel-focused content based on keywords
import { detectGeographicKeyword } from './generators/titleGenerator';

type ContentSection = {
  heading: string;
  content: string;
};

type GeneratedContent = {
  title: string;
  intro: string;
  sections: ContentSection[];
};

// Function to count words in a string
const countWords = (text: string): number => {
  return text.split(/\s+/).filter(word => word.length > 0).length;
};

// Generate a travel/geographic-focused article
const generateGeographicContent = (keyword: string, targetWordCount: number): GeneratedContent => {
  const geoLocation = detectGeographicKeyword(keyword);
  const locationName = geoLocation || keyword;
  const title = `Guide Complet: Voyage à ${locationName} - Tout ce que vous devez savoir`;

  // Introduction section (about 100 words)
  const intro = `Bienvenue dans notre guide complet sur ${locationName}. Que vous prévoyiez votre première visite ou que vous cherchiez à redécouvrir cette destination fascinante, ce guide vous fournira toutes les informations essentielles pour profiter au maximum de votre voyage. Vous découvrirez les meilleurs sites à visiter, les expériences incontournables, des conseils pratiques sur l'hébergement et la gastronomie locale, ainsi que des astuces pour voyager hors des sentiers battus. Notre équipe a exploré en profondeur ${locationName} pour vous offrir un contenu authentique et actualisé qui répondra à toutes vos questions. Suivez-nous dans cette aventure et préparez-vous à tomber amoureux de ${locationName}, une destination qui ne manquera pas de vous émerveiller par sa diversité et sa richesse culturelle.`;

  // Create sections
  const sections: ContentSection[] = [
    {
      heading: `Découvrir ${locationName}: Les sites incontournables`,
      content: `${locationName} regorge de sites spectaculaires qui méritent votre attention. Parmi les attractions les plus prisées, vous trouverez des monuments historiques témoignant d'un riche passé culturel, des merveilles naturelles à couper le souffle, et des quartiers vibrants où l'on ressent l'âme véritable de la destination. Ne manquez pas de visiter les principaux musées qui abritent des collections remarquables relatant l'histoire et l'art local. Les places centrales et les marchés traditionnels constituent également des points d'intérêt majeurs où vous pourrez vous imprégner de l'atmosphère authentique. Pour les amoureux de la nature, les parcs et jardins offrent des havres de paix en plein cœur de l'agitation. Prévoyez au moins trois jours pour explorer ces sites essentiels, en commençant tôt le matin pour éviter les foules. Un conseil de professionnel: achetez vos billets en ligne à l'avance pour les attractions principales et envisagez des visites guidées pour enrichir votre expérience de détails historiques fascinants que vous pourriez manquer autrement.`
    },
    {
      heading: `Comment se déplacer à ${locationName}`,
      content: `Se déplacer efficacement à ${locationName} est essentiel pour maximiser votre temps et profiter pleinement de votre séjour. Le réseau de transport public est généralement bien développé, avec des options allant des métros et bus aux tramways, selon la taille de la destination. Procurez-vous une carte de transport multimodale qui vous permettra des économies substantielles si vous prévoyez plusieurs déplacements quotidiens. Les taxis et services de VTC sont également disponibles, mais comparez les tarifs avant de faire votre choix. Pour les plus aventureux, la location de vélo représente une alternative écologique et agréable, particulièrement dans les zones planes et bien aménagées. Si vous préférez explorer à votre rythme, la location de voiture peut être avantageuse, mais renseignez-vous sur les conditions de stationnement qui peuvent s'avérer complexes et coûteuses dans certaines zones. Un conseil d'expert: téléchargez l'application locale de transport public qui vous fournira des itinéraires en temps réel et des informations sur les perturbations éventuelles. Quelle que soit l'option choisie, planifiez vos déplacements en tenant compte des heures de pointe pour éviter les congestions.`
    },
    {
      heading: `Où manger et boire à ${locationName}`,
      content: `La gastronomie est un aspect incontournable de l'expérience culturelle à ${locationName}. Des plats traditionnels aux innovations culinaires contemporaines, vous trouverez une gamme diversifiée d'options pour tous les budgets et toutes les préférences. Commencez votre journée dans les cafés locaux où vous pourrez savourer des pâtisseries fraîches accompagnées d'un café préparé selon la tradition locale. Pour le déjeuner, explorez les marchés alimentaires qui proposent des plats préparés sur place avec des ingrédients frais et locaux. Le soir, les quartiers gastronomiques s'animent avec des restaurants proposant aussi bien des menus dégustation sophistiqués que des options plus décontractées et abordables. Ne manquez pas d'essayer les spécialités régionales, souvent préparées selon des recettes transmises de génération en génération. Pour une expérience authentique, éloignez-vous des zones touristiques et recherchez les établissements fréquentés par les habitants. La dégustation de vins et spiritueux locaux complète parfaitement votre exploration culinaire. Réservez à l'avance pour les restaurants les plus réputés, particulièrement pendant la haute saison touristique. Un conseil de connaisseur: demandez aux habitants leurs recommandations, ils connaissent souvent des trésors cachés que les guides touristiques ne mentionnent pas.`
    },
    {
      heading: `Quand visiter ${locationName}: Saisons et événements`,
      content: `Le choix de la période idéale pour visiter ${locationName} dépendra de vos préférences personnelles et des activités que vous souhaitez privilégier. La haute saison touristique, généralement en été, offre un temps optimal mais s'accompagne de foules plus importantes et de tarifs plus élevés. Si vous préférez un séjour plus tranquille et économique, envisagez les périodes d'épaule, au printemps et en automne, qui bénéficient encore d'un climat agréable avec moins d'affluence. Chaque saison présente ses avantages: l'été est parfait pour les activités extérieures et les festivals culturels, l'automne révèle des paysages colorés et des vendanges dans les régions viticoles, le printemps apporte un renouveau avec des jardins en fleurs, tandis que l'hiver peut offrir une atmosphère magique, particulièrement lors des marchés de Noël ou des sports d'hiver dans les régions montagneuses. Consultez le calendrier des événements locaux avant de planifier votre voyage - les festivals traditionnels, expositions artistiques ou événements sportifs peuvent considérablement enrichir votre expérience. Un conseil d'initié: réservez votre hébergement plusieurs mois à l'avance si votre visite coïncide avec un événement majeur, car les disponibilités se raréfient rapidement pendant ces périodes.`
    },
    {
      heading: `Conseils pratiques pour votre séjour à ${locationName}`,
      content: `Pour un séjour sans accroc à ${locationName}, quelques conseils pratiques s'imposent. Concernant la monnaie, renseignez-vous sur les options de paiement les plus courantes - certains endroits privilégient les espèces tandis que d'autres acceptent largement les cartes bancaires. Les prises électriques et adaptateurs varient selon la région, donc équipez-vous en conséquence. La connectivité internet est généralement bonne dans les zones urbaines, mais vérifiez les options de forfaits de données mobiles si vous prévoyez de voyager dans des zones rurales. En matière de sécurité, ${locationName} est globalement sûr pour les touristes, mais restez vigilant dans les zones très fréquentées où les pickpockets peuvent opérer. Familiarisez-vous avec les numéros d'urgence locaux et l'emplacement des services médicaux. Les pourboires et étiquettes sociales varient considérablement: informez-vous sur les pratiques locales pour éviter les faux pas culturels. Si vous voyagez avec des enfants ou avez des besoins spécifiques d'accessibilité, recherchez à l'avance les installations adaptées. Un dernier conseil d'expert: téléchargez des cartes hors ligne et des applications de traduction pour faciliter votre navigation et communication, même sans connexion internet.`
    }
  ];

  return { title, intro, sections };
};

// Generate a travel tips focused article
const generateTravelTipsContent = (keyword: string, targetWordCount: number): GeneratedContent => {
  const title = `Guide Complet: ${keyword} - Conseils et astuces de voyage`;

  // Introduction section
  const intro = `Bienvenue dans notre guide complet sur ${keyword}. Que vous soyez un voyageur novice ou expérimenté, cet article vous fournira des conseils précieux et des astuces pratiques pour améliorer votre expérience de voyage. Nous aborderons les aspects essentiels de la planification, les meilleures pratiques pendant votre séjour, ainsi que des recommandations d'experts pour profiter pleinement de chaque destination. Notre équipe de voyageurs passionnés a rassemblé ces informations pour vous aider à créer des souvenirs inoubliables tout en évitant les pièges courants. Suivez ce guide et découvrez comment transformer votre prochain voyage en une aventure exceptionnelle, enrichissante et sans stress.`;

  // Create sections
  const sections: ContentSection[] = [
    {
      heading: `Planifier votre voyage: Les fondamentaux à maîtriser`,
      content: `Une planification minutieuse est la clé d'un voyage réussi. Commencez par définir votre budget global, incluant non seulement les transports et l'hébergement, mais aussi les repas, les activités et une marge pour les imprévus. Recherchez la meilleure période pour visiter votre destination en fonction du climat, des événements locaux et de l'affluence touristique. Pour économiser, réservez vos vols environ 2 à 3 mois à l'avance et utilisez des comparateurs pour identifier les meilleures offres. Concernant l'hébergement, examinez toutes les options: hôtels, auberges, locations saisonnières ou échanges de maisons. Créez un itinéraire flexible qui équilibre sites incontournables et temps libre pour les découvertes spontanées. Vérifiez les exigences en matière de visa et de santé (vaccinations recommandées) bien avant votre départ. Souscrivez à une assurance voyage complète couvrant les frais médicaux, les annulations et vos biens. Enfin, téléchargez des applications utiles comme des cartes hors ligne, des traducteurs et des guides de voyage pour faciliter votre séjour. Cette phase de préparation, bien que parfois fastidieuse, est un investissement qui rendra votre expérience beaucoup plus agréable et vous permettra d'aborder votre aventure avec sérénité.`
    },
    {
      heading: `Comment faire ses bagages efficacement`,
      content: `L'art de faire sa valise est souvent sous-estimé, mais il peut considérablement améliorer votre confort en voyage. Adoptez la technique de l'empilement roulé pour maximiser l'espace et minimiser les plis. Privilégiez les vêtements polyvalents qui peuvent être superposés et combinés pour créer différentes tenues. Optez pour des tissus légers qui sèchent rapidement et ne se froissent pas facilement. Limitez les chaussures à trois paires maximum: des baskets confortables pour la marche, des chaussures élégantes pour les sorties et éventuellement des sandales. Utilisez des pochettes de compression ou des sacs de rangement pour organiser vos affaires par catégorie. Pour les produits liquides, investissez dans des contenants réutilisables conformes aux restrictions aériennes et placez-les dans un sac étanche. N'oubliez pas un kit de premiers secours basique avec vos médicaments habituels, des analgésiques, des pansements et des médicaments contre les troubles digestifs. Emportez un adaptateur universel pour vos appareils électroniques et une batterie externe pour votre téléphone. Si vous voyagez avec uniquement un bagage à main, renseignez-vous sur les restrictions de poids et de dimensions de votre compagnie aérienne. Enfin, gardez toujours vos objets de valeur, documents importants et médicaments essentiels dans votre bagage à main, jamais dans votre valise enregistrée.`
    },
    {
      heading: `Conseils pour voyager de façon économique`,
      content: `Voyager n'est pas nécessairement synonyme de dépenses excessives. De nombreuses stratégies permettent de réduire considérablement votre budget sans compromettre la qualité de votre expérience. Pour l'hébergement, envisagez les auberges de jeunesse, le couchsurfing ou les échanges de maisons comme alternatives aux hôtels traditionnels. La restauration représente souvent une part importante du budget: privilégiez les marchés locaux et les petits commerces éloignés des zones touristiques, et n'hésitez pas à préparer vous-même certains repas si vous disposez d'une cuisine. Pour les transports, les cartes de transport illimitées sont généralement plus économiques que les tickets individuels, et les services de partage comme le covoiturage offrent une alternative intéressante aux locations de voiture. Concernant les activités, recherchez les jours de gratuité des musées, les visites guidées à prix libre et les attractions naturelles qui ne nécessitent pas de droit d'entrée. Les applications de cashback et les cartes bancaires sans frais à l'étranger vous permettront d'optimiser vos dépenses quotidiennes. Voyager hors saison vous garantit non seulement des tarifs plus bas mais aussi une expérience plus authentique avec moins de touristes. Enfin, privilégiez la qualité à la quantité: mieux vaut explorer en profondeur une région que de multiplier les destinations à un rythme effréné, ce qui augmente inévitablement les coûts de transport.`
    },
    {
      heading: `Immersion culturelle: Vivre comme un local`,
      content: `L'immersion culturelle transforme un simple voyage touristique en une expérience profondément enrichissante. Pour véritablement connecter avec la culture locale, commencez par apprendre quelques phrases de base dans la langue du pays - même des salutations simples et des formules de politesse seront grandement appréciées par les habitants. Privilégiez les quartiers résidentiels plutôt que les zones exclusivement touristiques pour votre hébergement. Les marchés locaux offrent une fenêtre fascinante sur la vie quotidienne: observez les interactions, découvrez les produits régionaux et n'hésitez pas à engager la conversation avec les commerçants. Participez à des ateliers d'artisanat ou de cuisine traditionnelle pour apprendre directement des experts locaux. Les transports en commun, bien que parfois intimidants, vous permettent d'observer la vie quotidienne authentique des résidents. Recherchez les événements culturels qui se déroulent pendant votre séjour: festivals, concerts ou célébrations traditionnelles. Les cafés et restaurants fréquentés majoritairement par les locaux vous offriront non seulement une nourriture plus authentique mais aussi des opportunités de rencontres. Avant votre départ, informez-vous sur les coutumes et règles de politesse locales pour éviter les faux pas culturels. Enfin, abordez chaque interaction avec respect, curiosité et ouverture d'esprit - votre attitude déterminera largement la qualité des échanges et la profondeur de votre immersion culturelle.`
    },
    {
      heading: `Photographie de voyage: Capturer des souvenirs mémorables`,
      content: `La photographie de voyage permet de préserver vos expériences tout en développant votre sensibilité artistique. Pour des clichés qui se démarquent, évitez de photographier uniquement les sites touristiques sous leurs angles classiques - recherchez des perspectives originales en variant les hauteurs et les cadrages. La lumière dorée du lever et du coucher du soleil, appelée "heure dorée", transforme magiquement les paysages et mérite quelques réveils matinaux. Pour capturer l'essence d'un lieu, portez attention aux détails révélateurs: architecture vernaculaire, scènes de vie quotidienne, expressions des visages. Apprenez les bases de la composition photographique comme la règle des tiers ou l'utilisation des lignes directrices pour guider le regard. N'hésitez pas à inclure des personnes dans vos paysages pour donner une échelle et une dimension humaine à vos images, en demandant toujours leur permission au préalable. Équipez-vous judicieusement: un appareil trop encombrant risque de rester à l'hôtel; privilégiez un boîtier compact de qualité ou un smartphone récent avec un objectif grand-angle. Protégez votre matériel des conditions météorologiques et sauvegardez régulièrement vos images sur un support externe ou dans le cloud. Enfin, équilibrez votre désir de documenter avec le besoin de vivre pleinement l'instant présent - les meilleures photos naissent souvent d'une connexion authentique avec le moment plutôt que d'une quête obsessionnelle du cliché parfait.`
    }
  ];

  return { title, intro, sections };
};

// Main function to generate content based on keyword and target word count
export const generateContentWithWordCount = (keyword: string, targetWordCount: number = 800): GeneratedContent => {
  // Determine if the keyword is geographic or travel-related
  const isGeographic = detectGeographicKeyword(keyword);
  
  // Generate appropriate content based on keyword type
  const content = isGeographic ? 
    generateGeographicContent(keyword, targetWordCount) : 
    generateTravelTipsContent(keyword, targetWordCount);
  
  // Calculate current word count
  let currentWordCount = countWords(content.intro);
  content.sections.forEach(section => {
    currentWordCount += countWords(section.content);
  });
  
  // Adjust content length if needed
  if (Math.abs(currentWordCount - targetWordCount) > targetWordCount * 0.1) {
    // This is a simple approach - in a real implementation, you would have more
    // sophisticated content expansion/reduction algorithms
    const ratio = targetWordCount / currentWordCount;
    
    // Adjust intro and section content proportionally
    content.sections = content.sections.map(section => ({
      ...section,
      content: adjustContentLength(section.content, ratio)
    }));
  }
  
  return content;
};

// Helper function to adjust content length
const adjustContentLength = (text: string, ratio: number): string => {
  // This is a simplified approach
  // In practice, you would use more sophisticated NLP techniques
  if (ratio > 1.1) {
    // Need to expand content
    return text + " " + generateFillerContent(text, ratio);
  } else if (ratio < 0.9) {
    // Need to reduce content
    const words = text.split(/\s+/);
    const targetWords = Math.floor(words.length * ratio);
    return words.slice(0, targetWords).join(" ");
  }
  return text;
};

// Generate filler content to reach target word count
const generateFillerContent = (baseText: string, ratio: number): string => {
  const fillerPhrases = [
    "Ce lieu présente également d'autres aspects intéressants que les voyageurs apprécient particulièrement.",
    "Les voyageurs expérimentés recommandent fortement cette approche pour une expérience plus authentique.",
    "Selon les avis recueillis auprès des visiteurs, cette expérience compte parmi les plus mémorables du séjour.",
    "En analysant les tendances actuelles des voyages dans cette région, on constate une préférence croissante pour ce type d'expérience.",
    "Les témoignages des voyageurs confirment la pertinence de ces recommandations pour profiter pleinement de votre séjour.",
    "En tenant compte des spécificités de chaque saison, ces conseils peuvent être adaptés pour optimiser votre expérience de voyage."
  ];
  
  // Determine how much filler is needed
  const baseWords = baseText.split(/\s+/).length;
  const targetWords = Math.ceil(baseWords * ratio);
  const wordsToAdd = targetWords - baseWords;
  
  if (wordsToAdd <= 0) return "";
  
  // Add filler phrases until we reach the target
  let filler = "";
  let i = 0;
  while (filler.split(/\s+/).length < wordsToAdd && i < 10) {
    // Avoid infinite loop by limiting iterations
    filler += " " + fillerPhrases[Math.floor(Math.random() * fillerPhrases.length)];
    i++;
  }
  
  return filler;
};
