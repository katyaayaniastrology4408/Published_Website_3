-- =====================================================
-- Payments Table Migration
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run
-- =====================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id               BIGSERIAL PRIMARY KEY,
  name             TEXT,
  email            TEXT,
  mobile           TEXT,
  amount           NUMERIC(10, 2),
  transaction_id   TEXT,
  payment_status   TEXT DEFAULT 'pending',   -- 'success' | 'failed' | 'pending'
  payment_date     TIMESTAMPTZ DEFAULT NOW(),
  reference_number TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_email          ON public.payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_status         ON public.payments(payment_status);

-- Enable RLS (service role bypasses it so API routes still work)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by Next.js API routes)
CREATE POLICY IF NOT EXISTS "Service role full access"
  ON public.payments
  FOR ALL
  USING (true)
  WITH CHECK (true);
