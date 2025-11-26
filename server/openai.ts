// OpenRouter API integration for humanizing text
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export async function humanizeText(text: string, mode: string, tone?: number): Promise<string> {
  const modePrompts = {
    casual: "Rewrite this text to sound casual, friendly, and conversational. Use relaxed, everyday language.",
    professional: "Rewrite this text to sound professional, polished, and natural.",
    creative: "Rewrite this text with creativity, vivid language, and engaging flow.",
  };

  const toneInstruction =
    tone !== undefined
      ? `\n\nAdjust the formality level to ${tone}% (0% casual → 100% formal).`
      : "";

  const systemPrompt = `You are an expert at humanizing AI text.
${modePrompts[mode as keyof typeof modePrompts] || modePrompts.casual}
${toneInstruction}

Rules:
- Keep meaning intact
- Make it sound human
- Natural flow
- Same length`;

  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }
  try {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://humanizer-multitask-ai.onrender.com",
        "X-Title": "Humanizer Multitask AI",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",   // ✅ FIXED MODEL
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to humanize text");
    }

    const data = await response.json();
    const humanizedContent = data.choices?.[0]?.message?.content;

    if (!humanizedContent) {
      throw new Error("No content in API response");
    }

    return humanizedContent;
  } catch (error) {
    console.error("OpenRouter API error:", error);
    throw new Error("Failed to humanize text. Please try again.");
  }
}

export async function batchHumanizeText(texts: string[], mode: string, tone?: number): Promise<string[]> {
  return Promise.all(
    texts.map(text => humanizeText(text, mode, tone))
  );
}
