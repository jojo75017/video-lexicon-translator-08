import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trash2, Calendar, Eye } from 'lucide-react';
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

interface EbookProjectsListProps {
  onProjectLoad: (project: any) => void;
  onCreateNew: () => void;
  currentProject?: {
    title: string;
    hasContent: boolean;
  };
}

export function EbookProjectsList({ onProjectLoad, onCreateNew, currentProject }: EbookProjectsListProps) {
  const { loadAllProjects, deleteProject, currentProjectId } = useEbookDatabase();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

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
      <div className="mb-6">
        <h2 className="text-2xl font-playfair font-bold text-navy-deep mb-2">
          Mes Projets d'Ebook
        </h2>
        <p className="text-gray-cool">
          {projects.length} projet{projects.length > 1 ? 's' : ''} sauvegardé{projects.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
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
                    onClick={() => handleDelete(project.id)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
