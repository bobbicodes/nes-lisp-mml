export const actx = new AudioContext()
export const samplesPerFrame = actx.sampleRate / 60;
export let sampleBuffer = new Float32Array(samplesPerFrame);

await actx.audioWorklet.addModule("audioworklet.js");

export const processor = new AudioWorkletNode(actx, "audioworklet")

export function resume() {
    actx.resume();
}

export function AudioHandler() {

    this.start = function () {
        this.sourceNode = actx.createBufferSource();
        this.biquadFilter = actx.createBiquadFilter();
        this.biquadFilter.type = "highpass";
        this.biquadFilter.frequency.setValueAtTime(37, actx.currentTime);
        processor.connect(this.biquadFilter);
        this.biquadFilter.connect(actx.destination);
        this.sourceNode.start();
    }

    this.stop = function () {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
        }
        processor.disconnect();
    }
}
