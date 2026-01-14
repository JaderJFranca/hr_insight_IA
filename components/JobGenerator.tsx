import React, { useState } from 'react';
import { generateJobDescription } from '../services/geminiService';
import { JobDescriptionParams } from '../types';

const JobGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState<JobDescriptionParams>({
    title: '',
    department: '',
    seniority: 'Pleno',
    location: 'Híbrido - São Paulo',
    type: 'CLT',
    skills: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const desc = await generateJobDescription(formData);
      setResult(desc);
    } catch (error) {
      alert("Erro ao gerar vaga. Verifique sua chave de API ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Gerador de Vagas Inteligente
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Título do Cargo</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Desenvolvedor React Sênior"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Departamento</label>
            <input
              required
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Ex: Engenharia de Produto"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Senioridade</label>
            <select
              name="seniority"
              value={formData.seniority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
            >
              <option>Júnior</option>
              <option>Pleno</option>
              <option>Sênior</option>
              <option>Especialista</option>
              <option>Líder Técnica / Gestão</option>
              <option>Estágio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Contrato</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
            >
              <option>CLT</option>
              <option>PJ</option>
              <option>Temporário</option>
              <option>Freelance</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Localização</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: Remoto, Híbrido - SP, Presencial - RJ"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Requisitos e Habilidades (Separe por vírgulas)</label>
            <textarea
              required
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: React, TypeScript, Node.js, Inglês Avançado, Metodologias Ágeis..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`
                px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all
                ${loading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando Vaga...
                </span>
              ) : 'Gerar Descrição'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">Resultado Gerado</h3>
            <button 
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar Texto
            </button>
          </div>
          <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobGenerator;
