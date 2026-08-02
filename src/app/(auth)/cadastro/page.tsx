'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cadastro } from './actions';

export default function CadastroPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-600">ViaRelatórios</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Crie sua conta em 30 segundos
                    </p>
                </div>

                <form action={cadastro} className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                                Nome Completo
                            </label>
                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                required
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="João da Silva"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
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
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Criar Conta Grátis
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-gray-600">Já tem uma conta? </span>
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Fazer login
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}