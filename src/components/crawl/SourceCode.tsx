
import { Code } from "lucide-react";
import { useState, useEffect } from "react";

interface SourceCodeProps {
  sourceCode: string;
}

export const SourceCode = ({ sourceCode }: SourceCodeProps) => {
  const [formattedCode, setFormattedCode] = useState<string>("");
  
  useEffect(() => {
    console.log("SourceCode component received code:", !!sourceCode);
    
    if (sourceCode) {
      // Format HTML for better display
      try {
        // Enhanced formatting to better highlight HTML tags with distinct colors for different elements
        let formatted = sourceCode
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        
        // Highlight HTML structure elements  
        formatted = formatted
          // Replace opening tags with highlighted versions
          .replace(/&lt;([\/]?[a-zA-Z0-9]+)([^&]*?)&gt;/g, (match, tag, attrs) => {
            // Different colors for different tag types
            let tagClass = 'text-blue-600';
            
            // Headings get special colors
            if (tag === 'h1' || tag === '/h1') tagClass = 'text-red-600 font-bold text-lg';
            else if (tag === 'h2' || tag === '/h2') tagClass = 'text-orange-600 font-bold';
            else if (tag === 'h3' || tag === '/h3') tagClass = 'text-yellow-600 font-bold';
            else if (tag === 'p' || tag === '/p') tagClass = 'text-green-600';
            else if (tag === 'img' || tag === '/img') tagClass = 'text-purple-600';
            else if (tag === 'a' || tag === '/a') tagClass = 'text-blue-500';
            else if (tag === 'div' || tag === '/div') tagClass = 'text-gray-600';
            else if (tag === 'span' || tag === '/span') tagClass = 'text-gray-500';
            else if (tag === 'meta' || tag === 'title' || tag === '/title') tagClass = 'text-pink-600 font-semibold';
            
            // Format attributes within tags
            let formattedAttrs = attrs;
            if (attrs) {
              formattedAttrs = attrs.replace(/([a-zA-Z0-9\-_]+)=["']([^"']*)["']/g, 
                '<span class="text-purple-600">$1</span>=<span class="text-amber-500">"$2"</span>');
            }
            
            return `&lt;<span class="${tagClass}">${tag}</span>${formattedAttrs}&gt;`;
          });
        
        setFormattedCode(formatted);
      } catch (error) {
        console.error("Error formatting source code:", error);
        setFormattedCode(sourceCode.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
      }
    }
  }, [sourceCode]);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm" id="source" data-section="source">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b flex items-center gap-2">
        <Code className="w-4 h-4" />
        <h4 className="font-medium text-sm">Code Source HTML</h4>
      </div>
      <div className="bg-white dark:bg-gray-900 p-4">
        {sourceCode ? (
          <pre className="text-sm font-mono overflow-x-auto max-h-[600px] overflow-y-auto whitespace-pre-wrap rounded bg-gray-50 p-4 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            <div dangerouslySetInnerHTML={{ __html: formattedCode }} />
          </pre>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucun code source disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};
