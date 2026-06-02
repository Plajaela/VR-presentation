export function useGPT() {
  const fetchGPTResponse = async (userMessage) => {
    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        let errText = 'Failed to fetch response from GPT';
        try {
          const errData = await res.json();
          errText = errData.error || errText;
        } catch {
          errText = res.statusText || errText;
        }
        throw new Error(errText);
      }

      const data = await res.json();
      return data.reply || "I don't have that information. Please contact ETC directly at Tan_cheng_khoon@tp.edu.sg or 6780 5585.";

    } catch (error) {
      console.error(error);
      return "Sorry, I'm having trouble connecting to my servers right now. Please try again later.";
    }
  };

  const transcribeAudio = async (audioBlob, ext = "webm") => {
    const formData = new FormData();
    formData.append("audio", audioBlob, `recording.${ext}`);

    const res = await fetch("/api/stt", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let errText = "STT request failed";
      try {
        const errData = await res.json();
        errText = errData.error || errData.detail || errText;
      } catch {
        errText = res.statusText || errText;
      }
      throw new Error(errText);
    }

    const data = await res.json();
    return data.transcript;
  };

  return { fetchGPTResponse, transcribeAudio };
}
