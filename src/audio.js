import { loadNsf, setLoaded, startSong, playReturned, setPlayReturned,
  dmcIrqWanted, frameIrqWanted, samples } from "../main";
import * as cpu from "./cpu";
import * as apu from "./apu";
import {songLength} from './compiler'
import { s1, s2, s3, s4, s5, s6, s7, s8, addVolEnvelope, resetVolEnvelopes, currentVolEnvelopes, addPitchEnvelope, resetPitchEnvelopes, currentPitchEnvelopes } from "./nsf"

export const actx = new AudioContext()
export const samplesPerFrame = actx.sampleRate / 60;
export let sampleBuffer = new Float32Array(samplesPerFrame);

import workletURL from './audioworklet.js?url'
await actx.audioWorklet.addModule(workletURL);

export const processor = new AudioWorkletNode(actx, "audioworklet")
let sourceNode = null

const biquadFilter = actx.createBiquadFilter();
biquadFilter.type = "highpass";
biquadFilter.frequency.setValueAtTime(37, actx.currentTime);

export function resume() {
    actx.resume();
}

export function start() {
  sourceNode = actx.createBufferSource();
  processor.connect(biquadFilter);
  biquadFilter.connect(actx.destination);
  sourceNode.start();
}

export function stop() {
  if (sourceNode) {
    sourceNode.stop();
    sourceNode.disconnect();
  }
    processor.disconnect();
}

function hex(n) {
    return "$" + (n).toString(16);
}

function el(id) {
  return document.getElementById(id);
}

export function lengthPitch(pairs) {
  let notes = []
  for (let i = 0; i < pairs.length; i++) {
    let m = new Map()
    m.set("ʞlength", pairs[i][0])
    m.set("ʞpitch", pairs[i][1])
    notes.push(m)
  }
  return notes
}

// apply vibrato to a single note
function vibrato(length, pitch, speed, width) {
  let noteFrames = []
  for (let i = 0; i < length; i++) {
    let m = new Map()
    m.set("ʞpitch", pitch + (width * Math.sin(speed * i)))
    noteFrames.push(m)
  }
  return noteFrames
}

// apply vibrato function to note sequence
// affects only note tails 
export function vib(notes, speed, width) {
  let noteSeq = []
  for (let i = 0; i < notes.length; i++) {
    let pitch = notes[i].get("ʞpitch")
    let length = notes[i].get("ʞlength")
    noteSeq = noteSeq.concat(vibTail(length, pitch, speed, width))
  }
  return noteSeq
}

// affects entire note
export function vib_all(notes, speed, width) {
  let noteSeq = []
  for (let i = 0; i < notes.length; i++) {
    let pitch = notes[i].get("ʞpitch")
    let length = notes[i].get("ʞlength")
    noteSeq = noteSeq.concat(vibAll(length, pitch, speed, width))
  }
  return noteSeq
}

// Takes a note and creates a sequence of 2 parts:
// A note of a static pitch for 12 frames or the length,
// whichever is shorter, and if time, a sequence of 
// remaining note frames with vibrato applied.
// Uses loop2, the dedicated arp loops
// for optimized output.
function vibTail(length, pitch, speed, width) {
  // Generate cycle
  let n = 2 * (3.5 / speed)
  let cycle = vibrato(n, pitch, speed, width)
  //console.log("cycle:", cycle)
  let reps = Math.floor((length - 12) / cycle.length)
  //console.log("reps:", reps)
  let rem = cycle.slice(0, (length - 12) % cycle.length)
  let tail = []
  if (reps > 1) {
    let loopReps = new Map()
    loopReps.set("ʞarp", reps)
    let loopEnd = new Map()
    loopEnd.set("ʞarp", "ʞend")
    tail = tail.concat([loopReps], cycle, [loopEnd])
  }
  if (reps === 1) {
    tail = tail.concat(cycle)
  }
  let head = new Map()
    head.set("ʞlength", Math.min(12, length))
    head.set("ʞpitch", pitch)
  let len1 = new Map()
  len1.set("ʞlength", 1)
  if (length > 25) {
     let part1 = vibTail(25, pitch, speed, width)
     let part2 = vibAll(length - 25, pitch, speed, width)
     //console.log("part2: ", part2)
     return part1.concat(part2.slice(1, part2.length))
  }
  if (length > 12) {
    return [head].concat([len1], tail, rem)
  }
  return head
}

