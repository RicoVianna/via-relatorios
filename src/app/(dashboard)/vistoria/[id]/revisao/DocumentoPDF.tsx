import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Registrando uma fonte padrão para evitar problemas de acentuação no PDF
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
});

const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Roboto', fontSize: 11 },
    header: { marginBottom: 20, borderBottom: 2, borderColor: '#2563EB', paddingBottom: 10 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 5 },
    subtitle: { fontSize: 12, color: '#4B5563' },
    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#2563EB', marginBottom: 8, textTransform: 'uppercase' },
    row: { flexDirection: 'row', marginBottom: 4 },
    label: { width: 100, fontWeight: 'bold', color: '#4B5563' },
    value: { flex: 1, color: '#111827' },
    comodoBox: { marginBottom: 15, padding: 10, backgroundColor: '#F9FAFB', borderRadius: 4, border: '1pt solid #E5E7EB' },
    comodoTitle: { fontSize: 12, fontWeight: 'bold', color: '#111827', marginBottom: 5 },
    comodoText: { fontSize: 10, color: '#374151', lineHeight: 1.5 },
    fotoBox: { marginBottom: 10, padding: 8, backgroundColor: '#FFFFFF', borderRadius: 4, border: '1pt solid #E5E7EB' },
    fotoImg: { width: '100%', height: 220, objectFit: 'contain', borderRadius: 4, marginBottom: 6 },
    fotoTitle: { fontSize: 10, fontWeight: 'bold', color: '#374151', marginTop: 6, marginBottom: 2 },
    fotoLegenda: { fontSize: 9, color: '#6B7280', marginTop: 2 },
    footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', color: '#9CA3AF', fontSize: 9, borderTop: '1pt solid #E5E7EB', paddingTop: 10 }
});

// Calcula o tamanho exibido da foto mantendo a proporção real
function tamanhoFoto(foto: any) {
    const maxW = 500;
    const maxH = 260;
    const w = foto.largura || 1000;
    const h = foto.altura || 1000;
    const escala = Math.min(maxW / w, maxH / h);
    return { width: Math.round(w * escala), height: Math.round(h * escala) };
}

export default function DocumentoPDF({ vistoria, comodos, fotos, profile }: { vistoria: any; comodos: any[]; fotos?: any[]; profile?: any }) {
    const tipoFormatado = vistoria.tipo === 'ENTRADA' ? 'Entrada' : vistoria.tipo === 'SAIDA' ? 'Saída' : 'Captação';

    // Grupos de cômodos que têm fotos (para colar os títulos às fotos)
    const comodosComFotos = (comodos ?? [])
        .map((comodo: any) => ({
            comodo,
            fotosDoComodo: (fotos ?? []).filter((f: any) => f.comodo_id === comodo.id),
        }))
        .filter((grupo: any) => grupo.fotosDoComodo.length > 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <Text style={styles.title}>Laudo de Vistoria Imobiliária</Text>
                    <Text style={styles.subtitle}>
                        Gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                    </Text>
                </View>

                {/* Dados do Imóvel e Partes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Dados Gerais</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tipo:</Text>
                        <Text style={styles.value}>{tipoFormatado}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Endereço:</Text>
                        <Text style={styles.value}>
                            {vistoria.endereco_rua}, {vistoria.endereco_numero} {vistoria.endereco_complemento ? `- ${vistoria.endereco_complemento}` : ''}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Bairro/Cidade:</Text>
                        <Text style={styles.value}>{vistoria.endereco_bairro} - {vistoria.endereco_cidade}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Proprietário:</Text>
                        <Text style={styles.value}>{vistoria.nome_cliente || 'Não informado'}</Text>
                    </View>
                    {vistoria.nome_locatario && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Inquilino:</Text>
                            <Text style={styles.value}>{vistoria.nome_locatario}</Text>
                        </View>
                    )}
                    <View style={styles.row}>
                        <Text style={styles.label}>Data Vistoria:</Text>
                        <Text style={styles.value}>{new Date(vistoria.data_vistoria).toLocaleDateString('pt-BR')}</Text>
                    </View>
                </View>

                {/* Corretor Responsável */}
                {profile && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Corretor Responsável</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Nome:</Text>
                            <Text style={styles.value}>{profile.nome || 'Não informado'}</Text>
                        </View>
                        {profile.creci && (
                            <View style={styles.row}>
                                <Text style={styles.label}>CRECI:</Text>
                                <Text style={styles.value}>{profile.creci}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Cômodos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Detalhamento dos Cômodos</Text>
                    {comodos && comodos.length > 0 ? (
                        comodos.map((comodo: any, index: number) => (
                            <View key={comodo.id} style={styles.comodoBox} break={index > 0 && index % 4 === 0}>
                                <Text style={styles.comodoTitle}>{comodo.nome_comodo}</Text>
                                <Text style={styles.comodoText}>
                                    {comodo.descricao_processada_ia || comodo.descricao_bruta || 'Sem descrição registrada.'}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.comodoText}>Nenhum cômodo registrado nesta vistoria.</Text>
                    )}
                </View>

                {/* Registro Fotográfico */}
                {comodosComFotos.length > 0 && (
                    <View style={styles.section}>
                        {comodosComFotos.map((grupo: any, grupoIndex: number) => (
                            <View key={grupo.comodo.id}>
                                {/* Título da seção + título do cômodo + 1ª foto viajam juntos */}
                                <View wrap={false}>
                                    {grupoIndex === 0 && (
                                        <Text style={{ ...styles.sectionTitle, marginBottom: 12 }}>3. Registro Fotográfico</Text>
                                    )}
                                    <Text style={{ ...styles.comodoTitle, marginBottom: 10 }}>{grupo.comodo.nome_comodo}</Text>
                                    <View style={styles.fotoBox}>
                                        <Image src={grupo.fotosDoComodo[0].url} style={{ ...tamanhoFoto(grupo.fotosDoComodo[0]), alignSelf: 'center', marginBottom: 6, borderRadius: 4 }} />
                                        <Text style={styles.fotoTitle}>Foto 1</Text>
                                        {grupo.fotosDoComodo[0].legenda && (
                                            <Text style={styles.fotoLegenda}>Descrição: {grupo.fotosDoComodo[0].legenda}</Text>
                                        )}
                                    </View>
                                </View>
                                {/* Demais fotos: cards independentes */}
                                {grupo.fotosDoComodo.slice(1).map((foto: any, i: number) => (
                                    <View key={foto.id} style={styles.fotoBox} wrap={false}>
                                        <Image src={foto.url} style={{ ...tamanhoFoto(foto), alignSelf: 'center', marginBottom: 6, borderRadius: 4 }} />
                                        <Text style={styles.fotoTitle}>Foto {i + 2}</Text>
                                        {foto.legenda && (
                                            <Text style={styles.fotoLegenda}>Descrição: {foto.legenda}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Rodapé */}
                <Text style={styles.footer}>
                    Documento gerado eletronicamente pelo sistema Via Relatórios.
                </Text>
            </Page>
        </Document>
    );
}