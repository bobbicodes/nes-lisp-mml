import * as cpu from "./cpu";
import * as osc from "./oscview";
import {actx} from "./audio"

const dutyCycles = [
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0],
    [1, 0, 0, 1, 1, 1, 1, 1]
];

const lengthLoadValues = [
    10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14,
    12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30
];

const triangleSteps = [
    15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
];

const noiseLoadValues = [
    4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068
];

const dmcLoadValues = [
    428, 380, 340, 320, 286, 254, 226, 214, 190, 160, 142, 128, 106, 84, 72, 54
];

export let outputValues = new Float32Array(29781);
let outputOffset = 0;

let frameCounter = 0;

let interruptInhibit = false;
let step5Mode = false;

let enableNoise = false;
let enableTriangle = false;
let enablePulse2 = false;
let enablePulse1 = false;

// pulse 1
export let p1Timer = 0;
let p1TimerValue = 0;
export let p1Duty = 0;
let p1DutyIndex = 0;
let p1Output = 0;
let p1CounterHalt = false;
export let p1Counter = 0;
export let p1Volume = 0;
export let p1ConstantVolume = false;
export let p1Decay = 0;
let p1EnvelopeCounter = 0;
let p1EnvelopeStart = false;
let p1SweepEnabled = false;
let p1SweepPeriod = 0;
let p1SweepNegate = false;
let p1SweepShift = 0;
let p1SweepTimer = 0;
let p1SweepTarget = 0;
let p1SweepMuting = true;
let p1SweepReload = false;

// pulse 2
export let p2Timer = 0;
let p2TimerValue = 0;
export let p2Duty = 0;
let p2DutyIndex = 0;
let p2Output = 0;
let p2CounterHalt = false;
export let p2Counter = 0;
export let p2Volume = 0;
export let p2ConstantVolume = false;
export let p2Decay = 0;
let p2EnvelopeCounter = 0;
let p2EnvelopeStart = false;
let p2SweepEnabled = false;
let p2SweepPeriod = 0;
let p2SweepNegate = false;
let p2SweepShift = 0;
let p2SweepTimer = 0;
let p2SweepTarget = 0;
let p2SweepMuting = true;
let p2SweepReload = false;

// triangle
export let triTimer = 0;
let triTimerValue = 0;
let triStepIndex = 0;
export let triOutput = 0;
let triCounterHalt = false;
export let triCounter = 0;
export let triLinearCounter = 0;
let triReloadLinear = false;
let triLinearReload = 0;

// noise
export let noiseTimer = 0;
let noiseTimerValue = 0;
let noiseShift = 1;
export let noiseTonal = false;
let noiseOutput = 0;
let noiseCounterHalt = false;
export let noiseCounter = 0;
export let noiseVolume = 0;
export let noiseConstantVolume = false;
export let noiseDecay = 0;
let noiseEnvelopeCounter = 0;
let noiseEnvelopeStart = false;

// dmc
let dmcInterrupt = false;
let dmcLoop = false;
export let dmcTimer = 0;
let dmcTimerValue = 0;
let dmcOutput = 0;
let dmcSampleAddress = 0xc040;
let dmcAddress = 0xc040;
let dmcSample = 0;
let dmcSampleLength = 0;
let dmcSampleEmpty = true;
export let dmcBytesLeft = 0;
let dmcShifter = 0;
let dmcBitsLeft = 8;
let dmcSilent = true;

// VRC6
// Frequency control - write 0 to $9003 on startup, that's all

// VRC6 Pulse 1
let vrc6P1Vol = 0     // $9000 bits 0-3
let vrc6P1Duty = 0    // $9000 bits 4-6
let vrc6P1DutyIndex = 0
let vrc6P1Mode = false    // $9000 bit 7
export let vrc6P1Timer = 0   // $9001 bits 0-7, $9002 bits 0-3
let vrc6P1TimerValue = 0
let vrc6P1Enable = 0  // $9002 bit 7
let vrc6P1Output = 0

// VRC6 Pulse 2
let vrc6P2Vol = 0     // $A000 bits 0-3
let vrc6P2Duty = 0    // $A000 bits 4-6
let vrc6P2DutyIndex = 0
let vrc6P2Mode = false    // $A000 bit 7
export let vrc6P2Timer = 0   // $A001 bits 0-7, $A002 bits 0-3
let vrc6P2TimerValue = 0
let vrc6P2Enable = 0  // $A002 bit 7
let vrc6P2Output = 0

