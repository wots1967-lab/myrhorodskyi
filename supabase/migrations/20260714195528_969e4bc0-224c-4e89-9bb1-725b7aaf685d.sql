
-- 1) Drop the permissive public SELECT policies (they exposed all rows to anon)
DROP POLICY IF EXISTS "Anyone can view test results by slug" ON public.test_results;
DROP POLICY IF EXISTS "Anyone can view results by slug" ON public.financial_test_results;

-- 2) Revoke direct SELECT from anon/authenticated on the tables.
--    service_role keeps ALL for admin/edge-function access.
REVOKE SELECT ON public.test_results FROM anon, authenticated;
REVOKE SELECT ON public.financial_test_results FROM anon, authenticated;
GRANT ALL ON public.test_results TO service_role;
GRANT ALL ON public.financial_test_results TO service_role;

-- 3) SECURITY DEFINER RPCs that require a slug and return at most one row.
--    They cannot be used to enumerate the table because the slug is required
--    and there is no wildcard access.
CREATE OR REPLACE FUNCTION public.get_test_result_by_slug(_slug text)
RETURNS TABLE (
  test_type text,
  slug text,
  responses jsonb,
  scores jsonb,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tr.test_type, tr.slug, tr.responses, tr.scores, tr.created_at
  FROM public.test_results tr
  WHERE tr.slug = _slug
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_financial_result_by_slug(_slug text)
RETURNS TABLE (
  slug text,
  answers jsonb,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT fr.slug, fr.answers, fr.created_at
  FROM public.financial_test_results fr
  WHERE fr.slug = _slug
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_test_result_by_slug(text) FROM public;
REVOKE ALL ON FUNCTION public.get_financial_result_by_slug(text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_test_result_by_slug(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_financial_result_by_slug(text) TO anon, authenticated, service_role;
