- So the biggest low hanging fruit is probably vibrato. These eat up hundreds of bytes, often dozens per note.
- full lead (sq1) data is 2399 long.
- sq2, the arps, is 4067
- I'm kind of surprised. So it would actually make more sense to do arps first.
- ## Back to Nerdy Nights
- Arps are like envelopes, which we had at one point. With the main difference that they loop, which ought to be an option with envelopes anyway. So I guess, let's get a fresh driver building...
- I'm reading chapter 7 for volume envelopes, and then we need to go to looping.
- ## volume envelopes
- Here they're still using `$FF` for the terminator value.
- There are 2 variables for keeping track of the envelopes (1 per stream):
- ```z80
  stream_ve .rs 6         ;current volume envelope
  stream_ve_index .rs 6   ;current position within the volume envelope
  ```
- We just need to make it wrap around. I'm sure loop will cover that. We can check for `$FF` and if so go back to the beginning. Simple.
- So we will be adding... 6 more variables? We need to know the current arp, volume envelope, and duty sequences and indices.
- Binji was asking if I had any blog posts, because he was actually reading through my notes, yes, these notes. Which got me thinking I probably should. [[nes-lisp-mml blog series]]
- So then where the volume, pitch or duty value is set, calls to subroutines are instead placed which reads from the current position in the sequence.
- So this actually does seem pretty easy.
- Oh, ha it even sets the envelopes back to the beginning for new notes
- Fixed parameter levels can just be a single value in a sequence!
- I don't think we need to use what the nerdy nights tutorial calls "opcodes"
- Even more, we won't even have messages for changing volume or duty
- ## loops, loop points
- We want to use this, for all of them.
- This is kind of the first time I've really read this far in this tutorial... I kind of took part of it and ran with it
- I guess I should actually use the opcodes? Either that, or we need some other way of switching them.
- ** Volume Envelopes** and **Duty Cycles** both take a single argument
- Ah, it also has finite loops. That will cut down on so much repetition.
- So, lol we're basically down to using the driver just as it is at the end of the tutorial.
- There's also a transpose which is almost touching on arps. Arps could simply be a series of transpositions.
- That's it... then we have drums which are done already.
- Well, I suppose I might as well start picking this one apart...
- oh, but we need a story for vibrato. Can transpose be used that finely? Not as it is, it works by "note offset".
- hmm what if instead of treating arps as a sequence that needs to be stored and indexed, just think of it as a special case of looping
- So we're gonna want to remove the sfx stuff, and replace it with I guess duty envelopes. I think I like the idea of keeping pitches with pitches, and just using finite loops to express arps.
- I made a branch for this in nsf-sound-driver called arps-driver.
- So then we still don't need the note table! Pitches are still just period values! So I need to change that part too. And the tempo...
- The current driver still uses the extra sfx streams, hahaha
- I can't seem to find where it resets, like when it loops through the 6 bytes how does it know to stop at 6 so I can change it to 4
- If I just change them all to 4, it loses the sq2 channel for some reason.
- It seems this is controlled by the first byte of the song header, the number of streams. So why can't I change it?
- Yes, the loop counter is `sound_temp2`
- It still works if I change them to 5...
- It's specifically the `stream_status` one that needs to be 5. But why?
- I can't figure it out. It's read at some point. Where?
- I'll move on, but I'm also thinking there might be something else I'm missing. We'll have to see.
- So we can remove:
	- Tempo. Remember, ours uses no ticker and just does frames
	- Pitch. Use raw period values. Has to fetch 2 bytes.
