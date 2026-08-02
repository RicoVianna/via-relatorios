# 03 - Arquitetura de Banco de Dados Supabase (ViaRelatórios)

## 1. Visão Geral da Modelagem
O banco de dados do **ViaRelatórios** é estruturado no PostgreSQL do Supabase. A arquitetura foi projetada para garantir isolamento total de dados entre os usuários (Row Level Security - RLS), alta performance de leitura no celular e suporte para o plano Freemium/Pro.

---

## 2. Diagrama de Relacionamento de Entidades (ERD)

- `auth.users` (Supabase Auth)
  - 1:1 com `profiles` (Dados do Corretor / Plano / Logo)
    - 1:N com `vistorias` (Imóvel / Tipo / Cliente / PDF)
      - 1:N com `comodos` (Ambientes / Descrição IA)
        - 1:N com `fotos_comodo` (URLs das imagens no Supabase Storage)

---

## 3. Script SQL Completo (Executar no SQL Editor do Supabase)

```sql
-- ==========================================
-- 1. ENUMS E TIPOS CUSTOMIZADOS
-- ==========================================
CREATE TYPE user_plan AS ENUM ('GRATUITO', 'PRO');
CREATE TYPE vistoria_type AS ENUM ('ENTRADA', 'SAIDA', 'CAPTACAO');
CREATE TYPE vistoria_status AS ENUM ('RASCUNHO', 'FINALIZADO');

-- ==========================================
-- 2. TABELA DE PERFIS DOS CORRETORES (profiles)
-- ==========================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_completo VARCHAR(255) NOT NULL,
    creci VARCHAR(50),
    telefone VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    logo_url TEXT,
    plano user_plan DEFAULT 'GRATUITO'::user_plan,
    relatorios_usados_mes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para criar perfil automaticamente ao cadastrar no Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$ BEGIN   INSERT INTO public.profiles (id, email, nome_completo)   VALUES (     new.id,     new.email,     COALESCE(new.raw_user_meta_data->>'full_name', 'Corretor')   );   RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 3. TABELA DE VISTORIAS / RELATÓRIOS (vistorias)
-- ==========================================
CREATE TABLE public.vistorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tipo vistoria_type NOT NULL DEFAULT 'ENTRADA'::vistoria_type,
    status vistoria_status NOT NULL DEFAULT 'RASCUNHO'::vistoria_status,
    
    -- Dados do Imóvel e Cliente
    endereco_rua VARCHAR(255) NOT NULL,
    endereco_numero VARCHAR(50),
    endereco_bairro VARCHAR(100),
    endereco_cidade VARCHAR(100),
    nome_cliente VARCHAR(255),
    data_vistoria DATE DEFAULT CURRENT_DATE,
    
    -- URLs de exportação
    pdf_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. TABELA DE CÔMODOS DO IMÓVEL (comodos)
-- ==========================================
CREATE TABLE public.comodos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vistoria_id UUID NOT NULL REFERENCES public.vistorias(id) ON DELETE CASCADE,
    nome_comodo VARCHAR(100) NOT NULL, -- Ex: Sala, Cozinha, Quarto 1
    descricao_bruta TEXT,              -- Rascunho do corretor / ditado por voz
    descricao_processada_ia TEXT,     -- Texto melhorado pela OpenAI
    ordem INT DEFAULT 0,               -- Ordem de exibição no relatório
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. TABELA DE FOTOS POR CÔMODO (fotos_comodo)
-- ==========================================
CREATE TABLE public.fotos_comodo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comodo_id UUID NOT NULL REFERENCES public.comodos(id) ON DELETE CASCADE,
    imagem_url TEXT NOT NULL,         -- Caminho/URL no Supabase Storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 6. POLÍTICAS DE SEGURANÇA (Row Level Security - RLS)
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vistorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comodos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotos_comodo ENABLE ROW LEVEL SECURITY;

-- Políticas para PROFILES (O usuário só vê e edita o próprio perfil)
CREATE POLICY "Usuários podem ver seu próprio perfil" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para VISTORIAS (O usuário só acessa suas próprias vistorias)
CREATE POLICY "Usuários podem ver suas próprias vistorias" 
  ON public.vistorias FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias vistorias" 
  ON public.vistorias FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias vistorias" 
  ON public.vistorias FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias vistorias" 
  ON public.vistorias FOR DELETE USING (auth.uid() = user_id);

-- Políticas para CÔMODOS (Baseadas na posse da vistoria pai)
CREATE POLICY "Acesso aos cômodos do próprio usuário" 
  ON public.comodos FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.vistorias 
      WHERE vistorias.id = comodos.vistoria_id AND vistorias.user_id = auth.uid()
    )
  );

-- Políticas para FOTOS (Baseadas na posse do cômodo pai)
CREATE POLICY "Acesso às fotos do próprio usuário" 
  ON public.fotos_comodo FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.comodos
      JOIN public.vistorias ON vistorias.id = comodos.vistoria_id
      WHERE comodos.id = fotos_comodo.comodo_id AND vistorias.user_id = auth.uid()
    )
  );

-- ==========================================
-- 7. CONFIGURAÇÃO DE BUCKETS NO SUPABASE STORAGE
-- ==========================================
-- NOTA: Executar via interface do Supabase Storage ou script de buckets:
-- 1. Bucket 'logos': público (para armazenar marcas d'água e logos dos corretores).
-- 2. Bucket 'fotos-vistorias': privado (para armazenar imagens dos cômodos).