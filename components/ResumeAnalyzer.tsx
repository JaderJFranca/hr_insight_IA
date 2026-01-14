import React, { useState } from 'react';
import { analyzeResume } from '../services/geminiService';
import { ResumeAnalysisResult } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const ResumeAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [jobDesc, setJobDesc] = useState('');
  const [resumeText, setResumeText] = useState('');

  const handleSubmit = async () => {
    if (!jobDesc.trim() || !resumeText.trim()) {
      alert("Por favor, preencha a descrição da vaga e o texto do currículo.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeResume(jobDesc, resumeText);
      setResult(data);
    } catch (error) {
      alert("Erro na análise. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Emerald 500
    if (score >= 50) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">1</span>
              Descrição da Vaga
            </h3>
            <textarea
              className="flex-1 w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm resize-none"
              placeholder="Cole a descrição completa da vaga aqui..."
              rows={10}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">2</span>
              Currículo do Candidato
            </h3>
            <textarea
              className="flex-1 w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm resize-none"
              placeholder="Cole o texto do currículo aqui (Ctrl+V)..."
              rows={10}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`
              w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all
              ${loading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transform hover:-translate-y-1'
              }
            `}
          >
            {loading ? 'Analisando...' : 'Analisar Compatibilidade'}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 h-full animate-fade-in-up">
              <div className="flex flex-col items-center justify-center mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Pontuação de Compatibilidade</h3>
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Match', value: result.matchScore },
                          { name: 'Gap', value: 100 - result.matchScore }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                        <Cell key="match" fill={getScoreColor(result.matchScore)} />
                        <Cell key="gap" fill="#e2e8f0" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-black text-slate-800">{result.matchScore}%</span>
                    <span className="text-sm text-slate-500">Aderência</span>
                  </div>
                </div>
                <p className="text-center text-slate-600 mt-4 px-4">{result.summary}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Pontos Fortes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.strengths.map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-600 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Pontos de Atenção
                  </h4>
                  <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                    {result.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Palavras-chave Ausentes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm border border-red-100 opacity-75">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p className="text-center">Os resultados da análise aparecerão aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
