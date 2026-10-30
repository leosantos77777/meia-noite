import React from 'react';
import { Volume2, ShieldCheck, Key } from 'lucide-react';

interface NavbarProps {
  onOpenCheckout: () => void;
  onOpenRedeem: () => void;
  onScrollToPreview: () => void;
  isUnlocked: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCheckout,
  onOpenRedeem,
  onScrollToPreview,
  isUnlocked,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-[#09090c]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="flex items-center gap-2 text-xs sm:text-base font-semibold tracking-wider text-neutral-100 hover:text-white transition-colors whitespace-nowrap shrink-0 font-editorial"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-rose-950/60 border border-rose-900/50 text-rose-400 shrink-0">
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
          <span>DEPOIS DA MEIA-NOITE</span>
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <button
            onClick={onScrollToPreview}
            className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            A Prévia
          </button>
          <a
            href="#sinopse"
            className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0"
          >
            Sinopse
          </a>
          <a
            href="#ficha-tecnica"
            className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0"
          >
            Ficha Técnica
          </a>
          <a
            href="#duvidas"
            className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0"
          >
            Dúvidas & Acesso
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenRedeem}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Já possui o código? Ative seu acesso aqui"
          >
            <Key className="w-3.5 h-3.5 text-neutral-400" />
            <span>Já comprei</span>
          </button>

          {isUnlocked ? (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-700/80 rounded-lg whitespace-nowrap shrink-0 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Áudio Desbloqueado</span>
              <span className="sm:hidden">Liberado</span>
            </div>
          ) : (
            <button
              onClick={onOpenCheckout}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-black tracking-wide text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 rounded-lg shadow-md shadow-red-950 transition-all whitespace-nowrap shrink-0 cursor-pointer animate-pulse"
            >
              <span className="hidden sm:inline">LIBERAR ÁUDIO · R$ 9,90</span>
              <span className="sm:hidden">R$ 9,90</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
