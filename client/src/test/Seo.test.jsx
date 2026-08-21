import { describe, it, expect, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import Seo from '../components/Seo';

function findMeta(nameOrProperty, value) {
  const metas = document.querySelectorAll('meta');
  for (const meta of metas) {
    if (meta.getAttribute(nameOrProperty) === value) return meta;
  }
  return null;
}

describe('Seo', () => {
  afterEach(() => {
    document.title = '';
    document.querySelectorAll('meta').forEach(m => m.remove());
    document.querySelectorAll('link[rel="canonical"]').forEach(l => l.remove());
  });

  it('sets document title', async () => {
    render(<Seo title="Test Page" />);
    await waitFor(() => {
      expect(document.title).toContain('Test Page');
    });
  });

  it('sets meta description', async () => {
    render(<Seo title="Test" description="Test description" />);
    await waitFor(() => {
      const meta = findMeta('name', 'description');
      expect(meta).toBeTruthy();
      expect(meta.getAttribute('content')).toBe('Test description');
    });
  });

  it('sets OG title', async () => {
    render(<Seo title="OG Title" />);
    await waitFor(() => {
      const meta = findMeta('property', 'og:title');
      expect(meta).toBeTruthy();
      expect(meta.getAttribute('content')).toContain('OG Title');
    });
  });

  it('sets OG description', async () => {
    render(<Seo title="Test" description="OG desc" />);
    await waitFor(() => {
      const meta = findMeta('property', 'og:description');
      expect(meta).toBeTruthy();
      expect(meta.getAttribute('content')).toBe('OG desc');
    });
  });

  it('does not crash without optional props', async () => {
    render(<Seo />);
    await waitFor(() => {
      expect(document.title).toBeDefined();
    });
  });
});
