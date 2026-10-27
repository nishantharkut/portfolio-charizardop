import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.scss',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
]);
const legacyDomains = [
  `nishantharkut.${'dev'}`,
  `nishantharkut.${'com'}`,
  `nishant.${'dev'}`,
];
const canonicalOrigin = 'https://www.nishantharkut.tech';

const trackedFiles = execFileSync('git', ['ls-files', '-z'], {
  cwd: repositoryRoot,
  encoding: 'utf8',
})
  .split('\0')
  .filter(Boolean)
  .filter((file) => textExtensions.has(path.extname(file)));

const violations = [];
for (const file of trackedFiles) {
  const content = readFileSync(path.join(repositoryRoot, file), 'utf8');
  content.split(/\r?\n/).forEach((line, index) => {
    if (legacyDomains.some((domain) => line.includes(domain))) {
      violations.push(`${file}:${index + 1}`);
    }
  });
}

assert.deepEqual(
  violations,
  [],
  `Legacy portfolio domains remain in:\n${violations.join('\n')}`,
);

for (const file of [
  'src/app/layout.tsx',
  'src/app/robots.ts',
  'src/app/sitemap.ts',
]) {
  const content = readFileSync(path.join(repositoryRoot, file), 'utf8');
  assert.ok(
    content.includes(canonicalOrigin),
    `${file} must use ${canonicalOrigin}`,
  );
}

const middleware = readFileSync(
  path.join(repositoryRoot, 'src/middleware.ts'),
  'utf8',
);
assert.match(middleware, /APEX_HOST = ["']nishantharkut\.tech["']/);
assert.match(middleware, /CANONICAL_HOST = ["']www\.nishantharkut\.tech["']/);

console.log('Portfolio domain migration verification passed');
