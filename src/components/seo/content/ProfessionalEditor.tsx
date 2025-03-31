
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface ProfessionalEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  placeholder?: string;
}

// Ce composant simule un éditeur professionnel
// Dans une application réelle, vous pourriez utiliser TinyMCE, CKEditor ou autre
const ProfessionalEditor: React.FC<ProfessionalEditorProps> = ({
  value,
  onChange,
  height = "200px",
  placeholder = "Entrez votre contenu ici..."
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-100 border-b border-gray-200 p-2 flex items-center gap-2">
        <button className="p-1 hover:bg-gray-200 rounded">
          <span className="font-bold">B</span>
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <span className="italic">I</span>
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <span className="underline">U</span>
        </button>
        <span className="w-px h-5 bg-gray-300"></span>
        <button className="p-1 hover:bg-gray-200 rounded text-sm">H1</button>
        <button className="p-1 hover:bg-gray-200 rounded text-sm">H2</button>
        <button className="p-1 hover:bg-gray-200 rounded text-sm">H3</button>
        <span className="w-px h-5 bg-gray-300"></span>
        <button className="p-1 hover:bg-gray-200 rounded">
          <span>Link</span>
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <span>Image</span>
        </button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-none rounded-none focus-visible:ring-0 resize-none"
        placeholder={placeholder}
        style={{ height }}
      />
    </div>
  );
};

export default ProfessionalEditor;
