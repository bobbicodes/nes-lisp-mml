import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import { updateDocBar } from "./src/eval-region";
import { updateDebugView } from "./src/debugger";
import * as cpu from "./src/cpu";
import * as apu from "./src/apu";
import {songLength, make_download} from "./src/audio";
import * as mapper from "./src/nsfmapper";
import { AudioHandler, samplesPerFrame, sampleBuffer, resume, nextBuffer } from "./src/audiohandler";

let editorState = EditorState.create({
  doc: `(defn drum [pitch]
  (concat [{:length 1}]
    (map #(hash-map :volume % :pitch pitch)
      (reverse (range 4 16)))))

(def drums
  (concat 
    (drum 0x0D) {:length 53 :volume 0 :pitch 0}
    (drum 0x07) {:length 53 :volume 0 :pitch 0}
    (drum 0x0D) {:length 53 :volume 0 :pitch 0}
    (drum 0x07) {:length 53 :volume 0 :pitch 0}
    (drum 0x0D) {:length 53 :volume 0 :pitch 0}))

(defn vibrato [pitch length speed width]
  (concat [{:length 1}]
    (for [x (range length)]
      {:pitch (+ pitch (* width (sin (* speed x))))})))

(defn lead-inst
  "Creates a note of a given pitch/length, applies linearly 
   increasing vibrato at given rate up to the given depth."
  [pitch length depth rate]
  (apply concat (for [x (range length)]
      (vibrato pitch 10 0.5 (min depth (+ (* x rate)))))))

(defn lead
  "Takes vector pairs of pitch/length,
   outputs a part using lead-inst."
  [notes]
  (apply concat (for [[pitch length] notes]
            (lead-inst pitch length 0.5 0.25))))

(play-nsf
  (lead (map (fn [[pitch length]] [(+ pitch 7) length])
  [[50 2.5] [53 2.5] [52 1.25] [50 1.25] [48 2.5] [50 2.5]
       [53 2.5] [55 1.25] [53 1.25] [52 1.25] [50 5]]))
  (lead [[50 2.5] [53 2.5] [52 1.25] [50 1.25] [48 2.5] [50 2.5]
       [53 2.5] [55 1.25] [53 1.25] [52 1.25] [50 5]])
  (lead [[50 2.5] [53 2.5] [52 1.25] [50 1.25] [48 2.5] [50 2.5]
       [53 2.5] [55 1.25] [53 1.25] [52 1.25] [50 5]])
  drums)

(def tri-kick
  (concat [{:length 1}]
    (for [x (reverse (range 55 69 3))]
      {:pitch x})))

(defn bass-kick-inst
  "Precedes a note with a fixed 5-note descending arpeggio.
   First 5 frames are replaced to maintain length."
  [{:keys [pitch length]}]
  (conj (vec tri-kick) {:pitch pitch :length (- length 5)}))

(defn bass-kick [notes]
  (apply concat (for [[pitch length] notes]
            (bass-kick-inst {:pitch pitch :length length}))))

(defn bass [pitch]
  (bass-kick 
      [[(+ pitch 60) 12] [(+ pitch 60) 12] [(+ pitch 63) 12] [(+ pitch 63) 12] 
       [(+ pitch 65) 12] [(+ pitch 65) 12] [(+ pitch 66) 12] [(+ pitch 65) 12]]))

(defn walking-bass [intervals]
  (apply concat (for [pitch intervals]
    (bass pitch))))

(play-nsf [] []
  (walking-bass [0 0 0 0 5 5 0 0 7 5 0 0]) [])`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})

let topLevelText = "Shift+Enter = Eval top-level form"
let keyBindings = "<strong>Key bindings:</strong>,Alt/Cmd+Enter = Eval all," +
  topLevelText + ",Ctrl+Enter = Eval at cursor";
keyBindings = keyBindings.split(',');
for (let i = 0; i < keyBindings.length; i++)
  keyBindings[i] = "" + keyBindings[i] + "<br>";
keyBindings = keyBindings.join('');
document.getElementById("keymap").innerHTML = keyBindings;

document.querySelector('#app').onclick = (e) => updateDocBar(view)

let audio = new AudioHandler();

export function getByteRep(val) {
  return ("0" + val.toString(16)).slice(-2);
}

export let ram = new Uint8Array(0x800);

