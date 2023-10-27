import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import confuzion from './confuzion.json'

let editorState = EditorState.create({
  doc: `(def drums
  (drum-seq
    (apply concat
      (for [beat (range 0 256 2)]
        (mmdrums beat)))))

(play (mix [(tri-seq (concat mmbass (mmbass2 224)))
            (pulse1-seq (concat (mm-lead1 0) (take 49 (rest (mm-lead1 32)))
                    [{:time (* tempo 63) :length (* tempo 0.5) :pitch 71}]
                          (mm-lead3 96) (mm-lead5 191.5) (mm-lead1 224)))
            (pulse2-seq (concat (mm-lead2 63.5) (mm-lead2 159.5)))
            (pulse1-seq (concat (mm-lead1a 0) (mm-lead1a 32) (mm-lead4 127.5)
                          (mm-lead5a 191.5) (mm-lead1a 224)))
            (pulse2-seq (concat (mm-lead2 64.5) (mm-lead2 160.5)))
            (pulse0-seq (concat (mm-lead1 96) (take 49 (rest (mm-lead1 128)))))
            drums]))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})