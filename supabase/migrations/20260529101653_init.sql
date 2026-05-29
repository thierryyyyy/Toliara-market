-- ============================================
-- Migration générée par Constructor v13
-- Date: 2026-05-29T10:16:53.141Z
-- ============================================

-- TYPES ENUM
-- ============================================
CREATE TYPE priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE nc_severity AS ENUM ('minor', 'major', 'critical');
CREATE TYPE document_status AS ENUM ('draft', 'review', 'approved', 'archived');

-- TABLES
-- ============================================

-- Utilisateurs de l'application
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user',
  department TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_read_all ON users FOR SELECT TO authenticated, anon USING (true);

-- Gestion documentaire
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  version TEXT NOT NULL DEFAULT '1.0',
  status TEXT NOT NULL DEFAULT 'draft',
  file_url TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  approved_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  revision_date DATE NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_status ON documents (status);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents (type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_reference ON documents (reference);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY documents_read_all ON documents FOR SELECT TO authenticated, anon USING (true);

-- Non-conformités détectées
CREATE TABLE IF NOT EXISTS non_conformities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'minor',
  status TEXT NOT NULL DEFAULT 'open',
  detected_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  root_cause TEXT NOT NULL,
  detected_date DATE NOT NULL DEFAULT CURRENT_DATE,
  resolved_date DATE NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_non_conformities_status ON non_conformities (status);
CREATE INDEX IF NOT EXISTS idx_non_conformities_severity ON non_conformities (severity);

ALTER TABLE non_conformities ENABLE ROW LEVEL SECURITY;

CREATE POLICY nc_read_all ON non_conformities FOR SELECT TO authenticated, anon USING (true);

-- Indicateurs de performance / KPIs
CREATE TABLE IF NOT EXISTS indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  target NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  trend TEXT NOT NULL,
  period TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_indicators_category ON indicators (category);

ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY indicators_read_all ON indicators FOR SELECT TO authenticated, anon USING (true);

-- Paramètres de l'application
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY settings_read_all ON settings FOR SELECT TO authenticated, anon USING (true);