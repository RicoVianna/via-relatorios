import LandingTopo from '@/components/landing/LandingTopo';
import LandingBeneficios from '@/components/landing/LandingBeneficios';
import LandingRecursos from '@/components/landing/LandingRecursos';
import LandingInstalacaoPrecos from '@/components/landing/LandingInstalacaoPrecos';
import LandingFaqFooter from '@/components/landing/LandingFaqFooter';
import RedirecionadorStandalone from '@/components/landing/RedirecionadorStandalone';

export default function LandingPage() {
    return (
        <div style={{ backgroundColor: 'var(--bg)' }}>
            <RedirecionadorStandalone />
            <LandingTopo />
            <LandingBeneficios />
            <LandingRecursos />
            <LandingInstalacaoPrecos />
            <LandingFaqFooter />
        </div>
    );
}