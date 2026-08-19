'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const faq = [
    {
        pergunta: 'Preciso baixar o app na loja de aplicativos?',
        resposta: 'Não. O Via Relatórios é um PWA: você instala direto pelo navegador (Chrome, Safari ou Edge), sem passar pela Play Store ou App Store. Leva menos de 10 segundos.',
    },
    {
        pergunta: 'Funciona no iPhone?',
        resposta: 'Sim! No iPhone, abra o site no Safari, toque no botão Compartilhar e escolha "Adicionar à Tela de Início". O app aparece na sua tela inicial como qualquer outro.',
    },
    {
        pergunta: 'Posso usar no computador também?',
        resposta: 'Sim. No PC, o app instala como uma janela própria (Chrome ou Edge) e seus dados sincronizam entre celular e computador — você começa a vistoria no campo e finaliza no escritório.',
    },
    {
        pergunta: 'Preciso de internet para usar?',
        resposta: 'Você precisa de conexão para salvar e gerar relatórios. Em contrapartida, seus dados ficam guardados com segurança na nuvem e disponíveis em qualquer dispositivo.',
    },
    {
        pergunta: 'O laudo sai com meu CRECI e minha logo?',
        resposta: 'Sim. Seu nome e CRECI vão automaticamente para o cabeçalho do PDF, e você pode adicionar sua logo na tela de Perfil — ela aparece nos seus documentos.',
    },
    {
        pergunta: 'Posso cancelar quando quiser?',
        resposta: 'Sim, sem fidelidade e sem multa. O plano gratuito inclui 3 relatórios por mês — você só assina o Pro quando quiser produzir mais.',
    },
    {
        pergunta: 'Como desinstalo o app, se um dia quiser?',
        resposta: 'Como qualquer outro aplicativo: no PC, vá em Configurações do Windows → Aplicativos → procure "Via Relatórios" → Desinstalar (ou use o menu ⋮ da janela do app). No Android, segure o ícone e toque em "Desinstalar". No iPhone, segure o ícone e escolha "Remover app". Sem travas, sem processos complicados.',
    },
];

export default function LandingFaqFooter() {
    const [aberta, setAberta] = useState<number | null>(0);

    return (
        <>
            {/* ===== FAQ ===== */}
            <section className="px-4 md:px-8 py-16 md:py-24" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="max-w-3xl mx-auto">
                    <p className="text-xs font-bold tracking-widest uppercase text-center mb-3" style={{ color: 'var(--accent)' }}>
                        Dúvidas frequentes
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--text)' }}>
                        Perguntas e respostas
                    </h2>

                    <div className="space-y-3">
                        {faq.map((item, i) => (
                            <div
                                key={item.pergunta}
                                className="rounded-xl border-2 overflow-hidden"
                                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setAberta(aberta === i ? null : i)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold"
                                    style={{ color: 'var(--text)' }}
                                >
                                    {item.pergunta}
                                    <ChevronDown
                                        size={20}
                                        className="shrink-0 transition-transform"
                                        style={{
                                            color: 'var(--accent)',
                                            transform: aberta === i ? 'rotate(180deg)' : 'rotate(0deg)',
                                        }}
                                    />
                                </button>
                                {aberta === i && (
                                    <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {item.resposta}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA FINAL + RODAPÉ ===== */}
            <footer style={{ backgroundColor: '#2C3A2C' }}>
                <div className="px-4 md:px-8 py-16 md:py-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#F6F5F1' }}>
                        Pronto para transformar suas vistorias imobiliárias?
                    </h2>
                    <p className="mb-8 max-w-xl mx-auto" style={{ color: '#A8B0A0' }}>
                        Crie sua conta em menos de 1 minuto e emita seu primeiro laudo hoje mesmo.
                    </p>
                    <Link
                        href="/cadastro"
                        className="inline-block px-8 py-4 rounded-lg text-base font-bold shadow-lg transition-colors"
                        style={{ backgroundColor: '#C2A24B', color: '#1B211B' }}
                    >
                        Criar Minha Conta Gratuita
                    </Link>
                </div>

                <div className="px-4 md:px-8 py-6 border-t" style={{ borderColor: 'rgba(194, 162, 75, 0.3)' }}>
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: '#A8B0A0' }}>
                        <div className="flex items-center gap-4">
                            <Link href="/termos-de-uso" className="hover:underline" style={{ color: '#A8B0A0' }}>Termos de Uso</Link>
                            <Link href="/politica-de-privacidade" className="hover:underline" style={{ color: '#A8B0A0' }}>Política de Privacidade</Link>
                            <span>Suporte</span>
                            <a href="#instalacao" className="font-semibold" style={{ color: '#C2A24B' }}>Instalar App</a>
                        </div>
                        <p>© 2026 Via Relatórios. Feito para corretores de imóveis.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}