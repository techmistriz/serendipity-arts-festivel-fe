interface VibesFilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function VibesFilterSelect({
  label,
  value,
  options,
  onChange,
}: VibesFilterSelectProps) {
  const active = value !== "All";

  return (
    <label
      className={`relative flex cursor-pointer items-center justify-between gap-2 border px-3 py-2 md:px-4 md:py-3 ${
        active ? "border-accent" : "border-foreground"
      }`}
    >
      <span className={`label ${active ? "text-accent" : "text-foreground"}`}>
        {active ? value : label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <span aria-hidden className={`label ${active ? "text-accent" : "text-muted-foreground"}`}>
        ▾
      </span>
    </label>
  );
}
