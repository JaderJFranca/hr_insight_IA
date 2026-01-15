import React, { useState } from 'react';
import { optimizeResume } from '../services/geminiService';
import { ResumeOptimizationResult } from '../types';

const ResumeOptimizer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeOptimizationResult | null>(null);
  const [jobDesc, setJobDesc] = useState('');
  const [resumeText, setResumeText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDesc.trim() || !resumeText.trim()) {
      alert("Preencha ambos os campos.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const data = await optimizeResume({ jobDescription: jobDesc, resumeText });
      setResult(data);
    } catch (error) {
      alert("Erro ao otimizar currículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Otimizador de Currículo ATS
        </h2>
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-indigo-800 font-medium mb-1">Como funciona:</p>
          <ul className="list-disc list-inside text-sm text-indigo-700 space-y-1">
            <li>Reescrevemos seu currículo para destacar a experiência que você <strong>já possui</strong>.</li>
            <li><strong>Garantia de Veracidade:</strong> A IA não inventará habilidades que não constem no seu texto original.</li>
            <li>O resultado será gerado em texto simples, pronto para <strong>copiar e colar no Word</strong>.</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-slate-700 mb-2">Descrição da Vaga (Job Description)</label>
            <textarea
              required
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Cole aqui os requisitos, responsabilidades e detalhes da vaga..."
              className="flex-1 w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-h-[200px]"
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-slate-700 mb-2">Seu Currículo Atual</label>
            <textarea
              required
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Cole o texto do seu currículo original aqui..."
              className="flex-1 w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-h-[200px]"
            />
          </div>

          <div className="lg:col-span-2 flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`
                px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all
                ${loading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }
              `}
            >
              {loading ? 'Processando e Reescrevendo...' : 'Gerar Currículo Otimizado'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
          {/* Main Optimized Content */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-800">Currículo Pronto para Word</h3>
              <button 
                onClick={() => {
                    navigator.clipboard.writeText(result.optimizedContent);
                    alert("Copiado! Agora abra seu Word e cole (Ctrl+V).");
                }}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar Texto
              </button>
            </div>
            <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-800 font-normal font-mono text-sm bg-slate-50 p-6 rounded-lg border border-slate-200">
              {result.optimizedContent}
            </div>
          </div>

          {/* Sidebar Insights */}
          <div className="space-y-6">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Termos Enfatizados
              </h4>
              <p className="text-xs text-emerald-600 mb-3">Termos da vaga encontrados no seu CV e destacados:</p>
              <div className="flex flex-wrap gap-2">
                {result.atsKeywordsAdded.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-white text-emerald-700 text-xs font-semibold rounded border border-emerald-200">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Ajustes de Fraseamento
              </h4>
              <ul className="space-y-3">
                {result.keyChanges.map((change, i) => (
                  <li key={i} className="text-sm text-blue-900 flex items-start gap-2">
                    <span className="mt-1 text-blue-400">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeOptimizer;