// Gemini API integration for chatbot
// Using Gemini Flash 2.0

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

export type AgentType = "general" | "goal_coach" | "motivational" | "analytics" | "reflection";

interface ChatContext {
  userProfile?: {
    name: string;
    branch: string;
    year: string;
  };
  recentGoals?: Array<{ title: string; progress: number }>;
  recentReflections?: Array<{ mood: number; accomplishments: string }>;
  chatHistory?: Array<{ text: string; sender: "user" | "bot" }>;
  agentType?: AgentType;
}

const AGENT_PROMPTS: Record<AgentType, string> = {
  general: `You are LifePathBot, a friendly and supportive AI companion designed to help college students with daily reflection, goal tracking, and well-being.
Your personality: Warm, empathetic, encouraging, professional but approachable.
Focus on student success and well-being. Keep responses concise (2-4 sentences).`,

  goal_coach: `You are the Goal Coach Agent. Your sole purpose is to help students set, track, and achieve their SMART goals.
- Push for specificity (Specific, Measurable, Achievable, Relevant, Time-bound).
- Ask about deadlines and milestones.
- Be structured and action-oriented.
- If a goal is vague, ask clarifying questions to make it concrete.`,

  motivational: `You are the Motivational Agent. Your role is to uplift, inspire, and encourage the student.
- Use positive reinforcement.
- Share inspiring quotes or stories when relevant.
- Focus on growth mindset.
- If the user is feeling down or stuck, remind them of their potential and past successes.`,

  analytics: `You are the Analytics Agent. Your role is to help the student understand their progress and data.
- Analyze trends in their goals and reflections.
- Provide data-driven insights (e.g., "You've completed 80% of your goals this week!").
- Be objective but encouraging.
- Focus on productivity metrics and consistency.`,

  reflection: `You are the Goal Reflection Agent. Your goal is to guide the student through deep self-reflection.
- Ask open-ended questions about their day, learning, and feelings.
- Encourage them to think about what went well and what could be improved.
- Focus on emotional intelligence and self-awareness.
- Help them connect their daily actions to their long-term values.`,
};

export const generateChatResponse = async (
  userMessage: string,
  context?: ChatContext
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    return "I'm here to help! Please configure the Gemini API key to enable full chat functionality.";
  }

  try {
    const agentType = context?.agentType || "general";
    const systemPrompt = AGENT_PROMPTS[agentType];

    // Build context-aware prompt
    let contextInfo = "";
    if (context?.userProfile) {
      contextInfo += `User Profile: ${context.userProfile.name}, ${context.userProfile.branch} student, Year ${context.userProfile.year}.\n`;
    }
    if (context?.recentGoals && context.recentGoals.length > 0) {
      contextInfo += `Recent Goals: ${context.recentGoals.map(g => `${g.title} (${g.progress}% complete)`).join(", ")}.\n`;
    }
    if (context?.recentReflections && context.recentReflections.length > 0) {
      const latest = context.recentReflections[0];
      contextInfo += `Recent Reflection: Mood ${latest.mood}/4, Accomplishments: ${latest.accomplishments}.\n`;
    }

    const fullPrompt = `${systemPrompt}\n\n${contextInfo}\n\nUser: ${userMessage}\n\n${agentType === 'general' ? 'LifePathBot' : agentType.replace('_', ' ')}:`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!botResponse) {
      throw new Error("No response from API");
    }

    return botResponse.trim();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};

// NLP helper functions for intent detection
export const detectIntent = (message: string): {
  intent: "goal" | "reflection" | "mood" | "motivation" | "general";
  confidence: number;
} => {
  const lower = message.toLowerCase();

  const goalKeywords = ["goal", "target", "achieve", "plan", "objective", "aim"];
  const reflectionKeywords = ["reflect", "today", "accomplish", "challenge", "day"];
  const moodKeywords = ["mood", "feel", "feeling", "stress", "anxious", "worried", "happy", "sad"];
  const motivationKeywords = ["motivate", "encourage", "inspire", "stuck", "unmotivated", "lazy"];

  let maxScore = 0;
  let detectedIntent: "goal" | "reflection" | "mood" | "motivation" | "general" = "general";

  const goalScore = goalKeywords.filter(k => lower.includes(k)).length;
  const reflectionScore = reflectionKeywords.filter(k => lower.includes(k)).length;
  const moodScore = moodKeywords.filter(k => lower.includes(k)).length;
  const motivationScore = motivationKeywords.filter(k => lower.includes(k)).length;

  if (goalScore > maxScore) {
    maxScore = goalScore;
    detectedIntent = "goal";
  }
  if (reflectionScore > maxScore) {
    maxScore = reflectionScore;
    detectedIntent = "reflection";
  }
  if (moodScore > maxScore) {
    maxScore = moodScore;
    detectedIntent = "mood";
  }
  if (motivationScore > maxScore) {
    maxScore = motivationScore;
    detectedIntent = "motivation";
  }

  return {
    intent: detectedIntent,
    confidence: Math.min(maxScore / 3, 1), // Normalize confidence
  };
};

