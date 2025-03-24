import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Folder, ChevronRight, ChevronDown, Search, Plus, FileText, 
  ExternalLink, Type, Heading1, Heading2, Heading3, AlignLeft, 
  Image as ImageIcon, Eye, Code, Globe, Sparkles
} from 'lucide-react';
import { toast } from "sonner";
import SiteStructureVisualizer from '../SiteStructureVisualizer';
import "../../styles/explorer-scrollbar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interfaces pour les données
interface PageContent {
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'image';
  text: string;
  position: number;
}

interface Page {
  id: string;
  title: string;
  url: string;
  type: 'page' | 'post' | 'landing';
  status: 'published' | 'draft';
  lastModified: Date;
  content?: PageContent[];
}

interface PageFolder {
  id: string;
  name: string;
  pages: Page[];
  subfolders?: PageFolder[];
  isOpen?: boolean;
}

interface SiteNode {
  name: string;
  path: string;
  children: SiteNode[];
}

// Composant principal
const PageExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('liste');
  const [showSerpPreview, setShowSerpPreview] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'content' | 'html'>('content');
  const [showAddPageDialog, setShowAddPageDialog] = useState(false);
  const [newPage, setNewPage] = useState<{
    title: string;
    url: string;
    type: 'page' | 'post' | 'landing';
    folderId: string;
  }>({
    title: '',
    url: '',
    type: 'page',
    folderId: 'principal'
  });
  const [folders, setFolders] = useState<PageFolder[]>([
    {
      id: 'principal',
      name: 'Pages principales',
      isOpen: true,
      pages: [
        { 
          id: 'home', 
          title: 'Accueil', 
          url: '/', 
          type: 'page', 
          status: 'published', 
          lastModified: new Date('2023-10-15'),
          content: [
            { type: 'h1', text: 'Bienvenue sur notre site', position: 1 },
            { type: 'paragraph', text: 'Notre entreprise vous propose des solutions innovantes.', position: 2 },
            { type: 'h2', text: 'Nos services', position: 3 },
            { type: 'paragraph', text: 'Découvrez notre gamme complète de services adaptés à vos besoins.', position: 4 },
            { type: 'image', text: '/images/services.jpg', position: 5 },
            { type: 'h3', text: 'Service Premium', position: 6 },
            { type: 'paragraph', text: 'Notre offre haut de gamme pour les professionnels exigeants.', position: 7 }
          ]
        },
        { 
          id: 'about', 
          title: 'À propos', 
          url: '/a-propos', 
          type: 'page', 
          status: 'published', 
          lastModified: new Date('2023-09-20'),
          content: [
            { type: 'h1', text: 'À propos de notre entreprise', position: 1 },
            { type: 'paragraph', text: 'Fondée en 2010, notre entreprise a connu une croissance constante.', position: 2 },
            { type: 'h2', text: 'Notre mission', position: 3 },
            { type: 'paragraph', text: 'Nous visons l\'excellence dans tous nos projets.', position: 4 },
            { type: 'h2', text: 'Notre équipe', position: 5 },
            { type: 'paragraph', text: 'Composée d\'experts passionnés par leur métier.', position: 6 }
          ]
        },
        { 
          id: 'contact', 
          title: 'Contact', 
          url: '/contact', 
          type: 'page', 
          status: 'published', 
          lastModified: new Date('2023-11-05'),
          content: [
            { type: 'h1', text: 'Contactez-nous', position: 1 },
            { type: 'paragraph', text: 'Nous sommes à votre écoute pour toute demande.', position: 2 },
            { type: 'h2', text: 'Formulaire de contact', position: 3 },
            { type: 'paragraph', text: 'Remplissez le formulaire ci-dessous pour nous envoyer un message.', position: 4 }
          ]
        }
      ],
      subfolders: [
        {
          id: 'services',
          name: 'Services',
          isOpen: false,
          pages: [
            { 
              id: 'seo', 
              title: 'SEO', 
              url: '/services/seo', 
              type: 'page', 
              status: 'published', 
              lastModified: new Date('2023-10-25'),
              content: [
                { type: 'h1', text: 'Services SEO', position: 1 },
                { type: 'paragraph', text: 'Optimisez votre présence en ligne avec nos solutions SEO.', position: 2 },
                { type: 'h2', text: 'Audit SEO', position: 3 },
                { type: 'paragraph', text: 'Analyse complète de votre site web et de son positionnement.', position: 4 },
                { type: 'h2', text: 'Optimisation technique', position: 5 },
                { type: 'paragraph', text: 'Amélioration des aspects techniques de votre site pour les moteurs de recherche.', position: 6 },
                { type: 'h3', text: 'Structure du site', position: 7 },
                { type: 'paragraph', text: 'Organisation optimale de votre contenu pour le référencement.', position: 8 }
              ]
            },
            { 
              id: 'sem', 
              title: 'SEM', 
              url: '/services/sem', 
              type: 'page', 
              status: 'draft', 
              lastModified: new Date('2023-11-02'),
              content: [
                { type: 'h1', text: 'Marketing sur les moteurs de recherche', position: 1 },
                { type: 'paragraph', text: 'Campagnes publicitaires ciblées sur les moteurs de recherche.', position: 2 },
                { type: 'h2', text: 'Google Ads', position: 3 },
                { type: 'paragraph', text: 'Gestion professionnelle de vos campagnes Google Ads.', position: 4 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'blog',
      name: 'Articles de blog',
      isOpen: false,
      pages: [
        { 
          id: 'seo-guide', 
          title: 'Guide SEO complet', 
          url: '/blog/guide-seo-complet', 
          type: 'post', 
          status: 'published', 
          lastModified: new Date('2023-11-10'),
          content: [
            { type: 'h1', text: 'Guide SEO complet pour débutants', position: 1 },
            { type: 'paragraph', text: 'Tout ce que vous devez savoir pour débuter en SEO.', position: 2 },
            { type: 'h2', text: 'Comprendre les bases du SEO', position: 3 },
            { type: 'paragraph', text: 'Les fondamentaux du référencement naturel expliqués simplement.', position: 4 },
            { type: 'h3', text: 'L\'importance des mots-clés', position: 5 },
            { type: 'paragraph', text: 'Comment rechercher et utiliser les bons mots-clés.', position: 6 }
          ]
        },
        { 
          id: 'analytics', 
          title: 'Comprendre Google Analytics', 
          url: '/blog/comprendre-google-analytics', 
          type: 'post', 
          status: 'published', 
          lastModified: new Date('2023-10-28'),
          content: [
            { type: 'h1', text: 'Maîtriser Google Analytics', position: 1 },
            { type: 'paragraph', text: 'Guide pour tirer le meilleur parti de cet outil d\'analyse.', position: 2 },
            { type: 'h2', text: 'Installation et configuration', position: 3 },
            { type: 'paragraph', text: 'Comment mettre en place Google Analytics sur votre site.', position: 4 }
          ]
        },
        { 
          id: 'backlinks', 
          title: 'Stratégie de backlinks', 
          url: '/blog/strategie-backlinks', 
          type: 'post', 
          status: 'draft', 
          lastModified: new Date('2023-11-15'),
          content: [
            { type: 'h1', text: 'Développer une stratégie de backlinks efficace', position: 1 },
            { type: 'paragraph', text: 'Les meilleures pratiques pour obtenir des backlinks de qualité.', position: 2 },
            { type: 'h2', text: 'L\'importance des backlinks', position: 3 },
            { type: 'paragraph', text: 'Pourquoi les backlinks sont essentiels pour le SEO.', position: 4 }
          ]
        }
      ]
    },
    {
      id: 'landing',
      name: 'Pages d\'atterrissage',
      isOpen: false,
      pages: [
        { 
          id: 'promo-summer', 
          title: 'Promotion été', 
          url: '/landing/promo-ete', 
          type: 'landing', 
          status: 'published', 
          lastModified: new Date('2023-06-15'),
          content: [
            { type: 'h1', text: 'Offres spéciales été', position: 1 },
            { type: 'paragraph', text: 'Profitez de nos promotions exceptionnelles tout l\'été.', position: 2 },
            { type: 'h2', text: 'Remises exclusives', position: 3 },
            { type: 'paragraph', text: 'Jusqu\'à 30% de réduction sur une sélection de services.', position: 4 }
          ]
        },
        { 
          id: 'webinar', 
          title: 'Webinaire SEO', 
          url: '/landing/webinaire-seo', 
          type: 'landing', 
          status: 'draft', 
          lastModified: new Date('2023-12-01'),
          content: [
            { type: 'h1', text: 'Webinaire: Les secrets du SEO en 2024', position: 1 },
            { type: 'paragraph', text: 'Inscrivez-vous à notre webinaire gratuit et découvrez les dernières stratégies SEO.', position: 2 },
            { type: 'h2', text: 'Au programme', position: 3 },
            { type: 'paragraph', text: 'Les nouvelles tendances, les meilleures pratiques et des conseils d\'experts.', position: 4 }
          ]
        }
      ]
    }
  ]);

  // Structure de site pour la visualisation
  const siteStructure = {
    name: "Mon Site Web",
    children: [
      {
        name: "Accueil",
        path: "/",
        children: [
          {
            name: "À propos",
            path: "/a-propos",
            children: []
          },
          {
            name: "Contact",
            path: "/contact",
            children: []
          },
          {
            name: "Services",
            path: "/services",
            children: [
              {
                name: "SEO",
                path: "/services/seo",
                children: []
              },
              {
                name: "SEM",
                path: "/services/sem",
                children: []
              }
            ]
          },
          {
            name: "Blog",
            path: "/blog",
            children: [
              {
                name: "Guide SEO complet",
                path: "/blog/guide-seo-complet",
                children: []
              },
              {
                name: "Comprendre Google Analytics",
                path: "/blog/comprendre-google-analytics",
                children: []
              },
              {
                name: "Stratégie de backlinks",
                path: "/blog/strategie-backlinks",
                children: []
              }
            ]
          },
          {
            name: "Pages d'atterrissage",
            path: "/landing",
            children: [
              {
                name: "Promotion été",
                path: "/landing/promo-ete",
                children: []
              },
              {
                name: "Webinaire SEO",
                path: "/landing/webinaire-seo",
                children: []
              }
            ]
          }
        ]
      }
    ]
  };

  // Ouvrir/fermer un dossier
  const toggleFolder = (folderId: string) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => {
        if (folder.id === folderId) {
          return { ...folder, isOpen: !folder.isOpen };
        } else if (folder.subfolders) {
          const updatedSubfolders = folder.subfolders.map(subfolder => 
            subfolder.id === folderId ? { ...subfolder, isOpen: !subfolder.isOpen } : subfolder
          );
          return { ...folder, subfolders: updatedSubfolders };
        }
        return folder;
      })
    );
  };

  // Ouvrir une page et afficher son contenu SERP
  const handleOpenPage = (page: Page) => {
    toast.info(`Ouverture de la page : ${page.title}`, {
      description: `URL: ${page.url}`
    });
    
    // Afficher/masquer le contenu SERP de la page
    setShowSerpPreview(showSerpPreview === page.id ? null : page.id);
  };

  // Ajouter une nouvelle page
  const handleAddPage = () => {
    setShowAddPageDialog(true);
  };

  // Gérer la soumission du formulaire d'ajout de page
  const handleAddPageSubmit = () => {
    if (!newPage.title || !newPage.url) {
      toast.error("Le titre et l'URL sont requis");
      return;
    }

    // Générer un ID unique pour la nouvelle page
    const pageId = `page-${Date.now()}`;
    
    // Créer un objet pour la nouvelle page
    const pageToAdd: Page = {
      id: pageId,
      title: newPage.title,
      url: newPage.url.startsWith('/') ? newPage.url : `/${newPage.url}`,
      type: newPage.type,
      status: 'draft',
      lastModified: new Date(),
      content: [
        { type: 'h1', text: newPage.title, position: 1 },
        { type: 'paragraph', text: 'Contenu de la page à remplir.', position: 2 }
      ]
    };

    // Ajouter la page au dossier sélectionné
    setFolders(prevFolders => {
      return prevFolders.map(folder => {
        if (folder.id === newPage.folderId) {
          return {
            ...folder,
            pages: [...folder.pages, pageToAdd],
            isOpen: true // Ouvrir le dossier automatiquement
          };
        } else if (folder.subfolders) {
          // Vérifier dans les sous-dossiers
          const updatedSubfolders = folder.subfolders.map(subfolder => {
            if (subfolder.id === newPage.folderId) {
              return {
                ...subfolder,
                pages: [...subfolder.pages, pageToAdd],
                isOpen: true
              };
            }
            return subfolder;
          });
          return { ...folder, subfolders: updatedSubfolders };
        }
        return folder;
      });
    });

    // Réinitialiser le formulaire et fermer la boîte de dialogue
    setNewPage({
      title: '',
      url: '',
      type: 'page',
      folderId: 'principal'
    });
    setShowAddPageDialog(false);

    // Notifier l'utilisateur
    toast.success("Page ajoutée avec succès", {
      description: `La page "${newPage.title}" a été ajoutée au dossier sélectionné.`
    });
  };

  // Générer le badge de statut
  const getStatusBadge = (status: string) => {
    return status === 'published' 
      ? <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Publié</Badge>
      : <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Brouillon</Badge>;
  };

  // Formater la date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Obtenir l'icône pour le type de contenu
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'h1': return <Heading1 className="h-4 w-4 text-red-600" />;
      case 'h2': return <Heading2 className="h-4 w-4 text-orange-600" />;
      case 'h3': return <Heading3 className="h-4 w-4 text-yellow-600" />;
      case 'paragraph': return <AlignLeft className="h-4 w-4 text-gray-600" />;
      case 'image': return <ImageIcon className="h-4 w-4 text-blue-600" />;
      default: return <Type className="h-4 w-4 text-gray-600" />;
    }
  };

  // Générer un aperçu HTML de la page
  const generatePageHtml = (page: Page): string => {
    if (!page.content) return '<p>Pas de contenu disponible</p>';
    
    let html = '';
    page.content.forEach(item => {
      switch (item.type) {
        case 'h1':
          html += `<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #111;">${item.text}</h1>`;
          break;
        case 'h2':
          html += `<h2 style="font-size: 20px; font-weight: bold; margin-bottom: 12px; color: #333;">${item.text}</h2>`;
          break;
        case 'h3':
          html += `<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #444;">${item.text}</h3>`;
          break;
        case 'paragraph':
          html += `<p style="margin-bottom: 16px; line-height: 1.5; color: #666;">${item.text}</p>`;
          break;
        case 'image':
          html += `<div style="margin-bottom: 16px;"><img src="${item.text}" alt="Image" style="max-width: 100%; border-radius: 4px;" /></div>`;
          break;
      }
    });
    
    return html;
  };

  // Obtenir tous les dossiers (plats) pour le sélecteur de dossier
  const getAllFolders = () => {
    const result: {id: string, name: string}[] = [];
    
    folders.forEach(folder => {
      result.push({ id: folder.id, name: folder.name });
      
      if (folder.subfolders) {
        folder.subfolders.forEach(subfolder => {
          result.push({ id: subfolder.id, name: `${folder.name} > ${subfolder.name}` });
        });
      }
    });
    
    return result;
  };

  // Rendu d'un dossier avec ses pages
  const renderFolder = (folder: PageFolder) => {
    return (
      <div key={folder.id} className="mb-2">
        <div 
          className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
          onClick={() => toggleFolder(folder.id)}
        >
          {folder.isOpen ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
          <Folder className="h-4 w-4 mr-2 text-blue-500" />
          <span className="font-medium">{folder.name}</span>
          <span className="ml-2 text-xs text-gray-500">({folder.pages.length})</span>
        </div>
        
        {folder.isOpen && (
          <div className="ml-6 space-y-1 mt-1">
            {folder.pages.map(page => (
              <div key={page.id}>
                <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                  <div 
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => handleOpenPage(page)}
                  >
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="truncate">{page.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(page.status)}
                    <Button 
                      variant="purple"
                      size="sm"
                      className="h-7 px-2 flex items-center gap-1"
                      onClick={() => handleOpenPage(page)}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span className="text-xs">Voir SERP</span>
                    </Button>
                  </div>
                </div>
                
                {/* Contenu SERP de la page */}
                {showSerpPreview === page.id && page.content && (
                  <div className="ml-4 mt-1 mb-3 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium text-gray-700 flex items-center">
                        <Globe className="h-4 w-4 mr-1 text-blue-500" />
                        Aperçu SERP - {page.url}
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant={previewMode === 'content' ? "pastel" : "outline"}
                          size="sm"
                          className="text-xs py-1 px-2 h-7"
                          onClick={() => setPreviewMode('content')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Contenu
                        </Button>
                        <Button 
                          variant={previewMode === 'html' ? "pastel" : "outline"}
                          size="sm"
                          className="text-xs py-1 px-2 h-7"
                          onClick={() => setPreviewMode('html')}
                        >
                          <Code className="h-3 w-3 mr-1" />
                          HTML
                        </Button>
                      </div>
                    </div>
                    
                    {previewMode === 'content' ? (
                      <div className="space-y-2 border border-gray-100 rounded-md p-2 bg-white">
                        {page.content.map((item, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 hover:bg-gray-100 rounded">
                            {getContentTypeIcon(item.type)}
                            <div className="flex-1">
                              <div className="flex items-center">
                                <Badge variant="outline" className="mr-2 text-[10px]">{item.type.toUpperCase()}</Badge>
                                <span className="text-xs text-gray-400">Position: {item.position}</span>
                              </div>
                              <div className={`${
                                item.type === 'h1' ? 'text-base font-bold text-red-700' : 
                                item.type === 'h2' ? 'text-sm font-semibold text-orange-700' : 
                                item.type === 'h3' ? 'text-sm font-medium text-yellow-700' :
                                item.type === 'image' ? 'text-xs italic text-blue-600' : 
                                'text-xs text-gray-700'
                              }`}>
                                {item.text}
                                {item.type === 'image' && (
                                  <div className="mt-1 border border-gray-200 rounded p-1 bg-gray-50">
                                    <img 
                                      src={item.text} 
                                      alt="Aperçu" 
                                      className="max-h-20 object-cover rounded"
                                      onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.svg'}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <div className="bg-gray-800 text-gray-200 p-2 rounded-t-md text-xs font-mono">
                          HTML - {page.title}
                        </div>
                        <pre className="bg-gray-900 text-gray-200 p-3 rounded-b-md text-xs font-mono overflow-x-auto whitespace-pre-wrap explorer-scrollbar max-h-48">
                          {generatePageHtml(page)}
                        </pre>
                      </div>
                    )}
                    
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Dernière modification: {formatDate(page.lastModified)}</span>
                        <Badge variant="outline" className="text-xs">
                          {page.type === 'page' ? 'Page' : page.type === 'post' ? 'Article' : 'Landing'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {folder.subfolders && folder.subfolders.map(subfolder => renderFolder(subfolder))}
          </div>
        )}
      </div>
    );
  };

  // Filtrer les dossiers et les pages selon la recherche
  const filteredFolders = folders.map(folder => {
    // Filtrer les pages dans le dossier courant
    const filteredPages = folder.pages.filter(page => 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      page.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Filtrer les sous-dossiers si présents
    const filteredSubfolders = folder.subfolders 
      ? folder.subfolders.map(subfolder => {
          const filteredSubfolderPages = subfolder.pages.filter(page => 
            page.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            page.url.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return { ...subfolder, pages: filteredSubfolderPages };
        }).filter(subfolder => subfolder.pages.length > 0)
      : [];
    
    return { 
      ...folder, 
      pages: filteredPages,
      subfolders: filteredSubfolders
    };
  }).filter(folder => folder.pages.length > 0 || (folder.subfolders && folder.subfolders.length > 0));

  return (
    <Card className="border shadow-lg bg-white">
      <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-blue-50">
        <h2 className="text-xl font-bold">Explorateur de pages</h2>
        <p className="text-gray-500 text-sm">Gérez toutes vos pages web et visualisez leur contenu</p>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher des pages..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleAddPage}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="liste">Liste des pages</TabsTrigger>
            <TabsTrigger value="structure">Structure du site</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="liste" className="p-0">
          <div className="p-4 max-h-[400px] overflow-y-auto explorer-scrollbar">
            {filteredFolders.length > 0 ? (
              filteredFolders.map(folder => renderFolder(folder))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Aucune page ne correspond à votre recherche</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="structure" className="p-0">
          <div className="p-4 max-h-[400px] overflow-auto explorer-scrollbar">
            <SiteStructureVisualizer structure={siteStructure} />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-t flex justify-between items-center text-xs text-gray-500">
        <div>Total: {folders.reduce((acc, folder) => acc + folder.pages.length + (folder.subfolders?.reduce((acc2, sf) => acc2 + sf.pages.length, 0) || 0), 0)} pages</div>
        <div>Dernière mise à jour: {formatDate(new Date())}</div>
      </div>

      {/* Dialogue d'ajout de page */}
      <Dialog open={showAddPageDialog} onOpenChange={setShowAddPageDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle page</DialogTitle>
            <DialogDescription>
              Créez une nouvelle page pour votre site web.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titre
              </Label>
              <Input
                id="title"
                value={newPage.title}
                onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                className="col-span-3"
                placeholder="Titre de la page"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={newPage.url}
                onChange={(e) => setNewPage({...newPage, url: e.target.value})}
                className="col-span-3"
                placeholder="/mon-url"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={newPage.type}
                onValueChange={(value: 'page' | 'post' | 'landing') => setNewPage({...newPage, type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Type de page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="page">Page</SelectItem>
                  <SelectItem value="post">Article</SelectItem>
                  <SelectItem value="landing">Landing page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folder" className="text-right">
                Dossier
              </Label>
              <Select
                value={newPage.folderId}
                onValueChange={(value) => setNewPage({...newPage, folderId: value})}
              >
                <
