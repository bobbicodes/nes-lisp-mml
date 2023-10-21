import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"

let editorState = EditorState.create({
  doc: `(defn make-path [points]
  (str "M" (apply str (interpose " " points))))

(def points
  (apply str
    (for [x (range 0 150 40) y (range 0 150 40)]
      (make-path [(+ x 10) (+ y 50)
                  (+ x 10) (+ y 10)
                  (+ x 50) (+ y 10)
                  (+ x 50) (+ y 50)
                  (+ x 10) (+ y 50)]))))

(let [_ (clear-svg)]
  (append-path points))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})