'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import DocumentoPDF from './DocumentoPDF';

export default function BotaoGerarPDF({ vistoria, comodos }: { vistoria: any; comodos: any[] }) {
    return (
        <PDFDownloadLink
            document={<DocumentoPDF vistoria={vistoria} comodos={comodos} />}
            fileName={`vistoria-${vistoria.nome_cliente}-${vistoria.endereco_rua}.pdf`}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-sm transition-colors flex items-center justify-center gap-2 text-center no-underline"
        >
            {({ blob, url, loading, error }) =>
                loading ? 'Gerando PDF...' : 'Gerar e Baixar PDF'
            }
        </PDFDownloadLink>
    );
}