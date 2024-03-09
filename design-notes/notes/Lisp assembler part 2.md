- Alright, so we have some music data:
- ```clojure
  (def data [{:time 0 :length 0.5 :pitch 64}
        {:time 0.5 :length 0.5 :pitch 67}
        {:time 1 :length 0.5 :pitch 59}
        {:time 1.5 :length 0.5 :pitch 63}
   
        {:time 2 :length 0.5 :pitch 66}
        {:time 2.5 :length 0.5 :pitch 69}
        {:time 3 :length 0.5 :pitch 59}
        {:time 3.5 :length 0.5 :pitch 64}
   
        {:time 4 :length 0.5 :pitch 67}
        {:time 4.5 :length 0.5 :pitch 71}
        {:time 5 :length 0.25 :pitch 69}
        {:time 5.25 :length 0.25 :pitch 71}
        {:time 5.5 :length 0.5 :pitch 72}])
  ```
- We can currently render this as triangle notes and play it with `(play (tri-seq data))`.
- On the last page, we wrote a function that takes data of this form and outputs in the form expected by the NSF driver... except we need to change it so that *every* note is preceded by a duration. I think that way is simpler than repeating the range testing logic just to reduce bytes which are of no consequence here since it's all happening under the hood. Here was our function:
- ```js
  export function assembleStream(notes) {
      const sorted = notes.sort((a, b) => a.get("ʞtime") - b.get("ʞtime"))
      let stream = []
      let currentTime = 0
      let currentLength
      for (let i = 0; i < sorted.length; i++) {
          let t = sorted[i].get("ʞtime")
          let l = sorted[i].get("ʞlength")
          let noteLen = largestNote((t+l) - currentTime)
          // is there a rest before next note?
          if (currentTime < t) {
              stream.push(noteLen[1])
              stream.push(0x5e)
              currentTime = t + l
              currentLength = noteLen[0]
          } else {
              stream.push(noteLen[1])
              // Note A1 is our 0x00 which is MIDI number 33
              stream.push(sorted[i].get("ʞpitch") - 33)
              currentTime = t + l
              currentLength = noteLen[0]
          }
      }
      return stream
  }
  ```
- ok I also fixed it so that it outputs alternating length-notes:
- ```js
  [136, 31, 136, 34, 136, 26, 136, 30, 136, 33, 136, 36, 136, 
   26, 136, 31, 136, 34, 136, 38, 135, 36, 135, 38, 136, 39]
  ```
- So we need a function that will evaluate this sequence (from the editor) and store it as a variable, so when we run our NSF engine, we will pull values from this array and inject them into the running NSF
- I called it `noteStream` and it's in the audio module.
- This will be accessed by the CPU during the specific instructions that identify whether our byte is a pitch or a note length. Pretty much the only remaining questions are:
	- How do we know what channel?
	- How do we keep track of where we are in the sequence?
- So now I'm thinking that we actually need 4 note streams (5 once we get DMC implemented), analogous to the ones already used by the driver. So let's do that now.
- So the first question: How do we know what channel?
- This is in a variable called `stream_channel` in ram. But I don't think I can just check it (can I?), but I can do it similarly to the other thing, where the cpu watches for the instruction that writes to the stream channel variable, and changes it likewise in our code.
- Yeah, so this happens in the `@note` subroutine:
- ```z80
  @note:
  	;; Do Note stuff
  	sta sound_temp2
      lda stream_channel, x
      cmp #NOISE
      bne @not_noise
      jsr se_do_noise
      jmp @reset_ve
  ```
- The subroutine is actually much bigger than that but that's where the stream channel variable is read.
- Hmm, actually in `se_set_temp_ports`, which might make more sense!
- Yes, I think that *really* makes more sense, since that's actually where the `soft_apu_ports` are written to.
- Except that we need to coordinate it so that the stream channel is set first, and then the note, so that we take the note from the correct stream. And it seems that is here:
- ```z80
  @note:
  	;; Do Note stuff
  	sta sound_temp2
      lda stream_channel, x
      cmp #NOISE
      bne @not_noise
      jsr se_do_noise
      jmp @reset_ve
  @not_noise:
      lda sound_temp2
  	sty	sound_temp1	; Save our index into the data stream
  	clc
  	adc	stream_note_offset, x
  	asl	a
  	tay
  	lda	note_table, y
  	sta	stream_note_lo, x
  	lda	note_table+1, y
  	sta	stream_note_hi, x
  	ldy	sound_temp1	; Restore data stream index
  ```
