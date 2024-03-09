- So I already have a spit-wav function which takes an audio buffer and downloads a file. Now, it wouldn't be too hard to make it so when we play the NSF, it will concatenate all of the buffers and pass it to spit-wav. But the really interesting part will be running the emulator at full speed and not playing the audio to get the buffers quickly.
- Like how to even start?
- First off, we will not be running it in the animation loop. Instead, we'll just use a normal loop.
- So normally when we play an NSF, we call `playNSF`:
- ```js
  function playNSF(square1, square2, triangle, noise) {
      square1 = audio.assembleStream(square1)
      square2 = audio.assembleStream(square2)
      triangle = audio.assembleStream(triangle)
      noise = audio.assembleNoise(noise)
      assembleDriver(square1, square2, triangle, noise)
      resetNSF()
      loadRom(nsfDriver)
  }
  ```
- Let's make an analogous function called saveWav. It will do the same thing, but then when we get to `loadRom(nsfDriver)` we will call something else.
- ```js
  export function loadRom(rom) {
    if (loadNsf(rom)) {
      if (!loaded && !paused) {
        loopId = requestAnimationFrame(update);
        audio.start();
      }
      // clear ram cdl, rom cdl
      ramCdl = new Uint8Array(0x8000)
      romCdl = new Uint8Array(0x4000)
      loaded = true;
      currentSong = startSong;
    }
  }
  ```
- So we'll make a new version of this one as well.
- We'll also need to send some kind of signal that we are done, like by counting the number of frames to run or something. How do we measure that?
- I guess we'll go through each stream, go through each note and add up all the lengths.
- The lengths are kind of weird too... like each value is twice as long as the one before, so we need to count up from 0x81 and double it each time.
- Hmm, or we could do it another way... we just reset a counter before we play, and increment it every time a stream ends. Then each iteration we just check if the counter is at 3 and if it is, stop.
- But wait... we don't have access to that variable! The 0xff thing is part of the driver implementation. But... we could watch the program counter... wait no. Shit. I think adding up the lengths is the best way.
- To find the length in frames, we should be able to do like... an exponent?
- Yeah, it's just 2 to the power of n
- uh... that can't be how lengths actually work. Shit, how do they?
- ok, so each number is simply one more frame than the last!
- Also, I just noticed that our E1 note is broken, must be our *rest* note, lol. Gonna have to fix that.
- Our songLength variable works great though!
- Alright, so we're gonna call runFrame for songLength frames. But...
- We keep drilling further down. We're... no. The regular runFrame is fine. We can run it... hold on.
- RunFrame calls `nextBuffer()`, and we don't want to do that because it's part of the audio system and at the very least, unnecessary. So We'll make a new runFrame...
- omg it's almost working, I think I just need to implement a filter because it's way offset... but I think that's just the way it is. I guess see you at [[high-pass filter]]