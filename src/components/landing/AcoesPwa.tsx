'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Share2, X, Smartphone, Apple, Monitor } from 'lucide-react';

export default function AcoesPwa() {
    const [eventoInstalacao, setEventoInstalacao] = useState<any>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [linkCopiado, setLinkCopiado] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setEventoInstalacao(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    function instalar() {
        if (eventoInstalacao) {
            eventoInstalacao.prompt();
            setEventoInstalacao(null);
        } else {
            setModalAberto(true);
        }
    }

    async function compartilhar() {
        const dados = {
            title: 'Via Relatórios',
            text: 'Gere laudos de vistoria imobiliária em PDF direto do celular. Teste grátis!',
            url: window.location.origin,
        };
        if (navigator.share) {
            try {
                await navigator.share(dados);
            } catch {
                // usuário cancelou o compartilhamento
            }
        } else {
            try {
                await navigator.clipboard.writeText(dados.url);
                setLinkCopiado(true);
                setTimeout(() => setLinkCopiado(false), 2500);
            } catch {
                // sem permissão de clipboard
            }
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={compartilhar}
                title="Compartilhar o Via Relatórios"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
                <Share2 size={18} />
            </button>

            <button
                type="button"
                onClick={instalar}
                className="vr-btn-accent h-10 px-3 md:px-4 rounded-full flex items-center gap-2 text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--accent)' }}
            >
                <Download size={16} />
                <span className="hidden md:inline">Instalar App</span>
            </button>

            {linkCopiado && createPortal(
                <div
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                    style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF' }}
                >
                    Link copiado!
                </div>,
                document.body
            )}

            {modalAberto && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                    onClick={() => setModalAberto(false)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl p-6 shadow-2xl border-2"
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--accent)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Como instalar o app</h3>
                            <button type="button" onClick={() => setModalAberto(false)} style={{ color: 'var(--text-secondary)' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4 text-sm" style={{ color: 'var(--text)' }}>
                            <div className="flex gap-3">
                                <Smartphone size={20} className="shrink-0" style={{ color: 'var(--accent)' }} />
                                <p><strong>Android:</strong> abra no Chrome → toque nos três pontos → "Instalar aplicativo".</p>
                            </div>
                            <div className="flex gap-3">
                                <Apple size={20} className="shrink-0" style={{ color: 'var(--accent)' }} />
                                <p><strong>iPhone:</strong> abra no Safari → toque em Compartilhar → "Adicionar à Tela de Início".</p>
                            </div>
                            <div className="flex gap-3">
                                <Monitor size={20} className="shrink-0" style={{ color: 'var(--accent)' }} />
                                <p><strong>Computador:</strong> abra no Chrome ou Edge → clique no ícone de instalar na barra de endereço → "Instalar".</p>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}