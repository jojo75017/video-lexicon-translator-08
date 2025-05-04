
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface AiAssistantProps {
  onUseResponse?: (response: string) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ onUseResponse }) => {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerateDescription = () => {
    setLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = "";
      
      if (role.toLowerCase().includes("marketing")) {
        response = "Expert en marketing digital spécialisé dans l'optimisation SEO et les stratégies de contenu à fort impact.";
      } else if (role.toLowerCase().includes("dev") || role.toLowerCase().includes("développeur")) {
        response = "Développeur fullstack expérimenté avec une expertise en React, Node.js et architectures cloud modernes.";
      } else if (role.toLowerCase().includes("design")) {
        response = "Designer UX/UI créatif spécialisé dans la conception d'interfaces utilisateur intuitives et esthétiques.";
      } else if (role.toLowerCase().includes("manag")) {
        response = "Manager de projet agile avec une expertise dans la coordination d'équipes multidisciplinaires et l'optimisation des workflows.";
      } else {
        response = `Professionnel expérimenté en ${role || "technologie"} avec une expertise reconnue dans le développement de solutions innovantes.`;
      }
      
      setResult(response);
      setLoading(false);
      toast.success("Description générée avec succès");
    }, 1500);
  };

  const handleUseResponse = () => {
    if (onUseResponse && result) {
      onUseResponse(result);
      toast.success("Description ajoutée à votre signature");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-md p-4 bg-blue-50 border-blue-200">
        <h3 className="font-medium text-lg flex items-center gap-2 text-blue-700">
          <Sparkles className="h-5 w-5" />
          Assistant IA pour votre signature
        </h3>
        <p className="text-sm text-blue-600 mt-1">
          Notre assistant IA peut vous aider à créer une description professionnelle pour votre poste.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            Votre rôle / poste
          </label>
          <Input
            id="role"
            placeholder="ex: Marketing Manager, Développeur Web, Designer UX..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="query" className="block text-sm font-medium mb-1">
            Précisez vos compétences ou spécialités (optionnel)
          </label>
          <Textarea
            id="query"
            placeholder="ex: SEO, React, design d'interface, management d'équipe..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
          />
        </div>
        
        <Button 
          onClick={handleGenerateDescription}
          disabled={loading || !role}
          className="w-full"
        >
          {loading ? "Génération en cours..." : "Générer une description professionnelle"}
        </Button>
      </div>

      {result && (
        <div className="mt-6 border rounded-md p-4 bg-green-50 border-green-200">
          <h4 className="font-medium text-green-700">Résultat</h4>
          <p className="text-green-800 my-2">{result}</p>
          <Button 
            onClick={handleUseResponse}
            variant="outline" 
            size="sm"
            className="mt-2"
          >
            Utiliser cette description
          </Button>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
