import { readFileSync } from 'node:fs';
import { describe, it, expect, vi } from 'vitest';
import ts from 'typescript';

type Handler = (request: Request) => Promise<Response>;
const guarded = [
  'ai-detection-score', 'generate-from-urls', 'generate-front-cover',
  'generate-chapter-images', 'agent-category-finder', 'autofill-target-promise',
  'v3-generate-outline', 'agent-kids-kdp-metadata', 'analyze-book-title',
  'generate-cover-prompt', 'generate-aquarium-image', 'book-memory-extract',
  'generate-ab-variants',
];

function loadHandler(name: string, signedIn = false, client?: unknown) {
  let handler: Handler | undefined;
  const source = readFileSync(`supabase/functions/${name}/index.ts`, 'utf8');
  const stripped = source.replace(/^import[\s\S]*?;\s*$/gm, '');
  const code = ts.transpileModule(stripped, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
  }).outputText.replace(/^export /gm, '');
  const provider = vi.fn(async () => new Response('{}', { status: 502 }));
  const capture = (value: Handler) => { handler = value; };
  const requireUser = vi.fn(async () => signedIn
    ? { id: 'test-user', email: null }
    : new Response(JSON.stringify({ error: 'Connexion requise.' }), { status: 401 }));
  const storage = vi.fn(() => client);
  const resend = class { emails = { send: provider }; };
  new Function('serve', 'Deno', 'requireUser', 'isAdmin', 'fetch', 'createClient',
    'Resend', 'EMAIL_SENDING_ENABLED', `const importedCorsHeaders = {};\n${code.replace(/\bcorsHeaders\b/g, source.includes('const corsHeaders') ? 'corsHeaders' : 'importedCorsHeaders')}`)(
    capture, { serve: capture, env: { get: () => undefined } }, requireUser,
    async () => false, provider, storage, resend, false,
  );
  if (!handler) throw new Error(`No handler registered for ${name}`);
  return { handler, provider, storage };
}

describe('Paid handlers require a verified identity before side effects', () => {
  for (const name of guarded) {
    it(`${name} denies anonymous callers without provider or storage calls`, async () => {
      const { handler, provider, storage } = loadHandler(name);
      const result = await handler(new Request('https://app.test', {
        method: 'POST', body: '{}',
      }));
      expect(result.status).toBe(401);
      expect(provider).not.toHaveBeenCalled();
      expect(storage).not.toHaveBeenCalled();
    });
  }
});

describe('Subscriber BYOK is never replaced by operator keys', () => {
  for (const step of ['full', 'next', 'enrich']) {
    it(`outline ${step} refuses a missing personal key`, async () => {
      const { handler, provider } = loadHandler('v3-generate-outline', true);
      const result = await handler(new Request('https://app.test', {
        method: 'POST', body: JSON.stringify({ title: 'Un guide pratique', step }),
      }));
      expect(result.status).toBe(400);
      expect(provider).not.toHaveBeenCalled();
    });
  }
  it('target/promise refuses a missing subscriber key', async () => {
    const { handler, provider } = loadHandler('autofill-target-promise', true);
    const result = await handler(new Request('https://app.test', {
      method: 'POST', body: JSON.stringify({ title: 'Un guide pratique' }),
    }));
    expect(result.status).toBe(400);
    expect(provider).not.toHaveBeenCalled();
  });
});

describe('Public signup cannot rewrite existing customer records', () => {
  for (const name of ['free-trial-signup', 'redeem-beta-code', 'quiz-lead']) {
    it(`${name} leaves an existing record untouched and sends nothing`, async () => {
      const update = vi.fn();
      const insert = vi.fn();
      const chain = {
        select: () => chain, eq: () => chain, ilike: () => chain,
        maybeSingle: async () => ({ data: { id: 'existing-account' }, error: null }),
        update, insert,
      };
      const { handler, provider } = loadHandler(name, false, { from: () => chain });
      const result = await handler(new Request('https://app.test', {
        method: 'POST', body: JSON.stringify({ email: 'customer@example.invalid', code: 'INVALID' }),
      }));
      expect(result.status).toBe(200);
      expect(update).not.toHaveBeenCalled();
      expect(insert).not.toHaveBeenCalled();
      expect(provider).not.toHaveBeenCalled();
      expect(await result.json()).not.toHaveProperty('access_code');
    });
  }
});