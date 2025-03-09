
import React from 'react';

interface ContentGeneratorProps {
  contentKeyword: string;
  handleContentKeywordChange: (keyword: string) => void;
  generatedContent: {
    title: string;
    intro: string;
    sections: Array<{ heading: string; content: string; }>;
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
      <h3 className="font-semibold text-lg mb-3">Générateur de contenu</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mot-clé principal
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={contentKeyword}
            onChange={(e) => handleContentKeywordChange(e.target.value)}
            placeholder="Entrez un mot-clé"
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Générer du contenu
          </button>
        </div>
      </div>
      
      {generatedContent && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">{generatedContent.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{generatedContent.intro}</p>
          
          {generatedContent.sections.map((section, index) => (
            <div key={index} className="mb-3">
              <h5 className="font-medium text-gray-700">{section.heading}</h5>
              <p className="text-sm text-gray-600">{section.content}</p>
            </div>
          ))}
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
