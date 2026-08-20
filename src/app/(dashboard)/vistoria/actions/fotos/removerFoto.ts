'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function removerFoto(fotoId: string): Promise<{ error?: string } | void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Usuário não autenticado.' };
    }

    const admin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Buscar a foto e verificar se pertence ao usuário
    const { data: foto, error: errFoto } = await admin
        .from('fotos')
        .select('id, user_id, caminho_storage')
        .eq('id', fotoId)
        .single();

    if (errFoto || !foto || foto.user_id !== user.id) {
        return { error: 'Foto não encontrada ou não pertence a você.' };
    }

    // 2. Remover do storage
    const { error: errStorage } = await admin.storage.from('fotos-vistorias').remove([foto.caminho_storage]);

    if (errStorage) {
        console.error('[removerFoto] Erro no storage:', errStorage);
        return { error: 'Erro ao remover a foto do armazenamento.' };
    }

    // 3. Remover do banco
    const { error: errDelete } = await admin.from('fotos').delete().eq('id', fotoId);

    if (errDelete) {
        console.error('[removerFoto] Erro ao deletar do banco:', errDelete);
        return { error: 'Erro ao remover a foto do banco.' };
    }
}