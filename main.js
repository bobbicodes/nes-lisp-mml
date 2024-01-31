import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import { updateDocBar } from "./src/eval-region";

let editorState = EditorState.create({
  doc: `(def sunsoft-bass
  [(audio-buffer (dpcm2pcm (loop-dpcm (dpcm-0) 1) 2.85))
   (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-0) 1) 1.45))
   (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-1) 1) 2.9))
   (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-1) 1) 1.45))
   (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-0) 1) 3.8))
   (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-0) 1) 1.9))
   (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-2) 1) 2.3))
   (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-1) 1) 2.3))
   (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-3) 1) 2.9))
   (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-2) 1) 3.8))
   (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-2) 1) 1.9))
   (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-1) 1) 3.8))])

(def tempo 0.8)

(for [[time note]
  [[0 0] [1 0] [1.75 0] [2.25 0] [3 0]
   [4 0] [5 0] [5.75 0] [6.25 0] [7 0]
   [8 0] [8.25 1] [8.5 0] [8.75 1] [9 0] [9.25 1] [9.5 0] [9.75 1]
   [10 0] [10.25 1] [10.5 0] [10.75 1] [11 0] [11.25 1] [11.5 0] [11.75 1]
   [12 2] [12.25 3] [12.5 2] [12.75 3] [13 2] [13.25 3] [13.5 2] [13.75 3]
   [14 2] [14.25 3] [14.5 2] [14.75 3] [15 2] [15.25 3] [15.5 2] [15.75 3]
   [16 4] [16.25 5] [16.5 4] [16.75 5] [17 4] [17.25 5] [17.5 4] [17.75 5]
   [18 4] [18.25 5] [18.5 4] [18.75 5] [19 4] [19.25 5] [19.5 4] [19.75 5]]]
(play (sunsoft-bass note) (* tempo time)))

(play (drum-seq [{:length 1 :time 0 :pitch 15}]))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})

document.querySelector('#app').onclick = (e) => updateDocBar(view)
