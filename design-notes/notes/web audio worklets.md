- Ok so wtf is this function even doing
- ```js
  function getSamples(data, count) {
    // apu returns 29780 or 29781 samples (0 - 1) for a frame
    // we need count values (0 - 1)
    let samples = apu.getOutput();
    let runAdd = (29780 / count);
    let inputPos = 0;
    let running = 0;
    for (let i = 0; i < count; i++) {
      running += runAdd;
      let total = 0;
      let avgCount = running & 0xffff;
      for (let j = inputPos; j < inputPos + avgCount; j++) {
        total += samples[1][j];
      }
      data[i] = total / avgCount;
      inputPos += avgCount;
      running -= avgCount;
    }
  }
  ```
- Ah... it modifies `data`, the `sampleBuffer` passed as its first argument:
- ```js
  getSamples(sampleBuffer, samplesPerFrame);
  ```
- This happens once per frame. The `sampleBuffer` in question... is part of the buffer system implementing the deprecated script processor node! So it is precisely here where we need to change it. Here is the definition, in audiohandler.js:
- ```js
  export let sampleBuffer = new Float32Array(samplesPerFrame);
  ```
- I don't know what to fucking do. Guess I'm giving up for now. I really hoped to get this done today.
- ## Revisiting this
- So the `sampleBuffer`... is from the audio handler module. So how is it mutated? I thought you couldn't do that to a variable from another module...
- Maybe you can modify it, but not redefine it? I'm confused.
- Huh, I guess that's it. But what about the cpu stuff where I specifically have to call a function for modifying stuff?
- ## Zeta's implementation
- This looks pretty much exactly what I need: https://github.com/zeta0134/rusticnes-wasm/blob/master/public/audio_processor.js
- Threads use messages to communicate. In the main.js part of the UI, there's a function to handle audio messages.
- There are actually 3 threads, one for the emulator, one for the audio and a main thread.
- In Audio setup, it initializes the context and worklet:
- ```js
  let g_audio_context = null;
  let g_nes_audio_node = null;
  
  async function init_audio_context() {
    g_audio_context = new AudioContext({
      latencyHint: 'interactive',
      sampleRate: 44100,
    });
    await g_audio_context.audioWorklet.addModule('audio_processor.js');
    g_nes_audio_node = new AudioWorkletNode(g_audio_context, 'nes-audio-processor');
    g_nes_audio_node.connect(g_audio_context.destination);
    g_nes_audio_node.port.onmessage = handle_audio_message;
  }
  
  function handle_audio_message(e) {
    if (e.data.type == "samplesPlayed") {
      g_audio_samples_buffered -= e.data.count;
      g_trouble_detector.successful_samples += e.data.count;
      if (!g_audio_confirmed_working && g_trouble_detector.successful_samples > 44100) {
        let audio_context_banner = document.querySelector("#audio-context-warning");
        if (audio_context_banner != null) {
          audio_context_banner.classList.remove("active");
        }
        g_audio_confirmed_working = true;
      }
    }
    if (e.data.type == "audioUnderrun") {
      g_trouble_detector.failed_samples += e.data.count;
    }
  }
  ```
- There is a bunch of audio stuff in the emu worker. This looks particularly relevant:
- ```js
   g_nes_audio_node.port.postMessage({"type": "samples", "samples": e.data.audio_buffer});
  ```
- It's passing the sample buffer! I think that's what we need to happen inside `getSamples`!
- I think I've got that part set up. I believe it's sending the message:
- ```js
  function getSamples(data, count) {
    // apu returns 29780 or 29781 samples (0 - 1) for a frame
    // we need count values (0 - 1)
    let audio_buffer = data
    let samples = apu.getOutput();
    let runAdd = (29780 / count);
    let total = 0;
    let inputPos = 0;
    let running = 0;
    for (let i = 0; i < count; i++) {
      running += runAdd;
      let total = 0;
      let avgCount = running & 0xffff;
      for (let j = inputPos; j < inputPos + avgCount; j++) {
        total += samples[1][j];
      }
      audio_buffer[i] = total / avgCount;
      inputPos += avgCount;
      running -= avgCount;
    }
    processor.port.postMessage({"type": "samples", "samples": e.data.audio_buffer});
  }
  ```
- So that's sending the samples ... hold on.
- In Zeta's main.js, this is happening inside a `worker.onmessage = function(e) { ...`.
- That's where the `e` comes from.
- But we don't have a separate thread for the emu. So I think... get rid of that?
- I actually got a click... it's only calling `process` once.
- Omg... I have a beep. It's like it's only playing the first frame on loop or something.
- Blah... I think I lost the plot.
- I looked at the audio context init in RusticNes, it doesn't use any sample buffer source node
- It's sending the samples I can see them changing. What is it not doing? There's just no audio out.
- It's never calling process.
- Ok, I got it to call process by putting back the audio buffer source node. Now it's logging
- Want to play:  128
- which is `output[0].length`
- the sample buffer length is only increasing. We need to do the thing where it removes samples, I guess.
- omg that did it!
- Holy shit... it actually works
- ```
  <link rel="icon" type="image/svg+xml" href="/nes-lisp-mml/vite.svg" />
  
  <script type="module" crossorigin src="/nes-music-engine/assets/index-fe7d9729.js"></script>
  
  <link rel="stylesheet" href="/nes-music-engine/assets/index-6b81dc02.css">
  ```
- The last (and rather stubborn) issue is I can't get the worker to load when it's served from codeberg pages...
- Argh... I got it to work on Github Pages, which is like... kind of annoying but whatevs....