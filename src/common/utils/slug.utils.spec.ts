import { slugify } from './slug.utils';

describe('slugify', () => {
  it('normalizes spaces, case and punctuation', () => {
    expect(slugify('  My  Project! ')).toBe('my-project');
    expect(slugify('My-Project')).toBe('my-project');
  });
});
