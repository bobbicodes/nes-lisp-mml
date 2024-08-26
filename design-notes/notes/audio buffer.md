- ## Goal
- Replace `createScriptProcessor` with audio worklet https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_AudioWorklet
- More detail in [[web audio worklets]]
- Which really means I need to dive into the audio buffer of the NSF player to understand how it works. So I'll walk through it and try to understand what it does... there's the original version, and my non-object version which unfortunately doesn't pause right and hopefully through this I'll understand why.
- ## Initialization
- In the original, fully working one, the audio handler is an object that is initialized called `AudioHandler`. Everything below is located inside this object.
- ```js
  this.hasAudio = true;
  let Ac = window.AudioContext || window.webkitAudioContext;
  this.sampleBuffer = new Float64Array(735);
  this.samplesPerFrame = 735;
  
  if (Ac === undefined) {
      log("Audio disabled: no Web Audio API support");
      this.hasAudio = false;
  } else {
      this.actx = new Ac();
  
      let samples = this.actx.sampleRate / 60;
      this.sampleBuffer = new Float64Array(samples);
      this.samplesPerFrame = samples;
  
      log("Audio initialized, sample rate: " + samples * 60);
  
      this.inputBuffer = new Float64Array(4096);
      this.inputBufferPos = 0;
      this.inputReadPos = 0;
  
      this.scriptNode = undefined;
      this.dummyNode = undefined;
  }
  ```
- Huh... I got it to pause fully by simply adding `inputBuffer = new Float64Array(4096);` to the `stop()` function... however, when you unpause, the sound is messed up. But we're getting ahead so let's continue.
- So there's a resume function but that just calls resume on the audio context, and is called when the NSF is loaded.
- Next we have the `start()` function:
- ```js
  this.start = function () {
      if (this.hasAudio) {
  
          this.dummyNode = this.actx.createBufferSource();
          this.dummyNode.buffer = this.actx.createBuffer(1, 44100, 44100);
          this.dummyNode.loop = true;
  
          this.scriptNode = this.actx.createScriptProcessor(2048, 1, 1);
          let that = this;
          this.scriptNode.onaudioprocess = function (e) {
              that.process(e);
          }
  
          this.dummyNode.connect(this.scriptNode);
          this.scriptNode.connect(this.actx.destination);
          this.dummyNode.start();
  
      }
  }
  
  this.process = function (e) {
      if (this.inputReadPos + 2048 > this.inputBufferPos) {
          log("Audio buffer overran");
          this.inputReadPos = this.inputBufferPos - 2048;
      }
      if (this.inputReadPos + 4096 < this.inputBufferPos) {
          log("Audio buffer underran");
          this.inputReadPos += 2048;
      }
      let output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < 2048; i++) {
          output[i] = this.inputBuffer[(this.inputReadPos++) & 0xfff];
      }
  }
  ```
- Hmm I just noticed that pause still doesn't pause completely... it keeps showing audio buffer overran
- Fuck, something just got messed up. Here's my simplified audio plumbing:
- ```js
  function log(text) {
      const el = document.getElementById("log");
      el.innerHTML += text + "<br>";
      el.scrollTop = el.scrollHeight;
  }
  
  let Ac = window.AudioContext || window.webkitAudioContext;
  let actx = new Ac();
  
  export let samplesPerFrame = actx.sampleRate / 60;
  export let sampleBuffer = new Float64Array(samplesPerFrame);
  
  log("Audio initialized, sample rate: " + samplesPerFrame * 60);
  
  let inputReadPos = 0;
  let inputBufferPos = 0;
  let inputBuffer = new Float64Array(4096);
  let dummyNode
  let scriptNode
  
  export function resume() {
      // for Chrome autoplay policy
      actx.resume();
  }
  
  export function start() {
      dummyNode = actx.createBufferSource();
      dummyNode.buffer = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
      //dummyNode.loop = true;
  
      const scriptNode = actx.createScriptProcessor(2048, 1, 1);
      scriptNode.onaudioprocess = function (e) {
          process(e);
      }
  
      dummyNode.connect(scriptNode);
      scriptNode.connect(actx.destination);
      dummyNode.start();
  }
  
  export function stop() {
      if (dummyNode) {
          dummyNode.stop();
          dummyNode.disconnect();
          dummyNode = undefined;
      }
      if (scriptNode) {
          scriptNode.disconnect();
          scriptNode = undefined;
      }
      inputBufferPos = 0;
      inputReadPos = 0;
      inputBuffer = new Float64Array(4096);
  }
  
  export function process(e) {
      if (inputReadPos + 2048 > inputBufferPos) {
          log("Audio buffer overran");
          inputReadPos = inputBufferPos - 2048;
      }
      if (inputReadPos + 4096 < inputBufferPos) {
          log("Audio buffer underran");
          inputReadPos += 2048;
      }
      let output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < 2048; i++) {
          output[i] = inputBuffer[(inputReadPos++) & 0xfff];
      }
  }
  
  export function nextBuffer() {
      for (let i = 0; i < samplesPerFrame; i++) {
          let val = sampleBuffer[i];
          inputBuffer[(inputBufferPos++) & 0xfff] = val;
      }
  }
  ```
- I broke out the process function from the object, which allowed me to get rid of that silly `let that = this` bs.
- That's an improvement, because now I know that wasn't responsible for the issue I'm having.