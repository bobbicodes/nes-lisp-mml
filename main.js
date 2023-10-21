import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"

let editorState = EditorState.create({
  doc: `(defn isometric->screen [x y]
  [(* (- x y)  (/ 1 2))
   (* (+ x y)  (/ 1 4))])

(defn make-path [points]
    (str "M" (apply str (interpose " " points)))))

(def points
  (apply str
    (for [x (range 0 850 40) y (range 0 850 40)]
      (make-path 
        (flatten
        [(isometric->screen (+ x 480) (+ y -380))
         (isometric->screen (+ x 480) (+ y -420))
         (isometric->screen (+ x 520) (+ y -420))
         (isometric->screen (+ x 520) (+ y -380))
         (isometric->screen (+ x 480) (+ y -380))])))))

(let [_ (clear-svg)]
  (append-path points))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})