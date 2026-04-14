
CREATE TABLE public.financial_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  answers JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.financial_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view results by slug"
ON public.financial_test_results
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert results"
ON public.financial_test_results
FOR INSERT
WITH CHECK (true);

CREATE INDEX idx_financial_test_results_slug ON public.financial_test_results (slug);
