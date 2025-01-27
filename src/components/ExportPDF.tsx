import React from 'react';
import { FileDown, TrendingUp, BarChart3, Award, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { DiagnosticResult } from '../types/diagnostic';

interface ExportPDFProps {
  result: DiagnosticResult;
}

function ExportPDF({ result }: ExportPDFProps) {
  const handleExport = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, 450]
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const content = document.createElement('div');
    content.style.width = `${pageWidth * 3.779527559}px`;
    content.style.height = `${pageHeight * 3.779527559}px`;
    content.innerHTML = `
      <div style="background-color: #0030b9; padding: 0; font-family: Arial, sans-serif; height: 100%; position: relative; display: flex; flex-direction: column;">
        <div style="padding: 24px 40px 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="flex-grow: 1; max-width: 70%;"></div>
            <div style="text-align: right;"></div>
          </div>
        </div>

        <div style="flex: 1; padding: 0 40px 40px; display: flex; flex-direction: column;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center;">
              <h3 style="font-size: 20px; font-weight: bold; color: white; margin: 0 0 12px 0;">Informações da Empresa</h3>
              <div style="display: grid; gap: 12px; font-size: 15px;">
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Empresa:</strong> ${result.companyData.empresa}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">CNPJ:</strong> ${result.companyData.cnpj}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Responsável:</strong> ${result.companyData.nome}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Funcionários:</strong> ${result.companyData.numeroFuncionarios}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Faturamento:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.companyData.faturamento)}</p>
              </div>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center;">
              <h3 style="font-size: 20px; font-weight: bold; color: white; margin: 0 0 12px 0;">Dados do Negócio</h3>
              <div style="display: grid; gap: 12px; font-size: 15px;">
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Segmento:</strong> ${result.companyData.segmento}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Localização:</strong> ${result.companyData.localizacao}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Tempo de Atividade:</strong> ${result.companyData.tempoAtividade}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Forma Jurídica:</strong> ${result.companyData.formaJuridica}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Tem Sócios:</strong> ${result.companyData.temSocios === 'sim' ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
            <h3 style="font-size: 22px; font-weight: bold; color: white; margin: 0;">Pontuação Geral</h3>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center; margin-bottom: 24px;">
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <p style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 4px 0;">${Math.round(result.totalScore)}</p>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0;">Pontuação Total</p>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <p style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 4px 0;">${Math.round(result.maxPossibleScore)}</p>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0;">Pontuação Máxima</p>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <p style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 4px 0;">${Math.round(result.percentageScore)}%</p>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0;">Percentual Atingido</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                  <path d="M7 10l5 5 5-5"/>
                  <path d="M2 20h20"/>
                </svg>
                <h4 style="font-size: 20px; font-weight: bold; color: white; margin: 0;">Melhor Desempenho</h4>
              </div>
              <p style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 8px 0;">${result.pillarScores[0].pillarName}</p>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0;">${Math.round(result.pillarScores[0].score)} pontos</p>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                  <path d="M7 14l5-5 5 5"/>
                  <path d="M2 20h20"/>
                </svg>
                <h4 style="font-size: 20px; font-weight: bold; color: white; margin: 0;">Precisa de Atenção</h4>
              </div>
              <p style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 8px 0;">${result.pillarScores[result.pillarScores.length - 1].pillarName}</p>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0;">${Math.round(result.pillarScores[result.pillarScores.length - 1].score)} pontos</p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h3 style="font-size: 22px; font-weight: bold; color: white; margin: 0;">Pontuação por Pilar</h3>
          </div>

          <div style="display: grid; gap: 12px; margin-bottom: 24px;">
            ${result.pillarScores.map(pillar => `
              <div style="background-color: rgba(255, 255, 255, 0.1); padding: 16px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <h4 style="font-size: 15px; font-weight: bold; color: white; margin: 0;">${pillar.pillarName}</h4>
                  <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; margin: 0;">${Math.round(pillar.score)} / ${pillar.maxPossibleScore} pontos</p>
                </div>
                <div style="width: 100%; height: 8px; background-color: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden;">
                  <div style="width: ${pillar.percentageScore}%; height: 100%; background-color: #F47400;"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <path d="M8.21 13.89 7 23l9-9-8.48-2.58"/>
              <path d="m14.92 14.92 2.14 6.99 4.04-4.04"/>
              <path d="m14.92 14.92-8.48-2.58"/>
              <path d="M7 23v-3"/>
              <path d="M3.59 12.51h4.83"/>
              <path d="M17.06 21.92v-3"/>
              <path d="M20.41 18.99h-3.35"/>
            </svg>
            <h3 style="font-size: 22px; font-weight: bold; color: white; margin: 0;">Maturidade do Negócio</h3>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; ${result.totalScore <= 40 ? 'border: 2px solid #F47400;' : ''}">
              <h4 style="font-size: 15px; font-weight: bold; color: white; margin: 0 0 8px 0;">Inicial</h4>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0;">O negócio está começando ou ainda não possui processos bem definidos.</p>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; ${result.totalScore > 40 && result.totalScore <= 70 ? 'border: 2px solid #F47400;' : ''}">
              <h4 style="font-size: 15px; font-weight: bold; color: white; margin: 0 0 8px 0;">Em Desenvolvimento</h4>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0;">O negócio já possui alguns processos organizados, mas ainda enfrenta desafios.</p>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; ${result.totalScore > 70 ? 'border: 2px solid #F47400;' : ''}">
              <h4 style="font-size: 15px; font-weight: bold; color: white; margin: 0 0 8px 0;">Consolidado</h4>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0;">O negócio tem processos bem estabelecidos e está em fase de expansão.</p>
            </div>
          </div>

          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                <line x1="9" y1="18" x2="15" y2="18"/>
                <line x1="10" y1="22" x2="14" y2="22"/>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
              </svg>
              <h3 style="font-size: 22px; font-weight: bold; color: white; margin: 0;">Recomendações</h3>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px;">
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 15px; line-height: 1.6; margin: 0;">
                ${result.totalScore <= 40
                  ? "Priorize a criação de um planejamento estratégico básico, organize as finanças e defina processos essenciais para o funcionamento do negócio. Considere buscar orientação de um consultor para acelerar essa estruturação."
                  : result.totalScore <= 70
                    ? "Foco em otimizar os processos existentes, investir em capacitação da equipe e melhorar a gestão financeira. Avalie ferramentas que possam automatizar operações e aumentar a eficiência."
                    : "Concentre-se na inovação, expansão de mercado e diversificação de produtos/serviços. Invista em estratégias de marketing e mantenha um controle financeiro rigoroso para sustentar o crescimento."
                }
              </p>
            </div>
          </div>
        </div>

        <div style="padding: 16px 40px; border-top: 2px solid rgba(255, 255, 255, 0.1); margin-top: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0;">© ${new Date().getFullYear()} DC ADVISORS. Todos os direitos reservados.</p>
            <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0;">Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(content);

    try {
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save(`diagnostico-${result.companyData.empresa.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      document.body.removeChild(content);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
    >
      <FileDown size={20} />
      Exportar PDF
    </button>
  );
}

export default ExportPDF;