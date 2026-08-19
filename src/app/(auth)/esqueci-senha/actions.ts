'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function recuperarSenha(formData: FormData) {
    const supabase = await createClient();
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const origin = (await headers()).get('origin') || 'http://localhost:3000';

    if (email) {
        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/atualizar-senha`,
        });
    }

    // Sempre a mesma resposta (não revela se o e-mail existe — segurança)
    redirect('/esqueci-senha?enviado=1');
}