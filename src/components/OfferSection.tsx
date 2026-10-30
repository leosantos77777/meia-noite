import React from 'react';
import { ShieldCheck, Mail, Key, Download, CheckCircle2, Lock, Flame } from 'lucide-react';
import { formatPrice, StoryConfig } from '../utils/storyLogic.ts';

interface OfferSectionProps {
  config: StoryConfig;
  onOpenCheckout: () => void;
  isUnlocked: boolean;
}

export const OfferSection: React.FC<OfferSectionProps> = ({
  config,
  onOpenCheckout,
  isUnlocked,
}) => {
  return (
    <section className="py-16 md:py-24 border-t border-neutral-900 bg-gradient-to-b from-transparent via-red-950/20 to-transparent relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Main Offer Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#18080c] via-[#10080b] to-[#0a0709] border-2 border-red-600/70 p-8 sm:p-12 shadow-2xl overflow-hidden text-center">
          {/* Intense Glowing Radial Background */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"
            aria-hidden="true"
          />

          {/* Kicker Tag */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600/30 border border-red-500/60 text-xs font-black uppercase tracking-widest text-red-300 mb-6 shadow-md shadow-red-950">
            <Flame className="w-4 h-4 text-red-400" />
            <span>PAGAMENTO ÚNICO · ACESSO VITALÍCIO</span>
          </div>

          {/* Título: Continue ouvindo. */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-editorial mb-4">
            Continue ouvindo.
          </h2>

          {/* Descrição: Tenha acesso à história completa em áudio. */}
          <p className="text-base sm:text-xl text-neutral-300 max-w-lg mx-auto mb-8 font-light">
            Tenha acesso à história completa em áudio.
          </p>

          {/* O PREÇO SALTA NA TELA COM MÁXIMO IMPACTO */}
          <div className="my-8 relative inline-block px-8 py-5 rounded-2xl bg-black/60 border border-red-500/40 shadow-2xl">
            <div className="text-xs uppercase tracking-widest text-neutral-400 mb-1 font-bold">
              Valor Promocional Exclusivo
            </div>

            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-red-500 font-editorial">
                R$
              </span>
              <span className="text-6xl sm:text-8xl font-black text-white tracking-tight tabular-nums font-editorial drop-shadow-[0_0_35px_rgba(239,68,68,0.6)]">
                9,90
              </span>
            </div>

            {/* Apoio per spec: Pagamento único. */}
            <div className="text-sm sm:text-base font-bold text-red-400 mt-2">
              Pagamento único. Sem renovações, sem mensalidades.
            </div>
          </div>

          {/* Botão em destaque: QUERO O ÁUDIO COMPLETO */}
          <div className="mt-8 mb-10">
            {isUnlocked ? (
              <div className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-800 rounded-xl shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Você já tem acesso vitalício a este áudio</span>
              </div>
            ) : (
              <button
                onClick={onOpenCheckout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-black tracking-wide text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-red-500 active:scale-98 rounded-xl shadow-2xl shadow-red-950 transition-all transform hover:-translate-y-1 cursor-pointer"
              >
                <Lock className="w-5 h-5 text-white" />
                <span>QUERO O ÁUDIO COMPLETO</span>
                <span className="text-red-200">·</span>
                <span className="tabular-nums font-mono font-bold">R$ 9,90</span>
              </button>
            )}
          </div>

          {/* Explicação de como o comprador recebe e recupera o acesso */}
          <div className="border-t border-red-900/40 pt-8 mt-4 text-left">
            <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-4 text-center">
              Como você recebe e recupera o seu acesso:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center justify-center shrink-0 text-red-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-100 mb-0.5">
                    1. Envio Imediato por E-mail
                  </h5>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Assim que o pagamento de R$ 9,90 for confirmado, seu link de escuta e token exclusivo são enviados ao seu e-mail.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center justify-center shrink-0 text-red-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-100 mb-0.5">
                    2. Chave de Acesso Vitalícia
                  </h5>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Trocou de celular ou quer ouvir no tablet? Basta clicar em &ldquo;Já comprei&rdquo; e inserir seu código para liberar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center justify-center shrink-0 text-red-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-100 mb-0.5">
                    3. Online ou Download Offline
                  </h5>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Ouça no navegador do celular ou faça o download do áudio master estéreo em 320 kbps para ouvir sem gastar internet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
