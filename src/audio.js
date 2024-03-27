import { loadNsf, setLoaded, startSong, playReturned, setPlayReturned,
  dmcIrqWanted, frameIrqWanted } from "../main";
import * as cpu from "./cpu";
import * as apu from "./apu";

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
  n = Math.round(n)
  const pad = String(n.toString(16)).padStart(4, '0');
  return [parseInt(pad.slice(2), 16),
          parseInt(pad.slice(0, 2), 16)];
}

export let songLength = 0

export function resetSongLength() {
  songLength = 0
}

export function assembleStream(notes) {
    let stream = []
    let currentLength = 0
    let totalLength = 0
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].has("ʞlength")) {
          const l = notes[i].get("ʞlength")
          // lengths > 95 need to be handled differently, since
          // the driver expects them to be from 0x81-0xdf. so if
          // it's too large, we set it to 95 and handle it later.
          stream.push(Math.min(95, l) + 0x80)
          currentLength = l
        }
        if (notes[i].has("ʞvolume")) {
          // adjust volume to 0xe0-0xef, which is
          // what the driver expects
          stream.push(notes[i].get("ʞvolume") + 0xe0)
        }
        if (notes[i].has("ʞduty")) {
          // adjust duty to 0xf0-0xf3
          stream.push(notes[i].get("ʞduty") + 0xf0)
        }
        if (notes[i].has("ʞpitch")) {
             const freq = midiToFreq(notes[i].get("ʞpitch"))
             const period = freqToPeriod(freq)
             const word = fmtWord(period)
             // to deal with lengths > 95, we push the note as many
             // times as needed to make the proper length.
             // if < 95 this will simply be 0.
             const reps = Math.floor(currentLength / 95)
             for (let i = 0; i < reps; i++) {
               stream.push(word[1])
               stream.push(word[0])
             }
             // switch length to remainder and push the last note
             stream.push((currentLength % 95) + 0x80)
             stream.push(word[1])
             stream.push(word[0])
             totalLength += currentLength
        }
    }
    stream.push(0xFF)
    if (totalLength > songLength) {songLength = totalLength}
    return stream
}

export function assembleNoise(notes) {
    let stream = []
    let currentLength = 0
    let totalLength = 0
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].has("ʞlength")) {
          const l = notes[i].get("ʞlength")
          stream.push(Math.min(95, l) + 0x80)
          currentLength = l
        }
        if (notes[i].has("ʞvolume")) {
          stream.push(notes[i].get("ʞvolume") + 0xe0)
        }
        if (notes[i].has("ʞduty")) {
          stream.push(notes[i].get("ʞduty") + 0xf0)
        }
        if (notes[i].has("ʞpitch")) {
             // deal with lengths > 95
             const reps = Math.floor(currentLength / 95)
             for (let i = 0; i < reps; i++) {
                stream.push(notes[i].get("ʞpitch"))
             }
             // switch length to remainder
             stream.push((currentLength % 95) + 0x80)
             stream.push(notes[i].get("ʞpitch"))
             totalLength += currentLength
        }
    }
    stream.push(0xFF)
    if (totalLength > songLength) {songLength = totalLength}
    return stream
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
  if (loadNsf(rom)) {
    setLoaded()
    let audioBuffer = new Float32Array()
    let cycleCount = 0;
    while (cycleCount < songLength) {
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

