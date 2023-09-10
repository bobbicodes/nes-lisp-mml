import './style.css'
import { evalString } from 'bobbi-lisp-core/src/interpreter'
import core_clj from './src/clj/core.clj?raw'
import game from './game.clj?raw'

const start = document.getElementById("start")
const sound_1 = document.getElementById("sound-1")

let audioCtx = new AudioContext();

start.addEventListener('click', function () {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  sound_1.play()
})

evalString("(do " + core_clj + ")")

var heading = `<div>
  <h3>Hello bobbi-lisp!</h3>
  <p>Evaluating: game.clj</p>
</div>
`

document.querySelector('#app').innerHTML = heading + 
'<div>' + evalString('(do ' + game + ')') + '</div>'