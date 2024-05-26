import { defineConfig } from "vite";

export default defineConfig({
    base: "https://bobbicodes.github.io/nes-lisp-mml/",
    build: {
    target: 'esnext' //browsers can handle the latest ES features
  }
})
