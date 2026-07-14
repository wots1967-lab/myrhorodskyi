import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_test_result",
  title: "Отримати результат тесту за slug",
  description:
    "За унікальним slug результату (12-символьний ідентифікатор із URL сторінки результату) повертає збережені відповіді та бали психологічного тесту, пройденого на myrhorodskyi.com.",
  inputSchema: {
    slug: z
      .string()
      .describe("12-символьний slug зі сторінки результату, напр. 'a1b2c3d4e5f6'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const url = process.env.SUPABASE_URL;
    const anon = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
    if (!url || !anon) {
      return {
        content: [{ type: "text", text: "Supabase configuration missing." }],
        isError: true,
      };
    }
    const supabase = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Try the generic tests table first
    const generic = await supabase
      .from("test_results")
      .select("test_type, slug, responses, scores, created_at")
      .eq("slug", slug)
      .maybeSingle();

    if (generic.data) {
      return {
        content: [
          {
            type: "text",
            text: `Result for ${generic.data.test_type} (slug ${slug}):\n${JSON.stringify(
              { scores: generic.data.scores, responses: generic.data.responses },
              null,
              2,
            )}`,
          },
        ],
        structuredContent: { source: "test_results", result: generic.data },
      };
    }

    // Fallback: legacy financial_test_results table
    const fin = await supabase
      .from("financial_test_results")
      .select("slug, answers, created_at")
      .eq("slug", slug)
      .maybeSingle();

    if (fin.data) {
      return {
        content: [
          {
            type: "text",
            text: `Financial test result (slug ${slug}):\n${JSON.stringify(fin.data.answers, null, 2)}`,
          },
        ],
        structuredContent: { source: "financial_test_results", result: fin.data },
      };
    }

    return {
      content: [{ type: "text", text: `No result found for slug '${slug}'.` }],
      isError: true,
    };
  },
});