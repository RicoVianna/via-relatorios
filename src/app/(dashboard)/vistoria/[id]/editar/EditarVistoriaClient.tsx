'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { atualizarDetalhesVistoria } from './actions';
import ModalAdicionarComodo from '../ModalAdicionarComodo';

export default function EditarVistoriaClient({ vistoria, comodos }: { vistoria: any, comodos?: any[] }) {
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
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
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
                                        </div>
                                        
                                        {/* Botão de Editar (Lápis) */}
                                        <button
                                            type="button"
                                            onClick={() => setComodoParaEditar(comodo)}
                                            className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                                            title="Editar este cômodo"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
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


