import { describe, it, expect } from 'vitest';

// Extracted from server/routes/inbox.ts for testability
function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname) return parsed.hostname;
  } catch {
    // fall through to regex
  }
  return url.replace(/^https?:\/\//, '').replace(/[:/].*$/, '');
}

describe('extractDomain', () => {
  it('extracts hostname from https URL', () => {
    expect(extractDomain('https://deveco.io')).toBe('deveco.io');
  });

  it('strips trailing slash', () => {
    expect(extractDomain('https://deveco.io/')).toBe('deveco.io');
  });

  it('strips port', () => {
    expect(extractDomain('https://deveco.io:443')).toBe('deveco.io');
  });

  it('strips path', () => {
    expect(extractDomain('https://deveco.io/api/inbox')).toBe('deveco.io');
  });

  it('handles http scheme', () => {
    expect(extractDomain('http://localhost:3000')).toBe('localhost');
  });

  it('handles bare domain fallback', () => {
    expect(extractDomain('deveco.io')).toBe('deveco.io');
  });

  it('handles bare domain with port via fallback regex', () => {
    // 'deveco.io:3000' is not a valid URL (no scheme), falls back to regex
    // The regex strips everything after the colon
    const result = extractDomain('deveco.io:3000');
    // new URL('deveco.io:3000') treats 'deveco.io' as the scheme, so hostname is empty
    // Fallback regex: 'deveco.io:3000' → strip https?:// (no match) → strip /:.*$ → 'deveco.io'
    // But since there's no scheme prefix, the first replace is a no-op,
    // then /[:/].*$/ matches ':3000' and strips it
    expect(result).toBe('deveco.io');
  });
});
