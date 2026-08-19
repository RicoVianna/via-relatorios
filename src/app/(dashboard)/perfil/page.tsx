import { getProfile } from '@/lib/getProfile';
import { redirect } from 'next/navigation';
import PerfilForm from './PerfilForm';
import PrivacidadeCard from '@/components/PrivacidadeCard';

export default async function PerfilPage() {
    const profile = await getProfile();

    if (!profile) {
        redirect('/login');
    }

    return (
        <>
            <PerfilForm initialProfile={profile} />
            <PrivacidadeCard />
        </>
    );
}