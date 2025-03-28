
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Check, X, Smartphone, Lightbulb } from 'lucide-react';

interface MobileAnalysisProps {
  viewportMeta: boolean;
  responsiveImages: boolean;
  touchTargetSize: boolean;
  fontScale: boolean;
  score: number;
}

const MobileAnalysis: React.FC<MobileAnalysisProps> = ({
  viewportMeta,
  responsiveImages,
  touchTargetSize,
  fontScale,
  score = 0
}) => {
  // Vérifier que les propriétés booléennes sont correctement interprétées
  const hasViewportMeta = viewportMeta === true || viewportMeta === "true";
  const hasResponsiveImages = responsiveImages === true || responsiveImages === "true";
  const hasTouchTargetSize = touchTargetSize === true || touchTargetSize === "true";
  const hasFontScale = fontScale === true || fontScale === "true";
  
  // Calculer le score sur 4 critères
  const criteriaCount = 4;
  const passedCriteria = [hasViewportMeta, hasResponsiveImages, hasTouchTargetSize, hasFontScale].filter(Boolean).length;
  const calculatedScore = score || Math.round((passedCriteria / criteriaCount) * 100);
  
  // Déterminer la classe de couleur pour le score
  const getScoreColorClass = (scoreValue: number) => {
    if (scoreValue >= 80) return "text-green-600";
    if (scoreValue >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Obtenir le message de statut en fonction du score
  const getStatusMessage = (scoreValue: number) => {
    if (scoreValue >= 80) return "Très bon";
    if (scoreValue >= 60) return "Acceptable";
    return "À améliorer";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-medium">Analyse de compatibilité mobile</h3>
        </div>
        <div className={`text-2xl font-bold ${getScoreColorClass(calculatedScore)}`}>
          {calculatedScore}/100
          <span className="text-sm font-normal ml-2 text-gray-500">
            ({getStatusMessage(calculatedScore)})
          </span>
        </div>
      </div>
      
      <Progress value={calculatedScore} className="h-2" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border ${hasViewportMeta ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
          <div className="flex items-center gap-2">
            {hasViewportMeta ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
            <h4 className="font-medium">Meta viewport</h4>
          </div>
          <p className="text-sm mt-2 text-gray-600">
            {hasViewportMeta 
              ? "La balise meta viewport est présente, permettant un affichage adaptatif." 
              : "La balise meta viewport est absente, ce qui peut causer des problèmes d'affichage sur mobile."}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg border ${hasResponsiveImages ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
          <div className="flex items-center gap-2">
            {hasResponsiveImages ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
            <h4 className="font-medium">Images responsives</h4>
          </div>
          <p className="text-sm mt-2 text-gray-600">
            {hasResponsiveImages 
              ? "Les images sont configurées pour s'adapter aux différentes tailles d'écran." 
              : "Les images ne sont pas optimisées pour s'adapter aux écrans mobiles."}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg border ${hasTouchTargetSize ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
          <div className="flex items-center gap-2">
            {hasTouchTargetSize ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
            <h4 className="font-medium">Taille des zones tactiles</h4>
          </div>
          <p className="text-sm mt-2 text-gray-600">
            {hasTouchTargetSize 
              ? "Les zones tactiles (boutons, liens) sont suffisamment grandes pour une utilisation mobile." 
              : "Certaines zones tactiles sont trop petites, ce qui peut rendre difficile l'utilisation sur mobile."}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg border ${hasFontScale ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
          <div className="flex items-center gap-2">
            {hasFontScale ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
            <h4 className="font-medium">Mise à l'échelle des polices</h4>
          </div>
          <p className="text-sm mt-2 text-gray-600">
            {hasFontScale 
              ? "Les textes peuvent être agrandis sans perte de fonctionnalité." 
              : "Les textes ne s'adaptent pas correctement aux préférences d'accessibilité."}
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Recommandations d'amélioration</h4>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc pl-5">
              {!hasViewportMeta && (
                <li>Ajoutez une balise meta viewport avec content="width=device-width, initial-scale=1"</li>
              )}
              {!hasResponsiveImages && (
                <li>Utilisez des attributs srcset ou des images fluides avec max-width: 100%</li>
              )}
              {!hasTouchTargetSize && (
                <li>Assurez-vous que les boutons et liens ont une taille minimum de 44x44px</li>
              )}
              {!hasFontScale && (
                <li>Évitez d'utiliser des tailles de police fixées en pixels, préférez les unités relatives</li>
              )}
              {(hasViewportMeta && hasResponsiveImages && hasTouchTargetSize && hasFontScale) && (
                <li>Votre site est bien optimisé pour les appareils mobiles!</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAnalysis;
