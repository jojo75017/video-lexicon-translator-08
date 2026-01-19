import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Trash2, Calendar, Eye, Search, Copy, Map, BookText, Palette, MessageSquare, Film, CalendarDays, Filter } from 'lucide-react';
import { useEbookDatabase, ProjectType, PROJECT_TYPE_LABELS } from '@/hooks/useEbookDatabase';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EbookVersionHistory } from "./EbookVersionHistory";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EbookProjectsListProps {
  onProjectLoad: (project: any) => void;
  onCreateNew: () => void;
  currentProject?: {
    title: string;
    hasContent: boolean;
  };
}

const TYPE_ICONS: Record<ProjectType | 'all', React.ReactNode> = {
  all: <Filter className="h-4 w-4" />,
  ebook: <BookOpen className="h-4 w-4" />,
  atlas: <Map className="h-4 w-4" />,
  encyclopedia: <BookText className="h-4 w-4" />,
  coloring: <Palette className="h-4 w-4" />,
  comic: <MessageSquare className="h-4 w-4" />,
  documentary: <Film className="h-4 w-4" />,
  diary: <CalendarDays className="h-4 w-4" />,
};

export function EbookProjectsList({ onProjectLoad, onCreateNew, currentProject }: EbookProjectsListProps) {
  const { 
    loadAllProjects, 
    deleteProject, 
    currentProjectId,
    duplicateProject,
    saveVersion,
    loadVersions,
    restoreVersion 
  } = useEbookDatabase();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "author">("date");
  const [filterType, setFilterType] = useState<ProjectType | 'all'>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const allProjects = await loadAllProjects();
    setProjects(allProjects);
    setLoading(false);
  };

  const handleDelete = async (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      const success = await deleteProject(projectToDelete);
      if (success) {
        await loadProjects();
      }
    }
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleLoad = (project: any) => {
    onProjectLoad(project);
    toast.success(`Projet "${project.title}" chargé`);
  };

  const handleDuplicate = async (projectId: string) => {
    const newProjectId = await duplicateProject(projectId);
    if (newProjectId) {
      await loadProjects();
    }
  };

  const handleSaveVersion = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      await saveVersion(projectId, project);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    const restoredProject = await restoreVersion(versionId);
    if (restoredProject) {
      onProjectLoad(restoredProject);
    }
  };

  const filteredProjects = projects
    .filter(project => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = (
        project.title?.toLowerCase().includes(searchLower) ||
        project.author_name?.toLowerCase().includes(searchLower)
      );
      const matchesType = filterType === 'all' || (project.project_type || 'ebook') === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "author":
          return (a.author_name || "").localeCompare(b.author_name || "");
        case "date":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

  // Compter les projets par type
  const typeCounts = projects.reduce((acc, p) => {
    const type = p.project_type || 'ebook';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        {currentProject?.hasContent && (
          <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
                ⚠️ Projet non sauvegardé
              </CardTitle>
              <CardDescription className="text-amber-700 dark:text-amber-300">
                Vous avez un projet en cours <strong>"{currentProject.title || 'Sans titre'}"</strong> qui n'est pas encore dans la base de données.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">📝 Comment sauvegarder ?</h4>
                <ol className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-decimal list-inside">
                  <li>Assurez-vous que votre projet a un <strong>titre</strong></li>
                  <li>Attendez 2 secondes (sauvegarde automatique)</li>
                  <li>Ou retournez à l'onglet <strong>Planificateur</strong></li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <CardTitle>Aucun projet sauvegardé</CardTitle>
            <CardDescription>
              Créez votre premier projet d'ebook en quelques clics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={onCreateNew} className="w-full" size="lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Créer mon premier projet
            </Button>
            <div className="bg-muted p-4 rounded-lg text-sm">
              <h4 className="font-semibold mb-2">💡 Bon à savoir :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>✅ Sauvegarde automatique toutes les 2 secondes</li>
                <li>✅ Tous vos projets sont sécurisés dans le cloud</li>
                <li>✅ Accédez à vos projets depuis n'importe quel appareil</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentProject?.hasContent && !currentProjectId && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 text-base flex items-center gap-2">
              💡 Projet en cours de création
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Vous travaillez sur <strong>"{currentProject.title || 'Sans titre'}"</strong>. 
              La sauvegarde automatique se déclenche toutes les 2 secondes dès que vous ajoutez un titre.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-navy-deep dark:text-white mb-2">
            Mes Projets
          </h2>
          <p className="text-muted-foreground">
            {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={onCreateNew} size="lg">
          <BookOpen className="mr-2 h-5 w-5" />
          Nouveau projet
        </Button>
      </div>

      {/* Filtres par catégorie */}
      <div className="mb-6">
        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as ProjectType | 'all')}>
          <TabsList className="flex-wrap h-auto gap-1 p-1 bg-muted/50">
            <TabsTrigger value="all" className="flex items-center gap-1.5 text-xs">
              {TYPE_ICONS.all}
              <span>Tous</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{projects.length}</Badge>
            </TabsTrigger>
            {(Object.keys(PROJECT_TYPE_LABELS) as ProjectType[]).map(type => (
              typeCounts[type] > 0 && (
                <TabsTrigger key={type} value={type} className="flex items-center gap-1.5 text-xs">
                  {TYPE_ICONS[type]}
                  <span className="hidden sm:inline">{PROJECT_TYPE_LABELS[type].split(' ')[1]}</span>
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{typeCounts[type]}</Badge>
                </TabsTrigger>
              )
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou auteur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Trier par..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date (récent)</SelectItem>
            <SelectItem value="title">Titre (A-Z)</SelectItem>
            <SelectItem value="author">Auteur (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProjects.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Aucun projet trouvé" : "Aucun projet sauvegardé"}
          </p>
          {!searchQuery && (
            <Button onClick={onCreateNew}>
              <BookOpen className="h-4 w-4 mr-2" />
              Créer votre premier projet
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
          const isActive = project.id === currentProjectId;
          const chapterCount = Array.isArray(project.chapters) ? project.chapters.length : 0;
          const createdDate = new Date(project.created_at).toLocaleDateString('fr-FR');
          const updatedDate = new Date(project.updated_at).toLocaleDateString('fr-FR');

          return (
            <Card 
              key={project.id} 
              className={`hover:shadow-lg transition-all ${isActive ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {TYPE_ICONS[project.project_type as ProjectType || 'ebook']}
                      <Badge variant="outline" className="text-xs shrink-0">
                        {PROJECT_TYPE_LABELS[project.project_type as ProjectType || 'ebook']?.split(' ')[1] || 'Ebook'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-playfair line-clamp-2">
                      {project.title}
                    </CardTitle>
                    {project.author_name && (
                      <CardDescription className="mt-1">
                        par {project.author_name}
                      </CardDescription>
                    )}
                  </div>
                  {isActive && (
                    <Badge variant="default" className="shrink-0">
                      Actif
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{chapterCount} éléments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{updatedDate}</span>
                  </div>
                </div>

                {project.target_audience && (
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{project.target_audience}</Badge>
                    {project.tone && (
                      <Badge variant="outline">{project.tone}</Badge>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleLoad(project)}
                      className="flex-1"
                      variant={isActive ? "secondary" : "default"}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {isActive ? 'Ouvert' : 'Ouvrir'}
                    </Button>
                    <Button
                      onClick={() => handleDuplicate(project.id)}
                      variant="outline"
                      size="icon"
                      title="Dupliquer"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(project.id)}
                      variant="destructive"
                      size="icon"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <EbookVersionHistory
                    projectId={project.id}
                    onRestore={handleRestoreVersion}
                    loadVersions={loadVersions}
                    onSaveVersion={() => handleSaveVersion(project.id)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce projet ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Le projet sera définitivement supprimé de la base de données.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
