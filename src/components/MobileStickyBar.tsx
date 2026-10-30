import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { formatPrice, StoryConfig } from '../utils/storyLogic.ts';

interface MobileStickyBarProps {
  config: StoryConfig;
  onOpenCheckout: () => void;
  isUnlocked: boolean;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  config,
  onOpenCheckout,
  isUnlocked,
}) => {
  if (isUnlocked) return null;

  return (
    <aside
      aria-label="Barra de compra rápida"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#0a0709]/95 border-t-2 border-red-600/70 backdrop-blur-md px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-2xl shadow-red-950"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-red-400 tabular-nums font-editorial drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              {formatPrice(config.price)}
            </span>
            <span className="text-[10px] text-neutral-300 uppercase font-semibold">único</span>
          </div>
          <span className="text-[10px] text-neutral-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Áudio completo</span>
          </span>
        </div>

        <button
          onClick={onOpenCheckout}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-black tracking-wide text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 rounded-lg shadow-lg shadow-red-950 transition-all whitespace-nowrap shrink-0 cursor-pointer animate-pulse"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>LIBERAR R$ 9,90</span>
        </button>
      </div>
    </aside>
  );
};
