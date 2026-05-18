interface EmojiPickerProps {
  emojis: string[];
  selected: string;
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ emojis, selected, onSelect }: EmojiPickerProps) {
  return (
    <div className="avatar-picker">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className={`avatar-option${selected === emoji ? ' selected' : ''}`}
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
