'use server';

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import DocumentoPDF from './revisao/DocumentoPDF';

export async function enviarLaudoPorEmail(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Não autorizado.' };

    const vistoriaId = formData.get('vistoria_id') as string;
    const destinatario = (formData.get('email') as string)?.trim();
    const mensagemPersonalizada = (formData.get('mensagem') as string)?.trim();

    if (!destinatario) return { error: 'Informe o e-mail de destino.' };

    const { data: vistoria } = await supabase
        .from('vistorias').select('*').eq('id', vistoriaId).eq('user_id', user.id).single();
    if (!vistoria) return { error: 'Vistoria não encontrada.' };
    if (vistoria.status !== 'FINALIZADO') return { error: 'Somente vistorias finalizadas podem ser enviadas.' };

    const { data: comodos } = await supabase.from('comodos').select('*').eq('vistoria_id', vistoriaId).order('criado_em', { ascending: true });
    const { data: fotos } = await supabase.from('fotos').select('*').eq('vistoria_id', vistoriaId).order('ordem', { ascending: true });
    const { data: profile } = await supabase.from('profiles').select('nome, creci').eq('id', user.id).single();

    // QR Code + link de validação (mesmo padrão do PDF da tela de revisão)
    let qrDataUrl: string | null = null;
    let linkValidacao: string | null = null;
    if (vistoria.codigo_validacao) {
        linkValidacao = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/laudo/${vistoria.codigo_validacao}`;
        qrDataUrl = await QRCode.toDataURL(linkValidacao, { width: 512, margin: 1 });
    }

    // Gera o PDF no servidor (com fotos, QR Code e tudo) e converte os bytes para base64
    let pdfBase64: string;
    try {
        const blob = await pdf(
            <DocumentoPDF
                vistoria={vistoria}
                comodos={comodos ?? []}
                fotos={fotos ?? []}
                profile={profile}
                qrDataUrl={qrDataUrl}
                linkValidacao={linkValidacao}
            />
        ).toBlob();
        const arrayBuffer = await blob.arrayBuffer();
        pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
    } catch (e) {
        console.error('Erro ao gerar PDF:', e);
        return { error: 'Erro ao gerar o PDF do laudo. Tente novamente.' };
    }

    const tipoTexto = vistoria.tipo === 'ENTRADA' ? 'Entrada' : vistoria.tipo === 'SAIDA' ? 'Saída' : 'Captação';

    const html = `
        <div style="font-family: Arial, sans-serif; color:#1F2937; max-width:600px; margin:0 auto;">
            <h2 style="color:#1B4332;">Via Relatórios — Laudo de Vistoria</h2>
            <p>Olá,</p>
            <p>Segue em anexo o <strong>Laudo de Vistoria de ${tipoTexto}</strong> do imóvel:</p>
            <p><strong>${vistoria.endereco_rua}, ${vistoria.endereco_numero}</strong>${vistoria.endereco_complemento ? ` - ${vistoria.endereco_complemento}` : ''}<br/>${vistoria.endereco_bairro} - ${vistoria.endereco_cidade}</p>
            ${mensagemPersonalizada ? `<p style="background:#F3F4F6; padding:12px; border-left:4px solid #1B4332;">${mensagemPersonalizada}</p>` : ''}
            ${linkValidacao ? `<p style="font-size:13px;">Validação de autenticidade: <a href="${linkValidacao}">${linkValidacao}</a></p>` : ''}
            <p style="color:#6B7280; font-size:12px; margin-top:24px;">Documento gerado eletronicamente pelo sistema Via Relatórios.</p>
        </div>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { error } = await resend.emails.send({
            from: 'Via Relatórios <onboarding@resend.dev>',
            to: destinatario,
            subject: `Laudo de Vistoria de ${tipoTexto} - ${vistoria.endereco_rua}, ${vistoria.endereco_numero}`,
            html,
            attachments: [{ filename: `laudo-${vistoria.codigo_validacao || vistoria.id}.pdf`, content: pdfBase64 }],
        });

        if (error) {
            console.error('Erro Resend:', error);
            return { error: 'Falha no envio. No plano gratuito, o e-mail só pode ser enviado para o endereço da sua conta Resend.' };
        }
        return { success: true };
    } catch (e) {
        console.error('Erro ao enviar e-mail:', e);
        return { error: 'Erro ao enviar o e-mail. Tente novamente.' };
    }
}