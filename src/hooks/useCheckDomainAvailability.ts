
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
  
  // Liste des domaines connus pour être indisponibles
  const knownRegisteredDomains = [
    'google', 'facebook', 'amazon', 'apple', 'microsoft', 
    'example', 'test', 'demo', 'yourdomain', 'mydomain',
    'aquarioslands', // Ajout du domaine de l'utilisateur
    'youtube', 'twitter', 'instagram', 'linkedin', 'tiktok',
    'netflix', 'spotify', 'airbnb', 'uber', 'slack',
    'gmail', 'yahoo', 'hotmail', 'outlook', 'protonmail'
  ];
  
  // Fonction pour vérifier la disponibilité d'un domaine
  const checkAvailability = async (domain: string): Promise<boolean | null> => {
    if (!domain) return null;
    
    setIsChecking(true);
    try {
      // Simulation d'une API de vérification de domaine
      // En production, vous utiliseriez une véritable API comme GoDaddy, Namecheap, etc.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Extraire le nom de base du domaine sans le TLD
      const domainLower = domain.toLowerCase();
      const baseDomain = domainLower.split('.')[0];
      
      // Vérifier si c'est un domaine populaire ou un domaine connu
      if (knownRegisteredDomains.includes(baseDomain)) {
        return false; // Non disponible
      }
      
      // Pour d'autres domaines populaires avec des TLDs communs
      const commonTlds = ['.com', '.fr', '.org', '.net', '.io'];
      
      // Simuler une petite variance pour d'autres domaines
      // Mais considérer comme non disponible si le domaine contient "aquarios"
      if (domainLower.includes('aquarios')) {
        return false; // Considérer tous les domaines contenant "aquarios" comme non disponibles
      }
      
      return Math.random() > 0.2; // 80% de chance d'être disponible pour les autres
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
          available: !baseName.includes('aquarios'), // Non disponible si contient aquarios
          price: '12,99€',
          score: Math.floor(Math.random() * 20) + 70,
          reason: 'Version en ligne de votre marque, idéale pour les entreprises de e-commerce.'
        },
        {
          domain: `my${baseName}.${tld}`,
          available: !baseName.includes('aquarios'), // Non disponible si contient aquarios
          price: '14,99€',
          score: Math.floor(Math.random() * 20) + 60,
          reason: 'Préfixe personnel qui crée un lien direct avec les clients.'
        },
        {
          domain: `${baseName}pro.${tld}`,
          available: !baseName.includes('aquarios'), // Non disponible si contient aquarios
          price: '13,99€',
          score: Math.floor(Math.random() * 20) + 75,
          reason: 'Ajoute une touche professionnelle à votre marque.'
        },
        {
          domain: `${baseName}.io`,
          available: !baseName.includes('aquarios'), // Non disponible si contient aquarios
          price: '39,99€',
          score: Math.floor(Math.random() * 15) + 80,
          reason: 'Domaine moderne populaire dans la tech et les startups.'
        },
        {
          domain: `${baseName}media.${tld}`,
          available: !baseName.includes('aquarios'), // Non disponible si contient aquarios
          price: '12,99€',
          score: Math.floor(Math.random() * 20) + 65,
          reason: 'Parfait pour les entreprises de médias et de contenu.'
        },
        {
          domain: `get${baseName}.${tld}`,
          available: !baseName.includes('aquarios'), // Non disponible si contient aquarios
          price: '14,99€',
          score: Math.floor(Math.random() * 20) + 70,
          reason: 'Incite à l\'action, idéal pour les produits et services.'
        },
        {
          domain: `${baseName}.app`,
          available: !baseName.includes('aquarios'), // Non disponible si contient aquarios
          price: '19,99€',
          score: Math.floor(Math.random() * 15) + 75,
          reason: 'Parfait pour les applications et services numériques.'
        },
        {
          domain: `${baseName}hub.${tld}`,
          available: !baseName.includes('aquarios'), // Non disponible si contient aquarios
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
