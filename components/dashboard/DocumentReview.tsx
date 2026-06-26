'use client';

import { useState } from 'react';
import { Upload, RefreshCcw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export function DocumentReview({ disabled }: { disabled?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    startAnalysis();
  };

  const startAnalysis = () => {
    if (disabled) return;
    setStatus('analyzing');
    setTimeout(() => {
      setStatus('done');
    }, 2000);
  };

  return (
    <section className="bg-white border border-[#c3c6d5] rounded-xl mt-12">
      <div className="bg-[#faf2ee] px-6 py-4 border-b border-[#c3c6d5]">
        <h3 className="font-['Hanken_Grotesk'] text-xs text-[#1e1b19] font-bold uppercase tracking-widest">
          Revisión de Documentos
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {status === 'idle' && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed border-[#c3c6d5] rounded-xl p-12 flex flex-col items-center justify-center text-[#434653] transition-colors ${disabled ? 'bg-gray-50 opacity-50 cursor-not-allowed' : 'hover:bg-[#faf2ee] cursor-pointer'}`}
            onClick={startAnalysis}
          >
            <Upload className="w-12 h-12 mb-2" />
            <p className="font-['Hanken_Grotesk'] text-base">Subir Documentos de Sustento</p>
            <p className="font-['Hanken_Grotesk'] text-[11px] opacity-60">PDF, DOCX hasta 10MB</p>
          </div>
        )}
        
        {status === 'analyzing' && (
          <div className="border border-[#c3c6d5] rounded-xl p-12 flex flex-col items-center justify-center text-[#434653]">
            <RefreshCcw className="w-12 h-12 mb-2 animate-spin text-[#00327d]" />
            <p className="font-['Hanken_Grotesk'] text-base">Procesando documentos...</p>
          </div>
        )}

        {status === 'done' && (
          <div className="space-y-2">
            <div className="flex items-center gap-4 p-2 bg-green-100/50 rounded-lg border border-green-100">
              <CheckCircle className="w-6 h-6 text-green-700" />
              <p className="font-['Hanken_Grotesk'] text-sm text-green-800">Certificado RNP detectado</p>
            </div>
            <div className="flex items-center gap-4 p-2 bg-amber-100/50 rounded-lg border border-amber-100">
              <AlertTriangle className="w-6 h-6 text-amber-800" />
              <p className="font-['Hanken_Grotesk'] text-sm text-amber-800">Falta Anexo 4</p>
            </div>
            <div className="flex items-center gap-4 p-2 bg-red-100/50 rounded-lg border border-red-100">
              <XCircle className="w-6 h-6 text-red-800" />
              <p className="font-['Hanken_Grotesk'] text-sm text-red-800">Documento de Experiencia Técnica no encontrado</p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-[#00327d] font-['Hanken_Grotesk'] text-xs font-semibold hover:underline"
            >
              Subir otro documento
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
