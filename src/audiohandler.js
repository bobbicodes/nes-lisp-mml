export const actx = new AudioContext()
export const samplesPerFrame = actx.sampleRate / 60;
export let sampleBuffer = new Float32Array(samplesPerFrame);

await actx.audioWorklet.addModule("audioworklet.js");

export const processor = new AudioWorkletNode(actx, "audioworklet")
let sourceNode = null

export function resume() {
    actx.resume();
}

export function start() {
  sourceNode = actx.createBufferSource();
  processor.connect(actx.destination);
  sourceNode.start();
}

export function stop() {
  if (sourceNode) {
    sourceNode.stop();
    sourceNode.disconnect();
  }
    processor.disconnect();
}

