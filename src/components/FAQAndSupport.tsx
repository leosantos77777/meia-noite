import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Mail,
  ShieldCheck,
  FileText,
  Lock,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const FAQAndSupport: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'policy' | null>(null);

  const faqs = [
    {
      q: 'Como recebo o acesso após a confirmação do pagamento?',
      a: 'A liberação é instantânea. Na mesma hora em que o PIX ou cartão é compensado, você recebe na tela o botão direto de reprodução e o token de acesso também é enviado para o seu e-mail cadastrado.',
    },
    {
      q: 'Posso ouvir pelo celular com a tela bloqueada ou em segundo plano?',
      a: 'Sim. O player web foi desenvolvido para funcionar com a tela bloqueada na maioria dos navegadores modernos (Safari no iOS e Chrome no Android). Além disso, você tem a opção de baixar o arquivo MP3/WAV para ouvir no seu reprodutor de áudio nativo preferido.',
    },
    {
      q: 'É uma assinatura mensal ou pagamento único?',
      a: 'É um pagamento único de R$ 9,90. Não existe mensalidade, renovação automática, nem cobrança surpresa no futuro. Você paga uma única vez e a história fica disponível para você.',
    },
    {
      q: 'Se eu trocar de aparelho celular ou computador, como recupero o acesso?',
      a: 'Muito simples: basta acessar esta página, clicar no botão "Já comprei" no cabeçalho e inserir a chave de acesso enviada para o seu e-mail. Seu player será desbloqueado imediatamente no novo aparelho.',
    },
    {
      q: 'Qual é o gênero, tema e classificação etária do conto?',
      a: 'Classificação indicativa: 14 anos. O gênero é suspense psicológico e mistério. O roteiro constrói a tensão através da atmosfera e da curiosidade pela verdade, sem recursos apelativos, linguagem obscena ou teor sexual explícito.',
    },
    {
      q: 'Posso baixar o áudio para ouvir sem conexão com a internet?',
      a: 'Sim! Junto com a liberação do player online, você recebe o botão para download direto do áudio master estéreo em 320 kbps para guardar onde quiser.',
    },
  ];

  return (
    <section id="duvidas" className="py-16 md:py-24 border-t border-neutral-900 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Perguntas Frequentes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-editorial">
            Dúvidas e Orientações Claras
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-lg mx-auto">
            Sem pegadinhas, sem escassez inventada. Informações transparentes sobre o que você está adquirindo.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 mb-16">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-neutral-900/50 border border-neutral-800/80 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-800/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-neutral-100">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-rose-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/50 font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Suporte & Contato Oficial */}
        <div className="rounded-2xl bg-neutral-900/40 border border-neutral-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-rose-950/40 border border-rose-900/50 flex items-center justify-center shrink-0 text-rose-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-editorial">Atendimento e Suporte</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Precisou reenviar sua chave de acesso ou tirar dúvidas? Fale com a equipe.
              </p>
              <div className="text-xs text-rose-300 font-mono mt-1">
                suporte@depoisdameianoite.com.br
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Resposta em até 24h úteis</span>
            </span>
          </div>
        </div>

        {/* Conformidade e Diretrizes de Anúncios per prompt requirement */}
        <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/90 text-xs text-neutral-400 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-neutral-300 font-semibold">
              Compromisso com Diretrizes e Transparência:
            </strong>{' '}
            Este produto é uma obra autoral ficcional em áudio com narrativa de suspense (classificação 14 anos). Não contém pornografia, imagens sexualizadas, linguagem obscena ou falsas promessas, mantendo estrita conformidade com as políticas éticas de publicidade digital (Meta Ads e Google Ads).
          </p>
        </div>

        {/* Footer Legal Links */}
        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Depois da Meia-Noite. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-neutral-300 transition-colors underline cursor-pointer"
            >
              Termos de Uso
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-neutral-300 transition-colors underline cursor-pointer"
            >
              Política de Privacidade
            </button>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 text-neutral-300 text-xs sm:text-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white font-editorial">
                {activeModal === 'terms' ? 'Termos de Uso' : 'Política de Privacidade'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {activeModal === 'terms' ? (
              <div className="space-y-3 leading-relaxed text-neutral-300">
                <p>
                  <strong>1. Objeto:</strong> O presente termo regula a aquisição do acesso
                  individual ao conto dramatizado em áudio intitulado &ldquo;Depois da Meia-Noite&rdquo;.
                </p>
                <p>
                  <strong>2. Natureza da Transação:</strong> A transação consiste em pagamento único
                  no valor de R$ 9,90, concedendo acesso vitalício sem recorrência ou renovação periódica.
                </p>
                <p>
                  <strong>3. Direitos Autorais:</strong> Todo o conteúdo, áudio, trilha e texto são
                  protegidos por direitos autorais. É proibida a redistribuição comercial ou revenda
                  não autorizada.
                </p>
                <p>
                  <strong>4. Suporte e Garantia:</strong> Em caso de dificuldades técnicas com o
                  player ou recebimento da chave, o usuário conta com suporte direto pelo e-mail
                  suporte@depoisdameianoite.com.br.
                </p>
              </div>
            ) : (
              <div className="space-y-3 leading-relaxed text-neutral-300">
                <p>
                  <strong>1. Coleta de Dados Mínima:</strong> Coletamos apenas o e-mail informado
                  pelo comprador para a finalidade exclusiva de entrega da chave de acesso e
                  comprovante da transação.
                </p>
                <p>
                  <strong>2. Segurança:</strong> Os dados de pagamento são processados através de
                  canais com criptografia TLS de 256 bits e tokenização bancária.
                </p>
                <p>
                  <strong>3. Não Compartilhamento:</strong> Não comercializamos nem compartilhamos
                  seus dados pessoais com terceiros para fins de telemarketing ou spam.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
