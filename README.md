# [ahmetcan.org](https://ahmetcan.org/)

My personal website, built with [Astro](https://astro.build).

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:4321.

## Usage

Blog posts live in `src/content/blog/` as Markdown files. Each file becomes a page at `/<slug>/`.

To add a post, create `src/content/blog/my-post.md` with frontmatter:

```yaml
---
title: 'My post title'
date: '2026-05-20'
description: 'One-line spoiler.'
---
```

The site picks it up automatically — homepage list, RSS feed, sitemap, and prev/next navigation all wire up from the file. Set `draft: true` in frontmatter to keep a post out of the listings while you work on it.

See [`AGENTS.md`](./AGENTS.md) for project conventions and architecture notes.

## Build

```bash
npm run build
```

The production output goes to `./dist`. Deployment to GitHub Pages is automated via `.github/workflows/deploy.yml`.
