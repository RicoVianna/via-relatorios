'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { criarVistoria } from './actions';

export default function NovaVistoriaPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState('');
    
    // Estados para o endereço
    const [cep, setCep] = useState('');
    const [buscandoCep, setBuscandoCep] = useState(false);
    const [rua, setRua] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');

    // Função para buscar CEP na API ViaCEP
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
            } else {
                alert('CEP não encontrado. Preencha o endereço manualmente.');
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        } finally {
            setBuscandoCep(false);
        }
    }

    // Formata o CEP enquanto digita (00000-000)
    function formatarCep(value: string) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setErro('');
        try {
            await criarVistoria(formData);
        } catch (err: any) {
            setErro(err.message);
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Nova Vistoria</h1>

                {erro && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                        {erro}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    {/* Tipo e Cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                            <select name="tipo" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                                <option value="ENTRADA">Entrada</option>
                                <option value="SAIDA">Saída</option>
                                <option value="CAPTACAO">Captação</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                            <input type="date" name="data_vistoria" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Proprietário/Cliente *</label>
                            <input type="text" name="nome_cliente" required placeholder="Ex: João da Silva" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Locatário/Inquilino (Opcional)</label>
                            <input type="text" name="nome_locatario" placeholder="Ex: Maria Oliveira" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Endereço com Autocomplete */}
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Endereço do Imóvel</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                                <input 
                                    type="text" 
                                    name="endereco_cep"
                                    value={cep}
                                    required
                                    placeholder="00000-000"
                                    maxLength={9}
                                    onChange={(e) => setCep(formatarCep(e.target.value))}
                                    onBlur={() => buscarEnderecoPorCep(cep)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {buscandoCep && <p className="text-xs text-blue-500 mt-1">Buscando endereço...</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rua / Logradouro *</label>
                                <input type="text" name="endereco_rua" value={rua} required onChange={(e) => setRua(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                                <input type="text" name="endereco_bairro" value={bairro} required onChange={(e) => setBairro(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade / UF *</label>
                                <input type="text" name="endereco_cidade" value={cidade} required onChange={(e) => setCidade(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                                <input type="text" name="endereco_numero" required placeholder="Ex: 123" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                                <input type="text" name="endereco_complemento" placeholder="Ex: Apto 101, Bloco B" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-6">
                        <button type="button" onClick={() => router.back()} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                            {isLoading ? 'Salvando...' : 'Criar Vistoria'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}