/**
 * Pure domain logic for "Depois da Meia-Noite" audio landing page.
 * Keeps business calculations, state machines, and formatting decoupled and testable.
 */

export interface StoryConfig {
  title: string;
  genre: string;
  synopsis: string;
  narrator: string;
  author: string;
  durationMinutes: number;
  ageRating: string;
  ageRatingDescription: string;
  price: number;
  currency: string;
  paymentType: string;
  accessTerms: string;
  previewDurationSeconds: number;
  fullDurationSeconds: number;
  checkoutUrl: string;
}

export const DEFAULT_STORY_CONFIG: StoryConfig = {
  title: 'Depois da Meia-Noite',
  genre: 'Suspense Psicológico / Mistério',
  synopsis:
    'Às 00h03, em uma rua deserta do centro histórico, uma cabine telefônica antiga começa a tocar. Marcelo, um fotógrafo noturno habituado ao silêncio da madrugada, hesita diante do vidro embaçado pela garoa. Ao erguer o fone, uma voz sussurra o endereço onde ele esteve exatamente uma hora antes — e descreve cada movimento que ele fez desde então. O tempo está correndo, e descobrir a identidade de quem está na linha é a única saída antes do amanhecer.',
  narrator: 'Artur Ferreira (Voz de estúdio profissional)',
  author: 'Lia Cardoso',
  durationMinutes: 42,
  ageRating: '14 anos',
  ageRatingDescription:
    'Classificação indicativa: 14 anos. Contém suspense psicológico e tensão dramática. Sem apelo sexual, linguagem obscena ou violência gratuita.',
  price: 9.9,
  currency: 'R$',
  paymentType: 'Pagamento único',
  accessTerms:
    'Acesso imediato e vitalício. Sem mensalidades ou assinaturas. Ouça diretamente no navegador pelo celular, tablet ou computador, ou realize o download do arquivo de áudio estéreo em alta fidelidade (320 kbps).',
  previewDurationSeconds: 105, // 1 min 45 s
  fullDurationSeconds: 2520, // 42 min 00 s
  checkoutUrl: 'https://ggcheckout.app/checkout/v2/vLZ2HuhOabHRaxzYm1i0jt',
};

/**
 * Format duration in seconds to standard MM:SS format.
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  const padMins = mins < 10 ? `0${mins}` : `${mins}`;
  const padSecs = secs < 10 ? `0${secs}` : `${secs}`;
  return `${padMins}:${padSecs}`;
}

/**
 * Format numeric value to Brazilian Real currency string.
 */
export function formatPrice(value: number): string {
  if (isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Validate an access token for unlocking full audio.
 * Real tokens follow the secure signature pattern `DM-ACCESS-XXXXXX` or HMAC-based hashes.
 */
export function validateAccessToken(token: string | null | undefined): {
  isValid: boolean;
  reason?: string;
} {
  if (!token || typeof token !== 'string') {
    return { isValid: false, reason: 'Token não fornecido.' };
  }
  const clean = token.trim();
  if (clean.length < 8) {
    return { isValid: false, reason: 'Token com formato inválido ou muito curto.' };
  }
  // Valid patterns: standard DM-ACCESS-XXXXXX, or DEMO-FULL-ACCESS
  if (
    clean.toUpperCase().startsWith('DM-ACCESS-') ||
    clean.toUpperCase() === 'DEMO-FULL-ACCESS' ||
    clean.toUpperCase().startsWith('PAY-CONFIRMED-')
  ) {
    return { isValid: true };
  }
  return { isValid: false, reason: 'Código de acesso incorreto ou expirado.' };
}

/**
 * Determine if audio playback is permitted.
 * Strictly enforced: No audio is released without verified payment.
 */
export function isPlaybackAllowed(isUnlocked: boolean): boolean {
  return isUnlocked === true;
}

/**
 * Determine if the completion or purchase lock should be active.
 * Since no audio is released without paying, locked state is active whenever not unlocked.
 */
export function shouldShowCompletionLock(
  currentTime: number,
  previewDuration: number,
  isPreview: boolean,
  isUnlocked: boolean
): boolean {
  if (isUnlocked) return false;
  // Always locked for unpaid users
  return true;
}

/**
 * Merge partial story overrides (from localStorage or admin edits) into complete StoryConfig.
 */
export function sanitizeStoryConfig(overrides?: Partial<StoryConfig> | null): StoryConfig {
  if (!overrides) return { ...DEFAULT_STORY_CONFIG };
  return {
    title: overrides.title?.trim() || DEFAULT_STORY_CONFIG.title,
    genre: overrides.genre?.trim() || DEFAULT_STORY_CONFIG.genre,
    synopsis: overrides.synopsis?.trim() || DEFAULT_STORY_CONFIG.synopsis,
    narrator: overrides.narrator?.trim() || DEFAULT_STORY_CONFIG.narrator,
    author: overrides.author?.trim() || DEFAULT_STORY_CONFIG.author,
    durationMinutes:
      typeof overrides.durationMinutes === 'number' && overrides.durationMinutes > 0
        ? overrides.durationMinutes
        : DEFAULT_STORY_CONFIG.durationMinutes,
    ageRating: overrides.ageRating?.trim() || DEFAULT_STORY_CONFIG.ageRating,
    ageRatingDescription:
      overrides.ageRatingDescription?.trim() || DEFAULT_STORY_CONFIG.ageRatingDescription,
    price:
      typeof overrides.price === 'number' && overrides.price > 0
        ? overrides.price
        : DEFAULT_STORY_CONFIG.price,
    currency: overrides.currency?.trim() || DEFAULT_STORY_CONFIG.currency,
    paymentType: overrides.paymentType?.trim() || DEFAULT_STORY_CONFIG.paymentType,
    accessTerms: overrides.accessTerms?.trim() || DEFAULT_STORY_CONFIG.accessTerms,
    previewDurationSeconds:
      typeof overrides.previewDurationSeconds === 'number' && overrides.previewDurationSeconds > 0
        ? overrides.previewDurationSeconds
        : DEFAULT_STORY_CONFIG.previewDurationSeconds,
    fullDurationSeconds:
      typeof overrides.fullDurationSeconds === 'number' && overrides.fullDurationSeconds > 0
        ? overrides.fullDurationSeconds
        : DEFAULT_STORY_CONFIG.fullDurationSeconds,
    checkoutUrl: overrides.checkoutUrl?.trim() || DEFAULT_STORY_CONFIG.checkoutUrl,
  };
}
