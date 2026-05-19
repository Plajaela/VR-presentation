import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export const config = {
  api: { bodyParser: false },
};

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const form = formidable({ keepExtensions: true });
    const [, files] = await form.parse(req);
    const audioFile = files.audio?.[0];

    if (!audioFile) {
      return res.status(400).json({ error: "No audio file received" });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFile.filepath),
      model: "whisper-1",
      language: "en",
    });

    res.status(200).json({ transcript: transcription.text });

  } catch (error) {
    console.error("STT failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}