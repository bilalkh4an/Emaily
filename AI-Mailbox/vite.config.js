import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2015",
    rollupOptions: {
      output: {
        manualChunks: {
          tiptap: [
            "@tiptap/react",
            "@tiptap/starter-kit",
            "prosemirror-model",
            "prosemirror-state",
            "prosemirror-view"
          ],
          vendor: ["react", "react-dom"]
        }
      }
    }
  }
});