// VRC6 Saw
let vrc6SawAccumRate = 0   // $B000 bits 0-5
let vrc6SawAccum = 0       // internal accumulator
export let vrc6SawTimer = 0       // $B001 bits 0-7, $B002 bits 0-3
let vrc6SawTimerValue = 0
let vrc6SawEnable = 0      // $B002 bit 7
let vrc6SawOutput = 0
let vrc6SawStep = 0

export let frameIrqWanted = false;
export let dmcIrqWanted = false;

export function setFrameIrqWanted(bool) {
    frameIrqWanted = bool;
}

export function setDmcIrqWanted(bool) {
    dmcIrqWanted = bool;
}

export function reset() {
    outputValues = new Float32Array(29781);

    outputOffset = 0;

    frameCounter = 0;

    interruptInhibit = false;
    step5Mode = false;

    enableNoise = false;
    enableTriangle = false;
    enablePulse2 = false;
    enablePulse1 = false;

    // pulse 1
    p1Timer = 0;
    p1TimerValue = 0;
    p1Duty = 0;
    p1DutyIndex = 0;
    p1Output = 0;
    p1CounterHalt = false;
    p1Counter = 0;
    p1Volume = 0;
    p1ConstantVolume = false;
    p1Decay = 0;
    p1EnvelopeCounter = 0;
    p1EnvelopeStart = false;
    p1SweepEnabled = false;
    p1SweepPeriod = 0;
    p1SweepNegate = false;
    p1SweepShift = 0;
    p1SweepTimer = 0;
    p1SweepTarget = 0;
    p1SweepMuting = true;
    p1SweepReload = false;

    // pulse 2
    p2Timer = 0;
    p2TimerValue = 0;
    p2Duty = 0;
    p2DutyIndex = 0;
    p2Output = 0;
    p2CounterHalt = false;
    p2Counter = 0;
    p2Volume = 0;
    p2ConstantVolume = false;
    p2Decay = 0;
    p2EnvelopeCounter = 0;
    p2EnvelopeStart = false;
    p2SweepEnabled = false;
    p2SweepPeriod = 0;
    p2SweepNegate = false;
    p2SweepShift = 0;
    p2SweepTimer = 0;
    p2SweepTarget = 0;
    p2SweepMuting = true;
    p2SweepReload = false;

    // triangle
    triTimer = 0;
    triTimerValue = 0;
    triStepIndex = 0;
    triOutput = 0;
    triCounterHalt = false;
    triCounter = 0;
    triLinearCounter = 0;
    triReloadLinear = false;
    triLinearReload = 0;

    // noise
    noiseTimer = 0;
    noiseTimerValue = 0;
    noiseShift = 1;
    noiseTonal = false;
    noiseOutput = 0;
    noiseCounterHalt = false;
    noiseCounter = 0;
    noiseVolume = 0;
    noiseConstantVolume = false;
    noiseDecay = 0;
    noiseEnvelopeCounter = 0;
    noiseEnvelopeStart = false;

    // dmc
    dmcInterrupt = false;
    dmcLoop = false;
    dmcTimer = 0;
    dmcTimerValue = 0;
    dmcOutput = 0;
    dmcSampleAddress = 0xc040;
    dmcAddress = 0xc040;
    dmcSample = 0;
    dmcSampleLength = 0;
    dmcSampleEmpty = true;
    dmcBytesLeft = 0;
    dmcShifter = 0;
    dmcBitsLeft = 8;
    dmcSilent = true;

// VRC6
// Frequency control - write 0 to $9003 on startup, that's all
   write(0x9003, 0)

// VRC6 Pulse 1
    vrc6P1Vol = 0     // $9000 bits 0-3
    vrc6P1Duty = 0    // $9000 bits 4-6
    vrc6P1DutyIndex = 0
    vrc6P1Mode = false    // $9000 bit 7
    vrc6P1Timer = 0   // $9001 bits 0-7, $9002 bits 0-3
    vrc6P1TimerValue = 0
    vrc6P1Enable = 0  // $9002 bit 7
    vrc6P1Output = 0

// VRC6 Pulse 2
    vrc6P2Vol = 0     // $A000 bits 0-3
    vrc6P2Duty = 0    // $A000 bits 4-6
    vrc6P2DutyIndex = 0
    vrc6P2Mode = false    // $A000 bit 7
    vrc6P2Timer = 0   // $A001 bits 0-7, $A002 bits 0-3
    vrc6P2TimerValue = 0
    vrc6P2Enable = 0  // $A002 bit 7
    vrc6P2Output = 0

// VRC6 Saw
    vrc6SawAccumRate = 0   // $B000 bits 0-5
    vrc6SawTimer = 0       // $B001 bits 0-7, $B002 bits 0-3
    vrc6SawAccum = 0       // internal accumulator
    vrc6SawTimerValue = 0
    vrc6SawEnable = 0      // $B002 bit 7
    vrc6SawOutput = 0
    vrc6SawStep = 0
}

