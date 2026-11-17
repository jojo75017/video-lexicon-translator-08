/** FunctionsHttpError keeps the useful JSON message in its response, not its message. */
export async function edgeFunctionError(error: unknown, data?: { error?: string }): Promise<string> {
  if (data?.error) return data.error;
  const failure = error as { context?: Response; message?: string } | null;
  if (failure?.context && typeof failure.context.clone === 'function') {
    try {
      const body = await failure.context.clone().json();
      if (typeof body.error === 'string') return body.error;
    } catch { /* A non-JSON response uses the fallback. */ }
  }
  return failure?.message || 'Le service de relecture est indisponible.';
}