'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Se a landing estiver rodando DENTRO do app instalado (janela própria),
// não faz sentido mostrar marketing: manda direto para o login.
export default function RedirecionadorStandalone() {
    const router = useRouter();

    useEffect(() => {
        const mq = window.matchMedia('(display-mode: standalone)');

        const redirecionarSeApp = () => {
            if (mq.matches || (navigator as any).standalone === true) {
                router.replace('/login');
            }
        };

        // Checa no carregamento...
        redirecionarSeApp();

        // ...e também quando o Chrome TRANSFORMA a aba em app sem recarregar
        mq.addEventListener('change', redirecionarSeApp);
        return () => mq.removeEventListener('change', redirecionarSeApp);
    }, [router]);

    return null;
}