- Alright let's get rid of the note table. I uh, need to replace notes with period values, how fun.
- It actually builds, and plays the first couple of notes and dies.
- omg it's like, working but all wrong. It actually sounds pretty funny. It only falls apart after the first loop.
- Got it! I think I'm pretty much done.
- Cool, now we get to do the joyous task of building the new driver in javascript. And it's like twice as long.
- We'll start with 8000, the load address. sound_load to be exact. I started a new branch called driver-optimizations.
- After load are a couple of mystery bytes, 59 83. Mesen just lists it as data. Don't remember that happening before.
- I kind of messed up by having so many envelopes and stuff, I have to sift through so much stuff...
- I've got all the chunks ported, but I don't know what everything is. And there was those 2 mystery bytes back towards the beginning.
- It's... data which is read in sound_load. It's the `song_headers`! Oh my god, of course. Excellent, Now I can figure out the rest.
- It's only 985 bytes without the music data!
- Ok gotta try to start labeling this stuff.
- I found the volume envelopes, and the music data which is fucking huge! There's not that much left.
- Ok it works if I paste the entire damn thing in, which means I need to check it all for mistakes.
- Got the driver assembled in the JavaScript! Now just to generate the music data.
- I'm not gonna get this done tonight, it's actually morning and I'm shot. But damn, I got a lot done today.
- ## Next day
- Night actually.... but just got up. So I got the driver assembled and working! But we still need to process the header and music streams. Not to mention create data for this new format in the `assembleStream` function.
- Oh hold up. Something must not be calculated right, because I can't change the length or the song crashes. This is gonna be a pain to track down where the mistake is.
- Oh.... it's because we need to also recalculate the stream pointer locations for the loop opcodes. It's still sending us back to the same location as before, silly. Cool, I figured it out already. But that means we have to figure out...
- ## loop points
- So, this is kind of breaking my brain a little bit, but... loop points, yo.
- Actually, there might be something else wrong, because I just got rid of *all* the loops and it's fucked
- I hope this doesn't have something to do with the mystery bytes we just called `data`...
- I kind of have to find out what they are.
- I'm going to assemble another driver with ca65 but try to simplify it.
- The song stops as soon as any of the streams are done. That's a bummer. Why wasn't it like that before?
- Oh, it's because the end song opcode is now `$A0`. Cool.
- Yes! My assembler is fine! Well, there's something funny happening when I extend one of the parts a bit more... yeah, now the drum track is stuck in a loop...
- I'll have it print the streams and their locations or something, to debug.
- These "data" blocks all seem to be addresses.
- ```js
  const data1 = [
  	// Offset 0x0000035C to 0x0000035D
  	0xF0, 0x82
  ];
  
  const data2 = [
  	// Offset 0x0000035E to 0x00000367
  	0xF8, 0x82, 0x0F, 0x83, 0x24, 0x83, 0x2C, 0x83, 0x37, 0x83
  ];
  
  const data3 = [
  	// Offset 0x00000368 to 0x00000369
  	0x3D, 0x83
  ];
  
  const data4 = [
  	// Offset 0x0000036A to 0x0000036D
  	0x43, 0x83, 0x49, 0x83
  ];
  
  // volume envelopes
  
  const data5 = [
  	// Offset 0x0000036E to 0x0000036F
  	0x4F, 0x83
  ];
  ```
- Ah, yes they're the pointers to the volume envelopes. It's a pointer table. Not a mystery, it's right there. There are 10 of them.
- Cool, got that taken care of.
- I think I need a function that will add the 2 bytes little endian. How do I even do that?
- I need like, the opposite of this:;
- ```js
  // convert number to little-endian word as 2-element array
  function fmtWord(n) {
    return [parseInt((n).toString(16).slice(2), 16),
            parseInt((n).toString(16).slice(0, 2), 16)];
  }
  ```
- Ah, it's just this:
- ```js
  function wordToNum(lo, hi) {
    return (hi << 8) + lo
  }
  ```
- Go me for figuring it out myself.
- So the new maximum note length is 0x99, or 153, so - 0x80 is only 25.
- I need some test data.
- Here is a bare bones song data assembly:
- ```js
  assembleDriver(
    [0x98, 0x01, 0x51, 0x01, 0x51, 0x01, 0x1C,
     0x90, 0x01, 0x2D, 0x01, 0x51,
     0x88, 0x01, 0x67, 0x01, 0x51, 0x01, 0x2D, 0xa0],
    [0x98, 0x02, 0xA6, 0x01, 0xC4, 0x01, 0xC4, 0x01,
  	0xC4, 0x03, 0x89, 0x02, 0x5C, 0x02, 0x5C, 0x02, 0x5C, 0x02, 0x5C, 0x01,
  	0xFB, 0xa0],
    [0x98, 0x01, 0x51, 0x01, 0x1C, 0x01, 0xC4, 0x01, 0x67, 0x01, 0x2D, 0x00,
  	0xFD, 0x01, 0xC4, 0x01, 0x51, 0x01, 0x1C, 0x00, 0xE2, 0xa0],
    [0x98, 0x0D, 0x03, 0x0D, 0x03, 0x0D, 0x03, 0x0D, 0x03, 0x0D, 0x03, 0xa0]
  )
  ```
