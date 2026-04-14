import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function useTestResultSaver(testType: string) {
  const savedSlugRef = useRef<string | null>(null);

  const saveResult = useCallback(async (
    responses: unknown,
    scores?: unknown,
  ): Promise<string> => {
    // Prevent double-saves
    if (savedSlugRef.current) return savedSlugRef.current;

    const slug = generateSlug();
    savedSlugRef.current = slug;

    await supabase.from('test_results').insert({
      test_type: testType,
      slug,
      responses: responses as any,
      scores: (scores ?? null) as any,
    });

    return slug;
  }, [testType]);

  return { saveResult, savedSlug: savedSlugRef.current };
}
