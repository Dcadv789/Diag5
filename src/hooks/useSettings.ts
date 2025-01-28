import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

interface Settings {
  logo_url?: string;
  navbar_logo_url?: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();

        if (error) throw error;
        setSettings(data || {});
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
        setError('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'settings' },
        (payload) => {
          setSettings(payload.new as Settings);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 1, ...newSettings });

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
      throw new Error('Erro ao atualizar configurações');
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings
  };
}