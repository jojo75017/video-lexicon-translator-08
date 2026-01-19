import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProjectType } from './useEbookDatabase';

interface SaveProjectData {
  title: string;
  author_name?: string;
  project_type: ProjectType;
  chapters?: any[];
  characters?: any[];
  ebook_images?: any[];
  target_audience?: string;
  tone?: string;
  preface?: string;
  conclusion?: string;
  book_summary?: string;
  number_of_chapters?: number;
  [key: string]: any;
}

export const useProjectSave = () => {
  const saveSpecializedProject = async (data: SaveProjectData): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Vous devez être connecté pour sauvegarder');
        return null;
      }

      const projectData = {
        title: data.title || 'Sans titre',
        author_name: data.author_name || '',
        project_type: data.project_type,
        chapters: data.chapters || [],
        characters: data.characters || [],
        ebook_images: data.ebook_images || [],
        target_audience: data.target_audience || '',
        tone: data.tone || '',
        preface: data.preface || '',
        conclusion: data.conclusion || '',
        book_summary: data.book_summary || '',
        number_of_chapters: data.number_of_chapters || 0,
        writing_style: data.writing_style || '',
        chapter_length: data.chapter_length || '',
        detail_level: data.detail_level || '',
        narrative_format: data.narrative_format || '',
        tome_number: data.tome_number || null,
        user_id: user.id,
      };

      const { data: savedProject, error } = await supabase
        .from('ebook_projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        console.error('Erreur sauvegarde projet:', error);
        toast.error('Erreur lors de la sauvegarde');
        return null;
      }

      toast.success(`Projet "${data.title}" sauvegardé !`);
      return savedProject.id;
    } catch (error) {
      console.error('Exception sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
      return null;
    }
  };

  const updateSpecializedProject = async (projectId: string, data: Partial<SaveProjectData>): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Vous devez être connecté pour sauvegarder');
        return false;
      }

      const { error } = await supabase
        .from('ebook_projects')
        .update({
          ...data,
          user_id: user.id,
        })
        .eq('id', projectId);

      if (error) {
        console.error('Erreur mise à jour projet:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      toast.success('Projet mis à jour !');
      return true;
    } catch (error) {
      console.error('Exception mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  };

  return {
    saveSpecializedProject,
    updateSpecializedProject,
  };
};
