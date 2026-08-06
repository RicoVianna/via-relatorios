import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ListaVistorias from './ListaVistorias';

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Verificar autenticação
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    // 2. Buscar perfil
    const { data: profile } = await supabase
        .from('profiles')
        .select('nome, email')
        .eq('id', user.id)
        .single();

    // 3. Buscar vistorias com os cômodos relacionados (uma única consulta)
    // O Supabase faz um JOIN automático e retorna os cômodos dentro de cada vistoria
    const { data: vistorias } = await supabase
        .from('vistorias')
        .select('*, comodos(*)')
        .eq('user_id', user.id)
        .order('data_vistoria', { ascending: false });

    // 4. Enviar os dados para o componente interativo
    return <ListaVistorias vistorias={vistorias} profile={profile} />;
}