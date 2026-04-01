// LLM related types and helper functions

export type AgentType = "general" | "study";

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

