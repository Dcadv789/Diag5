import { supabase } from '../config/supabase';

export function useStorage() {
  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw error;
    }
  };

  const deleteFile = async (path: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from('public')
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw error;
    }
  };

  return {
    uploadFile,
    deleteFile
  };
}