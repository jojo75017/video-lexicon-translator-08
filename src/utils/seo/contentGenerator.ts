
// Utility for generating content based on keywords
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

// Generate a geographic-focused article
const generateGeographicContent = (keyword: string, targetWordCount: number): GeneratedContent => {
  const title = `Guide Complet: ${keyword} - Tout ce que vous devez savoir`;

  // Introduction section (about 100 words)
  const intro = `Bienvenue dans notre guide complet sur ${keyword}. Que vous prévoyiez votre première visite ou que vous cherchiez à redécouvrir cette destination fascinante, ce guide vous fournira toutes les informations essentielles pour profiter au maximum de votre voyage. Vous découvrirez les meilleurs sites à visiter, les expériences incontournables, des conseils pratiques sur l'hébergement et la gastronomie locale, ainsi que des astuces pour voyager hors des sentiers battus. Notre équipe a exploré en profondeur ${keyword} pour vous offrir un contenu authentique et actualisé qui répondra à toutes vos questions. Suivez-nous dans cette aventure et préparez-vous à tomber amoureux de ${keyword}, une destination qui ne manquera pas de vous émerveiller par sa diversité et sa richesse culturelle.`;

  // Create sections
  const sections: ContentSection[] = [
    {
      heading: `Découvrir ${keyword}: Les sites incontournables`,
      content: `${keyword} regorge de sites spectaculaires qui méritent votre attention. Parmi les attractions les plus prisées, vous trouverez des monuments historiques témoignant d'un riche passé culturel, des merveilles naturelles à couper le souffle, et des quartiers vibrants où l'on ressent l'âme véritable de la destination. Ne manquez pas de visiter les principaux musées qui abritent des collections remarquables relatant l'histoire et l'art local. Les places centrales et les marchés traditionnels constituent également des points d'intérêt majeurs où vous pourrez vous imprégner de l'atmosphère authentique. Pour les amoureux de la nature, les parcs et jardins offrent des havres de paix en plein cœur de l'agitation. Prévoyez au moins trois jours pour explorer ces sites essentiels, en commençant tôt le matin pour éviter les foules. Un conseil de professionnel: achetez vos billets en ligne à l'avance pour les attractions principales et envisagez des visites guidées pour enrichir votre expérience de détails historiques fascinants que vous pourriez manquer autrement.`
    },
    {
      heading: `Comment se déplacer à ${keyword}`,
      content: `Se déplacer efficacement à ${keyword} est essentiel pour maximiser votre temps et profiter pleinement de votre séjour. Le réseau de transport public est généralement bien développé, avec des options allant des métros et bus aux tramways, selon la taille de la destination. Procurez-vous une carte de transport multimodale qui vous permettra des économies substantielles si vous prévoyez plusieurs déplacements quotidiens. Les taxis et services de VTC sont également disponibles, mais comparez les tarifs avant de faire votre choix. Pour les plus aventureux, la location de vélo représente une alternative écologique et agréable, particulièrement dans les zones planes et bien aménagées. Si vous préférez explorer à votre rythme, la location de voiture peut être avantageuse, mais renseignez-vous sur les conditions de stationnement qui peuvent s'avérer complexes et coûteuses dans certaines zones. Un conseil d'expert: téléchargez l'application locale de transport public qui vous fournira des itinéraires en temps réel et des informations sur les perturbations éventuelles. Quelle que soit l'option choisie, planifiez vos déplacements en tenant compte des heures de pointe pour éviter les congestions.`
    },
    {
      heading: `Où manger et boire à ${keyword}`,
      content: `La gastronomie est un aspect incontournable de l'expérience culturelle à ${keyword}. Des plats traditionnels aux innovations culinaires contemporaines, vous trouverez une gamme diversifiée d'options pour tous les budgets et toutes les préférences. Commencez votre journée dans les cafés locaux où vous pourrez savourer des pâtisseries fraîches accompagnées d'un café préparé selon la tradition locale. Pour le déjeuner, explorez les marchés alimentaires qui proposent des plats préparés sur place avec des ingrédients frais et locaux. Le soir, les quartiers gastronomiques s'animent avec des restaurants proposant aussi bien des menus dégustation sophistiqués que des options plus décontractées et abordables. Ne manquez pas d'essayer les spécialités régionales, souvent préparées selon des recettes transmises de génération en génération. Pour une expérience authentique, éloignez-vous des zones touristiques et recherchez les établissements fréquentés par les habitants. La dégustation de vins et spiritueux locaux complète parfaitement votre exploration culinaire. Réservez à l'avance pour les restaurants les plus réputés, particulièrement pendant la haute saison touristique. Un conseil de connaisseur: demandez aux habitants leurs recommandations, ils connaissent souvent des trésors cachés que les guides touristiques ne mentionnent pas.`
    },
    {
      heading: `Quand visiter ${keyword}: Saisons et événements`,
      content: `Le choix de la période idéale pour visiter ${keyword} dépendra de vos préférences personnelles et des activités que vous souhaitez privilégier. La haute saison touristique, généralement en été, offre un temps optimal mais s'accompagne de foules plus importantes et de tarifs plus élevés. Si vous préférez un séjour plus tranquille et économique, envisagez les périodes d'épaule, au printemps et en automne, qui bénéficient encore d'un climat agréable avec moins d'affluence. Chaque saison présente ses avantages: l'été est parfait pour les activités extérieures et les festivals culturels, l'automne révèle des paysages colorés et des vendanges dans les régions viticoles, le printemps apporte un renouveau avec des jardins en fleurs, tandis que l'hiver peut offrir une atmosphère magique, particulièrement lors des marchés de Noël ou des sports d'hiver dans les régions montagneuses. Consultez le calendrier des événements locaux avant de planifier votre voyage - les festivals traditionnels, expositions artistiques ou événements sportifs peuvent considérablement enrichir votre expérience. Un conseil d'initié: réservez votre hébergement plusieurs mois à l'avance si votre visite coïncide avec un événement majeur, car les disponibilités se raréfient rapidement pendant ces périodes.`
    },
    {
      heading: `Conseils pratiques pour votre séjour à ${keyword}`,
      content: `Pour un séjour sans accroc à ${keyword}, quelques conseils pratiques s'imposent. Concernant la monnaie, renseignez-vous sur les options de paiement les plus courantes - certains endroits privilégient les espèces tandis que d'autres acceptent largement les cartes bancaires. Les prises électriques et adaptateurs varient selon la région, donc équipez-vous en conséquence. La connectivité internet est généralement bonne dans les zones urbaines, mais vérifiez les options de forfaits de données mobiles si vous prévoyez de voyager dans des zones rurales. En matière de sécurité, ${keyword} est globalement sûr pour les touristes, mais restez vigilant dans les zones très fréquentées où les pickpockets peuvent opérer. Familiarisez-vous avec les numéros d'urgence locaux et l'emplacement des services médicaux. Les pourboires et étiquettes sociales varient considérablement: informez-vous sur les pratiques locales pour éviter les faux pas culturels. Si vous voyagez avec des enfants ou avez des besoins spécifiques d'accessibilité, recherchez à l'avance les installations adaptées. Un dernier conseil d'expert: téléchargez des cartes hors ligne et des applications de traduction pour faciliter votre navigation et communication, même sans connexion internet.`
    }
  ];

  return { title, intro, sections };
};

