import type { Runner } from '../../types';

interface RunnerCardProps {
  runner: Runner;
  selected?: boolean;
  selectable?: boolean;
  manageable?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
}

export function RunnerCard({ runner, selected, selectable, manageable, onToggle, onDelete }: RunnerCardProps) {
  return (
    <div
      className={`racer-card${selected ? " selected" : ""}`}
      onClick={selectable ? onToggle : undefined}
      style={{ cursor: selectable ? "pointer" : "default" }}
    >
      <div className="racer-avatar">
        <img
          src={runner.avatar}
          alt={runner.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/avatars/default.png";
          }}
        />
      </div>
      <div className="racer-name">{runner.name}</div>
      <div className="racer-wins">🏆 {runner.wins} wins</div>
      {manageable && (
        <button
          className="btn btn-danger"
          style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          Xoa
        </button>
      )}
    </div>
  );
}
