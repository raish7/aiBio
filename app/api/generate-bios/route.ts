import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";

const client = new Together({
  apiKey: process.env.MODEL_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newPrompt = `Generate a compelling, engaging, and well-structured bio for a user based on the following details:

  - **Platform:** ${body.platform}  
  - **Gender:** ${body.gender}
  - **Personality Traits:** ${body.personality.join(", ")}
  - **Passions:**  ${body.passions.join(", ")}
  ${body.hobbies && ` - **Hobbies:** ${body.hobbies}`}
  - **Tone:** ${body.tone}

  {# If the platform is a dating site (e.g., Tinder, Bumble, Hinge), include relationship goals: #}  
  {# Relationship Goals: ${body.relationshipGoals} #}  

  {# If the platform is LinkedIn, include career details: #}  
  {# Career Path: ${body.careerPath} #}  
  {# Industry: Based on the chosen career path #}  

  {# If the platform is Instagram or Twitter, keep it short and trendy, possibly including emojis. #}  
  ${
    body.aesthetic &&
    ` - **For instagra, include these emojis:** ${body.aesthetic}`
  }
  ${
    body.hashtags &&
    ` - **For Twitter, include these hashtags:** ${body.hashtags}`
  }

  **Bio Style:** Ensure the bio matches the norms of the chosen platform.  
  - For **dating apps**, make it flirty, fun, and engaging.  
  - For **LinkedIn**, make it professional and career-focused.  
  - For **Instagram/Twitter**, make it catchy and relatable.  

  Now, generate a bio that reflects these inputs and feels **natural, engaging, and platform-optimized**.

  Create two bios for the same selected platform. Dont give any addtional text, just the bios.Separate the bios with a new line.
  `;

    const aiResponse = await generateBios(newPrompt);
    const response = [];
    response.push(aiResponse?.split("\n")[0]);
    response.push(aiResponse?.split("\n")[1]);
    response.push(aiResponse?.split("\n")[2]);
    return NextResponse.json({
      message: "Sucessfully generated bios",
      response: response,
    });
  } catch (error) {
    console.log("err", error);
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
