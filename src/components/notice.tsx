import Link from "next/link";

/** Aviso de dependencia: o cadastro exige outro registro que ainda nao existe. */
export function Notice({ message, link }: { message: string; link?: { href: string; label: string } }) {
  return (
    <div className="panel max-w-3xl border-l-[3px] border-l-accent px-4 py-3 text-[0.9375rem] text-title">
      {message}
      {link && (
        <>
          {" "}
          <Link href={link.href} className="font-medium text-highlight underline underline-offset-2">
            {link.label}
          </Link>
        </>
      )}
    </div>
  );
}
