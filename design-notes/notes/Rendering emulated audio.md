- So now it's a bit more clear how we would go about producing an audio file from our renderer. We run the emulation but instead of playing it we concatenate all of the outputs of `getSamples()`
- ```js
  function getSamples(data, count) {
    // apu returns 29780 or 29781 samples (0 - 1) for a frame
    // we need count values (0 - 1)
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
      data[i] = total / avgCount;
      inputPos += avgCount;
      running -= avgCount;
    }
  }
  ```
- `getSamples` is called in `runFrame`, where it is passed `sampleBuffer` and `samplesPerFrame`
- btw that is the *only* time `getSamples` is ever called
- Let's walk through the function. I think I did this before but I need a refresher.
- ```js
  let samples = apu.getOutput();
  ```
- This is also the only time `getOutput` is ever called.
- I'm noting these things because I'm itching to change these stateful variables into pure functions, but to gain the confidence to do so I need a better sense of when each thing is (and isn't) called.
- `getOutput` is also "destructive", i.e. it sets the `outputOffset` of the APU to `0`:
- ```js
  export function getOutput() {
      let ret = [outputOffset, output];
      outputOffset = 0;
      return ret;
  }
  ```
- That's because when we get the output we have all the APU's output samples, so we put it back to `0` for the next set.
- Huh... sidenote: I just realized that output grabbed this way still needs to be filtered, because that happens as part of the Web Audio buffering pipeline. So I'll be needing to write my own function for that.
	- The APU output array is just called `output`, which bugs me because there are 50 occurrences of "output" in apu.js alone... it's not even exported, i.e. it's only used within this module so I think I'll rename it `outputValues`, which also tells us that it's a sequence of values - more descriptive.
- Nice, now when I search for outputValues, I can see it occurs only 4 times.
	- The actual definition
	- In reset it is cleared
	- In `cycle`, it sets the current value of `outputOffset`
	- In `getOutput`, when it is read and the offset is reset
- I think I'm going to remove the visualizer because it's just cluttering things up. Eventually it will be replaced with my own thing anyway, and it still exists in the NSFPlayer project.
- Now main.js is under 400 lines.
- The disassembly isn't working. I wonder how that happened.
- The `peek` function is trying to access RAM, but it's not even in that module.
- I think it's using the html element which is called ram... I'm changing it to memory.
- That actually breaks the cpu, because apparently we've been writing to it?
- ok I think I've got it sort of working... except when I set it to show around where the program counter is, we get basically nothing because it seems to stop at around $4000 or something.
- Anyway... this actually has nothing to do with the topic of this page, it's just a tangent I happened to go on.