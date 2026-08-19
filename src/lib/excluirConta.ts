'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function excluirConta(): Promise<{ error?: string } | void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Client com privilégios de admin (ignora RLS — só para exclusão)
    const admin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const userId = user.id;

    // 1. IDs das vistorias do usuário
    const { data: vistorias, error: errV } = await admin
        .from('vistorias')
        .select('id')
        .eq('user_id', userId);

    if (errV) {
        console.error('[excluirConta] Erro ao ler vistorias:', errV);
        return { error: 'Não foi possível ler suas vistorias.' };
    }
    const vistoriaIds = (vistorias ?? []).map((v) => v.id);

    // 2. Armazenamento: logo (caminho ${userId}.ext) e fotos futuras (prefixo ${userId}/)
    const { data: logos } = await admin.storage.from('logos').list('', { limit: 100 });
    const logoPaths = (logos ?? [])
        .filter((f) => f.name.startsWith(`${userId}.`))
        .map((f) => f.name);
    if (logoPaths.length > 0) {
        await admin.storage.from('logos').remove(logoPaths);
    }

    const { data: fotos } = await admin.storage.from('fotos-vistorias').list(userId, { limit: 1000 });
    const fotoPaths = (fotos ?? []).map((f) => `${userId}/${f.name}`);
    if (fotoPaths.length > 0) {
        await admin.storage.from('fotos-vistorias').remove(fotoPaths);
    }

    // 3. Banco: filhos → pais → perfil (usando sintaxe .eq explícita e await separado)
    if (vistoriaIds.length > 0) {
        await admin.from('comodos').in('vistoria_id', vistoriaIds).delete();
        await admin.from('historico_alteracoes').in('vistoria_id', vistoriaIds).delete();
    }

    await admin.from('vistorias').delete().eq('user_id', userId);
    await admin.from('profiles').delete().eq('id', userId);

    // 4. Conta de login (Auth)
    const { error: errUser } = await admin.auth.admin.deleteUser(userId);
    if (errUser) {
        console.error('[excluirConta] Erro ao excluir conta Auth:', errUser);
        return { error: 'Não foi possível excluir a conta. Tente novamente.' };
    }

    // 5. Encerra a sessão e volta para a landing
    await supabase.auth.signOut();
    redirect('/');
}