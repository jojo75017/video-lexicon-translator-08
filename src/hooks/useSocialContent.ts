
import { toast } from 'sonner';
import { socialContentTemplates, SocialPlatform } from '@/data/socialContentTemplates';

interface UseSocialContentProps {
  updatePin: (field: string, value: any) => void;
  setActiveTab: (tab: string) => void;
}

export const useSocialContent = ({ updatePin, setActiveTab }: UseSocialContentProps) => {
  const generateSocialContent = (platform: SocialPlatform) => {
    const templates = socialContentTemplates[platform];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Générer une description longue de 450 mots
    const longDescription = generateLongDescription(randomTemplate.title, platform);
    
    // Générer une description globale
    const globalDescription = generateGlobalDescription(randomTemplate.title, platform);
    
    updatePin('title', randomTemplate.title);
    updatePin('description', longDescription);
    updatePin('globalDescription', globalDescription);
    updatePin('hashtags', randomTemplate.hashtags);
    
    setActiveTab('content');
    
    toast.success(`Contenu ${platform} généré avec succès! Description de ${longDescription.split(' ').length} mots créée.`);
  };

  const generateLongDescription = (title: string, platform: string): string => {
    const keywords = title.toLowerCase().split(' ').filter(word => word.length > 3);
    const mainKeyword = keywords[0] || 'créativité';
    
    const descriptions = [
      `Découvrez ${title} ! Cette épingle unique vous emmène dans un univers d'inspiration sans limite. Que vous soyez passionné de ${mainKeyword} ou simplement à la recherche de nouvelles idées créatives, ce contenu est fait pour vous.
      
      Cette collection exceptionnelle regroupe des techniques éprouvées, des exemples concrets et des méthodes faciles à suivre. Chaque conseil a été soigneusement sélectionné pour vous aider à réussir vos projets.
      
      Dans cette ressource complète, vous trouverez des astuces pratiques, des inspirations créatives et des solutions innovantes. Tout est conçu pour stimuler votre créativité et vous donner de nouvelles perspectives.
      
      Les tendances actuelles en matière de ${mainKeyword} évoluent rapidement, et cette épingle vous tient au courant des dernières nouveautés. Une approche moderne qui combine tradition et innovation pour des résultats exceptionnels.
      
      Enregistrez cette épingle pour ne rien manquer de vos futures découvertes. Partagez avec vos amis et explorez encore plus d'inspiration. Ensemble, créons quelque chose d'extraordinaire !
      
      N'hésitez pas à explorer d'autres épingles similaires pour découvrir encore plus d'idées. Votre créativité n'a pas de limites, et ces ressources sont là pour vous accompagner. Prêt à commencer votre transformation ?`,
      
      `Plongez dans l'univers fascinant de ${title} avec cette épingle exceptionnelle ! Cette collection a été soigneusement assemblée pour enrichir votre parcours créatif avec les meilleures ressources disponibles.
      
      Le monde de ${mainKeyword} regorge d'opportunités inexploitées. Grâce à cette sélection unique, vous découvrirez des techniques avancées et des stratégies efficaces. Cette approche vous change la donne.
      
      Vous découvrirez des conseils pratiques, des techniques détaillées et des stratégies gagnantes utilisées par les passionnés du domaine. Chaque élément de ce contenu a été pensé pour maximiser votre potentiel créatif.
      
      Cette ressource vous donne accès à un réseau d'inspiration exceptionnel. En explorant ce contenu, vous rejoignez une communauté de personnes partageant les mêmes passions et ambitions que vous.
      
      Les transformations obtenues grâce à ces méthodes sont remarquables. Des résultats concrets et des témoignages attestent de l'efficacité de cette approche. Votre succès créatif est à portée de main.
      
      Sauvegardez cette épingle dans votre tableau favori et commencez dès aujourd'hui votre parcours vers l'excellence créative. Le changement commence maintenant, avec ces ressources exceptionnelles !`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const generateGlobalDescription = (title: string, platform: string): string => {
    const keywords = title.toLowerCase().split(' ').filter(word => word.length > 3);
    const mainKeyword = keywords[0] || 'inspiration';
    
    return `Collection exclusive autour de ${mainKeyword}. Découvrez des conseils d'experts, des techniques innovantes et des ressources premium pour développer votre créativité. Contenu original et inspirant pour tous les passionnés de ${mainKeyword}. Rejoignez notre communauté et transformez vos idées en réalisations exceptionnelles !`;
  };

  return { generateSocialContent };
};
