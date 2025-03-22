
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Folder, ChevronRight, ChevronDown, Search, Plus, FileText, ExternalLink } from 'lucide-react';
import { toast } from "sonner";
import SiteStructureVisualizer from '../SiteStructureVisualizer';

interface Page {
  id: string;
  title: string;
  url: string;
  type: 'page' | 'post' | 'landing';
  status: 'published' | 'draft';
  lastModified: Date;
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

const PageExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('liste');
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
          lastModified: new Date('2023-10-15') 
        },
        { 
          id: 'about', 
          title: 'À propos', 
          url: '/a-propos', 
          type: 'page', 
          status: 'published', 
          lastModified: new Date('2023-09-20') 
        },
        { 
          id: 'contact', 
          title: 'Contact', 
          url: '/contact', 
          type: 'page', 
          status: 'published', 
          lastModified: new Date('2023-11-05') 
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
              lastModified: new Date('2023-10-25') 
            },
            { 
              id: 'sem', 
              title: 'SEM', 
              url: '/services/sem', 
              type: 'page', 
              status: 'draft', 
              lastModified: new Date('2023-11-02') 
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
          lastModified: new Date('2023-11-10') 
        },
        { 
          id: 'analytics', 
          title: 'Comprendre Google Analytics', 
          url: '/blog/comprendre-google-analytics', 
          type: 'post', 
          status: 'published', 
          lastModified: new Date('2023-10-28') 
        },
        { 
          id: 'backlinks', 
          title: 'Stratégie de backlinks', 
          url: '/blog/strategie-backlinks', 
          type: 'post', 
          status: 'draft', 
          lastModified: new Date('2023-11-15') 
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
          lastModified: new Date('2023-06-15') 
        },
        { 
          id: 'webinar', 
          title: 'Webinaire SEO', 
          url: '/landing/webinaire-seo', 
          type: 'landing', 
          status: 'draft', 
          lastModified: new Date('2023-12-01') 
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

  const handleOpenPage = (page: Page) => {
    toast.info(`Ouverture de la page : ${page.title}`, {
      description: `URL: ${page.url}`
    });
  };

  const handleAddPage = () => {
    toast.info("Créer une nouvelle page", {
      description: "Fonctionnalité à implémenter"
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'published' 
      ? <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Publié</Badge>
      : <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Brouillon</Badge>;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

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
              <div 
                key={page.id}
                className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => handleOpenPage(page)}
              >
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span className="flex-1 truncate">{page.title}</span>
                <div className="flex items-center gap-2">
                  {getStatusBadge(page.status)}
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
            
            {folder.subfolders && folder.subfolders.map(subfolder => renderFolder(subfolder))}
          </div>
        )}
      </div>
    );
  };

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
    <Card className="border shadow-sm bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Explorateur de pages</h2>
        <p className="text-gray-500 text-sm">Gérez toutes vos pages web</p>
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
            className="bg-blue-600 hover:bg-blue-700"
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
      
      <div className="p-3 bg-gray-50 border-t flex justify-between items-center text-xs text-gray-500">
        <div>Total: {folders.reduce((acc, folder) => acc + folder.pages.length + (folder.subfolders?.reduce((acc2, sf) => acc2 + sf.pages.length, 0) || 0), 0)} pages</div>
        <div>Dernière mise à jour: {formatDate(new Date())}</div>
      </div>
    </Card>
  );
};

export default PageExplorer;
