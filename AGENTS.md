# Agent guide

This is the source for [ahmetcan.org](https://ahmetcan.org), a personal blog by Ahmet Can Aydemir. Built with Astro and deployed to GitHub Pages.

## Stack

- **Framework**: Astro 6
- **Markdown**: `@astrojs/mdx`, Shiki syntax highlighting (built-in), `rehype-slug` + `rehype-autolink-headings`
- **Hosting**: GitHub Pages, custom domain `ahmetcan.org`
- **Node**: 22 (see `.nvmrc`)
- **Package manager**: npm (lockfile is `package-lock.json`)

## Commands

```bash
npm install     # install deps
npm run dev     # dev server at http://localhost:4321
npm run build   # static build to ./dist
npm run preview # preview production build
npm run format  # prettier --write .
```

## Project layout

```
src/
  content/blog/         # blog posts as .md files (one file per post)
  content.config.ts     # zod schema for the blog collection
  layouts/              # BaseLayout (head/SEO), BlogPost (post wrapper)
  components/           # Header, Footer, Bio, ThemeToggle, SEO
  pages/
    index.astro         # homepage with post list
    about.astro         # about page with photo + IPA pronunciation audio
    [...slug].astro     # dynamic blog post route
    rss.xml.js          # RSS feed
    404.astro           # 404 with Douglas Adams photo
  styles/global.css     # all CSS, custom properties for theming
  assets/               # images processed by Astro Image
public/                 # static files served at root (CNAME, manifest, audio)
```

## Conventions

- **URLs are root-level** for blog posts (e.g. `/elasticsearch-snapshots-to-minio/`), not `/blog/...`. This preserves the Gatsby URLs that RSS subscribers use. Defined in `src/pages/[...slug].astro` via `getStaticPaths`.
- **Trailing slash always** (`astro.config.mjs` → `trailingSlash: 'always'`).
- **Dark mode**: `data-theme` attribute on `<html>`, set by inline script in `BaseLayout` to prevent FOUC. Theme stored in `localStorage`. Two CSS custom property sets in `global.css`.
- **Theme accent color**: green `#1f871b` (light) / `#28ab1c` (dark).
- **Image handling**: always use Astro's `<Image>` component for content images so they get webp + responsive variants. Place sources in `src/assets/`.
- **Font stack**: system fonts (`-apple-system`, etc.). No web fonts.
- **No analytics**, **no comments**, **no newsletter**. Keep it simple.

## Writing a new blog post

1. Create `src/content/blog/<slug>.md`
2. Frontmatter:
   ```yaml
   ---
   title: 'Post title'
   date: '2026-MM-DD'
   description: 'One-line spoiler.'
   ---
   ```
3. URL becomes `/<slug>/` automatically. RSS, sitemap, prev/next nav all wire up.
4. Optional: `draft: true` to keep it out of listings until ready.

## Writing style

Casual, direct, first-person. Avoid AI-generated patterns:
- No em-dashes (`—`)
- No throat-clearing openers ("Let's dive in", "In this post we will...")
- No vague adverbs ("very", "really", "currently")
- Active voice
- Specific names and numbers over generic claims

## Deploy

- Push to `main` triggers `.github/workflows/deploy.yml`
- PRs run `.github/workflows/pr.yml` (build only, no deploy)
- Deploy uses `actions/deploy-pages@v4` (not `gh-pages` branch)

## Things to NOT do

- Do not add web fonts (the system stack is intentional)
- Do not add comments / Disqus / similar
- Do not add analytics (GA4, Plausible, etc.) without asking
- Do not add a newsletter signup
- Do not change the URL structure (existing RSS subscribers will break)
- Do not add `index.tr.md` style translations — site is English-only now
