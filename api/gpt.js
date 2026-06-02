import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

const SYSTEM_PROMPT = `You are the official assistant for the Enabling Technology Collaboratory (ETC) at Temasek Polytechnic (TP), Singapore. Answer only questions related to ETC.

You can discuss ETC's mission, technology areas, projects, partners, location, contact details, and office hours. If a question is outside ETC, politely steer the visitor back to ETC. If information is not available, say: "I don't have that information. Please contact ETC directly at Tan_cheng_khoon@tp.edu.sg or 6780 5585." Always respond in English.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed. Please use POST." });
  }

  try {
    const { message } = req.body;

    if (!openai) {
      return res.status(503).json({
        error: "OpenAI API key is not configured. Set OPENAI_API_KEY in .env.",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message.trim() }
      ],
      temperature: 0.3,
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    res.status(200).json({
      reply: reply || "I don't have that information. Please contact ETC directly at Tan_cheng_khoon@tp.edu.sg or 6780 5585.",
    });

  } catch (error) {
    console.error("GPT generation failed:", error);
    res.status(500).json({ error: "Unable to generate a response right now." });
  }
}
