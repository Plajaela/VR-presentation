import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed. Please use POST." });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `You are an assistant for the Enabling Technology Collaboratory (ETC) at Temasek Polytechnic (TP), Singapore. Your ONLY role is to answer questions related to ETC.

What you can answer:
- ETC's mission and overview
- Core technology areas: AI/Machine Learning, IoT, Immersive Media
- ETC's research projects (e.g. AI-Assisted Immersive Role-play Platform, TPEBot, IVAM game, VR/AR learning modules, etc.)
- Industry partners (e.g. AWS, Changi General Hospital, Tan Tock Seng Hospital, etc.)
- ETC team members and contact details
- Location: West Wing Block 20, Level 3, Temasek Polytechnic, 21 Tampines Ave 1, Singapore 529757
- Contact: Tan_cheng_khoon@tp.edu.sg | 6780 5585
- Office hours: 8.30am–6.00pm, Mon–Fri (Closed Sat, Sun & Public Holidays)

Strict rules:
1. If the question is NOT related to ETC or Temasek Polytechnic's ETC centre, respond ONLY with: "I can only assist with questions about the Enabling Technology Collaboratory (ETC) at Temasek Polytechnic. Please ask something related to ETC."
2. Do NOT answer general knowledge questions (e.g. math, science, current events).
3. Do NOT make up information. If you don't know, say: "I don't have that information. Please contact ETC directly at Tan_cheng_khoon@tp.edu.sg or 6780 5585."
4. Always stay on-topic. Never break character.` },
        { role: "user", content: message }
      ],
      temperature: 0.3,
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {
    console.error("GPT generation failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}