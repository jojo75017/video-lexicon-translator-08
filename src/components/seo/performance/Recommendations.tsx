
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { RecommendationsProps } from './types';

const Recommendations: React.FC<RecommendationsProps> = ({ 
  activeDevice, 
  deviceData 
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
      <div className="flex items-start gap-2">
        <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-800">
            {activeDevice === 'mobile' ? 'Recommandations d\'optimisation mobile' : 'Recommandations d\'optimisation desktop'}
          </h4>
          <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc pl-5">
            {activeDevice === 'mobile' && (
              <>
                {deviceData.loadTime > 3500 && (
                  <li>Optimisez spécifiquement pour les connexions mobiles plus lentes (3G/4G)</li>
                )}
                {deviceData.firstContentfulPaint > 1200 && (
                  <li>Réduisez les CSS bloquants pour améliorer le rendu initial sur mobile</li>
                )}
                {deviceData.resourceBreakdown?.images && deviceData.resourceBreakdown.images > 400000 && (
                  <li>Utilisez des images responsive avec srcset pour les appareils mobiles</li>
                )}
                {deviceData.cumulativeLayoutShift && deviceData.cumulativeLayoutShift > 0.25 && (
                  <li>Corrigez les changements de mise en page inattendus sur mobile (CLS élevé)</li>
                )}
                <li>Utilisez AMP (Accelerated Mobile Pages) pour une expérience ultra-rapide</li>
                <li>Testez l'interface tactile et assurez-vous que les éléments cliquables sont suffisamment grands</li>
                <li>Évitez les redirections sur mobile qui ralentissent le chargement</li>
              </>
            )}
                
            {activeDevice === 'desktop' && (
              <>
                {deviceData.loadTime > 3000 && (
                  <li>Réduisez le temps de chargement total, idéalement en dessous de 3 secondes</li>
                )}
                {deviceData.firstContentfulPaint > 1000 && (
                  <li>Améliorez le premier affichage du contenu en optimisant le CSS critique</li>
                )}
                {deviceData.resourceBreakdown?.images && deviceData.resourceBreakdown.images > 500000 && (
                  <li>Compressez et optimisez les images pour réduire leur taille</li>
                )}
                {deviceData.resourceBreakdown?.scripts && deviceData.resourceBreakdown.scripts > 400000 && (
                  <li>Minifiez et divisez vos scripts JavaScript</li>
                )}
                {deviceData.timeToInteractive && deviceData.timeToInteractive > 3500 && (
                  <li>Réduisez le JavaScript qui bloque l'interactivité</li>
                )}
                <li>Utilisez un système de mise en cache efficace pour les ressources statiques</li>
                <li>Implémentez le chargement différé (lazy loading) pour les images</li>
              </>
            )}
            
            <li>Adoptez un CDN pour améliorer les temps de réponse globaux</li>
            <li>Activez la compression GZIP/Brotli pour réduire la taille des transferts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
