/**
 * Google Gemini AI integration
 */

// Gemini API key from environment variables
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Check if Gemini is configured
export const isGeminiConfigured = !!GEMINI_API_KEY;

export interface GeminiRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GeminiResponse {
  success: boolean;
  text?: string;
  error?: string;
}

/**
 * Generate text using Google Gemini AI
 */
export const generateWithGemini = async ({
  prompt,
  maxTokens = 1000,
  temperature = 0.7,
}: GeminiRequest): Promise<GeminiResponse> => {
  if (!isGeminiConfigured) {
    return {
      success: false,
      error: 'Gemini AI not configured',
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || 'Failed to generate content',
      };
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return {
        success: false,
        error: 'No content generated',
      };
    }

    return {
      success: true,
      text: generatedText,
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
};

/**
 * Generate code explanation using Gemini
 */
export const explainCode = async (code: string, language: string): Promise<GeminiResponse> => {
  const prompt = `Explain the following ${language} code in simple terms:

\`\`\`${language}
${code}
\`\`\`

Please provide a clear, concise explanation of what this code does.`;

  return generateWithGemini({ prompt, maxTokens: 500, temperature: 0.3 });
};

/**
 * Generate regex explanation using Gemini
 */
export const explainRegex = async (pattern: string): Promise<GeminiResponse> => {
  const prompt = `Explain this regular expression pattern in simple terms:

Pattern: ${pattern}

Please break down what this regex pattern matches and how it works.`;

  return generateWithGemini({ prompt, maxTokens: 300, temperature: 0.3 });
};