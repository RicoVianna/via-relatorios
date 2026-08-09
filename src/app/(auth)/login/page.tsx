import { login } from './actions';
import Link from 'next/link';
import SplashBoasVindas from '@/components/SplashBoasVindas';
import ThemeToggle from '@/components/ThemeToggle';

export default function LoginPage() {
    return (
        <>
            <SplashBoasVindas />
            <main className="flex min-h-screen flex-col items-center justify-center p-4 relative" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Via Relatórios</h1>
                        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Acesse sua conta para gerar vistorias
                        </p>
                    </div>

                    <form action={login} className="mt-8 space-y-6 p-6 rounded-xl shadow-lg border-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <div className="space-y-4">
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
                                    className="vr-input mt-1 block w-full rounded-lg px-4 py-3 shadow-sm"
                                    placeholder="seu@email.com"
                                    style={{ backgroundColor: 'var(--bg)', border: '2px solid var(--border)', color: 'var(--text)' }}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="vr-input mt-1 block w-full rounded-lg px-4 py-3 shadow-sm"
                                    placeholder="••••••••"
                                    style={{ backgroundColor: 'var(--bg)', border: '2px solid var(--border)', color: 'var(--text)' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="vr-btn-primary w-full rounded-lg px-4 py-3 text-base font-semibold text-white shadow-md"
                            style={{ backgroundColor: 'var(--primary)' }}
                        >
                            Entrar
                        </button>

                        <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <Link href="/cadastro" className="font-semibold" style={{ color: 'var(--primary)' }}>
                                Criar conta em 30 segundos
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}