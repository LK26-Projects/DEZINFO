export const MIN_CONTENT_LENGTH = 10;
export const MAX_CONTENT_LENGTH = 5000;

/**
 * Normalizuje i waliduje treść przeznaczoną do analizy.
 *
 * @param {*} input
 * @returns {{ valid: boolean, value: string, errors: string[] }}
 */
export function validateContent(input) {
  const value = typeof input === 'string'
    ? input.trim().replace(/\s+/g, ' ')
    : '';
  const errors = [];

  if (value.length === 0) {
    errors.push('Treść nie może być pusta.');
  } else {
    if (value.length < MIN_CONTENT_LENGTH) {
      errors.push(`Treść musi mieć co najmniej ${MIN_CONTENT_LENGTH} znaków.`);
    }

    if (value.length > MAX_CONTENT_LENGTH) {
      errors.push(`Treść może mieć maksymalnie ${MAX_CONTENT_LENGTH} znaków.`);
    }
  }

  return {
    valid: errors.length === 0,
    value,
    errors,
  };
}
