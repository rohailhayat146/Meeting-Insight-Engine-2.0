import { GoogleGenAI, Type, LiveServerMessage, Modality } from "@google/genai";
import { MeetingAnalysis } from "../types";

// Fixed: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MEETING_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    meetingType: { type: Type.STRING, description: "Type of meeting (e.g., Strategic Planning, Crisis Response, Status Update)." },
    overallSentiment: {
      type: Type.OBJECT,
      properties: {
        label: { type: Type.STRING, enum: ["Positive", "Neutral", "Tense", "Conflicted"] },
        explanation: { type: Type.STRING, description: "Brief, diagnostic explanation of the sentiment signals." }
      },
      required: ["label", "explanation"]
    },
    executiveSummary: { 
      type: Type.STRING, 
      description: "Concise, high-level narrative for executives. Start with the primary takeaway. Consolidate repeated themes. Use active, directive language." 
    },
    decisions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "The decision made, framed decisively with clear business impact. Use consistent terminology." },
          status: { type: Type.STRING, enum: ["Final decision", "Tentative decision", "Needs further approval"] },
          confidence: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Confidence based on clarity and dependencies." }
        },
        required: ["text", "status", "confidence"]
      }
    },
    actionItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING, description: "Actionable task description using directive language (e.g., 'Draft...', 'Finalize...')." },
          owner: { type: Type.STRING, description: "Person responsible (or 'Unassigned')." },
          priority: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          deadline: { type: Type.STRING, description: "Explicit or intelligently inferred deadline." }
        },
        required: ["task", "owner", "priority", "deadline"]
      }
    },
    ambiguitiesAndRisks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING, description: "Consolidated risk or ambiguity. Do not repeat concepts found in Productivity Insights." },
          explanation: { type: Type.STRING, description: "Why this blocks execution. Focus on business impact." }
        },
        required: ["issue", "explanation"]
      }
    },
    productivityInsights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Unique inefficiencies observed. Consolidate overlapping points (e.g., merge velocity and scope creep if related)."
    },
    suggestedImprovements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 strategic improvements for future meetings."
    },
    participants: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING }
        },
        required: ["name"]
      }
    },
    nextExecutionCheckpoint: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING, description: "The single most critical next execution milestone. Use consistent terminology." },
        deadline: { type: Type.STRING }
      },
      required: ["description", "deadline"]
    }
  },
  required: [
    "meetingType", "overallSentiment", "executiveSummary", "decisions", 
    "actionItems", "ambiguitiesAndRisks", "productivityInsights", 
    "suggestedImprovements", "participants", "nextExecutionCheckpoint"
  ]
};

export const analyzeMeeting = async (content: string): Promise<MeetingAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analyze the following meeting transcript/summary and provide a structured intelligence report: \n\n ${content}`,
      config: {
        systemInstruction: `You are an enterprise-grade AI Meeting Intelligence Engine. 
        
        YOUR MISSION:
        Analyze meeting content to produce structured, actionable insights that improve organizational productivity and decision-making.
        
        STRICT REFINEMENT GUIDELINES:
        
        1. REDUCE REDUNDANCY:
        - Consolidate repeated concepts (e.g., similar risks about scope creep and engineering velocity) into single, high-impact statements.
        - Ensure insights do not overlap across sections; if a point is a primary Risk, do not repeat it loosely in Productivity Insights.
        
        2. INCREASE EXECUTIVE DIRECTNESS:
        - Replace descriptive/passive phrasing with concise, directive language.
        - Ensure Decisions and Risks are stated with clear ownership, urgency, and specific business impact.
        - Cut fluff. Get to the strategic "So What?" immediately.
        
        3. ENFORCE TERMINOLOGY CONSISTENCY:
        - Select a single, consistent term for specific components, projects, or workstreams (e.g., choose "Analytics Module" OR "Reporting Engine", not both) throughout the entire document.
        - Ensure consistent naming across Decisions, Risks, and Execution Checkpoints.
        
        4. GENERAL RULES:
        - Do NOT hallucinate facts or people.
        - Do NOT modify dates, owners, priorities, or confidence levels if explicitly provided.
        - Output valid JSON matching the provided schema.`,
        responseMimeType: "application/json",
        responseSchema: MEETING_ANALYSIS_SCHEMA,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    const data = JSON.parse(response.text || "{}");
    return data as MeetingAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze meeting content. Please ensure your API key is valid and try again.");
  }
};

/**
 * Live Meeting Audio Streaming Implementation
 */
export const connectToLiveMeeting = async (
  onTranscript: (text: string) => void,
  onClose: () => void
): Promise<() => void> => {
  let inputAudioContext: AudioContext | null = null;
  let stream: MediaStream | null = null;
  let scriptProcessor: ScriptProcessorNode | null = null;
  let source: MediaStreamAudioSourceNode | null = null;

  try {
    inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          if (!inputAudioContext || !stream) return;
          source = inputAudioContext.createMediaStreamSource(stream);
          scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            sessionPromise.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          // Process transcription
          if (message.serverContent?.inputTranscription) {
             const text = message.serverContent.inputTranscription.text;
             if (text) onTranscript(text);
          }
          if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
             // If the model decides to speak/text back, capture that too as context
             onTranscript(message.serverContent.modelTurn.parts[0].text);
          }
        },
        onclose: () => {
          onClose();
        },
        onerror: (err) => {
          console.error("Live API Error:", err);
          onClose();
        }
      },
      config: {
        responseModalities: [Modality.AUDIO], 
        inputAudioTranscription: {
            model: "gemini-2.5-flash-native-audio-preview-09-2025"
        },
        systemInstruction: "You are a silent meeting scribe. Your job is to listen and transcribe. Do not generate audio responses unless specifically asked.",
      }
    });

    // Cleanup function
    return () => {
      if (source) source.disconnect();
      if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor.onaudioprocess = null;
      }
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (inputAudioContext) inputAudioContext.close();
      
      sessionPromise.then(session => session.close());
    };

  } catch (error) {
    console.error("Failed to start live session:", error);
    onClose();
    throw error;
  }
};

function createBlob(data: Float32Array): any {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}