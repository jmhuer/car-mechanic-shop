import { defineConfig } from "vite";
import webfontDownload from "vite-plugin-webfont-dl";
import { ViteMinifyPlugin } from "vite-plugin-minify";
const IN_PRODUCTION = process.env.NODE_ENV === "production";
const IN_DEVELOPMENT = process.env.NODE_ENV === "development";

// Hide Preloader while in development.
const hidePreloader = () => {
  return {
    name: "hide-preloader",
    transformIndexHtml(html) {
      return html.replace(
        `<link rel="stylesheet" href="./src/css/preloader.min.css" type="text/css">`,
        `<!-- <link rel="stylesheet" href="./src/css/preloader.min.css" type="text/css"> -->`
      );
    }
  }
}

// Force remove preloader in production after timeout
const addPreloaderTimeout = () => {
  return {
    name: "add-preloader-timeout",
    transformIndexHtml(html) {
      return html.replace(
        `</body>`,
        `  <script>
    // Force hide preloader after 5 seconds if it gets stuck
    window.addEventListener('load', function() {
      setTimeout(function() {
        const loader = document.getElementById('loader-wrapper');
        if (loader) {
          loader.style.display = 'none';
        }
      }, 5000);
    });
  </script>
</body>`
      );
    }
  }
}

export default defineConfig({
  plugins: [
    /* ## Hide Preloader while in Development
    --------------------------------------------- */
    IN_DEVELOPMENT && hidePreloader(),
    
    /* ## Add preloader timeout for production
    --------------------------------------------- */
    IN_PRODUCTION && addPreloaderTimeout(),

    /* ## Download Google Fonts and attach them with production build for offline use
    --------------------------------------------- */
    IN_PRODUCTION && webfontDownload(
      [
        "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap",
      ]
    ),

    /* ## Minify the output HTML files in production
    --------------------------------------------- */
    IN_PRODUCTION && ViteMinifyPlugin({}),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      }
    }
  },

  // Change the base path for GitHub Pages deployment
  // If you're using a custom domain (carclubtire.com), keep it as "/"
  // If you're using GitHub's default domain (username.github.io/repo-name), use "/repo-name/"
  base: "/car-mechanic-shop/", // Replace with your actual repository name

  server: {
    port: 3000,
  },

  build: {
    // outDir: "./docs",
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
    },
  },
});
