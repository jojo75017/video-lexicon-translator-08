
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";

const WordCountTabContent: React.FC = () => {
  return (
    <TabsContent value="wordcount" className="mt-2">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Analyse de contenu - 500 mots</h2>
        <div className="space-y-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Objectif 500 mots</h3>
            <p className="text-gray-700 mb-4">
              L'objectif de cette section est de vous aider à créer un contenu optimal de 500 mots.
              Les articles de cette longueur sont idéaux pour de nombreux cas d'utilisation, notamment :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Articles de blog courts</li>
              <li>Pages de description de produit</li>
              <li>Résumés et introductions</li>
              <li>Contenu pour les réseaux sociaux</li>
              <li>Newsletters et emails</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Outil de comptage</h3>
              <textarea 
                className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Collez votre texte ici pour analyser le nombre de mots..."
              ></textarea>
              <div className="mt-3 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Mots: <span className="font-semibold">0</span> / 500
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Analyser
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Recommandations</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="font-medium text-blue-800">Structure idéale pour 500 mots</h4>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• Introduction (50-75 mots)</li>
                    <li>• 3-4 sections principales (300-350 mots)</li>
                    <li>• Conclusion (50-75 mots)</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-amber-50 rounded-md">
                  <h4 className="font-medium text-amber-800">Éléments à inclure</h4>
                  <ul className="mt-2 text-sm text-amber-700 space-y-1">
                    <li>• 1 titre H1 principal</li>
                    <li>• 3-4 sous-titres H2</li>
                    <li>• 1-2 mots-clés principaux (densité 1-2%)</li>
                    <li>• 2-3 mots-clés secondaires</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-green-50 rounded-md">
                  <h4 className="font-medium text-green-800">Conseils d'optimisation</h4>
                  <ul className="mt-2 text-sm text-green-700 space-y-1">
                    <li>• Phrases de 15-20 mots en moyenne</li>
                    <li>• Paragraphes de 2-3 phrases</li>
                    <li>• Inclure une liste à puces ou numérotée</li>
                    <li>• Utilisez des transitions entre les paragraphes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Exemples de contenu de 500 mots</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-medium text-blue-700">Article de blog</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Un article de blog de 500 mots couvre un sujet spécifique avec une introduction claire, 
                  3-4 points clés et une conclusion avec un appel à l'action.
                </p>
              </div>
              <div className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-medium text-blue-700">Description de produit</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Une description de produit de 500 mots présente les caractéristiques, avantages, 
                  spécifications et témoignages d'utilisateurs.
                </p>
              </div>
              <div className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-medium text-blue-700">Article d'actualité</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Un article d'actualité de 500 mots couvre les points essentiels (qui, quoi, où, quand, pourquoi)
                  avec des citations et un contexte pertinent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default WordCountTabContent;
