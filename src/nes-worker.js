importScripts("nes/cpu.js", "nes/apu.js", "nes/nsfmapper.js", "nes/nsf.js")

let player = new NsfPlayer();
let sampleBuffer = new Float32Array(800);

onmessage = function(e) {
  console.log('Worker: Message received from main script of type: ' + e.data.type);
  if (e.data.type === 'rom') {
    player.loadNsf(e.data.rom)
    console.log('Loaded rom');
     let audioBuffer = new Float32Array()
     let frameCount = 0;
     while (frameCount < 2000) {
      player.runFrame()
      player.getSamples(sampleBuffer, 800)
      const newBuffer = new Float32Array(audioBuffer.length + sampleBuffer.length);
      newBuffer.set(audioBuffer, 0);
      newBuffer.set(sampleBuffer, audioBuffer.length);
      audioBuffer = newBuffer;
      frameCount++;
    }
  postMessage({'buffer': sampleBuffer, 'filename': e.data.filename})
  }
}

