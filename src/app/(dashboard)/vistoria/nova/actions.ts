'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function criarVistoria(formData: FormData) {
    const supabase = await createClient();

    // 1. Verificar autenticação
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    // 2. Pegar os dados EXATOS dos novos campos do formulário
    const tipo = formData.get('tipo') as string;
    const nome_cliente = formData.get('nome_cliente') as string;
    const nome_locatario = formData.get('nome_locatario') as string; // NOVO CAMPO
    const data_vistoria = formData.get('data_vistoria') as string;
    
    const endereco_cep = formData.get('endereco_cep') as string;
    const endereco_rua = formData.get('endereco_rua') as string;
    const endereco_bairro = formData.get('endereco_bairro') as string;
    const endereco_cidade = formData.get('endereco_cidade') as string;
    const endereco_numero = formData.get('endereco_numero') as string;
    const endereco_complemento = formData.get('endereco_complemento') as string;

    // 3. Salvar no banco de dados
    const { data, error } = await supabase
        .from('vistorias')
        .insert({
            user_id: user.id,
            tipo,
            nome_cliente,
            nome_locatario, // NOVO CAMPO
            endereco_cep,
            endereco_rua,
            endereco_bairro,
            endereco_cidade,
            endereco_numero,
            endereco_complemento,
            data_vistoria,
            status: 'RASCUNHO'
        })
        .select('id')
        .single();

    if (error) {
        console.error('Erro ao criar vistoria:', error);
        throw new Error('Não foi possível salvar a vistoria. Tente novamente.');
    }

    // 4. Redirecionar para a página de detalhes (que criaremos a seguir)
    redirect(`/vistoria/${data.id}`);
}