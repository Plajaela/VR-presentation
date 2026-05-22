import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";
import path from "path";
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

    // Determine correct extension from the original filename uploaded
    const originalExt = path.extname(audioFile.originalFilename || "recording.webm") || ".webm";
    const renamedPath = audioFile.filepath + originalExt;

    // Rename the temp file to have the correct extension so Whisper recognises the format
    fs.renameSync(audioFile.filepath, renamedPath);

    console.log(`[STT] Transcribing: ${renamedPath} (${audioFile.size} bytes)`);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(renamedPath),
      model: "whisper-1",
    });

    // Clean up renamed file
    try { fs.unlinkSync(renamedPath); } catch (_) {}

    res.status(200).json({ transcript: transcription.text });

  } catch (error) {
    console.error("STT failed:", error);
    res.status(500).json({ error: "Internal Server Error", detail: error.message });
  }
}