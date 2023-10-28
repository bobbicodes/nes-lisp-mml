import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import confuzion from './confuzion.json'

let editorState = EditorState.create({
  doc: `(def tempo 0.8)

(defn zeldabass1 [time]
  [{:time (* time tempo)  :length (* tempo 1) :pitch 46 :vibrato {:speed 6 :depth 1}}
   {:time (* tempo (+ 1 time)) :length (* tempo 1) :pitch 53 :vibrato {:speed 6 :depth 1}}
   {:time (* tempo (+ 2 time)) :length (* tempo 2) :pitch 58 :vibrato {:speed 6 :depth 1}}])

(play (tri-seq (zeldabass1 0)))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})