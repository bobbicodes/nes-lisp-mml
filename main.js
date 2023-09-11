import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import { evalString } from 'bobbi-lisp-core/src/interpreter'
import core_clj from './src/clj/core.clj?raw'
import game from './game.clj?raw'

let editorState = EditorState.create({
  doc: `(range 5)`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})

const start = document.getElementById("start")
const sound_1 = document.getElementById("sound-1")
const sound_2 = document.getElementById("sound-2")
const sound_3 = document.getElementById("sound-3")
const sound_4 = document.getElementById("sound-4")
const sound_5 = document.getElementById("sound-5")
const sound_6 = document.getElementById("sound-6")
const sound_7 = document.getElementById("sound-7")
const sound_8 = document.getElementById("sound-8")
const sound_9 = document.getElementById("sound-9")
const sound_10 = document.getElementById("sound-10")
const sound_11 = document.getElementById("sound-11")
const sound_12 = document.getElementById("sound-12")
const sound_13 = document.getElementById("sound-13")
const sound_14 = document.getElementById("sound-14")
const sound_15 = document.getElementById("sound-15")
const sound_16 = document.getElementById("sound-16")
const sound_17 = document.getElementById("sound-17")
const sound_18 = document.getElementById("sound-18")


let audioCtx = new AudioContext();

start.addEventListener('click', function () {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  let sample =audioCtx.createMediaElementSource(sound_15);
  sample.connect(audioCtx.destination);
})

evalString("(do " + core_clj + ")")

var heading = `<div>
  <h3>Hello bobbi-lisp!</h3>
  <p>Evaluating: game.clj</p>
</div>
`

//document.querySelector('#app').innerHTML = heading + 
//'<div>' + evalString('(do ' + game + ')') + '</div>'