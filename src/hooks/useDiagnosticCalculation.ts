import { useCallback } from 'react';
import { DiagnosticResult, CompanyData, Pillar, PillarScore } from '../types/diagnostic';
import useLocalStorage from './useLocalStorage';

export function useDiagnosticCalculation() {
  const [results, setResults] = useLocalStorage<DiagnosticResult[]>('diagnostic_results', []);

  const calculateScore = useCallback((answers: Record<string, string>, pillars: Pillar[]): {
    pillarScores: PillarScore[];
    totalScore: number;
    maxPossibleScore: number;
    percentageScore: number;
  } => {
    let totalScore = 0;
    let maxPossibleScore = 0;

    const pillarScores = pillars.map(pillar => {
      let pillarScore = 0;
      let pillarMaxScore = 0;

      pillar.questions.forEach(question => {
        const answer = answers[question.id];
        pillarMaxScore += question.points;

        if (answer === question.positiveAnswer) {
          pillarScore += question.points;
        } else if (answer === 'PARCIALMENTE') {
          pillarScore += question.points / 2;
        }
      });

      totalScore += pillarScore;
      maxPossibleScore += pillarMaxScore;

      return {
        pillarId: pillar.id,
        pillarName: pillar.name,
        score: pillarScore,
        maxPossibleScore: pillarMaxScore,
        percentageScore: (pillarScore / pillarMaxScore) * 100
      };
    });

    return {
      pillarScores,
      totalScore,
      maxPossibleScore,
      percentageScore: (totalScore / maxPossibleScore) * 100
    };
  }, []);

  const saveDiagnosticResult = useCallback((
    companyData: CompanyData,
    answers: Record<string, string>,
    pillars: Pillar[]
  ) => {
    const { pillarScores, totalScore, maxPossibleScore, percentageScore } = calculateScore(answers, pillars);

    const result: DiagnosticResult = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      companyData,
      answers,
      pillarScores,
      totalScore,
      maxPossibleScore,
      percentageScore
    };

    setResults(prev => [...prev, result]);
    return result;
  }, [calculateScore, setResults]);

  return {
    results,
    calculateScore,
    saveDiagnosticResult
  };
}