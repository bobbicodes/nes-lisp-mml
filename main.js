import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"

let editorState = EditorState.create({
  doc: `(defn make-path [points]
  (str "M" (apply str (interpose " " (for [x (range (count points))]
                                         (str x " " (- 150 (nth points x))))))))

(let [points [0 0 1 1 2 2 3 3 4 4]
      _ (clear-svg)]
  (append-path (make-path points)))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})