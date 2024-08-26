- Ok so this was a big realization. There's no reason for the emulator to be timed to the RAF loop.
- So how to accomplish this. It's basically like the audio export thing.
- When `saveWav` is called,
	- The driver is assembled with the music data
	- calls `audio.exportAudio` with the driver
- Export audio isn't quite functional atm, because of the song length issue. We can fix that by making it aware of the stream pointer locations, and the stop condition will be when all of them have reached their last byte.
- I also kind of feel like porting [[crazy]] to nes-lisp-mml
- Well I did that! It came out great! Now to think about this some more.
- The emulation probably needs to run in a worklet. It's like... the definition of something that should run in the background. The main thread is taxed enough as it is from the repl.
- ## Web workers
- Reading about this now. MDN has a tiny example of a worker that just multiplies 2 numbers together and messages it to the page to display. So this would be the emulator, specifically `runFrame()`.
- The repl probably should have its own thread. But one thing at a time... we want to make a worker for the emulator.
- I guess I should make a branch for this.
- Made one called worker.
- The example has a worker.js, so I guess I'll make one.
- I have the example running in the page. Cool, so I'm done!
- No, not quite. We need the worker to be able to run the cpu.
- The way workers import things is by running scripts to gain access to their global objects. Great, the one thing I worked so hard to get rid of.
- Well I guess we have the old NesJS to refer to. I made a new folder called nes that can just be the worker nes.
- Got the cpu and apu. I guess we need the mapper too. I'll have the worker import these.
- So now the worker has its own nes. How do we get it to use it? What happens when we like, play the song?
- When we call loadNsf, we need to message the driver to the other thread, so that the nsfmapper can set everything properly.
- ## Good idea
- I can implement this first as the audio out, which will make it super clean to develop while still using the application as normal. And since the function doesn't even work now because we don't know how long the song is, I'm not even breaking anything.
- So we're going to make the audio export work by messaging the worker, which will initialize and run its own NES.
- The driver is still assembled the same way! In `core.saveWav`. It assembles the driver, and passes it to `audio.exportAudio`.
- The first thing it does is call `loadNsf` on the rom (driver).
- We're going to branch off here and create a parallel loadNsf.
- Normally loadnsf initializes the player then calls playsong, but I'm going to put playsong into the same function. Which means that's where we initialize the ram.
- okk, so I just put the entire nsf.js script in, so now I just `let player = new NsfPlayer();` in the worker.
- So now we can do `player.loadNsf(rom)`
- Then in some fashion repeatedly call `player.runFrame();`
- I should initialize the worker in audio.js.
- I now have `exportAudio` sending the rom to the worker:
- ```js
  myWorker.postMessage({"type": "rom", "rom": rom});
  ```
- Taking out the old song length stuff. for now I'll just run it for like, 20000 cycles or some shit
- So now, over in the worker, we need to send messages *back* to the main thread as we are running the rom and collecting samples.
- I'm removing this from exportAudio, because we don't want to do this here:
- ```js
  let cycleCount = 0;
  
  while (cycleCount < 2000) {
        runFrameSilent()
        const newBuffer = new Float32Array(audioBuffer.length + sampleBuffer.length);
        newBuffer.set(audioBuffer, 0);
        newBuffer.set(sampleBuffer, audioBuffer.length);
        audioBuffer = newBuffer;
        cycleCount++;
      }
  ```
- ok, so the rom is being successfully built, messaged and loaded by the worker cpu.
- Now to run it.
- Huh, so loadnsf calls `playSong` at the end. That initializes it.
- I have it running frames. Now we need to get the samples.
- What happens with the sample buffer?
- I guess we can put this in the worker.
- We run `getSamples`, and we need to message the buffer back.
- We need another kind of message to the emu thread, to tell it to run one frame.
- I don't know what to do. If I have it send 2000 messages, by the time they are finished the function has already errored for having an audio buffer length of 0.
- I need a better way of coordinating it.
- Well... let's skip ahead, because we know we're gonna need to monitor the program to know when we're done.
- Damn, now I'm thinking I should write a song counter instead.
- I just made a commit as a bookmark but unfortunately it seems that I broke sound playback. Urgh
- I want to implement the [[repl output window]]
- Well this thread got spun out, hahaha
- I should dive in and get the gist of what I was doing, and maybe bring stuff back into the main branch. I had the NES going on another thread and it worked fine.
- This is the worker:
- ```js
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
  
  ```
- This is also related to [[interpreter in web worker]]
- The bad news is... I fixed audio export, hahaha. So now I need to not break it.
- Using the worker, in audio.js:
- ```js
  // Set up web worker for emulator
  
  const myWorker = new Worker("src/worker.js");
  
  myWorker.onmessage = function(e) {
    console.log('received buffer length' + e.data.buffer.length)
    const offlineCtx = new OfflineAudioContext(1, e.data.buffer.length, actx.sampleRate)
    const abuf = offlineCtx.createBuffer(1, e.data.buffer.length, offlineCtx.sampleRate);
    const nowBuffering = abuf.getChannelData(0);
    for (let i = 0; i < abuf.length; i++) {
      nowBuffering[i] = e.data.buffer[i]
    }
    const source = new AudioBufferSourceNode(offlineCtx, {buffer: abuf});
    const biquadFilter = offlineCtx.createBiquadFilter();
    biquadFilter.type = "highpass";
    biquadFilter.frequency.setValueAtTime(37, offlineCtx.currentTime);
    source.connect(biquadFilter);
    biquadFilter.connect(offlineCtx.destination);
    source.start();
    offlineCtx.startRendering()
    offlineCtx.oncomplete = (ev) => buf_download(e.data.filename, ev.renderedBuffer);
  }
  
  export function exportAudio(filename, rom) {
    myWorker.postMessage({"type": "rom", "rom": rom, "filename": filename});
    setLoaded()  
  }
  ```