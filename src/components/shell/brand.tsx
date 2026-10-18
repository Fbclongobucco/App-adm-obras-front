import Image from "next/image";
import Link from "next/link";

/**
 * Logo SOLER que leva ao dashboard. A logo e grafite e nao pode ser recolorida: sobre o menu escuro fica num
 * bloco claro compacto; na barra branca do celular ({@code compact}) vai direto sobre o fundo claro.
 */
export function Brand({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <Link href="/" aria-label="SOLER · Dashboard" className="flex items-center">
        <Image src="/soler-logo.png" alt="SOLER" width={168} height={65} loading="eager" className="h-7 w-auto" />
      </Link>
    );
  }
  return (
    <Link href="/" aria-label="SOLER · Dashboard" className="flex flex-col items-start gap-2 px-5 pt-5 pb-2">
      <span className="rounded-md bg-white px-3 py-2">
        <Image src="/soler-logo.png" alt="SOLER" width={168} height={65} loading="eager" className="h-9 w-auto" />
      </span>
      <span className="text-xs font-medium uppercase tracking-wider text-white/70">Administração de obras</span>
    </Link>
  );
}
