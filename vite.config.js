import { defineConfig } from "vite";

export default defineConfig({
    base: '/nes-lisp-mml/',
    build: {
    target: 'esnext' //browsers can handle the latest ES features
  }
})
