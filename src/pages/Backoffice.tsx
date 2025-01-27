import React, { useState } from 'react';
import { Plus, PlusCircle, Pencil } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

interface Question {
  id: string;
  text: string;
  points: number;
  positiveAnswer: 'SIM' | 'NÃO';
  answerType: 'BINARY' | 'TERNARY';
}

interface Pillar {
  id: number;
  name: string;
  questions: Question[];
}

function Backoffice() {
  const [pillars, setPillars] = useLocalStorage<Pillar[]>('pillars', []);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [editingPillarId, setEditingPillarId] = useState<number | null>(null);
  const [editingPillarName, setEditingPillarName] = useState('');

  const addPillar = () => {
    const newPillar: Pillar = {
      id: pillars.length + 1,
      name: `Pilar ${pillars.length + 1}`,
      questions: []
    };
    setPillars([...pillars, newPillar]);
  };

  const startEditingPillar = (pillar: Pillar) => {
    setEditingPillarId(pillar.id);
    setEditingPillarName(pillar.name);
  };

  const savePillarName = () => {
    if (editingPillarId === null) return;
    setPillars(pillars.map(pillar => 
      pillar.id === editingPillarId 
        ? { ...pillar, name: editingPillarName }
        : pillar
    ));
    setEditingPillarId(null);
    setEditingPillarName('');
  };

  const addQuestion = (pillarId: number) => {
    const questionNumber = pillars.find(p => p.id === pillarId)?.questions.length ?? 0;
    const newQuestion: Question = {
      id: `${pillarId}.${questionNumber + 1}`,
      text: `Pergunta ${pillarId}.${questionNumber + 1}`,
      points: 1,
      positiveAnswer: 'SIM',
      answerType: 'BINARY'
    };
    setIsNewQuestion(true);
    setEditingQuestion(newQuestion);
  };

  const editQuestion = (question: Question) => {
    setIsNewQuestion(false);
    setEditingQuestion(question);
  };

  const saveQuestion = () => {
    if (!editingQuestion) return;

    setPillars(pillars.map(pillar => {
      if (pillar.id === parseInt(editingQuestion.id.split('.')[0])) {
        if (isNewQuestion) {
          return {
            ...pillar,
            questions: [...pillar.questions, editingQuestion]
          };
        } else {
          return {
            ...pillar,
            questions: pillar.questions.map(q => 
              q.id === editingQuestion.id ? editingQuestion : q
            )
          };
        }
      }
      return pillar;
    }));

    setEditingQuestion(null);
    setIsNewQuestion(false);
  };

  return (
    <div>
      <div className="bg-zinc-900 rounded-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-white mb-3">Backoffice</h1>
        <p className="text-gray-400">Gerencie diagnósticos, usuários e configurações do sistema em um só lugar.</p>
      </div>

      <div className="bg-zinc-900 rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Pilares do Diagnóstico</h2>
          <button
            onClick={addPillar}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Adicionar Pilar
          </button>
        </div>

        {editingQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-medium text-white mb-4">
                {isNewQuestion ? 'Configurar Nova Pergunta' : 'Editar Pergunta'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Texto da Pergunta
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.text}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      text: e.target.value
                    })}
                    className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Pontuação da Pergunta
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingQuestion.points}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      points: parseInt(e.target.value) || 1
                    })}
                    className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Resposta Positiva
                  </label>
                  <select
                    value={editingQuestion.positiveAnswer}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      positiveAnswer: e.target.value as 'SIM' | 'NÃO'
                    })}
                    className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2"
                  >
                    <option value="SIM">SIM</option>
                    <option value="NÃO">NÃO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tipo de Resposta
                  </label>
                  <select
                    value={editingQuestion.answerType}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      answerType: e.target.value as 'BINARY' | 'TERNARY'
                    })}
                    className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2"
                  >
                    <option value="BINARY">Sim/Não</option>
                    <option value="TERNARY">Sim/Não/Parcialmente</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setEditingQuestion(null);
                      setIsNewQuestion(false);
                    }}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {pillars.map(pillar => (
            <div key={pillar.id} className="bg-zinc-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                {editingPillarId === pillar.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingPillarName}
                      onChange={(e) => setEditingPillarName(e.target.value)}
                      className="bg-zinc-700 text-white rounded-lg px-3 py-2 border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Nome do pilar"
                      autoFocus
                    />
                    <button
                      onClick={savePillarName}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-medium text-white">
                      {pillar.id}. {pillar.name}
                    </h3>
                    <button
                      onClick={() => startEditingPillar(pillar)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => addQuestion(pillar.id)}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <PlusCircle size={20} />
                  Adicionar Pergunta
                </button>
              </div>

              {pillar.questions.length > 0 ? (
                <div className="space-y-3">
                  {pillar.questions.map(question => (
                    <div
                      key={question.id}
                      className="bg-zinc-700 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-gray-300 font-medium w-[60px] flex-shrink-0">
                          {question.id}
                        </span>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-white">
                              {question.text}
                            </span>
                            <button
                              onClick={() => editQuestion(question)}
                              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-3 text-sm text-gray-400">
                            <p>Pontos: {question.points}</p>
                            <p>Resposta positiva: {question.positiveAnswer}</p>
                            <p>Tipo: {question.answerType === 'BINARY' ? 'Sim/Não' : 'Sim/Não/Parcialmente'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  Nenhuma pergunta adicionada neste pilar
                </p>
              )}
            </div>
          ))}

          {pillars.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">
                Nenhum pilar adicionado. Clique no botão acima para começar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Backoffice;