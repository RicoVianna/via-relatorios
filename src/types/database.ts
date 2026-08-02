export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    nome_completo: string;
                    creci: string | null;
                    telefone: string | null;
                    email: string;
                    logo_url: string | null;
                    plano: 'GRATUITO' | 'PRO';
                    relatorios_usados_mes: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    nome_completo: string;
                    creci?: string | null;
                    telefone?: string | null;
                    email: string;
                    logo_url?: string | null;
                    plano?: 'GRATUITO' | 'PRO';
                    relatorios_usados_mes?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    nome_completo?: string;
                    creci?: string | null;
                    telefone?: string | null;
                    email?: string;
                    logo_url?: string | null;
                    plano?: 'GRATUITO' | 'PRO';
                    relatorios_usados_mes?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            vistorias: {
                Row: {
                    id: string;
                    user_id: string;
                    tipo: 'ENTRADA' | 'SAIDA' | 'CAPTACAO';
                    status: 'RASCUNHO' | 'FINALIZADO';
                    endereco_rua: string;
                    endereco_numero: string | null;
                    endereco_bairro: string | null;
                    endereco_cidade: string | null;
                    nome_cliente: string | null;
                    data_vistoria: string;
                    pdf_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    tipo?: 'ENTRADA' | 'SAIDA' | 'CAPTACAO';
                    status?: 'RASCUNHO' | 'FINALIZADO';
                    endereco_rua: string;
                    endereco_numero?: string | null;
                    endereco_bairro?: string | null;
                    endereco_cidade?: string | null;
                    nome_cliente?: string | null;
                    data_vistoria?: string;
                    pdf_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    tipo?: 'ENTRADA' | 'SAIDA' | 'CAPTACAO';
                    status?: 'RASCUNHO' | 'FINALIZADO';
                    endereco_rua?: string;
                    endereco_numero?: string | null;
                    endereco_bairro?: string | null;
                    endereco_cidade?: string | null;
                    nome_cliente?: string | null;
                    data_vistoria?: string;
                    pdf_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            comodos: {
                Row: {
                    id: string;
                    vistoria_id: string;
                    nome_comodo: string;
                    descricao_bruta: string | null;
                    descricao_processada_ia: string | null;
                    ordem: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    vistoria_id: string;
                    nome_comodo: string;
                    descricao_bruta?: string | null;
                    descricao_processada_ia?: string | null;
                    ordem?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    vistoria_id?: string;
                    nome_comodo?: string;
                    descricao_bruta?: string | null;
                    descricao_processada_ia?: string | null;
                    ordem?: number;
                    created_at?: string;
                };
            };
            fotos_comodo: {
                Row: {
                    id: string;
                    comodo_id: string;
                    imagem_url: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    comodo_id: string;
                    imagem_url: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    comodo_id?: string;
                    imagem_url?: string;
                    created_at?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            user_plan: 'GRATUITO' | 'PRO';
            vistoria_type: 'ENTRADA' | 'SAIDA' | 'CAPTACAO';
            vistoria_status: 'RASCUNHO' | 'FINALIZADO';
        };
    };
}