- This would be like...
- ```clojure
  (play [{:length 20 :pitch 60} {:pitch 67} 
   {:length 20 :pitch 65} {:length 20 :pitch 67}
   {:length 10 :pitch 68} {:pitch 67} {:pitch 65} 
   {:pitch 67} {:length 20 :pitch 60}]
  [{:length 20 :pitch 60} {:pitch 67} 
   {:length 20 :pitch 65} {:length 20 :pitch 67}
   {:length 10 :pitch 68} {:pitch 67} {:pitch 65} 
   {:pitch 67} {:length 20 :pitch 60}]
    [{:length 20 :pitch 60} {:pitch 67} 
   {:length 20 :pitch 65} {:length 20 :pitch 67}
   {:length 10 :pitch 68} {:pitch 67} {:pitch 65} 
   {:pitch 67} {:length 20 :pitch 60}]
    [{:length 20 :pitch 0} {:pitch 1} 
   {:length 20 :pitch 2} {:length 20 :pitch 3}
   {:length 10 :pitch 4} {:pitch 5} {:pitch 6} 
   {:pitch 7} {:length 20 :pitch 8}])
  ```
- It's not the same at all... but it works. I just had to get rid of the volume commands because they are now handled by envelopes. Which is gonna be a party and a half.
- When we calculate the addresses of the note streams, we have to offset it by the length of the total volume envelopes.
- This assembler function is going to have to be upgraded. I don't even know exactly how but it's gonna require some ingenuity.
- The way duty is handled now is by opcodes, which means we're still gonna have to spam them, unfortunately. Oh wait... It will still be fine because loops! All commands inside the loops get looped too, silly! But... ugh... loops. Get ready. Strap in for this one...
- The big thing here is that a loop needs to refer to an address. Which means at the time a loop command is created, it needs to know its current place in the stream. I guess this isn't that bad...
- Ok what are the damn opcodes.... let's figure this out.
- ## infinite_loop = `$A1`
- So if we use this one, it's given an address to go back to and we like, loop the entire song or whatever. We might use it occasionally, but it's the counted loop one that will be used all the time.
- ## Counted loop = `$A5`
- This one goes until the loop counter is 0. We set the loop counter with `$A4`.
- This section uses both of them:
- ```z80
  song0_noise:
      .byte set_loop1_counter, 3
  @loop_point:
      .byte $98, $0D, $07, $0D
      .byte $86, $07, $15
      .byte loop1
      .word @loop_point
      .byte $86, $0D, $0D, $07, $07
      .byte $95, $05
      .byte $84, $12, $13, $14, $15
      .byte loop
      .word song0_noise
  ```
- So `assembleStream` is going to need to know *which* stream it is currently building, so it can take its start address to calculate the loop points.
- When it repeats notes for length beyond 25, it will need to switch to a single value envelope.
- So this means we need to keep track of the last used envelope, as well as the last written volume.
- Uh, what? Let's think here... most envelopes are less than 25 frames, but say one is 40 frames.
- It needs to play the first 25 frames, then reset to a different envelope that has the first 25 frames dropped.
- Well let's move forward and try making a loop on the sq1 channel.
- We're gonna need a variable to track which one we're on.
- ```js
  let currentStream = 0
  ```
- lol, ok. Actually let's not do it that way. We'll make a parameter. This will also I think get rid of assemblenoise because it will become another case of assemblestream.
- maybe we just need like a program counter? It doesn't matter which stream we're in, does it?
- ## New day
- So I'm playing with this and see that we need to change envelopes. We're gonna need a function for building the envelope sequences *and* their header. And probably one for changing them. So like a whole envelopes section.
- ### Envelopes
- The part of the driver with the envelope sequences and pointer table need to be computed first, because the subsequent addresses are dependent on their size.
- This isn't bad, because the amount of code that comes *after* the envelopes is very minimal. Literally just the part we have to change anyway.
- So... we need to define a volume envelope. Let's first remove all of them we're not using, and that will both simplify things and get us warmed up for manipulating the data.
- We're using:
	- ve_battlekid_1b - `$06`               (on sq1 and tri)
	- ve_short_staccato - `$00`
	- ve_drum_decay - `$09`
- Fortunately they're terminated with 0xff. Here's the 3:
- ```js
  const volumeEnvelopes = [
  	// Offset 0x00000370 to 0x000003D8
  	0x0F, 0x0E, 0x0D, 0x0C, 0x09, 0x05, 0x00, 0xFF,
      0x0F, 0x0E, 0x0C, 0x0A, 0x09, 0xFF,
      0x0E, 0x09, 0x08, 0x06, 0x04, 0x03, 0x02, 0x01, 0x00, 0xFF
  ];
  ```
- Now, here are the old pointers:
- ```js
  const vePointers = [0xF0, 0x82, 0xF8, 0x82, 0x0F, 0x83, 0x24, 0x83,
    0x2C, 0x83, 0x37, 0x83, 0x3D, 0x83, 0x43, 0x83, 0x49, 0x83, 0x4F, 0x83]
  ```
