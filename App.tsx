import React, { useState } from 'react';
import Layout from './components/Layout';
import ResumeOptimizer from './components/ResumeOptimizer';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import InterviewPrep from './components/InterviewPrep';
import { View } from './types';

const Dashboard: React.FC<{ setView: (v: View) => void }> = ({ setView }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      <div 
        onClick={() => setView('resume-optimizer')}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group"
      >
        <div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Otimizador de Currículo</h3>
        <p className="text-slate-600">Reescreva e adapte currículos para ATS com base na descrição da vaga.</p>
        <div className="mt-4 text-indigo-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Começar <span className="text-xl">→</span>
        </div>
      </div>

      <div 
        onClick={() => setView('resume-analyzer')}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer group"
      >
        <div className="h-14 w-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Analista de Aderência</h3>
        <p className="text-slate-600">Compare candidatos com a vaga e receba insights de pontos fortes e fracos.</p>
        <div className="mt-4 text-emerald-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Começar <span className="text-xl">→</span>
        </div>
      </div>

      <div 
        onClick={() => setView('interview-prep')}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-violet-300 transition-all cursor-pointer group"
      >
        <div className="h-14 w-14 bg-violet-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-100 transition-colors">
          <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Preparar Entrevista</h3>
        <p className="text-slate-600">Gere perguntas contextuais baseadas no currículo e na descrição da vaga.</p>
        <div className="mt-4 text-violet-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Começar <span className="text-xl">→</span>
        </div>
      </div>

      <div className="md:col-span-3 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden mt-8">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Bem-vindo ao HR Nexus AI</h2>
          <p className="text-slate-300 mb-6 text-lg">
            Sua central de inteligência para Recursos Humanos. Otimize currículos para ATS, analise aderência de candidatos e prepare roteiros de entrevista personalizados com o Gemini.
          </p>
        </div>
        {/* Abstract shapes background */}
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M42.7,-62.9C50.9,-52.8,50.1,-34.4,51.7,-19.2C53.4,-4,57.4,8,54,17.7C50.6,27.4,39.8,34.8,29.1,41.7C18.4,48.6,7.8,55,-3.8,60.2C-15.4,65.5,-28,69.5,-38.1,62.8C-48.2,56.1,-55.8,38.6,-60.8,22.1C-65.8,5.6,-68.2,-10,-61.7,-22.3C-55.2,-34.6,-39.8,-43.6,-26.3,-51.1C-12.8,-58.6,-1.2,-64.6,12.5,-64.9C26.2,-65.2,42.7,-64,42.7,-62.9Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'resume-optimizer':
        return <ResumeOptimizer />;
      case 'resume-analyzer':
        return <ResumeAnalyzer />;
      case 'interview-prep':
        return <InterviewPrep />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;