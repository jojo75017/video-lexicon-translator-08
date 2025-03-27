
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
        // Enhanced formatting to better highlight HTML tags
        const formatted = sourceCode
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/&lt;([\/]?[a-zA-Z0-9]+)/g, "<span class='text-blue-600 font-bold'>&lt;$1</span>")
          .replace(/([a-zA-Z0-9\-]+)=["']/g, "<span class='text-purple-600'>$1</span>=&quot;")
          .replace(/["']>/g, "&quot;&gt;")
          // Highlight headings with different colors
          .replace(/&lt;h1/g, "<span class='text-red-600 font-bold'>&lt;h1</span>")
          .replace(/&lt;\/h1/g, "<span class='text-red-600 font-bold'>&lt;/h1</span>")
          .replace(/&lt;h2/g, "<span class='text-orange-600 font-bold'>&lt;h2</span>")
          .replace(/&lt;\/h2/g, "<span class='text-orange-600 font-bold'>&lt;/h2</span>")
          .replace(/&lt;h3/g, "<span class='text-yellow-600 font-bold'>&lt;h3</span>")
          .replace(/&lt;\/h3/g, "<span class='text-yellow-600 font-bold'>&lt;/h3</span>");
        
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
          <pre className="text-sm font-mono overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre-wrap rounded bg-gray-50 p-4 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
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
