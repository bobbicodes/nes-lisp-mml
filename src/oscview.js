import * as apu from "./apu";

export let p1View = document.createElement("canvas")
p1View.width = 1280;
p1View.height = 720;
export let p1ViewCtx = p1View.getContext("2d");

const rainbow = [
  [255, 0, 0],
  [255, 154, 0],
  [208, 222, 33],
  [79, 220, 74],
  [63, 218, 216],
  [47, 201, 226],
  [28, 127, 238],
  [95, 21, 242],
  [186, 12, 248],
  [251, 7, 217]
]

const rainbowTrans = [
  [255, 0, 0, 0.5],
  [255, 154, 0, 0.5],
  [208, 222, 33, 0.5],
  [79, 220, 74, 0.5],
  [63, 218, 216, 0.5],
  [47, 201, 226, 0.5],
  [28, 127, 238, 0.5],
  [95, 21, 242, 0.5],
  [186, 12, 248, 0.5],
  [251, 7, 217, 0.5]
]

function rgb2str([r, g, b]) {
  return "rgb(" + r + "," + g + "," + b + ")"
}

function rgba2str([r, g, b, a]) {
  return "rgb(" + r + "," + g + "," + b + "," + a + ")"
}

function period2color(p) {
  if (p < 100) {
    return rgb2str(rainbow[9])
  }
  if (p < 200) {
    return rgb2str(rainbow[8])
  }
  if (p < 400) {
    return rgb2str(rainbow[7])
  }
  if (p < 600) {
    return rgb2str(rainbow[6])
  }
  if (p < 800) {
    return rgb2str(rainbow[5])
  }
  if (p < 1000) {
    return rgb2str(rainbow[4])
  }
  if (p < 1500) {
    return rgb2str(rainbow[3])
  }
  if (p < 2000) {
    return rgb2str(rainbow[2])
  }
  if (p < 2500) {
    return rgb2str(rainbow[1])
  }
  if (p < 3000) {
    return rgb2str(rainbow[0])
  }
}

function period2colorTrans(p) {
  if (p < 100) {
    return rgba2str(rainbow[9])
  }
  if (p < 200) {
    return rgba2str(rainbow[8])
  }
  if (p < 400) {
    return rgba2str(rainbow[7])
  }
  if (p < 600) {
    return rgba2str(rainbow[6])
  }
  if (p < 800) {
    return rgba2str(rainbow[5])
  }
  if (p < 1000) {
    return rgba2str(rainbow[4])
  }
  if (p < 1500) {
    return rgba2str(rainbow[3])
  }
  if (p < 2000) {
    return rgba2str(rainbow[2])
  }
  if (p < 2500) {
    return rgba2str(rainbow[1])
  }
  if (p < 3000) {
    return rgba2str(rainbow[0])
  }
}

export let layout = 8

export function setLayout(x) {
  layout = x
}

const dimensions = {
  'layout-8': [
    [0, 0, p1View.width / 2, p1View.height / 4],
    [p1View.width / 2, 0, p1View.width / 2, p1View.height / 4],
    [0, p1View.height / 4, p1View.width / 2, p1View.height / 4],
    [p1View.width / 2, p1View.height / 4, p1View.width / 2, p1View.height / 4],
    [0, p1View.height / 2, p1View.width / 2, p1View.height / 4],
    [p1View.width / 2, p1View.height / 2, p1View.width / 2, p1View.height / 4],
    [0, p1View.height / 1.3333, p1View.width / 2, p1View.height / 4],
    [p1View.width / 2, p1View.height / 1.3333, p1View.width / 2, p1View.height / 4]
  ],
  'layout-5': [
    [0, 0, p1View.width, p1View.height / 5],
    [0, 144, p1View.width, p1View.height / 5],
    [0, 288, p1View.width, p1View.height / 5],
    [0, 432, p1View.width, p1View.height / 5],
    [0, 576, p1View.width, p1View.height / 5]
  ],
  'layout-4': [
    [0, 0, p1View.width / 2, p1View.height / 2],
    [p1View.width / 2, 0, p1View.width / 2, p1View.height / 2],
    [0, p1View.height / 2, p1View.width / 2, p1View.height / 2],
    [p1View.width / 2, p1View.height / 2, p1View.width / 2, p1View.height / 2]
  ],
  'layout-10': [
  // this one is 5 channels: noise, tri, vrc6p1 & p2, dpcm
    [0, 0, p1View.width, p1View.height / 5],
    [0, 144, p1View.width, p1View.height / 5],
    [0, 288, p1View.width, p1View.height / 5],
    [0, 432, p1View.width, p1View.height / 5],
    [0, 576, p1View.width, p1View.height / 5]
  ],
}

