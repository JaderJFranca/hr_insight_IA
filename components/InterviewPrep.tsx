import React, { useState } from 'react';
import { generateInterviewScript } from '../services/geminiService';
import { InterviewScriptResult, InterviewParams } from '../types';

const InterviewPrep: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterviewScriptResult | null>(null);
  const [params, setParams] = useState<InterviewParams>({
    role: '',
    focus: 'Técnico e Resolução de Problemas',
    experienceLevel: 'Sênior'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await generateInterviewScript(params);
      setResult(data);
    } catch (error) {
      alert("Erro ao gerar roteiro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Config Panel */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          Preparador de Entrevistas
        </h2>
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-indigo-100 mb-1">Cargo / Função</label>
            <input
              required
              name="role"
              value={params.role}
              onChange={handleChange}
              placeholder="Ex: Product Manager"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-indigo-100 mb-1">Foco da Entrevista</label>
            <input
              required
              name="focus"
              value={params.focus}
              onChange={handleChange}
              placeholder="Ex: Liderança, Técnico..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-indigo-100 mb-1">Nível</label>
            <select
              name="experienceLevel"
              value={params.experienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 [&>option]:text-slate-900"
            >
              <option>Júnior</option>
              <option>Pleno</option>
              <option>Sênior</option>
              <option>Executivo / C-Level</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg disabled:opacity-70"
            >
              {loading ? 'Gerando...' : 'Criar Roteiro'}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in-up pb-12">
          {/* Intro Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-2">Introdução Sugerida</h3>
            <p className="text-slate-700 italic text-lg leading-relaxed">"{result.introduction}"</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 ml-2">Perguntas Sugeridas</h3>
            {result.questions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-indigo-900 text-lg">Q{idx + 1}</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase rounded-full tracking-wider">
                    {q.category}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-lg text-slate-800 font-medium mb-4">{q.question}</p>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      O que esperar da resposta:
                    </h4>
                    <ul className="space-y-2">
                      {q.expectedAnswerKeyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 p-6 rounded-xl shadow-sm text-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-2">Encerramento Sugerido</h3>
            <p className="italic">"{result.closing}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
