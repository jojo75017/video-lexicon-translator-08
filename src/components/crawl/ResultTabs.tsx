
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from "lucide-react";
import { SiteInfo } from "./SiteInfo";
import { SourceCode } from "./SourceCode";

interface ResultTabsProps {
  data: any;
}

export const ResultTabs = ({ data }: ResultTabsProps) => {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="w-full grid grid-cols-2 bg-muted/50 p-1 rounded-lg">
        <TabsTrigger 
          value="info"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
        >
          Informations
        </TabsTrigger>
        <TabsTrigger 
          value="source"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
        >
          <Code className="w-4 h-4 mr-2" />
          Code Source
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-6 space-y-6">
        <SiteInfo data={data} />
      </TabsContent>

      <TabsContent value="source" className="mt-6">
        <SourceCode sourceCode={data.sourceCode} />
      </TabsContent>
    </Tabs>
  );
};
