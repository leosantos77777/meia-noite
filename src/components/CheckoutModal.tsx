import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Check,
  Key,
  ExternalLink,
  Lock,
  Flame,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { formatPrice, StoryConfig } from '../utils/storyLogic.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  initialTab?: 'checkout' | 'redeem';
  onClose: () => void;
  config: StoryConfig;
  onSuccessUnlock: (token: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  initialTab = 'checkout',
  onClose,
  config,
  onSuccessUnlock,
}) => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'redeem'>(
    initialTab === 'redeem' ? 'redeem' : 'checkout'
  );
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab === 'redeem' ? 'redeem' : 'checkout');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleRedeemToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) {
      setRedeemError('Por favor, digite o seu código de acesso.');
      return;
    }
    setIsLoading(true);
    setRedeemError(null);

    try {
      const res = await fetch('/api/checkout/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: redeemCode.trim() }),
      });
      const data = await res.json();

      if (data.valid) {
        onSuccessUnlock(redeemCode.trim());
        onClose();
      } else {
        setRedeemError(data.message || 'Código de acesso incorreto ou expirado.');
      }
    } catch {
      setRedeemError('Erro de conexão ao validar chave com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoUnlock = () => {
    onSuccessUnlock('DEMO-FULL-ACCESS');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#14080c] via-[#10080a] to-[#0a0709] border-2 border-red-600/70 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-red-900/40 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider text-red-300 bg-red-950/80 border border-red-800">
                <Flame className="w-3 h-3 text-red-400" />
                Checkout Seguro
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-editorial mt-1">
              {activeTab === 'redeem' ? 'Resgatar Acesso ao Áudio' : 'Desbloqueio Oficial do Conto'}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {config.title} · <strong className="text-red-400">R$ 9,90</strong> em pagamento único
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 text-sm rounded cursor-pointer"
            aria-label="Fechar checkout"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-950 rounded-xl mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('checkout')}
            className={`py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'checkout'
                ? 'bg-red-600 text-white font-black shadow-md shadow-red-950'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Pagar R$ 9,90</span>
          </button>

          <button
            onClick={() => setActiveTab('redeem')}
            className={`py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'redeem'
                ? 'bg-red-600 text-white font-black shadow-md shadow-red-950'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Já comprei / Resgatar</span>
          </button>
        </div>

        {/* TAB 1: CHECKOUT DIRETO GG CHECKOUT */}
        {activeTab === 'checkout' && (
          <div className="space-y-6">
            {/* Price Box with massive pop */}
            <div className="p-5 rounded-xl bg-black/70 border-2 border-red-500/50 text-center space-y-2">
              <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold">
                Valor Total com Acesso Imediato
              </span>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-2xl font-black text-red-500 font-editorial">R$</span>
                <span className="text-6xl font-black text-white font-editorial drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                  9,90
                </span>
              </div>
              <div className="text-xs font-bold text-red-300">
                Pagamento Único · PIX ou Cartão no GG Checkout
              </div>
            </div>

            {/* Product summary specs */}
            <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-400">Conteúdo:</span>
                <span className="font-semibold text-white">{config.title} (Áudio Master 42 min)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Classificação:</span>
                <span className="font-semibold text-white">{config.ageRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Prazo:</span>
                <span className="font-semibold text-emerald-400">Acesso Vitalício + Download</span>
              </div>
            </div>

            {/* Real Checkout Link to https://ggcheckout.app/checkout/v2/vLZ2HuhOabHRaxzYm1i0jt */}
            <div className="space-y-3">
              <a
                href={config.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-98 text-white font-black text-base tracking-wide shadow-2xl shadow-red-950 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Lock className="w-5 h-5 text-white" />
                <span>IR PARA O CHECKOUT SEGURO</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
              </a>

              <p className="text-[11px] text-center text-neutral-400">
                Você será direcionado ao ambiente seguro da <strong className="text-neutral-200">GG Checkout</strong> para concluir seu pagamento via PIX ou Cartão em segundos.
              </p>
            </div>

            {/* Quick Test / Homologation Unlock Button */}
            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
              <span className="text-neutral-500 text-[11px]">Teste de homologação:</span>
              <button
                type="button"
                onClick={handleQuickDemoUnlock}
                className="text-xs font-semibold text-rose-400 hover:text-rose-200 underline cursor-pointer"
              >
                Liberar com Chave de Teste (DEMO)
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: RESGATE DE CÓDIGO */}
        {activeTab === 'redeem' && (
          <form onSubmit={handleRedeemToken} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                Insira sua Chave de Acesso / Token de Compra
              </label>
              <input
                type="text"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                placeholder="Ex: DM-ACCESS-XXXXXX ou DEMO-FULL-ACCESS"
                className="w-full px-3.5 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white font-mono uppercase focus:border-red-600 focus:outline-none"
                required
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Digite o código recebido por e-mail após a confirmação no GG Checkout.
              </p>
            </div>

            {redeemError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{redeemError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Validar Chave e Desbloquear Áudio</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleQuickDemoUnlock}
                className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Ativar com código demonstrativo: DEMO-FULL-ACCESS
              </button>
            </div>
          </form>
        )}

        {/* Security badge footer */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Processamento seguro criptografado pela GG Checkout</span>
        </div>
      </div>
    </div>
  );
};
