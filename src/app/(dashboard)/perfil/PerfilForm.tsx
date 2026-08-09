'use client';

import { useState, useTransition, useEffect } from 'react';
import { uploadLogo, updateProfile, logout } from './actions';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

// Formata o telefone enquanto o usuário digita: (00) 00000-0000 ou (00) 0000-0000
function formatarTelefone(valor: string): string {
    const digitos = valor.replace(/\D/g, '').slice(0, 11);
    if (digitos.length === 0) return '';
    if (digitos.length <= 2) return `(${digitos}`;
    if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    if (digitos.length <= 10) {
        return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    }
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export default function PerfilPage({ initialProfile }: { initialProfile: any }) {
    const [isPendingLogo, startTransitionLogo] = useTransition();
    const [isPendingProfile, startTransitionProfile] = useTransition();
    const [logoUrl, setLogoUrl] = useState(initialProfile?.logo_url || null);
    const [logoUrlComCache, setLogoUrlComCache] = useState(initialProfile?.logo_url || null);
    const [telefone, setTelefone] = useState(formatarTelefone(initialProfile?.telefone || ''));
    const [message, setMessage] = useState<{ texto: string; erro: boolean } | null>(null);

        useEffect(() => {
        // Adiciona timestamp APENAS no cliente (evita hydration mismatch)
        if (logoUrl) {
            setLogoUrlComCache(`${logoUrl}?t=${Date.now()}`);
        } else {
            setLogoUrlComCache(null);
        }
    }, [logoUrl]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('logo', e.target.files[0]);

            startTransitionLogo(async () => {
                const result = await uploadLogo(formData);
                if (result.success) {
                    setLogoUrl(result.url);
                    setMessage({ texto: 'Logo atualizada com sucesso!', erro: false });
                } else {
                    setMessage({ texto: result.error || 'Erro ao atualizar logo.', erro: true });
                }
                setTimeout(() => setMessage(null), 3000);
            });
        }
    };

    return (
        <main className="min-h-screen pb-20" style={{ backgroundColor: 'var(--bg)' }}>
            {/* Header */}
            <header className="p-4 shadow-sm flex items-center" style={{ backgroundColor: 'var(--surface)' }}>
                <Link href="/dashboard" className="mr-4 text-sm font-medium" style={{ color: 'var(--primary)' }}>
                    ← Voltar
                </Link>
                <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Meu Perfil</h1>
                <ThemeToggle />
            </header>

            <div className="p-4 space-y-6">
                {message && (
                    <div className={`p-4 rounded-lg text-base font-medium text-center shadow-sm ${message.erro ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {message.texto}
                    </div>
                )}

                {/* Upload de Logo */}
                <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center text-sm overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--accent)' }}>
                        {logoUrl ? (
                            <img src={logoUrlComCache || undefined} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span style={{ color: 'var(--text-secondary)' }}>Sem Logo</span>
                        )}
                    </div>
                    <label className="mt-3 text-sm font-semibold cursor-pointer" style={{ color: 'var(--primary)' }}>
                        {isPendingLogo ? 'Enviando...' : 'Alterar Logo'}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                            disabled={isPendingLogo}
                        />
                    </label>
                </div>

                {/* Formulário de Dados */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        startTransitionProfile(async () => {
                            const resultado = await updateProfile(formData);
                            if (resultado?.error) {
                                setMessage({ texto: resultado.error, erro: true });
                            } else {
                                setMessage({ texto: 'Dados salvos com sucesso!', erro: false });
                            }
                            setTimeout(() => setMessage(null), 3000);
                        });
                    }}
                    className="space-y-4"
                >

                    <div>
                        <label className="block text-sm font-medium" style={{ color: 'var(--text)' }}>Nome Completo</label>
                        <input
                            type="text"
                            name="nome"
                            defaultValue={initialProfile?.nome || ''}
                            required
                            className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none"
                            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium" style={{ color: 'var(--text)' }}>CRECI</label>
                        <input
                            type="text"
                            name="creci"
                            defaultValue={initialProfile?.creci || ''}
                            className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none"
                            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium" style={{ color: 'var(--text)' }}>Telefone</label>
                        <input
                            type="tel"
                            name="telefone"
                            value={telefone}
                            placeholder="(11) 98765-4321"
                            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                            className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none"
                            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium" style={{ color: 'var(--text)' }}>E-mail Profissional</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={initialProfile?.email || ''}
                            required
                            className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none"
                            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPendingProfile}
                        className="w-full rounded-md py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-50 transition-colors"
                        style={{ backgroundColor: 'var(--primary)' }}
                        onMouseOver={(e) => !isPendingProfile && (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')}
                        onMouseOut={(e) => !isPendingProfile && (e.currentTarget.style.backgroundColor = 'var(--primary)')}
                    >
                        {isPendingProfile ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>

                {/* Seção de Plano */}
                <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--accent)' }}>
                    <h2 className="font-semibold" style={{ color: 'var(--primary)' }}>Plano {initialProfile?.plano || 'GRATUITO'}</h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Você usou {initialProfile?.relatorios_usados_mes || 0} de 3 relatórios este mês.
                    </p>
                    <button 
                        className="mt-3 w-full rounded-md py-2 text-sm font-semibold text-white shadow-sm transition-colors"
                        style={{ backgroundColor: 'var(--accent)' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
                    >
                        Fazer Upgrade para Pro (R$ 39,90/mês)
                    </button>
                </div>

                {/* Botão de Logout */}
                <form action={logout} className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <button
                        type="submit"
                        className="w-full rounded-md py-3 text-sm font-semibold text-white shadow-sm transition-colors"
                        style={{ backgroundColor: '#DC2626' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                    >
                        Sair da Conta
                    </button>
                </form>
            </div>
        </main>
    );
}