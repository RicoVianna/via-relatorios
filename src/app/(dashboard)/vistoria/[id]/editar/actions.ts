'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function atualizarDetalhesVistoria(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const id = formData.get('id') as string;
    const tipo = formData.get('tipo') as string;
    const nome_cliente = formData.get('nome_cliente') as string;
    const nome_locatario = formData.get('nome_locatario') as string;
    const data_vistoria = formData.get('data_vistoria') as string;
    
    const endereco_cep = formData.get('endereco_cep') as string;
    const endereco_rua = formData.get('endereco_rua') as string;
    const endereco_bairro = formData.get('endereco_bairro') as string;
    const endereco_cidade = formData.get('endereco_cidade') as string;
    const endereco_numero = formData.get('endereco_numero') as string;
    const endereco_complemento = formData.get('endereco_complemento') as string;

    const { error } = await supabase
        .from('vistorias')
        .update({
            tipo,
            nome_cliente,
            nome_locatario,
            data_vistoria,
            endereco_cep,
            endereco_rua,
            endereco_bairro,
            endereco_cidade,
            endereco_numero,
            endereco_complemento
        })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error('Erro ao atualizar vistoria:', error);
        throw new Error('Não foi possível atualizar a vistoria.');
    }

    revalidatePath(`/vistoria/${id}`);
    redirect(`/vistoria/${id}`);
}