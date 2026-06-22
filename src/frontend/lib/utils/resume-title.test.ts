import { describe, expect, it } from 'vitest';
import { getBaseResumeTitle, getDuplicateResumeTitle } from './resume-title';

describe('getBaseResumeTitle', () => {
  it('strips a single copy suffix', () => {
    expect(getBaseResumeTitle('Software Engineer (Copy)')).toBe('Software Engineer');
  });

  it('strips numbered copy suffixes', () => {
    expect(getBaseResumeTitle('Software Engineer (Copy 3)')).toBe('Software Engineer');
  });

  it('returns the original title when no copy suffix exists', () => {
    expect(getBaseResumeTitle('Product Manager')).toBe('Product Manager');
  });
});

describe('getDuplicateResumeTitle', () => {
  it('creates the first copy title', () => {
    expect(getDuplicateResumeTitle('Software Engineer', ['Software Engineer'])).toBe(
      'Software Engineer (Copy 1)'
    );
  });

  it('increments the highest existing copy number', () => {
    expect(
      getDuplicateResumeTitle('Software Engineer', [
        'Software Engineer',
        'Software Engineer (Copy)',
        'Software Engineer (Copy 2)',
      ])
    ).toBe('Software Engineer (Copy 3)');
  });
});
