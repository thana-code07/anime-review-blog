import { Label } from "@/components/ui/label";

export function FormField({
  id,
  label,
  error,
  children,
  labelClassName = "text-brown-600",
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={labelClassName}>
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