export function cycle() {
    if (
        (frameCounter === 29830 && !step5Mode) ||
        frameCounter === 37282
    ) {
        frameCounter = 0;
    }
    frameCounter++;

    handleFrameCounter();

    cycleTriangle();
    cyclePulse1();
    cyclePulse2();
    cycleNoise();
    cycleDmc();
    cycleVrc6Pulse1()
    cycleVrc6Pulse2()
    cycleVrc6Saw()

    outputValues[outputOffset++] = mix();
    if (outputOffset === 29781) {
        // if we are going past the buffer (too many apu cycles per frame)
        outputOffset = 29780;
    }
}

function el(id) {
  return document.getElementById(id);
}

function log(text) {
  el("debug2").value = text
}

let isRecording = false

export function setRecording(bool) {
  isRecording = bool
}

function cyclePulse1() {
  if (p1TimerValue !== 0) {
      p1TimerValue--;
  } else {
      p1TimerValue = (p1Timer * 2) + 1;
      p1DutyIndex++;
      p1DutyIndex &= 0x7;
  }
  let output = dutyCycles[p1Duty][p1DutyIndex];
  if (output === 0 || p1SweepMuting || p1Counter === 0) {
      p1Output = 0;
  } else {
      p1Output = p1ConstantVolume ? p1Volume : p1Decay;
  }
  if (isRecording) {
    osc.p1ViewBuffer.push(p1Output)
    osc.p1ViewBuffer.shift()
    osc.setP1ViewCounter(osc.p1ViewCounter - 1)
    if (osc.p1ViewCounter === 0 && osc.layout !== 10) {
      osc.drawP1()
      osc.setP1ViewCounter(29781)
    }
  }
}

function cyclePulse2() {
    if (p2TimerValue !== 0) {
        p2TimerValue--;
    } else {
        p2TimerValue = (p2Timer * 2) + 1;
        p2DutyIndex++;
        p2DutyIndex &= 0x7;
    }
    let output = dutyCycles[p2Duty][p2DutyIndex];
    if (output === 0 || p2SweepMuting || p2Counter === 0) {
        p2Output = 0;
    } else {
        p2Output = p2ConstantVolume ? p2Volume : p2Decay;
    }
  if (isRecording) {
    osc.p2ViewBuffer.push(p2Output)
    osc.p2ViewBuffer.shift()
    osc.setP2ViewCounter(osc.p2ViewCounter - 1)
    if (osc.p2ViewCounter === 0 && osc.layout !== 10) {
      osc.drawP2()
      osc.setP2ViewCounter(29781)
    }
  }
}

function cycleTriangle() {
  if (triTimerValue !== 0) {
    triTimerValue--;
  } else {
    triTimerValue = triTimer;
    if (triCounter !== 0 && triLinearCounter !== 0) {
      triOutput = triangleSteps[triStepIndex++];
      if (triTimer < 2) {
        // ultrasonic
        triOutput = 7.5;
      }
      triStepIndex &= 0x1f;
    }
  }
  if (isRecording) {
    osc.triViewBuffer.push(triOutput)
    osc.triViewBuffer.shift()
    if (triOutput !== 0) {
      osc.setTriWatch(osc.triWatch - 1)
    } else {
      if (!osc.triFoundZero) {
        osc.setTriFoundZero(true)
        osc.setTriWatch(59562)
      }
    }
  if (osc.triFoundZero) {
    if (triOutput !== 1) {
      osc.setTriWatch(osc.triWatch - 1)
    } else {
      if (!osc.triRising) {
        osc.setTriRising(osc.triWatch)
      }
    }
  }
  if (osc.triRising) {osc.setTriRising(osc.triRising - 1)}
  if (osc.triWatch <= 0) {osc.setTriWatch(59562)}
    osc.setTriViewCounter(osc.triViewCounter - 1)
  if (osc.triViewCounter === 0) {
    osc.setTriViewCounter(29781)
    if ((osc.triRising > 14889) && (osc.triRising < 44672)) {
      osc.drawTri(osc.triViewBuffer.slice(osc.triRising - 14890, osc.triRising + 14890))
      osc.setTriFoundZero(false)
      osc.setTriRising(false)
      osc.setTriWatch(59562)
    } else if (triOutput === 7.5){
      osc.drawTri(new Array(29781).fill(7.5))
    }
    //log(triViewBuffer)
  }
  }
}

