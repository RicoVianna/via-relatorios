import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getDashboardData() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('nome, email')
        .eq('id', user.id)
        .single();

    const { data: vistorias } = await supabase
        .from('vistorias')
        .select('*')
        .eq('user_id', user.id)
        .order('data_vistoria', { ascending: false });

    return { user, profile, vistorias };
}