// As above but vibrates entire note
function vibAll(length, pitch, speed, width) {
  // Generate cycle
  let n = 2 * (3.5 / speed)
  let cycle = vibrato(n, pitch, speed, width)
  //console.log("cycle:", cycle)
  let reps = Math.floor(length / cycle.length)
  //console.log("reps:", reps)
  let rem = cycle.slice(0, length % cycle.length)
  let tail = []
  if (reps > 1) {
    let loopReps = new Map()
    loopReps.set("ʞarp", reps)
    let loopEnd = new Map()
    loopEnd.set("ʞarp", "ʞend")
    tail = tail.concat([loopReps], cycle, [loopEnd])
  }
  if (reps === 1) {
    tail = tail.concat(cycle)
  }
  let len1 = new Map()
  len1.set("ʞlength", 1)
  return [len1].concat(tail, rem)
}

function bufferToWave(abuffer, len) {
    var numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        offset = 0,
        pos = 0;
    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {             // interleave channels
            //const level = channels[i][offset] * 1.5  // boost by 3dB
            const level = channels[i][offset]
            sample = Math.max(-1, Math.min(1, level)); // clamp
            sample *= 32768; // scale to 16-bit signed int
            view.setInt16(pos, sample, true);          // write 16-bit sample
            pos += 2;
        }
        offset++                                     // next source sample
    }
    // create Blob
    return new Blob([buffer], { type: "audio/wav" });

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
}

function buf_download(name, abuffer) {
    var new_file = URL.createObjectURL(bufferToWave(abuffer, abuffer.length));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", new_file);
    downloadAnchorNode.setAttribute("download", name);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export function exportAudio(filename, rom) {
  if (loadNsf(rom)) {
    setLoaded()
    let audioBuffer = new Float32Array()
    let cycleCount = 0;
    while (cycleCount < (songLength + 100)) {
      runFrameSilent()
      const newBuffer = new Float32Array(audioBuffer.length + sampleBuffer.length);
      newBuffer.set(audioBuffer, 0);
      newBuffer.set(sampleBuffer, audioBuffer.length);
      audioBuffer = newBuffer;
      cycleCount++;
    }
    const offlineCtx = new OfflineAudioContext(1, audioBuffer.length, actx.sampleRate)
    const abuf = offlineCtx.createBuffer(1, audioBuffer.length, offlineCtx.sampleRate);
    const nowBuffering = abuf.getChannelData(0);
    for (let i = 0; i < abuf.length; i++) {
      nowBuffering[i] = audioBuffer[i]
    }
    const source = new AudioBufferSourceNode(offlineCtx, {buffer: abuf});
    const biquadFilter = offlineCtx.createBiquadFilter();
    biquadFilter.type = "highpass";
    biquadFilter.frequency.setValueAtTime(37, offlineCtx.currentTime);
    source.connect(biquadFilter);
    biquadFilter.connect(offlineCtx.destination);
    source.start();
    offlineCtx.startRendering()
    offlineCtx.oncomplete = (e) => buf_download(filename, e.renderedBuffer);
  }
}

export function getSamples(data, count) {
  // apu returns 29780 or 29781 samples (0 - 1) for a frame
  // we need count values (0 - 1)
  let audio_buffer = data
  let samples = apu.getOutput();
  let runAdd = (29780 / count);
  let total = 0;
  let inputPos = 0;
  let running = 0;
  for (let i = 0; i < count; i++) {
    running += runAdd;
    let total = 0;
    let avgCount = running & 0xffff;
    for (let j = inputPos; j < inputPos + avgCount; j++) {
      total += samples[1][j];
    }
    audio_buffer[i] = total / avgCount;
    inputPos += avgCount;
    running -= avgCount;
  }
  processor.port.postMessage({"type": "samples", "samples": audio_buffer});
}

function runFrameSilent() {
  // version of runFrame that doesn't call updateDebugView()
  if (playReturned) {
    cpu.set_pc(0x3ff8)
  }
  setPlayReturned(false);
  let cycleCount = 0;
  while (cycleCount < 29780) {
    cpu.setIrqWanted(dmcIrqWanted || frameIrqWanted)
    if (!playReturned) {
      cpu.cycle();
    }
    apu.cycle();
    if (cpu.br[0] === 0x3ffd) {
      // we are in the nops after the play-routine, it finished
      setPlayReturned(true);
    }
    cycleCount++;
  }
  getSamples(sampleBuffer, samplesPerFrame);
}
