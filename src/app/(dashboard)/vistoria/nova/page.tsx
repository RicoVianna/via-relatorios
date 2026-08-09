'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { criarVistoria } from './actions';

export default function NovaVistoriaPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState('');
    
    const [cep, setCep] = useState('');
    const [buscandoCep, setBuscandoCep] = useState(false);
    const [rua, setRua] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');

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

    function formatarCep(value: string) {
        return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
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
        <main className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--bg)' }}>
            <div 
                className="max-w-2xl mx-auto p-6 md:p-8 rounded-xl shadow-lg border-2" 
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
                <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>Nova Vistoria</h1>

                {erro && (
                    <div className="mb-4 p-4 rounded-lg text-sm font-medium border" style={{ backgroundColor: '#FEE2E2', border: '2px solid #FCA5A5', color: '#991B1B' }}>
                        {erro}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>Tipo *</label>
                            <select 
                                name="tipo" 
                                required 
                                className="w-full p-4 rounded-lg text-base"
                                style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                            >
                                <option value="ENTRADA">Entrada</option>
                                <option value="SAIDA">Saída</option>
                                <option value="CAPTACAO">Captação</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>Data *</label>
                            <input 
                                type="date" 
                                name="data_vistoria" 
                                required 
                                defaultValue={new Date().toISOString().split('T')[0]} 
                                className="w-full p-4 rounded-lg text-base"
                                style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>Nome do Proprietário/Cliente *</label>
                            <input 
                                type="text" 
                                name="nome_cliente" 
                                required 
                                placeholder="Ex: João da Silva" 
                                className="w-full p-4 rounded-lg text-base"
                                style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>Nome do Locatário/Inquilino</label>
                            <input 
                                type="text" 
                                name="nome_locatario" 
                                placeholder="Ex: Maria Oliveira" 
                                className="w-full p-4 rounded-lg text-base"
                                style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                            />
                        </div>
                    </div>

                    <div className="pt-5 mt-5" style={{ borderTop: '2px solid var(--border)' }}>
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>Endereço do Imóvel</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>CEP *</label>
                                <input 
                                    type="text" 
                                    name="endereco_cep"
                                    value={cep}
                                    required
                                    placeholder="00000-000"
                                    maxLength={9}
                                    onChange={(e) => setCep(formatarCep(e.target.value))}
                                    onBlur={() => buscarEnderecoPorCep(cep)}
                                    className="w-full p-4 rounded-lg text-base"
                                    style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                                />
                                {buscandoCep && <p className="text-sm mt-2 font-medium" style={{ color: 'var(--primary)' }}>Buscando endereço...</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>Rua / Logradouro *</label>
                                <input 
                                    type="text" 
                                    name="endereco_rua" 
                                    value={rua} 
                                    required 
                                    onChange={(e) => setRua(e.target.value)} 
                                    className="w-full p-4 rounded-lg text-base"
                                    style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="md:col-span-1">
                                <label className="block text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>Bairro *</label>
                                <input 
                                    type="text" 
                                    name="endereco_bairro" 
                                    value={bairro} 
                                    required 
                                    onChange={(e) => setBairro(e.target.value)} 
                                    className="w-full p-4 rounded-lg text-base"
                                    style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>Cidade / UF *</label>
                                <input 
                                    type="text" 
                                    name="endereco_cidade" 
                                    value={cidade} 
                                    required 
                                    onChange={(e) => setCidade(e.target.value)} 
                                    className="w-full p-4 rounded-lg text-base"
                                    style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>Número *</label>
                                <input 
                                    type="text" 
                                    name="endereco_numero" 
                                    required 
                                    placeholder="Ex: 123" 
                                    className="w-full p-4 rounded-lg text-base"
                                    style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>Complemento</label>
                                <input 
                                    type="text" 
                                    name="endereco_complemento" 
                                    placeholder="Ex: Apto 101, Bloco B" 
                                    className="w-full p-4 rounded-lg text-base"
                                    style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-8">
                        <button 
                            type="button" 
                            onClick={() => router.back()} 
                            className="vr-btn-ghost flex-1 px-4 py-4 rounded-lg font-semibold text-base border-2"
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="vr-btn-primary flex-1 px-4 py-4 text-white rounded-lg font-semibold text-base shadow-md disabled:opacity-50"
                            style={{ backgroundColor: 'var(--primary)' }}
                        >
                            {isLoading ? 'Salvando...' : 'Criar Vistoria'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}