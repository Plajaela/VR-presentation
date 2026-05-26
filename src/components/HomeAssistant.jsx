import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import CharacterViewer from './CharacterViewer';
import { useGPT } from '../hooks/useGPT';
import '../styles/components/HomeAssistant.css';

const SYSTEM_INSTRUCTIONS = `You are an assistant for the Enabling Technology Collaboratory (ETC) at Temasek Polytechnic (TP), Singapore. Your ONLY role is to answer questions related to ETC.

## What you can answer:
- ETC's mission and overview
- Core technology areas: AI/Machine Learning, IoT, Immersive Media
- ETC's research projects (details below)
- Industry partners (e.g. AWS, Certis, CGH, TTSH, JMA Research, etc.)
- ETC team members and contact details
- Location: West Wing Block 20, Level 3, Temasek Polytechnic, 21 Tampines Ave 1, Singapore 529757
- Contact: Tan_cheng_khoon@tp.edu.sg | 6780 5585
- Office hours: 8.30am–6.00pm, Mon–Fri (Closed Sat, Sun & Public Holidays)

## Detailed ETC Project Information:
When asked to describe, summarize, or list our projects, refer to these 8 projects:
1. **Augmented Reality Application for Security Training (ARAST)**: Co-funded by SSG, partnered with Certis. Utilises image target tracking to simulate security incidents (Fire, Improvised explosive device, Break-In, Suspicious Person, Bag Search). Equipped with a real-time analytics dashboard to monitor training, identify errors, and track competencies.
2. **Automated Risk Assessment (ARA)**: A safety & AI project aiming to streamline workplace risk assessments using automated hazard identification and mitigation. Accepts workplace images to auto-generate preliminary Risk Assessment (RA) forms, categorizes hazards based on Ministry of Manpower (MOM) classifications, and offers an archive system.
3. **Pre-Procedure Evaluation System for MRI**: A healthcare & VR project co-funded by Temasek Polytechnic Research Fund (TPRF) and partnered with CGH. Simulates in-bore MRI scanning processes using VR to acclimatise claustrophobic/anxious patients. Collects bed mat pressure distribution, vitals, and camera data to establish an evaluation score.
4. **Virtual Practice Environment for Oral Exam Preparation**: An education & AI project partnered with Dunman Secondary School and Bartley Secondary School. Enables voice-to-text, LLM, and text-to-voice interactive preparation where an AI simulates a teacher. Teachers can upload visual stimuli, exam rubrics, and review AI feedback.
5. **E-Practical and Immersive technology (A/VR) Learning Package**: Education & VR/AR initiative driven by the POLITE Committee. TP developed 4 workplace safety topics: Ladder Safety, Fire Hazard Check, Fire Safety Equipment Visual Check, and Hazard Identification. Accessible via web and Oculus, benefiting ~1500 students across 5 polytechnics.
6. **Immersive Role-play: Role-Play Authoring and AI-Assisted Assessment**: A training & AI project partnered with JMA Research. Multi-device application providing cost-effective alternative to face-to-face roleplays. Allows domain experts to customize conversation intents, select avatars, choose environments, and analyze facial expressions, speech emotions, and language sentiments.
7. **Patient Safety Training (Emergency Dept)**: Healthcare & VR project partnered with Changi General Hospital (CGH). A gamified emergency department simulation to impart serious patient safety education (Skills, Knowledge, Attitudes) to junior doctors in a fun, safe environment without extra instructor costs.
8. **Featured Demo (Smart Wheelchair)**: A live demo project highlighting smart mobility. Integrates LiDAR sensors and Computer Vision (CV) algorithms onto standard motorized wheelchairs. Detects obstacles in real-time and corrects the path gently to prevent collisions while keeping user autonomy.

## Strict rules:
1. Allow casual greetings (e.g. "Hi", "Hello", "Good morning") and pleasantries/thanks (e.g. "Thank you"). Respond to these warmly and introduce yourself as the ETC Assistant, then ask how you can help them learn about ETC today.
2. If the question is NOT related to ETC or Temasek Polytechnic's ETC centre, politely refuse and steer the conversation back to ETC. Always end the refusal with a welcoming prompt to ask about ETC.
3. Do NOT answer general knowledge questions (e.g. math, science, current events).
4. Do NOT make up information. If you don't know, say: "I don't have that information. Please contact ETC directly at Tan_cheng_khoon@tp.edu.sg or 6780 5585."
5. Always stay on-topic. Never break character.
6. YOU MUST SPEAK IN ENGLISH ONLY.

## CRITICAL INSTRUCTION FOR NAVIGATION:
If the user asks to see, go to, or learn about a specific topic/page, you MUST provide a brief summary of that topic, AND THEN append a navigation tag at the VERY END of your response to bring them there.
- For About Us or Introduction: Append [NAV_/Introduction]
- For Partners or Ecosystem: Append [NAV_/OurPartners]
- For Projects list or Portfolio: Append [NAV_/OurProjects]
- For Specific details of Projects 1-7: Append [NAV_/OurProjects/ProjectDetail]
- For the Smart Wheelchair / Live Demo: Append [NAV_/OurProjects/DemoProject]
- For Home page: Append [NAV_/Home]
Append the navigation tag as the absolute last characters of your response, with nothing after it — no punctuation, no spaces, no words.
Example: "We have multiple projects like ARAST and ARA. Let's see the portfolio! [NAV_/OurProjects/ProjectDetail]"`;

