const END_STREAM = 0xA0
const CHANGE_VOL = 0xA2
const CHANGE_DUTY = 0xA3
const CHANGE_VIB = 0xAA
const LOOP1 = 0xA5
const LOOP1SET = 0xA4
const LOOP2 = 0xA7
const LOOP2SET = 0xA6

let stream = []
let currentLength = 0
let totalLength = 0
let loop1Counter
let loop2Counter
let loop1Total = 0
let loop2Total = 0
let loop1Point = 0
let loop2Point = 0

export let songLength = 0

export function resetSongLength() {
  songLength = 0
}

function fmtWord(n) {
  // Return a [0, 0] (rest) for any
  // pitch above 127, or below period 7.91.
  if (n < 7.91) {
    return [0, 0]
  }
  n = Math.round(n)
  const pad = String(n.toString(16)).padStart(4, '0');
  return [Math.max(1, parseInt(pad.slice(2), 16)),
          parseInt(pad.slice(0, 2), 16)];
}

function midiToFreq(n) {
    return 440 * (Math.pow(2, ((n-69) / 12)))
}

function freqToPeriod(freq) {
    const c = 1789773;
    return c / (freq * 16) - 1
}

function sawFreqToPeriod(freq) {
    const c = 1789773;
    return c / (freq * 14) - 1
}

function compileVolume(vol) {     
  stream.push(CHANGE_VOL, vol)
}

function compileVibrato(vib) {     
   stream.push(CHANGE_VIB, vib)
}

function compileLoop1End() {     
  stream = stream.concat([LOOP1], fmtWord(loop1Point))
  // To update totalLength, we multiply it by the value of the
  // loop counter minus 1 (because it's already been counted once)
  totalLength += loop1Total * (loop1Counter - 1)
}

function compileLoop1Set(loop, streamNum) {     
  // set loop point variable and loop counter
  loop1Point = (stream.length + streamPtrs[streamNum]) + 2
  stream.push(LOOP1SET, loop)
  // update loopCounter variable for calculating song length,
  // and reset the loop1Total
  loop1Counter = loop
  loop1Total = 0
}

function compileLoop2End() {     
  stream = stream.concat([LOOP2], fmtWord(loop2Point))
  totalLength += loop2Total * (loop2Counter - 1)
}

function compileLoop2Set(loop, streamNum) {     
  loop2Point = (stream.length + streamPtrs[streamNum]) + 2
  stream.push(LOOP2SET, loop)
  loop2Counter = loop
  loop2Total = 0
}

