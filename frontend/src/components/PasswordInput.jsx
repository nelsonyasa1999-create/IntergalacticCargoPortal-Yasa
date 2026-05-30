import { useRef, useState } from 'react';

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength = 6,
}) {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef(null);
  const selectionRef = useRef(null);

  const restoreCaret = (start, end) => {
    window.requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;

      input.focus({ preventScroll: true });
      input.setSelectionRange(start, end);
    });
  };

  const captureSelection = () => {
    const input = inputRef.current;
    if (!input) return;

    const hasInputFocus = document.activeElement === input;
    const start = hasInputFocus ? input.selectionStart : value.length;
    const end = hasInputFocus ? input.selectionEnd : value.length;

    selectionRef.current = {
      start: start ?? value.length,
      end: end ?? value.length,
    };
  };

  const toggleVisibility = () => {
    const input = inputRef.current;
    const savedSelection = selectionRef.current;
    const hasInputFocus = document.activeElement === input;
    const start = savedSelection?.start ?? (hasInputFocus ? input?.selectionStart : value.length);
    const end = savedSelection?.end ?? (hasInputFocus ? input?.selectionEnd : value.length);

    setVisible((v) => !v);
    restoreCaret(start ?? value.length, end ?? value.length);
    selectionRef.current = null;
  };

  return (
    <div className="password-field">
      <input
        ref={inputRef}
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required
      />
      <button
        type="button"
        className={`password-toggle ${visible ? 'is-visible' : 'is-hidden'}`}
        onClick={toggleVisibility}
        onPointerDown={captureSelection}
        onMouseDown={(event) => {
          captureSelection();
          event.preventDefault();
        }}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        title={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3l18 18" className="eye-slash" />
            <path d="M10.6 5.2c.45-.08.92-.12 1.4-.12 6.4 0 10 6.92 10 6.92a17.7 17.7 0 0 1-3.3 4.18" />
            <path d="M6.12 6.75A17.6 17.6 0 0 0 2 12s3.6 6.92 10 6.92c1.42 0 2.7-.34 3.83-.86" />
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
          </svg>
        )}
      </button>
    </div>
  );
}
