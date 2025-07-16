
import React from 'react';
import { Check, Award } from 'lucide-react';

interface DomainQualityProps {
  domain: string;
}

export const DomainQualityScore: React.FC<DomainQualityProps> = ({ domain }) => {
  // Évaluer la qualité du nom de domaine
  const evaluateDomainQuality = (domain: string) => {
    if (!domain) return { score: 0, feedback: [] };
    
    const feedback = [];
    let score = 0;
    
    // Vérifier la longueur
    const name = domain.split('.')[0];
    if (name.length <= 10) {
      score += 20;
      feedback.push("Longueur idéale: Moins de 10 caractères");
    } else if (name.length <= 15) {
      score += 15;
      feedback.push("Longueur acceptable: 10-15 caractères");
    } else {
      score += 5;
      feedback.push("Nom trop long: Plus de 15 caractères");
    }
    
    // Vérifier si contient des chiffres
    if (/\d/.test(name)) {
      score += 5;
      feedback.push("Contient des chiffres: Peut réduire la mémorabilité");
    } else {
      score += 15;
      feedback.push("Sans chiffres: Plus mémorable");
    }
    
    // Vérifier si contient des tirets
    if (name.includes('-')) {
      score += 5;
      feedback.push("Contient des tirets: Peut réduire la mémorabilité");
    } else {
      score += 15;
      feedback.push("Sans tirets: Plus facile à communiquer");
    }
    
    // Vérifier l'extension
    const extension = domain.split('.').pop();
    if (extension === 'com') {
      score += 25;
      feedback.push("Extension .com: Extension premium la plus reconnue");
    } else if (['org', 'net', 'io'].includes(extension)) {
      score += 20;
      feedback.push(`Extension .${extension}: Extension bien établie`);
    } else {
      score += 10;
      feedback.push(`Extension .${extension}: Extension moins connue`);
    }
    
    // Vérifier la facilité de prononciation (estimation simplifiée)
    const vowelsRatio = (name.match(/[aeiouy]/gi) || []).length / name.length;
    if (vowelsRatio >= 0.3 && vowelsRatio <= 0.6) {
      score += 25;
      feedback.push("Bonne prononciation: Équilibre voyelles/consonnes");
    } else {
      score += 10;
      feedback.push("Prononciation difficile: Déséquilibre voyelles/consonnes");
    }
    
    return {
      score: Math.min(score, 100),
      feedback
    };
  };
  
  const domainQuality = evaluateDomainQuality(domain);
  
  const getQualityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="mt-3 bg-green-100 rounded-md p-3">
      <div className="flex items-center mb-2">
        <Award className="h-4 w-4 text-green-700 mr-2" />
        <span className="font-medium">Qualité du nom de domaine</span>
      </div>
      <div className="flex items-center mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
          <div 
            className="bg-green-600 h-2.5 rounded-full" 
            style={{ width: `${domainQuality.score}%` }}
          ></div>
        </div>
        <span className={`font-medium ${getQualityColor(domainQuality.score)}`}>
          {domainQuality.score}/100
        </span>
      </div>
      <div className="text-xs space-y-1 mt-2">
        {domainQuality.feedback.map((item, index) => (
          <div key={index} className="flex items-center">
            <Check className="h-3 w-3 mr-1 text-green-600" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DomainQualityScore;