- So the first one is at 0x0E0F, or 3599.
- So let's make a function that will split an array on a value.
- Wait no... it's the other way.
- We're going to need a single-value envelope for each level used. To start, we'll just have one that's full volume. No... I'll make it 6 for the squares, hahaha
- Going to make a new ca65 build to see what changes I guess
- Cool! Got a nice fresh one. The new volume envelopes:
- ```js
  const data = [
  	// Offset 0x00000362 to 0x0000036F
  	0x07, 0xFF, 0x0F, 0xFF, 0x0E, 0x09, 0x08, 0x06, 0x04, 0x03, 0x02, 0x01,
  	0x00, 0xFF
  ];
  ```
- The weird part is... the offsets are different. I guess it could be that there are fewer pointers, yeah
- That's the funny part... the data in the volume envelope pointers depends on... the length of itself! In other words how many volume envelopes there are.
- The last opcode, transpose, ends at byte 0x35C. In the file. But the one we use is the CPU address, which is `$82DB`. Or 33499. So the first pointer is at `$82DC` and `$82DD`. Since there are 3 envelopes, it takes up 6 bytes, so the first pointer is `$82E2`:
- ```js
  const data = [
  	// Offset 0x0000035C to 0x00000361
  	0xE2, 0x82, 0xE4, 0x82, 0xE6, 0x82
  ];
  ```
- So now, instead of hardcoding this it will be a function.
- Our 3 default envelopes:
- ```js
  const defaultEnvelopes = [
    [0x07, 0xFF],
    [0x0F, 0xFF],
    [0x0E, 0x09, 0x08, 0x06, 0x04, 0x03, 0x02, 0x01, 0x00, 0xFF]
  ]
  ```
- So we take 0x82DC and add the length of each sequence. Then we pass the value to `fmtWord`.
- I got `[ "220,1306", "224,1306", "228,1306" ]`
- Wait, why are they strings? Oh, because I'm silly.
- `[ 226, 130, 228, 130, 230, 130 ]`
- And that is correct!
- Ok, so I think I've got that part, but then I need to adjust the stream pointers!
- Our magic number 0x8376 is no longer valid.
- I can look and see what it is now...
- songHeaderAddr is now 0x82f0
- This is our code end point, 82db, plus the envelopes and pointers.
- 0x82dc + volumeEnvelopes.length + vePointers.length = 33520
- So that's the songHeaderAdr, then to get sq1 stream pointer, we add the length of the song header which is 29.
- ## loops
- So now I'm turning back to audio.js, where we have `assembleStream`. We need to have it look for a `loop` key which will mark our loop point. Initialize our start point to `s1`, which is songHeaderAdr + 29.
- So I guess I'm deciding to have assembleStream take a parameter for which stream we are assembling. Seems the cleanest way.
- So I'll create an API for loops, but then the other effects will have to rewrite the data stream to use loops, I'm thinking of arps now. But loops first.
- We need to start with looping the sq1 stream, since this all has to happen in order.
- When we set the loop counter, it will implicitly create a loop point. Then we need to mark the loop end. Something like this:
- ```clojure
  [{:loop 3}
   {:length 20 :pitch 72} {:pitch 70} 
   {:pitch 68} {:pitch 67} 
   {:loop :end}
   {:length 10 :pitch 65} {:pitch 67}
   {:pitch 68} {:pitch 70} {:length 20 :pitch 67}]
  ```
- The `:end` keyword word works like a repeat sign.
- It will look for loops first, because any other commands need to go inside the loop.
  id:: 65f8d772-ed7d-471d-a914-6e616af04f58
- First we check if it's `:end`. If so, we push 0xA5 followed by the address of the loop start.
- We can just count the length of the `stream` array! And add it to the stream start address.
- But the address to loop to will be set by the previous loop command.
- Set loop counter opcode is `$A4`.
- The loop is working, but it doesn't stop looping. This is a weird puzzle.
- Got it! For the sq1 channel, anyway. Wow!
- How do we do the other channels? I think we need to keep track of the stream lengths, on the javascript side, i.e. the audio.js side.
- We'll initialize a `streams` array
- ```js
  let streams = []
  ```
- And we will fill it as we ego.
- Oh my god it works. Now just to do the noise channel.
- Alright, that's a wrap!
- I'm curious now about using it for vibrato. Let's play around with it.
- Works great! I just don't want to think about what will happen if you try to do vibrato and arps at the same time. They can't be nested because there's only one loop variable.
- I'm fucking tired... got a ton of work done today!
- Time for a new page because this one's beat. We'll call it [[more driver upgrades]]