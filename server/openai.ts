// OpenRouter API integration for humanizing text
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export async function humanizeText(text: string, mode: string, tone?: number): Promise<string> {
  const modePrompts = {
    casual: "Rewrite this text to sound casual, friendly, and conversational. Use everyday language, contractions, and a relaxed tone. Make it feel natural and approachable, like you're talking to a friend.",
    professional: "Rewrite this text to sound professional and polished while remaining natural. Maintain clarity and credibility, but avoid overly formal or robotic language. Strike a balance between expertise and readability.",
    creative: "Rewrite this text with creative flair and engaging language. Use vivid descriptions, varied sentence structures, and captivating word choices. Make it interesting and compelling while keeping the core message intact.",
  };

  const toneInstruction = tone !== undefined
    ? `\n\nAdditional tone guidance: Adjust the formality level to ${tone}% (where 0% is very casual and 100% is very formal).`
    : "";

  const systemPrompt = `You are an expert at humanizing AI-generated text. Your goal is to transform robotic, stilted, or overly formal text into natural, human-like writing. ${modePrompts[mode as keyof typeof modePrompts]}${toneInstruction}

Key principles:
- Maintain the original meaning and key information
- Use natural sentence flow and varied structure
- Include appropriate transitions and connectors
- Remove overly technical jargon unless necessary
- Make it sound like something a real person would write
- Keep the same approximate length`;

  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  try {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://humanizer.ai",
        "X-Title": "Humanizer AI",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
    console.log("OpenRouter API response:", JSON.stringify(data, null, 2));
    const humanizedContent = data.choices?.[0]?.message?.content;
    if (!humanizedContent) {
      console.error("No content found in response. Response structure:", data);
      throw new Error("No content in API response");
    }
    console.log("Extracted humanized text:", humanizedContent);
    return humanizedContent;
  } catch (error) {
    console.error("OpenRouter API error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to humanize text. Please try again.");
  }
}

export async function batchHumanizeText(texts: string[], mode: string, tone?: number): Promise<string[]> {
  const results = await Promise.all(
    texts.map(text => humanizeText(text, mode, tone))
  );
  return results;
}
