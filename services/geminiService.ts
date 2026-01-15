import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ResumeOptimizerParams, ResumeOptimizationResult, ResumeAnalysisResult, InterviewParams, InterviewScriptResult, JobDescriptionParams } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

export const optimizeResume = async (params: ResumeOptimizerParams): Promise<ResumeOptimizationResult> => {
  const prompt = `
    Atue como um Especialista em Currículos e ATS (Applicant Tracking Systems).
    Sua tarefa é reescrever o currículo fornecido para torná-lo mais atraente para a vaga descrita, mantendo a integridade total dos dados.

    DESCRIÇÃO DA VAGA:
    ${params.jobDescription}

    CURRÍCULO ORIGINAL:
    ${params.resumeText}

    REGRAS CRÍTICAS (OBRIGATÓRIO):
    1. VERACIDADE ESTRITA: NÃO invente, adicione ou deduza habilidades, cargos, ferramentas ou experiências que não estejam EXPLICITAMENTE no currículo original. Se o candidato não tem um requisito da vaga, não o inclua. Trabalhe apenas com o que o candidato tem.
    2. FORMATAÇÃO WORD-FRIENDLY: O resultado 'optimizedContent' deve ser formatado de forma limpa e hierárquica (use Markdown simples: # para títulos, ## para subtítulos, - para listas). Evite caracteres especiais complexos ou layouts que quebrem ao colar no MS Word.
    3. PALAVRAS-CHAVE: Substitua sinônimos do currículo original pelas palavras-chave exatas da vaga (Ex: se o CV diz "Vendas", mas a vaga pede "Prospecção Comercial", e o contexto permitir, altere).
    4. FOCO EM RESULTADOS: Reescreva as descrições de experiências para focar em conquistas e impacto, usando verbos de ação.

    Responda em JSON.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      optimizedContent: { type: Type.STRING, description: "O currículo completo reescrito, formatado de forma limpa e simples para fácil cópia para o Word." },
      keyChanges: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista das principais melhorias de fraseamento realizadas." },
      atsKeywordsAdded: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de termos da vaga que foram encontrados no CV original e enfatizados (sem invenção)." }
    },
    required: ["optimizedContent", "keyChanges", "atsKeywordsAdded"]
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
    return JSON.parse(jsonText) as ResumeOptimizationResult;
  } catch (error) {
    console.error("Gemini Optimizer Error:", error);
    throw new Error("Falha ao otimizar currículo.");
  }
};

export const analyzeResume = async (jobDescription: string, resumeText: string): Promise<ResumeAnalysisResult> => {
  const prompt = `
    Você é um sistema de ATS (Applicant Tracking System) avançado.
    Analise o seguinte currículo em comparação com a descrição da vaga fornecida.
    Forneça insights claros sobre aderência, pontos fortes e melhorias necessárias.
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
      summary: { type: Type.STRING, description: "Um resumo executivo breve e direto da análise em Português." }
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
    Crie um roteiro de entrevista altamente personalizado em Português do Brasil.
    
    CONTEXTO:
    O entrevistador precisa avaliar se o candidato (descrito no Currículo) serve para a Vaga (Descrição da Vaga).
    
    VAGA:
    ${params.jobDescription}

    CURRÍCULO DO CANDIDATO:
    ${params.resumeText}

    FOCO DA ENTREVISTA: ${params.focus}
    
    Gere perguntas que:
    1. Validem as experiências listadas no currículo.
    2. Testem as competências exigidas na vaga mas não claras no currículo.
    3. Avaliem o comportamento (STAR method).
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      introduction: { type: Type.STRING, description: "Texto introdutório acolhedor para o entrevistador." },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Categoria (Técnica, Comportamental, Situacional)." },
            question: { type: Type.STRING, description: "A pergunta direta ao candidato." },
            context: { type: Type.STRING, description: "Por que esta pergunta está sendo feita (baseado no CV ou Vaga)." },
            expectedAnswerKeyPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Critérios de sucesso na resposta." }
          }
        }
      },
      closing: { type: Type.STRING, description: "Encerramento profissional e próximos passos sugeridos." }
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

export const generateJobDescription = async (params: JobDescriptionParams): Promise<string> => {
  const prompt = `
    Atue como um Recrutador Sênior de Tecnologia.
    Crie uma descrição de vaga (Job Description) profissional, atraente e inclusiva.
    
    DETALHES DA POSIÇÃO:
    Cargo: ${params.title}
    Área: ${params.department}
    Nível: ${params.seniority}
    Localização: ${params.location}
    Contrato: ${params.type}
    Requisitos Técnicos: ${params.skills}
    
    A descrição deve conter:
    - Um parágrafo introdutório empolgante sobre a oportunidade.
    - Responsabilidades e Atribuições (bullet points).
    - Requisitos e Qualificações (bullet points).
    - Diferenciais (bullet points).
    - Benefícios sugeridos para este nível de cargo.
    
    Formatação: Markdown limpo.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Job Gen Error:", error);
    throw new Error("Falha ao gerar descrição de vaga.");
  }
};