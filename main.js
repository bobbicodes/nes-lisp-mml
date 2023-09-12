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

console.log(ctx)

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

start.addEventListener('click', function () {
  let source = ctx.createBufferSource();
  source.buffer = buffers["1.mp3"]
  source.playbackRate.setValueAtTime(1.75, ctx.currentTime)
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