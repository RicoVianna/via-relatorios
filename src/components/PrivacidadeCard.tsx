import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function PrivacidadeCard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let termosAceitosEm: string | null = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('termos_aceitos_em')
            .eq('id', user.id)
            .single();
        termosAceitosEm = data?.termos_aceitos_em ?? null;
    }

    const dataFormatada = termosAceitosEm
        ? new Date(termosAceitosEm).toLocaleDateString('pt-BR')
        : null;

    return (
        <section className="px-4 pb-8 max-w-2xl mx-auto w-full">
            <div className="rounded-xl border-2 p-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Privacidade</h2>
                {dataFormatada ? (
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Você aceitou os Termos de Uso e a Política de Privacidade em {dataFormatada}.
                    </p>
                ) : (
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Sua conta foi criada antes da atualização dos nossos termos.
                    </p>
                )}
                <div className="flex gap-4 text-sm">
                    <Link href="/termos-de-uso" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: 'var(--primary)' }}>
                        Ler Termos de Uso
                    </Link>
                    <Link href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: 'var(--primary)' }}>
                        Ler Política de Privacidade
                    </Link>
                </div>
            </div>
        </section>
    );
}