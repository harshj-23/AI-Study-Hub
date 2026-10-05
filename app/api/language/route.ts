import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_LANGUAGE_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      language,
      level,
      mode,
      question,
    } = body;

    if (!language || !level || !mode || !question) {
      return NextResponse.json(
        { error: "Please provide language, level, mode and question." },
        { status: 400 }
      );
    }

    let response;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `
You are a friendly language tutor.

The student wants to learn ${language}.

Student level: ${level}
Learning mode: ${mode}

Student's request:
${question}

Give a helpful response suitable for the student's level.

If teaching vocabulary:
- Give the word
- Give its meaning
- Give pronunciation
- Give an example sentence

If teaching grammar:
- Explain it simply
- Give examples

If practicing:
- Give exercises
- Let the student try before revealing answers when appropriate

If conversation mode:
- Have a natural conversation
- Correct mistakes gently

If quiz mode:
- Give a short quiz
- Ask one question at a time when appropriate

Keep the explanation clear and beginner-friendly.
          `,
        });

        break;
      } catch (error) {
        console.log(`Language tutor attempt ${attempt + 1} failed:`, error);

        if (attempt === 2) {
          throw error;
        }

        const delay = 2000 * Math.pow(2, attempt);

        await new Promise((resolve) => {
          setTimeout(resolve, delay);
        });
      }
    }

    return NextResponse.json({
      answer: response?.text || "No answer was generated.",
    });

  } catch (error) {
    console.error("Language API error:", error);

    return NextResponse.json(
      {
        error:
          "The language tutor is temporarily unavailable. Please try again.",
      },
      { status: 503 }
    );
  }
}