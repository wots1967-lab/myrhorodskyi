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

    // Use SECURITY DEFINER RPC — anon can only fetch a single row by slug,
    // not enumerate the table.
    const generic = await supabase.rpc("get_test_result_by_slug", { _slug: slug });
    const genericRow = Array.isArray(generic.data) ? generic.data[0] : generic.data;

    if (genericRow) {
      return {
        content: [
          {
            type: "text",
            text: `Result for ${genericRow.test_type} (slug ${slug}):\n${JSON.stringify(
              { scores: genericRow.scores, responses: genericRow.responses },
              null,
              2,
            )}`,
          },
        ],
        structuredContent: { source: "test_results", result: genericRow },
      };
    }

    // Fallback: legacy financial_test_results table (also via RPC)
    const fin = await supabase.rpc("get_financial_result_by_slug", { _slug: slug });
    const finRow = Array.isArray(fin.data) ? fin.data[0] : fin.data;

    if (finRow) {
      return {
        content: [
          {
            type: "text",
            text: `Financial test result (slug ${slug}):\n${JSON.stringify(finRow.answers, null, 2)}`,
          },
        ],
        structuredContent: { source: "financial_test_results", result: finRow },
      };
    }

    return {
      content: [{ type: "text", text: `No result found for slug '${slug}'.` }],
      isError: true,
    };
  },
});