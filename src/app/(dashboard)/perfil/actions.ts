'use server';

import { createClient } from '@/lib/supabase/server';

export async function uploadLogo(formData: FormData) {
    const supabase = await createClient();
    const file = formData.get('logo') as File;

    if (!file) {
        return { error: 'Nenhum arquivo enviado.' };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Usuário não autenticado.' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;

    const { error } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
        });

    if (error) {
        return { error: 'Erro ao fazer upload da logo.' };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ logo_url: publicUrl })
        .eq('id', user.id);

    if (updateError) {
        return { error: 'Erro ao salvar a URL da logo.' };
    }

    return { success: true, url: publicUrl };
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Usuário não autenticado.' };
    }

    const nome = formData.get('nome') as string;
    const creci = formData.get('creci') as string;
    const telefone = formData.get('telefone') as string;
    const email = formData.get('email') as string;

    const { error } = await supabase
        .from('profiles')
        .update({
            nome,
            creci,
            telefone,
            email,
        })
        .eq('id', user.id);

    if (error) {
        console.error('Erro ao atualizar perfil:', error);
        return { error: 'Erro ao atualizar o perfil.' };
    }

    return { success: true };
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
}