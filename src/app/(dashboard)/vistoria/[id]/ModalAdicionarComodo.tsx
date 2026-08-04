'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adicionarComodo, atualizarComodo } from './actions';

// Lista expandida para cobrir a maioria dos cenários
const OPCOES_COMODOS = [
    'Sala de Estar', 'Sala de Jantar', 'Cozinha', 'Quarto 1 (Principal)', 'Quarto 2', 'Quarto 3', 
    'Suíte Master', 'Banheiro da Suíte', 'Banheiro Social', 'Lavabo', 'Corredor Interno', 
    'Corredor Externo', 'Hall de Entrada', 'Escritório', 'Quarto de Empregada', 'Banheiro de Empregada',
    'Área de Serviço', 'Lavanderia', 'Despensa', 'Garagem', 'Varanda', 'Sacada', 'Terraço', 
    'Área Gourmet', 'Churrasqueira', 'Jardim', 'Piscina', 'Outro (especificar)'
];

const OPCOES_ITENS = [
    'Piso', 'Paredes', 'Teto', 'Portas', 'Janelas', 'Rodapés', 'Sancas', 
    'Instalações Elétricas (Tomadas/Interruptores)', 'Instalações Hidráulicas (Torneiras/Registro)', 
    'Luminárias', 'Vidros', 'Fechaduras', 'Móveis Planejados', 'Outros'
];

// FUNÇÃO NOVA: Extrai os dados do texto que está no banco
function parseDescricaoBruta(descricao: string | null) {
    if (!descricao) return { item: '', estado: 'BOM', observacao: '' };
    
    const itemMatch = descricao.match(/Item:\s*([^\.]+)\./);
    const item = itemMatch ? itemMatch[1].trim() : '';
    
    const estadoMatch = descricao.match(/Estado de conservação:\s*([^\.]+)\./);
    const estado = estadoMatch ? estadoMatch[1].trim() : 'BOM';
    
    const obsMatch = descricao.match(/Observações específicas:\s*(.+)/);
    const observacao = obsMatch ? obsMatch[1].trim() : '';
    
    return { item, estado, observacao };
}

