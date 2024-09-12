import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Ensure that the API key is defined
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not defined");
}

// Initialize Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    // Construct the prompt from messages
    const prompt = messages.map(message => message.content).join("\n");

    // Use Google Generative AI to generate content
    //gemini-1.5-pro is better compared to gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    return NextResponse.json({ content: result.response.text() });
  } catch (error) {
    console.error("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
