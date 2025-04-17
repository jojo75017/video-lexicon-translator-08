
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
    
    updatePin('title', randomTemplate.title);
    updatePin('description', randomTemplate.description);
    updatePin('hashtags', randomTemplate.hashtags);
    
    setActiveTab('content');
    
    toast.success(`Contenu ${platform} généré avec succès!`);
  };

  return { generateSocialContent };
};
