import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import confuzion from './confuzion.json'

let editorState = EditorState.create({
  doc: `(def buffers
  [(tri-seq bass)
  (drum-seq drums)
  (pulse0-seq pulse-0)
  (pulse2-seq pulse-2)])

(spit-wav "confuzion.wav" (mix buffers))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})