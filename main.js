import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"

let editorState = EditorState.create({
  doc: `(def kitty
  [["#000000" "M13 0h1M1 1h1M5 1h1M12 1h1M0 2h1M2 2h3M6 2h1M13 2h1M0 3h1M6 3h1M12 3h1M0 4h1M2 4h1M4 4h1M6 4h1M13 4h1M0 5h1M7 5h6M1 6h1M3 6h1M13 6h1M1 7h1M13 7h1M1 8h1M13 8h1M1 9h1M3 9h1M5 9h7M13 9h1M1 10h1M3 10h1M5 10h1M9 10h1M11 10h1M13 10h1M1 11h1M3 11h1M5 11h1M9 11h1M11 11h1M13 11h1M2 12h1M4 12h1M10 12h1M12 12h1"]
   ["#f8c080" "M1 2h1M5 2h1M2 3h3M1 4h1M3 4h1M5 4h1M1 5h2M4 5h3M5 6h2M8 6h1M10 6h1M12 6h1M2 7h5M8 7h1M10 7h1M12 7h1M2 8h5M8 8h1M10 8h1M12 8h1M2 9h1M4 9h1M12 9h1M2 10h1M4 10h1M10 10h1M12 10h1M2 11h1M4 11h1M10 11h1M12 11h1"]
   ["#c04020" "M1 3h1M5 3h1M3 5h1M2 6h1M4 6h1M7 6h1M9 6h1M11 6h1"]
   ["#806000" "M7 7h1M9 7h1M11 7h1"]
   ["#f88000" "M7 8h1M9 8h1M11 8h1"]])

(for [[color path] kitty]
  (append-path path color))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})