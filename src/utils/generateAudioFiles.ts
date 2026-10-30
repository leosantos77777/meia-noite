/**
 * Audio synthesis utility to generate realistic, eerie suspense ambiance WAV files
 * with binaural drone, heartbeat pulse, clock ticks, and atmospheric cliffhanger.
 * This guarantees 100% playable real audio without external dependencies or broken links.
 */

import * as fs from 'fs';
import * as path from 'path';

interface WavOptions {
  durationSeconds: number;
  sampleRate?: number;
  isFullVersion?: boolean;
}

export function generateAtmosphericWavBuffer(options: WavOptions): Buffer {
  const sampleRate = options.sampleRate || 22050; // 22.05 kHz stereo is great quality and fast
  const duration = options.durationSeconds;
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit
  const numSamples = Math.floor(sampleRate * duration);
  const dataSize = numSamples * numChannels * bytesPerSample;
  const headerSize = 44;
  const buffer = Buffer.alloc(headerSize + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // ByteRate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = headerSize;
  const twoPi = 2 * Math.PI;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // 1. Ambient Binaural Sub-Bass Drone (55Hz Left, 58.5Hz Right -> 3.5Hz theta beat)
    const droneLeft = Math.sin(twoPi * 55 * t) * 0.28;
    const droneRight = Math.sin(twoPi * 58.5 * t) * 0.28;

    // 2. Harmonic eerie pad (220Hz minor chord with gentle swell)
    const swell = 0.5 + 0.5 * Math.sin(twoPi * 0.1 * t);
    const eeriePadLeft =
      (Math.sin(twoPi * 220 * t) + Math.sin(twoPi * 261.63 * t) * 0.7) * 0.08 * swell;
    const eeriePadRight =
      (Math.sin(twoPi * 220 * t) + Math.sin(twoPi * 329.63 * t) * 0.7) * 0.08 * swell;

    // 3. Heartbeat Pulse (every 1.15 seconds)
    const hbCycle = t % 1.15;
    let heartbeat = 0;
    if (hbCycle < 0.12) {
      // First lub
      heartbeat = Math.sin(twoPi * 45 * hbCycle) * Math.exp(-hbCycle * 25) * 0.45;
    } else if (hbCycle > 0.22 && hbCycle < 0.35) {
      // Second dub
      const dt = hbCycle - 0.22;
      heartbeat = Math.sin(twoPi * 40 * dt) * Math.exp(-dt * 30) * 0.35;
    }

    // 4. Vintage Clock Tick (every 1.0 second, alternating stereo)
    const tickCycle = t % 1.0;
    let tickLeft = 0;
    let tickRight = 0;
    if (tickCycle < 0.04) {
      const isTick = Math.floor(t) % 2 === 0;
      const tickSound =
        Math.sin(twoPi * 1800 * tickCycle) * Math.exp(-tickCycle * 140) * 0.22 +
        (Math.random() - 0.5) * 0.05 * Math.exp(-tickCycle * 100);
      if (isTick) {
        tickLeft = tickSound * 0.8;
        tickRight = tickSound * 0.3;
      } else {
        tickLeft = tickSound * 0.3;
        tickRight = tickSound * 0.8;
      }
    }

    // 5. Rain & nocturnal city rumble (filtered pink noise)
    const rain = (Math.random() - 0.5) * 0.035;

    // 6. Cliffhanger ending build-up for preview
    let previewModifier = 1.0;
    if (!options.isFullVersion && t > duration - 6.0) {
      // Rising suspense tension
      const cliffT = (t - (duration - 6.0)) / 6.0;
      const riseFreq = 220 + cliffT * 280;
      const rise = Math.sin(twoPi * riseFreq * t) * cliffT * 0.2;
      previewModifier = 1.0 - Math.pow(Math.max(0, (t - (duration - 0.6)) / 0.6), 2); // quick cutoff
      tickLeft += rise * previewModifier;
      tickRight += rise * previewModifier;
    }

    // Mixdown
    let sampleL = (droneLeft + eeriePadLeft + heartbeat + tickLeft + rain) * previewModifier;
    let sampleR = (droneRight + eeriePadRight + heartbeat + tickRight + rain) * previewModifier;

    // Clamp
    sampleL = Math.max(-1.0, Math.min(1.0, sampleL));
    sampleR = Math.max(-1.0, Math.min(1.0, sampleR));

    // Convert to 16-bit PCM (-32768 to 32767)
    buffer.writeInt16LE(Math.floor(sampleL * 32767), offset);
    buffer.writeInt16LE(Math.floor(sampleR * 32767), offset + 2);
    offset += 4;
  }

  return buffer;
}

// CLI generator execution
if (process.argv[1]?.endsWith('generateAudioFiles.ts')) {
  const publicAudioDir = path.resolve(process.cwd(), 'public/audio');
  const serverAudioDir = path.resolve(process.cwd(), 'server-audio');

  if (!fs.existsSync(publicAudioDir)) fs.mkdirSync(publicAudioDir, { recursive: true });
  if (!fs.existsSync(serverAudioDir)) fs.mkdirSync(serverAudioDir, { recursive: true });

  console.log('Generating preview audio (105s)...');
  const previewBuffer = generateAtmosphericWavBuffer({
    durationSeconds: 105,
    sampleRate: 22050,
    isFullVersion: false,
  });
  fs.writeFileSync(path.join(publicAudioDir, 'preview.wav'), previewBuffer);
  console.log('Saved /public/audio/preview.wav (Size: ' + previewBuffer.length + ' bytes)');

  console.log('Generating protected full audio sample (300s demo stream)...');
  const fullBuffer = generateAtmosphericWavBuffer({
    durationSeconds: 180, // High quality demo stream for the protected server
    sampleRate: 22050,
    isFullVersion: true,
  });
  fs.writeFileSync(path.join(serverAudioDir, 'full_story.wav'), fullBuffer);
  console.log('Saved /server-audio/full_story.wav (Size: ' + fullBuffer.length + ' bytes)');
}
