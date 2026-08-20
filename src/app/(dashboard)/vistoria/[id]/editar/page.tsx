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

    // Buscar fotos da vistoria
    const { data: fotos } = await supabase
        .from('fotos')
        .select('*')
        .eq('vistoria_id', vistoriaId)
        .order('ordem', { ascending: true });

    return (
        <main className="min-h-screen pb-20" style={{ backgroundColor: 'var(--bg)' }}>
            {/* Header */}
            <header className="p-4 shadow-sm flex items-center" style={{ backgroundColor: 'var(--surface)' }}>
                <a href={`/vistoria/${vistoria.id}`} className="mr-4 font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    ← Voltar
                </a>
                <div className="flex-1">
                    <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Editar Vistoria</h1>
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{vistoria.endereco_rua}, {vistoria.endereco_numero}</p>
                </div>
            </header>

            {/* Componente Cliente Interativo */}
            <EditarVistoriaClient vistoria={vistoria} comodos={comodos || []} fotos={fotos || []} />
        </main>
    );
}