function cycleNoise() {
  if (isRecording) {
    osc.noiseViewBuffer.push(noiseOutput)
    if (osc.noiseViewBuffer.length === 29781) {
      osc.drawNoise(osc.noiseViewBuffer)
      osc.setNoiseViewBuffer([])
    }
  }
    if (noiseTimerValue !== 0) {
        noiseTimerValue--;
    } else {
        noiseTimerValue = noiseTimer;
        let feedback = noiseShift & 0x1;
        if (noiseTonal) {
            feedback ^= (noiseShift & 0x40) >> 6;
        } else {
            feedback ^= (noiseShift & 0x2) >> 1;
        }
        noiseShift >>= 1;
        noiseShift |= feedback << 14;
    }
    if (noiseCounter === 0 || (noiseShift & 0x1) === 1) {
        noiseOutput = 0;
    } else {
        noiseOutput = (
            noiseConstantVolume ? noiseVolume : noiseDecay
        );
    }
}

function cycleDmc() {
  if (isRecording && (osc.layout === 5 || osc.layout === 8 || osc.layout === 10)) {
    osc.dmcViewBuffer.push(dmcOutput)
    if (osc.dmcViewBuffer.length === 29781) {
      osc.drawDmc(osc.dmcViewBuffer)
      osc.setDmcViewBuffer([])
    }
  }
    if (dmcTimerValue !== 0) {
        dmcTimerValue--;
    } else {
        dmcTimerValue = dmcTimer;
        if (!dmcSilent) {
            if ((dmcShifter & 0x1) === 0) {
                if (dmcOutput >= 2) {
                    dmcOutput -= 2;
                }
            } else {
                if (dmcOutput <= 125) {
                    dmcOutput += 2;
                }
            }
        }
        dmcShifter >>= 1;
        dmcBitsLeft--;
        if (dmcBitsLeft === 0) {
            dmcBitsLeft = 8;
            if (dmcSampleEmpty) {
                dmcSilent = true;
            } else {
                dmcSilent = false;
                dmcShifter = dmcSample;
                dmcSampleEmpty = true;
            }
        }
    }
    if (dmcBytesLeft > 0 && dmcSampleEmpty) {
        dmcSampleEmpty = false;
        dmcSample = cpu.read(dmcAddress);
        //console.log("dmcAddress: " + dmcAddress)
        //console.log("dmcSample: " + dmcSample)
        dmcAddress++;
        if (dmcAddress === 0x10000) {
            dmcAddress = 0x8000;
        }
        dmcBytesLeft--;
        if (dmcBytesLeft === 0 && dmcLoop) {
            dmcBytesLeft = dmcSampleLength;
            dmcAddress = dmcSampleAddress;
        } else if (dmcBytesLeft === 0 && dmcInterrupt) {
            dmcIrqWanted = true;
        }
    }
}

function updateSweepP1() {
    let change = p1Timer >> p1SweepShift;
    if (p1SweepNegate) {
        change = (-change) - 1;
    }
    p1SweepTarget = p1Timer + change;
    if (p1SweepTarget > 0x7ff || p1Timer < 8) {
        p1SweepMuting = true;
    } else {
        p1SweepMuting = false;
    }
}

function updateSweepP2() {
    let change = p2Timer >> p2SweepShift;
    if (p2SweepNegate) {
        change = (-change);
    }
    p2SweepTarget = p2Timer + change;
    if (p2SweepTarget > 0x7ff || p2Timer < 8) {
        p2SweepMuting = true;
    } else {
        p2SweepMuting = false;
    }
}

