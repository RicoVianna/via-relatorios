'use client';

import { useState } from 'react';

export default function BotaoCopiarLink({ codigo }: { codigo: string }) {
    const [copiado, setCopiado] = useState(false);

    async function handleCopiar() {
        const link = `${window.location.origin}/laudo/${codigo}`;
        try {
            await navigator.clipboard.writeText(link);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch (error) {
            alert('Não foi possível copiar o link.');
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopiar}
            className="relative z-50 px-5 py-3 rounded-lg font-semibold text-base transition-colors text-center border-2 flex items-center justify-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border-blue-700 shadow-md"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {copiado ? 'Link Copiado!' : 'Copiar Link de Validação'}
        </button>
    );
}