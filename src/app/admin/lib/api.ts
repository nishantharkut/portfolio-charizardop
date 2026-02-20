/**
 * Admin API fetch helper: always parses error from response so the UI can show
 * server messages (e.g. "GITHUB_TOKEN is not set", "Unauthorized").
 */
export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<{ data: unknown }> {
  const r = await fetch(url, { ...options, credentials: 'include' });
  const text = await r.text();
  let data: { error?: string } = {};
  try {
    data = JSON.parse(text) as { error?: string };
  } catch {
    // non-JSON response (e.g. HTML error page)
  }
  if (!r.ok) {
    const msg =
      data?.error ||
      r.statusText ||
      (text.slice(0, 300) || 'Request failed');
    throw new Error(msg);
  }
  return { data };
}
