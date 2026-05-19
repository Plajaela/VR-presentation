const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export function useGPT() {
  const fetchGPTResponse = async (userMessage) => {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({ 
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are the ETC (Enabling Technology Collaboratory) assistant. Keep answers helpful, concise, and friendly." },
            { role: "user", content: userMessage }
          ],
          temperature: 0.3
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch response from GPT');

      const data = await res.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error(error);
      return "Sorry, I'm having trouble connecting to my servers right now. Please try again later.";
    }
  };

  const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("model", "whisper-1");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: formData,
    });

    if (!res.ok) throw new Error("STT request failed");

    const data = await res.json();
    return data.text;
  };

  return { fetchGPTResponse, transcribeAudio };
}