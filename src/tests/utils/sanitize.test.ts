import { describe, it, expect } from 'vitest';
import { sanitizeInput, stripHtml, trimAndLimit } from '../../utils/sanitize';

describe('sanitizeInput', () => {
  it('strips HTML tags from input', () => {
    const result = sanitizeInput('<script>alert("xss")</script>Hello <b>world</b>');
    expect(result).toBe('alert("xss")Hello world');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('trims whitespace from input', () => {
    const result = sanitizeInput('   hello world   ');
    expect(result).toBe('hello world');
  });

  it('limits input to 500 characters by default', () => {
    const longInput = 'a'.repeat(600);
    const result = sanitizeInput(longInput);
    expect(result.length).toBe(500);
  });

  it('passes through normal text unchanged', () => {
    const result = sanitizeInput('A normal trip to Jaipur');
    expect(result).toBe('A normal trip to Jaipur');
  });

  it('respects custom max length', () => {
    const result = sanitizeInput('Hello world', 5);
    expect(result).toBe('Hello');
  });
});

describe('stripHtml', () => {
  it('strips HTML tags and trims', () => {
    expect(stripHtml('  <p>Hello</p>  ')).toBe('Hello');
  });
});

describe('trimAndLimit', () => {
  it('returns string unchanged if within limit', () => {
    expect(trimAndLimit('Hello', 10)).toBe('Hello');
  });

  it('truncates with ellipsis if over limit', () => {
    const result = trimAndLimit('Hello World', 6);
    expect(result.length).toBe(6);
    expect(result.endsWith('…')).toBe(true);
  });
});
