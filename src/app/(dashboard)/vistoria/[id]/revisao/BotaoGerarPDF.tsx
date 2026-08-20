'use client';

import { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DocumentoPDF from './DocumentoPDF';

export default function BotaoGerarPDF({ vistoria, comodos, fotos, profile }: { vistoria: any; comodos: any[]; fotos?: any[]; profile?: any }) {
    // O PDFDownloadLink só funciona no navegador. Sem este bloqueio, o Next.js
    // tenta renderizá-lo no servidor e gera erro no terminal a cada acesso.
    const [montado, setMontado] = useState(false);

    useEffect(() => {
        setMontado(true);
    }, []);

    // Fase de servidor: placeholder idêntico ao botão (evita erro e piscação)
    if (!montado) {
        return (
            <span className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 text-center opacity-80">
                Gerar e Baixar PDF
            </span>
        );
    }

    return (
        
        <PDFDownloadLink
            document={<DocumentoPDF vistoria={vistoria} comodos={comodos} fotos={fotos} profile={profile} />}
            fileName={`vistoria-${vistoria.nome_cliente}-${vistoria.endereco_rua}.pdf`}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-sm transition-colors flex items-center justify-center gap-2 text-center no-underline"
        >
            {({ blob, url, loading, error }) =>
                loading ? 'Gerando PDF...' : 'Gerar e Baixar PDF'
            }
        </PDFDownloadLink>
    );
}