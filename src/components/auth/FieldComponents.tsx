import type { FieldValues, UseFormRegister } from "react-hook-form";

// Helper components
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label text-muted-foreground">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function YesNo({
  label,
  name,
  register,
}: {
  label: string;
  name: string;
  register: UseFormRegister<FieldValues>;
}) {
  return (
    <Field label={label}>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {["Yes", "No"].map((v) => (
          <label key={v} className="flex items-center gap-2 text-sm">
            <input type="radio" value={v} {...register(name)} className="accent-accent" />
            {v}
          </label>
        ))}
      </div>
    </Field>
  );
}
