
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = body.question;

    if (!question) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    let response;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: question,
        });

        break;
      } catch (error: any) {
        console.log(`Gemini attempt ${attempt + 1} failed:`, error);

        if (attempt === 2) {
          throw error;
        }

        // Wait 2s, then 4s before retrying
        const delay = 2000 * Math.pow(2, attempt);

        await new Promise((resolve) => {
          setTimeout(resolve, delay);
        });
      }
    }

    return NextResponse.json({
      answer: response?.text || "No answer was generated.",
    });

  } catch (error: any) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      {
        error:
          "Gemini is temporarily busy. Please try again in a few seconds.",
      },
      { status: 503 }
    );
  }
}
