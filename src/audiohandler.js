let inputBufferPos = 0;
export let inputBuffer = new Float32Array(4096);

const actx = new AudioContext()
export const samplesPerFrame = actx.sampleRate / 60;
export let sampleBuffer = new Float32Array(samplesPerFrame);

export function resume() {
    actx.resume();
}

export function nextBuffer() {
    for (let i = 0; i < samplesPerFrame; i++) {
        let val = sampleBuffer[i];
        inputBuffer[(inputBufferPos++) & 0xfff] = val;
    }
}

await actx.audioWorklet.addModule("./src/audioworklet.js");

const processor = new AudioWorkletNode(
    actx,
    "audioworklet",
    {processorOptions: inputBuffer}
  )

export function AudioHandler() {

    this.start = function () {
        this.sourceNode = actx.createBufferSource();
        this.sourceNode.buffer = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
        this.sourceNode.loop = true;
        this.biquadFilter = actx.createBiquadFilter();
        this.biquadFilter.type = "highpass";
        this.biquadFilter.frequency.setValueAtTime(37, actx.currentTime);
        this.sourceNode.connect(processor);
        processor.connect(this.biquadFilter);
        this.biquadFilter.connect(actx.destination);
        this.sourceNode.start();
    }

    this.stop = function () {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
        }
        inputBufferPos = 0;
        inputReadPos = 0;
    }
}