function cycleVrc6Pulse1() {
  if (vrc6P1TimerValue !== 0) {
    vrc6P1TimerValue--
  } else {
    vrc6P1TimerValue = vrc6P1Timer + 1;
    vrc6P1DutyIndex--
    vrc6P1DutyIndex &= 0xf
  }
  vrc6P1Output = vrc6P1Vol
  if ((vrc6P1DutyIndex <= vrc6P1Duty) && !vrc6P1Mode) {
    vrc6P1Output = 0
  }
  if (isRecording) {
    osc.vrc6P1ViewBuffer.push(vrc6P1Output)
    osc.vrc6P1ViewBuffer.shift()
    osc.setVrc6P1ViewCounter(osc.vrc6P1ViewCounter - 1)
    if (osc.vrc6P1ViewCounter === 0 && (osc.layout === 8 || osc.layout === 10)) {
      osc.drawVrc6P1()
      osc.setVrc6P1ViewCounter(29781)
    }
  }
}

function cycleVrc6Pulse2() {
  if (vrc6P2TimerValue !== 0) {
    vrc6P2TimerValue--
  } else {
    vrc6P2TimerValue = vrc6P2Timer + 1;
    vrc6P2DutyIndex--
    vrc6P2DutyIndex &= 0xf
  }
  vrc6P2Output = vrc6P2Vol
  //console.log("p2 vol: " + vrc6P2Output)
  if ((vrc6P2DutyIndex <= vrc6P2Duty) && !vrc6P2Mode) {
    vrc6P2Output = 0
  }
  if (isRecording) {
    osc.vrc6P2ViewBuffer.push(vrc6P2Output)
    osc.vrc6P2ViewBuffer.shift()
    osc.setVrc6P2ViewCounter(osc.vrc6P2ViewCounter - 1)
    if (osc.vrc6P2ViewCounter === 0 && (osc.layout === 8 || osc.layout === 10)) {
      osc.drawVrc6P2()
      osc.setVrc6P2ViewCounter(29781)
    }
  }
}

function cycleVrc6Saw() {
  if (vrc6SawTimerValue !== 0) {
    vrc6SawTimerValue--
  } else {
    vrc6SawStep = (vrc6SawStep + 1) % 14
    vrc6SawTimerValue = vrc6SawTimer + 1;
    if (vrc6SawStep === 0) {
      vrc6SawAccum = 0
    }
    if ((vrc6SawStep & 0x01) == 0x0) {
      vrc6SawAccum += vrc6SawAccumRate
      vrc6SawOutput = vrc6SawAccum >> 3
    }
  }
  if (isRecording) {
    osc.sawViewBuffer.push(vrc6SawOutput)
    osc.sawViewBuffer.shift()
    osc.setSawViewCounter(osc.sawViewCounter - 1)
    if (osc.sawViewCounter === 0 && osc.layout === 8) {
      osc.drawSaw()
      osc.setSawViewCounter(29781)
    }
  }
}

function clockQuarter() {
    // handle triangle linear counter
    if (triReloadLinear) {
        triLinearCounter = triLinearReload;
    } else if (triLinearCounter !== 0) {
        triLinearCounter--;
    }
    if (!triCounterHalt) {
        triReloadLinear = false;
    }
    // handle envelopes
    if (!p1EnvelopeStart) {
        if (p1EnvelopeCounter !== 0) {
            p1EnvelopeCounter--;
        } else {
            p1EnvelopeCounter = p1Volume;
            if (p1Decay !== 0) {
                p1Decay--;
            } else {
                if (p1CounterHalt) {
                    p1Decay = 15;
                }
            }
        }
    } else {
        p1EnvelopeStart = false;
        p1Decay = 15;
        p1EnvelopeCounter = p1Volume;
    }

    if (!p2EnvelopeStart) {
        if (p2EnvelopeCounter !== 0) {
            p2EnvelopeCounter--;
        } else {
            p2EnvelopeCounter = p2Volume;
            if (p2Decay !== 0) {
                p2Decay--;
            } else {
                if (p2CounterHalt) {
                    p2Decay = 15;
                }
            }
        }
    } else {
        p2EnvelopeStart = false;
        p2Decay = 15;
        p2EnvelopeCounter = p2Volume;
    }

    if (!noiseEnvelopeStart) {
        if (noiseEnvelopeCounter !== 0) {
            noiseEnvelopeCounter--;
        } else {
            noiseEnvelopeCounter = noiseVolume;
            if (noiseDecay !== 0) {
                noiseDecay--;
            } else {
                if (noiseCounterHalt) {
                    noiseDecay = 15;
                }
            }
        }
    } else {
        noiseEnvelopeStart = false;
        noiseDecay = 15;
        noiseEnvelopeCounter = noiseVolume;
    }
}

