import {
  Chat,
  GenerateContentResponse,
  GoogleGenAI,
  Modality,
} from '@google/genai';
import { DrawnCard, Spread } from '../types';

let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      'Gemini is not configured. Add GEMINI_API_KEY to the local environment.',
    );
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }

  return aiClient;
};

export const createAuraChat = (): Chat =>
  getAiClient().chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction:
        'You are Aura, a wise, empathetic, and modern tarot guide. Help users explore tarot readings and questions through reflection and practical insight. Avoid certainty, fatalistic predictions, medical advice, legal advice, and financial advice. Keep responses concise and format them in simple Markdown.',
    },
  });

export const getTarotReading = async (
  spread: Spread,
  drawnCards: DrawnCard[],
): Promise<string> => {
  const cardList = drawnCards
    .map((drawnCard, index) => {
      const position = spread.positions[index];
      const orientation = drawnCard.isReversed ? 'Reversed' : 'Upright';
      const meanings = drawnCard.isReversed
        ? drawnCard.card.meanings.shadow.join(', ')
        : drawnCard.card.meanings.light.join(', ');

      return `  - Position: "${position}"\n    Card: ${drawnCard.card.name} (${orientation})\n    Keywords: ${drawnCard.card.keywords.join(', ')}\n    Meaning: ${meanings}`;
    })
    .join('\n');

  const prompt = `
You are Aura, a compassionate tarot reader with a modern, empowering perspective. Treat tarot as a reflective prompt rather than a source of certainty or prediction. Avoid medical, legal, financial, and crisis advice.

Format the response in clear Markdown with these sections:
1. **Overall Narrative:** A cohesive reflection that connects the cards.
2. **Card Breakdown:** Explain each card in its position using a bulleted list and bold card names.
3. **Final Guidance:** Offer practical, non-fatalistic questions or actions for reflection.

Use these headings: '### Overall Narrative', '### Card Breakdown', and '### Final Guidance'.

Spread Name: ${spread.name}
Cards Drawn:
${cardList}
`;

  try {
    const response = await getAiClient().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const reading = response.text?.trim();

    if (!reading) {
      throw new Error('Gemini returned an empty reading.');
    }

    return reading;
  } catch (error) {
    console.error('Error fetching tarot reading from Gemini:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to generate the tarot reading.');
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  if (!text.trim()) {
    throw new Error('Cannot generate speech from empty text.');
  }

  try {
    const response = await getAiClient().models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error('Gemini returned no audio data.');
    }

    return base64Audio;
  } catch (error) {
    console.error('Error generating speech from Gemini:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to generate audio for the reading.');
  }
};

export const generateCardImage = async (prompt: string): Promise<string> => {
  if (!prompt.trim()) {
    throw new Error('An image prompt is required.');
  }

  try {
    const response: GenerateContentResponse =
      await getAiClient().models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData,
    );

    if (imagePart?.inlineData?.data) {
      return imagePart.inlineData.data;
    }

    throw new Error('Gemini returned no image data.');
  } catch (error) {
    console.error('Error generating card image with Gemini:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to generate the card image.');
  }
};
