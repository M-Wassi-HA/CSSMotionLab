import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          animation: path.resolve(__dirname, 'animation.html'),
          button: path.resolve(__dirname, 'button.html'),
          gradient: path.resolve(__dirname, 'gradient.html'),
          shadow: path.resolve(__dirname, 'shadow.html'),
          borderRadius: path.resolve(__dirname, 'border-radius.html'),
          loader: path.resolve(__dirname, 'loader.html'),
          textAnimation: path.resolve(__dirname, 'text-animation.html'),
          cardHover: path.resolve(__dirname, 'card-hover.html'),
          about: path.resolve(__dirname, 'about.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          privacy: path.resolve(__dirname, 'privacy.html'),
          disclaimer: path.resolve(__dirname, 'disclaimer.html'),
          terms: path.resolve(__dirname, 'terms.html'),
        },
      },
    },
  };
});