export function drawP1() {
  p1ViewCtx.fillStyle = "rgb(0,0,0)";
  if (layout === 8) {
    p1ViewCtx.fillRect(...dimensions['layout-8'][0]);
  }
  if (layout === 5) {
    p1ViewCtx.fillRect(...dimensions['layout-5'][0]);
  }
  if (layout === 4) {
    p1ViewCtx.fillRect(...dimensions['layout-4'][0]);
  }
  if (layout === 10) {
    return
  }
  //p1ViewCtx.fillRect(0, 0, p1View.width / 2, p1View.height / 4);
  p1ViewCtx.lineWidth = 3;
  p1ViewCtx.strokeStyle = period2color(apu.p1Timer)
  p1ViewCtx.beginPath();
  const sliceWidth = p1View.width / 29781;
  let start = 0
  let val = -1
  while (val !== 0) {
    val = p1ViewBuffer[start]
    start++
  }
  while (val === 0) {
    val = p1ViewBuffer[start]
    start++
  }
  let x = 0
  for (let i = start; i < (29781 + start); i++) {
  let y
  if (layout === 8) {
    y = (p1View.height - (p1ViewBuffer[i] * 24)) / 4
  }
  if (layout === 5) {
    y = (p1View.height - 648) - ((p1ViewBuffer[i] * 24) / 5)
  }
  if (layout === 4) {
    y = ((p1View.height - 280) - (p1ViewBuffer[i] * 24)) / 2
  }
    if (i === 0) {
      p1ViewCtx.moveTo(x, y);
    } else {
      p1ViewCtx.lineTo(x, y);
    }
    if (layout === 5) {
      x += sliceWidth
    } else {
      x += sliceWidth / 2;
    }
   }
   p1ViewCtx.stroke();
}

export let p1ViewBuffer = new Array(59562).fill(0)
export let p1ViewCounter = 29781

export function setP1ViewCounter(n) {
  p1ViewCounter = n
}

export function drawP2() {
  //el('debug').innerHTML = vals
  p1ViewCtx.fillStyle = "rgb(0,0,0)";
  if (layout === 8) {
    p1ViewCtx.fillRect(...dimensions['layout-8'][1]);
  }
  if (layout === 5) {
    p1ViewCtx.fillRect(...dimensions['layout-5'][1]);
  }
  if (layout === 4) {
    p1ViewCtx.fillRect(...dimensions['layout-4'][1]);
  }
  if (layout === 10) {
    return
  }
  //p1ViewCtx.fillRect(p1View.width / 2, 0, p1View.width / 2, p1View.height / 4);
  p1ViewCtx.lineWidth = 3;
  p1ViewCtx.strokeStyle = period2color(apu.p2Timer)
  p1ViewCtx.beginPath();
  const sliceWidth = p1View.width / 29781;
  let x
    if (layout === 5) {
      x = 0
    } else {
      x = p1View.width / 2
    }
  let start = 0
  let val = -1
  while (val !== 0) {
    val = p2ViewBuffer[start]
    start++
  }
  while (val === 0) {
    val = p2ViewBuffer[start]
    start++
  }
  for (let i = start; i < (29781 + start); i++) {
  let y
  if (layout === 8) {
    y = (p1View.height - (p2ViewBuffer[i] * 24)) / 4
  }
  if (layout === 5) {
    y = (p1View.height - 504) - ((p2ViewBuffer[i] * 24) / 5)
  }
  if (layout === 4) {
    y = ((p1View.height - 280) - (p2ViewBuffer[i] * 24)) / 2
  }
    if (i === 0) {
      p1ViewCtx.moveTo(x, y);
    } else {
      p1ViewCtx.lineTo(x, y);
    }
    if (layout === 5) {
      x += sliceWidth
    } else {
      x += sliceWidth / 2;
    }
   }
   p1ViewCtx.stroke();
}

