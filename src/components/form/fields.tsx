import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import type { Address } from "@/lib/types";

const inputClass =
  "w-full rounded border border-line/60 bg-white px-3 py-2 text-[0.9375rem] text-title outline-none " +
  "focus:border-highlight focus:ring-1 focus:ring-highlight/30 disabled:bg-surface disabled:text-title";

type FieldProps = {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function Field({ label, hint, required, className, children }: FieldProps) {
  return (
    <label className={`block space-y-1 ${className ?? ""}`}>
      <span className="text-sm font-medium text-title">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-body">{hint}</span>}
    </label>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  className?: string;
};

export function TextField({ label, hint, className, required, ...input }: TextFieldProps) {
  return (
    <Field label={label} hint={hint} required={required} className={className}>
      <input {...input} required={required} className={inputClass} />
    </Field>
  );
}

export type Option = { value: string; label: string };

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  className?: string;
  options: Option[];
  placeholder?: string;
};

export function SelectField({
  label,
  hint,
  className,
  options,
  placeholder = "Selecione",
  required,
  ...select
}: SelectFieldProps) {
  return (
    <Field label={label} hint={hint} required={required} className={className}>
      <select {...select} required={required} className={inputClass}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-title">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-highlight" />
      {label}
    </label>
  );
}

export function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4 border-t border-line/50 pt-5 first:border-t-0 first:pt-0">
      <legend className="pr-3 font-heading text-sm font-semibold uppercase tracking-wide text-highlight">
        {title}
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/** Campos "address.<campo>", lidos por address() em lib/form. */
export function AddressFields({ value, required }: { value?: Address | null; required?: boolean }) {
  return (
    <>
      <TextField label="Logradouro" name="address.street" defaultValue={value?.street} required={required}
        maxLength={100} className="sm:col-span-2" />
      <TextField label="Número" name="address.number" defaultValue={value?.number} required={required}
        maxLength={10} />
      <TextField label="Bairro" name="address.neighborhood" defaultValue={value?.neighborhood}
        required={required} maxLength={60} />
      <TextField label="Cidade" name="address.city" defaultValue={value?.city} required={required} maxLength={60} />
      <TextField label="UF" name="address.state" defaultValue={value?.state} required={required} maxLength={2}
        placeholder="SP" />
      <TextField label="CEP" name="address.zipCode" defaultValue={value?.zipCode} required={required}
        inputMode="numeric" placeholder="00000-000" />
      <TextField label="País" name="address.country" defaultValue={value?.country ?? "Brasil"}
        required={required} maxLength={40} />
    </>
  );
}
