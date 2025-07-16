
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ContentIdea {
  title: string;
  type: string;
}

interface ContentIdeasProps {
  contentIdeas: ContentIdea[];
  relatedKeywords: string[];
}

const ContentIdeas: React.FC<ContentIdeasProps> = ({ contentIdeas, relatedKeywords }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium mb-3">Suggestions d'articles</h3>
        <div className="space-y-3">
          {contentIdeas.map((idea, index) => (
            <div key={index} className="p-4 bg-white border rounded-md hover:border-blue-300 hover:shadow transition-all">
              <div className="flex justify-between">
                <h4 className="font-medium text-blue-800">{idea.title}</h4>
                <Badge variant="secondary">{idea.type}</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Mots-clés associés: {
                  relatedKeywords.slice(index % relatedKeywords.length, (index % relatedKeywords.length) + 2).join(', ')
                }
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentIdeas;