export let p2ViewBuffer = new Array(59562).fill(0)
export let p2ViewCounter = 29781

export function setP2ViewCounter(n) {
  p2ViewCounter = n
}

export function drawTri(vals) {
  p1ViewCtx.fillStyle = "rgb(0,0,0)";
  if (layout === 8) {
    p1ViewCtx.fillRect(...dimensions['layout-8'][2]);
  }
  if (layout === 5 || layout === 10) {
    p1ViewCtx.fillRect(...dimensions['layout-5'][2]);
  }
  if (layout === 4) {
    p1ViewCtx.fillRect(...dimensions['layout-4'][2]);
  }
  //p1ViewCtx.fillRect(0, p1View.height / 4, p1View.width / 2, p1View.height / 4);
  p1ViewCtx.lineWidth = 3;
  p1ViewCtx.strokeStyle = period2color(apu.triTimer)
  p1ViewCtx.beginPath();
  const sliceWidth = p1View.width / 29781;
  let x = 0
  for (let i = 0; i < 29781; i++) {
    let y
    if (layout === 8) {
      y = p1View.height / 4 + ((p1View.height - (vals[i] * 24)) / 4)
    }
    if (layout === 5 || layout === 10) {
      y = (p1View.height - 360) - ((vals[i] * 24) / 5)
    }
    if (layout === 4) {
      y = (p1View.height - 180) / 2 + ((p1View.height - (vals[i] * 24)) / 2)
    }
    if (i === 0) {
      p1ViewCtx.moveTo(x, y);
    } else {
      p1ViewCtx.lineTo(x, y);
    }
    if (layout === 5 || layout === 10) {
      x += sliceWidth
    } else {
      x += sliceWidth / 2;
    }
   }
   p1ViewCtx.stroke();
}

export let triViewBuffer = new Array(59562).fill(0)
export let triWatch = 59562
export let triFoundZero = false
export let triRising = false
export let triViewCounter = 29781

export function setTriFoundZero(bool) {
  triFoundZero = bool
}

export function setTriWatch(n) {
  triWatch = n
}

export function setTriRising(n) {
  triRising = n
}

export function setTriViewCounter(n) {
  triViewCounter = n
}

export function drawNoise(vals) {
  //el('debug').innerHTML = vals
  p1ViewCtx.fillStyle = "rgb(0,0,0)";
  if (layout === 8) {
    p1ViewCtx.fillRect(...dimensions['layout-8'][3]);
  }
  if (layout === 5 || layout === 10) {
    p1ViewCtx.fillRect(...dimensions['layout-5'][3]);
  }
  if (layout === 4) {
    p1ViewCtx.fillRect(...dimensions['layout-4'][3]);
  }
  //p1ViewCtx.fillRect(p1View.width / 2, p1View.height / 4, p1View.width / 2, p1View.height / 4);
  p1ViewCtx.lineWidth = 1;
  p1ViewCtx.strokeStyle = period2colorTrans(apu.noiseTimer)
  p1ViewCtx.beginPath();
  const sliceWidth = p1View.width / 29781;
  let x
    if (layout === 5 || layout === 10) {
      x = 0
    } else {
      x = p1View.width / 2
    }
  for (let i = 0; i < 29781; i++) {
    let y
    if (layout === 8) {
      y = p1View.height / 4 + ((p1View.height - (vals[i] * 24)) / 4)
    }
    if (layout === 5 || layout === 10) {
      y = (p1View.height - 216) - ((vals[i] * 24) / 5)
    }
    if (layout === 4) {
      y = (p1View.height - 360) / 2 + ((p1View.height - (vals[i] * 24)) / 2)
    }
    if (i === 0) {
      p1ViewCtx.moveTo(x, y);
    } else {
      p1ViewCtx.lineTo(x, y);
    }
    if (layout === 5 || layout === 10) {
      x += sliceWidth
    } else {
      x += sliceWidth / 2;
    }
   }
   p1ViewCtx.stroke();
}

