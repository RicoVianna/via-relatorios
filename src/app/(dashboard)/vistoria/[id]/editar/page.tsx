import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditarVistoriaClient from './EditarVistoriaClient';

// Next.js 15: params deve ser tipado como Promise
export default async function EditarVistoriaPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    
    // Desempacotar o params com await
    const { id: vistoriaId } = await params;

    // Buscar dados da vistoria
    const { data: vistoria, error } = await supabase
        .from('vistorias')
        .select('*')
        .eq('id', vistoriaId)
        .single();

    if (error || !vistoria) {
        redirect('/dashboard');
    }

    // Buscar cômodos da vistoria
    const { data: comodos } = await supabase
        .from('comodos')
        .select('*')
        .eq('vistoria_id', vistoriaId)
        .order('ordem', { ascending: true });

    const { data: fotos } = await supabase
        .from('fotos')
        .select('*')
        .eq('vistoria_id', vistoriaId)
        .order('ordem', { ascending: true });

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex items-center">
                <a href={`/vistoria/${vistoria.id}`} className="text-gray-600 mr-4 hover:text-blue-600 transition-colors">
                    ← Voltar
                </a>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-900">Editar Vistoria</h1>
                    <p className="text-xs text-gray-500 truncate">{vistoria.endereco_rua}, {vistoria.endereco_numero}</p>
                </div>
            </header>

            {/* Componente Cliente Interativo */}
            <EditarVistoriaClient vistoria={vistoria} comodos={comodos || []} fotos={fotos || []} />
        </main>
    );
}