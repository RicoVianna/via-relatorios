'use client';

import { useState } from 'react';
import { adicionarComodo } from './actions';

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

export default function ModalAdicionarComodo({ vistoriaId }: { vistoriaId: string }) {
    const [modalAberto, setModalAberto] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [comodo, setComodo] = useState('');
    const [comodoCustomizado, setComodoCustomizado] = useState(''); // Novo estado para "Outro"
    const [item, setItem] = useState('');
    const [estado, setEstado] = useState('BOM');
    const [observacao, setObservacao] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('vistoria_id', vistoriaId);
            
            // Define o nome final do cômodo (o selecionado ou o digitado)
            const nomeFinalDoComodo = comodo === 'Outro (especificar)' ? comodoCustomizado : comodo;
            formData.append('nome_comodo', nomeFinalDoComodo);
            
            // Monta a descrição estruturada para a IA
            const descricaoEstruturada = `Cômodo: ${nomeFinalDoComodo}. Item: ${item}. Estado de conservação: ${estado}. Observações específicas: ${observacao || 'Sem observações adicionais.'}`;
            formData.append('descricao_bruta', descricaoEstruturada);

            await adicionarComodo(formData);
            
            // Reseta e fecha
            setModalAberto(false);
            setComodo('');
            setComodoCustomizado('');
            setItem('');
            setEstado('BOM');
            setObservacao('');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar. Tente novamente.');
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">O que está sendo vistoriado? *</label>
                                <select 
                                    required 
                                    value={item} 
                                    onChange={(e) => setItem(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">-- Selecione o Item --</option>
                                    {OPCOES_ITENS.map(op => <option key={op} value={op}>{op}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Conservação *</label>
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

                            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
                                <button 
                                    type="button" 
                                    onClick={() => setModalAberto(false)} 
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                                >
                                    {isLoading ? 'Processando com IA...' : 'Salvar Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}