'use server';

import { createClient } from '@/lib/supabase/server';
import { model } from '@/lib/gemini';
import { redirect } from 'next/navigation';

export async function processarDescricaoIA(formData: FormData) {
    const supabase = await createClient();
    const comodoId = formData.get('comodo_id') as string;
    const vistoriaId = formData.get('vistoria_id') as string;

    // 1. Buscar a descrição bruta no banco
    const { data: comodo, error: fetchError } = await supabase
        .from('comodos')
        .select('descricao_bruta')
        .eq('id', comodoId)
        .single();

    if (fetchError || !comodo || !comodo.descricao_bruta) {
        throw new Error('Descrição não encontrada.');
    }

    // 2. Montar o prompt e chamar o Google Gemini
    const prompt = `Atue como um especialista em vistorias imobiliárias. Reescreva o texto bruto abaixo, tornando-o técnico, profissional e objetivo, mantendo todas as informações originais. Texto: "${comodo.descricao_bruta}"`;

    const result = await model.generateContent(prompt);
    const textoProcessado = result.response.text();

    // 3. Atualizar o banco de dados com o texto da IA
    const { error: updateError } = await supabase
        .from('comodos')
        .update({ descricao_processada_ia: textoProcessado })
        .eq('id', comodoId);

    if (updateError) {
        throw new Error('Erro ao salvar texto da IA.');
    }

    redirect(`/vistoria/${vistoriaId}/revisao`);
}