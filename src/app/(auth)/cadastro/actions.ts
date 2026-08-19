'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// Traduz as mensagens do Supabase para português claro.
function mensagemDeErroCadastro(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('already registered')) {
        return 'Este e-mail já está cadastrado. Faça login ou use "Esqueci minha senha".';
    }
    if (m.includes('password') && (m.includes('least') || m.includes('characters'))) {
        return 'A senha precisa ter pelo menos 6 caracteres.';
    }
    if (m.includes('invalid')) {
        return 'Verifique os dados: o e-mail ou a senha estão em formato inválido.';
    }
    if (m.includes('rate limit') || m.includes('too many')) {
        return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
    }
    return 'Não foi possível criar a conta. Tente novamente.';
}

export async function cadastro(formData: FormData) {
    const supabase = await createClient();

    const nome = (formData.get('nome') as string)?.trim();
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const senha = formData.get('senha') as string;

    if (!nome || !email || !senha) {
        redirect('/cadastro?error=' + encodeURIComponent('Preencha todos os campos obrigatórios.'));
    }

    // 1. Criar a conta no Supabase
    const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
            data: { nome },
        },
    });

    if (signUpError) {
        redirect('/cadastro?error=' + encodeURIComponent(mensagemDeErroCadastro(signUpError.message)));
    }

    // 2. Login automático (funciona enquanto a confirmação de e-mail está desligada)
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
    });

    if (signInError) {
        // Quando ativarmos a confirmação de e-mail, cai aqui:
        redirect('/login?error=' + encodeURIComponent('Conta criada! Verifique seu e-mail para confirmar e depois entre.'));
    }

    redirect('/dashboard');
}