import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { DiagnosticResult } from '../types/diagnostic';

export function useResults() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data: resultsData, error: resultsError } = await supabase
          .from('diagnostic_results')
          .select(`
            *,
            diagnostic_answers (
              question_id,
              answer
            )
          `)
          .order('created_at', { ascending: false });

        if (resultsError) throw resultsError;

        const formattedResults = resultsData.map(result => ({
          id: result.id,
          firebaseId: result.id,
          date: result.created_at,
          companyData: {
            nome: result.contact_name,
            empresa: result.company_name,
            cnpj: result.company_cnpj,
            temSocios: result.has_partners ? 'sim' : 'nao',
            numeroFuncionarios: result.employee_count,
            faturamento: result.revenue,
            segmento: result.segment,
            tempoAtividade: result.time_in_business,
            localizacao: result.location,
            formaJuridica: result.legal_form
          },
          answers: result.diagnostic_answers.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.question_id] = curr.answer;
            return acc;
          }, {}),
          pillarScores: [], // This needs to be calculated based on the answers
          totalScore: result.total_score,
          maxPossibleScore: result.max_possible_score,
          percentageScore: result.percentage_score
        }));

        setResults(formattedResults);
      } catch (err) {
        console.error('Erro ao carregar resultados:', err);
        setError('Erro ao carregar resultados');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('results_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'diagnostic_results' },
        fetchResults
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const saveResult = async (result: Omit<DiagnosticResult, 'id'>) => {
    try {
      const { data: diagnosticResult, error: diagnosticError } = await supabase
        .from('diagnostic_results')
        .insert({
          company_name: result.companyData.empresa,
          company_cnpj: result.companyData.cnpj,
          contact_name: result.companyData.nome,
          has_partners: result.companyData.temSocios === 'sim',
          employee_count: result.companyData.numeroFuncionarios,
          revenue: result.companyData.faturamento,
          segment: result.companyData.segmento,
          time_in_business: result.companyData.tempoAtividade,
          location: result.companyData.localizacao,
          legal_form: result.companyData.formaJuridica,
          total_score: result.totalScore,
          max_possible_score: result.maxPossibleScore,
          percentage_score: result.percentageScore
        })
        .select()
        .single();

      if (diagnosticError) throw diagnosticError;

      const answersToInsert = Object.entries(result.answers).map(([questionId, answer]) => ({
        diagnostic_id: diagnosticResult.id,
        question_id: questionId,
        answer
      }));

      const { error: answersError } = await supabase
        .from('diagnostic_answers')
        .insert(answersToInsert);

      if (answersError) throw answersError;

      return diagnosticResult.id;
    } catch (err) {
      console.error('Erro ao salvar resultado:', err);
      throw new Error('Erro ao salvar resultado');
    }
  };

  const deleteResult = async (resultId: string) => {
    try {
      const { error } = await supabase
        .from('diagnostic_results')
        .delete()
        .eq('id', resultId);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao excluir resultado:', err);
      throw new Error('Erro ao excluir resultado');
    }
  };

  return {
    results,
    loading,
    error,
    saveResult,
    deleteResult
  };
}