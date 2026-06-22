import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { CheckCircle2, ExternalLink, FileText, Wrench, HelpCircle } from 'lucide-react';
import type { MasterclassModule } from '@/data/masterclassModules';

interface Props {
  module: MasterclassModule;
}

const MasterclassTabs: React.FC<Props> = ({ module }) => {
  const [tab, setTab] = useState('notes');

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="notes" className="gap-1.5">
          <FileText className="w-4 h-4" /> <span className="hidden sm:inline">Notes</span>
        </TabsTrigger>
        <TabsTrigger value="resources" className="gap-1.5">
          <Wrench className="w-4 h-4" /> <span className="hidden sm:inline">Ressources</span>
        </TabsTrigger>
        <TabsTrigger value="faq" className="gap-1.5">
          <HelpCircle className="w-4 h-4" /> <span className="hidden sm:inline">FAQ</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="notes" className="mt-4">
        <p className="text-sm text-muted-foreground mb-4">{module.summary}</p>
        <ul className="space-y-2">
          {module.keyPoints.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="resources" className="mt-4">
        <div className="flex flex-col gap-2">
          {module.resources.map((r, i) => {
            const external = r.href.startsWith('http');
            return (
              <a
                key={i}
                href={r.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <span>{r.label}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="faq" className="mt-4">
        <Accordion type="single" collapsible className="w-full">
          {module.faq.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-sm text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>
    </Tabs>
  );
};

export default MasterclassTabs;