export default function ModalAdicionarComodo({
    vistoriaId,
    comodoParaEditar,
    onClose
}: {
    vistoriaId: string;
    comodoParaEditar?: any;
    onClose?: () => void;
}) {
    const [modalAberto, setModalAberto] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState('');
    const router = useRouter();
    
    // Se estiver editando, usa os dados do cômodo. Se não, começa vazio.
    const [comodo, setComodo] = useState(comodoParaEditar?.nome_comodo || '');
    const [comodoCustomizado, setComodoCustomizado] = useState(comodoParaEditar?.nome_comodo_customizado || '');
    const [item, setItem] = useState(comodoParaEditar?.item_vistoriado || '');
    const [estado, setEstado] = useState(comodoParaEditar?.estado_conservacao || 'BOM');
    const [observacao, setObservacao] = useState(comodoParaEditar?.observacao || '');

        // Quando o cômodo para editar muda: abre o modal e preenche os campos
    // Quando o cômodo para editar muda: abre o modal e preenche os campos
    useEffect(() => {
        if (comodoParaEditar) {
            setModalAberto(true);
            setComodo(comodoParaEditar.nome_comodo || '');
            setComodoCustomizado(comodoParaEditar.nome_comodo_customizado || '');
            
            // Usa a função nova para preencher os campos que estavam no texto
            const { item, estado, observacao } = parseDescricaoBruta(comodoParaEditar.descricao_bruta);
            setItem(item);
            setEstado(estado);
            setObservacao(observacao);
        } else {
            setModalAberto(false);
            setComodo('');
            setComodoCustomizado('');
            setItem('');
            setEstado('BOM');
            setObservacao('');
        }
    }, [comodoParaEditar?.id]);

    // Função para limpar o formulário quando fechar o modal
    const resetForm = () => {
        setComodo('');
        setComodoCustomizado('');
        setItem('');
        setEstado('BOM');
        setObservacao('');
        setErro('');
        setModalAberto(false);
        if (onClose) onClose();
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setErro('');
        
        try {
            const formData = new FormData();
            formData.append('vistoria_id', vistoriaId);
            
            // SE FOR EDIÇÃO: envia o ID do cômodo para o servidor saber qual atualizar
            if (comodoParaEditar) {
                formData.append('comodo_id', comodoParaEditar.id);
            }

            // Define o nome final do cômodo (o selecionado ou o digitado)
            const nomeFinalDoComodo = comodo === 'Outro (especificar)' ? comodoCustomizado : comodo;
            formData.append('nome_comodo', nomeFinalDoComodo);
            
            // NOVAS LINHAS: Enviam os dados separados para o banco salvar corretamente
            formData.append('estado_conservacao', estado);
            formData.append('item_vistoriado', item);
            formData.append('observacao', observacao);
            
            // Monta a descrição estruturada para a IA
            const descricaoEstruturada = `Cômodo: ${nomeFinalDoComodo}. Item: ${item || 'Nenhum específico'}. Estado de conservação: ${estado}. Observações específicas: ${observacao || 'Sem observações adicionais.'}`;
            formData.append('descricao_bruta', descricaoEstruturada);

            // DECISÃO: Se existir comodoParaEditar, atualiza. Se não, cria um novo.
            if (comodoParaEditar) {
                await atualizarComodo(formData);
            } else {
                await adicionarComodo(formData);
            }
            
            // Reseta o formulário e fecha o modal
            resetForm();
            
            // Atualiza a tela para mostrar a alteração imediatamente
            router.refresh(); 
            
        } catch (error: any) {
            console.error(error);
            setErro(error.message || 'Erro ao salvar. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button onClick={() => setModalAberto(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                + Adicionar Cômodo
            </button>

            {modalAberto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0">
                            <h3 className="text-lg font-bold text-gray-900">Adicionar Item à Vistoria</h3>
                            <button onClick={() => setModalAberto(false)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Cômodo *</label>
                                <select 
                                    required 
                                    value={comodo} 
                                    onChange={(e) => setComodo(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">-- Selecione --</option>
                                    {OPCOES_COMODOS.map(op => <option key={op} value={op}>{op}</option>)}
                                </select>
                            </div>

                            {/* Campo que aparece SOMENTE se "Outro" for selecionado */}
                            {comodo === 'Outro (especificar)' && (
                                <div className="animate-fade-in">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Qual é o nome deste cômodo/área? *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={comodoCustomizado}
                                        onChange={(e) => setComodoCustomizado(e.target.value)}
                                        placeholder="Ex: Corredor do 2º andar, Área de Churrasqueira..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}



                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Conservação <span className="text-red-500">*</span></label>
                                <select 
                                    required 
                                    value={estado} 
                                    onChange={(e) => setEstado(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="BOM">Bom (Sem avarias, limpo, funcional)</option>
                                    <option value="REGULAR">Regular (Desgaste natural, pequenas marcas, sujeira leve)</option>
                                    <option value="RUIM">Ruim (Avarias, quebrado, sujo, requer reparo/troca)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    O que está sendo vistoriado? {estado !== 'BOM' && <span className="text-red-500">*</span>}
                                </label>
                                <select 
                                    required={estado !== 'BOM'} 
                                    value={item} 
                                    onChange={(e) => setItem(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">
                                        {estado === 'BOM' ? '-- Nenhum problema específico --' : '-- Selecione o Item com avaria --'}
                                    </option>
                                    {OPCOES_ITENS.map(op => <option key={op} value={op}>{op}</option>)}
                                </select>
                                {estado === 'BOM' && (
                                    <p className="text-xs text-green-600 mt-1">Como o estado é "Bom", este campo é opcional.</p>
                                )}
                                {estado !== 'BOM' && (
                                    <p className="text-xs text-gray-500 mt-1">Selecione o item específico que apresenta problema.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observações Específicas (Opcional)</label>
                                <textarea 
                                    value={observacao} 
                                    onChange={(e) => setObservacao(e.target.value)} 
                                    rows={3} 
                                    placeholder="Ex: Risco profundo no centro do piso, tinta descascando perto da janela, torneira pingando..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Use este campo apenas para detalhar o estado do item selecionado acima.</p>
                            </div>
                                                        <div className="pt-4 border-t border-gray-200 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setModalAberto(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Salvar Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}