export default function HomeAssistant() {
  const navigate = useNavigate();
  const { fetchGPTResponse, transcribeAudio } = useGPT();

  // Layout & UI States
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [textInput, setTextInput] = useState("");

  // Chat States
  const [transcriptText, setTranscriptText] = useState("");
  const [aiResponseText, setAiResponseText] = useState(
    "Hi! I am the official ETC Assistant. How can I help you today?"
  );

  // State for the 3D avatar's script and audio synchronization
  const [latestScript, setLatestScript] = useState("");
  const [revealData, setRevealData] = useState(null);

  // Refs
  const pendingNavRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [activeProject, setActiveProject] = useState(null);
  const activeProjectRef = useRef(null);

  const updateActiveProject = (val) => {
    activeProjectRef.current = val;
    setActiveProject(val);
  };
  const speakTimeoutRef = useRef(null);

  // SAFARI AUDIO UNLOCK
  const audioUnlockedRef = useRef(false);

  const unlockAudio = async () => {
    if (audioUnlockedRef.current) return;

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (AudioContextClass) {
        const ctx = new AudioContextClass();

        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        // Create tiny silent buffer
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();

        source.buffer = buffer;
        source.connect(ctx.destination);

        source.start(0);
      }

      // ALWAYS unlock HTMLAudioElement as well, because avatar-model uses `new Audio().play()`
      const audio = new Audio(
        "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAACcQCA"
      );
      audio.volume = 0;
      await audio.play();
      audio.pause();

      audioUnlockedRef.current = true;
      console.log("Audio unlocked successfully");
    } catch (err) {
      console.log("Audio unlock failed or not needed", err);
    }
  };

  // --- Synchronization Effect ---
  // Listens for the signal that the audio has downloaded and is ready to play
  useEffect(() => {
    if (revealData) {
      // Audio is ready! Hide the typing dots and show the text bubble
      setIsThinking(false);
      setAiResponseText(revealData.text);

      // Trigger navigation if a tag was provided by the AI
      if (pendingNavRef.current) {
        // Capture the route in case pendingNavRef gets cleared quickly
        const route = pendingNavRef.current;

        setTimeout(() => {
          navigate(route);
        }, 1500);

        pendingNavRef.current = null;
      }
    }
  }, [revealData, navigate]);

  // --- Listen to external triggers to explain a project ---
  useEffect(() => {
    const handleExplainProject = (e) => {
      const { projectName, projectTitle, customPrompt } = e.detail;
      
      updateActiveProject(projectName);
      
      // Clear any previous speaking timer
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
        speakTimeoutRef.current = null;
      }

      // Broadcast thinking state for this project and cache it globally
      window.currentAvatarState = { projectName, status: 'thinking' };
      window.dispatchEvent(new CustomEvent('avatar-status-broadcast', {
        detail: { projectName, status: 'thinking' }
      }));

      // Auto expand the avatar if collapsed
      setIsCollapsed(false);
      
      // Unlock Safari Audio context if needed
      unlockAudio();

      if (customPrompt) {
        sendMessage(customPrompt, false);
      } else {
        sendMessage(`Please describe the ${projectTitle} project in detail.`, false);
      }
    };

    window.addEventListener('avatar-explain-project', handleExplainProject);
    return () => {
      window.removeEventListener('avatar-explain-project', handleExplainProject);
    };
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }
    };
  }, []);

  // --- Custom TTS Handler for CharacterViewer ---
  const handleTTSFetch = async (text) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, format: 'wav' })
      });

      if (!response.ok) {
        throw new Error(`TTS server returned status ${response.status}`);
      }

      // Estimate duration: average 140 words per minute (about 2.3 words/sec)
      // For English text: ~14 characters per second
      const charCount = text.length;
      const durationMs = Math.max(4000, (charCount / 14) * 1000);

      // Clear any previous speaking timer
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }

      // Set globally cached avatar state
      window.currentAvatarState = { projectName: activeProjectRef.current, status: 'speaking' };

      // Broadcast that we started speaking
      window.dispatchEvent(new CustomEvent('avatar-status-broadcast', {
        detail: { projectName: activeProjectRef.current, status: 'speaking', durationMs }
      }));

      // Start a self-expiring timer to transition back to idle
      speakTimeoutRef.current = setTimeout(() => {
        window.currentAvatarState = { projectName: null, status: 'idle' };
        window.dispatchEvent(new CustomEvent('avatar-status-broadcast', {
          detail: { projectName: null, status: 'idle' }
        }));
        updateActiveProject(null);
        speakTimeoutRef.current = null;
      }, durationMs);

      // Signal the React component that the fetch is done
      setRevealData({ text, id: Date.now() });

      return response;
    } catch (err) {
      console.error("TTS fetch failed in handleTTSFetch:", err);
      setIsThinking(false);
      
      // Reset avatar status to idle immediately to clear spinner
      window.currentAvatarState = { projectName: null, status: 'idle' };
      window.dispatchEvent(new CustomEvent('avatar-status-broadcast', {
        detail: { projectName: null, status: 'idle' }
      }));
      updateActiveProject(null);
      
      throw err;
    }
  };

  // --- Core AI Chat Logic ---
  const sendMessage = async (userMessage, showUserBubble = true) => {
    if (showUserBubble) {
      setTranscriptText(userMessage);
      // Clear active project explaining state if user types/talks themselves
      updateActiveProject(null);
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
        speakTimeoutRef.current = null;
      }
      window.currentAvatarState = { projectName: null, status: 'idle' };
      window.dispatchEvent(new CustomEvent('avatar-status-broadcast', {
        detail: { projectName: null, status: 'idle' }
      }));
    } else {
      setTranscriptText("");
    }
    setAiResponseText("");
    setIsThinking(true);
    pendingNavRef.current = null;

    try {
      // Safely separate the system instructions from the user's actual question
      const enrichedMessage = `${SYSTEM_INSTRUCTIONS}\n\nUser Query: "${userMessage}"`;
      const aiMessage = await fetchGPTResponse(enrichedMessage);

      let speakText = aiMessage;
      let navTarget = null;
      const navMatch = aiMessage.match(/^([\s\S]*?)\s*\[NAV_\s*(.*?)\s*\]/);

      if (navMatch) {
        speakText = navMatch[1].trim(); // everything BEFORE the tag
        navTarget = navMatch[2].trim(); // the route
      } else {
        speakText = aiMessage.trim();
      }

      // If the AI returned an empty string for some reason, abort safely
      if (!speakText) {
        setIsThinking(false);
        if (navTarget) navigate(navTarget);
        
        // Reset avatar state
        window.currentAvatarState = { projectName: null, status: 'idle' };
        window.dispatchEvent(new CustomEvent('avatar-status-broadcast', {
          detail: { projectName: null, status: 'idle' }
        }));
        updateActiveProject(null);
        return;
      }

      // Store the navigation target in the ref
      pendingNavRef.current = navTarget;

      // Force rerender if same text repeated
      setLatestScript((prev) =>
        prev === speakText
          ? speakText + '\u200B'
          : speakText
      );

    } catch (e) {
      console.error("Chat error:", e);
      setIsThinking(false);
      setAiResponseText("I'm sorry, I am having trouble connecting to my brain. Please try again.");
      
      // Reset avatar state
      window.currentAvatarState = { projectName: null, status: 'idle' };
      window.dispatchEvent(new CustomEvent('avatar-status-broadcast', {
        detail: { projectName: null, status: 'idle' }
      }));
      updateActiveProject(null);
    }
  };

  // --- Voice Input ---
  const toggleListen = async () => {
    // IMPORTANT: Safari audio unlock MUST happen
    // inside direct user interaction
    await unlockAudio();

    if (isListening) {
      // Stop recording — this triggers ondataavailable + onstop
      mediaRecorderRef.current?.stop();
    } else {
      await startListening();
    }
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      // Detect supported mimeType (Safari doesn't support audio/webm)
      const SUPPORTED_TYPES = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
        "audio/ogg",
      ];
      const mimeType = SUPPORTED_TYPES.find(t => MediaRecorder.isTypeSupported(t)) || "";

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      setIsListening(true);
      setTranscriptText("");
      setAiResponseText("");

      // SAFARI SAFE AudioContext
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      const audioContext = new AudioContextClass();

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const source =
        audioContext.createMediaStreamSource(stream);

      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 512;

      source.connect(analyser);

      const dataArray = new Uint8Array(
        analyser.frequencyBinCount
      );

      let silenceStart = null;
      let stopped = false;

      const SILENCE_THRESHOLD = 10;
      const SILENCE_DURATION = 1400;

      const checkSilence = () => {
        if (
          stopped ||
          !mediaRecorderRef.current ||
          mediaRecorderRef.current.state === "inactive"
        ) {
          return;
        }

        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (volume < SILENCE_THRESHOLD) {
          if (!silenceStart) silenceStart = Date.now();
          else if (Date.now() - silenceStart > SILENCE_DURATION) {
            stopped = true;
            audioContext.close();
            mediaRecorderRef.current?.stop();
            return;
          }
        } else {
          silenceStart = null;
        }

        requestAnimationFrame(checkSilence);
      };

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stopped = true;
        stream.getTracks().forEach(track => track.stop());
        setIsListening(false);

        const actualMime = mediaRecorder.mimeType || mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });

        // Pick filename extension based on actual mime type
        const ext = actualMime.includes("mp4") ? "mp4"
          : actualMime.includes("ogg") ? "ogg"
          : "webm";

        setIsThinking(true);
        try {
          const transcript = await transcribeAudio(audioBlob, ext);
          if (transcript?.trim()) {
            await sendMessage(transcript.trim());
          } else {
            setIsThinking(false);
            setAiResponseText("Sorry, I couldn't make that out. Please try again.");
          }
        } catch (err) {
          console.error("STT error:", err);
          setIsThinking(false);
          setAiResponseText(`Error: ${err.message || "Transcription failed"}`);
        }
      };

      mediaRecorder.start();
      requestAnimationFrame(checkSilence);

    } catch (err) {
      console.error("Mic access denied:", err);
      setIsListening(false);
      alert("Microphone access is required for voice input.");
    }
  };

  // --- Text Input ---
  const handleTextSubmit = async (e) => {
    e.preventDefault();

    // IMPORTANT: Safari audio unlock MUST happen
    // inside direct user interaction
    await unlockAudio();

    if (!textInput.trim() || isThinking) return;
    const msg = textInput.trim();
    setTextInput("");
    await sendMessage(msg);
  };

  return (
    <>
      <button
        className={`home-assistant-toggle-btn ${isCollapsed ? 'collapsed' : ''}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Show Assistant" : "Hide Assistant"}
      >
        {isCollapsed ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      <div className={`home-assistant-container ${isCollapsed ? 'collapsed' : ''}`}>
        <div
          className="home-assistant-canvas-wrapper"
          style={{ position: 'absolute', inset: 0 }}
        >
          <CharacterViewer
            modelPath="/model/FModel2.glb"
            ttsEndpoint={handleTTSFetch}
            script={latestScript}
            button={false}
            modelScale={0.9}
          />
        </div>

        <div
          className="home-assistant-mic-wrapper"
          style={{
            position: 'absolute',
            bottom: '20px',    // Docks the UI to the bottom
            left: '20px',      // Adds breathing room from the edges
            right: '20px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
        >
          {!activeProject && transcriptText && !isListening && (
            <div className="home-assistant-bubble user-bubble">
              {transcriptText}
            </div>
          )}

          {!activeProject && isThinking && (
            <div className="home-assistant-bubble ai-bubble thinking">
              <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
              <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
              <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}

          {!activeProject && aiResponseText && !isThinking && (
            <div className="home-assistant-bubble ai-bubble">
              {aiResponseText}
            </div>
          )}

          <form className="home-assistant-text-form" onSubmit={handleTextSubmit}>
            <input
              type="text"
              className="home-assistant-text-input"
              placeholder="Type a question..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isThinking}
            />
            <button type="submit" className="home-assistant-send-btn" disabled={isThinking || !textInput.trim()} title="Send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
            <button
              type="button"
              className={`home-assistant-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleListen(); }}
              title="Tap to speak"
              disabled={isThinking}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            </button>
          </form>

          {isListening && <div className="home-assistant-status">Listening...</div>}
          {!activeProject && isThinking && <div className="home-assistant-status thinking">Thinking...</div>}
        </div>
      </div>
    </>
  );
}