import jsPDF from "jspdf";

interface KdpNiche {
  rank: number;
  name: string;
  monthlySearches: string;
  competition: "Faible" | "Moyenne" | "Forte";
  avgPrice: string;
  potentialRevenue: string;
  tips: string[];
  exampleTitles: string[];
}

const kdpNiches: KdpNiche[] = [
  {
    rank: 1,
    name: "Carnets de Gratitude",
    monthlySearches: "12 000+",
    competition: "Faible",
    avgPrice: "9,99€",
    potentialRevenue: "500-2000€/mois",
    tips: [
      "Créez des versions thématiques (femmes, hommes, ados)",
      "Ajoutez des citations inspirantes",
      "Proposez des formats 90 jours, 365 jours"
    ],
    exampleTitles: [
      "Mon Carnet de Gratitude Quotidien",
      "365 Jours de Reconnaissance",
      "Le Journal du Bonheur Simple"
    ]
  },
  {
    rank: 2,
    name: "Cahiers de Recettes à Remplir",
    monthlySearches: "8 500+",
    competition: "Faible",
    avgPrice: "12,99€",
    potentialRevenue: "400-1500€/mois",
    tips: [
      "Ciblez des cuisines spécifiques (végétalien, sans gluten)",
      "Incluez des sections pour notes et photos",
      "Proposez des formats famille ou personnel"
    ],
    exampleTitles: [
      "Mes Recettes de Famille à Transmettre",
      "Carnet de Recettes Healthy",
      "Mon Livre de Cuisine Personnalisé"
    ]
  },
  {
    rank: 3,
    name: "Guides de Productivité",
    monthlySearches: "15 000+",
    competition: "Moyenne",
    avgPrice: "14,99€",
    potentialRevenue: "800-3000€/mois",
    tips: [
      "Focalisez sur une méthode précise (Pomodoro, GTD)",
      "Incluez des exercices pratiques",
      "Ajoutez des templates téléchargeables"
    ],
    exampleTitles: [
      "La Méthode des 4 Heures Productives",
      "Maîtrisez Votre Temps en 21 Jours",
      "Le Guide Ultime de la Productivité"
    ]
  },
  {
    rank: 4,
    name: "Livres pour Enfants (3-8 ans)",
    monthlySearches: "25 000+",
    competition: "Moyenne",
    avgPrice: "8,99€",
    potentialRevenue: "1000-5000€/mois",
    tips: [
      "Créez des séries avec personnages récurrents",
      "Thèmes éducatifs : émotions, valeurs",
      "Illustrations colorées obligatoires"
    ],
    exampleTitles: [
      "Les Aventures de Petit Nuage",
      "Comment Gérer Ma Colère - Pour Enfants",
      "Le Monstre Sous Mon Lit Est Mon Ami"
    ]
  },
  {
    rank: 5,
    name: "Planners et Organisateurs",
    monthlySearches: "18 000+",
    competition: "Moyenne",
    avgPrice: "11,99€",
    potentialRevenue: "600-2500€/mois",
    tips: [
      "Ciblez des professions (enseignants, entrepreneurs)",
      "Proposez des versions académiques et calendaires",
      "Incluez des trackers d'habitudes"
    ],
    exampleTitles: [
      "Mon Planner d'Entrepreneur 2025",
      "Agenda de l'Enseignant Organisé",
      "Le Planner Bien-Être 52 Semaines"
    ]
  },
  {
    rank: 6,
    name: "Guides de Développement Personnel",
    monthlySearches: "22 000+",
    competition: "Forte",
    avgPrice: "16,99€",
    potentialRevenue: "1500-6000€/mois",
    tips: [
      "Nichez sur un problème précis (anxiété, confiance)",
      "Basez-vous sur des études scientifiques",
      "Incluez des exercices de 5-10 minutes"
    ],
    exampleTitles: [
      "Vaincre l'Anxiété en 30 Jours",
      "Le Guide de la Confiance Inébranlable",
      "Reprendre le Contrôle de Sa Vie"
    ]
  },
  {
    rank: 7,
    name: "Cahiers d'Activités Adultes",
    monthlySearches: "9 000+",
    competition: "Faible",
    avgPrice: "10,99€",
    potentialRevenue: "300-1200€/mois",
    tips: [
      "Mots croisés, sudokus, coloriages anti-stress",
      "Ciblez les seniors ou les voyageurs",
      "Créez des thématiques saisonnières"
    ],
    exampleTitles: [
      "100 Mots Croisés pour Esprits Curieux",
      "Coloriages Anti-Stress pour Adultes",
      "Cahier d'Activités Voyageur"
    ]
  },
  {
    rank: 8,
    name: "Guides Cuisine Spécialisée",
    monthlySearches: "14 000+",
    competition: "Moyenne",
    avgPrice: "13,99€",
    potentialRevenue: "700-2800€/mois",
    tips: [
      "Régimes tendance : keto, paléo, batch cooking",
      "Incluez des photos ou illustrations",
      "Proposez des plans de repas hebdomadaires"
    ],
    exampleTitles: [
      "Batch Cooking : 52 Menus Préparés",
      "La Bible du Régime Keto",
      "Cuisine Express pour Parents Débordés"
    ]
  },
  {
    rank: 9,
    name: "Romans Courts (Novellas)",
    monthlySearches: "11 000+",
    competition: "Faible",
    avgPrice: "4,99€",
    potentialRevenue: "200-1500€/mois",
    tips: [
      "Romance et thriller sont les plus vendeurs",
      "Créez des séries pour fidéliser",
      "Couvertures professionnelles essentielles"
    ],
    exampleTitles: [
      "Un Été à Saint-Tropez",
      "Le Secret du Manoir Noir",
      "Retrouvailles Inattendues"
    ]
  },
  {
    rank: 10,
    name: "Guides Business et Side Hustle",
    monthlySearches: "16 000+",
    competition: "Moyenne",
    avgPrice: "17,99€",
    potentialRevenue: "1000-4000€/mois",
    tips: [
      "Focalisez sur un business model précis",
      "Incluez des études de cas réelles",
      "Proposez des templates et checklists"
    ],
    exampleTitles: [
      "Lancer Son Business Etsy en 30 Jours",
      "Le Guide Complet du Dropshipping",
      "Gagner 1000€/Mois en Side Hustle"
    ]
  }
];

