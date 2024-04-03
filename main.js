import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import { updateDocBar } from "./src/eval-region";
import { updateDebugView } from "./src/debugger";
import * as cpu from "./src/cpu";
import * as apu from "./src/apu";
import * as audio from "./src/audio";
import * as mapper from "./src/nsfmapper";

let editorState = EditorState.create({
  doc: `(defn drum
  "Takes a decay length and a volume-pitch sequence."
  [length vol-pitch]
  (let [frame1 {:length 1 :volume (ffirst vol-pitch)
                :pitch (last (first vol-pitch))}
        midframes (for [[volume pitch] (rest (take length vol-pitch))]
                    {:volume volume :pitch pitch})
        tail {:length (if (< length (count vol-pitch))
                        0 (- length (count vol-pitch)))
                    :volume 0 :pitch 0}]
    (concat [frame1] midframes [tail])))

(defn kick [length]
  (drum length [[10 6] [7 2] [4 1] [3 1] [2 0]]))

(defn snare [length]
  (drum length [[11 8] [9 6] [8 6] [7 6]
                [4 5] [3 5] [2 5] [1 5]]))

(defn hat [length]
  (drum length [[4 3] [3 2] [2 0] [1 0]]))

(defn hat2 [length]
 (drum length [[3 3] [2 2] [1 0] [1 0]]))

(defn oh [length]
  (drum length [[6 3] [5 3] [4 3] [4 3] [4 3] [4 3]
                [4 3] [4 3] [3 2] [2 0] [1 0] [1 0]]))

(defn crash
  ([length attenuation]
   (drum length (map (fn [[volume pitch]] [(max 1 (- volume attenuation 2)) pitch])
               [[15 8] [15 2] [15 3] [15 3] [15 3] [15 3]
                [14 3] [14 3] [13 3] [12 3] [12 3] [11 3] [11 3]
                [10 3] [9 3] [9 3] [9 3] [8 3] [8 3] [7 3] [7 3]
                [6 3] [6 3] [5 3] [5 3] [5 3] [4 3] [4 3] [4 3] [4 3]
                [3 3] [3 3] [3 3] [3 3] [2 3] [2 3] [2 3] [2 3] [1 3]])))
  ([length]
    (drum length [[15 8] [15 2] [15 3] [15 3] [15 3] [15 3]
                [14 3] [14 3] [13 3] [12 3] [12 3] [11 3] [11 3]
                [10 3] [9 3] [9 3] [9 3] [8 3] [8 3] [7 3] [7 3]
                [6 3] [6 3] [5 3] [5 3] [5 3] [4 3] [4 3] [4 3] [4 3]
                [3 3] [3 3] [3 3] [3 3] [2 3] [2 3] [2 3] [2 3] [1 3]])))

(defn tom [length]
  (drum length [[4 12] [4 6] [3 6] [2 6] [1 6]]))

(defn tom2 [length]
  (drum length [[3 12] [3 6] [2 6] [1 6] [1 6]]))

(defn r
  "Returns a sequence consisting of a rest of length l."
  [l]
  [{:length l :volume 0 :pitch 0}])

(defn release [notes]
  (let [head (take (- (count notes) 5) notes)
        tail (drop (- (count notes) 5) notes)]
    (if (= (count tail) 5)
      (concat head (map-indexed (fn [index note] 
                 (assoc note :volume (- 6 index)))
          tail)) notes)))

(defn slide [from to frames]
  (length-pitch (take frames 
    (if (< to from)
      (map #(vector 1 %) (reverse (range to from (/ (abs (- from to)) frames))))
      (map #(vector 1 %) (range from to (/ (abs (- from to)) frames)))))))

(def sq1a
  (concat 
    [{:length 6 :volume 9 :duty 0 :pitch 38} {:length 1 :volume 8 :pitch 38}
     {:length 1 :volume 7 :pitch 38} {:length 1 :volume 6 :pitch 38}
     {:length 1 :volume 5 :pitch 38} {:pitch 160 :length 10}
     {:pitch 60 :volume 6 :length 5} {:pitch 62} {:pitch 60} {:pitch 50}
     {:length 6 :volume 8 :pitch 38} {:length 1 :volume 7 :pitch 38}
     {:length 1 :volume 6 :pitch 38} {:length 1 :volume 5 :pitch 38}
     {:length 1 :volume 4 :pitch 38} {:pitch 160 :length 10}
     {:pitch 58 :volume 6 :length 5} {:pitch 60} {:pitch 58} {:pitch 50}
     {:length 6 :volume 6 :pitch 38} {:length 1 :volume 5 :pitch 38}
     {:length 1 :volume 4 :pitch 38} {:length 1 :volume 3 :pitch 38}
     {:length 1 :volume 2 :pitch 38} {:pitch 160 :length 10}
     {:pitch 57 :volume 6 :length 5} {:pitch 58} {:pitch 57} {:pitch 50}
     {:pitch 53} {:pitch 55} {:pitch 53} {:pitch 45} {:pitch 52} 
     {:pitch 53} {:pitch 52} {:pitch 49}
     {:length 20 :pitch 45} 
     {:length 2 :pitch 57} {:pitch 64} {:pitch 57} {:pitch 69} {:pitch 160}
     {:pitch 57} {:pitch 64} {:pitch 57} {:pitch 69} {:pitch 57}
     {:length 20 :pitch 45}
     {:length 2 :pitch 57} {:pitch 64} {:pitch 57} {:pitch 69} {:pitch 57} {:length 10 :pitch 160}
     {:length 20 :pitch 50} 
     {:length 2 :pitch 62} {:pitch 69} {:pitch 62} {:pitch 74} {:pitch 160}
     {:pitch 62} {:pitch 69} {:pitch 62} {:pitch 74} {:pitch 62}
     {:length 20 :pitch 50}
     {:length 2 :pitch 62} {:pitch 69} {:pitch 62} {:pitch 74} {:pitch 62} {:length 10 :pitch 160}]))

(def sq1b
  (concat 
    [{:length 10 :volume 6 :duty 0 :pitch 50} 
     {:length 9 :volume 5 :pitch 160}
     {:length 1 :pitch 50} {:pitch 57} {:pitch 65}
     {:pitch 69} {:length 2 :pitch 74} 
     {:length 7 :pitch 160} {:length 3 :pitch 74}
     {:length 4 :pitch 160} {:length 1 :pitch 50} 
     {:pitch 57} {:pitch 65} {:pitch 69} 
     {:length 2 :pitch 74} {:length 7 :pitch 160}
     {:length 3 :pitch 74} {:length 4 :pitch 160}
     {:length 1 :pitch 50} {:pitch 57} {:pitch 65} 
     {:pitch 69} {:length 2 :pitch 74} 
     {:length 7 :pitch 160} {:length 3 :pitch 74} 
     {:length 4 :pitch 160}]))

(def sq2a
  (concat [{:length 160 :volume 0 :pitch 160}
           {:length 20 :volume 5 :duty 0 :pitch 33}
           {:length 8 :volume 4 :pitch 61} {:length 2 :pitch 160} {:length 10 :pitch 61}
           {:length 20 :volume 5 :duty 0 :pitch 33}
           {:length 10 :volume 4 :pitch 61} {:length 10 :pitch 160}
           {:length 20 :volume 5 :duty 0 :pitch 38}
           {:length 8 :volume 4 :pitch 65} {:length 2 :pitch 160} {:length 10 :pitch 65}
           {:length 20 :volume 5 :duty 0 :pitch 38}
           {:length 10 :volume 4 :pitch 65} {:length 10 :pitch 160}]))

(def sq2b
  (concat [{:length 20 :volume 5 :duty 0 :pitch 33}
           {:length 8 :volume 4 :pitch 61} {:length 2 :pitch 160} {:length 10 :pitch 61}
           {:length 20 :volume 5 :duty 0 :pitch 33}
           {:length 10 :volume 4 :pitch 61} {:length 10 :pitch 160}
           {:length 20 :volume 5 :duty 0 :pitch 38}
           {:length 8 :volume 4 :pitch 65} {:length 2 :pitch 160} {:length 10 :pitch 65}
           {:length 10 :pitch 160}
           {:length 10 :volume 5 :duty 0 :pitch 38}
           {:length 10 :volume 4 :pitch 65} {:length 10 :pitch 38}]))


(def tri-kick
  [{:length 1 :pitch 62}
   {:pitch 58} {:pitch 54} 
   {:pitch 52}])

(def tri-snare
  [{:length 1 :pitch 70}
   {:pitch 67} {:pitch 64}
   {:pitch 54}])

(def tri1
  (concat [{:length 160 :pitch 160}]
    tri-kick [{:length 16 :pitch 45}]
    tri-snare [{:length 4 :pitch 57}
               {:length 2 :pitch 160}]
    tri-snare [{:length 6 :pitch 57}]
    tri-kick [{:length 16 :pitch 45}]
    tri-snare [{:length 6 :pitch 57} 
               {:length 10 :pitch 160}]
    tri-kick [{:length 16 :pitch 50}]
    tri-snare [{:length 4 :pitch 62} 
               {:length 2 :pitch 160}]
    tri-snare [{:length 6 :pitch 62}]
    tri-kick [{:length 16 :pitch 50}]
    tri-snare [{:length 6 :pitch 62} 
               {:length 10 :pitch 160}]))

(def tri2
  (concat tri-kick [{:length 6 :pitch 50} {:length 30 :pitch 160}]
          tri-kick [{:length 6 :pitch 50} {:length 30 :pitch 160}]
          tri-kick [{:length 6 :pitch 50} {:length 70 :pitch 160}]
          tri-kick [{:length 16 :pitch 45}]
          tri-snare [{:length 4 :pitch 57} {:length 2 :pitch 160}]
          tri-snare [{:length 6 :pitch 57}]
          tri-kick [{:length 16 :pitch 45}]
          tri-snare [{:length 6 :pitch 57} {:length 10 :pitch 160}]
          tri-kick [{:length 16 :pitch 50}]
          tri-snare [{:length 4 :pitch 62} {:length 2 :pitch 160}]
          tri-snare [{:length 6 :pitch 62}]
          tri-kick [{:length 16 :pitch 50}]
          tri-snare [{:length 6 :pitch 62} {:length 10 :pitch 160}]))

(def tri3
  (concat tri-kick [{:length 16 :pitch 45}]
          tri-snare [{:length 4 :pitch 57} {:length 2 :pitch 160}]
          tri-snare [{:length 6 :pitch 57}]
          tri-kick [{:length 16 :pitch 45}]
          tri-snare [{:length 6 :pitch 57} {:length 10 :pitch 160}]
          tri-kick [{:length 16 :pitch 50}]
          tri-snare [{:length 4 :pitch 62} {:length 2 :pitch 160}]
          tri-snare [{:length 6 :pitch 62} {:length 10 :pitch 160}]
          tri-kick [{:length 6 :pitch 50}]
          tri-snare [{:length 6 :pitch 62}]
          tri-kick [{:length 6 :pitch 50}]))

(def drums1
  (concat [{:length 20 :volume 0 :pitch 0}] 
    (r 140) (crash 20 3) (snare 10) (snare 30) (snare 20)
    (crash 20 3) (snare 10) (snare 30) (snare 20)))

(def drums2
  (concat (crash 10 6) (r 30) (crash 10 6) (r 30) (crash 10 6) (r 70)
    (crash 20 3) (snare 10) (snare 30) (snare 20)
    (crash 20 3) (snare 10) (snare 30) (snare 20)))

(def drums3
  (concat (crash 20 3) (snare 10) (snare 30) (snare 20)
    (crash 20 3) (snare 10) (snare 10) (crash 15 6) (r 5) (snare 20)))

(def sq1c
  (concat 
    [{:length 20 :volume 6 :duty 0 :pitch 45} 
     {:length 2 :pitch 57} {:pitch 64} {:pitch 57} {:pitch 69} {:pitch 160}
     {:pitch 57} {:pitch 64} {:pitch 57} {:pitch 69} {:pitch 57}
     {:length 20 :pitch 45}
     {:length 2 :pitch 57} {:pitch 64} {:pitch 57} {:pitch 69} {:pitch 57} {:length 10 :pitch 160}
     {:length 20 :pitch 50} 
     {:length 2 :pitch 62} {:pitch 69} {:pitch 62} {:pitch 74} {:pitch 160}
     {:pitch 62} {:pitch 69} {:pitch 62} {:pitch 74} {:pitch 62}
     {:length 10 :pitch 160}
     {:length 10 :pitch 50}
     {:length 2 :pitch 62} {:pitch 69} {:pitch 62} {:pitch 74} {:pitch 62} 
     {:length 10 :pitch 50}]))

(def sq1
  (concat (loop1 3 sq1a) (take 56 sq1a) sq1b (loop1 3 sq1c) (take 18 sq1c) sq1b))

(def sq1d
  (concat [{:length 10 :pitch 160}]
  (loop1 4 (concat 
    [{:length 10 :volume 4 :duty 0 :pitch 57} 
     {:pitch 61} {:pitch 64} {:pitch 69} {:pitch 64} {:pitch 61} {:pitch 64}
     {:pitch 160} {:pitch 62} {:pitch 65} {:pitch 69}] {:duty 1 :volume 3}
    (vib-all [{:length 10 :pitch 86} {:length 10 :pitch 81} {:length 10 :pitch 77} {:length 20 :pitch 81}] 0.7 0.4)))))

(def sq2c
  (vib (concat [{:length 80 :duty 0 :pitch 33}
           {:length 80 :pitch 38}]) 0.5 0.12))

(def tri4
  (concat [{:length 80 :pitch 45}
           {:length 80 :pitch 50} ]))

(def drums4
  (loop1 8 (concat (crash 20 5) (crash 20 7) (crash 20 9) (crash 20 10))))

(play
  (concat sq1 [{:length 5 :pitch 160}] sq1d)
  (concat (loop1 3 sq2a) (take 9 sq2a)
    [{:length 60 :pitch 160}] (loop1 3 sq2b) (take 8 sq2b)
    [{:length 60 :pitch 160 :volume 2}] (loop1 4 sq2c))
  (concat (loop1 2 tri1) tri2 (take 50 tri2)
   [{:length 60 :pitch 160}] (loop1 3 tri3) (take 32 tri3)
    [{:length 60 :pitch 160}] (loop1 4 tri4))
  (concat (loop1 2 drums1) drums2 (take 95 drums2)
    (r 70) (loop1 3 drums3) (take 58 drums3) (r 70) drums4))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})

let outState = EditorState.create({
  readOnly: true,
  extensions: [
    //EditorView.editable.of(false),
    basicSetup, clojure()]
})

export let outView = new EditorView({
  state: outState,
  parent: document.querySelector('#out')
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

el("rom").onchange = function (e) {
  framesPlayed = -20000  // we don't know how long the nsf is
  let freader = new FileReader();
  freader.onload = function () {
    let buf = freader.result;
    let arr = new Uint8Array(buf);
    loadRom(arr);
  }
  freader.readAsArrayBuffer(e.target.files[0]);
}

export function getByteRep(val) {
  return ("0" + val.toString(16)).slice(-2);
}

export let ram = new Uint8Array(0x800);

export let callArea = new Uint8Array(0x10);
let totalSongs = 0;
export let startSong = 0;
let tags = {
  name: "",
  artist: "",
  copyright: ""
}
export let playReturned = true;

export function setPlayReturned(bool) {
  playReturned = bool
}

export let frameIrqWanted = false;
export let dmcIrqWanted = false;

let paused = false;
let loaded = false;
let pausedInBg = false;
let loopId = 0;

export function setLoaded() {
  loaded = true
}

document.onvisibilitychange = function(e) {
  if(document.hidden) {
    pausedInBg = false;
    if(!paused && loaded) {
      audio.stop();
      pausedInBg = true;
    }
  } else {
    if(pausedInBg && loaded) {
      audio.start();
      pausedInBg = false;
    }
  }
}

function log(text) {
  el("log").innerHTML += text + "<br>";
  el("log").scrollTop = el("log").scrollHeight;
}

function el(id) {
  return document.getElementById(id);
}

let currentSong = 1;

export function loadRom(rom) {
  framesPlayed = -600
  audio.stop();
  audio.start();
  audio.actx.resume()
  if (loadNsf(rom)) {
    if (!loaded && !paused) {
      loopId = requestAnimationFrame(update);
    }
    loaded = true;
    currentSong = startSong;
  }
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
  startSong = nsf[7];
  let loadAdr = nsf[8] | (nsf[9] << 8);
  if (loadAdr < 0x8000) {
    log("Load address less than 0x8000 is not supported");
    return false;
  }
  let initAdr = nsf[0xa] | (nsf[0xb] << 8);
  let playAdr = nsf[0xc] | (nsf[0xd] << 8);
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

  // https://www.nesdev.org/wiki/NSF#Bank_Switching
  // The ROM image should consist of a contiguous set of 4k banks
  let initBanks = [0, 0, 0, 0, 0, 0, 0, 0];
  let total = 0;
  for (let i = 0; i < 8; i++) {
    initBanks[i] = nsf[0x70 + i];
    total += nsf[0x70 + i];
  }
  let banking = total > 0;

  // set up the NSF mapper

  mapper.set_data(nsf)
  mapper.set_loadAdr(loadAdr)
  mapper.set_banked(banking)
  //console.log("Banking: " + initBanks)
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
  //if (framesPlayed === audio.songLength) {
  //  audio.stop()
  //}
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
  audio.getSamples(audio.sampleBuffer, audio.samplesPerFrame);
  updateDebugView()
  
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
