
import React from 'react';
import { ExternalLink, Lightbulb, CheckCircle } from 'lucide-react';

interface ContentGeneratorProps {
  contentKeyword: string;
  handleContentKeywordChange: (keyword: string) => void;
  generatedContent: {
    title: string;
    intro: string;
    sections: Array<{ heading: string; content: string; }>;
    improvements: string[];
    externalResources: Array<{
      title: string;
      url: string;
      description: string;
    }>;
  } | null;
  mockContentIdeas: any[];
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  contentKeyword,
  handleContentKeywordChange,
  generatedContent,
  mockContentIdeas
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-3">Générateur de contenu intelligent</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mot-clé principal
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={contentKeyword}
            onChange={(e) => handleContentKeywordChange(e.target.value)}
            placeholder="Entrez un mot-clé (ex: voyage Paris, SEO technique...)"
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Générer du contenu
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Le contenu sera adapté automatiquement selon le domaine détecté (voyage, tech, business...)
        </p>
      </div>
      
      {generatedContent && (
        <div className="mt-4 space-y-4">
          {/* Contenu généré */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-700 mb-2">{generatedContent.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{generatedContent.intro}</p>
            
            {generatedContent.sections.map((section, index) => (
              <div key={index} className="mb-3 border-l-2 border-indigo-200 pl-3">
                <h5 className="font-medium text-gray-700 mb-1">{section.heading}</h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {section.content.substring(0, 150)}...
                </p>
              </div>
            ))}
          </div>

          {/* Suggestions d'amélioration */}
          {generatedContent.improvements && generatedContent.improvements.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Suggestions d'amélioration
              </h4>
              <ul className="space-y-2">
                {generatedContent.improvements.slice(0, 5).map((improvement, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-1 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ressources externes */}
          {generatedContent.externalResources && generatedContent.externalResources.length > 0 && (
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Ressources externes recommandées
              </h4>
              <div className="space-y-3">
                {generatedContent.externalResources.map((resource, index) => (
                  <div key={index} className="bg-white p-3 rounded border border-green-200">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-green-700 hover:text-green-900 flex items-center gap-1"
                    >
                      {resource.title}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <p className="text-xs text-green-600 mt-1">{resource.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4">
        <h4 className="font-medium text-gray-700 mb-2">Idées de contenu populaires</h4>
        <div className="space-y-2">
          {mockContentIdeas.map((idea, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-md">
              <h5 className="font-medium text-gray-700">{idea.title}</h5>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>{idea.visits} visites</span>
                <span>{idea.backlinks} backlinks</span>
                <span>{idea.socialShares.facebook + idea.socialShares.pinterest + idea.socialShares.reddit} partages</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
