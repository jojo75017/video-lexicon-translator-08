import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, BookOpen, ChevronRight, Eye, X, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const FormationPage = () => {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);

  const modules = [
    {
      id: 1,
      title: "Configuration et Démarrage",
      description: "Installation, configuration API OpenAI, générateur d'idées",
      content: `# Module 1 : Configuration et Démarrage

## 1.1 Installation et Configuration Initiale

**Fonctionnalités principales :**
- Configuration de l'API OpenAI
- Paramétrage des préférences utilisateur
- Interface de navigation intuitive

**Actions à effectuer :**
1. Saisir votre clé API OpenAI
2. Configurer le nombre de chapitres par défaut
3. Paramétrer vos préférences de génération

### Captures d'écran à inclure :
- Écran de configuration API
- Panneau de paramètres utilisateur
- Interface de navigation principale

## 1.2 Générateur d'Idées d'Ebooks

**Fonctionnalités principales :**
- 50+ idées d'ebooks pré-générées
- Catégories diversifiées : Business, Santé, Technologie, Finance
- Système de génération automatique de nouveaux concepts

**Actions à effectuer :**
1. Explorer les catégories d'idées
2. Sélectionner une idée qui vous inspire
3. Transférer automatiquement vers le planificateur

### Captures d'écran à inclure :
- Grille des idées d'ebooks
- Catégories colorées par domaine
- Boutons d'action pour chaque idée
- Page de détail d'une idée sélectionnée`
    },
    {
      id: 2,
      title: "Planificateur d'Ebook",
      description: "Création du plan, gestion des chapitres, structure",
      content: `# Module 2 : Planificateur d'Ebook

## 2.1 Création du Plan Initial

**Fonctionnalités principales :**
- Génération automatique de structure
- Personnalisation du titre et de l'auteur
- Création de préface et conclusion
- Système de chapitres et sous-chapitres

**Actions à effectuer :**
1. Saisir le titre de l'ebook
2. Renseigner le nom de l'auteur
3. Générer la structure automatiquement
4. Personnaliser la préface et la conclusion

### Captures d'écran à inclure :
- Formulaire de création d'ebook
- Génération automatique de la structure
- Interface de modification des chapitres
- Aperçu de la structure générée

## 2.2 Gestion Avancée des Chapitres

**Fonctionnalités principales :**
- Drag & Drop pour réorganiser
- Fusion et division de chapitres
- Duplication de chapitres
- Ajout de sous-chapitres
- Suppression et modification

**Actions à effectuer :**
1. Réorganiser les chapitres par glisser-déposer
2. Diviser un chapitre en plusieurs parties
3. Fusionner des chapitres similaires
4. Ajouter des sous-chapitres détaillés

### Captures d'écran à inclure :
- Interface de drag & drop
- Outils de gestion des chapitres
- Édition de chapitre en cours
- Prévisualisation de la structure`
    },
    {
      id: 3,
      title: "Templates Professionnels",
      description: "Galerie de templates, personnalisation",
      content: `# Module 3 : Templates Professionnels

## 3.1 Galerie de Templates

**Templates disponibles :**
- **Business** : Guides entrepreneuriaux, stratégies
- **Fiction** : Romans, nouvelles, récits
- **Mémoires** : Autobiographies, témoignages
- **Guides** : Tutoriels, formations

**Actions à effectuer :**
1. Parcourir la galerie de templates
2. Prévisualiser les structures
3. Appliquer un template à votre ebook
4. Personnaliser selon vos besoins

### Captures d'écran à inclure :
- Galerie complète des templates
- Aperçu de chaque type de template
- Application d'un template
- Interface de personnalisation

## 3.2 Personnalisation des Templates

**Fonctionnalités principales :**
- Modification de la structure
- Adaptation du contenu
- Personnalisation des styles
- Sauvegarde de templates personnalisés`
    },
    {
      id: 4,
      title: "Génération de Contenu IA",
      description: "Rédaction automatique, outils d'écriture avancés",
      content: `# Module 4 : Génération de Contenu IA

## 4.1 Rédaction Automatique

**Fonctionnalités principales :**
- Génération de contenu par chapitre
- Génération de sous-chapitres détaillés
- Amélioration du style d'écriture
- Optimisation SEO automatique

**Actions à effectuer :**
1. Générer le contenu d'un chapitre
2. Améliorer le style d'écriture
3. Optimiser pour le SEO
4. Réviser et affiner le contenu

### Captures d'écran à inclure :
- Interface de génération de contenu
- Progression de la génération IA
- Éditeur de contenu intégré
- Options d'amélioration du style

## 4.2 Outils d'Écriture Avancés

**Fonctionnalités principales :**
- Analyse de texte existant
- Génération de table des matières
- Compteur de mots automatique
- Sauvegarde automatique`
    },
    {
      id: 5,
      title: "Outils Avancés",
      description: "Générateur de couverture IA, outils de productivité",
      content: `# Module 5 : Outils Avancés

## 5.1 Générateur de Couverture IA

**Fonctionnalités principales :**
- Création automatique de couvertures
- Styles variés et professionnels
- Personnalisation des couleurs
- Export haute résolution

**Actions à effectuer :**
1. Générer une couverture automatiquement
2. Choisir parmi plusieurs styles
3. Personnaliser les couleurs
4. Télécharger en haute résolution

### Captures d'écran à inclure :
- Interface de génération de couverture
- Galerie de styles disponibles
- Options de personnalisation
- Résultat final de la couverture

## 5.2 Outils de Productivité

**Fonctionnalités principales :**
- Sauvegarde automatique
- Statistiques détaillées
- Historique des modifications
- Export de brouillons`
    },
    {
      id: 6,
      title: "Banque d'Images IA",
      description: "Génération d'illustrations, optimisation visuelle",
      content: `# Module 6 : Banque d'Images IA

## 6.1 Génération d'Illustrations

**Fonctionnalités principales :**
- Génération d'images personnalisées
- Styles variés (réaliste, artistique, cartoon)
- Optimisation automatique des formats
- Intégration directe dans l'ebook

**Actions à effectuer :**
1. Créer des illustrations pour chaque chapitre
2. Générer des images de couverture
3. Optimiser les images pour différents formats
4. Intégrer automatiquement dans l'ebook

### Captures d'écran à inclure :
- Interface de génération d'images
- Galerie d'images générées
- Options de style et personnalisation
- Intégration dans l'ebook

## 6.2 Optimisation Visuelle

**Fonctionnalités principales :**
- Redimensionnement automatique
- Compression intelligente
- Formats multiples (JPEG, PNG, WebP)
- Métadonnées SEO`
    },
    {
      id: 7,
      title: "Optimisation KDP",
      description: "Préparation Amazon KDP, analyse concurrentielle",
      content: `# Module 7 : Optimisation KDP

## 7.1 Préparation pour Amazon KDP

**Fonctionnalités principales :**
- Génération de description KDP
- Recherche de mots-clés optimisés
- Sélection de catégories appropriées
- Conseils de prix dynamiques

**Actions à effectuer :**
1. Générer une description accrocheuse
2. Rechercher les meilleurs mots-clés
3. Sélectionner les catégories optimales
4. Définir le prix de vente

### Captures d'écran à inclure :
- Interface d'optimisation KDP
- Générateur de descriptions
- Outil de recherche de mots-clés
- Sélecteur de catégories

## 7.2 Analyse Concurrentielle

**Fonctionnalités principales :**
- Analyse des concurrents directs
- Étude des prix du marché
- Identification des niches rentables
- Recommandations stratégiques`
    },
    {
      id: 8,
      title: "Marketing et Promotion",
      description: "Réseaux sociaux, email marketing, landing pages",
      content: `# Module 8 : Marketing et Promotion

## 8.1 Contenu pour Réseaux Sociaux

**Fonctionnalités principales :**
- Posts Facebook automatiques
- Tweets promotionnels
- Stories Instagram
- Publications LinkedIn

**Actions à effectuer :**
1. Générer du contenu pour chaque réseau
2. Planifier les publications
3. Créer des visuels attractifs
4. Suivre les performances

### Captures d'écran à inclure :
- Interface de génération social media
- Exemples de posts générés
- Calendrier de publication
- Statistiques de performance

## 8.2 Email Marketing

**Fonctionnalités principales :**
- Campagnes email automatisées
- Templates d'emails professionnels
- Séquences de lancement
- Emails de suivi

## 8.3 Landing Pages

**Fonctionnalités principales :**
- Création de pages de vente
- Optimisation des conversions
- A/B testing intégré
- Analytics détaillés`
    },
    {
      id: 9,
      title: "Monétisation",
      description: "Stratégies de prix, diversification des revenus",
      content: `# Module 9 : Monétisation

## 9.1 Stratégies de Prix

**Fonctionnalités principales :**
- Calculateur de ROI
- Prix dynamiques
- Stratégies de bundle
- Programmes d'affiliation

**Actions à effectuer :**
1. Calculer le ROI optimal
2. Définir une stratégie de prix
3. Créer des bundles attractifs
4. Mettre en place l'affiliation

### Captures d'écran à inclure :
- Calculateur de ROI
- Interface de gestion des prix
- Création de bundles
- Tableau de bord affiliés

## 9.2 Diversification des Revenus

**Fonctionnalités principales :**
- Vente multi-plateformes
- Licences et droits d'auteur
- Formations complémentaires
- Services de consulting`
    },
    {
      id: 10,
      title: "Export Multi-Format",
      description: "Formats disponibles, optimisation par format",
      content: `# Module 10 : Export Multi-Format

## 10.1 Formats Disponibles

**Formats supportés :**
- **PDF** : Version imprimable haute qualité
- **EPUB** : Compatible liseuses électroniques
- **MOBI** : Format Kindle
- **DOCX** : Édition Microsoft Word
- **HTML** : Version web interactive

**Actions à effectuer :**
1. Choisir le format d'export
2. Configurer les options avancées
3. Générer l'ebook final
4. Télécharger et vérifier

### Captures d'écran à inclure :
- Interface de sélection de format
- Options d'export avancées
- Progression de génération
- Aperçu des fichiers générés

## 10.2 Optimisation par Format

**Fonctionnalités principales :**
- Mise en page automatique
- Métadonnées optimisées
- Table des matières interactive
- Index automatique`
    },
    {
      id: 11,
      title: "Stratégies Avancées",
      description: "Automatisation, scaling et growth hacking",
      content: `# Module 11 : Stratégies Avancées

## 11.1 Automatisation Complète

**Fonctionnalités principales :**
- Workflows automatisés
- Génération en masse
- Planification de contenu
- Monitoring des performances

## 11.2 Scaling et Growth Hacking

**Stratégies couvertes :**
- Multiplication des niches
- Partenariats stratégiques
- Optimisation continue
- Expansion internationale

### Captures d'écran à inclure :
- Dashboard de performance
- Outils d'automatisation
- Métriques de croissance
- Interface de scaling`
    }
  ];

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Contenu copié dans le presse-papiers !');
  };

  const copyAllModules = () => {
    const fullContent = `# Formation Complète : Générateur d'Ebook IA 📚

## Table des Matières

${modules.map((module, index) => `${index + 1}. [${module.title}](#module-${index + 1}-${module.title.toLowerCase().replace(/\s+/g, '-')})`).join('\n')}

---

${modules.map((module, index) => `## Module ${index + 1} : ${module.title}

${module.content}

---`).join('\n\n')}

## Conclusion et Certification

### Récapitulatif des Compétences Acquises

✅ Maîtrise complète du générateur d'ebook IA  
✅ Création d'ebooks professionnels en minutes  
✅ Optimisation pour Amazon KDP  
✅ Stratégies de marketing digital  
✅ Techniques de monétisation avancées  
✅ Export multi-format professionnel  
✅ Automatisation des processus  

### Prochaines Étapes

1. **Créer votre premier ebook** avec les templates fournis
2. **Publier sur Amazon KDP** en suivant les optimisations
3. **Développer votre marketing** avec les outils intégrés
4. **Scaler votre business** avec l'automatisation

© Formation Générateur d'Ebook IA - Tous droits réservés`;

    copyToClipboard(fullContent);
  };

  const exportFormationPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let yPos = 20;

    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, isTitle: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      for (const line of lines) {
        if (yPos > 275) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += fontSize * 0.45;
      }
      yPos += isTitle ? 6 : 3;
    };

    // Page de titre
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Formation Complete', pageWidth / 2, 60, { align: 'center' });
    pdf.setFontSize(18);
    pdf.text('Generateur d\'Ebook IA', pageWidth / 2, 75, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Guide complet de toutes les fonctionnalites', pageWidth / 2, 90, { align: 'center' });
    
    // Table des matières
    pdf.addPage();
    yPos = 20;
    addText('TABLE DES MATIERES', 16, true, true);
    yPos += 5;
    
    modules.forEach((module, index) => {
      addText(`Module ${index + 1}: ${module.title}`, 11);
      addText(`   ${module.description}`, 9);
      yPos += 2;
    });

    // Contenu des modules
    modules.forEach((module, index) => {
      pdf.addPage();
      yPos = 20;
      
      addText(`MODULE ${index + 1}`, 14, true, true);
      addText(module.title.toUpperCase(), 16, true, true);
      yPos += 5;
      
      // Parser le contenu markdown simplifié
      const lines = module.content.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('# ')) {
          addText(line.replace('# ', ''), 14, true, true);
        } else if (line.startsWith('## ')) {
          yPos += 3;
          addText(line.replace('## ', ''), 12, true, true);
        } else if (line.startsWith('### ')) {
          yPos += 2;
          addText(line.replace('### ', ''), 11, true);
        } else if (line.startsWith('**') && line.endsWith('**')) {
          addText(line.replace(/\*\*/g, ''), 10, true);
        } else if (line.startsWith('- ')) {
          addText('• ' + line.replace('- ', ''), 10);
        } else if (line.match(/^\d+\./)) {
          addText(line, 10);
        } else if (line.trim()) {
          addText(line.replace(/\*\*/g, ''), 10);
        }
      }
    });

    // Page finale - Récapitulatif
    pdf.addPage();
    yPos = 20;
    addText('RECAPITULATIF DES COMPETENCES', 16, true, true);
    yPos += 5;
    
    const competences = [
      'Maitrise complete du generateur d\'ebook IA',
      'Creation d\'ebooks professionnels en minutes',
      'Optimisation pour Amazon KDP',
      'Strategies de marketing digital',
      'Techniques de monetisation avancees',
      'Export multi-format professionnel',
      'Automatisation des processus'
    ];
    
    competences.forEach(comp => {
      addText('✓ ' + comp, 11);
    });
    
    yPos += 10;
    addText('PROCHAINES ETAPES', 14, true, true);
    yPos += 3;
    addText('1. Creer votre premier ebook avec les templates fournis', 10);
    addText('2. Publier sur Amazon KDP en suivant les optimisations', 10);
    addText('3. Developper votre marketing avec les outils integres', 10);
    addText('4. Scaler votre business avec l\'automatisation', 10);
    
    yPos += 15;
    pdf.setFontSize(9);
    pdf.text('Formation Generateur d\'Ebook IA - Tous droits reserves', pageWidth / 2, 280, { align: 'center' });

    pdf.save('Formation_Complete_Generateur_Ebook.pdf');
    toast.success('Formation exportée en PDF !');
    setShowPreview(false);
  };

  // Données de prévisualisation des pages
  const previewPages = [
    {
      title: "Page de Couverture",
      content: (
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 h-full flex flex-col items-center justify-center p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Formation Complète</h2>
          <h3 className="text-xl text-primary mb-2">Générateur d'Ebook IA</h3>
          <p className="text-muted-foreground text-sm">Guide complet de toutes les fonctionnalités</p>
        </div>
      )
    },
    {
      title: "Table des Matières",
      content: (
        <div className="p-6 h-full overflow-auto">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">TABLE DES MATIÈRES</h3>
          <ul className="space-y-2 text-sm">
            {modules.map((module, index) => (
              <li key={module.id} className="flex gap-2">
                <span className="font-semibold text-primary">Module {index + 1}:</span>
                <span>{module.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    ...modules.map((module, index) => ({
      title: `Module ${index + 1}: ${module.title}`,
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge variant="secondary" className="mb-2">Module {index + 1}</Badge>
          <h3 className="text-lg font-bold mb-2">{module.title.toUpperCase()}</h3>
          <p className="text-xs text-muted-foreground mb-4">{module.description}</p>
          <div className="text-xs space-y-1 overflow-hidden">
            {module.content.split('\n').slice(0, 15).map((line, i) => (
              <p key={i} className={`${line.startsWith('#') ? 'font-bold' : ''} ${line.startsWith('-') ? 'pl-2' : ''}`}>
                {line.replace(/[#*]/g, '').trim() || '\u00A0'}
              </p>
            ))}
            <p className="text-muted-foreground italic">...</p>
          </div>
        </div>
      )
    })),
    {
      title: "Récapitulatif",
      content: (
        <div className="p-6 h-full">
          <h3 className="text-lg font-bold mb-4">RÉCAPITULATIF DES COMPÉTENCES</h3>
          <ul className="space-y-2 text-sm mb-6">
            <li>✓ Maîtrise complète du générateur</li>
            <li>✓ Création d'ebooks professionnels</li>
            <li>✓ Optimisation pour Amazon KDP</li>
            <li>✓ Stratégies de marketing digital</li>
            <li>✓ Techniques de monétisation</li>
            <li>✓ Export multi-format</li>
            <li>✓ Automatisation des processus</li>
          </ul>
          <h4 className="font-semibold mb-2">Prochaines Étapes</h4>
          <ol className="text-xs space-y-1 list-decimal pl-4">
            <li>Créer votre premier ebook</li>
            <li>Publier sur Amazon KDP</li>
            <li>Développer votre marketing</li>
            <li>Scaler votre business</li>
          </ol>
        </div>
      )
    }
  ];

  const totalPages = previewPages.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Formation Complète
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Générateur d'Ebook IA - Toutes les fonctionnalités
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={copyAllModules} size="lg" className="gap-2">
              <Copy className="h-4 w-4" />
              Copier la Formation Complète
            </Button>
            <Button onClick={() => { setPreviewPage(0); setShowPreview(true); }} variant="outline" size="lg" className="gap-2">
              <Eye className="h-4 w-4" />
              Prévisualiser PDF
            </Button>
          </div>

          {/* Dialog de prévisualisation PDF */}
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Prévisualisation du PDF - {previewPages[previewPage]?.title}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Page {previewPage + 1} / {totalPages}
                  </span>
                </DialogTitle>
              </DialogHeader>
              
              {/* Aperçu de la page */}
              <div className="border rounded-lg bg-white text-foreground min-h-[400px] shadow-inner">
                {previewPages[previewPage]?.content}
              </div>

              {/* Navigation et actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPreviewPage(Math.max(0, previewPage - 1))}
                    disabled={previewPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPreviewPage(Math.min(totalPages - 1, previewPage + 1))}
                    disabled={previewPage === totalPages - 1}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Miniatures */}
                <div className="flex gap-1 overflow-x-auto max-w-xs">
                  {previewPages.slice(0, 6).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewPage(idx)}
                      className={`w-8 h-10 rounded border text-xs flex items-center justify-center transition-all ${
                        previewPage === idx 
                          ? 'border-primary bg-primary/10 text-primary font-bold' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  {previewPages.length > 6 && (
                    <span className="text-xs text-muted-foreground self-center">+{previewPages.length - 6}</span>
                  )}
                </div>

                <Button onClick={exportFormationPDF} className="gap-2">
                  <Download className="h-4 w-4" />
                  Télécharger PDF
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <Card 
              key={module.id} 
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50"
              onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    Module {module.id}
                  </Badge>
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform ${
                      selectedModule === module.id ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {selectedModule && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  Module {selectedModule} : {modules.find(m => m.id === selectedModule)?.title}
                </CardTitle>
                <Button 
                  onClick={() => copyToClipboard(modules.find(m => m.id === selectedModule)?.content || '')}
                  size="sm"
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copier ce module
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {modules.find(m => m.id === selectedModule)?.content}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Checklist de Lancement d'Ebook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Pré-production :</h4>
                <ul className="space-y-2 text-sm">
                  <li>☐ Idée validée et recherche effectuée</li>
                  <li>☐ Structure détaillée créée</li>
                  <li>☐ Template sélectionné et personnalisé</li>
                </ul>
                
                <h4 className="font-semibold mb-3 mt-6">Production :</h4>
                <ul className="space-y-2 text-sm">
                  <li>☐ Contenu généré et optimisé</li>
                  <li>☐ Couverture créée et finalisée</li>
                  <li>☐ Images intégrées et optimisées</li>
                  <li>☐ Relecture et corrections effectuées</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Optimisation KDP :</h4>
                <ul className="space-y-2 text-sm">
                  <li>☐ Description accrocheuse rédigée</li>
                  <li>☐ Mots-clés recherchés et sélectionnés</li>
                  <li>☐ Catégories optimales choisies</li>
                  <li>☐ Prix compétitif défini</li>
                </ul>
                
                <h4 className="font-semibold mb-3 mt-6">Marketing :</h4>
                <ul className="space-y-2 text-sm">
                  <li>☐ Contenu social media préparé</li>
                  <li>☐ Campagne email configurée</li>
                  <li>☐ Landing page créée</li>
                  <li>☐ Stratégie de lancement planifiée</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormationPage;