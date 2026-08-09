import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LandingPage from '@/components/landing/LandingPage';

export default async function HomePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Usuário logado vai direto para o dashboard
    if (user) {
        redirect('/dashboard');
    }

    // Visitante vê a landing page completa
    return <LandingPage />;
}