export let callArea = new Uint8Array(0x10);
let totalSongs = 0;
let startSong = 0;
let tags = {
  name: "",
  artist: "",
  copyright: ""
}
let playReturned = true;
let frameIrqWanted = false;
let dmcIrqWanted = false;

let paused = false;
let loaded = false;
let pausedInBg = false;
let loopId = 0;

function log(text) {
  el("log").innerHTML += text + "<br>";
  el("log").scrollTop = el("log").scrollHeight;
}

function el(id) {
  return document.getElementById(id);
}

let currentSong = 1;

export function loadRom(rom) {
  framesPlayed = 0
  audio.stop();
  audio.start();
  if (loadNsf(rom)) {
    if (!loaded && !paused) {
      loopId = requestAnimationFrame(update);
    }
    loaded = true;
    currentSong = startSong;
  }
}

export function exportAudio(rom) {
  if (loadNsf(rom)) {
    loaded = true;
    currentSong = startSong;
    let audioBuffer = new Float32Array()
    let cycleCount = 0;
    while (cycleCount < songLength) {
      runFrameSilent()
      const newBuffer = new Float32Array(
         audioBuffer.length + sampleBuffer.length
      );
      newBuffer.set(audioBuffer, 0);
      newBuffer.set(sampleBuffer, audioBuffer.length);
      audioBuffer = newBuffer;
      cycleCount++;
    }
    make_download("test.wav", audioBuffer)
  }
}

function runFrameSilent() {
  // version of runFrame that doesn't call `nextBuffer()`
  if (playReturned) {
    cpu.set_pc(0x3ff8)
  }
  playReturned = false;
  let cycleCount = 0;
  while (cycleCount < 29780) {
    cpu.setIrqWanted(dmcIrqWanted || frameIrqWanted)
    if (!playReturned) {
      cpu.cycle();
    }
    apu.cycle();
    if (cpu.br[0] === 0x3ffd) {
      // we are in the nops after the play-routine, it finished
      playReturned = true;
    }
    cycleCount++;
  }
  getSamples(sampleBuffer, samplesPerFrame);
}

function getWordRep(val) {
  return ("000" + val.toString(16)).slice(-4).toUpperCase();
}

export function loadNsf(nsf) {
  if (nsf.length < 0x80) {
    log("Invalid NSF loaded");
    return false;
  }
  if (
    nsf[0] !== 0x4e || nsf[1] !== 0x45 || nsf[2] !== 0x53 ||
    nsf[3] !== 0x4d || nsf[4] !== 0x1a
  ) {
    log("Invalid NSF loaded");
    return false;
  }
  if (nsf[5] !== 1) {
    log("Unknown NSF version: " + nsf[5]);
    return false;
  }
  totalSongs = nsf[6];
  //log(totalSongs + " total songs");
  startSong = nsf[7];
  //log("Start song: " + startSong);
  let loadAdr = nsf[8] | (nsf[9] << 8);
  //log("Load address: $" + getWordRep(loadAdr))
  if (loadAdr < 0x8000) {
    log("Load address less than 0x8000 is not supported");
    return false;
  }
  let initAdr = nsf[0xa] | (nsf[0xb] << 8);
  //log("Init address: $" + getWordRep(initAdr))
  let playAdr = nsf[0xc] | (nsf[0xd] << 8);
  //log("Play address: $" + getWordRep(playAdr))
  for (let i = 0; i < 32; i++) {
    if (nsf[0xe + i] === 0) {
      break;
    }
    tags.name += String.fromCharCode(nsf[0xe + i]);
  }
  for (let i = 0; i < 32; i++) {
    if (nsf[0x2e + i] === 0) {
      break;
    }
    tags.artist += String.fromCharCode(nsf[0x2e + i]);
  }
  for (let i = 0; i < 32; i++) {
    if (nsf[0x4e + i] === 0) {
      break;
    }
    tags.copyright += String.fromCharCode(nsf[0x4e + i]);
  }
  let initBanks = [0, 0, 0, 0, 0, 0, 0, 0];
  let total = 0;
  for (let i = 0; i < 8; i++) {
    initBanks[i] = nsf[0x70 + i];
    total += nsf[0x70 + i];
  }
  //log("Bankswitch init values: " + initBanks)
  let banking = total > 0;

  // set up the NSF mapper

  mapper.set_data(nsf)
  mapper.set_loadAdr(loadAdr)
  mapper.set_banked(banking)
  mapper.set_banks(initBanks)
  mapper.reset()

  callArea[0] = 0x20; // JSR
  callArea[1] = initAdr & 0xff;
  callArea[2] = initAdr >> 8;
  callArea[3] = 0xea // NOP
  callArea[4] = 0xea // NOP
  callArea[5] = 0xea // NOP
  callArea[6] = 0xea // NOP
  callArea[7] = 0xea // NOP
  callArea[8] = 0x20; // JSR
  callArea[9] = playAdr & 0xff;
  callArea[0xa] = playAdr >> 8;
  callArea[0xb] = 0xea // NOP
  callArea[0xc] = 0xea // NOP
  callArea[0xd] = 0xea // NOP
  callArea[0xe] = 0xea // NOP
  callArea[0xf] = 0xea // NOP

  playSong(startSong);
  //log("Loaded NSF file");
  return true;
}

