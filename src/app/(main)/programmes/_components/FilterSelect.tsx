type FilterSelectProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

export function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  const isActive = value !== "All";

  return (
    <label
      className={`relative flex cursor-pointer items-center justify-between gap-2 border px-3 py-2 md:px-4 md:py-3 ${
        isActive ? "border-accent" : "border-foreground"
      }`}
    >
      <span className={`label ${isActive ? "text-accent" : "text-foreground"}`}>
        {isActive ? value : label}
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
      <span aria-hidden className={`label ${isActive ? "text-accent" : "text-muted-foreground"}`}>
        ▾
      </span>
    </label>
  );
}
