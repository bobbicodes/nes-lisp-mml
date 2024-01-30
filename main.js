import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import confuzion from './confuzion.json'

let editorState = EditorState.create({
  doc: `(def saw "FFFF0F00000000000000000000000000")

(play (audio-buffer (dpcm2pcm (loop-dpcm saw 500) 2.5)))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})