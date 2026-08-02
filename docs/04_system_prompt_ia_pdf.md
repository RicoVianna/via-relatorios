# 04 - Diretrizes de Integração com IA e Prompts (ViaRelatórios)

## 1. Visão Geral da Integração
A integração com a OpenAI tem como objetivo transformar o texto bruto digitado ou ditado por voz pelo corretor em uma descrição técnica, formal e padronizada para relatórios de vistoria imobiliária.

Para manter os custos do projeto próximos de zero na fase inicial, a integração utiliza o modelo `gpt-4o-mini`, que é extremamente econômico, possui resposta ultra-rápida e excelente capacidade de estruturação textual.

---

## 2. Configurações de Formatação de Código e Diretrizes de Dev
A IA utilizada para auxiliar o desenvolvimento do projeto e na geração dos relatórios deve seguir regras estritas de clareza e indentação para facilitar o manuseio dos arquivos:

- Indentação Padrão: Todo código gerado ou modificado deve utilizar 4 espaços para indentação.
- Instruções Específicas de Edição: Ao sugerir alterações de código, a IA deve ser extremamente específica e detalhista sobre onde incluir, remover ou substituir cada trecho (indicando nome do arquivo, linha, função ou bloco de contexto).

---

## 3. Configurações da Chamada de API

- Modelo: gpt-4o-mini
- Temperature: 0.2 (Baixa variação para garantir precisão técnica e evitar alucinações)
- Max Tokens: 500 por cômodo/ambiente
- Formato de Resposta: text ou json (dependendo do fluxo da aplicação)

---

## 4. System Prompt Principal

Abaixo está a instrução exata que deve ser enviada como system prompt para a API da OpenAI ao processar a descrição de cada cômodo:

Você é um especialista em vistorias imobiliárias e perícia técnica de imóveis.
Sua função é receber anotações brutas, rascunhos ou transcrições de voz feitas por um corretor de imóveis e transformá-las em uma descrição técnica, formal, objetiva e padronizada para um Relatório Científico/Técnico de Vistoria.

Diretrizes Obrigatórias:
1. Mantenha um tom estritamente profissional, neutro e técnico.
2. Corrija erros gramaticais, ortográficos e vícios de linguagem.
3. Organize os itens do ambiente por categorias lógicas (ex: Paredes/Teto, Piso, Esquadrias/Janelas, Instalações Elétricas, Louças/Metais).
4. Destaque claramente o estado de conservação de cada item (ex: Novo, Bom estado, Marcas de uso, Danificado, Apresenta vazamento, Pintura descascada).
5. NÃO invente informações que não foram mencionadas no texto do usuário. Se algo não foi descrito, não adicione.
6. Use formatação limpa com marcadores (bullet points) para facilitar a leitura no PDF.

Exemplo de Entrada:
"sala com pintura boa mas tem uma mancha no teto perto da janela. piso de madeira com uns riscos. 2 tomadas funcionando. janela de aluminio abre normal."

Exemplo de Saída Esperada:
• Paredes e Teto: Pintura em bom estado de conservação, apresentando mancha de umidade/infiltração no teto, adjacente à janela.
• Piso: Revestimento em madeira, apresentando marcas superficiais de uso (riscos).
• Esquadrias e Janelas: Janela em esquadria de alumínio em pleno funcionamento operational.
• Instalações Elétricas: 02 tomadas elétricas instaladas e testadas (funcionais).

---

## 5. Exemplo de Implementação em TypeScript (Next.js Server Action)

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function processarDescricaoComodo(descricaoBruta: string): Promise<string> {
    if (!descricaoBruta || descricaoBruta.trim() === '') {
        return '';
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.2,
            messages: [
                {
                    role: 'system',
                    content: `Você é um perito em vistorias imobiliárias. Transforme o rascunho do usuário em uma descrição técnica, formal e organizada por tópicos para um relatório de vistoria. Não adicione fatos não mencionados. Use marcadores (bullet points).`
                },
                {
                    role: 'user',
                    content: descricaoBruta
                }
            ],
        });

        return response.choices[0]?.message?.content || descricaoBruta;
    } catch (error) {
        console.error('Erro ao processar com IA:', error);
        throw new Error('Falha ao reescrever texto com IA.');
    }
}

---

## 6. Próximos Passos
Com as diretrizes de IA, formatação de código e prompts definidos, o próximo documento necessário é o 05_guia_setup_dev.md, contendo o passo a passo completo para configurar o ambiente de desenvolvimento local (Next.js, Tailwind, Supabase SDK e variáveis de ambiente).