- So I think we still needed the hacks I previously made in BPL and BCC, because that's how we know the moment when we are about to load either a pitch or a length.
- If a pitch, then we are sent to the code above.
- At this point, we could advance our counter... wait no, we need each stream to have its own counter
- Maybe I'll set a watch point on `lda stream_channel`.
- It is 189 545. And since the current stream number is the value of the `x` register, we need to set that.
- For the note length, we probably need to put a hook in `sta	stream_note_length, x`, where x is the current stream number.
- This is 157 612.
- Oh, wait... it's 611 the first time. What other values can it be? 613 or 614.
- Cool, I made a variable called `streamNum` which is set during the instruction that stores the note length:
- ```js
  function sta(adr) {
      // stores a to a memory location
      //log("STA " + r[A])
      if (adr === 611 || adr === 612 || adr === 613 || adr === 614) {
          log("Setting note length for stream " + r[X])
          streamNum = r[X]
      }
      write(adr, r[A]);
  }
  ```
- So that's the only time we need to update the `streamNum`, since a note length happens before every note.
- So it seems like we've gathered the info we need! Let's make a function that loads our stream arrays when given a data structure.
- Hmm... how do I want to do it anyway? I guess we have to have one for each channel, how else would it work, unless we wanted to change the API to include the channel in the note, kind of how it worked in mario paint...
- ok I made 4 functions for the lisp interpreter like this:
- ```js
  function sq1Stream(notes) {
      audio.setSq1Stream(audio.assembleStream(notes))
  }
  ```
- However... I'm not sure if I like how it works, because it's stateful. Because it has to be I guess...
- Ok so all that's really left is to make it consume the bytes in our streams
- So we have to figure out where we can have it swap the bytes
	- In the note length thing, for the note length
	- pitch bytes?
- ok then we need an index for each stream so we know where we are
- And when it's done playing, we have to somehow make it stop. Maybe after it's done it can just feed it rests... no, that's dumb, we need a shutoff signal
- Here's uh... our new stream-aware `sta` function:
- ```js
  function sta(adr) {
      // stores a to a memory location
      //log("STA " + r[A])
      if (adr === 611 || adr === 612 || adr === 613 || adr === 614) {
          log("Setting note length for stream " + r[X])
          streamNum = r[X]
          switch (streamNum) {
              case 0:
                  r[A] = sq1Stream[sq1Index]
                  sq1Index++
                  return;
              case 1:
                  r[A] = sq2Stream[sq2Index]
                  sq2Index++
                  return;
              case 2:
                  r[A] = triStream[triIndex]
                  triIndex++
                  return;
              case 3:
                  r[A] = noiseStream[noiseIndex]
                  noiseIndex++
                  return;
              default:
                  break;
          }
      }
      write(adr, r[A]);
  }
  ```
- So that just leaves the pitch data.
- I guess we could put that into sta as well, and have it look for `sta	stream_note_lo` and `sta	stream_note_hi`
- We have to deal with the noise channel differently though...
- huh, actually it might just work because the same thing gets called there
- 157 581 `sta	stream_note_lo, x`
- 157 587 `sta	stream_note_hi, x`
- I uh... just realized I don't really know how the notes are stored
- wait... that shouldn't matter. All we need to do is load the byte into... oh.
- we need to already have the note loaded into A before that!
- specifically at `lda	note_table, y` which conveniently, we can see is 185 33465
- then sq2 is 185 33441
- tri is 185 33465
- and noise is  173 514 which is `lda sound_temp2`:
- ```z80
  se_do_noise:
      lda sound_temp2     ;restore the note value
      and #%00010000      ;isolate bit4
      beq @mode0          ;if it's clear, Mode-0, so no conversion
  @mode1:
      lda sound_temp2     ;else Mode-1, restore the note value
      ora #%10000000      ;set bit 7 to set Mode-1
      sta sound_temp2
  @mode0:
      lda sound_temp2
      sta stream_note_lo, x   ;temporary port that gets copied to $400E
      rts
  ```
