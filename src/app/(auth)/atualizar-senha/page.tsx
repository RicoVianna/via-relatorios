import FormNovaSenha from '@/components/auth/FormNovaSenha';
import ThemeToggle from '@/components/ThemeToggle';

export default function AtualizarSenhaPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 relative" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Definir nova senha</h1>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Crie uma nova senha para a sua conta.
                    </p>
                </div>

                <div className="p-6 rounded-xl shadow-lg border-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <FormNovaSenha />
                </div>
            </div>
        </main>
    );
}