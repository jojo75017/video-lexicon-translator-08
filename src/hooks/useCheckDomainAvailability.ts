
import { useState } from 'react';
import { toast } from 'sonner';

interface DomainSuggestion {
  domain: string;
  available: boolean;
  price?: string;
  score: number;
  reason?: string;
}

export function useCheckDomainAvailability() {
  const [isChecking, setIsChecking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Fonction pour vérifier la disponibilité d'un domaine
  const checkAvailability = async (domain: string): Promise<boolean | null> => {
    if (!domain) return null;
    
    setIsChecking(true);
    try {
      // Simulation d'une API de vérification de domaine
      // En production, vous utiliseriez une véritable API comme GoDaddy, Namecheap, etc.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Pour des besoins de démo, tous les domaines sont considérés comme "disponibles"
      // sauf quelques uns spécifiques, comme example.com, google.com, etc.
      const commonTlds = ['.com', '.fr', '.org', '.net', '.io'];
      const popularDomains = [
        'google', 'facebook', 'amazon', 'apple', 'microsoft', 
        'example', 'test', 'demo', 'yourdomain', 'mydomain'
      ];
      
      // Extraire le nom de base du domaine sans le TLD
      const domainLower = domain.toLowerCase();
      const baseDomain = domainLower.split('.')[0];
      
      // Vérifier si c'est un domaine populaire avec un TLD commun
      if (popularDomains.includes(baseDomain) && 
          commonTlds.some(tld => domainLower.endsWith(tld))) {
        return false; // Non disponible
      }
      
      // Simuler une petite variance pour d'autres domaines
      return Math.random() > 0.2; // 80% de chance d'être disponible
    } catch (error) {
      console.error('Erreur lors de la vérification du domaine:', error);
      toast.error('Impossible de vérifier la disponibilité du domaine');
      return null;
    } finally {
      setIsChecking(false);
    }
  };
  
  // Fonction pour générer des suggestions de domaines avec l'IA
  const generateAiSuggestions = async (domain: string, apiKey: string): Promise<DomainSuggestion[]> => {
    if (!domain || !apiKey) {
      return [];
    }
    
    setIsGenerating(true);
    try {
      // En production, vous feriez un appel réel à l'API OpenAI ici
      // Pour l'instant, simulons cet appel
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Analyse du domaine pour extraire la base
      const domainParts = domain.split('.');
      const baseName = domainParts[0];
      const tld = domainParts.length > 1 ? domainParts[domainParts.length - 1] : 'com';
      
      // Générer quelques suggestions basées sur le nom
      const suggestions: DomainSuggestion[] = [
        {
          domain: `${baseName}-online.${tld}`,
          available: Math.random() > 0.3,
          price: '12,99€',
          score: Math.floor(Math.random() * 20) + 70,
          reason: 'Version en ligne de votre marque, idéale pour les entreprises de e-commerce.'
        },
        {
          domain: `my${baseName}.${tld}`,
          available: true, // Toujours disponible pour la démo
          price: '14,99€',
          score: Math.floor(Math.random() * 20) + 60,
          reason: 'Préfixe personnel qui crée un lien direct avec les clients.'
        },
        {
          domain: `${baseName}pro.${tld}`,
          available: true, // Toujours disponible pour la démo
          price: '13,99€',
          score: Math.floor(Math.random() * 20) + 75,
          reason: 'Ajoute une touche professionnelle à votre marque.'
        },
        {
          domain: `${baseName}.io`,
          available: true, // Toujours disponible pour la démo
          price: '39,99€',
          score: Math.floor(Math.random() * 15) + 80,
          reason: 'Domaine moderne populaire dans la tech et les startups.'
        },
        {
          domain: `${baseName}media.${tld}`,
          available: true, // Toujours disponible pour la démo
          price: '12,99€',
          score: Math.floor(Math.random() * 20) + 65,
          reason: 'Parfait pour les entreprises de médias et de contenu.'
        },
        {
          domain: `get${baseName}.${tld}`,
          available: true, // Toujours disponible pour la démo
          price: '14,99€',
          score: Math.floor(Math.random() * 20) + 70,
          reason: 'Incite à l\'action, idéal pour les produits et services.'
        },
        {
          domain: `${baseName}.app`,
          available: true, // Toujours disponible pour la démo
          price: '19,99€',
          score: Math.floor(Math.random() * 15) + 75,
          reason: 'Parfait pour les applications et services numériques.'
        },
        {
          domain: `${baseName}hub.${tld}`,
          available: true, // Toujours disponible pour la démo
          price: '12,99€',
          score: Math.floor(Math.random() * 20) + 65,
          reason: 'Positionne votre marque comme une plateforme centrale.'
        }
      ];
      
      return suggestions.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Erreur lors de la génération des suggestions:', error);
      toast.error('Impossible de générer des suggestions de domaine');
      return [];
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    checkAvailability,
    isChecking,
    generateAiSuggestions,
    isGenerating
  };
}