export let noiseViewBuffer = []

export function setNoiseViewBuffer(x) {
  noiseViewBuffer = x
}

export function drawDmc(vals) {
  p1ViewCtx.fillStyle = "rgb(0,0,0)";
  if (layout === 8) {
    p1ViewCtx.fillRect(...dimensions['layout-8'][4]);
  }
  if (layout === 5 || layout === 10) {
    p1ViewCtx.fillRect(...dimensions['layout-5'][4]);
  }
  //p1ViewCtx.fillRect(0, p1View.height / 2, p1View.width / 2, p1View.height / 4);
  p1ViewCtx.lineWidth = 3;
  p1ViewCtx.strokeStyle = period2color(apu.dmcTimer)
  p1ViewCtx.beginPath();
  const sliceWidth = p1View.width / 29781;
  let x = 0
  for (let i = 0; i < 29781; i++) {
    let y
    if (layout === 8) {
      y = p1View.height / 2 + ((p1View.height - (vals[i] * 2.83)) / 4)
    }
    if (layout === 5 || layout === 10) {
      y = (p1View.height - 72) - ((vals[i] * 2.83) / 5)
    }
    if (i === 0) {
      p1ViewCtx.moveTo(x, y);
    } else {
      p1ViewCtx.lineTo(x, y);
    }
    if (layout === 5 || layout === 10) {
      x += sliceWidth
    } else {
      x += sliceWidth / 2;
    }
   }
   p1ViewCtx.stroke();
}

export let dmcViewBuffer = []

export function setDmcViewBuffer(x) {
  dmcViewBuffer = x
}

export function drawVrc6P1() {
  p1ViewCtx.fillStyle = "rgb(0,0,0)";
  if (layout === 8) {
    p1ViewCtx.fillRect(...dimensions['layout-8'][5]);
  }
  if (layout === 10) {
    p1ViewCtx.fillRect(...dimensions['layout-10'][0]);
  }
  //p1ViewCtx.fillRect(p1View.width / 2, p1View.height / 2, p1View.width / 2, p1View.height / 4);
  p1ViewCtx.lineWidth = 3;
  p1ViewCtx.strokeStyle = period2color(apu.vrc6P1Timer)
  p1ViewCtx.beginPath();
  const sliceWidth = p1View.width / 29781;
    let x
    if (layout === 10) {
      x = 0
    } else {
      x = p1View.width / 2
    }
let start = 0
  let val = -1
  while (val !== 0) {
    val = vrc6P1ViewBuffer[start]
    start++
  }
  while (val === 0) {
    val = vrc6P1ViewBuffer[start]
    start++
  }
  for (let i = start; i < (29781 + start); i++) {
    let y
    if (layout === 8) {
      y = (p1View.height / 2.4) + ((p1View.height - (vrc6P1ViewBuffer[i] * 12)) / 4)
    }
  if (layout === 10) {
    y = (p1View.height - 648) - ((vrc6P1ViewBuffer[i] * 12) / 5)
  }
    if (i === 0) {
      p1ViewCtx.moveTo(x, y);
    } else {
      p1ViewCtx.lineTo(x, y);
    }
    if (layout === 10) {
      x += sliceWidth
    } else {
      x += sliceWidth / 2;
    }
   }
   p1ViewCtx.stroke();
}

