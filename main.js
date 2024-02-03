import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import { updateDocBar } from "./src/eval-region";

let editorState = EditorState.create({
  doc: `(for [[time note]
  [[0 0] [1 0] [1.75 0] [2.25 0] [3 0]]]
  {:buffer (audio-buffer (dpcm2pcm (loop-dpcm (dpcm-0) 1) 2.85))
   :time (* tempo time)})

(def sunsoft-bass
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

(defn bass-1
  "Generates eighth-notes alternating between downbeat note d 
   and upbeat note u starting at time t for n beats."
  [t d u n]
  (apply concat
    (for [beat (range 0 n 0.5)]
    [[(+ t beat) d] [(+ t beat 0.25) u]])))

(defn bass-2 [t p]
  [[(+ t 0) p] [(+ t 0.25) p] [(+ t 0.75) p] [(+ t 1.25) p] [(+ t 1.5) p]
   [(+ t 2) p] [(+ t 2.25) p] [(+ t 2.75) p] [(+ t 3.25) p] [(+ t 3.5) p]])

(do
(for [[time note]
  [[0 0] [1 0] [1.75 0] [2.25 0] [3 0]
   [4 0] [5 0] [5.75 0] [6.25 0] [7 0]
   [8 0] [8.25 1] [8.5 0] [8.75 1] [9 0] [9.25 1] [9.5 0] [9.75 1]
   [10 0] [10.25 1] [10.5 0] [10.75 1] [11 0] [11.25 1] [11.5 0] [11.75 1]
   [12 2] [12.25 3] [12.5 2] [12.75 3] [13 2] [13.25 3] [13.5 2] [13.75 3]
   [14 2] [14.25 3] [14.5 2] [14.75 3] [15 2] [15.25 3] [15.5 2] [15.75 3]
   [16 4] [16.25 5] [16.5 4] [16.75 5] [17 4] [17.25 5] [17.5 4] [17.75 5]
   [18 4] [18.25 5] [18.5 4] [18.75 5] [19 4] [19.25 5] [19.5 4] [19.75 5]]]
(play (sunsoft-bass note) (inc (* tempo time))))

(for [[time note]
  [[0 5] [0.25 6] [0.5 7] [0.75 8]
   [1 0] [1.25 0] [1.75 4] [2 0] [2.25 0] [2.75 4]
   [3 0] [3.25 0] [3.75 4] [4 0] [4.25 5] [4.5 7] [4.75 0]
   [5 2] [5.25 2] [5.75 4] [6 2] [6.25 2] [6.75 4] 
   [7 8] [7.25 4] [7.75 4] [8 5] [8.25 4] [8.75 4]]]
(play (sunsoft-bass note) (inc (* tempo (+ 24 time)))))

(for [[time note]
  (concat (bass-1 0 0 1 4)
          (bass-1 4 4 5 8)
          (bass-1 12 0 1 7.5) [[19.5 9] [19.75 10]]
          (bass-1 20 0 1 1.5) [[21.5 4] [21.75 5]]
          (bass-1 22 0 1 1.5) [[23.5 9] [23.75 10]] (bass-1 24 0 1 2)
          (bass-2 26 0) (bass-2 30 11) (bass-2 34 0) (bass-2 38 11))]
(play (sunsoft-bass note) (inc (* tempo (+ 33 time))))))

(defn instrument 
  "Takes a time and a sequence of pitch/volume pairs,
   outputs data expected by the sequence functions."
  [time seq]
  (map-indexed (fn [beat [pitch volume]]
       {:time (* tempo (+ 0.45 time (* 0.0125 beat))) 
        :length 0.0125 :pitch pitch :volume volume})
  seq))

(defn kick [time]
  (instrument time 
    [[14 14] [12 15] [15 15] [15 15] [15 14]
     [15 11] [15 8] [15 5] [15 1]]))

(defn hat [time]
  (instrument time [[12 13] [15 12] [15 9] [12 6] [12 3]]))

(defn snare [time]
  (instrument time
    [[14 14] [6 15] [12 15] [12 15] [12 14] [12 13] [12 11] [12 10] 
     [12 8] [12 6] [12 5] [12 3] [14 14] [14 9] [14 5] [14 4]]))

(defn drum-1 [time]
  (concat (kick time) (kick (+ time 0.25)) (snare (+ time 0.5))))

(def drums (drum-seq (concat (mapcat hat [0 1 1.75 2.25 3 4 5 5.75 6.25 7])
                        (drum-1 8) (drum-1 9) (drum-1 10) (drum-1 11) (drum-1 12) (drum-1 13) (drum-1 14)
                        (kick 14.75) (snare 15) (kick 15.25) (snare 15.5) (kick 15.75))))

(do
(for [[time note]
    (concat
      [[0 0] [1 0] [1.75 0] [2.25 0] [3 0]
       [4 0] [5 0] [5.75 0] [6.25 0] [7 0]]
      (bass-1 8 0 1 4)
      (bass-1 12 2 3 4))]
(play (sunsoft-bass note) (inc (* tempo time))))
(play drums))

(play (drum-seq (concat (drum-1 0) (kick 0.75))))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})

document.querySelector('#app').onclick = (e) => updateDocBar(view)
