import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import { updateDocBar } from "./src/eval-region";

let editorState = EditorState.create({
  doc: `(def saw "FFFF0F00000000000000000000000000")

(play (audio-buffer (dpcm2pcm (loop-dpcm saw 500) 2.5)))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})

document.querySelector('#app').onclick = (e) => updateDocBar(view)