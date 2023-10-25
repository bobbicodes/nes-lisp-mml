import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import confuzion from './confuzion.json'

let editorState = EditorState.create({
  doc: `(def pulse0-vib
  (map #(assoc % :vibrato {:speed 6 :depth 3})
    pulse-0))

(def buffers
  [(tri-seq bass)
  (drum-seq drums)
  (pulse0-seq pulse0-vib)
  (pulse2-seq pulse-2)])

(play (mix buffers))

(spit-wav "confuzion-vib.wav" (mix buffers))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})