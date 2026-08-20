'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function reordenarFotos(comodoId: string, ordemIds: string[]): Promise<{ error?: string } | void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Usuário não autenticado.' };
    }

    const admin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Verificar se o cômodo pertence ao usuário
    const { data: comodo, error: errComodo } = await admin
        .from('comodos')
        .select('id, vistoria_id')
        .eq('id', comodoId)
        .single();

    if (errComodo || !comodo) {
        return { error: 'Cômodo não encontrado.' };
    }

    const { data: vistoria, error: errVistoria } = await admin
        .from('vistorias')
        .select('user_id')
        .eq('id', comodo.vistoria_id)
        .single();

    if (errVistoria || !vistoria || vistoria.user_id !== user.id) {
        return { error: 'Você não tem permissão para reordenar estas fotos.' };
    }

    // 2. Atualizar a ordem de cada foto
    for (let i = 0; i < ordemIds.length; i++) {
        const { error } = await admin
            .from('fotos')
            .update({ ordem: i })
            .eq('id', ordemIds[i])
            .eq('comodo_id', comodoId);

        if (error) {
            console.error('[reordenarFotos] Erro ao atualizar ordem:', error);
            return { error: 'Erro ao reordenar as fotos.' };
        }
    }
}