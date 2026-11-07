import { readFileSync } from 'node:fs';
import { expect, it, vi } from 'vitest';
import ts from 'typescript';

function harness(ips: string[] = ['93.184.216.34'], redirect?: string) {
  const code = ts.transpileModule(
    readFileSync('supabase/functions/_shared/safeFetch.ts', 'utf8').replace(/^export /gm, ''),
    { compilerOptions: { target: ts.ScriptTarget.ES2022 } },
  ).outputText;
  const fetcher = vi.fn(async () => redirect
    ? new Response(null, { status: 302, headers: { location: redirect } })
    : new Response('image'));
  const safeFetch = new Function('Deno', 'fetch', `${code};return safeFetch;`)(
    { resolveDns: async () => ips }, fetcher,
  ) as (url: string) => Promise<Response>;
  return { safeFetch, fetcher };
}

for (const address of ['127.0.0.1', '10.0.0.1', '169.254.169.254', '192.168.1.1', '100.64.0.1', '198.18.0.1', '[::1]', '[::ffff:127.0.0.1]']) {
  it(`rejects internal destination ${address} before fetching`, async () => {
    const { safeFetch, fetcher } = harness();
    await expect(safeFetch(`http://${address}/image`)).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });
}
it('rejects a public hostname resolving to an internal address', async () => {
  const { safeFetch, fetcher } = harness(['10.0.0.1']);
  await expect(safeFetch('https://images.example.test/image')).rejects.toThrow();
  expect(fetcher).not.toHaveBeenCalled();
});
it('fails closed when DNS cannot resolve a hostname', async () => {
  const { safeFetch, fetcher } = harness([]);
  await expect(safeFetch('https://images.example.test/image')).rejects.toThrow();
  expect(fetcher).not.toHaveBeenCalled();
});
it('rejects redirect to internal destination without following it', async () => {
  const { safeFetch, fetcher } = harness(undefined, 'http://169.254.169.254/');
  await expect(safeFetch('https://images.example.test/image')).rejects.toThrow();
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it('keeps public image fetches working', async () => {
  const { safeFetch, fetcher } = harness();
  expect(await (await safeFetch('https://images.example.test/image')).text()).toBe('image');
  expect(fetcher).toHaveBeenCalledTimes(1);
});