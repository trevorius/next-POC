const { expect, describe, it } = require('@jest/globals');
import { generatePassword, words } from '@/lib/words';

describe('Password Generation', () => {
  it('should generate password in correct format (word1-word2-word3)', () => {
    const password = generatePassword();
    expect(password).toMatch(/^[a-z]+-[a-z]+-[a-z]+$/);
  });

  it('should use words from the dictionary', () => {
    const password = generatePassword();
    const [word1, word2, word3] = password.split('-');
    expect(words).toContain(word1);
    expect(words).toContain(word2);
    expect(words).toContain(word3);
  });

  it('should generate different passwords each time', () => {
    const passwords = new Set();
    for (let i = 0; i < 10; i++) {
      passwords.add(generatePassword());
    }
    // With 100 words, the chance of getting the same password twice is extremely low
    expect(passwords.size).toBe(10);
  });

  it('should generate passwords of consistent length', () => {
    const password = generatePassword();
    const parts = password.split('-');
    expect(parts).toHaveLength(3);
  });

  it('should generate passwords with different words', () => {
    const password = generatePassword();
    const [word1, word2, word3] = password.split('-');
    expect(word1).not.toBe(word2);
    expect(word2).not.toBe(word3);
    expect(word3).not.toBe(word1);
  });
});
