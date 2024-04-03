import { loadNsf, setLoaded, startSong, playReturned, setPlayReturned,
  dmcIrqWanted, frameIrqWanted } from "../main";
import * as cpu from "./cpu";
import * as apu from "./apu";
import { s1, addEnvelope, resetEnvelopes, currentEnvelopes } from "./nsf"

export const actx = new AudioContext()
export const samplesPerFrame = actx.sampleRate / 60;
export let sampleBuffer = new Float32Array(samplesPerFrame);

await actx.audioWorklet.addModule("audioworklet.js");

export const processor = new AudioWorkletNode(actx, "audioworklet")
let sourceNode = null

export function resume() {
    actx.resume();
}

export function start() {
  sourceNode = actx.createBufferSource();
  processor.connect(actx.destination);
  sourceNode.start();
}

export function stop() {
  if (sourceNode) {
    sourceNode.stop();
    sourceNode.disconnect();
  }
    processor.disconnect();
}

function freqToPeriod(freq) {
    const c = 1789773;
    return c / (freq * 16) - 1
}

function midiToFreq(n) {
    return 440 * (Math.pow(2, ((n-69) / 12)))
}

function fmtWord(n) {
  // need to handle edge case of note 41, which happens to
  // return [0, 5], and the driver uses 0 as rests.
  // But we want to return a [0, 0] for 160 because
  // it's convenient to use for rests. So we'll use
  // any pitch above 127, or below period 7.91.
  if (n < 7.91) {
    return [0, 0]
  }
  n = Math.round(n)
  const pad = String(n.toString(16)).padStart(4, '0');
  return [Math.max(1, parseInt(pad.slice(2), 16)),
          parseInt(pad.slice(0, 2), 16)];
}

export let songLength = 0

export function resetSongLength() {
  songLength = 0
}

function hex(n) {
    return "$" + (n).toString(16);
}

function fmt(n) {
  const lo = hex(fmtWord(n)[0])
  const hi = hex(fmtWord(n)[1])
  return hi + lo.substring(1, 3)
}

let streams = []

