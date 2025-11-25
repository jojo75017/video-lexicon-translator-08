import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EbookProject {
  id?: string;
  title: string;
  author_name: string;
  target_audience: string;
  tome_number: number | null;
  writing_style: string;
  chapter_length: string;
  detail_level: string;
  tone: string;
  narrative_format: string;
  preface: string;
  conclusion: string;
  chapters: any[];
  characters: any[];
  ebook_images: any[];
  number_of_chapters: number;
  book_summary?: string;
  cover_concepts?: string;
  seo_optimization?: string;
  kdp_description?: string;
  kdp_keywords?: string;
  kdp_categories?: string;
}

export const useEbookDatabase = () => {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Charger le projet le plus récent au démarrage
  const loadLatestProject = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Aucun utilisateur connecté pour charger les projets');
        return null;
      }

      const { data, error } = await supabase
        .from('ebook_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors du chargement:', error);
        throw error;
      }

      if (data) {
        setCurrentProjectId(data.id);
        toast.success('Projet chargé depuis la base de données');
        console.log('Projet chargé:', data.title);
        return data;
      }

      console.log('Aucun projet trouvé dans la base de données');
      return null;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement du projet');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder ou mettre à jour le projet
  const saveProject = async (projectData: EbookProject) => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Impossible de sauvegarder: utilisateur non connecté');
        return null;
      }

      console.log('Sauvegarde du projet:', projectData.title, 'ID actuel:', currentProjectId);

      if (currentProjectId) {
        // Mise à jour du projet existant
        const { data, error } = await supabase
          .from('ebook_projects')
          .update({
            ...projectData,
            user_id: user.id,
          })
          .eq('id', currentProjectId)
          .select()
          .single();

        if (error) {
          console.error('Erreur mise à jour:', error);
          throw error;
        }
        
        console.log('Projet mis à jour avec succès');
        return data;
      } else {
        // Création d'un nouveau projet
        const { data, error } = await supabase
          .from('ebook_projects')
          .insert({
            ...projectData,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          console.error('Erreur création:', error);
          throw error;
        }
        
        setCurrentProjectId(data.id);
        toast.success('Projet sauvegardé dans la base de données');
        console.log('Nouveau projet créé avec succès:', data.id);
        return data;
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde du projet');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Charger tous les projets de l'utilisateur
  const loadAllProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      const { data, error } = await supabase
        .from('ebook_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      return [];
    }
  };

  // Supprimer un projet
  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('ebook_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      toast.success('Projet supprimé');
      
      if (projectId === currentProjectId) {
        setCurrentProjectId(null);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du projet');
      return false;
    }
  };

  const duplicateProject = async (projectId: string): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        toast.error("Vous devez être connecté pour dupliquer un projet");
        return null;
      }

      const { data: originalProject, error: loadError } = await supabase
        .from('ebook_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (loadError || !originalProject) {
        console.error('Error loading project to duplicate:', loadError);
        toast.error("Erreur lors du chargement du projet");
        return null;
      }

      const duplicatedProject = {
        ...originalProject,
        id: undefined,
        title: `${originalProject.title} (Copie)`,
        created_at: undefined,
        updated_at: undefined,
        user_id: user.id,
      };

      const { data: newProject, error: createError } = await supabase
        .from('ebook_projects')
        .insert(duplicatedProject)
        .select()
        .single();

      if (createError) {
        console.error('Error duplicating project:', createError);
        toast.error("Erreur lors de la duplication du projet");
        return null;
      }

      toast.success("Projet dupliqué avec succès");
      return newProject.id;
    } catch (error) {
      console.error('Error in duplicateProject:', error);
      toast.error("Erreur lors de la duplication du projet");
      return null;
    }
  };

  const saveVersion = async (projectId: string, project: any): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: versions } = await supabase
        .from('ebook_project_versions')
        .select('version_number')
        .eq('project_id', projectId)
        .order('version_number', { ascending: false })
        .limit(1);

      const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1;

      const { error } = await supabase
        .from('ebook_project_versions')
        .insert({
          project_id: projectId,
          user_id: user.id,
          version_number: nextVersion,
          title: project.title,
          author_name: project.author_name,
          target_audience: project.target_audience,
          cover_concepts: project.cover_concepts,
          writing_style: project.writing_style,
          chapter_length: project.chapter_length,
          tone: project.tone,
          narrative_format: project.narrative_format,
          detail_level: project.detail_level,
          number_of_chapters: project.number_of_chapters,
          tome_number: project.tome_number,
          preface: project.preface,
          conclusion: project.conclusion,
          seo_optimization: project.seo_optimization,
          book_summary: project.book_summary,
          kdp_description: project.kdp_description,
          kdp_keywords: project.kdp_keywords,
          kdp_categories: project.kdp_categories,
          chapters: project.chapters,
          characters: project.characters,
          ebook_images: project.ebook_images,
        });

      if (error) {
        console.error('Error saving version:', error);
        return false;
      }

      toast.success(`Version ${nextVersion} sauvegardée`);
      return true;
    } catch (error) {
      console.error('Error in saveVersion:', error);
      return false;
    }
  };

  const loadVersions = async (projectId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('ebook_project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('version_number', { ascending: false });

      if (error) {
        console.error('Error loading versions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in loadVersions:', error);
      return [];
    }
  };

  const restoreVersion = async (versionId: string): Promise<any | null> => {
    try {
      const { data: version, error } = await supabase
        .from('ebook_project_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (error || !version) {
        console.error('Error loading version:', error);
        toast.error("Erreur lors du chargement de la version");
        return null;
      }

      toast.success(`Version ${version.version_number} restaurée`);
      return version;
    } catch (error) {
      console.error('Error in restoreVersion:', error);
      toast.error("Erreur lors de la restauration de la version");
      return null;
    }
  };

  return {
    currentProjectId,
    isSaving,
    isLoading,
    loadLatestProject,
    saveProject,
    loadAllProjects,
    deleteProject,
    setCurrentProjectId,
    duplicateProject,
    saveVersion,
    loadVersions,
    restoreVersion,
  };
};
