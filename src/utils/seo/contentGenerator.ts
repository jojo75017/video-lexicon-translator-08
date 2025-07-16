
import { GeneratedContent } from '@/types/seo/Performance';

export function generateContentWithWordCount(keyword: string, wordCount: number): GeneratedContent {
  const sections = [
    {
      heading: `Qu'est-ce que ${keyword} ?`,
      content: `Le ${keyword} est un élément essentiel dans le domaine du voyage et du tourisme. Cette section explore les fondamentaux et vous donne une compréhension claire de ce concept important.`
    },
    {
      heading: `Comment utiliser ${keyword} efficacement`,
      content: `Pour maximiser les bénéfices du ${keyword}, il est important de suivre certaines meilleures pratiques. Voici un guide étape par étape pour une utilisation optimale.`
    },
    {
      heading: `Les avantages du ${keyword}`,
      content: `Le ${keyword} offre de nombreux avantages pour les voyageurs et les professionnels du tourisme. Découvrez comment cela peut améliorer votre expérience.`
    }
  ];

  return {
    title: `Guide complet sur ${keyword}`,
    intro: `Découvrez tout ce que vous devez savoir sur ${keyword}. Ce guide complet vous donnera toutes les informations nécessaires pour comprendre et utiliser efficacement ${keyword} dans vos projets de voyage.`,
    sections
  };
}