function clockHalf() {
    // decrement length counters
    if (!p1CounterHalt && p1Counter !== 0) {
        p1Counter--;
    }
    if (!p2CounterHalt && p2Counter !== 0) {
        p2Counter--;
    }
    if (!triCounterHalt && triCounter !== 0) {
        triCounter--;
    }
    if (!noiseCounterHalt && noiseCounter !== 0) {
        noiseCounter--;
    }
    // handle sweeps
    if (
        p1SweepTimer === 0 && p1SweepEnabled &&
        !p1SweepMuting && p1SweepShift > 0
    ) {
        p1Timer = p1SweepTarget;
        updateSweepP1();
    }
    if (p1SweepTimer === 0 || p1SweepReload) {
        p1SweepTimer = p1SweepPeriod;
        p1SweepReload = false;
    } else {
        p1SweepTimer--;
    }

    if (
        p2SweepTimer === 0 && p2SweepEnabled &&
        !p2SweepMuting && p2SweepShift > 0
    ) {
        p2Timer = p2SweepTarget;
        updateSweepP2();
    }
    if (p2SweepTimer === 0 || p2SweepReload) {
        p2SweepTimer = p2SweepPeriod;
        p2SweepReload = false;
    } else {
        p2SweepTimer--;
    }
}

/* function mix() {
    // from https://wiki.nesdev.com/w/index.php/APU_Mixer
    // linear approximation
    let tnd = (
        0.00851 * triOutput +
        0.00494 * noiseOutput +
        0.00335 * dmcOutput
    );
    let pulse = 0.00752 * (p1Output + p2Output);
    return tnd + pulse;
} */

function mix() {
    // from https://wiki.nesdev.com/w/index.php/APU_Mixer
    // non-linear approximation (more accurate)
    let tnd = 159.79 / (( 1 / ((triOutput / 8227) + 
                               (noiseOutput / 12241) + 
                               (dmcOutput / 22638))) + 100)
    let pulse = 95.88 / ((8128 / (p1Output + p2Output)) + 100)
    let vrc6 = (vrc6P1Output + vrc6P2Output + vrc6SawOutput) / 61
    return ((tnd + pulse) * 2) + vrc6 - 0.3
}

function handleFrameCounter() {
    if (frameCounter === 7457) {
        clockQuarter();
    } else if (frameCounter === 14913) {
        clockQuarter();
        clockHalf();
    } else if (frameCounter === 22371) {
        clockQuarter();
    } else if (frameCounter === 29829 && !step5Mode) {
        clockQuarter();
        clockHalf();
        if (!interruptInhibit) {
            frameIrqWanted = true;
        }
    } else if (frameCounter === 37281) {
        clockQuarter();
        clockHalf();
    }
}

export function getOutput() {
    let ret = [outputOffset, outputValues];
    outputOffset = 0;
    return ret;
}

export function peek(adr) {
    if (adr === 0x4015) {
        let ret = 0;
        ret |= (p1Counter > 0) ? 0x1 : 0;
        ret |= (p2Counter > 0) ? 0x2 : 0;
        ret |= (triCounter > 0) ? 0x4 : 0;
        ret |= (noiseCounter > 0) ? 0x8 : 0;
        ret |= (dmcBytesLeft > 0) ? 0x10 : 0;
        ret |= frameIrqWanted ? 0x40 : 0;
        ret |= dmcIrqWanted ? 0x80 : 0;
        return ret;
    }
    return 0;
}

export function read(adr) {
    if (adr === 0x4015) {
        let ret = 0;
        ret |= (p1Counter > 0) ? 0x1 : 0;
        ret |= (p2Counter > 0) ? 0x2 : 0;
        ret |= (triCounter > 0) ? 0x4 : 0;
        ret |= (noiseCounter > 0) ? 0x8 : 0;
        ret |= (dmcBytesLeft > 0) ? 0x10 : 0;
        ret |= frameIrqWanted ? 0x40 : 0;
        ret |= dmcIrqWanted ? 0x80 : 0;
        frameIrqWanted = false;
        return ret;
    }
    return 0;
}

export let registers = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
]

