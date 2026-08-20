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
    const [excluindoVistoria, setExcluindoVistoria] = useState(false);

    // Estilo padrão dos campos (acompanha o tema)
    const inputStyle = { backgroundColor: 'var(--bg)', color: 'var(--text)', borderColor: 'var(--border)' };
    const labelStyle = { color: 'var(--text-secondary)' };

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
            <div className="max-w-2xl mx-auto p-6 rounded-xl shadow-sm border-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>Editar Dados da Vistoria</h1>

                {erro && (
                    <div className="mb-4 p-3 rounded-lg text-sm border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                        {erro}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    {/* ID Oculto para saber qual vistoria atualizar */}
                    <input type="hidden" name="id" value={vistoria.id} />

                    {/* Tipo e Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={labelStyle}>Tipo *</label>
                            <select name="tipo" required defaultValue={vistoria.tipo} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" style={inputStyle}>
                                <option value="ENTRADA">Entrada</option>
                                <option value="SAIDA">Saída</option>
                                <option value="CAPTACAO">Captação</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={labelStyle}>Data *</label>
                            <input type="date" name="data_vistoria" required defaultValue={vistoria.data_vistoria} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" style={inputStyle} />
                        </div>
                    </div>

                    {/* Cliente e Locatário */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={labelStyle}>Nome do Proprietário/Cliente *</label>
                            <input type="text" name="nome_cliente" required defaultValue={vistoria.nome_cliente} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" style={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={labelStyle}>Nome do Locatário/Inquilino (Opcional)</label>
                            <input type="text" name="nome_locatario" defaultValue={vistoria.nome_locatario || ''} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" style={inputStyle} />
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="pt-4 mt-4" style={{ borderTop: '2px solid var(--border)' }}>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Endereço do Imóvel</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium mb-1" style={labelStyle}>CEP *</label>
                                <input type="text" name="endereco_cep" value={cep} required placeholder="00000-000" maxLength={9} onChange={(e) => setCep(formatarCep(e.target.value))} onBlur={() => buscarEnderecoPorCep(cep)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" style={inputStyle} />
                                {buscandoCep && <p className="text-xs mt-1" style={{ color: 'var(--primary)' }}>Buscando...</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1" style={labelStyle}>Rua *</label>
                                <input type="text" name="endereco_rua" value={rua} required onChange={(e) => setRua(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" style={inputStyle} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium mb-1" style={labelStyle}>Bairro *</label>
                                <input type="text" name="endereco_bairro" value={bairro} required onChange={(e) => setBairro(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" style={inputStyle} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1" style={labelStyle}>Cidade/UF *</label>
                                <input type="text" name="endereco_cidade" value={cidade} required onChange={(e) => setCidade(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" style={inputStyle} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" style={labelStyle}>Número *</label>
                                <input type="text" name="endereco_numero" required defaultValue={vistoria.endereco_numero} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" style={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" style={labelStyle}>Complemento</label>
                                <input type="text" name="endereco_complemento" defaultValue={vistoria.endereco_complemento || ''} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Seção de Cômodos dentro da Edição */}
                    <div className="pt-6 mt-6" style={{ borderTop: '2px solid var(--border)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                                Cômodos Vistoriados ({comodos?.length || 0})
                            </h3>

                            <button
                                type="button"
                                onClick={() => {
                                    setComodoParaEditar(null);
                                    setModalComodoAberto(true);
                                }}
                                className="px-4 py-2 text-white rounded-lg font-medium transition-colors text-sm"
                                style={{ backgroundColor: 'var(--primary)' }}
                            >
                                + Adicionar Cômodo
                            </button>
                        </div>

                        {comodos && comodos.length > 0 ? (
                            <div className="space-y-2">
                                {comodos.map((comodo: any) => (
                                    <div key={comodo.id} className="p-3 rounded-lg border text-sm" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1">
                                                <div className="font-semibold flex justify-between mb-1" style={{ color: 'var(--text)' }}>
                                                    <span>{comodo.nome_comodo}</span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full" style={
                                                        comodo.estado_conservacao === 'BOM' ? { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' } :
                                                        comodo.estado_conservacao === 'REGULAR' ? { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' } :
                                                        { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }
                                                    }>
                                                        {comodo.estado_conservacao || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
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
                                                    className="p-1.5 rounded-lg transition-colors"
                                                    style={{ color: 'var(--primary)' }}
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
                                                    className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                                                    style={{ color: '#EF4444' }}
                                                    title="Excluir este cômodo"
                                                >
                                                    {excluindoId === comodo.id ? (
                                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic p-3 rounded-lg border border-dashed text-center" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                                Nenhum cômodo adicionado ainda. Use o botão acima.
                            </p>
                        )}
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-6">
                        <button type="button" onClick={() => router.back()} className="flex-1 px-4 py-3 border rounded-lg font-medium" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Cancelar</button>
                        <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 text-white rounded-lg font-medium disabled:opacity-50" style={{ backgroundColor: 'var(--primary)' }}>
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>

                {/* Zona de Risco */}
                <div className="mt-8 pt-6" style={{ borderTop: '2px solid rgba(239, 68, 68, 0.3)' }}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: '#F87171' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.732c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Zona de Risco
                    </h3>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                        Ações destrutivas e irreversíveis relacionadas a esta vistoria.
                    </p>
                    <button
                        type="button"
                        onClick={handleExcluirVistoria}
                        disabled={excluindoVistoria || isLoading}
                        className="w-full px-4 py-3 border rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    >
                        {excluindoVistoria ? (
                            <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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