import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import confuzion from './confuzion.json'

let editorState = EditorState.create({
  doc: `(def tempo 0.75)

(defn zeldabass1 [time note]
  [{:time (* time tempo)  :length (* tempo 1) :pitch note :vibrato {:speed 6 :depth 1}}
   {:time (* tempo (+ 1 time)) :length (* tempo 1) :pitch (+ note 7) :vibrato {:speed 6 :depth 1}}
   {:time (* tempo (+ 2 time)) :length (* tempo 2) :pitch (+ note 12) :vibrato {:speed 6 :depth 1}}])

(defn zeldabass2 [time]
  (apply concat
      (for [[beat note] [[0 46] [4 44] [8 42] [12 41]]]
        (zeldabass1 (+ time beat) note))))

(defn zeldabass3 [time note]
  (apply concat
    (for [t (range 4)]
      [{:time (* (+ t time) tempo) :length (* tempo 0.25) :pitch note}
       {:time (* tempo (+ 0.5 (+ t time))) :length (* tempo 0.25) :pitch note}
       {:time (* tempo (+ 0.75 (+ t time))) :length (* tempo 0.25) :pitch note}])))

(defn zeldabass4 [time]
  (apply concat
      (for [[beat note] [[0 46] [4 44] [8 42] [12 41]]]
        (zeldabass3 (+ time beat) note))))

(defn zeldabass5 [time intervals]
  (apply concat
    (for [[beat note] (for [beat (range 0 (* 4 (count intervals)) 4)]
                        [beat (nth intervals (/ beat 4))])]
        (zeldabass3 (+ time beat) note))))

(defn zeldabass6 [time]
  [{:time (* time tempo)  :length (* tempo 0.25) :pitch 53}
   {:time (* tempo (+ 0.5 time)) :length (* tempo 0.25) :pitch 41}
   {:time (* tempo (+ 0.75 time)) :length (* tempo 0.25) :pitch 41}
   {:time (* tempo (+ 1 time))  :length (* tempo 0.25) :pitch 41}
   {:time (* tempo (+ 1.5 time)) :length (* tempo 0.25) :pitch 41}
   {:time (* tempo (+ 1.75 time)) :length (* tempo 0.25) :pitch 41}
   {:time (* tempo (+ 2 time))  :length (* tempo 0.25) :pitch 41}
   {:time (* tempo (+ 2.5 time)) :length (* tempo 0.25) :pitch 41}
   {:time (* tempo (+ 2.75 time)) :length (* tempo 0.25) :pitch 41}
   {:time (* tempo (+ 3 time))  :length (* tempo 0.25) :pitch 41}
   {:time (* tempo (+ 3.5 time)) :length (* tempo 0.25) :pitch 43}
   {:time (* tempo (+ 3.75 time)) :length (* tempo 0.25) :pitch 45}])

(play (pulse3-seq [{:time (* 0 tempo)  :length (* tempo 2) :pitch 70 :vibrato {:speed 6 :depth 1}}]))

(play (tri-seq (concat (zeldabass2 0)
                 (zeldabass5 16 [46 46 46 44 42 41 46 44 42 49 47 46 48])
                 (zeldabass6 68) (zeldabass5 72 [46 44 42 41 40 41 40 41 47 46 48])
                 (zeldabass6 116))))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})