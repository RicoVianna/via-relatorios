'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Mapeia os códigos de erro do Supabase para mensagens claras em português.
// "Invalid login credentials" é intencionalmente genérico (o Supabase não
// revela se o e-mail existe ou não — isso é segurança, não preguiça).
function mensagemDeErro(code: string | undefined): string {
    switch (code) {
        case 'invalid_credentials':
        case 'Invalid login credentials':
            return 'E-mail ou senha incorretos. Confira os dados e tente novamente.';
        case 'email_not_confirmed':
            return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.';
        case 'over_email_send_rate_limit':
        case 'too_many_requests':
            return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
        default:
            return 'Não foi possível entrar. Tente novamente.';
    }
}

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const password = formData.get('password') as string;

    if (!email || !password) {
        redirect('/login?error=campos_vazios');
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        const msg = encodeURIComponent(mensagemDeErro(error.code || error.message));
        redirect(`/login?error=${msg}`);
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}