- I *think* that's right... yep, the note is in the A register...
- oh wait, I think I fucked up...
- the number called depends on the note... which is why sq1 and tri are both 185 33465 because they are both E4.
- I need a different way of detecting when to inject the value.
- How about when we're already detecting that the byte is a note? In BPL.
- At that point it's in the A register, so I think it should work!
- Here's the thing... it's the same as the one above
- ```js
  function bpl(adr) {
      if (adr === 38) {
          if (!n) {
              log("Byte is a note")
              switch (streamNum) {
                  case 0:
                      r[A] = sq1Stream[sq1Index]
                      sq1Index++
                      return;
                  case 1:
                      r[A] = sq2Stream[sq2Index]
                      sq2Index++
                      return;
                  case 2:
                      r[A] = triStream[triIndex]
                      triIndex++
                      return;
                  case 3:
                      r[A] = noiseStream[noiseIndex]
                      noiseIndex++
                      return;
                  default:
                      break;
              }
          }
      }
      // branches if N is 0
      doBranch(!n, adr);
  }
  ```
- So... it doesn't work, but am I the slightest bit surprised? Hell no...
- It makes noise... like, uh... a click. Take another look at this later after I sleep...
- ok, slept. Like a lot. So now it's time for
- ## NSF player debugging
- So I need to like... log what values we are producing in the streams, first of all. To see if we are even making coherent sound.
- Our functions should *return* the sequence, certainly
- Alright, that's done
- ```clojure
  (sq1-stream data)
  => 
  (136 31 136 34 136 26 136 30 136 33 136 36 136 26 136 31 136 34 136 38 135 36 135 38 136 39)
  ```
- Let's uh... convert these values back to hex and load it into a new NSF, with the other channels blank
- ...or... perhaps that's a lead as well. What happens when the sequence is blank?
- Because when the NSF is being played, it replaces the values of all channels. We really need to set it up so that by default it will use a rest note.
- Also... I'm thinking, ultimately, I do not want the swapping to be hidden inside the actual instructions. More sensibly it should be handled outside of that, and I don't think it would be much different. The logic would go inside `cycle` instead. I'm almost embarrassed for not thinking of that before.
- Wait a minute...
- Our note lengths:
- ```js
  const noteLengths = [
      [1.5, 0x8A],     // dotted whole
      [1, 0x85],       // whole
      [0.75, 0x89],    // dotted half
      [0.5, 0x84],     // half
      [0.375, 0x88],   // dotted quarter
      [0.25, 0x83],    // quarter
      [0.1875, 0x87],  // dotted eighth
      [0.125, 0x82],   // eighth
      [0.09375, 0x86], // dotted sixteenth
      [0.0625, 0x81],  // sixteenth
      [0.03125, 0x80]  // thirtysecond
  ]
  ```
- Oh I see, 136 is 0x88, so it's being interpreted as a dotted quarter (or dotted eighths at the end)
- That might be wrong actually, but wouldn't be causing it to fail, it would just play with wrong timing which doesn't matter because right now we're just trying to get sound.
- So what happens if the array is empty?
- Actually I just commented out the cases for streams 1-3 and it still messes it up, so something is clobbering something that I didn't intend. Let's handle this differently.
- Alright, I took it out because I shouldn't be putting additional logic in CPU instructions. No no no no no
- Let's try in `cycle` itself.
- ```js
  export function cycle() {
      if (cyclesLeft === 0) {
          // read the instruction byte and get the info
          let instr = read(br[PC]++);
          let mode = addressingModes[instr];
          cyclesLeft = cycles[instr];
          // test for wanting an interrupt
          if (nmiWanted || (irqWanted && !i)) {
              // we want a interrupt, so push a special instuction type in instr
              br[PC]--;
              if (nmiWanted) {
                  nmiWanted = false;
                  instr = 0x100; // NMI
              } else {
                  instr = 0x101; // IRQ
              }
              mode = IMP;
              cyclesLeft = 7;
          }
          // get the effective address, and execute the instruction
          let eff = getAdr(mode);
          // adr < $8000: set ram cdl, else set rom cdl
          if (eff < 0x8000) {
              setRamCdl(eff, 1)
          } else {
              setRomCdl(eff, 1)
          }
          if (instr === 32) {
              //log("jsr " + eff)
              if (eff === 32991) {
              }
          } else if (instr === 16) {
              if (eff === 38) {
                  if (r[A] < 0x80) {
                      if (r[X] === 0) {
                          r[A] = sq1Stream[sq1Index]
                          sq1Index++
                      }
                  } else if (r[A] < 0xA0) {
                      if (r[X] === 0) {
                          r[A] = sq1Stream[sq1Index]
                          sq1Index++
                      }
                  }
              }
          }
          //log(instr + " " + eff)
          functions[instr].call(null, eff, instr);
      }
      cyclesLeft--;
  }
  ```
