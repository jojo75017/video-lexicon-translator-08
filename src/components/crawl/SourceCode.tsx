
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
        <pre className="text-sm font-mono overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre-wrap">
          {sourceCode}
        </pre>
      </div>
    </div>
  );
};
