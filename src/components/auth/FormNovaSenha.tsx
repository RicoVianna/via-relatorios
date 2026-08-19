'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import InputSenha from '@/components/auth/InputSenha';

export default function FormNovaSenha() {
    const router = useRouter();
    const [erro, setErro] = useState('');
    const [salvo, setSalvo] = useState(false);
    const [pronto, setPronto] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        // O link de recuperação chega com tokens na URL; o cliente detecta
        // e dispara o evento PASSWORD_RECOVERY.
        const { data } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
                setPronto(true);
            }
        });

        supabase.auth.getSession().then(({ data: sess }) => {
            if (sess.session) setPronto(true);
        });

        return () => data.subscription.unsubscribe();
    }, []);

    async function handleSubmit(formData: FormData) {
        setErro('');
        const senha = formData.get('senha') as string;
        const confirmacao = formData.get('confirmacao') as string;

        if (senha.length < 6) {
            setErro('A senha precisa ter pelo menos 6 caracteres.');
            return;
        }
        if (senha !== confirmacao) {
            setErro('As senhas não coincidem.');
            return;
        }

        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password: senha });

        if (error) {
            setErro('Não foi possível alterar a senha. O link pode ter expirado — solicite um novo.');
            return;
        }

        setSalvo(true);
        setTimeout(() => router.push('/dashboard'), 1500);
    }

    if (salvo) {
        return (
            <div className="p-4 rounded-lg text-sm font-medium border-2 text-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981', color: 'var(--text)' }}>
                Senha atualizada com sucesso! Entrando no app...
            </div>
        );
    }

    if (!pronto) {
        return (
            <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                Validando link de recuperação...
            </p>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            {erro && (
                <div className="p-4 rounded-lg text-sm font-medium border-2" style={{ backgroundColor: '#FEE2E2', borderColor: '#FCA5A5', color: '#991B1B' }}>
                    {erro}
                </div>
            )}
            <div>
                <label htmlFor="senha" className="block text-sm font-semibold" style={{ color: 'var(--text)' }}>Nova senha</label>
                <InputSenha id="senha" name="senha" autoComplete="new-password" required placeholder="Mínimo 6 caracteres" />
            </div>
            <div>
                <label htmlFor="confirmacao" className="block text-sm font-semibold" style={{ color: 'var(--text)' }}>Confirmar nova senha</label>
                <InputSenha id="confirmacao" name="confirmacao" autoComplete="new-password" required placeholder="Repita a senha" />
            </div>
            <button type="submit" className="vr-btn-primary w-full rounded-lg px-4 py-3 text-base font-semibold text-white shadow-md" style={{ backgroundColor: 'var(--primary)' }}>
                Salvar nova senha
            </button>
        </form>
    );
}