function compileLength(length) {
  // lengths > 25 need to be handled differently, since
  // the driver expects them to be from 0x81-0x99. so if
  // it's too large, we set it to 25 and handle it later.
  if (length > 25) {
    stream.push(25 + 0x80)
  }
  currentLength = length
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

function containsVolEnvelope(env, envs) {
  for (var i = 0; i < envs.length; i++) {
     let arr1 = env
     let arr2 = envs[i]
     if (arr1[arr1.length-1] === 0xff) {
       arr1 = arr1.slice(0, arr1.length-1)
     }
     if (arr2[arr2.length-1] === 0xff) {
       arr2 = arr2.slice(0, arr2.length-1)
     }
     if (arraysEqual(arr1, arr2)) {
       return i
     }
  }
  return false
}

function compileDuty(duty, streamNum) {
  stream.push(CHANGE_DUTY)
  let duties = []
  if(streamNum > 4) {
    duties = [0x00, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80]
  } else {
    duties = [0x30, 0x70, 0xB0, 0xF0]
  } 
  stream.push(duties[duty])
}

function compileNoisePitch(pitch) {
  // deal with lengths > 25
  const reps = Math.floor(currentLength / 25)
  for (let i = 0; i < reps; i++) {
    stream.push(pitch)
  }
  // switch length to remainder
  stream.push((currentLength % 25) + 0x80)
  stream.push(pitch)
  totalLength += currentLength
  loop1Total += currentLength
  loop2Total += currentLength
}

function compilePitch(pitch, streamNum) {
  const freq = midiToFreq(pitch)
  let period = 0
  if(streamNum === 7) {
    period = sawFreqToPeriod(freq)
  } else {
    period = freqToPeriod(freq)
  }
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
  // skip if length is 0
  if ((currentLength % 25) !== 0) {
    stream.push((currentLength % 25) + 0x80)
    stream.push(word[1])
    stream.push(word[0])
  }
  totalLength += currentLength
  loop1Total += currentLength
  loop2Total += currentLength
}

function expandNotes(notes) {
  let expanded = []
  for (let i = 0; i < notes.length; i++) {
    if (Array.isArray(notes[i])) {
      let m = new Map()
      m.set("ʞlength", notes[i][0])
      m.set("ʞpitch", notes[i][1])
      expanded.push(m)
    } else {
      expanded.push(notes[i])
    }
  }
  return expanded
}

function makeRest(l) {
  // lengths > 25 need to be handled special, since
  // the driver expects them to be from 0x81-0x99.
  let rest = []
  if (l < 26) {
    rest.push(0x80 + l, 0, 0)
  } else {
    // push correct number of 25-frame rests
    const reps = Math.floor(l / 25)
    rest.push(0x99)
    rest = rest.concat(new Array(reps * 2).fill(0))
    // push remainder
    rest.push((l % 25) + 0x80, 0, 0)
  }
  return rest
}

// this will take a ROM address and calculate its
// sample address (to be written to $4012), and return
// its bytecode preceded by a switch to the correct bank
function sampleBytecode(adr) {
  // 0xA9 switches a given bank
  let bytecode = [0xA9, 7]
  let sampleAdr = rom2sampleAdr(adr)
  let bank = 0x0c
  // each time we increase the bank by one, we decrease
  // the sample address by 0x40
  while (sampleAdr > 0xbf) {
    bank++
    sampleAdr -= 0x40
  }
  // 0xA8 is followed by a sample address
  bytecode.push(bank, 0xA8, sampleAdr)
  // a length is still required to complete the opcode,
  // to be filled in by the assembler above
  return bytecode
}

let samples = []

// take a sample name, and return its address in the ROM
function resolveSample(name) {
  if (samples != undefined) {
    let bytecode = []
    // go through the samples array to find their lengths
    // to determine their sample addresses
    let sampleAdr = 0xc080 // we use the actual offset in the file
    for (let i = 0; i < samples.length; i++) {
      if (samples[i].name === name) {
        return sampleAdr
      }
      sampleAdr += align64(Array.from(samples[i].bytes).length)
    }
  }
}

function align64(n) {
  let r = 0
  while (r < n) {
    r += 64
  }
  return r
}

function rom2sampleAdr(adr) {
  return (adr / 64) - 0x282
}

export let streams = []
export let streamLength = [0,0,0,0,0,0,0,0]

let streamPtrs = [0,0,0,0,0,0,0,0]
let s1 = 0
let s2 = 0
let s3 = 0
let s4 = 0
let s5 = 0
let s6 = 0
let s7 = 0

export function compileStream(noteSequence, streamNum) {
    let notes = expandNotes(noteSequence)
    stream = []
    currentLength = 0
    totalLength = 0
    loop1Total = 0
    loop2Total = 0
    loop1Point = streamPtrs[streamNum]
    loop2Point = streamPtrs[streamNum]
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].has("ʞvibrato")) {
          compileVibrato(notes[i].get("ʞvibrato"))
        }
        if (notes[i].has("ʞloop1")) {
          if (notes[i].get("ʞloop1") === "ʞend") {
            compileLoop1End()
          } else {
          compileLoop1Set(notes[i].get("ʞloop1"), streamNum)
          }
        }
        if (notes[i].has("ʞloop2")) {
          if (notes[i].get("ʞloop2") === "ʞend") {
            compileLoop2End()
          } else {
          compileLoop2Set(notes[i].get("ʞloop2"), streamNum)
          }
        }
        if (notes[i].has("ʞlength")) {
          compileLength(notes[i].get("ʞlength"))
        }
        if (notes[i].has("ʞvolume")) {
          compileVolume(notes[i].get("ʞvolume"))
        }
        if (notes[i].has("ʞduty")) {
          compileDuty(notes[i].get("ʞduty"), streamNum)
        }
        if (notes[i].has("ʞpitch")) {
          if (streamNum === 3) {
            compileNoisePitch(notes[i].get("ʞpitch"))
          } else {
            compilePitch(notes[i].get("ʞpitch"), streamNum)
          }
        }
    }
    stream.push(END_STREAM)
    if (totalLength > songLength) {songLength = totalLength}
    streamLength[streamNum] = totalLength
    streams[streamNum] = stream
    return stream
}

function compileSample(sample, length) {
  stream = stream.concat(sampleBytecode(resolveSample(sample)))
  stream.push(Math.ceil(length * 4.5))
  stream = stream.concat(makeRest(length))
  loop1Total += length
  loop2Total += length
}

function compileRest(rest) {
  stream = stream.concat(makeRest(rest))
  loop1Total += currentLength
  loop2Total += currentLength
}

export function compileDpcm(notes, streamNum) {
  stream = []
  totalLength = 0
  loop1Total = 0
  loop2Total = 0
  loop1Point = s5
  loop2Point = s5
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].has("ʞloop1")) {
      if (notes[i].get("ʞloop1") === "ʞend") {
        compileLoop1End()
      } else {
        compileLoop1Set(notes[i].get("ʞloop1"), streamNum)
      }
    }
    if (notes[i].has("ʞloop2")) {
      if (notes[i].get("ʞloop2") === "ʞend") {
        compileLoop2End()
      } else {
        compileLoop2Set(notes[i].get("ʞloop2"), streamNum)
      }
    }
    if (notes[i].has("ʞsample")) {
      compileSample(notes[i].get("ʞsample"), notes[i].get("ʞlength")) 
    }
    if (notes[i].has("ʞrest")) {
      compileRest(notes[i].get("ʞrest"))
    }
  }
  stream.push(END_STREAM)
  if (totalLength > songLength) {songLength = totalLength}
  streamLength[streamNum] = totalLength
  return stream
}
