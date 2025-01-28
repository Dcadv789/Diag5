export interface CompanyData {
  nome: string;
  empresa: string;
  cnpj: string;
  temSocios: string;
  numeroFuncionarios: number;
  faturamento: number;
  segmento: string;
  tempoAtividade: string;
  localizacao: string;
  formaJuridica: string;
}

export interface DiagnosticResult {
  id: string;
  firebaseId?: string;
  date: string;
  companyData: CompanyData;
  answers: Record<string, string>;
  pillarScores: PillarScore[];
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
}

export interface PillarScore {
  pillarId: number;
  pillarName: string;
  score: number;
  maxPossibleScore: number;
  percentageScore: number;
}

export interface Question {
  id: string;
  text: string;
  points: number;
  positiveAnswer: 'SIM' | 'NÃO';
  answerType: 'BINARY' | 'TERNARY';
}

export interface Pillar {
  id: number;
  firebaseId?: string;
  name: string;
  questions: Question[];
}