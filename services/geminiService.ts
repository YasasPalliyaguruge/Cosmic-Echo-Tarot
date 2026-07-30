
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { DrawnCard, Spread } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTarotReading = async (spread: Spread, drawnCards: DrawnCard[]): Promise<string> => {
    const cardList = drawnCards.map((drawnCard, index) => {
        const position = spread.positions[index];
        const orientation = drawnCard.isReversed ? "Reversed" : "Upright";
        const meanings = drawnCard.isReversed ? drawnCard.card.meanings.shadow.join(', ') : drawnCard.card.meanings.light.join(', ');
        return `  - Position: "${position}"\n    Card: ${drawnCard.card.name} (${orientation})\n    Keywords: ${drawnCard.card.keywords.join(', ')}\n    Meaning: ${meanings}`;
    }).join('\n');

    const prompt = `
You are Aura, a wise and compassionate tarot reader with a modern, empowering perspective. Your interpretations are insightful and focus on guidance and self-reflection, avoiding fatalistic predictions. You are to provide a tarot reading based on the cards drawn.

The reading must be formatted in elegant and clear Markdown. Structure the reading as follows:
1.  **Overall Narrative:** A cohesive story that synthesizes the meanings of all the cards together.
2.  **Card Breakdown:** Detail the meaning of each card in its specific position. Use a bulleted list for the cards. For each card, make the card's name **bold**.
3.  **Final Guidance:** A concluding summary with clear, actionable advice.

Use the following Markdown headings for the sections: '### Overall Narrative', '### Card Breakdown', and '### Final Guidance'.

Here is the spread information:
- Spread Name: ${spread.name}
- Cards Drawn:
${cardList}

Please provide a thoughtful, well-structured, and integrated reading.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching tarot reading from Gemini:", error);
        return "There was an error generating your reading. The cosmos seems to be a bit fuzzy right now. Please try again later.";
    }
};
export const generateSpeech = async (text: string): Promise<string> => {
    if (!text || text.trim() === '') {
        throw new Error("Cannot generate speech from empty text.");
    }
    try {
        // FIX: Updated `contents` to match the recommended structure for the TTS model.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A calm, mystical voice
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating speech from Gemini:", error);
        throw new Error("Failed to generate audio for the reading.");
    }
};

export const generateCardImage = async (prompt: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        // Find the first part in the response that contains image data.
        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        }
        
        throw new Error("No image data received from API.");

    } catch (error) {
        console.error("Error generating card image with Gemini:", error);
        throw new Error("Failed to generate card image.");
    }
};
