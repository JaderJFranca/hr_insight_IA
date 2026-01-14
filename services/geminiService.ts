import { GoogleGenAI, Type, Schema } from "@google/genai";
import { JobDescriptionParams, ResumeAnalysisResult, InterviewParams, InterviewScriptResult } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

export const generateJobDescription = async (params: JobDescriptionParams): Promise<string> => {
  const prompt = `
    Atue como um Especialista em Recrutamento e Seleção Sênior.
    Crie uma descrição de vaga profissional, atraente e detalhada em Português do Brasil com base nos seguintes dados:

    Cargo: ${params.title}
    Departamento: ${params.department}
    Senioridade: ${params.seniority}
    Localização: ${params.location}
    Tipo de Contratação: ${params.type}
    Habilidades/Requisitos Chave: ${params.skills}

    A descrição deve incluir:
    1. Um título chamativo.
    2. Uma introdução inspiradora sobre a empresa e o papel.
    3. Responsabilidades detalhadas (bullets).
    4. Requisitos Obrigatórios e Desejáveis.
    5. Benefícios e cultura da empresa (genérico mas atrativo).
    
    Use formatação Markdown para deixar o texto bem estruturado (h2, bullets, bold).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Erro ao gerar descrição.";
  } catch (error) {
    console.error("Gemini Job Gen Error:", error);
    throw new Error("Falha ao gerar descrição da vaga.");
  }
};

export const analyzeResume = async (jobDescription: string, resumeText: string): Promise<ResumeAnalysisResult> => {
  const prompt = `
    Você é um sistema de ATS (Applicant Tracking System) avançado.
    Analise o seguinte currículo em comparação com a descrição da vaga fornecida.
    Responda EXCLUSIVAMENTE em formato JSON.

    DESCRIÇÃO DA VAGA:
    ${jobDescription}

    TEXTO DO CURRÍCULO:
    ${resumeText}
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      matchScore: { type: Type.NUMBER, description: "Uma pontuação de 0 a 100 indicando a aderência do candidato à vaga." },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista dos pontos fortes do candidato em relação à vaga." },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de pontos fracos ou lacunas de experiência." },
      missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Palavras-chave importantes da vaga ausentes no currículo." },
      summary: { type: Type.STRING, description: "Um resumo executivo breve da análise em Português." }
    },
    required: ["matchScore", "strengths", "weaknesses", "missingKeywords", "summary"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as ResumeAnalysisResult;
  } catch (error) {
    console.error("Gemini Resume Analysis Error:", error);
    throw new Error("Falha ao analisar currículo.");
  }
};

export const generateInterviewScript = async (params: InterviewParams): Promise<InterviewScriptResult> => {
  const prompt = `
    Crie um roteiro de entrevista estruturado para a posição de ${params.role}.
    Foco da entrevista: ${params.focus}.
    Nível de experiência: ${params.experienceLevel}.
    
    O idioma deve ser Português do Brasil.
    Gere perguntas inteligentes, comportamentais e técnicas (se aplicável).
    Forneça pontos-chave esperados na resposta para ajudar o entrevistador.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      introduction: { type: Type.STRING, description: "Texto introdutório para o entrevistador ler no início." },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Categoria da pergunta (ex: Técnica, Soft Skill, Cultura)" },
            question: { type: Type.STRING, description: "A pergunta a ser feita." },
            expectedAnswerKeyPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pontos chave que o candidato deve mencionar." }
          }
        }
      },
      closing: { type: Type.STRING, description: "Texto de encerramento para a entrevista." }
    },
    required: ["introduction", "questions", "closing"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as InterviewScriptResult;
  } catch (error) {
    console.error("Gemini Interview Gen Error:", error);
    throw new Error("Falha ao gerar roteiro de entrevista.");
  }
};
