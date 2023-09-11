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

const ctx = new AudioContext();

let buffers = []

function fetchAudio(file) {
  fetch(file).then(data => data.arrayBuffer())
             .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
             .then(decodedAudio => {
              buffers.push(decodedAudio)
            })
}

for (let i = 1; i < 19; i++) {
  fetchAudio(i + ".mp3")
}

start.addEventListener('click', function () {
  let source = ctx.createBufferSource();
  source.buffer = buffers[5]
  source.connect(ctx.destination);
  source.start();
})

evalString("(do " + core_clj + ")")

var heading = `<div>
  <h3>Hello bobbi-lisp!</h3>
  <p>Evaluating: game.clj</p>
</div>
`

//document.querySelector('#app').innerHTML = heading + 
//'<div>' + evalString('(do ' + game + ')') + '</div>'