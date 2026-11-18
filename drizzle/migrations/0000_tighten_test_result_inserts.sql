DROP POLICY IF EXISTS "Anyone can insert test results" ON public.test_results;
CREATE POLICY "Anyone can insert valid test results" ON public.test_results
FOR INSERT TO anon, authenticated
WITH CHECK (
  slug ~ '^[a-z0-9]{12}$'
  AND test_type ~ '^[a-z0-9-]{1,50}$'
  AND pg_column_size(responses) < 65536
  AND (scores IS NULL OR pg_column_size(scores) < 65536)
);

DROP POLICY IF EXISTS "Anyone can insert results" ON public.financial_test_results;
CREATE POLICY "Anyone can insert valid results" ON public.financial_test_results
FOR INSERT TO anon, authenticated
WITH CHECK (
  slug ~ '^[a-z0-9]{12}$'
  AND pg_column_size(answers) < 65536
);