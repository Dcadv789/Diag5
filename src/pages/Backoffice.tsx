import React, { useState } from 'react';
import { Plus, PlusCircle, Pencil, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { usePillars } from '../hooks/usePillars';
import LogoUpload from '../components/LogoUpload';
import type { Question, Pillar } from '../types/diagnostic';

function Backoffice() {
  const { pillars, loading, error, addPillar, updatePillar, deletePillar, addQuestion, updateQuestion, deleteQuestion } = usePillars();
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [editingPillarId, setEditingPillarId] = useState<string | null>(null);
  const [editingPillarName, setEditingPillarName] = useState('');
  const [deletingPillar, setDeletingPillar] = useState<Pillar | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<{pillar: Pillar; question: Question} | null>(null);

  const handleAddPillar = async () => {
    try {
      await addPillar({
        name: `Pilar ${pillars.length + 1}`,
        questions: []
      });
    } catch (error) {
      console.error('Erro ao adicionar pilar:', error);
    }
  };

  const handleDeletePillar = (pillar: Pillar) => {
    setDeletingPillar(pillar);
  };

  const confirmDeletePillar = async () => {
    if (!deletingPillar?.firebaseId) return;
    try {
      await deletePillar(deletingPillar.firebaseId);
      setDeletingPillar(null);
    } catch (error) {
      console.error('Erro ao excluir pilar:', error);
    }
  };

  const handleDeleteQuestion = (pillar: Pillar, question: Question) => {
    setDeletingQuestion({ pillar, question });
  };

  const confirmDeleteQuestion = async () => {
    if (!deletingQuestion?.pillar.firebaseId) return;
    try {
      await deleteQuestion(deletingQuestion.pillar.firebaseId, deletingQuestion.question.id);
      setDeletingQuestion(null);
    } catch (error) {
      console.error('Erro ao excluir pergunta:', error);
    }
  };

  const startEditingPillar = (pillar: Pillar) => {
    setEditingPillarId(pillar.firebaseId || null);
    setEditingPillarName(pillar.name);
  };

  const savePillarName = async () => {
    if (!editingPillarId) return;
    try {
      await updatePillar(editingPillarId, { name: editingPillarName });
      setEditingPillarId(null);
      setEditingPillarName('');
    } catch (error) {
      console.error('Erro ao atualizar nome do pilar:', error);
    }
  };

  const handleAddQuestion = (pillar: Pillar) => {
    const questionNumber = pillar.questions.length + 1;
    const newQuestion: Question = {
      id: `${pillar.id}.${questionNumber}`,
      text: `Pergunta ${pillar.id}.${questionNumber}`,
      points: 1,
      positiveAnswer: 'SIM',
      answerType: 'BINARY'
    };
    setIsNewQuestion(true);
    setEditingQuestion(newQuestion);
  };

  const handleEditQuestion = (question: Question) => {
    setIsNewQuestion(false);
    setEditingQuestion(question);
  };

  const saveQuestion = async () => {
    if (!editingQuestion) return;
    
    const pillarId = editingQuestion.id.split('.')[0];
    const pillar = pillars.find(p => p.id.toString() === pillarId);
    
    if (!pillar?.firebaseId) return;

    try {
      if (isNewQuestion) {
        await addQuestion(pillar.firebaseId, editingQuestion);
      } else {
        await updateQuestion(pillar.firebaseId, editingQuestion.id, editingQuestion);
      }
      setEditingQuestion(null);
      setIsNewQuestion(false);
    } catch (error) {
      console.error('Erro ao salvar pergunta:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-red-400 p-4 rounded-lg">
        {error}
      </div>
    );
  }

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
            onClick={handleAddPillar}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Adicionar Pilar
          </button>
        </div>

        {/* Modal de confirmação para excluir pilar */}
        {deletingPillar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center gap-3 text-yellow-500 mb-4">
                <AlertTriangle size={24} />
                <h3 className="text-xl font-medium text-white">Confirmar Exclusão</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja excluir o pilar "{deletingPillar.name}"? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingPillar(null)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeletePillar}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmação para excluir pergunta */}
        {deletingQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center gap-3 text-yellow-500 mb-4">
                <AlertTriangle size={24} />
                <h3 className="text-xl font-medium text-white">Confirmar Exclusão</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja excluir a pergunta "{deletingQuestion.question.text}"? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingQuestion(null)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteQuestion}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edição de pergunta */}
        {editingQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
            <div key={pillar.firebaseId} className="bg-zinc-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                {editingPillarId === pillar.firebaseId ? (
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddQuestion(pillar)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <PlusCircle size={20} />
                    Adicionar Pergunta
                  </button>
                  <button
                    onClick={() => handleDeletePillar(pillar)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Trash2 size={20} />
                    Excluir Pilar
                  </button>
                </div>
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
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditQuestion(question)}
                                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(pillar, question)}
                                className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
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

      <LogoUpload />
    </div>
  );
}

export default Backoffice;