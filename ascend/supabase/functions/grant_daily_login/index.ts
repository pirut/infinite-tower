// deno-lint-ignore-file no-explicit-any
export const handler = async (req: Request): Promise<Response> => {
  // TODO: implement streak and rewards
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};