export let vrc6P1ViewBuffer = new Array(59562).fill(0)
export let vrc6P1ViewCounter = 29781

export function setVrc6P1ViewCounter(n) {
  vrc6P1ViewCounter = n
}

export function drawVrc6P2() {
  //log(vrc6P2ViewBuffer)
  p1ViewCtx.fillStyle = "rgb(0,0,0)";
  if (layout === 8) {
    p1ViewCtx.fillRect(...dimensions['layout-8'][6]);
  }
  if (layout === 10) {
    p1ViewCtx.fillRect(...dimensions['layout-10'][1]);
  }
  //p1ViewCtx.fillRect(0, p1View.height / 1.3333, p1View.width / 2, p1View.height / 4);
  p1ViewCtx.lineWidth = 3;
  p1ViewCtx.strokeStyle = period2color(apu.vrc6P2Timer)
  p1ViewCtx.beginPath();
  const sliceWidth = p1View.width / 29781;
  let x = 0
let start = 0
  let val = -1
  while (val !== 0) {
    val = vrc6P2ViewBuffer[start]
    start++
  }
  while (val === 0) {
    val = vrc6P2ViewBuffer[start]
    start++
  }
  for (let i = start; i < (29781 + start); i++) {
    let y
    if (layout === 8) {
      y = p1View.height / 1.6 + ((p1View.height - (vrc6P2ViewBuffer[i] * 12)) / 4)
    }
  if (layout === 10) {
    y = (p1View.height - 504) - ((vrc6P2ViewBuffer[i] * 12) / 5)
  }
    if (i === 0) {
      p1ViewCtx.moveTo(x, y);
    } else {
      p1ViewCtx.lineTo(x, y);
    }
    if (layout === 10) {
      x += sliceWidth
    } else {
      x += sliceWidth / 2;
    }
   }
   p1ViewCtx.stroke();
}

export let vrc6P2ViewBuffer = new Array(59562).fill(0)
export let vrc6P2ViewCounter = 29781

export function setVrc6P2ViewCounter(n) {
  vrc6P2ViewCounter = n
}

export function drawSaw() {
  p1ViewCtx.fillStyle = "rgb(0,0,0)";
  if (layout === 8) {
    p1ViewCtx.fillRect(...dimensions['layout-8'][7]);
  }
  if (layout === 10) {
    return
  }
  //p1ViewCtx.fillRect(p1View.width / 2, p1View.height / 1.3333, p1View.width / 2, p1View.height / 4);
  p1ViewCtx.lineWidth = 3;
  p1ViewCtx.strokeStyle = period2color(apu.vrc6SawTimer)
  p1ViewCtx.beginPath();
  const sliceWidth = p1View.width / 29781;
  let x = p1View.width / 2
  let start = 0
  let val = -1
  let crossing = -1
  while (val < 2) {
    val = sawViewBuffer[start]
    start++
  }
  crossing = val
  while (val >= crossing) {
    val = sawViewBuffer[start]
    start++
  }
  for (let i = start; i < (29781 + start); i++) {
    let y
    if (layout === 8) {
      y = p1View.height / 1.3333 + ((p1View.height - (sawViewBuffer[i] * 12)) / 4)
    }
    if (i === 0) {
      p1ViewCtx.moveTo(x, y);
    } else {
      p1ViewCtx.lineTo(x, y);
    }
   x += sliceWidth / 2;
   }
   p1ViewCtx.stroke();
}

export let sawViewBuffer = new Array(59562).fill(0)
export let sawViewCounter = 29781

export function setSawViewCounter(n) {
  sawViewCounter = n
}
