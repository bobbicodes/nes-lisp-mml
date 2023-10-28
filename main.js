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

(defn shorten [notes]
  (map #(update % :length (fn [v] (* v 0.9)))
    notes))

(def triangle (tri-seq (concat mmbass (mmbass2 224))))

(def pulse0
  (pulse0-seq (concat (mm-lead1 96) (take 49 (rest (mm-lead1 128))))))

(def pulse1a
  (pulse1-seq (concat (mm-lead1 0) (take 49 (rest (mm-lead1 32)))
                [{:time (* tempo 63) :length (* tempo 0.5) :pitch 71}]
                (mm-lead3 96) (mm-lead5 191.5) (mm-lead1 224))))

(def pulse1b
  (pulse1-seq (concat (mm-lead1a 0) (mm-lead1a 32) (mm-lead4 127.5)
                (mm-lead5a 191.5) (mm-lead1a 224))))

(def pulse2a (pulse2-seq (concat (mm-lead2 63.5) (mm-lead2 159.5))))

(def pulse2b
  (pulse2-seq (shorten (concat (mm-lead2 64.5) (mm-lead2 160.5)))))

(def megaman
  (mix [triangle
        pulse0
        pulse1a
        pulse1b
        pulse2a
        pulse2b
        drums]))

(play megaman)
(spit-wav "megaman2-dr-wily.wav" megaman)`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})