export function write(adr, value) {
    switch (adr) {
        case 0x4000: {
            // DDlc.vvvv
            // Pulse 1 Duty cycle, length counter halt,
            // constant volume/envelope flag,
            // volume/envelope divider period 
            registers[0] = value
            p1Duty = (value & 0xc0) >> 6;
            p1Volume = value & 0xf;
            p1CounterHalt = (value & 0x20) > 0;
            p1ConstantVolume = (value & 0x10) > 0;
            break;
        }
        case 0x4001: {
            registers[1] = value
            p1SweepEnabled = (value & 0x80) > 0;
            p1SweepPeriod = (value & 0x70) >> 4;
            p1SweepNegate = (value & 0x08) > 0;
            p1SweepShift = value & 0x7;
            p1SweepReload = true;
            updateSweepP1();
            break;
        }
        case 0x4002: {
            registers[2] = value
            p1Timer &= 0x700;
            p1Timer |= value;
            updateSweepP1();
            break;
        }
        case 0x4003: {
            registers[3] = value
            p1Timer &= 0xff;
            p1Timer |= (value & 0x7) << 8;
            p1DutyIndex = 0;
            if (enablePulse1) {
                p1Counter = lengthLoadValues[(value & 0xf8) >> 3];
            }
            p1EnvelopeStart = true;
            updateSweepP1();
            break;
        }
        case 0x4004: {
            registers[4] = value
            p2Duty = (value & 0xc0) >> 6;
            p2Volume = value & 0xf;
            p2CounterHalt = (value & 0x20) > 0;
            p2ConstantVolume = (value & 0x10) > 0;
            break;
        }
        case 0x4005: {
            registers[5] = value
            p2SweepEnabled = (value & 0x80) > 0;
            p2SweepPeriod = (value & 0x70) >> 4;
            p2SweepNegate = (value & 0x08) > 0;
            p2SweepShift = value & 0x7;
            p2SweepReload = true;
            updateSweepP2();
            break;
        }
        case 0x4006: {
            registers[6] = value
            p2Timer &= 0x700;
            p2Timer |= value;
            updateSweepP2();
            break;
        }
        case 0x4007: {
            registers[7] = value
            p2Timer &= 0xff;
            p2Timer |= (value & 0x7) << 8;
            p2DutyIndex = 0;
            if (enablePulse2) {
                p2Counter = lengthLoadValues[(value & 0xf8) >> 3];
            }
            p2EnvelopeStart = true;
            updateSweepP2();
            break;
        }
        case 0x4008: {
            registers[8] = value
            triCounterHalt = (value & 0x80) > 0;
            triLinearReload = value & 0x7f;

            // looks like this is a mistake in the nesdev wiki?
            // http://forums.nesdev.com/viewtopic.php?f=3&t=13767#p163155
            // doesn't do this, neither does Mesen,
            // and doing it breaks Super Mario Bros. 2's triangle between notes

            // triReloadLinear = true;
            break;
        }
        case 0x400a: {
            registers[10] = value
            triTimer &= 0x700;
            triTimer |= value;
            break;
        }
        case 0x400b: {
            registers[11] = value
            triTimer &= 0xff;
            triTimer |= (value & 0x7) << 8;
            if (enableTriangle) {
                triCounter = lengthLoadValues[(value & 0xf8) >> 3];
            }
            triReloadLinear = true;
            break;
        }
        case 0x400c: {
            registers[12] = value
            noiseCounterHalt = (value & 0x20) > 0;
            noiseConstantVolume = (value & 0x10) > 0;
            noiseVolume = value & 0xf;
            break;
        }
        case 0x400e: {
            registers[14] = value
            noiseTonal = (value & 0x80) > 0;
            noiseTimer = noiseLoadValues[value & 0xf] - 1;
            break;
        }
        case 0x400f: {
            registers[15] = value
            if (enableNoise) {
                noiseCounter = lengthLoadValues[(value & 0xf8) >> 3];
            }
            noiseEnvelopeStart = true;
            break;
        }
        case 0x4010: {
            registers[16] = value
            dmcInterrupt = (value & 0x80) > 0;
            dmcLoop = (value & 0x40) > 0;
            dmcTimer = dmcLoadValues[value & 0xf] - 1;
            if (!dmcInterrupt) {
                dmcIrqWanted = false;
            }
            break;
        }
        case 0x4011: {
            registers[17] = value
            dmcOutput = value & 0x7f;
            break;
        }
        case 0x4012: {
            registers[18] = value
            //console.log("dmc address value " + value)
            dmcSampleAddress = ((value << 6) + 0xc000);
            //console.log("dmc address set to " + dmcSampleAddress)
            break;
        }
        case 0x4013: {
            registers[19] = value
            dmcSampleLength = (value << 4) + 1;
            break;
        }
        case 0x4015: {
            //registers[18] = value
            enableNoise = (value & 0x08) > 0;
            enableTriangle = (value & 0x04) > 0;
            enablePulse2 = (value & 0x02) > 0;
            enablePulse1 = (value & 0x01) > 0;
            if (!enablePulse1) {
                p1Counter = 0;
            }
            if (!enablePulse2) {
                p2Counter = 0;
            }
            if (!enableTriangle) {
                triCounter = 0;
            }
            if (!enableNoise) {
                noiseCounter = 0;
            }
            if ((value & 0x10) > 0) {
                if (dmcBytesLeft === 0) {
                    dmcBytesLeft = dmcSampleLength;
                    dmcAddress = dmcSampleAddress;
                }
            } else {
                dmcBytesLeft = 0;
            }
            dmcIrqWanted = false;
            break;
        }
        case 0x4017: {
            //registers[19] = value
            step5Mode = (value & 0x80) > 0;
            interruptInhibit = (value & 0x40) > 0;
            if (interruptInhibit) {
                frameIrqWanted = false;
            }
            frameCounter = 0;
            if (step5Mode) {
                clockQuarter();
                clockHalf();
            }
            break;
        }
        case 0x9000: {
            registers[20] = value
            // VRC6 Pulse 1 control
            // 7  bit  0
            // ---- ----
            // MDDD VVVV
            // |||| ||||
            // |||| ++++- Volume
            // |+++------ Duty Cycle
            // +--------- Mode (1: ignore duty)
            vrc6P1Mode = (value & 0x80) > 0
            vrc6P1Duty = (value & 0x70) >> 4
            vrc6P1Vol = value & 0xf
            break;
        }
        case 0x9001: {
            registers[21] = value
            // VRC6 Pulse 1 freq low
            // 7  bit  0
            // ---- ----
            // FFFF FFFF
            // |||| ||||
            // ++++-++++- Low 8 bits of frequency
            vrc6P1Timer &= 0xF00
            vrc6P1Timer |= value
            break;
        }
        case 0x9002: {
            registers[22] = value
            // VRC6 Pulse 1 freq high
            // 7  bit  0
            // ---- ----
            // E... FFFF
            // |    ||||
            // |    ++++- High 4 bits of frequency
            // +--------- Enable (0 = channel disabled)
            vrc6P1Timer &= 0xff
            vrc6P1Timer |= (value & 0xf) << 8; 
            break;
        }
        case 0x9003: {
            // VRC6 Frequency Control
            // 7  bit  0
            // ---- ----
            // .... .ABH
            //       |||
            //       ||+- Halt
            //       |+-- 16x frequency (4 octaves up)
            //       +--- 256x frequency (8 octaves up)
            // not normally written to, only initialized to 0
            break;
        }
        case 0xA000: {
            registers[23] = value
            // VRC6 Pulse 2 control
            // (see pulse 1 control)
            vrc6P2Mode = (value & 0x80) > 0
            vrc6P2Duty = (value & 0x70) >> 4
            vrc6P2Vol = value & 0xf
            break;
        }
        case 0xA001: {
            registers[24] = value
            // VRC6 Pulse 2 freq low
            // (see pulse 1 freq low)
            vrc6P2Timer &= 0xF00
            vrc6P2Timer |= value
            break;
        }
        case 0xA002: {
            registers[25] = value
            // VRC6 Pulse 2 freq high
            // (see pulse 1 freq high)
            vrc6P2Timer &= 0xff
            vrc6P2Timer |= (value & 0xf) << 8; 
            break;
        }
        case 0xB000: {
            registers[26] = value
            // VRC6 Saw Accum Rate
            // 7  bit  0
            // ---- ----
            // ..AA AAAA
            //   ++-++++- Accumulator Rate (controls volume)
            vrc6SawAccumRate = value &= 0x3f
            break;
        }
        case 0xB001: {
            registers[27] = value
            // VRC6 Saw freq low
            // (see pulse 1,2 freq low)
            vrc6SawTimer &= 0xF00
            vrc6SawTimer |= value
            break;
        }
        case 0xB002: {
            registers[28] = value
            // VRC6 Saw freq high
            // (see pulse 1,2 freq high)
            vrc6SawTimer &= 0xff
            vrc6SawTimer |= (value & 0xf) << 8;
            break;
        }
        default: {
            break;
        }
    }
}



