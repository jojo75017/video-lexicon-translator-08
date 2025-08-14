
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
      
      Notre expertise nous permet de vous proposer des conseils pratiques et des astuces innovantes qui transformeront votre approche de ${mainKeyword}. Avec plus de 10 ans d'expérience dans le domaine, nous avons compilé les meilleures stratégies pour vous aider à réussir.
      
      Dans cette collection exceptionnelle, vous trouverez des techniques éprouvées, des exemples concrets et des méthodes step-by-step faciles à suivre. Chaque conseil a été testé et validé par notre communauté de créateurs passionnés.
      
      Les tendances actuelles en matière de ${mainKeyword} évoluent rapidement, et nous restons à la pointe de l'innovation pour vous offrir un contenu toujours d'actualité. Notre approche combine tradition et modernité pour des résultats exceptionnels.
      
      Enregistrez cette épingle pour ne rien manquer de nos futures publications. Partagez avec vos amis et rejoignez notre communauté grandissante de passionnés. Ensemble, créons quelque chose d'extraordinaire !
      
      N'hésitez pas à explorer nos autres épingles pour découvrir encore plus d'inspiration. Votre créativité n'a pas de limites, et nous sommes là pour vous accompagner dans cette belle aventure. Prêt à commencer votre transformation ?`,
      
      `Plongez dans l'univers fascinant de ${title} avec cette épingle exceptionnelle ! Notre équipe d'experts a soigneusement sélectionné les meilleures ressources pour enrichir votre parcours créatif.
      
      Le monde de ${mainKeyword} regorge d'opportunités inexploitées. Grâce à nos années de recherche et d'expérimentation, nous avons développé une méthode unique qui garantit des résultats spectaculaires. Cette approche révolutionnaire change la donne.
      
      Vous découvrirez des secrets bien gardés, des techniques avancées et des stratégies gagnantes utilisées par les professionnels du secteur. Chaque élément de ce contenu a été pensé pour maximiser votre potentiel créatif et vous faire gagner un temps précieux.
      
      Notre communauté de plus de 50 000 créateurs partage régulièrement ses succès et ses découvertes. En rejoignant ce mouvement, vous accédez à un réseau exceptionnel de personnes partageant les mêmes passions et ambitions que vous.
      
      Les transformations obtenues grâce à nos méthodes sont remarquables. Témoignages, études de cas et résultats concrets attestent de l'efficacité de notre approche. Votre succès est notre priorité absolue.
      
      Sauvegardez cette épingle dans votre tableau favori et commencez dès aujourd'hui votre parcours vers l'excellence. Le changement commence maintenant, et nous serons vos guides fidèles tout au long de cette aventure extraordinaire !`
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
