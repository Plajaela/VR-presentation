import React, { useEffect, useRef } from 'react';
import { createAvatarScene } from 'avatar-model';
import '../styles/components/CharacterViewer.css';

import { useState } from 'react';

function AvatarCanvas({ modelPath, audioURL, script, ttsEndpoint, button, modelScale, modelPosition, cameraPosition }) {
  const canvasRef = useRef(null);
  const destroyRef = useRef(null);
  const [controller, setController] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    (async () => {
      try {
        const { controller: avatarController, destroy } = await createAvatarScene(canvas, {
          modelUrl: modelPath,
          audioUrl: audioURL,
          script,
          ttsEndpoint,
          button,
          modelScale,
          modelPosition,
          cameraPosition
        });

        if (cancelled) {
          destroy();
          return;
        }

        setController(avatarController);
        destroyRef.current = destroy;
      } catch (err) {
        console.error('[CharacterViewer] Failed to init avatar:', err);
      }
    })();

    return () => {
      cancelled = true;
      destroyRef.current?.();
      destroyRef.current = null;
      setController(null);
    };
  }, [modelPath]);

  useEffect(() => {
    if (controller && script) {
      controller.speak(script); 
    }
  }, [controller, script]);

  return <canvas ref={canvasRef} className="avatar-canvas" />;
}

export default function CharacterViewer({
  modelPath,
  audioURL,
  script,
  ttsEndpoint = undefined, // Explicitly default to undefined to make it optional
  section = 'Interactive Avatar',
  button = true,
  modelScale,
  modelPosition,
  cameraPosition
}) {
  return (
    <div className="character-viewer-container">
      <AvatarCanvas
        modelPath={modelPath}
        audioURL={audioURL}
        script={script}
        ttsEndpoint={ttsEndpoint}
        button={button}
        modelScale={modelScale}
        modelPosition={modelPosition}
        cameraPosition={cameraPosition}
      />
    </div>
  );
}