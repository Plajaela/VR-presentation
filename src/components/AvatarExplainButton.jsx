/**
 * "Listen to Avatar Explain" control used across project pages.
 *
 * Dispatches an `avatar-explain-project` event that the global HomeAssistant
 * listens for, and reflects thinking / speaking / idle state based on the
 * shared avatar status. Previously this ~30-line block was copy-pasted for
 * every project; this component is the single source of truth.
 */
export default function AvatarExplainButton({
  projectName,
  projectTitle,
  customPrompt,
  avatarState,
  variant = 'teal',
  style,
}) {
  const isActive = avatarState?.projectName === projectName;
  const isThinking = isActive && avatarState.status === 'thinking';
  const isSpeaking = isActive && avatarState.status === 'speaking';

  const handleClick = (e) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('avatar-explain-project', {
        detail: { projectName, projectTitle, customPrompt },
      })
    );
  };

  const label = isSpeaking
    ? 'Avatar Explaining...'
    : isThinking
      ? 'Avatar Thinking...'
      : 'Listen to Avatar Explain';

  const className = `avatar-explain-btn${variant === 'violet' ? ' avatar-explain-btn--violet' : ''}`;

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      style={style}
      aria-label={`Ask the avatar to explain ${projectTitle}`}
      aria-live="polite"
    >
      {isThinking ? (
        <span className="speaker-thinking" style={{ marginRight: '6px' }} />
      ) : isSpeaking ? (
        <div className="speaker-waves animating" style={{ marginRight: '6px' }}>
          <span className="speaker-bar" />
          <span className="speaker-bar" />
          <span className="speaker-bar" />
        </div>
      ) : (
        <span className="avatar-explain-btn-sparkle">✨</span>
      )}
      {label}
    </button>
  );
}
