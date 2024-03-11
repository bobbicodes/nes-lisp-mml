const actx = new AudioContext()
export const samplesPerFrame = actx.sampleRate / 60;
export let sampleBuffer = new Float32Array(samplesPerFrame);

await actx.audioWorklet.addModule("./src/audioworklet.js");

export const processor = new AudioWorkletNode(actx, "audioworklet")

export function resume() {
    actx.resume();
}

export function AudioHandler() {

    this.start = function () {
        this.sourceNode = actx.createBufferSource();
        this.sourceNode.buffer = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
        this.sourceNode.connect(processor);
        processor.connect(actx.destination);
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
