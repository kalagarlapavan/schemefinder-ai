-- SchemeFinder AI - Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schemes table
CREATE TABLE IF NOT EXISTS schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    -- Eligibility fields
    min_age INTEGER DEFAULT 0,
    max_age INTEGER DEFAULT 120,
    max_annual_income BIGINT DEFAULT 9999999999,
    eligible_occupations TEXT[] DEFAULT ARRAY['all'],
    eligible_states TEXT[] DEFAULT ARRAY['all'],
    eligible_education TEXT[] DEFAULT ARRAY['all'],
    -- Benefits and application
    benefits TEXT NOT NULL,
    documents_required TEXT[] NOT NULL,
    application_procedure TEXT NOT NULL,
    official_url TEXT NOT NULL,
    source_url TEXT NOT NULL,
    -- Metadata
    is_central BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat sessions table (optional logging)
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    assistant_response TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eligibility checks log (optional)
CREATE TABLE IF NOT EXISTS eligibility_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    age INTEGER,
    state TEXT,
    occupation TEXT,
    annual_income BIGINT,
    education TEXT,
    matched_scheme_ids UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster filtering
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
CREATE INDEX IF NOT EXISTS idx_schemes_is_active ON schemes(is_active);
