/**
 * GitHub Contents API: read and update JSON files in the repo.
 * Requires GITHUB_TOKEN (repo scope) and GITHUB_REPO (owner/repo).
 */

const GITHUB_API = 'https://api.github.com';

function getAuthHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not set');
  return {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${token}`,
  };
}

function getRepo(): { owner: string; repo: string } {
  const repo = process.env.GITHUB_REPO; // "owner/repo"
  if (!repo || !repo.includes('/')) throw new Error('GITHUB_REPO must be owner/repo');
  const [owner, repoName] = repo.split('/');
  return { owner, repo: repoName };
}

export interface GitHubFile {
  content: string;
  sha: string;
}

export async function getFile(path: string): Promise<GitHubFile> {
  const { owner, repo } = getRepo();
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    { headers: getAuthHeaders() }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub getFile failed (${res.status}): ${err}`);
  }
  const data = await res.json();
  if (data.content === undefined || data.sha === undefined)
    throw new Error('Invalid GitHub response');
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { content, sha: data.sha };
}

export async function updateFile(
  path: string,
  content: string,
  message: string,
  sha: string
): Promise<void> {
  const { owner, repo } = getRepo();
  const body = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    sha,
  };
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub updateFile failed (${res.status}): ${err}`);
  }
}

/** Create a new file in the repo (no sha). Use for uploads. */
export async function createFile(
  path: string,
  contentBase64: string,
  message: string
): Promise<void> {
  const { owner, repo } = getRepo();
  const body = { message, content: contentBase64 };
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub createFile failed (${res.status}): ${err}`);
  }
}