function playSong(songNum) {
  // also acts as a reset
  for (let i = 0; i < ram.length; i++) {
    ram[i] = 0;
  }
  playReturned = true;
  apu.reset();
  cpu.reset();
  mapper.reset();
  frameIrqWanted = false;
  dmcIrqWanted = false;
  for (let i = 0x4000; i <= 0x4013; i++) {
    apu.write(i, 0);
  }
  apu.write(0x4015, 0);
  apu.write(0x4015, 0xf);
  apu.write(0x4017, 0x40);

  // run the init routine
  cpu.br[0] = 0x3ff0;
  cpu.r[0] = songNum - 1;
  cpu.r[1] = 0;
  // don't allow init to take more than 10 frames
  let cycleCount = 0;
  let finished = false;
  while (cycleCount < 297800) {
    cpu.cycle();
    apu.cycle();
    if (cpu.br[0] === 0x3ff5) {
      // we are in the nops after the init-routine, it finished
      finished = true;
      break;
    }
    cycleCount++;
  }
  if (!finished) {
    //log("Init did not finish within 10 frames");
  }
}

let framesPlayed = 0

function update() {
  if (framesPlayed === songLength) {
    audio.stop()
  }
  runFrame();
  framesPlayed++
  loopId = requestAnimationFrame(update);
}

function runFrame() {
  // run the cpu until either a frame has passed, or the play-routine returned
  if (playReturned) {
    cpu.set_pc(0x3ff8)
  }
  playReturned = false;
  let cycleCount = 0;
  while (cycleCount < 29780) {
    cpu.setIrqWanted(dmcIrqWanted || frameIrqWanted)
    if (!playReturned) {
      cpu.cycle();
    }
    apu.cycle();
    if (cpu.br[0] === 0x3ffd) {
      // we are in the nops after the play-routine, it finished
      playReturned = true;
    }
    cycleCount++;
  }
  getSamples(sampleBuffer, samplesPerFrame);
  nextBuffer();
  updateDebugView()
}

function getSamples(data, count) {
  // apu returns 29780 or 29781 samples (0 - 1) for a frame
  // we need count values (0 - 1)
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
    data[i] = total / avgCount;
    inputPos += avgCount;
    running -= avgCount;
  }
}

export function read(adr) {
  adr &= 0xffff;

  if (adr < 0x2000) {
    // ram
    return ram[adr & 0x7ff];
  }
  if (adr < 0x3ff0) {
    // ppu ports, not readable in NSF
    return 0;
  }
  if (adr < 0x4000) {
    // special call area used internally by player
    return callArea[adr & 0xf];
  }
  if (adr < 0x4020) {
    // apu/misc ports
    if (adr === 0x4014) {
      return 0; // not readable
    }
    if (adr === 0x4016 || adr === 0x4017) {
      return 0; // not readable in NSF
    }
    return apu.read(adr);
  }
  return mapper.read(adr);
}

export function write(adr, value) {
  adr &= 0xffff;

  if (adr < 0x2000) {
    // ram
    ram[adr & 0x7ff] = value;
    return;
  }
  if (adr < 0x4000) {
    // ppu ports, not writable in NSF
    return;
  }
  if (adr < 0x4020) {
    // apu/misc ports
    if (adr === 0x4014 || adr === 0x4016) {
      // not writable in NSF
      return;
    }
    apu.write(adr, value);
    return;
  }
  mapper.write(adr, value);
}
