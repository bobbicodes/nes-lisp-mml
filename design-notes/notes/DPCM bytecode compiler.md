- I think including the strings will be the easiest way, because then it can be looked up and matched with the right sample address. This will be done tomorrow, because I'm falling asleep, lol
- I made a bigger track in famistudio to see how it manages the samples, and I'm seeing that they're all in the $E000 range. So it must switch banks to accomplish it, let's check that out. What are the registers? $5FF8 - F
- And bank 6 is the one that it keeps changing, which is `$E000-EFFF`!
- So my next question is... am I going to have to disable the bank switching during fetching for that? Because we could switch to the correct bank using the opcode, but it will then be clobbered when we fetch. Yeah, I think I'll have to do that.
- Alright, got that in there. And it still works! So now I know basically everything I need to do it.
- Bank switch opcode is $AC, followed by the bank number and the number to switch it to.
- Let's try it once to confirm it works.
- Uh... no actually it doesn't
- Yes, it does! I just had to adjust the loop position! Phew, I was freaking out there for a second!
- The last sample is at $D200 in the rom. I need to figure out what sample adr and bank that is.
- It looks like it's at F180 in the cpu in mesen. That's 0xc6! It works!
- So holy shit, I'm ready to go. Once I figure out the fucking addresses.
- This is what worked for samples at $C080, $D080 and $D200:
- ```
  [0xAC 7 0x0c
   0xA4 7 0xAB 0xc0 0x0f
   0x83 0 0
   0xAB 0x80 0x2f
   0x8c 0 0
   0xAC 7 0x0d
   0xAB 0xc6 0x3e
   0x8b 0 0
   0xAB 0xc6 0x3e
   0x8b 0 0
   0xAB 0xc6 0x3e
   0x8b 0 0
   0xAC 7 0x0c
   0xAB 0x80 0x44
   0x98 0 0 0 0
   0xA5 0x05 0xd0
   0xAB 0x80 0xbd
   0x97 0 0 0 0
   0xAB 0x80 0x2f]
  ```
- I imagine this will become something like this:
- ```clojure
  (concat (loop1 7
    ["kick" 3 "e-sus" 12 "e-mute" 11
     "e-mute" 11 "e-mute" 11 "e-sus" 16
     "r" 32]) ["e-sus" 46 "e-sus" 10])
  ```
- So let's break down what we've got here.
- First we switch bank 6 (or 7, according to the opcode argument) to $0C (`0xAC 7 0x0c`)
- It then plays the samples at 0xc0 and 0x80. These are correctly calculated by our function here:
- ```js
  function rom2sampleAdr(adr) {
    return (adr / 64) - 0x282
  }
  ```
- I don't know how it works but it does.
- Then the bank is switched to 0x0d, and then we can use sample address 0xc6
- This is calculated as  0x106 by our rom2sampleAdr function, which makes sense!
- We just need a reliable way of calculating it. 0x106 - 0xc6 is 0x40.
- I think it makes most sense to go by the rom sampleAddr, because it's the one used to calculate the actual file offsets,, so it's the first number that's known, starting with 0xc080, for the first one.
- 0xc080 - bank 0x0C - sampleAdr 0x80
- 0xd080 - bank 0x0C - sampleAdr 0xc0
- 0xe200 - bank 0x0D - sampleAdr 0xC6
- I guess the reason we know that the bank needs to be shifted is that otherwise, the sampleAdr for the third one would be 0x106, and it can't be that high. So we increase the bank by one, and subtract 0x40
- That's it! That's the algorithm!
- ## Now, where do we compute this
- We either need to calculate these positions when the samples are *loaded*, and calculate the above in our compiler in audio.ls, or we wait until the driver is assembled and do it all in nsf.js.
- I think I like the first one better, though I think either one is equally sound.
- I'm gonna take a fucking bath.
- ## Do it when the NSF is built, it's fine
- The only needed information is the order and their lengths, which is right there in the samples array.
- Ah, I just remembered that we need to do this in audio.js, but whatevs, it's the same thing. Just import the samples array. It's already imported, huh
- The `apu.getOutput()` is also called `samples`, but that's fine because it's a local scope in the `getSamples` function
- Here's the code that I wanted to write
- ```clojure
  (concat (loop1 7
    ["kick" 3 "e-sus" 12 "e-mute" 11
     "e-mute" 11 "e-mute" 11 "e-sus" 16
     "r" 32]) ["e-sus" 46 "e-sus" 10])
  ```
