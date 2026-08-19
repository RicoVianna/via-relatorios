'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { excluirConta } from '@/lib/excluirConta';

export default function ExcluirConta() {
    const [confirmando, setConfirmando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState('');

    async function handleExcluir() {
        setExcluindo(true);
        setErro('');
        const resultado = await excluirConta();
        if (resultado?.error) {
            setErro(resultado.error);
            setExcluindo(false);
            setConfirmando(false);
        }
        // Se sucesso, o redirect('/') acontece e a página muda sozinha
    }

    return (
        <section className="px-4 pb-8 max-w-2xl mx-auto w-full">
            <div className="rounded-xl border-2 p-5" style={{ backgroundColor: 'var(--surface)', borderColor: '#DC2626' }}>
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={20} style={{ color: '#DC2626' }} />
                    <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Zona de perigo</h2>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Excluir sua conta remove permanentemente todas as vistorias, fotos, sua logo e seus dados. Essa ação não pode ser desfeita.
                </p>

                {erro && (
                    <p className="text-sm font-medium mb-3" style={{ color: '#DC2626' }}>{erro}</p>
                )}

                {!confirmando ? (
                    <button
                        type="button"
                        onClick={() => setConfirmando(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-semibold"
                        style={{ borderColor: '#DC2626', color: '#DC2626' }}
                    >
                        <Trash2 size={16} /> Excluir minha conta
                    </button>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                            Tem certeza? Todos os seus dados serão apagados para sempre.
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleExcluir}
                                disabled={excluindo}
                                className="px-4 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-60"
                                style={{ backgroundColor: '#DC2626' }}
                            >
                                {excluindo ? 'Excluindo...' : 'Sim, excluir tudo'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmando(false)}
                                disabled={excluindo}
                                className="px-4 py-2 rounded-lg border-2 text-sm font-semibold"
                                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}