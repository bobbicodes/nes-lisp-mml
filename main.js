import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import confuzion from './confuzion.json'

let editorState = EditorState.create({
  doc: `(def saw "FFFF0F00000000000000000000000000")

  (defn hex2dpcm [hex]
    (->> hex
    (partition 2)
    (mapcat reverse)
    (apply str)
    hex2bin
    (map #(parseInt % 2))))
  
(defn dpcm2pcm [vals]
    (loop [dpcm vals output 32 result [32]]
      (if (empty? dpcm) result
        (let [v (if (zero? (first dpcm)) (dec output) (inc output))]
          (if (< 1 v 63)
            (recur (rest dpcm) v (conj result v))
            (recur (rest dpcm) (first dpcm) (conj result (first dpcm))))))))
  
(defn scale-pcm [values t-min t-max]
    (let [maximum (apply max values)
          minimum (apply min values)
          spread (- maximum minimum)]
      (map #(+ (* (/ % 64) (- t-max t-min)) t-min)
        values)))
  
(->> (mapcat #(repeat 6 %) (scale-pcm (dpcm2pcm (hex2dpcm saw)) -1 1))
    (repeat 100)
    (apply concat)
    audio-buffer
    play)`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})