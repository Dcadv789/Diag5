import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, ChevronDown, ChevronUp, Trash2, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import { useDiagnosticCalculation } from '../hooks/useDiagnosticCalculation';
import ExportPDF from '../components/ExportPDF';
import type { DiagnosticResult, PillarScore } from '../types/diagnostic';

function DiagnosticCard({ result, onDelete }: { result: DiagnosticResult; onDelete: (id: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maturityLevel = getMaturityLevel(Math.round(result.totalScore));
  const { best, worst } = getBestAndWorstPillars(result.pillarScores);
  const recommendation = getRecommendation(Math.round(result.totalScore));

  return (
    <div className="bg-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-grow">
          <p className="text-white">{result.companyData.nome}</p>
          <span className="text-gray-400">•</span>
          <p className="text-white">{result.companyData.empresa}</p>
          <span className="text-gray-400">•</span>
          <p className="text-gray-400">CNPJ: {result.companyData.cnpj}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Pontuação</p>
            <p className="text-xl font-bold text-white">{Math.round(result.totalScore)} pontos</p>
          </div>
          <ExportPDF result={result} />
          <button
            onClick={() => onDelete(result.id)}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-red-500 hover:text-red-400"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="text-gray-400" />
            ) : (
              <ChevronDown className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Resto do conteúdo do card permanece igual */}
        </div>
      )}
    </div>
  );
}

function getBestAndWorstPillars(pillarScores: PillarScore[]): { best: PillarScore; worst: PillarScore } {
  const sortedPillars = [...pillarScores].sort((a, b) => b.score - a.score);
  return {
    best: sortedPillars[0],
    worst: sortedPillars[sortedPillars.length - 1]
  };
}

function getMaturityLevel(score: number): {
  level: string;
  description: string;
} {
  if (score <= 40) {
    return {
      level: 'Inicial',
      description: 'O negócio está começando ou ainda não possui processos bem definidos. Planejamento e estruturação são prioridades.'
    };
  } else if (score <= 70) {
    return {
      level: 'Em Desenvolvimento',
      description: 'O negócio já possui alguns processos organizados, mas ainda enfrenta desafios para alcançar estabilidade e crescimento consistente.'
    };
  } else {
    return {
      level: 'Consolidado',
      description: 'O negócio tem processos bem estabelecidos, boa gestão e está em um estágio de expansão ou consolidação no mercado.'
    };
  }
}

function getRecommendation(score: number): string {
  if (score <= 40) {
    return "Priorize a criação de um planejamento estratégico básico, organize as finanças e defina processos essenciais para o funcionamento do negócio. Considere buscar orientação de um consultor para acelerar essa estruturação.";
  } else if (score <= 70) {
    return "Foco em otimizar os processos existentes, investir em capacitação da equipe e melhorar a gestão financeira. Avalie ferramentas que possam automatizar operações e aumentar a eficiência.";
  } else {
    return "Concentre-se na inovação, expansão de mercado e diversificação de produtos/serviços. Invista em estratégias de marketing e mantenha um controle financeiro rigoroso para sustentar o crescimento.";
  }
}

function Resultados() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchResults } = useDiagnosticCalculation();
  const [isLatestExpanded, setIsLatestExpanded] = useState(false);
  const latestResult = results[0];

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await fetchResults();
        setResults(data);
      } catch (error) {
        console.error('Erro ao carregar resultados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [fetchResults]);

  const handleDelete = async (id: string) => {
    try {
      // Implementar a deleção no Supabase
      setResults(results.filter(result => result.id !== id));
    } catch (error) {
      console.error('Erro ao deletar resultado:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!latestResult) {
    return (
      <div>
        <div className="bg-zinc-900 rounded-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-white mb-3">Resultados</h1>
          <p className="text-gray-400">Visualize e analise os resultados detalhados do seu diagnóstico de maturidade digital.</p>
        </div>

        <div className="bg-zinc-900 rounded-lg p-8">
          <div className="text-center py-12">
            <TrendingUp size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              Nenhum diagnóstico realizado ainda. Complete um diagnóstico para ver seus resultados aqui.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const { best, worst } = getBestAndWorstPillars(latestResult.pillarScores);
  const maturityLevel = getMaturityLevel(Math.round(latestResult.totalScore));
  const recommendation = getRecommendation(Math.round(latestResult.totalScore));

  return (
    <div>
      <div className="bg-zinc-900 rounded-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-white mb-3">Resultados</h1>
        <p className="text-gray-400">Visualize e analise os resultados detalhados do seu diagnóstico de maturidade digital.</p>
      </div>

      <div className="space-y-6">
        {/* Resto do conteúdo permanece igual */}
      </div>
    </div>
  );
}

export default Resultados;