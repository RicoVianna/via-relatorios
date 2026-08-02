'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function cadastro(formData: FormData) {
    const supabase = await createClient();

    const nome = formData.get('nome') as string;
    const email = formData.get('email') as string;
    const senha = formData.get('senha') as string;

    console.log('--- INÍCIO DO CADASTRO ---');
    console.log('Tentando criar usuário:', email);

    // 1. Criar a conta no Supabase
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
            data: {
                nome: nome || 'Usuário',
            },
        },
    });

    if (signUpError) {
        console.error('❌ FALHA NO CADASTRO (signUp):', signUpError.message);
        redirect('/cadastro?error=erro_cadastro');
    }

    console.log('✅ Usuário criado com sucesso. Tentando login automático...');

    // 2. Fazer o login AUTOMATICAMENTE
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
    });

    if (signInError) {
        console.error('❌ FALHA NO LOGIN AUTOMÁTICO (signIn):', signInError.message);
        redirect('/cadastro?error=erro_cadastro');
    }

    console.log('✅ Login automático realizado com sucesso! Redirecionando...');
    redirect('/dashboard');
}