- I got it! I just need to do the other channels, and have it use rests if there are no notes.
- rest = $5e
- I should break out this logic into a function called `handleNotes()`
- $84 == half
- It works, except that the noise is not being canceled so it's still making a note every measure.
- It's probably because the noise works different, so it's not actually being handled at all.
- No, it's working fine... it's just that apparently $5e doesn't silence the noise channel. This is a fault of the engine that I'll need to fix...
- ok, I just disabled the noise for now.
- alright, so I need to spend some time fixing my quantization because it's off.
- Not just the quantization.. this lead from Zelda ends up with a note that's waaay of, so far that it ends up being a rest, and makes no sense:
- ```clojure
  (def tempo 0.5)
  
  (defn zeldalead1 [time]
         [{:time (* (+ time 0) tempo) :length (* tempo 2.5) :pitch 70}
          {:time (* (+ time 2.5) tempo) :length (* tempo 0.5) :pitch 65}
          {:time (* (+ time 3) tempo) :length (* tempo 0.5) :pitch 65}
          {:time (* (+ time 3.5) tempo) :length (* tempo 0.5) :pitch 70}
          {:time (* (+ time 4) tempo) :length (* tempo 0.25) :pitch 68}
          {:time (* (+ time 4.25) tempo) :length (* tempo 0.25) :pitch 66}
          {:time (* (+ time 4.5) tempo) :length (* tempo 3) :pitch 68}
          
          {:time (* (+ time 8) tempo) :length (* tempo 2.5) :pitch 70}
          {:time (* (+ time 10.5) tempo) :length (* tempo 0.5) :pitch 66}
          {:time (* (+ time 11) tempo) :length (* tempo 0.5) :pitch 66}
          {:time (* (+ time 11.5) tempo) :length (* tempo 0.5) :pitch 70}
          {:time (* (+ time 12) tempo) :length (* tempo 0.25) :pitch 69}
          {:time (* (+ time 12.25) tempo) :length (* tempo 0.25) :pitch 67}
          {:time (* (+ time 12.5) tempo) :length (* tempo 3) :pitch 69}
          {:time (* (+ time 16) tempo) :length (* tempo 1) :pitch 49}
          {:time (* (+ time 20) tempo) :length (* tempo 1) :pitch 49}])
  
  (sq1-stream (zeldalead1 0))
  
  (play-nsf)
  ```
- Here's the part that doesn't make sense:
- ```clojure
  (sq1-stream (zeldalead1 0))
  => 
  (133 37 135 32 135 32 135 37 134 35 134 33 133 35 
   133 94 135 33 135 33 135 37 134 36 134 34 133 36 132 94 138 94) 
  ```
- Why are those pitches 94? wtf? I must be doing something really dumb.
- The note assembly thing is not overly complicated.
- oh. 94 is the rest note. It's just resting for too long or something. Needs work.
- Also, hate to say it, but we really need to figure out the [[web audio worklets]]. It chokes really bad, must be because we are reading and writing to the cpu as the NSF is playing...
- Fuck, I spent all day trying to do the worklet thing and I still have no idea how it's supposed to work. I'm going to table that for now and just deal with the shitty audio I guess. I have other things I want to work on, like the issue I'm having with rests.
- Besides... the audio output in the application is a separate thing from the audio output, which would be fun to implement and even more relevant for making demos.
- I'll make an issue though, so maybe someone can help me at some point.
- Cool, let's try fixing the note stream conversion function.
- I'm revisiting (or rather, learning better) the way we are doing note lengths, because what we really want is to quantize to the nearest *frame*, and not actually have note lengths at all.
- Why are 6 bytes reserved for note lengths? For that matter, why are there 6 bytes for basically everything in the engine?
- Apparently there are 6 streams. But why? This is a fundamental thing that I missed.
- Oh... the extra ones are for sound effects.
- ```z80
  MUSIC_SQ1 = $00 ;these are stream number constants
  MUSIC_SQ2 = $01 ;stream number is used to index into stream variables (see below)
  MUSIC_TRI = $02
  MUSIC_NOI = $03
  SFX_1     = $04
  SFX_2     = $05
  ```
- So we only need the first 4. But eventually we will add DPCM, and probably a VRC6 saw and squares at some point. But that's getting WAY ahead.
- It's almost as if I want to revert to a simpler version of the engine before they added note lengths, but keep the buffering. The reason they have separate tempo for each stream is so that they can set the music tempo independent of the sound effects.
- Anyway, I'll leave that because it's not causing a problem. But let me make a page for [[music engine note lengths]]