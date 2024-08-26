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
        midframes (for [[volume pitch] (rest vol-pitch)]
                    {:volume volume :pitch pitch})
        tail {:length (- length (count vol-pitch))
              :volume 0 :pitch 0}]
    (if (<= length (count vol-pitch))
      (concat [frame1] midframes)
      (concat [frame1] midframes [tail]))))

(defn kick [length]
  (drum length [[14 15] [12 15] [10 15] [8 15] [5 15] [2 15]]))

(defn hat [length]
  (drum length [[7 4]]))

(defn snare [length]
  (drum length [[14 3] [12 3] [10 3] [8 0] [5 0] [2 0]]))

(def tri-kick [{:length 1 :pitch 66} {:pitch 62} {:pitch 59} {:pitch 54}])

(def tri-snare [{:length 1 :pitch 75} {:pitch 70}])

(defn tri1 [pitch]
  (concat [{:vibrato 1}]
    [[28 pitch] [14 160] [9 pitch] 
     [5 160] [28 pitch] [28 160]]))

(defn bass-note [length pitch]
  (vib (length-pitch [[length pitch]]) 0.5 0.15))

(defn tri2 [pitch]
  (concat 
    tri-kick (bass-note 24 pitch) tri-snare [{:length 12 :pitch 160}]
    tri-kick (bass-note 4 pitch) [{:length 6 :pitch 160}]
    tri-kick (bass-note 24 pitch) tri-snare [{:length 26 :pitch 160}]))

(def tri2a
  (concat 
    tri-kick (bass-note 24 60) tri-snare [{:length 12 :pitch 160}]
    tri-kick (bass-note 4 60) 
    [{:length 6 :pitch 160} {:length 1 :pitch 72} {:length 6 :pitch 60}
     {:length 1 :pitch 72} {:length 6 :pitch 60}]
      tri-kick (bass-note 4 60) (bass-note 7 160)
      tri-snare [{:length 12 :pitch 160}] tri-kick [{:length 9 :pitch 160}]))

