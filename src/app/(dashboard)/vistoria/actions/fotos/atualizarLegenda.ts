'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function atualizarLegenda(fotoId: string, legenda: string): Promise<{ error?: string } | void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Usuário não autenticado.' };
    }

    const admin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Verificar se a foto pertence ao usuário
    const { data: foto, error: errFoto } = await admin
        .from('fotos')
        .select('id, user_id')
        .eq('id', fotoId)
        .single();

    if (errFoto || !foto || foto.user_id !== user.id) {
        return { error: 'Foto não encontrada ou não pertence a você.' };
    }

    // 2. Atualizar a legenda
    const { error: errUpdate } = await admin
        .from('fotos')
        .update({ legenda })
        .eq('id', fotoId);

    if (errUpdate) {
        console.error('[atualizarLegenda] Erro ao atualizar:', errUpdate);
        return { error: 'Erro ao atualizar a legenda.' };
    }
}