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

  return {
    currentProjectId,
    isSaving,
    isLoading,
    loadLatestProject,
    saveProject,
    loadAllProjects,
    deleteProject,
    setCurrentProjectId,
  };
};
