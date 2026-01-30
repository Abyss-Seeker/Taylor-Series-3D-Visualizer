import { GoogleGenAI } from "@google/genai";
import { MathFunction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const explainMathConcept = async (
  func: MathFunction,
  x0: number,
  y0: number,
  activeTerms: string[]
): Promise<string> => {
  try {
    const prompt = `
      You are a calculus tutor teaching a student about the multivariate Taylor Series expansion.
      
      Current Context:
      - Function: ${func.latex} (${func.name})
      - Point (x0, y0): (${x0.toFixed(2)}, ${y0.toFixed(2)})
      - Active Terms in Visualization: ${activeTerms.join(', ')}
      
      Task:
      Explain simply (in Chinese) what the visualization is showing right now. 
      Focus on the geometry:
      - If only Order 0 is active: Explain it's just a flat plane at the height of the point.
      - If Order 1 is active: Explain how it creates a tangent plane (slope).
      - If Order 2 is active: Explain how it adds curvature (bending) to fit the surface better.
      - Mention the specific values of the derivatives at this point if they are interesting (e.g., if it's a critical point).

      Keep it under 150 words. Use plain, encouraging language.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Explaination unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate explanation at this moment. Please check your API key.";
  }
};
