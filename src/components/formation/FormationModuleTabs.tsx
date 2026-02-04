import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formationModules, moduleCategories } from './formationModulesData';

const FormationModuleTabs = () => {
  const [activeModule, setActiveModule] = useState(1);
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'specialized' | 'advanced'>('all');

  const filteredModules = activeCategory === 'all' 
    ? formationModules 
    : formationModules.filter(m => m.category === activeCategory);

  const currentModule = formationModules.find(m => m.id === activeModule) || formationModules[0];
  const Icon = currentModule.icon;

  const goToNext = () => {
    const currentIndex = filteredModules.findIndex(m => m.id === activeModule);
    if (currentIndex < filteredModules.length - 1) {
      setActiveModule(filteredModules[currentIndex + 1].id);
    }
  };

  const goToPrev = () => {
    const currentIndex = filteredModules.findIndex(m => m.id === activeModule);
    if (currentIndex > 0) {
      setActiveModule(filteredModules[currentIndex - 1].id);
    }
  };

  const currentIndex = filteredModules.findIndex(m => m.id === activeModule);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === filteredModules.length - 1;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 mx-auto">
          <Rocket className="h-4 w-4" />
          Formation EbookStudio Pro
          <Badge variant="secondary" className="bg-white/20 text-white text-[10px]">
            {formationModules.length} Modules
          </Badge>
        </div>
        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-pink-500 to-rose-500 bg-clip-text text-transparent">
          Formation Complète 2026
        </CardTitle>
        <p className="text-muted-foreground mt-2 text-lg">
          Maîtrisez chaque outil avec nos {formationModules.length} modules détaillés
        </p>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('all')}
            className="text-xs"
          >
            Tous ({formationModules.length})
          </Button>
          {Object.entries(moduleCategories).map(([key, { label }]) => (
            <Button
              key={key}
              variant={activeCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(key as typeof activeCategory)}
              className="text-xs"
            >
              {label} ({formationModules.filter(m => m.category === key).length})
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="px-4 md:px-6 pb-8">
        {/* Liste des modules en accordéon sur mobile, grille sur desktop */}
        <div className="mb-6">
          {/* Vue desktop : grille de badges */}
          <div className="hidden md:flex flex-wrap justify-center gap-2 mb-6">
            {filteredModules.map((module) => {
              const ModuleIcon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeModule === module.id
                      ? `bg-gradient-to-r ${module.color} text-white shadow-lg scale-105`
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <ModuleIcon className="h-4 w-4" />
                  <span>{module.shortTitle}</span>
                  {module.isNew && (
                    <Badge className="bg-yellow-500 text-black text-[9px] px-1 py-0">
                      NEW
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Vue mobile : accordéon */}
          <div className="md:hidden">
            <Accordion type="single" collapsible value={activeModule.toString()} onValueChange={(val) => val && setActiveModule(parseInt(val))}>
              {filteredModules.map((module) => {
                const ModuleIcon = module.icon;
                return (
                  <AccordionItem key={module.id} value={module.id.toString()}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                          <ModuleIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">{module.title}</span>
                        {module.isNew && (
                          <Badge className="bg-yellow-500 text-black text-[9px] px-1 py-0 ml-1">
                            NEW
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-4">
                        <p className="text-muted-foreground text-sm mb-4">{module.description}</p>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{module.content}</ReactMarkdown>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>

        {/* Contenu du module actif (desktop) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Image du module */}
            <div className="relative overflow-hidden rounded-xl border border-border shadow-lg">
              <div className={`absolute inset-0 bg-gradient-to-br ${currentModule.color} opacity-10`} />
              <img 
                src={currentModule.image} 
                alt={currentModule.title}
                className="w-full h-48 md:h-64 lg:h-80 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentModule.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-white/20 text-white mb-1">
                        Module {currentModule.id}
                      </Badge>
                      {currentModule.isNew && (
                        <Badge className="bg-yellow-500 text-black text-[9px] mb-1 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          NOUVEAU 2026
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg">{currentModule.title}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu du module */}
            <div className="bg-card rounded-xl border border-border p-6 overflow-auto max-h-80 lg:max-h-96">
              <p className="text-muted-foreground mb-4">{currentModule.description}</p>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{currentModule.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation et progression */}
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* Boutons de navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrev}
              disabled={isFirst}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {filteredModules.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={isLast}
              className="flex items-center gap-1"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Indicateurs de progression */}
          <div className="flex justify-center gap-1 flex-wrap max-w-md">
            {filteredModules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeModule === module.id 
                    ? 'w-6 bg-primary' 
                    : module.isNew 
                      ? 'bg-yellow-500/50 hover:bg-yellow-500'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                title={module.title}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormationModuleTabs;
