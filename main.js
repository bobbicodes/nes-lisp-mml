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
  "Creates a drum with linear volume decay.
   Calculates a rest to make up target length."
  [pitch length high low decay]
  (let [envelope (reverse (range low high decay))]
    (concat [{:length 1}]
      (map #(hash-map :volume % :pitch pitch) envelope)
      {:length (- length (count envelope)) :volume 0 :pitch 0})))

(def kick (drum 13 17 12 5 2))
(def snare (drum 7 17 8 3 1))
(def hat (drum 3 17 6 1 2))
(def hat2 (drum 3 8 6 1 2))
(def drum-pat (concat kick hat2 hat2 hat hat snare hat hat hat))

;; Functions to add kicks and snares
(defn k [[l p]] [[1 (+ 12 p)] [1 (+ 7 p)] 
   [1 (+ 5 p)] [1 (+ 3 p)] [(- l 4) p]])
(defn s [[l p]] [[1 75] [1 72] [(- l 2) p]])

(def bass (for [[length pitch] (concat 
   (k [66 57]) (s [33 64]) [[17 57] [17 59]]
   (k [33 60]) [[33 67]] (s [17 55]) [[17 57] [33 59]] 
   (k [51 57]) [[17 57]] (s [17 60]) [[17 57] [17 55] [17 57]] 
   (k [17 55]) [[17 60] [17 64] [17 67]] 
   (s [17 62]) [[17 66] [17 69] [17 66]] (k [66 64]))]
    {:length length :pitch pitch}))

(defn vibrato [pitch length speed width]
  (concat [{:length 1}] (for [x (range length)]
      {:pitch (+ pitch (* width (sin (* speed x))))})))

(def sq1 (concat [{:volume 4}]
    (mapcat (fn [[length pitch]] (vibrato pitch length 0.5 0.1)) 
      [[51 69] [17 67] [34 64] [34 62] [17 60]
       [17 64] [34 67] [17 55] [17 57] [34 59] [66 57] [34 60]
       [33 62] [51 64] [17 67] [17 66] [17 64] [33 62] [33 64]])
       [{:length 8 :pitch 64 :volume 4} {:length 8 :pitch 64 :volume 3}
        {:length 8 :pitch 64 :volume 2} {:length 8 :pitch 64 :volume 1}]))

(def sq2 (concat [{:length 99 :volume 0 :pitch 0} {:volume 4}]
    (for [[length pitch] [[17 60] [17 62] [51 64] [17 62]
       [17 59] [17 60] [34 62] [66 60]]] {:length length :pitch pitch})
       [{:length 99 :volume 0 :pitch 0} {:volume 4}]
           (for [[length pitch] [[17 60] [17 62] [51 64] [17 62] [66 59]]]
             {:length length :pitch pitch}))))

(play sq1 sq2 bass
  (concat drum-pat drum-pat drum-pat drum-pat (drum 13 18 15 8 1)))`,
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
  if (framesPlayed === audio.songLength) {
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
