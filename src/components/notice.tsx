import Link from "next/link";

/** Aviso de dependencia: o cadastro exige outro registro que ainda nao existe. */
export function Notice({ message, link }: { message: string; link?: { href: string; label: string } }) {
  return (
    <div className="max-w-3xl rounded border border-line/30 border-l-2 border-l-accent bg-white px-4 py-3 text-[15px] text-title">
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
