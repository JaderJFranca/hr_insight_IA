import React, { useState } from 'react';
import { generateInterviewScript } from '../services/geminiService';
import { InterviewScriptResult, InterviewParams } from '../types';

const InterviewPrep: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterviewScriptResult | null>(null);
  const [params, setParams] = useState<InterviewParams>({
    jobDescription: '',
    resumeText: '',
    focus: 'Técnico e Comportamental'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.jobDescription || !params.resumeText) {
      alert("Por favor, forneça a descrição da vaga e o currículo.");
      return;
    }
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Config Panel */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          Preparador de Entrevistas Inteligente
        </h2>
        <p className="text-slate-600 mb-6">Gere perguntas baseadas especificamente nas lacunas do currículo em relação à vaga.</p>
        
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descrição da Vaga</label>
            <textarea
              required
              name="jobDescription"
              value={params.jobDescription}
              onChange={handleChange}
              placeholder="Cole a descrição da vaga..."
              className="w-full h-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Currículo do Candidato</label>
            <textarea
              required
              name="resumeText"
              value={params.resumeText}
              onChange={handleChange}
              placeholder="Cole o currículo do candidato..."
              className="w-full h-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
            />
          </div>
          
          <div className="md:col-span-2 flex items-center gap-4">
             <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Foco Principal</label>
                <input
                  required
                  name="focus"
                  value={params.focus}
                  onChange={handleChange}
                  placeholder="Ex: Liderança, Python, Cultura..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
             </div>
             <button
              type="submit"
              disabled={loading}
              className="mt-7 px-8 py-3 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700 transition-colors shadow-lg disabled:opacity-70 flex-shrink-0"
            >
              {loading ? 'Analisando e Gerando...' : 'Gerar Perguntas'}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in-up pb-12">
          {/* Intro Card */}
          <div className="bg-violet-50 p-6 rounded-xl border border-violet-100">
            <h3 className="text-sm font-bold uppercase tracking-wide text-violet-600 mb-2">Introdução</h3>
            <p className="text-slate-800 leading-relaxed">{result.introduction}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 ml-2">Roteiro de Perguntas</h3>
            {result.questions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                    <span className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold uppercase rounded-full tracking-wider">
                      {q.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-lg text-slate-900 font-medium mb-3">{q.question}</p>
                  <p className="text-sm text-slate-500 italic mb-4 border-l-2 border-slate-300 pl-3">
                    Contexto: {q.context}
                  </p>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Pontos esperados na resposta:
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
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-2">Conclusão</h3>
            <p>{result.closing}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;