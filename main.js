import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import { evalString } from 'bobbi-lisp-core'
import game from './game.clj?raw'

let editorState = EditorState.create({
  doc: `(map str [1 2] [3 4])`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})

const start = document.getElementById("start")

const ctx = new AudioContext();

let buffers = {}

function fetchAudio(file) {
  fetch(file).then(data => data.arrayBuffer())
             .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
             .then(decodedAudio => {
              buffers[file] = decodedAudio
            })
}

for (let i = 1; i < 19; i++) {
  fetchAudio(i + ".mp3")
}

function addSemitone(rate) {
  return rate * Math.pow(2, 1/12)
}

function subSemitone(rate) {
  return rate * Math.pow(2, -1/12)
}

function incRate(semis) {
  return Array(semis).fill(1).reduce(addSemitone)
}

function decRate(semis) {
  return Array(semis).fill(1).reduce(subSemitone)
}

function pitchToRate(midiNum) {
  if (midiNum > 66) {
    return incRate(midiNum - 66)
  } else {
    return decRate(68 - midiNum)
  }
}

start.addEventListener('click', function () {
  let source = ctx.createBufferSource();
  source.buffer = buffers["1.mp3"]
  source.playbackRate.setValueAtTime(pitchToRate(58), ctx.currentTime)
  source.connect(ctx.destination);
  source.start();
})

var heading = `<div>
  <h3>Hello bobbi-lisp!</h3>
  <p>Evaluating: game.clj</p>
</div>
`

//document.querySelector('#app').innerHTML = heading + 
//'<div>' + evalString('(do ' + game + ')') + '</div>'