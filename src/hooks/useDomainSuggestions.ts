
import { useState } from 'react';
import { DomainSuggestion } from '@/types/domain';

export const useDomainSuggestions = (domain: string) => {
  const [isGeneratingAiSuggestions, setIsGeneratingAiSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<DomainSuggestion[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Nouveaux états pour les filtres avancés
  const [minScore, setMinScore] = useState(60);
  const [maxPrice, setMaxPrice] = useState(100);
  const [includeNonLatin, setIncludeNonLatin] = useState(false);
  const [domainLength, setDomainLength] = useState([3, 20]);
  const [preferredExtensions, setPreferredExtensions] = useState<string[]>(['.com', '.net', '.org']);

  const generateAdvancedAiSuggestions = async () => {
    if (!domain) return;
    
    setIsGeneratingAiSuggestions(true);
    
    try {
      // Simuler une opération d'IA qui prend un peu de temps
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const baseName = domain.split('.')[0];
      const variations: DomainSuggestion[] = [
        { 
          domain: `${baseName}pro.com`, 
          score: 92, 
          reason: "Version professionnelle avec TLD premium",
          available: true,
          price: "12.99€/an",
          aiGenerated: true,
          categoryRelevance: 95,
          brandability: 87,
          memorability: 91,
          seoFriendliness: 94,
          trademarkedRisk: 'low'
        },
        { 
          domain: `my${baseName}.com`, 
          score: 88, 
          reason: "Préfixe engageant qui personnalise l'expérience",
          available: true,
          price: "14.99€/an",
          aiGenerated: true,
          categoryRelevance: 82,
          brandability: 90,
          memorability: 88,
          seoFriendliness: 86,
          trademarkedRisk: 'low'
        },
        { 
          domain: `${baseName}hub.com`, 
          score: 85, 
          reason: "Suggère une plateforme centrale pour votre activité",
          available: true,
          price: "15.99€/an",
          aiGenerated: true,
          categoryRelevance: 88,
          brandability: 82,
          memorability: 84,
          seoFriendliness: 90,
          trademarkedRisk: 'low'
        },
        { 
          domain: `${baseName}.io`, 
          score: 84, 
          reason: "TLD moderne idéal pour les technologies et startups",
          available: true,
          price: "29.99€/an",
          aiGenerated: true,
          categoryRelevance: 77,
          brandability: 85,
          memorability: 82,
          seoFriendliness: 83,
          trademarkedRisk: 'low'
        },
        { 
          domain: `get${baseName}.com`, 
          score: 82, 
          reason: "Suggère une action directe et une accessibilité",
          available: true,
          price: "14.99€/an",
          aiGenerated: true,
          categoryRelevance: 79,
          brandability: 84,
          memorability: 80,
          seoFriendliness: 87,
          trademarkedRisk: 'low'
        }
      ];
      
      // Application des filtres
      const filteredSuggestions = variations.filter(suggestion => {
        if (suggestion.score < minScore) return false;
        
        const price = parseFloat(suggestion.price?.replace('€/an', '') || '0');
        if (price > maxPrice) return false;
        
        const name = suggestion.domain.split('.')[0];
        if (name.length < domainLength[0] || name.length > domainLength[1]) return false;
        
        const ext = `.${suggestion.domain.split('.').pop()}`;
        if (preferredExtensions.length > 0 && !preferredExtensions.includes(ext)) return false;
        
        return true;
      });
      
      // Mise à jour des suggestions générées
      setAiSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Erreur lors de la génération des suggestions avancées:", error);
    } finally {
      setIsGeneratingAiSuggestions(false);
    }
  };

  return {
    isGeneratingAiSuggestions,
    aiSuggestions,
    generateAdvancedAiSuggestions,
    categoryFilter,
    setCategoryFilter,
    minScore,
    setMinScore,
    maxPrice,
    setMaxPrice,
    includeNonLatin,
    setIncludeNonLatin,
    domainLength,
    setDomainLength,
    preferredExtensions,
    setPreferredExtensions
  };
};

export default useDomainSuggestions;
