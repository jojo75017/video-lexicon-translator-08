import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Trash2, Calendar, Eye, Search, Copy } from 'lucide-react';
import { useEbookDatabase } from '@/hooks/useEbookDatabase';
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

interface EbookProjectsListProps {
  onProjectLoad: (project: any) => void;
  onCreateNew: () => void;
  currentProject?: {
    title: string;
    hasContent: boolean;
  };
}

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
      return (
        project.title?.toLowerCase().includes(searchLower) ||
        project.author_name?.toLowerCase().includes(searchLower)
      );
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
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">⚠️ Projet non sauvegardé</CardTitle>
              <CardDescription className="text-amber-700">
                Vous avez un projet en cours "{currentProject.title || 'Sans titre'}" qui n'est pas encore dans la base de données.
                <br />
                <strong>Pour le sauvegarder :</strong> Assurez-vous d'avoir un titre et attendez 2 secondes, ou retournez à l'onglet Planificateur.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Aucun projet sauvegardé</CardTitle>
            <CardDescription>
              Créez votre premier projet dans l'onglet Planificateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onCreateNew} className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              Nouveau projet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-navy-deep mb-2">
            Mes Projets d'Ebook
          </h2>
          <p className="text-gray-cool">
            {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={onCreateNew}>
          <BookOpen className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
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
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-playfair line-clamp-1">
                      {project.title}
                    </CardTitle>
                    {project.author_name && (
                      <CardDescription className="mt-1">
                        par {project.author_name}
                      </CardDescription>
                    )}
                  </div>
                  {isActive && (
                    <Badge variant="default" className="ml-2">
                      Actif
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-cool">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{chapterCount} chapitres</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{updatedDate}</span>
                  </div>
                </div>

                {project.target_audience && (
                  <div className="flex gap-2">
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