- This is concise, but not ideal because it isn't structured enough, requiring it to be parsed. Really it ought to be
- ```clojure
  (concat (loop1 7
    [{"kick" 3} {"e-sus" 12} {"e-mute" 11}
     {"e-mute" 11} {"e-mute" 11} {"e-sus" 16}
     {"r" 32}) [{"e-sus" 46} {"e-sus" 10}])
  ```
- To calculate length we're gonna need to figure it out by the sample rate I guess, because technically that would change it... a lot.
- How do we even...
- By what we have so far it looks like this
- 0x0f bytes = 0x83, or 3 frames
- It's divided by 5. Weird. A couple more to confirm:
- 0x2f is 0x8c, or 10 frames
- Actually, these aren't so accurate, nor need they be, because it's the rest value that actually matters. We can probably just set each length to 0xff for all we care.
- Remember that the loop1 function does `(concat [{:loop n}] notes [{:loop :end}])`
- So we'll be handling loops the same way.
- So... it seems we actually need to expand the maps, like this:
- ```clojure
  (concat (loop1 7
    [{:sample "kick" :length 3} {:sample "e-sus" :length 12}
     {:sample "e-mute" :length 11} {:sample "e-mute" :length 11}
     {:sample "e-mute" :length 11} {:sample "e-sus" :length 16}
     {:rest 32}) [{:sample "e-sus" :length 46} {:sample "e-sus" :length 10}])
  ```
- Ok, this is getting fun. If the note has a sample key, we first have to look it up, so that we know if we need to switch banks. I think this should be a separate function called `resolveSample`, or how about `sampleBank`, because it will take a sample name and return, well the bank *and* the address, so I guess resolve makes more sense
- This is gonna be a bit of a chunky function itself.
- We basically have to do the same calculation as we do in assembledriver, to align them
- ```js
    let sampleAdr = 0xc080
    for (let i = 0; i < samples.length; i++) {
      sampleSegment = sampleSegment.concat(Array.from(samples[i].bytes))
      sampleSegment = sampleSegment.concat(
        new Array(align64(sampleSegment.length) - sampleSegment.length).fill(0))
      console.log("Sample " + i + " at " + hex(sampleAdr) + " ( sampleAdr " + hex(rom2sampleAdr(sampleAdr)) + " )")
      sampleAdr += align64(sampleSegment.length)
    }
  ```
- This function doesn't care about the names - only the length and order.
- Hmm I guess I'll just have the function return the sample address, that should be enough
- Looks good
- ```js
  // take a sample name, and return its address in the ROM
  function resolveSample(name) {
    if (samples != undefined) {
      let bytecode = []
      const match = samples.filter(x => x.name == name)[0]
      // go through the samples array to find their lengths
      // to determine their sample addresses
      let sampleAdr = 0xc080 // we use the actual offset in the file
      for (let i = 0; i < samples.length; i++) {
        if (samples[i].name === name) {
          return sampleAdr
        }
        sampleAdr += align64(samples[i].length)
      }
    }
  }
  ```
- Ok, then we need another function that will return the bankswitch bytecode.
- We still need to figure this out a bit.
- Well actually, I kind of did already above, before I went to bed
- We need to switch banks in any case, because it might have already been switched.
- I made a branch and pushed what I have so far, because it's a good start
- Oh, this is an interesting issue
- The lisp interpreter thread doesn't have access to the samples array
- Wait... I'm doing this wrong
- I need the one in the Lisp worker to just message the thing back for it to be handled in the main thread
- we uh... don't actually need this, but I want to be able to test my compiler in the repl so I'm gonna do it
- blah... I don't know how to get it to the repl output
- ok, it's coming along! It's actually resolving the samples correctly.
- Now we need to add a rest of the specified length, after what we'll just use as 0xff for a length
- Got it mostly together, gave it a push, but it's not resolving the samples right
- Got it! Now just the loop isn't working...
- Now it is.
- There's just one issue with how it is now... I didn't realize that by having the sample length always 0xff, it means that if there are only rests after it, there's no way to actually  stop the full sample from playing, which is no good. So we have to actually calculate the sample length.
- Huh, everything is good, but then I just noticed that somehow I introduced a constant hiss in the noise channel
- It's definitely a driver thing, because the same code plays clean on the online version
- And it's baked into the NSF, as a constant noise floor at pitch 0
- And it *just* started doing it, it wasn't present in the last video I uploaded
- I guess I'll have to debug the new driver. Have to make new labels anyway...