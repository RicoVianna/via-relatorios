'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { atualizarDetalhesVistoria } from './actions';
import { excluirComodo, excluirVistoria } from '../actions';
import ModalAdicionarComodo from '../ModalAdicionarComodo';
import GaleriaFotos from '@/components/GaleriaFotos';

export default function EditarVistoriaClient({ vistoria, comodos, fotos }: { vistoria: any, comodos?: any[], fotos?: any[] }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [comodoParaEditar, setComodoParaEditar] = useState<any>(null);
    
    // Inicializa os campos com os dados que já existem no banco
    const [cep, setCep] = useState(vistoria.endereco_cep || '');
    const [buscandoCep, setBuscandoCep] = useState(false);
    const [rua, setRua] = useState(vistoria.endereco_rua || '');
    const [bairro, setBairro] = useState(vistoria.endereco_bairro || '');
    const [cidade, setCidade] = useState(vistoria.endereco_cidade || '');

    const [modalComodoAberto, setModalComodoAberto] = useState(false);

        const [excluindoId, setExcluindoId] = useState<string | null>(null);

    async function handleExcluirComodo(comodoId: string) {
        const confirmar = window.confirm('Tem certeza que deseja excluir este cômodo? Esta ação não pode ser desfeita.');
        if (!confirmar) return;

        setExcluindoId(comodoId);
        try {
            await excluirComodo(comodoId, vistoria.id);
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Erro ao excluir o cômodo.');
        } finally {
            setExcluindoId(null);
        }
    }

    const [excluindoVistoria, setExcluindoVistoria] = useState(false);

    async function handleExcluirVistoria() {
        const confirmar = window.confirm(
            'Tem certeza que deseja excluir esta vistoria?\n\n' +
            'Todos os cômodos e dados relacionados serão removidos permanentemente.\n' +
            'Esta ação NÃO pode ser desfeita.'
        );
        
        if (!confirmar) return;

        setExcluindoVistoria(true);
        try {
            await excluirVistoria(vistoria.id);
            // Agora o cliente assume o redirecionamento de forma segura
            router.push('/dashboard');
        } catch (error: any) {
            alert(error.message || 'Erro ao excluir a vistoria.');
            setExcluindoVistoria(false);
        }
    }

    // Lógica do CEP (igual à tela de criação)
    async function buscarEnderecoPorCep(cepDigitado: string) {
        const cepLimpo = cepDigitado.replace(/\D/g, '');
        if (cepLimpo.length !== 8) return;

        setBuscandoCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setRua(data.logradouro || '');
                setBairro(data.bairro || '');
                setCidade(`${data.localidade} - ${data.uf}`);
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        } finally {
            setBuscandoCep(false);
        }
    }

    function formatarCep(value: string) {
        return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setErro('');
        try {
            await atualizarDetalhesVistoria(formData);
        } catch (err: any) {
            setErro(err.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Dados da Vistoria</h1>

                {erro && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                        {erro}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    {/* ID Oculto para saber qual vistoria atualizar */}
                    <input type="hidden" name="id" value={vistoria.id} />

                    {/* Tipo e Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                            <select name="tipo" required defaultValue={vistoria.tipo} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                                <option value="ENTRADA">Entrada</option>
                                <option value="SAIDA">Saída</option>
                                <option value="CAPTACAO">Captação</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                            <input type="date" name="data_vistoria" required defaultValue={vistoria.data_vistoria} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Cliente e Locatário */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Proprietário/Cliente *</label>
                            <input type="text" name="nome_cliente" required defaultValue={vistoria.nome_cliente} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Locatário/Inquilino (Opcional)</label>
                            <input type="text" name="nome_locatario" defaultValue={vistoria.nome_locatario || ''} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Endereço do Imóvel</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                                <input type="text" name="endereco_cep" value={cep} required placeholder="00000-000" maxLength={9} onChange={(e) => setCep(formatarCep(e.target.value))} onBlur={() => buscarEnderecoPorCep(cep)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                {buscandoCep && <p className="text-xs text-blue-500 mt-1">Buscando...</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rua *</label>
                                <input type="text" name="endereco_rua" value={rua} required onChange={(e) => setRua(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                                <input type="text" name="endereco_bairro" value={bairro} required onChange={(e) => setBairro(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade/UF *</label>
                                <input type="text" name="endereco_cidade" value={cidade} required onChange={(e) => setCidade(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                                <input type="text" name="endereco_numero" required defaultValue={vistoria.endereco_numero} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                                <input type="text" name="endereco_complemento" defaultValue={vistoria.endereco_complemento || ''} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Seção de Cômodos dentro da Edição */}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Cômodos Vistoriados ({comodos?.length || 0})
                            </h3>
                            
                            {/* BOTÃO NO LUGAR CERTO, FORA DO FORMULÁRIO PRINCIPAL */}
                            <button
                                type="button"
                                onClick={() => {
                                    setComodoParaEditar(null); // Garante que é um novo cômodo
                                    setModalComodoAberto(true); // Abre o modal
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                            >
                                + Adicionar Cômodo
                            </button>
                        </div>

                        {/* Lista visual dos cômodos (mantenha o seu código de lista aqui embaixo) */}
                        {comodos && comodos.length > 0 ? (
                            <div className="space-y-2">
                                {comodos.map((comodo: any) => (
                                    <div key={comodo.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm flex justify-between items-start gap-3">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 flex justify-between mb-1">
                                                <span>{comodo.nome_comodo}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                    comodo.estado_conservacao === 'BOM' ? 'bg-green-100 text-green-700' :
                                                    comodo.estado_conservacao === 'REGULAR' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {comodo.estado_conservacao || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="text-gray-600 line-clamp-2">
                                                {comodo.descricao_processada_ia || comodo.descricao_bruta || "Sem descrição"}
                                            </div>
                                            <GaleriaFotos
                                                comodoId={comodo.id}
                                                vistoriaId={vistoria.id}
                                                fotos={(fotos ?? []).filter((f: any) => f.comodo_id === comodo.id)}
                                                modo="edicao"
                                            />
                                        </div>
                                        
                                        {/* Botões de Ação (Editar e Excluir) */}
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setComodoParaEditar(comodo)}
                                                className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Editar este cômodo"
                                                disabled={excluindoId === comodo.id}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleExcluirComodo(comodo.id)}
                                                disabled={excluindoId === comodo.id}
                                                className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                                title="Excluir este cômodo"
                                            >
                                                {excluindoId === comodo.id ? (
                                                    <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 text-center">
                                Nenhum cômodo adicionado ainda. Use o botão acima.
                            </p>
                        )}
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-6">
                        <button type="button" onClick={() => router.back()} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>

                {/* Zona de Risco */}
                <div className="mt-8 pt-6 border-t-2 border-red-100">
                    <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Zona de Risco
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                        Ações destrutivas e irreversíveis relacionadas a esta vistoria.
                    </p>
                    <button
                        type="button"
                        onClick={handleExcluirVistoria}
                        disabled={excluindoVistoria || isLoading}
                        className="w-full px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {excluindoVistoria ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Excluindo...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Excluir Vistoria Permanentemente
                            </>
                        )}
                    </button>
                </div>
                
                {/* O MODAL FICA AQUI (FORA DO FORM), MAS SÓ APARECE QUANDO 'aberto' FOR TRUE */}
                <ModalAdicionarComodo 
                    vistoriaId={vistoria.id} 
                    comodoParaEditar={comodoParaEditar} 
                    aberto={modalComodoAberto}
                    onClose={() => {
                        setModalComodoAberto(false);
                        setComodoParaEditar(null);
                    }} 
                />
            </div>
        </div>
    );
}


