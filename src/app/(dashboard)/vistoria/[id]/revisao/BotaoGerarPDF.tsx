'use client';

import { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import DocumentoPDF from './DocumentoPDF';

export default function BotaoGerarPDF({ vistoria, comodos, fotos, profile }: { vistoria: any; comodos: any[]; fotos?: any[]; profile?: any }) {
    // O PDFDownloadLink só funciona no navegador. Sem este bloqueio, o Next.js
    // tenta renderizá-lo no servidor e gera erro no terminal a cada acesso.
    const [montado, setMontado] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [linkValidacao, setLinkValidacao] = useState<string | null>(null);

    useEffect(() => {
        setMontado(true);
    }, []);

    // Gera o link público e o QR Code (imagem em base64)
    useEffect(() => {
        async function gerarQr() {
            if (!vistoria.codigo_validacao) return;
            const url = `${window.location.origin}/laudo/${vistoria.codigo_validacao}`;
            setLinkValidacao(url);
            const dataUrl = await QRCode.toDataURL(url, { width: 512, margin: 1 });
            setQrDataUrl(dataUrl);
        }
        gerarQr();
    }, [vistoria.codigo_validacao]);

    // Se tem código, espera o QR ficar pronto antes de liberar o PDF
    const qrPronto = qrDataUrl !== null || !vistoria.codigo_validacao;

    // Fase de servidor / QR gerando: placeholder idêntico ao botão
    if (!montado || !qrPronto) {
        return (
            <span className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 text-center opacity-80">
                Gerar e Baixar PDF
            </span>
        );
    }

    return (
        <PDFDownloadLink
            document={
                <DocumentoPDF
                    vistoria={vistoria}
                    comodos={comodos}
                    fotos={fotos}
                    profile={profile}
                    qrDataUrl={qrDataUrl}
                    linkValidacao={linkValidacao}
                />
            }
            fileName={`vistoria-${vistoria.nome_cliente}-${vistoria.endereco_rua}.pdf`}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-sm transition-colors flex items-center justify-center gap-2 text-center no-underline"
        >
            {({ loading }) => (loading ? 'Gerando PDF...' : 'Gerar e Baixar PDF')}
        </PDFDownloadLink>
    );
}