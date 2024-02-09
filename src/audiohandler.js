let inputReadPos = 0;
let inputBufferPos = 0;
let inputBuffer = new Float64Array(4096);

function process(e) {
    if (inputReadPos + 2048 > inputBufferPos) {
        inputReadPos = inputBufferPos - 2048;
    }
    if (inputReadPos + 4096 < inputBufferPos) {
        inputReadPos += 2048;
    }
    let output = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < 2048; i++) {
        output[i] = inputBuffer[(inputReadPos++) & 0xfff];
    }
}

const Ac = window.AudioContext || window.webkitAudioContext;
const actx = new Ac();
export const samplesPerFrame = actx.sampleRate / 60;
export let sampleBuffer = new Float64Array(samplesPerFrame);

export function resume() {
    actx.resume();
}

export function nextBuffer() {
    for (let i = 0; i < samplesPerFrame; i++) {
        let val = sampleBuffer[i];
        inputBuffer[(inputBufferPos++) & 0xfff] = val;
    }
}

export function AudioHandler() {

    this.start = function () {
        this.sourceNode = actx.createBufferSource();
        this.sourceNode.buffer = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
        this.sourceNode.loop = true;

        this.scriptNode = actx.createScriptProcessor(2048, 1, 1);
        this.scriptNode.onaudioprocess = function (e) {
            process(e);
        }

        this.biquadFilter = actx.createBiquadFilter();
        this.biquadFilter.type = "highpass";
        this.biquadFilter.frequency.setValueAtTime(37, actx.currentTime);
        this.sourceNode.connect(this.scriptNode);
        this.scriptNode.connect(this.biquadFilter);
        this.biquadFilter.connect(actx.destination);
        this.sourceNode.start();
    }

    this.stop = function () {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
        }
        if (this.scriptNode) {
            this.scriptNode.disconnect();
        }
        inputBufferPos = 0;
        inputReadPos = 0;
    }
}
