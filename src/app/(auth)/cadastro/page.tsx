'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cadastro } from './actions';
import ThemeToggle from '@/components/ThemeToggle';

export default function CadastroPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 relative" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Via Relatórios</h1>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Crie sua conta em 30 segundos
                    </p>
                </div>

                <form action={cadastro} className="mt-8 space-y-6 p-6 rounded-xl shadow-lg border-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                Nome Completo
                            </label>
                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                required
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="vr-input mt-1 block w-full rounded-lg px-4 py-3 shadow-sm"
                                placeholder="João da Silva"
                                style={{ backgroundColor: 'var(--bg)', border: '2px solid var(--border)', color: 'var(--text)' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                E-mail
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="vr-input mt-1 block w-full rounded-lg px-4 py-3 shadow-sm"
                                placeholder="seu@email.com"
                                style={{ backgroundColor: 'var(--bg)', border: '2px solid var(--border)', color: 'var(--text)' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="senha" className="block text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                Senha
                            </label>
                            <input
                                id="senha"
                                name="senha"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="vr-input mt-1 block w-full rounded-lg px-4 py-3 shadow-sm"
                                placeholder="Mínimo 6 caracteres"
                                style={{ backgroundColor: 'var(--bg)', border: '2px solid var(--border)', color: 'var(--text)' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="vr-btn-primary w-full rounded-lg px-4 py-3 text-base font-semibold text-white shadow-md"
                        style={{ backgroundColor: 'var(--primary)' }}
                    >
                        Criar Conta Grátis
                    </button>

                    <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span>Já tem uma conta? </span>
                        <Link href="/login" className="font-semibold" style={{ color: 'var(--primary)' }}>
                            Fazer login
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}