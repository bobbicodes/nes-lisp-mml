
const start = document.getElementById("start")

const ctx = new AudioContext();

const bufferSize = ctx.sampleRate * 1;

const noiseBuffer = new AudioBuffer({
  length: bufferSize,
  sampleRate: ctx.sampleRate,
});

const data = noiseBuffer.getChannelData(0);
for (let i = 0; i < bufferSize; i++) {
  data[i] = Math.random() * 2 - 1;
}

const noise = new AudioBufferSourceNode(ctx, {
  buffer: noiseBuffer,
});

function playNoise() {
  noise.connect(ctx.destination);
  noise.start();
}

start.addEventListener('click', function () {
  playNoise()
})

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

export function playSong(notes, tempo) {
  for (let note = 0; note < notes.length; note++) {
    playSampleAt(notes[note].instrument,
        notes[note].pitch,
        ctx.currentTime + (notes[note].time * (60 / tempo)))
  }
}

/* var song = [{instrument: "1.mp3", pitch: 60, time: 0},
            {instrument: "1.mp3", pitch: 62, time: 1}]

start.addEventListener('click', function () {
  playSong(song, 180)
}) */
