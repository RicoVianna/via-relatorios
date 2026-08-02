import { getProfile } from '@/lib/getProfile';
import { redirect } from 'next/navigation';
import PerfilForm from './PerfilForm';

export default async function PerfilPage() {
    const profile = await getProfile();

    if (!profile) {
        redirect('/login');
    }

    return <PerfilForm initialProfile={profile} />;
}