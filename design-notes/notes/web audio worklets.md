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
- This happens once per frame. The `sampleBuffer` in question... is part of the buffer system implementing the deprecated script processor node! So it is precisely here where we need to change it. Here is the definition:
- ```js
  export let sampleBuffer = new Float32Array(samplesPerFrame);
  ```
- I don't know what to fucking do. Guess I'm giving up for now. I really hoped to get this done today.