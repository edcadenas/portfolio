// Vite plugin to generate _headers file for cache control
// Note: GitHub Pages doesn't support custom headers, but this is useful for other hosting providers

export function headersPlugin() {
  return {
    name: 'headers-plugin',
    generateBundle() {
      // Generate _headers file for services that support it (Netlify, Cloudflare Pages, etc.)
      const headersContent = `# Cache headers for static assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.woff2
  Cache-Control: public, max-age=31536000, immutable

/*.woff
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.jpg
  Cache-Control: public, max-age=31536000, immutable

/*.jpeg
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.webp
  Cache-Control: public, max-age=31536000, immutable

/*.svg
  Cache-Control: public, max-age=31536000, immutable

# HTML files should not be cached
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# Root index.html
/
  Cache-Control: public, max-age=0, must-revalidate
`;

      this.emitFile({
        type: 'asset',
        fileName: '_headers',
        source: headersContent
      });
    }
  };
}
