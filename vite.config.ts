import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg'],
        manifest: {
          id: '/',
          name: 'Собери Россию - Пазлы Регионов',
          short_name: 'СобериРоссию',
          description: 'Интерактивная игра-пазл по регионам России с интерактивной картой и историческими фактами.',
          theme_color: '#2563eb',
          background_color: '#f8fafc',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
          categories: ['games', 'education'],
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
      {
        name: 'admin-upload-middleware',
        configureServer(server) {
          server.middlewares.use('/api/admin/upload-image', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', async () => {
              try {
                const { targetId, dataUrl } = JSON.parse(body);
                if (!targetId || !dataUrl) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Missing targetId or dataUrl' }));
                  return;
                }
                const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (!matches || matches.length !== 3) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Invalid dataUrl format' }));
                  return;
                }
                const mime = matches[1];
                const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
                const buffer = Buffer.from(matches[2], 'base64');
                const fs = await import('fs');
                const p = await import('path');
                const uploadDir = p.resolve(process.cwd(), 'public/assets/uploads');
                fs.mkdirSync(uploadDir, { recursive: true });
                const safeName = String(targetId).replace(/[^a-zA-Z0-9_-]/g, '_');
                const filename = `${safeName}.${ext}`;
                const filePath = p.join(uploadDir, filename);
                fs.writeFileSync(filePath, buffer);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, url: `/assets/uploads/${filename}?t=${Date.now()}` }));
              } catch (e: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
