'use client';

import { useState, useTransition } from 'react';
import { uploadLogo, updateProfile } from './actions';
import Link from 'next/link';

export default function PerfilPage({ initialProfile }: { initialProfile: any }) {
    const [isPendingLogo, startTransitionLogo] = useTransition();
    const [isPendingProfile, startTransitionProfile] = useTransition();
    const [logoUrl, setLogoUrl] = useState(initialProfile?.logo_url || null);
    const [message, setMessage] = useState('');

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('logo', e.target.files[0]);

            startTransitionLogo(async () => {
                const result = await uploadLogo(formData);
                if (result.success) {
                    setLogoUrl(result.url);
                    setMessage('Logo atualizada com sucesso!');
                } else {
                    setMessage(result.error || 'Erro ao atualizar logo.');
                }
                setTimeout(() => setMessage(''), 3000);
            });
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex items-center">
                <Link href="/dashboard" className="text-gray-600 mr-4">
                    ← Voltar
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Meu Perfil</h1>
            </header>

            <div className="p-4 space-y-6">
                {message && (
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm text-center">
                        {message}
                    </div>
                )}

                {/* Upload de Logo */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm overflow-hidden border-2 border-white shadow-md">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span>Sem Logo</span>
                        )}
                    </div>
                    <label className="mt-3 text-sm font-medium text-blue-600 cursor-pointer">
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
                <form action={updateProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input
                            type="text"
                            name="nome_completo"
                            defaultValue={initialProfile?.nome_completo || ''}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">CRECI</label>
                        <input
                            type="text"
                            name="creci"
                            defaultValue={initialProfile?.creci || ''}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Telefone</label>
                        <input
                            type="tel"
                            name="telefone"
                            defaultValue={initialProfile?.telefone || ''}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">E-mail Profissional</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={initialProfile?.email || ''}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPendingProfile}
                        className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                    >
                        {isPendingProfile ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>

                {/* Seção de Plano */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h2 className="font-semibold text-yellow-800">Plano {initialProfile?.plano || 'GRATUITO'}</h2>
                    <p className="text-sm text-yellow-700 mt-1">
                        Você usou {initialProfile?.relatorios_usados_mes || 0} de 3 relatórios este mês.
                    </p>
                    <button className="mt-3 w-full rounded-md bg-yellow-500 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-600">
                        Fazer Upgrade para Pro (R$ 39,90/mês)
                    </button>
                </div>
            </div>
        </main>
    );
}