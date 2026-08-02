'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function adicionarComodo(formData: FormData) {
    const supabase = await createClient();

    // 1. Verificar autenticação
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Não autorizado');
    }

    // 2. Pegar os dados do formulário
    const vistoriaId = formData.get('vistoria_id') as string;
    const nomeComodo = formData.get('nome_comodo') as string;
    const descricaoBruta = formData.get('descricao_bruta') as string;

    // 3. Validar dados
    if (!vistoriaId || !nomeComodo) {
        throw new Error('Dados inválidos');
    }

    // 4. Salvar no banco de dados
    const { error } = await supabase
        .from('comodos')
        .insert({
            vistoria_id: vistoriaId,
            nome_comodo: nomeComodo,
            descricao_bruta: descricaoBruta || '',
            ordem: 0 // Por enquanto, ordem fixa
        });

    if (error) {
        console.error('Erro ao adicionar cômodo:', error);
        throw new Error('Não foi possível salvar o cômodo. Tente novamente.');
    }

    // 5. Revalidar a página para mostrar o novo cômodo
    revalidatePath(`/vistoria/${vistoriaId}`);
}

export async function finalizarVistoria(vistoriaId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('vistorias')
        .update({ status: 'FINALIZADO' })
        .eq('id', vistoriaId);

    if (error) {
        console.error('Erro ao finalizar vistoria:', error);
        throw new Error('Não foi possível finalizar a vistoria.');
    }

    revalidatePath(`/vistoria/${vistoriaId}`);
    revalidatePath('/dashboard'); // Atualiza o dashboard para mover o card
    redirect('/dashboard');
}