export const generateKdpNichesPdf = (): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // === Page de couverture ===
  doc.setFillColor(139, 92, 246); // Violet
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("10 NICHES KDP", pageWidth / 2, 80, { align: "center" });
  doc.text("RENTABLES EN 2025", pageWidth / 2, 95, { align: "center" });
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Guide Exclusif - Valeur 47€", pageWidth / 2, 120, { align: "center" });
  
  doc.setFontSize(12);
  doc.text("Offert par EbookStudio.fr", pageWidth / 2, 250, { align: "center" });
  doc.text("Le Générateur d'Ebooks IA #1", pageWidth / 2, 262, { align: "center" });

  // === Page d'introduction ===
  doc.addPage();
  doc.setTextColor(0, 0, 0);
  yPosition = margin;

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Introduction", margin, yPosition);
  yPosition += 15;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const introText = [
    "Bienvenue dans ce guide exclusif des 10 niches KDP les plus rentables en 2025 !",
    "",
    "Ce document a été créé spécialement pour vous aider à identifier les opportunités",
    "les plus prometteuses sur Amazon Kindle Direct Publishing.",
    "",
    "Pour chaque niche, vous trouverez :",
    "• Le volume de recherches mensuelles estimé",
    "• Le niveau de concurrence actuel",
    "• Le prix moyen conseillé",
    "• Le potentiel de revenus mensuel",
    "• Des conseils stratégiques pour vous démarquer",
    "• Des exemples de titres qui fonctionnent",
    "",
    "Conseil : Ne vous dispersez pas ! Choisissez 1 ou 2 niches maximum",
    "et devenez expert dans ces domaines avant d'en explorer d'autres.",
    "",
    "Bonne lecture et bons succès !",
    "",
    "L'équipe EbookStudio.fr"
  ];

  introText.forEach(line => {
    doc.text(line, margin, yPosition);
    yPosition += 7;
  });

  // === Pages des niches ===
  kdpNiches.forEach((niche, index) => {
    doc.addPage();
    yPosition = margin;

    // En-tête de la niche
    doc.setFillColor(245, 243, 255);
    doc.roundedRect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 35, 3, 3, "F");

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 246);
    doc.text(`#${niche.rank}`, margin, yPosition + 8);
    
    doc.setTextColor(0, 0, 0);
    doc.text(niche.name, margin + 20, yPosition + 8);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Recherches : ${niche.monthlySearches}/mois`, margin, yPosition + 22);
    
    yPosition += 45;

    // Métriques
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Métriques Clés", margin, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    const competitionColor = niche.competition === "Faible" ? [34, 197, 94] : 
                             niche.competition === "Moyenne" ? [234, 179, 8] : [239, 68, 68];
    
    doc.text(`Concurrence : `, margin, yPosition);
    doc.setTextColor(competitionColor[0], competitionColor[1], competitionColor[2]);
    doc.text(niche.competition, margin + 35, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 8;

    doc.text(`Prix moyen conseillé : ${niche.avgPrice}`, margin, yPosition);
    yPosition += 8;
    
    doc.text(`Potentiel revenus : ${niche.potentialRevenue}`, margin, yPosition);
    yPosition += 15;

    // Conseils
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Conseils pour Réussir", margin, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    niche.tips.forEach((tip, i) => {
      doc.text(`${i + 1}. ${tip}`, margin, yPosition);
      yPosition += 8;
    });
    yPosition += 5;

    // Exemples de titres
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Exemples de Titres", margin, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    niche.exampleTitles.forEach((title) => {
      doc.text(`• "${title}"`, margin, yPosition);
      yPosition += 8;
    });
  });

  // === Page finale ===
  doc.addPage();
  yPosition = 60;

  doc.setFillColor(139, 92, 246);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 80, 5, 5, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Prêt à Créer Votre Premier Ebook ?", pageWidth / 2, yPosition + 25, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Utilisez EbookStudio.fr pour générer vos ebooks", pageWidth / 2, yPosition + 45, { align: "center" });
  doc.text("automatiquement avec l'intelligence artificielle !", pageWidth / 2, yPosition + 55, { align: "center" });
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("ebookstudio.fr/offres", pageWidth / 2, yPosition + 72, { align: "center" });

  yPosition += 100;

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("© 2025 EbookStudio.fr - Tous droits réservés", pageWidth / 2, yPosition, { align: "center" });
  doc.text("Ce guide est offert gratuitement et ne peut être revendu.", pageWidth / 2, yPosition + 12, { align: "center" });

  // Télécharger le PDF
  doc.save("10-Niches-KDP-Rentables-2025.pdf");
};

export default generateKdpNichesPdf;
