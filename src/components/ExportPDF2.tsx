import React from 'react';
import { FileDown } from 'lucide-react';
import type { DiagnosticResult } from '../types/diagnostic';

interface ExportPDF2Props {
  result: DiagnosticResult;
}

function ExportPDF2({ result }: ExportPDF2Props) {
  const handleExport = () => {
    // Implementação futura
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