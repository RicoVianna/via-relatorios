'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function uploadFoto(
    formData: FormData
): Promise<{ error?: string; url?: string } | void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Usuário não autenticado.' };
    }

    const comodoId = formData.get('comodo_id') as string;
    const vistoriaId = formData.get('vistoria_id') as string;
    const file = formData.get('foto') as File;

    if (!comodoId || !vistoriaId || !file) {
        return { error: 'Dados incompletos.' };
    }

    const admin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: comodo, error: errComodo } = await admin
        .from('comodos')
        .select('id, vistoria_id')
        .eq('id', comodoId)
        .single();

    if (errComodo || !comodo || comodo.vistoria_id !== vistoriaId) {
        return { error: 'Cômodo não encontrado ou não pertence a esta vistoria.' };
    }

    const { data: vistoria, error: errVistoria } = await admin
        .from('vistorias')
        .select('user_id, status')
        .eq('id', vistoriaId)
        .single();

    if (errVistoria || !vistoria || vistoria.user_id !== user.id) {
        return { error: 'Vistoria não encontrada ou não pertence a você.' };
    }

    if (vistoria.status === 'FINALIZADO') {
        return { error: 'Vistoria finalizada. Não é possível adicionar fotos.' };
    }

    const { data: fotos } = await admin
        .from('fotos')
        .select('id')
        .eq('comodo_id', comodoId);

    if ((fotos ?? []).length >= 3) {
        return { error: 'Limite de 3 fotos por cômodo atingido. Faça upgrade para o plano Pro.' };
    }

    const fileName = `${user.id}/${vistoriaId}/${comodoId}/${Date.now()}-${file.name}`;
    const { error: errUpload } = await admin.storage.from('fotos-vistorias').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
    });

    if (errUpload) {
        console.error('[uploadFoto] Erro no storage:', errUpload);
        return { error: 'Erro ao fazer upload da foto.' };
    }

    const { data: { publicUrl } } = admin.storage.from('fotos-vistorias').getPublicUrl(fileName);

    const { data: foto, error: errInsert } = await admin
        .from('fotos')
        .insert({
            comodo_id: comodoId,
            vistoria_id: vistoriaId,
            user_id: user.id,
            caminho_storage: fileName,
            url: publicUrl,
            ordem: (fotos ?? []).length,
        })
        .select()
        .single();

    if (errInsert) {
        console.error('[uploadFoto] Erro ao inserir no banco:', errInsert);
        await admin.storage.from('fotos-vistorias').remove([fileName]);
        return { error: 'Erro ao salvar a foto no banco.' };
    }

    return { url: publicUrl };
}