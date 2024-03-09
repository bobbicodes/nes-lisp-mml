- I guess I'll start a new vite project, lol
- Indeed... it doesn't require the ppu at all! This is great! We do need the cpu and apu, however.
- It initializes a mapper object, which is in another file, passing it a few arguments. But I don't want to do that, obviously. So instead we'll have to go through and create or modify the variables within the object
- So, we need functions that modify the variables in the mapper module:
	- nsf, loadAdr, banking, initBanks
- It's... actually... working.
- Except for the DMC, annoyingly.
- I can't see anything obviously wrong, even while going through with the debugger. But I have the working app which I can run and report what should happen and compare.
- ### Problem: it makes a clicking sound instead of audio
- ## DPCM playback
- I think I've managed to sync them up by putting a breakpoint on the apu quarter frame. Now I'm somewhat mindlessly stepping through to see if something doesn't match.
- It seems that the DMCOutput is basically always 0.
- Same with dmcBytesLeft.
- Ok I set a breakpoint at when dmctimervalue is 0.
- DMC is set to silent when it should not be. Right... it *never* gets set to not silent.
- Oh wait... it does, I just had to get it at the right time.
- I think it's using the wrong read function
- OMG it works, that was the problem! Silly me was having it use the CPU read function when it was supposed to be the one for the nsf player when it was looking up the DMC value, causing it to always read 0!
- I think the only thing that *doesn't* work still is the pause button. Something about the dummy node
- In the stop function of the audio plumbing
- Weird... I fixed it, sort of. It doesn't error anymore, and it pauses... sort of. But when it resumes the audio is kind of fucked.
- It's probably because of this:
- ```js
  let that = this;
  ```
- Here's the whole function:
- ```js
  this.start = function() {
      if(this.hasAudio) {
  
        this.dummyNode = this.actx.createBufferSource();
        this.dummyNode.buffer = this.actx.createBuffer(1, 44100, 44100);
        this.dummyNode.loop = true;
  
        this.scriptNode = this.actx.createScriptProcessor(2048, 1, 1);
        let that = this;
        this.scriptNode.onaudioprocess = function(e) {
          that.process(e);
        }
  
        this.dummyNode.connect(this.scriptNode);
        this.scriptNode.connect(this.actx.destination);
        this.dummyNode.start();
  
      }
    }
  ```
- It's like... making a copy of the object or something
- Let's see if I switch it to what it was before, with the stupid object
- God dammit, it works. I guess it's necessary to have like, different *instances* of the audio handler
- I guess I should launch it? Might as well have a demo
- Done! Oh... I want to do the thing where it restricts the files to .nsf
- That's done. The original code has a feature where it automatically pauses if you switch tabs, because otherwise it fucking shits itself. I tried switching the behavior so that it just shuts off the visualizer, which might help a little? Which brings me to... how else could we make it run like not shit? Could we reduce the audio quality or something? Run it, uh... in a web worker? Eh, that might be stupid. I'm just thinking of how it could be pushed to the background if that's possible at all.
- It looks like possible answers are audio worklets and web assembly.
- https://github.com/Thysbelon/nsfplayer-wasm
- The script processor thing is deprecated anyway, so I should switch to an audio worklet anyway, which is the recommended new thing. But first I have to understand how the buffer works in the first place, and I can't even get the pause working in my own implementation. Let's make a fresh page for the [[audio buffer]]