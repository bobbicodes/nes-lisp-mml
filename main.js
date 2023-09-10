import './style.css'
import { evalString } from 'bobbi-lisp-core/src/interpreter'
import core_clj from './src/clj/core.clj?raw'
import game from './game.clj?raw'

evalString("(do " + core_clj + ")")

var heading = `<div>
  <h3>Hello bobbi-lisp!</h3>
  <p>Evaluating: game.clj</p>
</div>
`

document.querySelector('#app').innerHTML = heading + 
'<div>' + evalString('(do ' + game + ')') + '</div>'