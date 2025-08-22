import { useState, useRef } from "preact/hooks";

interface HotkeyInputProps {
  value: string;
  onChange: (hotkey: string) => void;
}

export function HotkeyInput({ value, onChange }: HotkeyInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentKeys, setCurrentKeys] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatHotkey = (keys: string[]): string => {
    const modifiers = [];
    let mainKey = "";

    for (const key of keys) {
      if (key === "Meta") modifiers.push("cmd");
      else if (key === "Control") modifiers.push("ctrl");
      else if (key === "Alt") modifiers.push("alt");
      else if (key === "Shift") modifiers.push("shift");
      else mainKey = key.toLowerCase();
    }

    return [...modifiers, mainKey].filter(Boolean).join("+");
  };

  const displayHotkey = (hotkey: string): string => {
    return hotkey
      .split("+")
      .map((key) => {
        switch (key) {
          case "cmd":
            return "⌘";
          case "ctrl":
            return "⌃";
          case "alt":
            return "⌥";
          case "shift":
            return "⇧";
          default:
            return key.toUpperCase();
        }
      })
      .join(" + ");
  };

  const startRecording = () => {
    setIsRecording(true);
    setCurrentKeys([]);
    inputRef.current?.focus();
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (currentKeys.length > 0) {
      const newHotkey = formatHotkey(currentKeys);
      onChange(newHotkey);
    }
    setCurrentKeys([]);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isRecording) return;

    event.preventDefault();
    event.stopPropagation();

    const pressedKeys = [];
    if (event.metaKey) pressedKeys.push("Meta");
    if (event.ctrlKey) pressedKeys.push("Control");
    if (event.altKey) pressedKeys.push("Alt");
    if (event.shiftKey) pressedKeys.push("Shift");

    if (
      event.key !== "Meta" &&
      event.key !== "Control" &&
      event.key !== "Alt" &&
      event.key !== "Shift"
    ) {
      pressedKeys.push(event.key);
    }

    setCurrentKeys(pressedKeys);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (!isRecording) return;

    event.preventDefault();
    event.stopPropagation();

    if (!event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
      stopRecording();
    }
  };

  const handleBlur = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  const currentDisplay =
    currentKeys.length > 0
      ? formatHotkey(currentKeys)
          .split("+")
          .map((key) => {
            switch (key) {
              case "cmd":
                return "⌘";
              case "ctrl":
                return "⌃";
              case "alt":
                return "⌥";
              case "shift":
                return "⇧";
              default:
                return key.toUpperCase();
            }
          })
          .join(" + ")
      : "";

  return (
    <div className="hotkey-input">
      <input
        ref={inputRef}
        type="text"
        value={isRecording ? currentDisplay : displayHotkey(value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        onFocus={startRecording}
        readOnly
        placeholder="Click to record hotkey"
        className={`hotkey-field ${isRecording ? "recording" : ""}`}
      />
      <button
        type="button"
        onClick={startRecording}
        className="record-button"
        disabled={isRecording}
      >
        {isRecording ? "Recording..." : "Record"}
      </button>
    </div>
  );
}