export function assembleStream(notes, streamNum) {
    //console.log("Assembling stream " + streamNum)
    let stream = []
    let currentLength = 0
    let totalLength = 0
    let loopPoint = s1
    let arpPoint = s1
    let s2
    let s3
    //console.log("s1 is at " + fmt(s1))
    if (streamNum === 1) {
      loopPoint = s1 + streams[0].length
      s2 = s1 + streams[0].length
      //console.log("stream 2 is at " + fmt(loopPoint))
    }
    if (streamNum === 2) {
      loopPoint = s1 + streams[0].length + streams[1].length
      s3 = s1 + streams[0].length + streams[1].length
      //console.log("stream 3 is at " + fmt(loopPoint))
    }
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].has("ʞloop")) {
          if (notes[i].get("ʞloop") === "ʞend") {
            //console.log("[assemble] End loop")
            // loop opcode $A5 followed by the address to loop to
            //console.log("[assemble] loop back to " + fmt(loopPoint))
            stream = stream.concat([0xA5], fmtWord(loopPoint))
          } else {
            // set loop point variable and loop counter
          loopPoint = (stream.length + [s1, s2, s3][streamNum]) + 2
          //console.log("[assemble] setting loop point to " + fmt(loopPoint))
          //console.log("[assemble] set loop counter to " + notes[i].get("ʞloop"))
          stream.push(0xA4, notes[i].get("ʞloop"))
          }
        }
        if (notes[i].has("ʞarp")) {
          if (notes[i].get("ʞarp") === "ʞend") {
            stream = stream.concat([0xAA], fmtWord(arpPoint))
          } else {
            // set arp point variable and arp counter
          arpPoint = (stream.length + [s1, s2, s3][streamNum]) + 2
          stream.push(0xA9, notes[i].get("ʞarp"))
          }
        }
        if (notes[i].has("ʞlength")) {
          const l = notes[i].get("ʞlength")
          // lengths > 25 need to be handled differently, since
          // the driver expects them to be from 0x81-0x99. so if
          // it's too large, we set it to 25 and handle it later.
          // in case of long volume envelopes, we need to note the 
          // position so it can create a new shorter one,
          // and switch back afterwards. Arps too...
          if (l > 25) {
            stream.push(25 + 0x80)
          }
          currentLength = l
        }
        if (notes[i].has("ʞenvelope")) {
          if (!containsEnvelope(notes[i].get("ʞenvelope"), currentEnvelopes)) {
            console.log("not found")
          }
          addEnvelope(notes[i].get("ʞenvelope"))
        }
        if (notes[i].has("ʞvolume")) {
          stream.push(0xa2, notes[i].get("ʞvolume"))
        }
        if (notes[i].has("ʞduty")) {
          stream.push(0xA3)
          const duties = [0x30, 0x70, 0xB0, 0xF0]
          stream.push(duties[notes[i].get("ʞduty")])
        }
        if (notes[i].has("ʞpitch")) {
             const freq = midiToFreq(notes[i].get("ʞpitch"))
             const period = freqToPeriod(freq)
             const word = fmtWord(period)
             // to deal with lengths > 25, we push the note as many
             // times as needed to make the proper length.
             // if < 25 this will simply be 0.
             const reps = Math.floor(currentLength / 25)
             for (let i = 0; i < reps; i++) {
               stream.push(word[1])
               stream.push(word[0])
             }
             // switch length to remainder and push the last note
             stream.push((currentLength % 25) + 0x80)
             stream.push(word[1])
             stream.push(word[0])
             totalLength += currentLength
        }
    }
    // $A0 = opcode to end stream
    stream.push(0xa0)
    if (totalLength > songLength) {songLength = totalLength}
    streams[streamNum] = stream
    //console.log("Assembled " + stream.length + " bytes")
    return stream
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function containsEnvelope(env, envs) {
  for (var i = 0; i < envs.length; i++) {
     if (arraysEqual(env, envs[i])) {
       return true
     }
  }
  return false
}

let noiseLen = 0

export function assembleNoise(notes) {
    let stream = []
    let totalLength = 0
    let loopPoint = s1 + streams[0].length + streams[1].length + streams[2].length
    let s4 = s1 + streams[0].length + streams[1].length + streams[2].length
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].has("ʞloop")) {
          if (notes[i].get("ʞloop") === "ʞend") {
            // loop opcode $A5 followed by the address to loop to
            stream = stream.concat([0xA5], fmtWord(loopPoint))
          } else {
            // set loop point variable and loop counter
          loopPoint = (stream.length + s4) + 2
          stream.push(0xA4, notes[i].get("ʞloop"))
          }
        }
        if (notes[i].has("ʞlength")) {
          const l = notes[i].get("ʞlength")
          stream.push(Math.min(25, l) + 0x80)
          noiseLen = l
        }
        if (notes[i].has("ʞvolume")) {
          stream.push(0xa2, notes[i].get("ʞvolume"))
        }
        if (notes[i].has("ʞduty")) {
          stream.push(notes[i].get("ʞduty") + 0xf0)
        }
        if (notes[i].has("ʞpitch") && (noiseLen != 0)) {
             // deal with lengths > 25
             const reps = Math.floor(noiseLen / 25)
             for (let i = 0; i < reps; i++) {
                stream.push(notes[i].get("ʞpitch"))
             }
             // switch length to remainder
             stream.push((noiseLen % 25) + 0x80)
             stream.push(notes[i].get("ʞpitch"))
             totalLength += noiseLen
        }
    }
    stream.push(0xa0)
    if (totalLength > songLength) {songLength = totalLength}
    return stream
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

// affects entire notee
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

//console.log(vibAll(28, 40, 0.5, 0.3))

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
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
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
  resetEnvelopes()
  if (loadNsf(rom)) {
    setLoaded()
    let audioBuffer = new Float32Array()
    let cycleCount = 0;
    while (cycleCount < (songLength * 4)) {
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


