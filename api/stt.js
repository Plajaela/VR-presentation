import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export const config = {
  api: { bodyParser: false },
};

const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let renamedPath = null;

  try {
    if (!openai) {
      return res.status(503).json({
        error: "OpenAI API key is not configured. Set OPENAI_API_KEY in .env.",
      });
    }

    const form = formidable({
      keepExtensions: true,
      maxFileSize: 12 * 1024 * 1024,
    });
    const [, files] = await form.parse(req);
    const audioFile = files.audio?.[0];

    if (!audioFile) {
      return res.status(400).json({ error: "No audio file received" });
    }

    // Determine correct extension from the original filename uploaded
    const originalExt = path.extname(audioFile.originalFilename || "recording.webm") || ".webm";
    renamedPath = audioFile.filepath + originalExt;

    // Rename the temp file to have the correct extension so Whisper recognises the format
    await fs.promises.rename(audioFile.filepath, renamedPath);

    console.log(`[STT] Transcribing: ${renamedPath} (${audioFile.size} bytes)`);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(renamedPath),
      model: "whisper-1",
    });

    res.status(200).json({ transcript: transcription.text?.trim() || "" });

  } catch (error) {
    console.error("STT failed:", error);
    res.status(500).json({
      error: "Unable to transcribe audio right now.",
      detail: error.message,
    });
  } finally {
    if (renamedPath) {
      try {
        await fs.promises.unlink(renamedPath);
      } catch {
        // Temp file may already be gone; no action needed.
      }
    }
  }
}
