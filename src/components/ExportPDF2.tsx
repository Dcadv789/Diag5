import React from 'react';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { DiagnosticResult } from '../types/diagnostic';

interface ExportPDF2Props {
  result: DiagnosticResult;
}

function ExportPDF2({ result }: ExportPDF2Props) {
  const handleExport = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const content = document.createElement('div');
    content.style.width = '800px';
    content.innerHTML = `
      <div style="background-color: #0030b9; padding: 0; font-family: Arial, sans-serif; height: 100%; position: relative;">
        <div style="padding: 24px 40px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="flex-grow: 1; max-width: 70%;">
              <h1 style="font-size: 28px; color: white; margin: 0 0 8px 0;">Diagnóstico Financeiro Empresarial</h1>
              <div style="display: flex; gap: 8px; align-items: center;">
                <p style="margin: 0; font-size: 14px; color: rgba(255, 255, 255, 0.8);">
                  Data: ${new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="width: 120px; height: 60px; background-color: rgba(255, 255, 255, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 16px;">Logo</span>
              </div>
            </div>
          </div>
        </div>

        <div style="padding: 80px 40px;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 32px; border-radius: 12px;">
              <h3 style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 24px 0;">Dados da Empresa</h3>
              <div style="display: grid; gap: 16px; font-size: 16px;">
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Empresa:</strong> ${result.companyData.empresa}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">CNPJ:</strong> ${result.companyData.cnpj}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Responsável:</strong> ${result.companyData.nome}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Funcionários:</strong> ${result.companyData.numeroFuncionarios}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Faturamento:</strong> ${new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(result.companyData.faturamento)}</p>
              </div>
            </div>

            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 32px; border-radius: 12px;">
              <h3 style="font-size: 22px; font-weight: bold; color: white; margin: 0 0 24px 0;">Dados do Negócio</h3>
              <div style="display: grid; gap: 16px; font-size: 16px;">
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Segmento:</strong> ${result.companyData.segmento}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Tempo de Atividade:</strong> ${result.companyData.tempoAtividade}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Localização:</strong> ${result.companyData.localizacao}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Forma Jurídica:</strong> ${result.companyData.formaJuridica}</p>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 0;"><strong style="color: white;">Tem Sócios:</strong> ${result.companyData.temSocios === 'sim' ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(content);

    try {
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`diagnostico-${result.companyData.empresa.toLowerCase().replace(/\s+/g, '-')}-v2.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      document.body.removeChild(content);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
    >
      <FileDown size={20} />
      PDF EXPORTÁVEL
    </button>
  );
}

export default ExportPDF2;