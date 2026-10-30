import React from 'react';
import { Play, Headphones, ShieldCheck, Lock, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { StoryConfig, formatPrice } from '../utils/storyLogic.ts';

interface HeroProps {
  config: StoryConfig;
  onPlayPreview: () => void;
  onOpenCheckout: () => void;
  isUnlocked: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  onPlayPreview,
  onOpenCheckout,
  isUnlocked,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-900">
      {/* High-impact cinematic wine & crimson ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 18%, rgba(225, 29, 72, 0.28) 0%, rgba(159, 18, 57, 0.16) 35%, rgba(15, 4, 8, 0.05) 70%, transparent 90%)`,
        }}
        aria-hidden="true"
      />

      {/* Atmospheric glowing sound wave background */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-56 opacity-15 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 200"
          className="w-full h-full text-red-500"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C150,140 300,50 450,110 C600,170 750,30 900,115 C1050,180 1200,40 1440,100"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M0,100 C180,50 360,160 540,70 C720,5 900,160 1080,65 C1260,170 1350,80 1440,100"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Identificação per spec: UMA HISTÓRIA CONTADA EM ÁUDIO */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold tracking-widest uppercase text-rose-300 bg-rose-950/70 border border-rose-800/60 rounded-full mb-6 shadow-sm shadow-rose-950">
          <Headphones className="w-3.5 h-3.5 text-rose-400" />
          <span>UMA HISTÓRIA CONTADA EM ÁUDIO</span>
        </div>

        {/* Título: Algumas histórias prendem desde o primeiro play. */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 text-balance leading-[1.12] font-editorial">
          Algumas histórias prendem
          <br className="hidden sm:inline" /> desde o primeiro play.
        </h1>

        {/* Subtítulo: Conheça a prévia e descubra uma nova forma de acompanhar essa história. */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-neutral-300 leading-relaxed mb-8 text-balance font-light">
          Conheça a prévia e descubra uma nova forma de acompanhar essa história.
        </p>

        {/* O PREÇO SALTA NA TELA: Bloco de Preço Chamativo e Imponente */}
        <div className="relative max-w-xl mx-auto mb-10 group">
          {/* Subtle Outer Neon Glow around price card */}
          <div
            className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 opacity-60 blur-lg group-hover:opacity-80 transition duration-500 animate-pulse pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative rounded-2xl bg-gradient-to-b from-[#18080c] via-[#12080a] to-[#0c080a] border-2 border-red-500/70 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-red-900/40">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                <Flame className="w-4 h-4 text-red-400" />
                <span>Oferta Especial de Lançamento</span>
              </span>
              <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-900/80 px-2.5 py-0.5 rounded-full border border-neutral-800">
                Áudio 100% Protegido
              </span>
            </div>

            {/* Price display with massive visual pop */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 my-2">
              <div className="text-center sm:text-left">
                <div className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                  Acesso Completo & Vitalício
                </div>
                <div className="flex items-baseline justify-center sm:justify-start gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-red-500 font-editorial">
                    R$
                  </span>
                  <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_25px_rgba(239,68,68,0.45)] font-editorial">
                    9,90
                  </span>
                </div>
              </div>

              <div className="h-12 w-px bg-red-900/50 hidden sm:block" />

              <div className="text-center sm:text-left space-y-1">
                <div className="inline-block px-2.5 py-1 rounded bg-red-950/80 border border-red-800 text-xs font-bold text-red-300 uppercase tracking-wide">
                  Pagamento Único
                </div>
                <div className="text-xs text-neutral-300 flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sem assinaturas ou cobranças extras</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Liberação instantânea após o pagamento
                </div>
              </div>
            </div>

            {/* Primary Action Button directly inside the price hero */}
            <div className="mt-6 pt-4 border-t border-red-900/30">
              {isUnlocked ? (
                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-sm font-bold text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Áudio desbloqueado com sucesso! Ouça no player abaixo.</span>
                </div>
              ) : (
                <button
                  onClick={onOpenCheckout}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-red-500 active:scale-[0.99] text-white font-extrabold text-base tracking-wide shadow-xl shadow-red-950/90 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-white" />
                  <span>DESBLOQUEAR HISTÓRIA COMPLETA POR R$ 9,90</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Secondary prompt button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onPlayPreview}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-semibold tracking-wide text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 text-red-500 fill-current" />
            <span>Ver Player do Conto (Requer Desbloqueio)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
