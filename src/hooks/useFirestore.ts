import { supabase } from '../config/supabase';

export function useFirestore(tableName: string) {
  const getAll = async () => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      throw error;
    }
  };

  const getById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar registro:', error);
      throw error;
    }
  };

  const add = async (data: any) => {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result.id;
    } catch (error) {
      console.error('Erro ao adicionar registro:', error);
      throw error;
    }
  };

  const update = async (id: string, data: any) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      throw error;
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao remover registro:', error);
      throw error;
    }
  };

  const query = async (queryFn: (query: any) => any) => {
    try {
      const baseQuery = supabase.from(tableName).select('*');
      const { data, error } = await queryFn(baseQuery);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao consultar registros:', error);
      throw error;
    }
  };

  return {
    getAll,
    getById,
    add,
    update,
    remove,
    query
  };
}