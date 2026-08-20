'use client';

import { useState } from 'react';

// Monta o texto completo da vistoria (resumo + todos os cômodos)
function montarTextoCompartilhamento(vistoria: any, comodos: any[]): string {
    const tipoTexto = vistoria.tipo === 'ENTRADA' ? 'Entrada' : vistoria.tipo === 'SAIDA' ? 'Saída' : 'Captação';
    const dataFormatada = new Date(vistoria.data_vistoria).toLocaleDateString('pt-BR');
    const endereco = `${vistoria.endereco_rua}, ${vistoria.endereco_numero} - ${vistoria.endereco_bairro}, ${vistoria.endereco_cidade}`;

    let texto = `📋 VISTORIA DE ${tipoTexto.toUpperCase()} - FINALIZADA\n`;
    texto += `📍 Imóvel: ${endereco}\n`;
    texto += `👤 Proprietário: ${vistoria.nome_cliente || 'Não informado'}\n`;
    if (vistoria.nome_locatario) {
        texto += `🔑 Inquilino: ${vistoria.nome_locatario}\n`;
    }
    texto += `📅 Data da vistoria: ${dataFormatada}\n`;
    texto += `\n🏠 CÔMODOS VISTORIADOS:\n`;

    if (comodos.length === 0) {
        texto += `\n(Nenhum cômodo cadastrado)\n`;
    } else {
        comodos.forEach((comodo, indice) => {
            const descricao = comodo.descricao_processada_ia || comodo.descricao_bruta || 'Sem descrição.';
            texto += `\n${indice + 1}) ${comodo.nome_comodo}\n${descricao}\n`;
        });
    }

    texto += `\n✅ Laudo finalizado e pronto para envio.`;
    
    if (vistoria.codigo_validacao) {
        texto += `\n\n🔗 Link de validação: ${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/laudo/${vistoria.codigo_validacao}`;
    }
    
    return texto;
}

export default function BotaoCompartilhar({ vistoria, comodos = [], variante = 'botao' }: { vistoria: any; comodos?: any[]; variante?: 'botao' | 'icone' }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [copiado, setCopiado] = useState(false);

    // Regra de segurança jurídica: compartilhar apenas vistorias finalizadas
    if (vistoria.status !== 'FINALIZADO') {
        return null;
    }

    function compartilharWhatsApp() {
        const texto = montarTextoCompartilhamento(vistoria, comodos);
        const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
        window.open(url, '_blank');
        setMenuAberto(false);
    }

    async function copiarTexto() {
        const texto = montarTextoCompartilhamento(vistoria, comodos);
        try {
            await navigator.clipboard.writeText(texto);
            setCopiado(true);
            setMenuAberto(false);
            alert('Texto copiado! Agora é só colar e enviar para quem quiser.');
            setTimeout(() => setCopiado(false), 2000);
        } catch (error) {
            alert('Não foi possível copiar o texto neste navegador.');
        }
    }

    async function compartilharNativo() {
        const texto = montarTextoCompartilhamento(vistoria, comodos);

        // Detecta celular pelo navegador (o painel nativo só existe de verdade em celulares)
        const ehMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        // Fora do celular (ou sem painel nativo), copia o texto como alternativa
        if (!ehMobile || !navigator.share) {
            try {
                await navigator.clipboard.writeText(texto);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2000);
                alert('Seu navegador não possui painel de compartilhamento. O texto completo foi copiado: cole onde quiser enviar.');
            } catch (error) {
                alert('Não foi possível compartilhar neste navegador.');
            }
            setMenuAberto(false);
            return;
        }

        try {
            await navigator.share({
                title: 'Vistoria de Imóvel',
                text: texto
            });
        } catch (error: any) {
            // Se o usuário cancelou, não mostra erro. Qualquer outra falha, avisa.
            if (error?.name !== 'AbortError') {
                alert('Não foi possível abrir o compartilhamento do aparelho.');
            }
        }
        setMenuAberto(false);
    }

    return (
        <>
            {/* Botão principal que abre o menu de opções */}
            {variante === 'icone' ? (
                <button
                    type="button"
                    onClick={() => setMenuAberto(true)}
                    title="Compartilhar vistoria"
                    className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-3l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => setMenuAberto(true)}
                    className="flex-1 px-4 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-3l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {copiado ? 'Texto Copiado!' : 'Compartilhar'}
                </button>
            )}

            {/* Menu de opções de compartilhamento */}
            {menuAberto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Compartilhar Vistoria</h3>
                            <button
                                type="button"
                                onClick={() => setMenuAberto(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6 space-y-3">
                            <p className="text-xs text-gray-500">
                                O laudo completo, com todos os cômodos, será enviado em formato de texto.
                            </p>
                            <button
                                type="button"
                                onClick={compartilharWhatsApp}
                                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.295-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Enviar pelo WhatsApp
                            </button>
                            <button
                                type="button"
                                onClick={copiarTexto}
                                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Copiar Texto
                            </button>
                            <button
                                type="button"
                                onClick={compartilharNativo}
                                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-3l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Outras Opções (E-mail, Telegram...)
                            </button>
                            <div className="pt-3 border-t border-gray-100">
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-start gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-xs text-purple-900 leading-relaxed">
                                        <span className="font-bold">Quer enviar o arquivo em PDF?</span>{' '}
                                        Feche este menu e toque em "Gerar e Baixar PDF" para salvar o arquivo no aparelho. Depois, abra o WhatsApp ou e-mail, anexe o arquivo salvo e envie.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}