(defn slide [from to frames]
  (length-pitch (take frames 
    (if (< to from)
      (map #(vector 1 %) (reverse (range to from (/ (abs (- from to)) frames))))
      (map #(vector 1 %) (range from to (/ (abs (- from to)) frames)))))))

(def drums1
  (concat (kick 14) (hat 7) (hat 7) (snare 14) (kick 14)
     (kick 14) (hat 14) (snare 14) (hat 14)))

(def lead1
  [[28 63] [14 160] [7 63]
   [7 160] [14 63] [14 62] [28 60] [28 58] [14 160]
   [14 58] [28 62] [28 63] [28 65] [14 160] [7 65] [7 160]
   [14 65] [14 63] [28 62] [28 60] [14 160] [7 60] [7 160]
   [28 60] [28 62] [28 63] [14 160] [7 63]
   [7 160] [14 63] [14 62] [28 60] [28 58] [14 160] [14 58]
   [28 55] [28 58] [14 60] [14 62] [56 60] [28 160] [12 160]])

(def lead2
  [[14 160] [14 58] [14 63] [14 58] [14 67] [14 63] [14 70] [14 67]
   [14 160] [14 53] [14 58] [14 53] [14 62] [14 58] [14 65] [14 63]
   [28 55] [28 160] [14 62] [14 63] [14 65] [14 67] [14 65] [14 63] [14 160]
   [7 63] [7 160] [28 63] [28 65] [28 67] [14 160] [7 67] [7 160]
   [14 67] [14 65] [28 63] [28 62] [14 160] [14 62] [28 65] [28 62]
   [14 63] [14 65] [84 63]])

(def drums-verse
  (concat
    (loop1 3 drums1)
     (kick 14) (hat 7) (hat 7) (snare 14) (kick 14)
     (snare 7) (snare 7) (kick 14) (snare 14) (kick 14)
     (loop1 3 drums1)))

(def tri-verse
  (concat
    (tri2 63) (tri2 58) (tri2 55) tri2a
    (tri2 63) (tri2 58) (tri2 60)))

(def trigwen1
  (concat [{:vibrato 1}]
    [[12 63] [2 160] [14 63] [12 67] [2 160] [14 67]
    [12 70] [2 160] [14 70] [12 67] [2 160] [14 67]
     [12 68] [2 160] [14 68] [12 65] [2 160] [14 65]
     [42 63] [14 160]]))

(def trigwen2
  (concat [{:vibrato 1}] [[12 58] [2 160] [14 58] [12 63] [2 160] [14 63]
                 [12 67] [2 160] [14 67] [12 63] [2 160] [14 63]
                 [14 56] [14 68] [14 58] [14 70] [28 51] [28 160]]))

(def trigwen3
  (concat [{:vibrato 1}] [[12 58] [2 160] [14 58] [12 63] [2 160] [14 63]
                 [12 67] [2 160] [14 67] [12 63] [2 160] [14 63]
                 [14 56] [14 68] [14 58] [14 70] [28 58] [28 160]]))

(def trigwen4
  (concat [{:vibrato 1}] [[14 68] [14 72] [14 70] [14 68] [28 67] [14 63] [14 160]
                      [14 56] [14 68] [14 58] [14 70] [28 62] [14 58] [14 160]]))

(def trigwen5
  (concat [{:vibrato 1}] [[28 48] [14 60] [14 55] [28 51] [28 48]]))

(def drums2
  (concat (kick 14) (hat 7) (hat 7) (snare 14) (hat 7) (hat 7)
     (kick 14) (kick 14) (snare 14) (hat 7) (hat 7)
    (kick 14) (hat 7) (hat 7) (snare 14) (snare 14)
     (kick 14) (hat 14) (snare 28)))

(def lead3
 (concat [{:vibrato 2}] [[7 55] [7 58] [7 63] [7 67] [7 70] [7 67] [7 63] [7 58]
                   [7 60] [7 63] [7 67] [7 70] [7 72] [7 70] [7 67] [7 63]
                   [7 56] [7 60] [7 63] [7 68] [7 58] [7 62] [7 65] [7 68]
                   [28 67] [7 63] [21 160]]))

(def lead3-echo
  (concat [{:vibrato 2}] [[7 55] [7 58] [7 63] [7 67] [7 70] [7 67] [7 63] [7 58]
                   [7 60] [7 63] [7 67] [7 70] [7 72] [7 70] [7 67] [7 63]
                   [7 56] [7 60] [7 63] [7 68] [7 58] [7 62] [7 65] [7 68]
                   [28 67] [7 63] [9 160]]))

(def lead4
  (concat [{:vibrato 2}] [[7 55] [7 58] [7 63] [7 67] [7 70] [7 67] [7 63] [7 58]
                   [7 60] [7 63] [7 67] [7 70] [7 72] [7 70] [7 67] [7 63]
                   [7 60] [7 63] [7 68] [7 72] [7 62] [7 65] [7 70] [7 74]
                   [28 70] [14 62] [14 160]]))

(def lead5
  (concat [{:vibrato 2}] [[7 60] [7 63] [7 68] [7 72] [7 75] [7 72] [7 68] [7 63]
                   [7 58] [7 63] [7 67] [7 70] [7 75] [7 70] [7 67] [7 63]
                   [7 60] [7 63] [7 68] [7 72] [7 62] [7 65] [7 70] [7 74] [7 77]
                   [7 62] [7 65] [7 70] [7 74] [21 160]]))

(def lead6
  [{:duty 1 :volume 5 :length 12 :pitch 63} {:length 2 :pitch 160} {:length 14 :pitch 63}
   {:length 12 :pitch 67} {:length 2 :pitch 160} {:length 14 :pitch 67}
   {:length 12 :pitch 70} {:length 2 :pitch 160} {:length 14 :pitch 70}
   {:length 12 :pitch 67} {:length 2 :pitch 160} {:length 14 :pitch 67}
   {:length 12 :pitch 68} {:length 2 :pitch 160} {:length 14 :pitch 68}
   {:length 12 :pitch 65} {:length 2 :pitch 160} {:length 14 :pitch 65}
   {:length 28 :pitch 63} {:length 28 :pitch 160}])

(def lead7
  [{:duty 1 :volume 5 :length 12 :pitch 63} {:length 2 :pitch 160} {:length 14 :pitch 63}
   {:length 12 :pitch 67} {:length 2 :pitch 160} {:length 14 :pitch 67}
   {:length 12 :pitch 70} {:length 2 :pitch 160} {:length 14 :pitch 70}
   {:length 12 :pitch 67} {:length 2 :pitch 160} {:length 14 :pitch 67}
   {:length 14 :pitch 68} {:pitch 70} {:pitch 68} {:pitch 67}
   {:length 28 :pitch 65} {:length 28 :pitch 160}])

(def lead8
  [{:length 21 :pitch 68} {:length 7 :pitch 70} {:length 14 :pitch 72} {:pitch 68}
   {:pitch 70} {:pitch 68} {:pitch 67} {:pitch 160}
   {:pitch 68} {:pitch 72} {:pitch 68}
   {:pitch 67} {:length 28 :pitch 65} {:length 14 :pitch 62} {:pitch 160}])

(defn fade-in [n notes]
  (let [head (map-indexed (fn [index note] 
                            (assoc note :volume (min index 5))) (take n notes))
        tail (drop n notes)]
    (concat head tail)))

(defn arp-swell [[n1 n2 n3]]
  (concat 
     (r 16)
     [{:length 1 :volume 1 :duty 2}]
     (loop2 8 [{:pitch n1} {:pitch n2} {:pitch n3}])
     [{:volume 2 :duty 3}]
     (loop2 8 [{:pitch n1} {:pitch n2} {:pitch n3}])
     [{:volume 3 :duty 0}]
     (loop2 8 [{:pitch n1} {:pitch n2} {:pitch n3}])
     [{:volume 4 :duty 1}]
     (loop2 8 [{:pitch n1} {:pitch n2} {:pitch n3}])))

(def sq1
  (concat 
    (loop1 16 (r 20))
    [{:volume 1 :length 95 :pitch 43}
           {:volume 1 :length 95 :pitch 43}
           {:volume 1 :length 95 :pitch 43}
           {:volume 1 :length 95 :pitch 43}
           {:volume 1 :length 95 :pitch 43}
           {:volume 1 :length 33 :pitch 43}
           {:duty 1 :volume 6 :length 7 :pitch 60}]
    (concat [{:vibrato 2}] [[7 160] [28 60] [28 62]] lead1)
    [{:duty 0}] (fade-in 15 (slide 53 68 49))
    [{:length 7 :pitch 160} {:length 14 :pitch 63} {:pitch 62} {:pitch 60}]
    (concat [{:vibrato 2}] lead1)
    [{:volume 1}]
    (concat [{:vibrato 2}] [[2 69.9] [2 70.9] [14 71.9] [14 69.9] 
       [14 66.9] [14 64.9] [28 62.9] [14 59.9]])
    [{:duty 0 :volume 1 :pitch 160 :length 12}] lead3-echo
    lead6 lead7 lead8 lead6
    [{:duty 1 :volume 6 :length 44 :pitch 160} {:length 7 :pitch 60}]
    (concat [{:vibrato 2}] [[7 160] [28 60] [28 62]] lead1
      [{:duty 0}] (fade-in 15 (slide 53 68 49))
    [{:length 7 :pitch 160} {:length 14 :pitch 63} {:pitch 62} {:pitch 60}]
    (concat [{:vibrato 2}] lead1))))

(def arps8
  (concat
    (arp-swell [63 67 70]) (arp-swell [58 62 65])
    (arp-swell [55 58 62]) (arp-swell [60 63 67])
    (arp-swell [63 67 70]) (arp-swell [58 62 65])
    (arp-swell [60 63 67]) (arp-swell [60 63 67])))

(def arps7
  (concat
    (arp-swell [63 67 70]) (arp-swell [58 62 65])
    (arp-swell [55 58 62]) (arp-swell [60 63 67])
    (arp-swell [63 67 70]) (arp-swell [58 62 65])
    (arp-swell [60 63 67])))

(def sq2
  (concat
    arps8 arps7
     [{:length 112 :pitch 160 :duty 1}]
    (concat [{:vibrato 2}] lead2)
    (concat [{:vibrato 3}] [[1 70] [1 71] [14 72] [14 70] [14 67] [14 65] 
     [1 62] [1 62.1] [2 62.2] [2 62.3] [2 62.4] [2 62.5] 
     [2 62.6] [2 62.7] [2 62.8] [2 62.9] [12 63] [14 60]])
    [{:duty 0 :volume 5 :length 12 :pitch 160}]
    lead3 lead3 lead4 lead5 lead3
    [{:volume 5 :duty 2}]
    (concat [[1 58] [1 59] [14 60] [14 58] [14 55] [14 53] 
     [1 50] [1 50.1] [2 50.2] [2 50.3] [2 50.4] [2 50.5] 
     [2 50.6] [2 50.7] [2 50.8] [2 50.9] [8 51] [18 48]])
    arps7 (r 122) (concat [{:vibrato 2}] lead2)))

(def tri
  (concat 
    (tri1 63) (tri1 58) (tri1 55) (tri1 60)
    (tri1 63) (tri1 58) (tri1 60) (tri1 60)
    tri-verse [{:length 112 :pitch 160}] tri-verse
    [{:length 112 :pitch 160}]
    trigwen1 trigwen2 trigwen3 trigwen4 trigwen2 trigwen5
    tri-verse
    [{:length 112 :pitch 160}]
    tri-verse))

(def drums
  (concat 
    [{:length 42 :volume 0 :pitch 0}]
     (loop1 61 [{:length 14 :pitch 0 :volume 0}])
    drums-verse
     [{:length 112 :volume 0 :pitch 0}]
    drums-verse [{:length 112 :volume 0 :pitch 0}]
    [{:length 224 :volume 0 :pitch 0}] (loop1 4 drums2)
     (concat (kick 14) (hat 7) (hat 7) (snare 14) (hat 7) (hat 7)
     (kick 14) (kick 14) (snare 14) (hat 7) (hat 7))
    drums-verse
    [{:length 112 :volume 0 :pitch 0}]
    drums-verse))

(play
  {:square1 sq1
   :square2 sq2
   :triangle tri
   :noise drums})`,
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

let c2 = el("oscview2");
c2.width = 160;
c2.height = 90;
let ctx2 = c2.getContext("2d");

function calcPeriod() {
  let h = (apu.registers[11] & 0x7) << 8
  return h + apu.registers[10]
}

let lastFrame = new Float32Array(0)
let previousFrame = new Float32Array(0)

let threeFrames = new Float32Array(89343);

function drawTriggeredWave(vals) {
  ctx2.fillStyle = "rgb(0,0,0)";
  ctx2.fillRect(0, 0, c2.width, c2.height);
  ctx2.lineWidth = 1;
  ctx2.strokeStyle = "rgb(255,62,165)";
  ctx2.beginPath();
  const sliceWidth = c2.width / 29781;
  let x = 0
  //console.log(threeFrames.slice(29785))
  threeFrames.set(threeFrames.slice(29785), 0);
  threeFrames.set(threeFrames.slice(59560), 29787);
  threeFrames.set(vals, 59562);
  let bottom = 0
  for (let i = 0; i < threeFrames.length; i++) {
    const v = threeFrames[i];
    const y = (v * c2.height) + (c2.height / 4)
    if(y > 249) {
        //console.log("triangle bottom xpos: " + bottom)
        break;
    } else {
      bottom = i
    }
  }
  for (let i = bottom; i < 29781 + bottom; i++) {
    const v = threeFrames[i];
    const y = (v * c2.height) + (c2.height / 4)
    if (i === 0) {
      ctx2.moveTo(x, y);
    } else {
      ctx2.lineTo(x, y);
    }
    x += sliceWidth;
  }
  ctx2.stroke();
}

function drawWave(vals) {
  ctx2.fillStyle = "rgb(0,0,0)";
  ctx2.fillRect(0, 0, c2.width, c2.height);
  ctx2.lineWidth = 1;
  ctx2.strokeStyle = "rgb(255,62,165)";
  ctx2.beginPath();
  const sliceWidth = c2.width / 29781;
  let x = 0
  for (let i = 0; i < 29781; i++) {
    const v = vals[i];
    const y = (v * c2.height) + (c2.height / 4)
    if (i === 0) {
      ctx2.moveTo(x, y);
    } else {
      ctx2.lineTo(x, y);
    }
   x += sliceWidth;
   }
   ctx2.stroke();
}

export function drawSample(vals) {
  // unpack each of the bytes
  //console.log(vals)
  let bits = []
  for (let i = 0; i < vals.length; i++) {
    for (let j = 0; j < 8; j++) {
      if((vals[i] >> j) % 2 != 0) {
        bits.push(1)
      } else {
        bits.push(0)
      }
    }
  }
  //console.log(bits)
  ctx2.fillStyle = "rgb(0,0,0)";
  ctx2.fillRect(0, 0, c2.width, c2.height);
  ctx2.lineWidth = 1;
  ctx2.strokeStyle = "rgb(255,62,165)";
  ctx2.beginPath();
  const sliceWidth = c2.width / bits.length;
  let x = 0
  let y = 180
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === 1) {
      y = y - 4
    } else {
      y = y + 4
    }
    if (i === 0) {
      ctx2.moveTo(x, y);
    } else {
      ctx2.lineTo(x, y);
    }
   x += sliceWidth;
   }
   ctx2.stroke();
}

el("rom").onchange = function (e) {
  let freader = new FileReader();
  freader.onload = function () {
    let buf = freader.result;
    let arr = new Uint8Array(buf);
    loadRom(arr);
  }
  freader.readAsArrayBuffer(e.target.files[0]);
}

el("pause").onclick = function(e) {
  if(paused && loaded) {
    unpause();
  } else {
    pause();
  }
}

function pause() {
  if(!paused) {
    cancelAnimationFrame(loopId);
    audio.stop();
    paused = true;
    el("pause").innerText = "Resume";
    if(loaded) {
      //db.updateDebugView();
    }
  }
}

function unpause() {
  if(paused) {
    loopId = requestAnimationFrame(update);
    audio.start();
    paused = false;
    el("pause").innerText = "Pause";
  }
}

el("runframe").onclick = function() {
  if(!loaded) return;
  runFrame();
  //db.updateDebugView();
}

el("sample").onchange = function (e) {
  for (let i = 0; i < e.target.files.length; i++) {
    let freader = new FileReader();
    freader.onload = function () {
      let buf = freader.result;
      let arr = new Uint8Array(buf);
      const filename = e.target.files[i].name
      samples.push({name: filename.substring(0, filename.length - 4), bytes: arr})
      renderSamples()
      }
    freader.readAsArrayBuffer(e.target.files[i]);
  }
}

export var samples = []

export function renderSamples() {
  el("samples").innerHTML = ""
  //let buttonNum = 0
  samples.forEach((sample) => {
    var samplespan = document.createElement('span')
    samplespan.innerHTML = sample.name + " "
    var buttonspan = document.createElement('span')
    //var deleteButton = document.createElement('button')
    //deleteButton.id = "button-" + buttonNum
    //buttonNum++
    var br = document.createElement('br')
    //deleteButton.innerHTML = "x"
    //buttonspan.appendChild(deleteButton)
    //samplespan.appendChild(buttonspan)
    samplespan.appendChild(br)
    el("samples").appendChild(samplespan)
  })
}

export function updateSamples(vals) {
  samples = vals
  console.log(samples)
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
  framesPlayed = -100
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
  //drawTriggeredWave(apu.outputValues)
  drawWave(apu.outputValues)
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
