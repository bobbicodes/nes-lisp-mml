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

function playSampleAt(instrument, pitch, time) {
  let source = ctx.createBufferSource();
  source.buffer = buffers[instrument]
  source.playbackRate.setValueAtTime(pitchToRate(pitch), ctx.currentTime)
  source.connect(ctx.destination);
  source.start(time);
}

function playSong(notes) {
  for (let note = 0; note < notes.length; note++) {
    playSampleAt(notes[note].instrument, notes[note].pitch, ctx.currentTime + notes[note].time)
  }
}

var song = [{instrument: "1.mp3", pitch: 60, time: 0},
            {instrument: "1.mp3", pitch: 62, time: 1}]

start.addEventListener('click', function () {
  playSong(song)
})