// Generate a product/service focused article
const generateProductContent = (keyword: string, targetWordCount: number): GeneratedContent => {
  const title = `Guide Complet: Tout ce que vous devez savoir sur ${keyword}`;

  // Introduction section
  const intro = `Bienvenue dans notre guide exhaustif sur ${keyword}. Que vous soyez novice ou que vous cherchiez à approfondir vos connaissances, cet article vous fournira toutes les informations essentielles pour comprendre et maîtriser ce sujet. Nous aborderons les fondamentaux, les critères de choix, les meilleures pratiques, ainsi que des conseils d'experts pour vous aider à prendre des décisions éclairées. Notre équipe a méticuleusement recherché et analysé ${keyword} pour vous offrir un contenu à jour et pertinent qui répond à toutes vos questions. Suivez ce guide pas à pas et découvrez comment tirer le meilleur parti de ${keyword} dans votre contexte spécifique.`;

  // Create sections
  const sections: ContentSection[] = [
    {
      heading: `Qu'est-ce que ${keyword}? Définition et principes fondamentaux`,
      content: `${keyword} désigne un concept ou produit qui joue un rôle significatif dans son domaine spécifique. Pour bien comprendre son importance, il est essentiel d'en saisir les principes fondamentaux et l'évolution historique. À l'origine développé pour répondre à des besoins précis, ${keyword} a considérablement évolué au fil du temps, intégrant des innovations technologiques et s'adaptant aux changements du marché. Les caractéristiques distinctives qui définissent ${keyword} incluent sa polyvalence, sa fiabilité et sa capacité à s'adapter à différents contextes d'utilisation. Dans l'écosystème actuel, ${keyword} occupe une position stratégique, se distinguant de solutions alternatives par ses spécificités uniques. Comprendre ces fondamentaux est crucial car ils constituent la base sur laquelle reposent toutes les applications et utilisations avancées que nous explorerons dans les sections suivantes. Cette compréhension vous permettra d'appréhender plus efficacement les critères de sélection et les meilleures pratiques associées à ${keyword}, vous aidant ainsi à maximiser sa valeur dans votre contexte personnel ou professionnel.`
    },
    {
      heading: `Les avantages et inconvénients de ${keyword}`,
      content: `L'analyse objective des avantages et inconvénients de ${keyword} est essentielle pour évaluer sa pertinence dans votre situation spécifique. Parmi les bénéfices majeurs, on note généralement une amélioration significative de l'efficacité opérationnelle, une réduction des coûts à long terme et une adaptabilité remarquable à différents environnements d'utilisation. La facilité d'intégration avec d'autres systèmes existants représente également un atout considérable. De plus, ${keyword} offre souvent des fonctionnalités innovantes que les alternatives ne proposent pas encore. Cependant, il convient de reconnaître certaines limitations. L'investissement initial peut s'avérer conséquent, tant en termes financiers que de ressources nécessaires à l'implémentation. La courbe d'apprentissage peut être abrupte pour les nouveaux utilisateurs, nécessitant une période d'adaptation et de formation. Dans certains cas spécifiques, des problèmes de compatibilité avec des systèmes anciens ont été signalés. Il est également important de considérer les exigences en matière de maintenance régulière pour garantir des performances optimales. Cette évaluation équilibrée vous permettra de déterminer si ${keyword} correspond véritablement à vos besoins et contraintes, et d'anticiper les défis potentiels liés à son adoption ou à son utilisation.`
    },
    {
      heading: `Comment choisir le bon ${keyword} pour vos besoins`,
      content: `Sélectionner le ${keyword} idéal nécessite une approche méthodique basée sur une analyse approfondie de vos besoins spécifiques. Commencez par identifier clairement les objectifs que vous souhaitez atteindre et les fonctionnalités essentielles correspondant à votre utilisation prévue. Établissez une liste hiérarchisée de critères d'évaluation incluant des facteurs comme la performance, la fiabilité, l'évolutivité et les options de personnalisation. Le rapport qualité-prix doit être considéré dans une perspective à long terme, en tenant compte non seulement du coût d'acquisition initial mais également des frais de maintenance et de mise à niveau futurs. La compatibilité avec votre infrastructure existante ou vos autres outils représente également un critère décisif pour éviter des complications d'intégration. N'hésitez pas à consulter des évaluations indépendantes, des études de cas pertinentes et des témoignages d'utilisateurs partageant un profil similaire au vôtre. Si possible, testez différentes options avant de prendre une décision définitive, en utilisant des versions d'essai ou des démonstrations pour évaluer l'expérience utilisateur réelle. Enfin, examinez attentivement les services après-vente proposés, notamment le support technique, les garanties et la disponibilité des mises à jour, car ces éléments influenceront considérablement votre satisfaction à long terme.`
    },
    {
      heading: `Les meilleures pratiques d'utilisation de ${keyword}`,
      content: `Optimiser l'utilisation de ${keyword} requiert l'application de meilleures pratiques éprouvées, développées à partir d'expériences collectives dans le domaine. Une configuration initiale méticuleuse constitue le fondement d'une expérience réussie - prenez le temps de personnaliser les paramètres en fonction de vos besoins spécifiques plutôt que de vous contenter des options par défaut. Adoptez une approche systématique pour la formation des utilisateurs, en développant une documentation claire et en organisant des sessions pratiques qui accélèrent la maîtrise de l'outil. L'intégration progressive représente généralement une stratégie plus efficace qu'une implémentation immédiate à grande échelle, permettant d'identifier et de résoudre les problèmes potentiels avant un déploiement complet. Établissez des procédures de maintenance préventive régulière incluant des vérifications de performance, des mises à jour et l'optimisation des ressources. La sécurité doit demeurer une priorité constante, avec l'application rigoureuse des mises à jour de sécurité et l'adhésion aux protocoles recommandés. Mettez en place un système de suivi des performances avec des indicateurs clés pertinents pour évaluer objectivement les bénéfices obtenus et identifier les domaines d'amélioration potentielle. Restez informé des nouvelles fonctionnalités et des évolutions du produit en vous connectant à la communauté des utilisateurs et en suivant les ressources officielles. Ces pratiques vous permettront d'exploiter pleinement le potentiel de ${keyword} tout en minimisant les risques et les difficultés techniques.`
    },
    {
      heading: `Tendances futures et évolutions de ${keyword}`,
      content: `L'avenir de ${keyword} s'annonce particulièrement dynamique, avec plusieurs tendances émergentes qui façonneront son évolution dans les années à venir. L'intégration de technologies d'intelligence artificielle et d'apprentissage automatique transforme progressivement les capacités fondamentales de ${keyword}, permettant une personnalisation plus poussée et une prise de décision autonome. La connectivité améliorée, notamment via l'Internet des objets, étend considérablement les possibilités d'application et d'intégration dans des écosystèmes plus larges. Les préoccupations croissantes concernant la durabilité environnementale influencent également le développement, avec une attention accrue portée à l'optimisation énergétique et à la réduction de l'empreinte carbone. Sur le plan réglementaire, de nouvelles normes et exigences en matière de confidentialité des données et de sécurité impacteront certainement la conception et l'utilisation future de ${keyword}. Le modèle économique évolue également, avec une transition notable vers des solutions basées sur l'abonnement offrant une plus grande flexibilité aux utilisateurs. Pour rester à la pointe, il sera essentiel de surveiller ces développements et d'adapter votre stratégie d'utilisation ou d'implémentation en conséquence. Les organisations et individus capables d'anticiper ces changements et de s'y adapter rapidement bénéficieront d'un avantage compétitif significatif dans leur domaine respectif.`
    }
  ];

  return { title, intro, sections };
};

// Main function to generate content based on keyword and target word count
export const generateContentWithWordCount = (keyword: string, targetWordCount: number = 800): GeneratedContent => {
  // Determine if the keyword is geographic or product-related
  const isGeographic = detectGeographicKeyword(keyword);
  
  // Generate appropriate content based on keyword type
  const content = isGeographic ? 
    generateGeographicContent(keyword, targetWordCount) : 
    generateProductContent(keyword, targetWordCount);
  
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
    "Il est important de noter que cette approche présente de nombreux avantages dans diverses situations.",
    "Comme de nombreux experts le soulignent, cette méthode s'est avérée efficace dans la plupart des contextes.",
    "Les recherches récentes confirment la validité de ces principes dans différents scénarios d'application.",
    "En analysant les tendances actuelles, on constate une évolution significative des pratiques dans ce domaine.",
    "Les témoignages d'utilisateurs expérimentés confirment la pertinence de ces recommandations.",
    "En tenant compte des spécificités de chaque situation, ces conseils peuvent être adaptés selon vos besoins particuliers."
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
