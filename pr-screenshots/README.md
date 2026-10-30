# Before / after screenshots

Captured locally via `python -m http.server` on this branch.

| Page | Before | After | Visual change |
|------|--------|-------|---------------|
| Blog index `/blog/` | `before/blog-index.png` | `after/blog-index.png` | ofln callout added |
| ofln post | `before/ofln-post.png` | `after/ofln-post.png`, `after/ofln-post-quantization.png` | Q4_0 accuracy fix + ofln callout |
| Intro post | `before/intro-post.png` | `after/intro-post.png` | SEO/meta only (layout unchanged) |
| Portfolio `/` | `before/portfolio.png` | `after/portfolio.png` | SEO/meta only (layout unchanged) |
| Links `/links.html` | `before/links.png` | `after/links.png` | SEO/meta only (layout unchanged) |
| `/my-portfolio/**` redirects | (meta refresh stubs; same chrome) | `after/my-portfolio-redirect.png` | Absolute canonical/refresh URLs only |

Redirect stubs keep inbound links (including LinkedIn → `/my-portfolio/`) working while pointing `rel=canonical` at the live `/blog/` (or root) URLs.
