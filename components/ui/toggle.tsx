"use client";

export function Toggle({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="nova-toggle-label">
      <span>{label}</span>
      <input
        className="nova-toggle-input"
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="nova-toggle-track" aria-hidden="true">
        <span />
      </span>
    </label>
  );
}
