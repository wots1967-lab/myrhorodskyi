
CREATE TABLE public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_type TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  responses JSONB NOT NULL DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view test results by slug"
ON public.test_results
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert test results"
ON public.test_results
FOR INSERT
WITH CHECK (true);

CREATE INDEX idx_test_results_slug ON public.test_results (slug);
CREATE INDEX idx_test_results_test_type ON public.test_results (test_type);
