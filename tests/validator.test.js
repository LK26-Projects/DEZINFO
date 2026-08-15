import test from 'node:test';
import assert from 'node:assert/strict';

import {
  MAX_CONTENT_LENGTH,
  MIN_CONTENT_LENGTH,
  validateContent,
} from '../src/validator.js';

test('accepts valid content and returns the required contract', () => {
  assert.deepEqual(validateContent('Wiarygodna informacja'), {
    valid: true,
    value: 'Wiarygodna informacja',
    errors: [],
  });
});

test('trims content and collapses redundant whitespace', () => {
  assert.deepEqual(validateContent('  To\tjest\n  informacja.  '), {
    valid: true,
    value: 'To jest informacja.',
    errors: [],
  });
});

test('rejects an empty string', () => {
  const result = validateContent('');

  assert.equal(result.valid, false);
  assert.equal(result.value, '');
  assert.equal(result.errors.length, 1);
});

test('rejects content containing only whitespace', () => {
  const result = validateContent(' \t\r\n ');

  assert.equal(result.valid, false);
  assert.equal(result.value, '');
  assert.equal(result.errors.length, 1);
});

test('rejects non-string input without throwing', () => {
  for (const input of [undefined, null, 0, false, {}, [], Symbol('input')]) {
    const result = validateContent(input);

    assert.equal(result.valid, false);
    assert.equal(result.value, '');
    assert.equal(result.errors.length, 1);
  }
});

test('accepts content exactly at the minimum length', () => {
  const value = 'a'.repeat(MIN_CONTENT_LENGTH);

  assert.deepEqual(validateContent(value), { valid: true, value, errors: [] });
});

test('rejects content one character below the minimum length', () => {
  const value = 'a'.repeat(MIN_CONTENT_LENGTH - 1);
  const result = validateContent(value);

  assert.equal(result.valid, false);
  assert.equal(result.value, value);
  assert.equal(result.errors.length, 1);
});

test('accepts content exactly at the maximum length', () => {
  const value = 'a'.repeat(MAX_CONTENT_LENGTH);

  assert.deepEqual(validateContent(value), { valid: true, value, errors: [] });
});

test('rejects content one character above the maximum length', () => {
  const value = 'a'.repeat(MAX_CONTENT_LENGTH + 1);
  const result = validateContent(value);

  assert.equal(result.valid, false);
  assert.equal(result.value, value);
  assert.equal(result.errors.length, 1);
});

test('applies length limits after whitespace normalization', () => {
  const input = `  ${'a'.repeat(MIN_CONTENT_LENGTH - 1)}  `;
  const result = validateContent(input);

  assert.equal(result.valid, false);
  assert.equal(result.value, 'a'.repeat(MIN_CONTENT_LENGTH - 1));
});

test('counts JavaScript UTF-16 code units consistently at a boundary', () => {
  const input = '😀'.repeat(MIN_CONTENT_LENGTH / 2);
  const result = validateContent(input);

  assert.equal(input.length, MIN_CONTENT_LENGTH);
  assert.equal(result.valid, true);
});

test('does not mutate the input value', () => {
  const input = '  Poprawna informacja  ';

  validateContent(input);

  assert.equal(input, '  Poprawna informacja  ');
});
