import React, { useState } from 'react';
import {
  BookOpen,
  Mic,
  Clock,
  ShieldAlert,
  Award,
  Sparkles,
  Edit3,
  Check,
  RotateCcw,
  Film,
} from 'lucide-react';
import { StoryConfig, DEFAULT_STORY_CONFIG } from '../utils/storyLogic.ts';

interface SynopsisProps {
  config: StoryConfig;
  onUpdateConfig: (updated: Partial<StoryConfig>) => void;
}

export const Synopsis: React.FC<SynopsisProps> = ({ config, onUpdateConfig }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [formData, setFormData] = useState<StoryConfig>({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditorOpen(false);
    }, 900);
  };

  const handleResetDefaults = () => {
    setFormData({ ...DEFAULT_STORY_CONFIG });
    onUpdateConfig({ ...DEFAULT_STORY_CONFIG });
  };

  return (
    <section id="sinopse" className="py-16 md:py-24 border-t border-neutral-900 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section kicker & title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
              A Premissa & Universo
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-editorial">
              O que acontece depois da meia-noite?
            </h2>
          </div>

          {/* Prompt requirement: Deixar editáveis os campos do produto */}
          <button
            onClick={() => {
              setFormData({ ...config });
              setIsEditorOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors shrink-0 self-start md:self-auto cursor-pointer"
            aria-label="Abrir editor de dados do produto"
          >
            <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
            <span>Editar Ficha Técnica</span>
          </button>
        </div>

        {/* 2-Column Split: Atmospheric Visual & Editorial Synopsis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Left Column: Atmospheric Mood Photography */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950 flex flex-col justify-end min-h-[340px]">
            <img
              src="/src/assets/images/synopsis_ambient_mood_1793395578209.jpg"
              alt="Microfone de condensador em estúdio de gravação para o áudio Depois da Meia-Noite"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-[#08080b]/60 to-transparent" />

            <div className="relative p-6 z-10">
              {/* Clean unboxed metadata with dot separators */}
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                <span>{config.genre}</span>
                <span aria-hidden="true">·</span>
                <span>Áudio Original</span>
                <span aria-hidden="true">·</span>
                <span>{config.durationMinutes} min</span>
              </div>
              <h3 className="text-lg font-bold text-white font-editorial">{config.title}</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Texto de {config.author} · Narração por {config.narrator}
              </p>
            </div>
          </div>

          {/* Right Column: Literary Synopsis & Premise */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                <span>Sinopse Oficial</span>
              </div>
              <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-light mb-6">
                {config.synopsis}
              </p>
              <div className="border-t border-neutral-800/80 pt-4">
                <p className="text-xs text-neutral-400 leading-normal">
                  Construído exclusivamente para o formato sonoro: a ambientação, os passos na
                  calçada molhada e a respiração contida foram mixados para criar a sensação de que
                  cada acontecimento se desenrola a centímetros de você.
                </p>
              </div>
            </div>

            {/* Quiet metadata strip with unboxed typography */}
            <div className="mt-6 pt-4 border-t border-neutral-800/60 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-400">
              <span className="text-neutral-300 font-medium">{config.ageRating}</span>
              <span aria-hidden="true">·</span>
              <span>{config.ageRatingDescription}</span>
            </div>
          </div>
        </div>

        {/* Ficha Técnica Detalhada */}
        <div id="ficha-tecnica" className="scroll-mt-24">
          <h3 className="text-lg font-bold text-white mb-6 font-editorial">
            Ficha Técnica & Condições de Acesso
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80">
              <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-neutral-500" />
                <span>Gênero Real</span>
              </div>
              <div className="text-sm font-semibold text-neutral-100">{config.genre}</div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Suspense psicológico maduro, sem apelação.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80">
              <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-neutral-500" />
                <span>Voz & Narração</span>
              </div>
              <div className="text-sm font-semibold text-neutral-100">{config.narrator}</div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Gravação em estúdio com tratamento acústico.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80">
              <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Duração Completa</span>
              </div>
              <div className="text-sm font-semibold text-neutral-100 tabular-nums">
                {config.durationMinutes} minutos
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                História completa do início ao desfecho.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80">
              <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-neutral-500" />
                <span>Acesso & Prazo</span>
              </div>
              <div className="text-sm font-semibold text-neutral-100">Vitalício e Imediato</div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Sem assinaturas ou cobranças recorrentes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Modal per Prompt Requirement: Deixar editáveis */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-editorial">
                  Personalizar Dados do Conto
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Conforme solicitado: todos os campos do produto podem ser ajustados livremente.
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-neutral-400 hover:text-white p-1 text-sm rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                  Nome do Conto
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-rose-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                    Gênero Real
                  </label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-rose-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                    Narrador
                  </label>
                  <input
                    type="text"
                    value={formData.narrator}
                    onChange={(e) => setFormData({ ...formData, narrator: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-rose-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                  Sinopse Oficial
                </label>
                <textarea
                  rows={4}
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-rose-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.durationMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, durationMinutes: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-rose-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                    Classificação Etária
                  </label>
                  <input
                    type="text"
                    value={formData.ageRating}
                    onChange={(e) => setFormData({ ...formData, ageRating: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-rose-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 9.9 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-rose-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                  Link Oficial do Checkout
                </label>
                <input
                  type="url"
                  value={formData.checkoutUrl}
                  onChange={(e) => setFormData({ ...formData, checkoutUrl: e.target.value })}
                  placeholder="https://ggcheckout.app/checkout/..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-rose-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                  Condições e Prazo de Acesso
                </label>
                <textarea
                  rows={2}
                  value={formData.accessTerms}
                  onChange={(e) => setFormData({ ...formData, accessTerms: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:border-rose-600 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrões</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 text-xs text-neutral-300 hover:text-white rounded cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Salvo!</span>
                      </>
                    ) : (
                      <span>Aplicar Alterações</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
