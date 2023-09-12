import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import { evalString } from 'bobbi-lisp-core'
import {playSong} from 'bobbi-lisp-audio'
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


var song = [{instrument: "1.mp3", pitch: 60, time: 0},
            {instrument: "1.mp3", pitch: 62, time: 1}]

start.addEventListener('click', function () {
  playSong(song, 60)
})
