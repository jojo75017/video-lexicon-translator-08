
import React from 'react';
import { PerformanceMetricsSectionProps } from './types';
import { Lightbulb, Image, FileCode, FileJson, Server, Check, AlertCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Recommendations: React.FC<PerformanceMetricsSectionProps> = ({ 
  deviceData,
  activeDevice
}) => {
  // Fonction pour déterminer les recommandations basées sur les métriques
  const getRecommendations = () => {
    const recommendations = [];
    
    // Vérifier le temps de chargement
    if (deviceData.loadTime > 3000) {
      recommendations.push({
        id: 'loadTime',
        title: 'Optimisez le temps de chargement',
        description: 'Le temps de chargement total dépasse 3 secondes, ce qui peut augmenter le taux de rebond.',
        priority: 'high',
        icon: Server,
        tips: ['Utilisez un CDN pour servir vos ressources statiques', 'Activez la mise en cache du navigateur', 'Optimisez votre serveur et base de données']
      });
    }
    
    // Vérifier LCP
    if (deviceData.largestContentfulPaint && deviceData.largestContentfulPaint > 2500) {
      recommendations.push({
        id: 'lcp',
        title: 'Améliorez le LCP (Largest Contentful Paint)',
        description: 'Le plus grand contenu visible prend trop de temps à s\'afficher.',
        priority: 'high',
        icon: Image,
        tips: ['Optimisez les images et assurez-vous qu\'elles ont des dimensions appropriées', 'Utilisez le lazy loading pour les images hors écran', 'Préchargez les ressources critiques']
      });
    }
    
    // Vérifier CLS
    if (deviceData.cumulativeLayoutShift && deviceData.cumulativeLayoutShift > 0.25) {
      recommendations.push({
        id: 'cls',
        title: 'Réduisez le décalage de mise en page (CLS)',
        description: 'Le décalage cumulatif de mise en page est trop élevé, créant une expérience utilisateur frustrante.',
        priority: 'medium',
        icon: FileJson,
        tips: ['Définissez les dimensions des images et éléments média', 'Évitez d\'insérer du contenu dynamique au-dessus du contenu existant', 'Utilisez des placeholders pour le contenu qui se charge tardivement']
      });
    }
    
    // Vérifier JavaScript
    if (deviceData.resourceBreakdown && deviceData.resourceBreakdown.js > 400000) {
      recommendations.push({
        id: 'javascript',
        title: 'Réduisez la taille de JavaScript',
        description: 'La taille totale de JavaScript est excessive et ralentit le chargement de la page.',
        priority: 'high',
        icon: FileCode,
        tips: ['Divisez votre code en petits modules et utilisez le code splitting', 'Éliminez les dépendances inutilisées', 'Minifiez et compressez vos fichiers JavaScript']
      });
    }
    
    return recommendations;
  };
  
  const recommendations = getRecommendations();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
        <Lightbulb className="inline-block mr-2 h-5 w-5 text-indigo-500" />
        Recommandations d'optimisation
      </h3>
      
      {recommendations.length === 0 ? (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center">
          <Check className="h-5 w-5 text-green-500 mr-2" />
          <p className="text-green-700">
            Félicitations ! Votre site est bien optimisé pour la performance sur {activeDevice === 'mobile' ? 'mobile' : 'desktop'}.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {recommendations.map((rec, index) => (
            <Card key={rec.id} className="border overflow-hidden hover:shadow-md transition-all">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 flex justify-between items-center">
                <div className="flex items-center">
                  <rec.icon className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="font-medium text-indigo-900">{rec.title}</h4>
                </div>
                <Badge className={getPriorityColor(rec.priority)}>
                  {rec.priority === 'high' ? 'Priorité haute' : rec.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                </Badge>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-3">{rec.description}</p>
                
                <h5 className="text-sm font-medium text-gray-700 mb-2">Actions recommandées :</h5>
                <ul className="space-y-1">
                  {rec.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-gray-600 flex items-start">
                      <span className="text-indigo-500 mr-2 inline-block mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
