import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDuration,
  formatPrice,
  validateAccessToken,
  shouldShowCompletionLock,
  isPlaybackAllowed,
  sanitizeStoryConfig,
  DEFAULT_STORY_CONFIG,
} from './storyLogic.ts';

test('formatDuration formats seconds into MM:SS correctly', () => {
  assert.equal(formatDuration(0), '00:00');
  assert.equal(formatDuration(9), '00:09');
  assert.equal(formatDuration(65), '01:05');
  assert.equal(formatDuration(105), '01:45');
  assert.equal(formatDuration(2520), '42:00');
  assert.equal(formatDuration(-5), '00:00');
  assert.equal(formatDuration(NaN), '00:00');
});

test('formatPrice formats monetary value into BRL currency string', () => {
  const formatted = formatPrice(9.9);
  assert.ok(formatted.includes('9,90'));
  assert.ok(formatted.includes('R$'));
});

test('validateAccessToken enforces strict token checks', () => {
  assert.equal(validateAccessToken(null).isValid, false);
  assert.equal(validateAccessToken('').isValid, false);
  assert.equal(validateAccessToken('123').isValid, false);
  assert.equal(validateAccessToken('FAKE-TOKEN').isValid, false);

  assert.equal(validateAccessToken('DM-ACCESS-99X882').isValid, true);
  assert.equal(validateAccessToken('DEMO-FULL-ACCESS').isValid, true);
  assert.equal(validateAccessToken('PAY-CONFIRMED-8812739').isValid, true);
});

test('isPlaybackAllowed and shouldShowCompletionLock guarantee zero audio playback without paying', () => {
  // Never allowed without paying
  assert.equal(isPlaybackAllowed(false), false);
  assert.equal(isPlaybackAllowed(true), true);

  // When not unlocked, locked state is always true
  assert.equal(shouldShowCompletionLock(0, 105, true, false), true);
  assert.equal(shouldShowCompletionLock(30, 105, true, false), true);

  // When unlocked, locked state is false
  assert.equal(shouldShowCompletionLock(30, 105, true, true), false);
});

test('sanitizeStoryConfig merges overrides safely without losing defaults', () => {
  const merged = sanitizeStoryConfig({
    title: 'O Enigma da Meia-Noite',
    price: 14.9,
  });

  assert.equal(merged.title, 'O Enigma da Meia-Noite');
  assert.equal(merged.price, 14.9);
  assert.equal(merged.author, DEFAULT_STORY_CONFIG.author);
  assert.equal(merged.genre, DEFAULT_STORY_CONFIG.genre);
});
