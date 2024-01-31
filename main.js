import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import { updateDocBar } from "./src/eval-region";

let editorState = EditorState.create({
  doc: `(play (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-0) 1) 3)))
(play (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-1) 1) 3)))
(play (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-2) 1) 3)))
(play (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-3) 1) 3)))

(play (drum-seq [{:length 1 :time 0 :pitch 15}]))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})

document.querySelector('#app').onclick = (e) => updateDocBar(view)
