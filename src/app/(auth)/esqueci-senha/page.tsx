import { recuperarSenha } from './actions';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default async function EsqueciSenhaPage({
    searchParams,
}: {
    searchParams: Promise<{ enviado?: string }>;
}) {
    const { enviado } = await searchParams;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 relative" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Recuperar senha</h1>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Informe seu e-mail e enviaremos um link para você criar uma nova senha.
                    </p>
                </div>

                {enviado && (
                    <div className="p-4 rounded-lg text-sm font-medium border-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981', color: 'var(--text)' }}>
                        Se este e-mail estiver cadastrado, você receberá um link de recuperação em alguns minutos. Verifique também a caixa de spam.
                    </div>
                )}

                <form action={recuperarSenha} className="space-y-6 p-6 rounded-xl shadow-lg border-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold" style={{ color: 'var(--text)' }}>E-mail</label>
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

                    <button type="submit" className="vr-btn-primary w-full rounded-lg px-4 py-3 text-base font-semibold text-white shadow-md" style={{ backgroundColor: 'var(--primary)' }}>
                        Enviar link de recuperação
                    </button>

                    <div className="text-center text-sm">
                        <Link href="/login" className="font-semibold" style={{ color: 'var(--primary)' }}>← Voltar para o login</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}