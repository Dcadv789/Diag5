import React, { useState } from 'react';
import { Plus, PlusCircle } from 'lucide-react';

interface Question {
  id: string;
  text: string;
}

interface Pillar {
  id: number;
  name: string;
  questions: Question[];
}

function Backoffice() {
  const [pillars, setPillars] = useState<Pillar[]>([]);

  const addPillar = () => {
    const newPillar: Pillar = {
      id: pillars.length + 1,
      name: `Pilar ${pillars.length + 1}`,
      questions: []
    };
    setPillars([...pillars, newPillar]);
  };

  const addQuestion = (pillarId: number) => {
    setPillars(pillars.map(pillar => {
      if (pillar.id === pillarId) {
        const questionNumber = pillar.questions.length + 1;
        const newQuestion: Question = {
          id: `${pillar.id}.${questionNumber}`,
          text: `Pergunta ${pillar.id}.${questionNumber}`
        };
        return {
          ...pillar,
          questions: [...pillar.questions, newQuestion]
        };
      }
      return pillar;
    }));
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

        <div className="space-y-6">
          {pillars.map(pillar => (
            <div key={pillar.id} className="bg-zinc-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-white">
                  {pillar.id}. {pillar.name}
                </h3>
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
                      className="bg-zinc-700 rounded-lg p-4 flex items-center"
                    >
                      <span className="text-gray-300 font-medium min-w-[60px]">
                        {question.id}
                      </span>
                      <span className="text-white">
                        {question.text}
                      </span>
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