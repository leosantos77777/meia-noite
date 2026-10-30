import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { AudioPlayer } from './components/AudioPlayer.tsx';
import { Synopsis } from './components/Synopsis.tsx';
import { OfferSection } from './components/OfferSection.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { FAQAndSupport } from './components/FAQAndSupport.tsx';
import { MobileStickyBar } from './components/MobileStickyBar.tsx';
import {
  DEFAULT_STORY_CONFIG,
  StoryConfig,
  sanitizeStoryConfig,
  validateAccessToken,
} from './utils/storyLogic.ts';

export default function App() {
  const [config, setConfig] = useState<StoryConfig>(() => {
    try {
      const stored = localStorage.getItem('depois_da_meia_noite_config');
      if (stored) {
        return sanitizeStoryConfig(JSON.parse(stored));
      }
    } catch {
      // Fallback to default
    }
    return { ...DEFAULT_STORY_CONFIG };
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    try {
      const savedToken = localStorage.getItem('depois_da_meia_noite_token');
      if (savedToken && validateAccessToken(savedToken).isValid) {
        return savedToken;
      }
    } catch {
      // Fallback
    }
    return null;
  });

  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState(false);

  // Check URL query parameters upon return from GG Checkout
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token') || params.get('chave');
      const isApproved =
        params.get('status') === 'approved' ||
        params.get('paid') === 'true' ||
        params.get('success') === 'true';

      if (urlToken && validateAccessToken(urlToken).isValid) {
        handleSuccessUnlock(urlToken);
        setPaymentSuccessNotice(true);
      } else if (isApproved && !accessToken) {
        const generatedToken = `PAY-CONFIRMED-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        handleSuccessUnlock(generatedToken);
        setPaymentSuccessNotice(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const isUnlocked = Boolean(accessToken && validateAccessToken(accessToken).isValid);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutInitialTab, setCheckoutInitialTab] = useState<'checkout' | 'redeem'>('checkout');

  // Handle configuration edits
  const handleUpdateConfig = (updated: Partial<StoryConfig>) => {
    const merged = sanitizeStoryConfig({ ...config, ...updated });
    setConfig(merged);
    try {
      localStorage.setItem('depois_da_meia_noite_config', JSON.stringify(merged));
    } catch {
      // ignore storage error
    }
  };

  // Handle successful access unlock
  const handleSuccessUnlock = (token: string) => {
    setAccessToken(token);
    try {
      localStorage.setItem('depois_da_meia_noite_token', token);
    } catch {
      // ignore
    }
    setIsCheckoutOpen(false);

    // Scroll to player to start full audio
    const playerElement = document.getElementById('player-section');
    if (playerElement) {
      playerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCheckout = () => {
    setCheckoutInitialTab('checkout');
    setIsCheckoutOpen(true);
  };

  const handleOpenRedeem = () => {
    setCheckoutInitialTab('redeem');
    setIsCheckoutOpen(true);
  };

  const scrollToPlayer = () => {
    const el = document.getElementById('player-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08080b] text-neutral-200 flex flex-col relative selection:bg-rose-950 selection:text-white">
      {/* Top Bar Contract (1 row, 3 zones) */}
      <Navbar
        onOpenCheckout={handleOpenCheckout}
        onOpenRedeem={handleOpenRedeem}
        onScrollToPreview={scrollToPlayer}
        isUnlocked={isUnlocked}
      />

      {paymentSuccessNotice && (
        <div className="bg-emerald-950 border-b border-emerald-800 text-emerald-200 px-4 py-3 text-center text-xs font-bold flex items-center justify-center gap-2">
          <span>🎉 Pagamento aprovado no GG Checkout! Seu áudio completo está 100% liberado abaixo.</span>
          <button
            onClick={() => setPaymentSuccessNotice(false)}
            className="text-emerald-400 hover:text-white ml-2 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1 pb-20 md:pb-0">
        {/* Hero Section */}
        <Hero
          config={config}
          onPlayPreview={scrollToPlayer}
          onOpenCheckout={handleOpenCheckout}
          isUnlocked={isUnlocked}
        />

        {/* Audio Player (Protagonist) */}
        <AudioPlayer
          config={config}
          isUnlocked={isUnlocked}
          accessToken={accessToken}
          onOpenCheckout={handleOpenCheckout}
        />

        {/* Synopsis & Editable Product Technical Sheet */}
        <Synopsis config={config} onUpdateConfig={handleUpdateConfig} />

        {/* Offer Block */}
        <OfferSection
          config={config}
          onOpenCheckout={handleOpenCheckout}
          isUnlocked={isUnlocked}
        />

        {/* FAQs, Legal Policies & Official Support */}
        <FAQAndSupport />
      </main>

      {/* Mobile Bottom Sticky Bar (Height <15% of viewport) */}
      <MobileStickyBar
        config={config}
        onOpenCheckout={handleOpenCheckout}
        isUnlocked={isUnlocked}
      />

      {/* Checkout and Token Redemption Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        initialTab={checkoutInitialTab}
        onClose={() => setIsCheckoutOpen(false)}
        config={config}
        onSuccessUnlock={handleSuccessUnlock}
      />
    </div>
  );
}
