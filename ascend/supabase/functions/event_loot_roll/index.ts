// deno-lint-ignore-file no-explicit-any
export const handler = async (_req: Request): Promise<Response> => {
  return new Response(JSON.stringify({ loot: [], ok: true }), { headers: { 'content-type': 'application/json' } });
};