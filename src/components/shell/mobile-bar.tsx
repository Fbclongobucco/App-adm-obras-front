"use client";

import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { NavMenu, Sidebar } from "@/components/sidebar";

/** Fecha o painel quando a rota muda (inclusive voltar e avancar). Usa a rota: fica dentro de <Suspense>. */
function CloseOnRouteChange({ onChange }: { onChange: () => void }) {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onChange();
  }, [pathname, onChange]);
  return null;
}

/**
 * Barra do topo no celular (abaixo de 640 px): botao de menu, logo e "Sair". O menu abre num painel lateral
 * em <dialog> modal, que ja prende o foco, fecha com Esc e deixa o resto da pagina inerte; fecha tambem ao
 * escolher um item, ao tocar fora e pelo botao "Fechar". Usuario e "Sair" chegam renderizados no servidor.
 */
export function MobileBar({ brand, drawerBrand, logout, user }: {
  brand: ReactNode; drawerBrand: ReactNode; logout: ReactNode; user: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const id = useId();

  const close = useCallback(() => dialog.current?.close(), []);

  useEffect(() => {
    // Sem rolagem do fundo com o painel aberto (o iOS ignora o inert para rolagem)
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line/60 bg-white px-4 sm:hidden">
        <button type="button" aria-label="Abrir menu" aria-expanded={open} aria-controls={id}
          onClick={() => {
            dialog.current?.showModal();
            setOpen(true);
          }}
          className="-ml-1 rounded p-2 text-title hover:bg-surface">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8}
            strokeLinecap="round" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div className="flex-1">{brand}</div>
        {logout}
      </header>
      <dialog id={id} ref={dialog} aria-label="Menu" onClose={() => setOpen(false)}
        onClick={(event) => {
          // Clique no proprio <dialog> e clique no backdrop, fora do painel
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 h-dvh max-h-none w-[min(18rem,85vw)] max-w-none bg-title p-0 backdrop:bg-black/50 sm:hidden">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between">
            {drawerBrand}
            <button type="button" aria-label="Fechar" onClick={close}
              className="mt-4 mr-3 rounded p-2 text-white/80 hover:bg-white/10 hover:text-white">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8}
                strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Suspense fallback={<NavMenu pathname={null} />}>
              <Sidebar onNavigate={close} />
              <CloseOnRouteChange onChange={close} />
            </Suspense>
          </div>
          {user}
        </div>
      </dialog>
    </>
  );
}
