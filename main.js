import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import { evalString } from 'bobbi-lisp-core'
import {playSong} from 'bobbi-lisp-audio'
import game from './game.clj?raw'

let editorState = EditorState.create({
  doc: game,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})

const start = document.getElementById("start")

function jsonParser(blob) {
  let parsed = JSON.parse(blob);
  if (typeof parsed === 'string') parsed = jsonParser(parsed);
  return parsed;
}

var song = jsonParser(evalString("(do " + game + ")"))

start.addEventListener('click', function () {
  playSong(song, 150)
})
