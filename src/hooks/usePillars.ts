import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { Pillar, Question } from '../types/diagnostic';

export function usePillars() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPillars = async () => {
      try {
        const { data: pillarsData, error: pillarsError } = await supabase
          .from('pillars')
          .select(`
            id,
            name,
            order_number,
            questions (
              id,
              text,
              points,
              positive_answer,
              answer_type,
              order_number
            )
          `)
          .order('order_number', { ascending: true });

        if (pillarsError) throw pillarsError;

        const formattedPillars = pillarsData.map(pillar => ({
          id: pillar.order_number,
          firebaseId: pillar.id,
          name: pillar.name,
          questions: pillar.questions.map((q: any) => ({
            id: `${pillar.order_number}.${q.order_number}`,
            text: q.text,
            points: q.points,
            positiveAnswer: q.positive_answer,
            answerType: q.answer_type
          }))
        }));

        setPillars(formattedPillars);
      } catch (err) {
        console.error('Erro ao carregar pilares:', err);
        setError('Erro ao carregar pilares');
      } finally {
        setLoading(false);
      }
    };

    fetchPillars();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('pillars_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pillars' },
        fetchPillars
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        fetchPillars
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addPillar = async (pillar: Omit<Pillar, 'id'>) => {
    try {
      const { data: lastPillar } = await supabase
        .from('pillars')
        .select('order_number')
        .order('order_number', { ascending: false })
        .limit(1)
        .single();

      const newOrderNumber = (lastPillar?.order_number || 0) + 1;

      const { error } = await supabase
        .from('pillars')
        .insert({
          name: pillar.name,
          order_number: newOrderNumber
        });

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao adicionar pilar:', err);
      throw new Error('Erro ao adicionar pilar');
    }
  };

  const updatePillar = async (pillarId: string, data: Partial<Pillar>) => {
    try {
      const { error } = await supabase
        .from('pillars')
        .update({
          name: data.name
        })
        .eq('id', pillarId);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao atualizar pilar:', err);
      throw new Error('Erro ao atualizar pilar');
    }
  };

  const deletePillar = async (pillarId: string) => {
    try {
      const { error } = await supabase
        .from('pillars')
        .delete()
        .eq('id', pillarId);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao excluir pilar:', err);
      throw new Error('Erro ao excluir pilar');
    }
  };

  const addQuestion = async (pillarId: string, question: Question) => {
    try {
      const { data: lastQuestion } = await supabase
        .from('questions')
        .select('order_number')
        .eq('pillar_id', pillarId)
        .order('order_number', { ascending: false })
        .limit(1)
        .single();

      const newOrderNumber = (lastQuestion?.order_number || 0) + 1;

      const { error } = await supabase
        .from('questions')
        .insert({
          pillar_id: pillarId,
          text: question.text,
          points: question.points,
          positive_answer: question.positiveAnswer,
          answer_type: question.answerType,
          order_number: newOrderNumber
        });

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao adicionar pergunta:', err);
      throw new Error('Erro ao adicionar pergunta');
    }
  };

  const updateQuestion = async (pillarId: string, questionId: string, questionData: Partial<Question>) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({
          text: questionData.text,
          points: questionData.points,
          positive_answer: questionData.positiveAnswer,
          answer_type: questionData.answerType
        })
        .eq('pillar_id', pillarId)
        .eq('id', questionId);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao atualizar pergunta:', err);
      throw new Error('Erro ao atualizar pergunta');
    }
  };

  const deleteQuestion = async (pillarId: string, questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('pillar_id', pillarId)
        .eq('id', questionId);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao excluir pergunta:', err);
      throw new Error('Erro ao excluir pergunta');
    }
  };

  return {
    pillars,
    loading,
    error,
    addPillar,
    updatePillar,
    deletePillar,
    addQuestion,
    updateQuestion,
    deleteQuestion
  };
}