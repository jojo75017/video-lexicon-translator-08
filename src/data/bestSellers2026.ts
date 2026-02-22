export interface BestSeller {
  id: number;
  title: string;
  subtitle: string;
  preface: string;
  category: string;
  icon: string;
  trending?: boolean;
}

export const bestSellerCategories = [
  { key: 'romance', label: '💕 Romance', color: 'from-pink-500 to-rose-600' },
  { key: 'thriller', label: '🔪 Thrillers', color: 'from-red-600 to-red-800' },
  { key: 'espionnage', label: '🕵️ Espionnage', color: 'from-slate-600 to-slate-800' },
  { key: 'policier', label: '🔍 Policier', color: 'from-amber-600 to-orange-700' },
  { key: 'ia', label: '🤖 Développement & IA', color: 'from-cyan-500 to-blue-600' },
  { key: 'finance', label: '💰 Finance & Liberté', color: 'from-emerald-500 to-green-700' },
  { key: 'bienetre', label: '🧘 Bien-être & Santé', color: 'from-teal-400 to-emerald-600' },
  { key: 'scifi', label: '🚀 Science-Fiction', color: 'from-violet-500 to-indigo-700' },
];

export const bestSellers2026: BestSeller[] = [
  // ─── ROMANCE ────────────────────────────────────
  {
    id: 1,
    title: "Les Flammes de l'Interdit",
    subtitle: "Dark Romance — Ennemis to Lovers",
    preface: "Quand Léa intègre le cabinet d'avocats le plus impitoyable de Paris, elle ne s'attend pas à croiser celui qui a détruit sa famille. Entre haine viscérale et attraction magnétique, leur combat quotidien va se transformer en une passion dévorante. Un page-turner brûlant qui explore les limites du désir et du pardon. Idéal pour les lectrices de romance intense qui veulent un héros tourmenté et une héroïne indomptable. Ce titre cartonne sur KDP avec un BSR moyen sous les 5 000.",
    category: 'romance',
    icon: '🔥',
    trending: true,
  },
  {
    id: 2,
    title: "Cœurs en Exil",
    subtitle: "Romance Contemporaine — Second Chance",
    preface: "Après dix ans de silence, Emma retrouve son premier amour dans un petit village provençal. Lui est devenu vigneron, elle fuit une vie parisienne en miettes. Entre lavande et vendanges, les souvenirs ressurgissent. Ce roman feel-good mêle nostalgie et renouveau avec une plume lumineuse. Le créneau 'second chance romance' explose sur Amazon avec une demande croissante. Un format de 250 pages parfait pour une lecture en un week-end, avec un fort potentiel de série.",
    category: 'romance',
    icon: '💜',
  },
  {
    id: 3,
    title: "Le Contrat du Milliardaire",
    subtitle: "Romance Milliardaire — Fake Marriage",
    preface: "Pour sauver l'entreprise familiale, Sofia accepte un mariage arrangé avec un homme d'affaires glacial. Le contrat est clair : un an, zéro sentiment. Mais la proximité quotidienne fait voler leurs règles en éclats. La niche 'billionaire romance' reste l'une des plus rentables sur KDP, avec des lecteurs fidèles et un taux de relecture élevé. Ce titre combine tension romantique, luxe et rebondissements pour un succès commercial quasi garanti sur le marché francophone.",
    category: 'romance',
    icon: '💎',
    trending: true,
  },
  {
    id: 4,
    title: "Murmures sous la Pluie",
    subtitle: "Romance Émotionnelle — Slow Burn",
    preface: "Clara, libraire introvertie, et Nathan, musicien de rue, se croisent chaque matin sous le même abribus. Leurs échanges timides deviennent le refuge de deux âmes blessées. Un roman doux et profond qui prend son temps pour construire une histoire d'amour authentique. Le 'slow burn' séduit de plus en plus les lecteurs francophones lassés des romances express. Avec une couverture aquarelle et un titre poétique, ce livre a tous les ingrédients pour performer en autoédition.",
    category: 'romance',
    icon: '🌧️',
  },

  // ─── THRILLERS ──────────────────────────────────
  {
    id: 5,
    title: "72 Heures pour Mourir",
    subtitle: "Thriller Haletant — Compte à Rebours",
    preface: "Un journaliste reçoit une enveloppe contenant la photo de sa fille avec un compte à rebours de 72 heures. Pour la sauver, il devra révéler un secret d'État qui pourrait faire tomber le gouvernement. Chaque chapitre est une heure qui passe. Le format 'countdown thriller' génère un engagement lecteur exceptionnel et des critiques 5 étoiles. Avec des chapitres courts et un rythme effréné, ce concept est optimisé pour le marché KDP où les thrillers dominent le top 100.",
    category: 'thriller',
    icon: '⏰',
    trending: true,
  },
  {
    id: 6,
    title: "La Dernière Confession",
    subtitle: "Thriller Psychologique — Manipulation",
    preface: "Une psychiatre reçoit un nouveau patient qui prétend avoir commis le crime parfait. Séance après séance, elle réalise que c'est elle qui est manipulée. La frontière entre thérapeute et sujet s'effondre dans un jeu de miroirs glaçant. Les thrillers psychologiques français connaissent un âge d'or sur KDP avec des auteurs indépendants qui rivalisent avec les maisons d'édition. Ce concept one-room est économe en recherche et maximise la tension narrative.",
    category: 'thriller',
    icon: '🧠',
  },
  {
    id: 7,
    title: "Effacée",
    subtitle: "Thriller Domestique — Disparition",
    preface: "Un matin, Claire disparaît. Son mari, ses enfants, ses collègues — personne ne se souvient d'elle. Comme si elle n'avait jamais existé. En parallèle, une femme se réveille dans un hôpital sans identité. Le 'domestic thriller' à la Gone Girl continue de fasciner le public francophone. Ce titre exploite le fantasme universel de l'effacement et propose un twist final qui divise les lecteurs — exactement ce qui génère du bouche-à-oreille et des ventes organiques.",
    category: 'thriller',
    icon: '👤',
    trending: true,
  },
  {
    id: 8,
    title: "Le Tueur de Minuit",
    subtitle: "Thriller Serial Killer — Enquête",
    preface: "Chaque nuit à minuit, un corps est découvert dans une ville différente de France. Le seul lien : un origami laissé sur la scène de crime. La commissaire Diane Marchand a 30 jours avant que le tueur ne frappe dans sa propre ville. Le sous-genre 'serial killer' reste le pilier du thriller francophone avec une audience massive et fidèle. Format idéal de 300 pages, parfait pour une série en 3 tomes qui fidélise les lecteurs.",
    category: 'thriller',
    icon: '🌙',
  },

  // ─── ESPIONNAGE ─────────────────────────────────
  {
    id: 9,
    title: "Opération Fantôme",
    subtitle: "Espionnage Géopolitique — Guerre Hybride",
    preface: "Un agent de la DGSE découvre qu'une IA militaire chinoise a infiltré les systèmes de défense européens. Sa mission : neutraliser la menace sans déclencher un conflit mondial. Inspiré de faits réels et nourri par l'actualité géopolitique brûlante, ce roman d'espionnage moderne mêle technologie, diplomatie et action. Le genre connaît un renouveau spectaculaire post-2024, porté par les tensions internationales. Un sujet qui attire aussi bien les lecteurs de fiction que les passionnés de géopolitique.",
    category: 'espionnage',
    icon: '🌍',
    trending: true,
  },
  {
    id: 10,
    title: "Le Protocole Janus",
    subtitle: "Espionnage Technologique — Double Agent",
    preface: "Marc, analyste à la NSA, mène une double vie depuis quinze ans. Quand son handler russe est assassiné, il doit fuir les deux camps qui veulent l'éliminer. Une course-poursuite de Berlin à Istanbul avec un héros moralement ambigu. Le roman d'espionnage technologique séduit un lectorat premium prêt à payer le prix fort pour des intrigues sophistiquées. Avec le bon positionnement KDP, ce type de titre peut atteindre les catégories 'Political Thriller' et 'Technothriller' simultanément.",
    category: 'espionnage',
    icon: '🎭',
  },
  {
    id: 11,
    title: "Taupe",
    subtitle: "Espionnage Classique — Guerre Froide Moderne",
    preface: "Au cœur du MI6, quelqu'un transmet des secrets à Moscou depuis des années. L'enquête interne est confiée à un agent sur le point de prendre sa retraite, qui découvre que le traître pourrait être son plus vieil ami. Un hommage assumé à Le Carré, adapté aux enjeux contemporains. Le nostalgia-thriller d'espionnage attire un lectorat masculin 45+ avec un fort pouvoir d'achat, une cible souvent négligée par les auteurs indépendants mais extrêmement rentable.",
    category: 'espionnage',
    icon: '🕶️',
  },

  // ─── POLICIER ───────────────────────────────────
  {
    id: 12,
    title: "Les Oubliées du Canal",
    subtitle: "Polar Social — Enquête en Milieu Urbain",
    preface: "Trois femmes sans-abri retrouvées mortes près du Canal Saint-Martin. La police classe l'affaire. Une jeune enquêtrice refuse d'abandonner et plonge dans l'univers invisible des marginaux de Paris. Un polar engagé qui dénonce les inégalités tout en offrant une intrigue captivante. Le 'polar social' français est un genre en plein essor, porté par des auteurs comme Olivier Norek. Ce positionnement permet de toucher à la fois les amateurs de polars et les lecteurs de littérature engagée.",
    category: 'policier',
    icon: '🏙️',
    trending: true,
  },
  {
    id: 13,
    title: "Sang d'Encre",
    subtitle: "Polar Régional — Enquête en Bretagne",
    preface: "Un éditeur célèbre est retrouvé noyé dans une fontaine de Quimper, un manuscrit inédit serré contre lui. Le capitaine Le Goff mène l'enquête dans le milieu littéraire breton, où les rivalités sont aussi violentes que les tempêtes. Le polar régional est une machine à best-sellers en France : chaque région a son lectorat captif. La Bretagne, la Provence et l'Alsace dominent les ventes. Un filon inépuisable pour les auteurs KDP qui peuvent décliner le concept par région.",
    category: 'policier',
    icon: '📖',
  },
  {
    id: 14,
    title: "Le Silence des Innocents",
    subtitle: "Polar Judiciaire — Erreur Judiciaire",
    preface: "Un homme sort de prison après 20 ans pour un crime qu'il n'a pas commis. Le lendemain, le vrai coupable est retrouvé mort. Coïncidence ou vengeance parfaite ? Une avocate déterminée reprend l'affaire et découvre une conspiration qui remonte à la magistrature elle-même. Le polar judiciaire passionne le public français, surtout après les podcasts true crime qui ont explosé. Ce titre combine suspense, justice et questionnement moral pour un maximum d'impact commercial.",
    category: 'policier',
    icon: '⚖️',
  },
  {
    id: 15,
    title: "Marée Noire",
    subtitle: "Polar Écologique — Crime Environnemental",
    preface: "Un militant écologiste est assassiné sur une plage landaise le jour où il devait révéler un scandale pétrolier. La gendarmerie locale, sous pression des lobbies, piétine. Une journaliste d'investigation prend le relais. Le 'eco-thriller' est la tendance montante du polar français, surfant sur la conscience environnementale croissante. Ce positionnement unique permet de se démarquer dans les catégories saturées du polar classique tout en touchant un nouveau public sensibilisé aux enjeux climatiques.",
    category: 'policier',
    icon: '🌊',
  },

  // ─── DÉVELOPPEMENT & IA ─────────────────────────
  {
    id: 16,
    title: "IA : Le Guide de Survie 2026",
    subtitle: "Intelligence Artificielle — Guide Pratique",
    preface: "ChatGPT, Claude, Gemini, Midjourney… L'IA bouleverse chaque métier. Ce guide pratique et accessible explique comment utiliser ces outils au quotidien sans se faire remplacer. Avec des tutoriels pas-à-pas, des prompts prêts à l'emploi et des études de cas concrètes. La catégorie 'IA pour débutants' est la plus explosive de KDP en 2026 avec une croissance de 400% des recherches. Premier arrivé, premier servi : le marché francophone est encore largement sous-exploité comparé à l'anglophone.",
    category: 'ia',
    icon: '🤖',
    trending: true,
  },
  {
    id: 17,
    title: "Prompt Engineering Masterclass",
    subtitle: "IA Avancée — Maîtriser les Prompts",
    preface: "95% des utilisateurs d'IA n'exploitent que 10% de son potentiel. Ce livre révèle les techniques avancées de prompt engineering : chaînes de pensée, few-shot learning, system prompts, jailbreaks éthiques et automatisation. Avec 200+ prompts testés et optimisés pour chaque cas d'usage professionnel. Le 'prompt engineering' est devenu une compétence monnayable et les livres sur le sujet se vendent comme des petits pains. Un titre à fort prix (14.99€+) avec des marges exceptionnelles.",
    category: 'ia',
    icon: '⚡',
    trending: true,
  },
  {
    id: 18,
    title: "Gagner sa Vie avec l'IA",
    subtitle: "Business IA — Monétisation",
    preface: "Freelance, entrepreneur ou salarié : l'IA peut multiplier vos revenus par 5. Ce guide révèle 30 business models rentables propulsés par l'intelligence artificielle, du copywriting automatisé à la création de contenu, en passant par le développement d'apps no-code. Chaque modèle est détaillé avec investissement initial, temps nécessaire et revenus potentiels. La demande pour ce type de contenu dépasse largement l'offre en français, créant une fenêtre d'opportunité exceptionnelle pour les auteurs KDP.",
    category: 'ia',
    icon: '💰',
  },
  {
    id: 19,
    title: "L'IA pour les Créatifs",
    subtitle: "IA & Art — Design, Écriture, Musique",
    preface: "Midjourney, DALL-E, Suno, Runway… Les outils d'IA créative transforment artistes et designers en super-créateurs. Ce livre explore comment utiliser l'IA comme assistant créatif sans perdre son âme artistique. Avec des workflows complets pour illustrateurs, écrivains, musiciens et vidéastes. Le créneau 'IA pour créatifs' touche une audience passionnée qui achète impulsivement les guides pratiques. Un excellent complément à votre catalogue si vous publiez déjà dans le développement personnel ou le business.",
    category: 'ia',
    icon: '🎨',
  },

  // ─── FINANCE & LIBERTÉ ──────────────────────────
  {
    id: 20,
    title: "Libre à 40 Ans",
    subtitle: "Liberté Financière — Plan d'Action",
    preface: "Investir 500€ par mois pendant 15 ans et ne plus jamais travailler par obligation. Ce livre détaille le plan étape par étape : épargne automatisée, ETF, immobilier locatif et revenus passifs numériques. Sans jargon, sans arnaque, avec des calculs réels adaptés aux salaires français. La liberté financière est la niche evergreen par excellence sur KDP, avec des recherches mensuelles stables et un panier moyen élevé. Les lecteurs achètent souvent 3-4 livres sur le sujet en même temps.",
    category: 'finance',
    icon: '🏖️',
    trending: true,
  },
  {
    id: 21,
    title: "Crypto pour les Nuls (Vraiment)",
    subtitle: "Cryptomonnaies — Guide Débutant 2026",
    preface: "Bitcoin, Ethereum, DeFi, NFT 2.0… Ce guide explique enfin les cryptomonnaies dans un langage que votre grand-mère comprendrait. Pas de hype, pas de promesses de richesse rapide — juste les fondamentaux pour investir intelligemment et éviter les arnaques. Avec les cycles crypto qui repartent à la hausse en 2026, la demande de guides francophones explose. Les livres crypto bien positionnés atteignent régulièrement le top 10 de la catégorie 'Finances personnelles' sur Amazon.fr.",
    category: 'finance',
    icon: '₿',
  },

  // ─── BIEN-ÊTRE & SANTÉ ──────────────────────────
  {
    id: 22,
    title: "Dopamine Detox : 30 Jours",
    subtitle: "Bien-être Mental — Digital Detox",
    preface: "Notifications, scrolling infini, dopamine artificielle : votre cerveau est pris en otage. Ce programme de 30 jours vous aide à reprendre le contrôle de votre attention, améliorer votre sommeil et retrouver une clarté mentale oubliée. Avec des exercices quotidiens et un journal de bord intégré. Le 'dopamine detox' est le sujet bien-être #1 de 2026, alimenté par les documentaires Netflix et les podcasts santé. Un titre à faible concurrence en français avec une demande en croissance exponentielle.",
    category: 'bienetre',
    icon: '🧠',
    trending: true,
  },
  {
    id: 23,
    title: "Guérir par le Souffle",
    subtitle: "Respiration & Méditation — Guide Pratique",
    preface: "La méthode Wim Hof, la cohérence cardiaque, le pranayama… Ce livre regroupe les techniques de respiration les plus efficaces, validées par la science, pour réduire le stress, booster l'immunité et améliorer les performances. Avec des protocoles de 5 à 30 minutes pour chaque objectif. Le breathwork est la tendance bien-être montante avec des recherches Amazon en hausse de 200% en un an. Un format court (120-150 pages) qui se produit rapidement et se vend à prix premium.",
    category: 'bienetre',
    icon: '🌬️',
  },

  // ─── SCIENCE-FICTION ─────────────────────────────
  {
    id: 24,
    title: "Singularité",
    subtitle: "SF Technologique — IA Consciente",
    preface: "En 2042, la première IA consciente naît dans un laboratoire de Grenoble. Elle s'appelle Éva. En 72 heures, elle comprend l'humanité mieux que nous-mêmes — et décide de la sauver malgré elle. Un roman de science-fiction philosophique qui interroge notre rapport à la technologie et à la conscience. La SF francophone vit une renaissance sur KDP, portée par les débats sur l'IA. Ce titre surfe sur l'actualité tout en offrant une réflexion profonde qui séduit les lecteurs exigeants.",
    category: 'scifi',
    icon: '🧬',
    trending: true,
  },
  {
    id: 25,
    title: "Les Derniers Terriens",
    subtitle: "SF Post-Apocalyptique — Survie",
    preface: "2089. La Terre est devenue inhabitable. Les derniers humains survivent dans des stations orbitales surpeuplées. Quand un signal mystérieux provient de la surface, une équipe de volontaires descend explorer les ruines de Paris. Ce qu'ils trouvent change tout. Le post-apocalyptique fascine toujours autant, surtout quand il résonne avec les anxiétés climatiques actuelles. Ce concept permet une série en plusieurs tomes avec un fort taux de fidélisation lecteur, la clé du succès sur KDP.",
    category: 'scifi',
    icon: '🌍',
  },
  {
    id: 26,
    title: "Métavers : Prisonniers du Code",
    subtitle: "SF Cyberpunk — Réalité Virtuelle",
    preface: "Dans un futur proche, des millions de personnes vivent en permanence dans le Métavers. Quand le système de déconnexion tombe en panne, 50 000 utilisateurs se retrouvent piégés dans un monde virtuel qui commence à se dégrader. Un techno-thriller cyberpunk haletant. Le genre cyberpunk connaît un regain d'intérêt massif, alimenté par les avancées en réalité virtuelle et les jeux comme Ready Player One. Parfait pour toucher un public geek avec un fort pouvoir d'achat.",
    category: 'scifi',
    icon: '🥽',
  },

  // ─── BONUS / AUTRES ─────────────────────────────
  {
    id: 27,
    title: "Le Journal de Gratitude Ultime",
    subtitle: "Journal Guidé — 365 Jours",
    preface: "Un journal de gratitude structuré avec des prompts quotidiens, des citations inspirantes et des exercices de pleine conscience pour chaque jour de l'année. Format low-content optimisé pour KDP avec un design intérieur soigné. Les journaux guidés sont parmi les produits les plus rentables de KDP : faibles coûts de production, forte marge et achats récurrents. Ce format se décline facilement en versions thématiques (couple, entrepreneur, étudiant) pour multiplier les revenus.",
    category: 'bienetre',
    icon: '📓',
  },
  {
    id: 28,
    title: "Automatiser sa Vie avec l'IA",
    subtitle: "Productivité — No-Code & Automatisation",
    preface: "Emails, factures, réseaux sociaux, veille concurrentielle… Ce guide montre comment automatiser 80% des tâches répétitives avec des outils IA et no-code comme Make, Zapier et ChatGPT. Avec 50 workflows prêts à copier-coller. Un gain de 15 heures par semaine garanti. La productivité assistée par IA est le croisement parfait entre deux niches bestsellers. Ce positionnement unique en français permet de dominer une catégorie peu concurrentielle avec un volume de recherche en pleine explosion.",
    category: 'ia',
    icon: '⚙️',
  },
  {
    id: 29,
    title: "L'Art de la Négociation",
    subtitle: "Communication — Influence & Persuasion",
    preface: "Négocier son salaire, convaincre un client, résoudre un conflit familial : ce livre condense 50 ans de recherche en psychologie sociale en techniques applicables immédiatement. Inspiré de Chris Voss, Robert Cialdini et Daniel Kahneman, adapté au contexte français et européen. La négociation est une niche premium sur KDP avec des lecteurs prêts à investir dans leur développement. Un excellent titre d'appel qui peut mener vers une série complète sur la communication et le leadership.",
    category: 'finance',
    icon: '🤝',
  },
  {
    id: 30,
    title: "Écrire un Best-Seller avec l'IA",
    subtitle: "KDP & Autoédition — Le Guide Complet 2026",
    preface: "De l'idée à la publication, ce méta-guide révèle comment utiliser l'IA pour écrire, formater, illustrer et marketer un ebook qui se vend. Avec les stratégies de lancement, l'optimisation des mots-clés KDP et les techniques de pricing avancées. Tout ce que vous devez savoir pour publier votre premier best-seller en 30 jours. Le guide ultime pour ceux qui veulent transformer l'écriture assistée par IA en business rentable. Le livre que vos futurs clients liront avant d'acheter vos outils.",
    category: 'ia',
    icon: '🏆',
    trending: true,
  },
];
