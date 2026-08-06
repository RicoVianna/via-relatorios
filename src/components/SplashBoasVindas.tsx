'use client';

import { useEffect, useState } from 'react';

export default function SplashBoasVindas() {
    const [saindo, setSaindo] = useState(false);
    const [visivel, setVisivel] = useState(true);

    useEffect(() => {
        const t1 = setTimeout(() => setSaindo(true), 1200);
        const t2 = setTimeout(() => setVisivel(false), 1800);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    if (!visivel) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 transition-opacity duration-500 ${saindo ? 'opacity-0' : 'opacity-100'}`}
            style={{ background: 'linear-gradient(160deg, #1B211B 0%, #2C3A2C 100%)' }}
        >
            <div className="w-28 h-28 rounded-3xl bg-[#F6F5F1] flex items-center justify-center shadow-2xl">
                <img src="/icon-192.png" alt="Via Relatórios" className="w-20 h-20" />
            </div>
            <div className="w-28 h-0.5 bg-[#C2A24B]" />
            <p className="text-lg tracking-[0.3em] uppercase text-[#F6F5F1]">
                Via Relatórios
            </p>
        </div>
    );
}