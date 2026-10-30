import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Download,
  AlertCircle,
  Radio,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import { formatDuration, StoryConfig, formatPrice, isPlaybackAllowed } from '../utils/storyLogic.ts';

interface AudioPlayerProps {
  config: StoryConfig;
  isUnlocked: boolean;
  accessToken: string | null;
  onOpenCheckout: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  config,
  isUnlocked,
  accessToken,
  onOpenCheckout,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(config.fullDurationSeconds);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [showLockedAlert, setShowLockedAlert] = useState<boolean>(false);

  // Audio source URL: Only loaded when unlocked with valid token!
  const audioSrc = isUnlocked && accessToken
    ? `/api/audio/full?token=${encodeURIComponent(accessToken)}`
    : '';

  // Synchronize audio settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  // Handle source switch when unlocked
  useEffect(() => {
    if (audioRef.current && isUnlocked && accessToken) {
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isUnlocked, accessToken]);

  // Audio Event Handlers
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const audioDuration = audioRef.current.duration;
    if (audioDuration && !isNaN(audioDuration) && isFinite(audioDuration)) {
      setDuration(audioDuration);
    }
    setAudioError(null);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handlePlayClick = async () => {
    // STRICT ENFORCEMENT: Zero audio is released without paying!
    if (!isPlaybackAllowed(isUnlocked)) {
      setShowLockedAlert(true);
      onOpenCheckout();
      return;
    }

    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsBuffering(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setIsBuffering(false);
        setAudioError(null);
      }
    } catch (err: unknown) {
      console.error('Audio playback error:', err);
      setIsPlaying(false);
      setIsBuffering(false);
      setAudioError('Erro ao iniciar áudio. Toque no play novamente.');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isUnlocked) {
      onOpenCheckout();
      return;
    }
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleReplay = () => {
    if (!isUnlocked) {
      onOpenCheckout();
      return;
    }
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const cyclePlaybackRate = () => {
    if (!isUnlocked) {
      onOpenCheckout();
      return;
    }
    const rates = [1.0, 1.25, 1.5];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  // Canvas Waveform Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const barCount = 48;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);
        let barHeight = 6;

        if (isPlaying && isUnlocked) {
          const wave1 = Math.sin(phase + i * 0.22);
          const wave2 = Math.cos(phase * 1.4 + i * 0.15);
          const normalized = Math.abs(wave1 * 0.6 + wave2 * 0.4);
          barHeight = 8 + normalized * (height - 18);
        } else if (!isUnlocked) {
          // Locked wave: subtle pulsing locked cadence
          barHeight = 5 + Math.sin(phase * 0.5 + i * 0.2) * 2;
        } else {
          barHeight = 6 + Math.sin(i * 0.3) * 3;
        }

        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying && isUnlocked) {
          gradient.addColorStop(0, '#f43f5e');
          gradient.addColorStop(0.5, '#be123c');
          gradient.addColorStop(1, '#881337');
        } else if (!isUnlocked) {
          // Locked crimson dark amber
          gradient.addColorStop(0, '#991b1b');
          gradient.addColorStop(1, '#450a0a');
        } else {
          gradient.addColorStop(0, '#3f3f46');
          gradient.addColorStop(1, '#27272a');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += (isPlaying ? 0.08 : 0.02) * playbackRate;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isUnlocked, playbackRate]);

  return (
    <section id="player-section" className="py-12 md:py-20 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
            <Radio className="w-3.5 h-3.5 text-red-500" />
            <span>{isUnlocked ? 'Áudio Master Desbloqueado' : 'Acesso Restrito ao Conteúdo'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-editorial">
            {isUnlocked ? 'Aproveite a história completa' : 'Ouça a história completa'}
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-md mx-auto">
            {isUnlocked
              ? 'Áudio master em alta definição liberado com sucesso.'
              : 'Nenhum áudio é liberado sem pagamento. Desbloqueie o acesso por R$ 9,90.'}
          </p>
        </div>

        {/* Player Container */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#14080c] via-[#0f090d] to-[#0a0709] border-2 border-red-900/60 shadow-2xl p-6 sm:p-8 overflow-hidden backdrop-blur-xl">
          {/* Subtle wine atmospheric glow behind player */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 bg-red-900/25 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-950/30 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Hidden native audio tag (only receives src when unlocked) */}
          {isUnlocked && (
            <audio
              ref={audioRef}
              src={audioSrc}
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onError={() => {
                setAudioError('Erro ao carregar o arquivo de áudio master.');
                setIsBuffering(false);
                setIsPlaying(false);
              }}
            />
          )}

          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* Cover Art with lock indicator */}
            <div
              onClick={!isUnlocked ? onOpenCheckout : undefined}
              className={`relative shrink-0 w-44 sm:w-52 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-red-900/50 group ${
                !isUnlocked ? 'cursor-pointer' : ''
              }`}
            >
              <img
                src="/src/assets/images/cover_depois_da_meia_noite_1793395578326.jpg"
                alt="Capa oficial do conto em áudio Depois da Meia-Noite"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isUnlocked ? 'group-hover:scale-105' : 'filter brightness-90 group-hover:scale-105'
                }`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center">
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold text-emerald-300 bg-black/85 border border-emerald-500/50 backdrop-blur-md">
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    Completo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black text-white bg-red-600 border border-red-400 shadow-md backdrop-blur-md animate-pulse">
                    <Lock className="w-3.5 h-3.5 text-white" />
                    R$ 9,90 BLOQUEADO
                  </span>
                )}
              </div>

              {/* Cover text */}
              <div className="absolute bottom-3 left-3 right-3 text-left pointer-events-none">
                <p className="text-[10px] uppercase tracking-wider text-rose-300 font-semibold">
                  {isUnlocked ? 'Narração Original' : 'Áudio Completo Protegido'}
                </p>
                <p className="text-xs font-bold text-white truncate">Artur Ferreira</p>
              </div>
            </div>

            {/* Player Controls & Visualizer */}
            <div className="flex-1 w-full flex flex-col justify-between">
              {/* Story Title & Meta */}
              <div className="text-left mb-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-rose-400 tracking-wider uppercase">
                    {config.genre}
                  </span>
                  <span className="text-xs font-bold text-red-400 tabular-nums">
                    {isUnlocked ? 'Áudio Master · 42:00' : 'Acesso Restrito · R$ 9,90'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-editorial">
                  {config.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 line-clamp-2">
                  {config.synopsis}
                </p>
              </div>

              {/* Canvas Sound Waveform Visualizer */}
              <div
                onClick={!isUnlocked ? onOpenCheckout : undefined}
                className={`my-3 py-2 px-3 rounded-lg bg-black/50 border border-red-950/70 relative ${
                  !isUnlocked ? 'cursor-pointer' : ''
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-[1px] gap-2">
                    <Lock className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-300">
                      Áudio bloqueado · Toque para liberar por R$ 9,90
                    </span>
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={54}
                  className="w-full h-14 block"
                  aria-label="Visualizador de ondas sonoras"
                />
              </div>

              {/* Timeline Scrub Bar */}
              <div className="space-y-1.5 my-2">
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={duration || 2520}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    disabled={!isUnlocked}
                    className={`w-full h-2 rounded-lg appearance-none focus:outline-none ${
                      isUnlocked
                        ? 'bg-neutral-800 cursor-pointer accent-red-600'
                        : 'bg-neutral-900 cursor-not-allowed opacity-50'
                    }`}
                    aria-label="Barra de progresso do áudio"
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-neutral-400 tabular-nums font-semibold">
                  <span>{formatDuration(currentTime)}</span>
                  <span className="text-rose-400 text-[11px] font-bold">
                    {isUnlocked ? 'Duração Total Master' : 'Requer Pagamento de R$ 9,90'}
                  </span>
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>

              {/* Main Playback Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 gap-2">
                {/* Secondary controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReplay}
                    disabled={!isUnlocked}
                    className="p-2 text-neutral-500 hover:text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                    title="Reiniciar do início"
                    aria-label="Reiniciar áudio"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={cyclePlaybackRate}
                    disabled={!isUnlocked}
                    className="px-2.5 py-1 text-xs font-bold text-neutral-400 hover:text-white bg-neutral-900 rounded border border-neutral-800 transition-colors tabular-nums cursor-pointer disabled:opacity-40"
                    title="Velocidade"
                    aria-label="Velocidade de reprodução"
                  >
                    {playbackRate}x
                  </button>
                </div>

                {/* Primary Play Button (With attention-grabbing Red Glow & Lock when unpaid) */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayClick}
                    className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-600 hover:from-red-600 hover:to-rose-500 active:scale-95 text-white shadow-2xl shadow-red-950 transition-all transform hover:scale-105 cursor-pointer"
                    aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio (Requer pagamento)'}
                  >
                    {/* Glowing ring */}
                    <div
                      className="absolute -inset-1 rounded-full bg-red-500/40 blur-md animate-pulse pointer-events-none"
                      aria-hidden="true"
                    />

                    {isBuffering ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isUnlocked ? (
                      isPlaying ? (
                        <Pause className="w-7 h-7 fill-current relative z-10" />
                      ) : (
                        <Play className="w-7 h-7 fill-current ml-0.5 relative z-10" />
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center relative z-10">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    disabled={!isUnlocked}
                    className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                    aria-label={isMuted ? 'Ativar som' : 'Silenciar som'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    disabled={!isUnlocked}
                    className="w-16 sm:w-20 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-300 hidden sm:block disabled:opacity-40"
                    aria-label="Controle de volume"
                  />
                </div>
              </div>

              {/* Error Notice */}
              {audioError && (
                <div className="mt-3 p-2.5 rounded-lg bg-rose-950/50 border border-rose-900/60 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{audioError}</span>
                </div>
              )}
            </div>
          </div>

          {/* O PREÇO SALTA NA TELA: Bloco de Bloqueio Chamativo quando NÃO pago */}
          {!isUnlocked && (
            <div className="mt-6 pt-6 border-t-2 border-red-600/50 bg-gradient-to-r from-red-950/70 via-neutral-900 to-red-950/70 p-6 rounded-2xl text-center shadow-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/50 text-xs font-bold text-red-300 uppercase tracking-wider mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Nenhum áudio é liberado sem o pagamento</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight font-editorial mb-1">
                Desbloqueie o Áudio Completo Agora
              </h4>
              <p className="text-sm text-neutral-300 mb-4 max-w-lg mx-auto">
                Tenha acesso imediato à história narrada na íntegra em alta fidelidade estéreo por um valor único.
              </p>

              {/* Price Jump on Player */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-sm font-semibold text-neutral-400 uppercase">Por apenas:</span>
                <span className="text-3xl sm:text-4xl font-black text-red-400 font-editorial drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                  R$ 9,90
                </span>
                <span className="text-xs text-neutral-400">(Pagamento Único)</span>
              </div>

              <button
                onClick={onOpenCheckout}
                className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base font-black tracking-wide text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-red-500 rounded-xl shadow-xl shadow-red-950 transition-all transform hover:scale-105 cursor-pointer"
              >
                DESBLOQUEAR POR R$ 9,90
              </button>
            </div>
          )}

          {/* Unlocked banner */}
          {isUnlocked && (
            <div className="mt-6 pt-4 border-t border-emerald-900/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Unlock className="w-4 h-4" />
                Acesso vitalício confirmado · Áudio Completo Liberado
              </span>
              <a
                href={audioSrc}
                download="Depois_da_Meia_Noite_Audio_Completo.wav"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar áudio para ouvir offline</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
