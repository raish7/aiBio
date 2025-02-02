import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";

const client = new Together({
  apiKey: process.env.MODEL_KEY, 
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = `Create an array of two short and engaging dating bios for a ${
      body.gender
    } who is ${body.humor.join(
      ", "
    )}. Their personality is ${body.personality.join(
      ", "
    )}. They’re passionate about ${body.passions.join(", ")} ${
      body.hobbies ? `and their hobbies are ${body.hobbies}` : ""
    }. Their mood is ${
      body.tone
    }. Keep the tone light, fun, and authentic to their personality and mood. Just send me the two bios and no additional text required`;
    const aiResponse = await generateBios(prompt);
    const response = [];
    response.push(aiResponse?.split("\n")[0]);
    response.push(aiResponse?.split("\n")[1]);
    return NextResponse.json({
      message: "Sucessfully generated bios",
      response: response,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

async function generateBios(prompt: string) {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
  });
  return chatCompletion?.choices[0]?.message?.content;
}
