import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri, satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri';

// Replaces rehype-autolink-headings (behavior: 'wrap'): rehype plugins are
// unified-only and silently do nothing as Sätteri hast plugins.
const headingLinks = {
  name: 'heading-links',
  element: {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    visit(node) {
      const id = node.properties?.id;
      if (!id) return;
      return {
        ...node,
        children: [
          {
            type: 'element',
            tagName: 'a',
            properties: { href: `#${id}` },
            children: node.children,
          },
        ],
      };
    },
  },
};

export default defineConfig({
  site: 'https://ahmetcan.org',
  integrations: [mdx(), sitemap()],
  redirects: {
    '/tr/': '/',
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
    processor: satteri({
      hastPlugins: [satteriHeadingIdsPlugin(), headingLinks],
    }),
  },
  build: {
    format: 'directory',
  },
  trailingSlash: 'always',
});
