'use client';

import { useState, useTransition } from 'react';
import { enviarLaudoPorEmail } from './enviarLaudoEmail';

export default function BotaoEnviarEmail({ vistoriaId }: { vistoriaId: string }) {
    const [aberto, setAberto] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);

    function handleSubmit(formData: FormData) {
        setErro('');
        startTransition(async () => {
            const resultado = await enviarLaudoPorEmail(formData);
            if (resultado?.error) {
                setErro(resultado.error);
            } else {
                setSucesso(true);
                setTimeout(() => {
                    setAberto(false);
                    setSucesso(false);
                }, 2500);
            }
        });
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setAberto(true)}
                className="relative z-50 px-5 py-3 rounded-lg font-semibold text-base transition-colors text-center border-2 flex items-center justify-center gap-2 cursor-pointer bg-amber-600 hover:bg-amber-700 text-white border-amber-700 shadow-md"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Enviar por E-mail
            </button>

            {aberto && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="w-full max-w-md rounded-xl border-2 p-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Enviar Laudo por E-mail</h3>
                            <button type="button" onClick={() => setAberto(false)} className="text-2xl leading-none" style={{ color: 'var(--text-secondary)' }}>
                                &times;
                            </button>
                        </div>

                        {sucesso ? (
                            <p className="text-sm font-semibold p-3 rounded-lg" style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                                ✓ Laudo enviado com sucesso!
                            </p>
                        ) : (
                            <form action={handleSubmit} className="space-y-4">
                                <input type="hidden" name="vistoria_id" value={vistoriaId} />
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                        E-mail do destinatário *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="cliente@email.com"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', borderColor: 'var(--border)' }}
                                    />
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                                        No plano gratuito do Resend, envie para o e-mail da sua conta Resend.
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                        Mensagem (opcional)
                                    </label>
                                    <textarea
                                        name="mensagem"
                                        rows={3}
                                        placeholder="Ex.: Segue o laudo da vistoria realizada. Qualquer dúvida, estou à disposição."
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', borderColor: 'var(--border)' }}
                                    />
                                </div>

                                {erro && (
                                    <p className="text-sm font-medium p-3 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#F87171' }}>
                                        {erro}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full py-3 rounded-lg font-semibold text-white disabled:opacity-50"
                                    style={{ backgroundColor: 'var(--primary)' }}
                                >
                                    {isPending ? 'Gerando PDF e enviando...' : 'Enviar com PDF em anexo'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}