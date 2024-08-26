- So my biggest question is, do I need to do what I did with the NES emulator in [[decouple audio emulation from animation loop]], and include a new copy which defines a global object?
- I bet I could just make a global object that will contain an interpreter instance.
- Unrelated but on the github site, the function docs are not changing when the keyboard goes over.
- Oh, it's broken on the local one too, I must have just done that.
- Oh, derp. It happens inside cleareval, which is no longer running after every keystroke. I could fix it by changing it back. Done, and pushed to live app as well.
- Great, so returning to the interpreter. This is a big job. But it's the right way to do it. The UI will never lock up again!
- Getting distracted, made a branch for [[blistery art]]
- ok, back. Let's uh, do some tests...
- Yes, apparently they're called module workers
- ```
  const worker = new Worker('worker.js', {
    type: 'module'
  });
  ```
- So where does the transaction happen, anyway? In eval-region, we would be sending the document string to be evaluated via a message.
- ok so I've got... the worker running and eval region is sending the string to be evaluated.
- When I try to import read_str, it no longer gets the message...
- I might be ever so slowly inching towards progress.
- I have `tokenize` working.
- It will load like 250 lines of core.clj before shitting, and I'm still not even close to done porting.
- It's a problem with `defn`. The first one, without destructuring.
- The interesting part though, is... it actually kind of works. I'm sending the form to be evaluated to both interpreters, and getting the result back for a simple calculation. So this is very good news, it means the plumbing is there.
- omg, I think it works
- I just had to not try to print something I was logging
- Great! This is great. Now we need to have it message the eval result to the main thread and update the editor
- Wowww thhis is so cool. I can evaluate an expression that takes awhile to compute, and continue to move the cursor around and use the editor while it computes! Amazing!
- This now means that if we crash the page, you can still recover what you've got.
- Maade a commit on worker2 branch. Hooking up the pretty printer.
- Done. Now, it's just remaining stuff for side effecting things. Like we're performing calculations. But if we try to invoke `playNSF`, we get an error that resetEnvelopes is not defined.
- Probably time to rethink side effects in the first place.
- Actually I think this is just because we're pointing to the wrong audio.js. I should probably... hmm.
- The lisp evaluator should just message back our music data streams. In addition to the return value sent to the editor, it should send another message of a different type.
- So I guess we're gonna want to change this, in the worker
- ```js
  addEventListener('message', e => {
    postMessage(repp(e.data.string));
  });
  ```
- huh, it just occured to me that I could *append* the eval results. But that would be unwieldy for that tiny window
- Anyway, so then the thing that receives the message, in eval-region:
- ```js
  lispworker.onmessage = function(e) {
    updateEditor(outView, out_buffer + e.data, 0)
  }
  ```
- We will change both of these to use message types.
- So yes. We only want to update editor if it is a repl output value message
- ok so that opens up the possibility of other message types.
- `saveWav`, `playNSF` and `spitNSF` all require the 4 streams to be assembled. So this will be like a `streams` message.
- This is going to be so much cleaner I bet.
- Well actually... we might want to copy over assembleStream so it can use it, and then do whatever else. The assembly should happen on the eval thread, before it does whatever else to it afterwards
- We have to first reset the song length and the envelopes. This must happen before we can assemble the streams because while assembling the streams we add to the envelopes.
- The envelope function is not even being used. We just hacked it to get regular volumes back.
- Right? How does volume work?
- Yes, it changes envelopes.
- But I don't know if the custom envelope thing even works... I haven't been using it. Does it work? I think I tried it the other day and it didn't...
- oh, it seems that it does work.
- ```clojure
  (play
    [{:volume 5 :pitch 60 :length 15}
     {:envelope [7 3 7 3 7 3 7 3 7 3 7 3]}
     {:volume 17 :length 40 :pitch 62}
     {:pitch 63}]
    [][][])
  ```
- So the user defined envelopes start at 17, 16 is a preset drum hit thing.
- Alright, so that settles that. Good that it actually works, I should document it.
- But the focus here is on setting these envelopes through messages.
- I can uh
- skip this for now, until I get it working without envelopes
- First we have `audio.resetSongLength()`
- This is where the variable is reset, because we're about to assemble the streams.
- The function names also fail to print in the repl output, which might be a metadata issue or something
- There's the `s1` variable in nsf.js. It is defined to a default value and modified when envelopes are added.
- `assembleStream` needs to know this value when the stream is assembled. Why? Because of loop points.
- I just had an idea that perhaps the cleanest way to do it would be to only use the repl thread for assembling the music data. So it would message the streams back, and that's it.
- Hmmm, maybe it could actually be that simple. We don't assemble them, only pass it back to the main thread.
- ## I like this idea
- Yeah, this cleanly separates the application along the line between the editor with the music data and the driver. So I think I should lean into that separation.
- That means we need to... do nothing. I was going to say make it so that the streams returned by the repl are independent of specific pointer locations, but...
- We're not going to assemble the streams there. Only pass back the *Lisp data structure*, specifically the 4 arrays of maps. This is our bytecode before it is made location-aware.
- That will be nice and clean with the repl thread. Then if we find we still need threading in order to not block the UI then we'll make another one, but... We always see that the damn thing is assembled in like 3 ms, silly. We're golden.
- So the only message we need is *streams*.
- Wait so how do I post a message to the main thread from the interpreter's internal function? We need to be able to refer to `lispworker`. Maybe it will just work because it's in the worker context?
- Ah yes this works great!
- I made a PR. It's really good, actually. But I should wait to merge it until it's more working, it's getting closer but not done yet.
- ## wrapping up
- So, now that I've kicked the can down the road this feature is done. It's now up to the program what to do when it gets the message. Better call it a 'play' message, so we know to play it. Then we'll write analogous messages/functions for export nsf and wav.
- Play works!
- The mouse song has a timing issue, could be I broke something.
- Also, only one song can be played, and the audio shits. Wait, I just remembered something. Where do we `resetSongLength()`?
- Precisely, we need to
- ```js
  audio.resetSongLength()
  resetEnvelopes()
  ```
- Perhaps playNSF should be doing this anyway? Wait... it does. In that case I have no idea what the problem is.
- I need access to the repl env. In order to keep the ability to check the symbols for docs, I'm going to have to message over the env with each eval.
- This is giving me a datacloneerror. I guess you can't clone function objects? Whatever, we just need their names. What else?
- Shit, this is how we are able to access the vars metadata to display both their docstrings and arglists. This might be tricky to do now.
- But hmm, what would be causing the audio to shut down
- Huh, it had something to do with the animation loop.
- cool, I'll just leave that for now! Finally! A bit of progress.
- Need to get export working.
- Got it!
- And audio export. Great, I guess I can merge it.
-