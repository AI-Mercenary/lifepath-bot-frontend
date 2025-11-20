// Gemini API integration for chatbot
// Using Gemini Flash 2.0

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

interface ChatContext {
  userProfile?: {
    name: string;
    branch: string;
    year: string;
  };
  recentGoals?: Array<{ title: string; progress: number }>;
  recentReflections?: Array<{ mood: number; accomplishments: string }>;
  chatHistory?: Array<{ text: string; sender: "user" | "bot" }>;
}

const SYSTEM_PROMPT = `You are LifePathBot, a friendly and supportive AI companion designed to help college students with:
- Daily reflection and goal tracking
- Academic, career, and personal goal management
- Mood and stress check-ins
- Motivation and encouragement
- SMART goal guidance
- Productivity tips

Your personality:
- Warm, empathetic, and encouraging
- Professional but approachable
- Focused on student success and well-being
- Uses natural language and avoids being preachy
- Asks thoughtful follow-up questions
- Provides actionable advice

When users share their day, goals, or challenges:
- Acknowledge their efforts
- Ask clarifying questions when helpful
- Offer constructive suggestions
- Celebrate small wins
- Help break down large goals into manageable steps

Keep responses concise (2-4 sentences typically) but meaningful. Use emojis sparingly and appropriately.`;

export const generateChatResponse = async (
  userMessage: string,
  context?: ChatContext
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    // Fallback response if API key is not configured
    return "I'm here to help! Please configure the Gemini API key to enable full chat functionality. For now, I can help you with: setting goals, daily reflections, and tracking your progress.";
  }

  try {
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

    const fullPrompt = `${SYSTEM_PROMPT}\n\n${contextInfo}\n\nUser: ${userMessage}\n\nLifePathBot:`;

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
    // Fallback responses based on message content
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("goal") || lowerMessage.includes("target")) {
      return "Setting goals is a great step! Remember to make them SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. What kind of goal are you thinking about?";
    }
    if (lowerMessage.includes("mood") || lowerMessage.includes("feel") || lowerMessage.includes("stress")) {
      return "I'm here to listen. How are you feeling today? Sometimes talking about what's on your mind can help. What's been challenging lately?";
    }
    if (lowerMessage.includes("reflect") || lowerMessage.includes("day") || lowerMessage.includes("today")) {
      return "Reflecting on your day is valuable! What's one thing you accomplished today that you're proud of? And what's something you'd like to improve tomorrow?";
    }
    if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
      return "I can help you with goal setting, daily reflections, mood tracking, and staying motivated. What would you like to work on today?";
    }
    
    return "I understand. Can you tell me more about that? I'm here to help you stay on track with your goals and well-being.";
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

