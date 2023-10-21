import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"

let editorState = EditorState.create({
  doc: `(defn make-path [points]
  (str "M" (apply str (interpose " " points))))

(let [points [10 10 50 10 50 50 10 50 10 10]
      _ (clear-svg)]
  (append-path (make-path points)))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})