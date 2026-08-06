import { login } from './actions';
import Link from 'next/link';
import SplashBoasVindas from '@/components/SplashBoasVindas';

export default function LoginPage() {
    return (
        <>
            <SplashBoasVindas />
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-600">ViaRelatórios</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Acesse sua conta para gerar vistorias
                        </p>
                    </div>

                    <form action={login} className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-sm">
                        <div className="space-y-4">
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
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Entrar
                        </button>

                        <div className="text-center text-sm">
                            <Link href="/cadastro" className="font-medium text-blue-600 hover:text-blue-500">
                                Criar conta em 30 segundos
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}