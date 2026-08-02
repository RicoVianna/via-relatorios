'use server';

import { createClient } from '@/lib/supabase/server';

export async function reabrirVistoria(vistoriaId: string) {
    const supabase = await createClient();

    // 1. Atualiza o status da vistoria
    const { error: updateError } = await supabase
        .from('vistorias')
        .update({ 
            status: 'RASCUNHO',
            reaberto_em: new Date().toISOString()
        })
        .eq('id', vistoriaId);

    if (updateError) {
        console.error('Erro ao reabrir vistoria:', updateError);
        return { success: false, message: 'Erro ao reabrir vistoria.' };
    }

    // 2. Registra no histórico de alterações
    const { error: historyError } = await supabase
        .from('historico_alteracoes')
        .insert({
            vistoria_id: vistoriaId,
            acao: 'REABERTURA',
            ip_usuario: 'capturar_ip_em_breve', // Vamos melhorar isso depois
            data_hora: new Date().toISOString()
        });

    if (historyError) {
        console.error('Erro ao registrar histórico:', historyError);
        // Não falha a operação principal se só o histórico der erro
    }

    return { success: true };
}