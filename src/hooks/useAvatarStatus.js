import { useEffect, useState } from 'react';

/**
 * Subscribe to the global avatar status broadcast so any component can reflect
 * the assistant's thinking / speaking state for its own project. The avatar
 * (HomeAssistant) dispatches `avatar-status-broadcast` events and mirrors the
 * latest value on `window.currentAvatarState` for late subscribers.
 *
 * Returns `{ projectName, status }` where status is 'idle' | 'thinking' | 'speaking'.
 */
export function useAvatarStatus() {
  const [avatarState, setAvatarState] = useState(
    () => window.currentAvatarState || { projectName: null, status: 'idle' }
  );

  useEffect(() => {
    const handleBroadcast = (e) => {
      const { projectName, status } = e.detail;
      setAvatarState({ projectName, status });
    };

    window.addEventListener('avatar-status-broadcast', handleBroadcast);
    return () => window.removeEventListener('avatar-status-broadcast', handleBroadcast);
  }, []);

  return avatarState;
}
