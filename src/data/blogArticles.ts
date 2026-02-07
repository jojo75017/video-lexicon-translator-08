export interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  readTime: string;
  keyword: string;
  searchVolume: number;
  date: string;
  dateISO: string;
  gradient: string;
  iconName: string;
  content: string; // Markdown content
  tableOfContents: { id: string; title: string; level: number }[];
  relatedSlugs: string[];
  faq: { question: string; answer: string }[];
}

// Example article structure — content will be filled with real SEO content
export const blogArticles: BlogArticle[] = [
  {
    slug: 'auto-edition-amazon-kdp',
    title: 'Auto-édition Amazon KDP : Le Guide Ultime 2025',
    metaTitle: 'Auto-édition Amazon KDP : Guide Ultime 2025 | EbookStudio Pro',
    metaDescription: 'Tout ce qu\'il faut savoir pour réussir son auto-édition sur Amazon KDP. Formatage, prix, catégories et stratégies de lancement.',
    excerpt: 'Tout ce qu\'il faut savoir pour réussir son auto-édition sur Amazon KDP. Formatage, prix, catégories et stratégies de lancement.',
    category: 'Guide',
    readTime: '15 min',
    keyword: 'auto édition amazon kdp',
    searchVolume: 880,
    date: '14 Janvier 2025',
    dateISO: '2025-01-14',
    gradient: 'from-rose-500 to-pink-500',
    iconName: 'PenTool',
    content: `## Introduction

L'auto-édition sur Amazon KDP (Kindle Direct Publishing) est devenue l'une des méthodes les plus accessibles pour publier un livre et générer des revenus passifs. En 2025, la plateforme offre des outils encore plus puissants pour les auteurs indépendants.

## Qu'est-ce qu'Amazon KDP ?

Amazon KDP est la plateforme d'auto-édition d'Amazon qui permet à tout le monde de publier des ebooks et des livres brochés. Vous gardez le contrôle total sur votre contenu, votre prix et vos droits d'auteur.

### Les avantages de KDP

- **Gratuit** : Aucun frais de publication
- **Distribution mondiale** : Accès à des millions de lecteurs
- **Royalties élevées** : Jusqu'à 70% sur les ebooks
- **Impression à la demande** : Pas de stock à gérer

## Comment démarrer sur KDP

### Étape 1 : Créer votre compte KDP

Rendez-vous sur kdp.amazon.com et créez votre compte. Vous aurez besoin d'informations fiscales et bancaires.

### Étape 2 : Préparer votre manuscrit

Le formatage est crucial pour une bonne expérience de lecture. Utilisez un outil comme EbookStudio Pro pour générer un manuscrit parfaitement formaté.

### Étape 3 : Créer votre couverture

La couverture est le premier élément que voient vos lecteurs potentiels. Investissez dans une couverture professionnelle.

### Étape 4 : Configurer vos métadonnées

Choisissez les bonnes catégories, mots-clés et description pour maximiser votre visibilité.

## Stratégies de prix

Le prix de votre ebook influence directement vos royalties :

- **0,99€ - 2,98€** : 35% de royalties
- **2,99€ - 9,99€** : 70% de royalties
- **Au-delà de 9,99€** : 35% de royalties

La zone optimale se situe entre 2,99€ et 9,99€ pour maximiser vos revenus.

## Optimisation SEO sur Amazon

Les mots-clés sont essentiels pour être trouvé sur Amazon. Utilisez les 7 champs de mots-clés disponibles et optimisez votre titre et sous-titre.

## Conclusion

L'auto-édition sur Amazon KDP est une opportunité formidable en 2025. Avec les bons outils et la bonne stratégie, vous pouvez publier des livres de qualité professionnelle et générer des revenus récurrents.`,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 2 },
      { id: 'quest-ce-quamazon-kdp', title: 'Qu\'est-ce qu\'Amazon KDP ?', level: 2 },
      { id: 'comment-demarrer-sur-kdp', title: 'Comment démarrer sur KDP', level: 2 },
      { id: 'strategies-de-prix', title: 'Stratégies de prix', level: 2 },
      { id: 'optimisation-seo-sur-amazon', title: 'Optimisation SEO sur Amazon', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 },
    ],
    relatedSlugs: ['gagner-argent-ebook', 'idees-ebook-rentables'],
    faq: [
      { question: 'Combien coûte la publication sur Amazon KDP ?', answer: 'La publication est entièrement gratuite. Amazon se rémunère en prélevant un pourcentage sur chaque vente.' },
      { question: 'Combien de temps faut-il pour publier sur KDP ?', answer: 'Une fois votre manuscrit prêt, la publication prend environ 72 heures pour que votre livre soit disponible à la vente.' },
      { question: 'Peut-on publier en français sur Amazon KDP ?', answer: 'Oui, Amazon KDP supporte de nombreuses langues dont le français. Vous pouvez cibler les marchés Amazon.fr, .ca et .be.' },
      { question: 'Quelles sont les royalties sur Amazon KDP ?', answer: 'Vous pouvez choisir entre 35% et 70% de royalties selon le prix de votre ebook. La tranche 70% s\'applique pour les prix entre 2,99€ et 9,99€.' },
      { question: 'Faut-il un ISBN pour publier sur KDP ?', answer: 'Non, Amazon attribue automatiquement un ASIN à votre ebook. Un ISBN est optionnel pour les ebooks mais requis pour les versions brochées.' },
    ],
  },
  {
    slug: 'gagner-argent-ebook',
    title: 'Gagner de l\'Argent avec les Ebooks : Stratégies Rentables',
    metaTitle: 'Gagner de l\'Argent avec les Ebooks en 2025 | EbookStudio Pro',
    metaDescription: 'Découvrez comment générer des revenus passifs avec vos ebooks. Niches rentables, pricing et techniques de vente sur Amazon.',
    excerpt: 'Découvrez comment générer des revenus passifs avec vos ebooks. Niches rentables, pricing et techniques de vente sur Amazon.',
    category: 'Monétisation',
    readTime: '11 min',
    keyword: 'gagner argent ebook',
    searchVolume: 590,
    date: '14 Janvier 2025',
    dateISO: '2025-01-14',
    gradient: 'from-emerald-500 to-teal-500',
    iconName: 'DollarSign',
    content: `## Introduction

Gagner de l'argent avec les ebooks est une réalité pour des milliers d'auteurs indépendants. Que ce soit comme revenu complémentaire ou comme activité principale, la vente d'ebooks offre un potentiel de revenus passifs considérable.

## Pourquoi les ebooks sont rentables

### Coûts de production quasi nuls

Contrairement aux livres physiques, un ebook ne nécessite ni impression, ni stockage, ni expédition. Votre marge bénéficiaire est donc maximale.

### Revenus passifs

Une fois publié, un ebook peut générer des ventes pendant des années sans effort supplémentaire de votre part.

## Les niches les plus rentables

### 1. Développement personnel
Le marché du développement personnel est en croissance constante. Les lecteurs cherchent des solutions pratiques à leurs problèmes.

### 2. Business et entrepreneuriat
Les guides pratiques sur la création d'entreprise, le marketing digital et la productivité se vendent très bien.

### 3. Santé et bien-être
Les ebooks sur la nutrition, le fitness et le bien-être mental sont très demandés.

### 4. Compétences techniques
Les tutoriels sur la programmation, le design ou les outils digitaux trouvent facilement leur audience.

## Stratégies de monétisation

### La stratégie du volume
Publiez régulièrement de nouveaux ebooks pour diversifier vos sources de revenus.

### La stratégie de la série
Créez une série de livres sur un même thème pour fidéliser vos lecteurs.

### La stratégie du premium
Proposez un contenu de haute qualité à un prix plus élevé avec des bonus exclusifs.

## Conclusion

La clé du succès dans la vente d'ebooks réside dans la combinaison d'un contenu de qualité, d'un marketing efficace et d'une stratégie de publication régulière.`,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 2 },
      { id: 'pourquoi-les-ebooks-sont-rentables', title: 'Pourquoi les ebooks sont rentables', level: 2 },
      { id: 'les-niches-les-plus-rentables', title: 'Les niches les plus rentables', level: 2 },
      { id: 'strategies-de-monetisation', title: 'Stratégies de monétisation', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 },
    ],
    relatedSlugs: ['auto-edition-amazon-kdp', 'idees-ebook-rentables'],
    faq: [
      { question: 'Combien peut-on gagner avec un ebook ?', answer: 'Les revenus varient énormément. Certains auteurs gagnent quelques dizaines d\'euros par mois, d\'autres plusieurs milliers. La moyenne se situe entre 100€ et 500€/mois par ebook bien positionné.' },
      { question: 'Faut-il être un expert pour écrire un ebook ?', answer: 'Pas nécessairement. Vous pouvez compiler des recherches, interviewer des experts ou utiliser des outils IA comme EbookStudio Pro pour créer du contenu de qualité.' },
      { question: 'Combien de temps faut-il pour écrire un ebook ?', answer: 'Avec les outils IA modernes, vous pouvez créer un ebook de qualité en quelques heures au lieu de plusieurs semaines.' },
      { question: 'Où vendre ses ebooks ?', answer: 'Amazon KDP est la plateforme principale, mais vous pouvez aussi vendre sur Kobo, Apple Books, Google Play Books et votre propre site.' },
      { question: 'Les ebooks sont-ils encore rentables en 2025 ?', answer: 'Oui, le marché des ebooks continue de croître. La clé est de cibler les bonnes niches et d\'offrir un contenu de qualité supérieure.' },
    ],
  },
  {
    slug: 'idees-ebook-rentables',
    title: '50 Idées d\'Ebooks Rentables à Créer en 2025',
    metaTitle: '50 Idées d\'Ebooks Rentables en 2025 | EbookStudio Pro',
    metaDescription: 'Liste complète d\'idées de niches et sujets d\'ebooks qui se vendent bien sur Amazon KDP. Inspirez-vous pour votre prochain bestseller.',
    excerpt: 'Liste complète d\'idées de niches et sujets d\'ebooks qui se vendent bien sur Amazon KDP.',
    category: 'Inspiration',
    readTime: '9 min',
    keyword: 'idées ebook rentables',
    searchVolume: 390,
    date: '14 Janvier 2025',
    dateISO: '2025-01-14',
    gradient: 'from-indigo-500 to-blue-500',
    iconName: 'Lightbulb',
    content: `## Introduction

Trouver la bonne idée d'ebook est souvent la première étape vers le succès. Voici 50 idées d'ebooks rentables classées par catégorie pour vous inspirer.

## Développement personnel (1-10)

1. **Guide de la productivité pour entrepreneurs**
2. **30 jours pour changer ses habitudes**
3. **L'art de la négociation au quotidien**
4. **Vaincre la procrastination définitivement**
5. **Intelligence émotionnelle : guide pratique**
6. **Minimalisme : vivre mieux avec moins**
7. **Gestion du stress en milieu professionnel**
8. **Confiance en soi : exercices quotidiens**
9. **Communication non-violente au travail**
10. **Morning routine des personnes à succès**

## Business et finance (11-20)

11. **Créer son business en ligne de A à Z**
12. **Investir en bourse pour débutants**
13. **Freelancing : de salarié à indépendant**
14. **Marketing digital sans budget**
15. **Créer et vendre des formations en ligne**
16. **Dropshipping : guide complet 2025**
17. **Immobilier locatif pour débutants**
18. **Cryptomonnaies : comprendre et investir**
19. **Personal branding sur LinkedIn**
20. **Automatiser son business avec l'IA**

## Santé et bien-être (21-30)

21. **Meal prep : planifier ses repas de la semaine**
22. **Yoga à la maison : programme 30 jours**
23. **Alimentation anti-inflammatoire**
24. **Méditation guidée pour débutants**
25. **Programme fitness sans matériel**
26. **Sommeil : retrouver des nuits réparatrices**
27. **Jeûne intermittent : guide scientifique**
28. **Cuisine végétarienne facile**
29. **Aromathérapie : huiles essentielles au quotidien**
30. **Running : du canapé au semi-marathon**

## Loisirs et hobbies (31-40)

31. **Photographie smartphone : techniques pro**
32. **Jardinage urbain sur balcon**
33. **Aquariophilie pour débutants**
34. **Dessin digital : premiers pas**
35. **Broderie moderne : 20 projets**
36. **Brassage de bière artisanale**
37. **Voyager en van : guide complet**
38. **Pâtisserie française à la maison**
39. **Calligraphie moderne**
40. **Menuiserie : projets pour débutants**

## Éducation et compétences (41-50)

41. **Apprendre l'anglais en 90 jours**
42. **Excel avancé pour professionnels**
43. **Introduction à Python**
44. **Rédaction web SEO**
45. **Design Canva : créer des visuels pro**
46. **ChatGPT : guide complet des prompts**
47. **Gestion de projet Agile**
48. **Data analyse pour débutants**
49. **Copywriting : l'art de vendre avec les mots**
50. **No-code : créer une app sans coder**

## Comment choisir votre idée

Pour choisir la bonne idée, analysez trois critères : la **demande** (volume de recherche), la **concurrence** (nombre de livres existants) et votre **expertise** ou intérêt pour le sujet.

## Conclusion

Ces 50 idées ne sont qu'un point de départ. Utilisez EbookStudio Pro pour valider votre niche et créer votre ebook rapidement grâce à l'IA.`,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 2 },
      { id: 'developpement-personnel-1-10', title: 'Développement personnel (1-10)', level: 2 },
      { id: 'business-et-finance-11-20', title: 'Business et finance (11-20)', level: 2 },
      { id: 'sante-et-bien-etre-21-30', title: 'Santé et bien-être (21-30)', level: 2 },
      { id: 'loisirs-et-hobbies-31-40', title: 'Loisirs et hobbies (31-40)', level: 2 },
      { id: 'education-et-competences-41-50', title: 'Éducation et compétences (41-50)', level: 2 },
      { id: 'comment-choisir-votre-idee', title: 'Comment choisir votre idée', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 },
    ],
    relatedSlugs: ['auto-edition-amazon-kdp', 'gagner-argent-ebook'],
    faq: [
      { question: 'Quelle est la niche la plus rentable pour un ebook ?', answer: 'Le développement personnel et le business en ligne sont les niches les plus rentables, avec des volumes de recherche élevés et des acheteurs prêts à investir.' },
      { question: 'Peut-on écrire un ebook sur un sujet qu\'on ne maîtrise pas ?', answer: 'Oui, avec de bonnes recherches et des outils IA comme EbookStudio Pro, vous pouvez créer un contenu de qualité sur n\'importe quel sujet.' },
      { question: 'Combien d\'ebooks faut-il publier pour en vivre ?', answer: 'En général, 10 à 20 ebooks bien positionnés peuvent générer un revenu confortable. Mais un seul bestseller peut suffire.' },
      { question: 'Comment valider une idée d\'ebook ?', answer: 'Vérifiez le volume de recherche du mot-clé principal, analysez la concurrence sur Amazon et évaluez les avis des livres existants.' },
      { question: 'Faut-il écrire un long ebook pour qu\'il se vende ?', answer: 'Non, la qualité prime sur la quantité. Un ebook de 50-80 pages bien structuré peut très bien se vendre s\'il apporte de la valeur.' },
    ],
  },
];

export const getArticleBySlug = (slug: string): BlogArticle | undefined => {
  return blogArticles.find(a => a.slug === slug);
};

export const getRelatedArticles = (slugs: string[]): BlogArticle[] => {
  return blogArticles.filter(a => slugs.includes(a.slug));
};
