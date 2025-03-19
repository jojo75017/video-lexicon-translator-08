
import { Code } from "lucide-react";

interface SourceCodeProps {
  sourceCode: string;
}

export const SourceCode = ({ sourceCode }: SourceCodeProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b flex items-center gap-2">
        <Code className="w-4 h-4" />
        <h4 className="font-medium text-sm">Code Source HTML</h4>
      </div>
      <div className="bg-white dark:bg-gray-900 p-4">
        {sourceCode ? (
          <pre className="text-sm font-mono overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre-wrap rounded bg-gray-50 p-4 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            <div dangerouslySetInnerHTML={{ __html: sourceCode }} />
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
