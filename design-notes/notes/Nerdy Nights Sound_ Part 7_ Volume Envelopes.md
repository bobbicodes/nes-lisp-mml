- Thing is... I'm not sure if I even need envelopes for my engine. We need *volume*, and I think that's it... still, I guess I'll follow the tutorial to the end, then maybe simplify it later to fit my application.
- Oh cool, there's only 3 more lessons left, including this one!
- Volume envelopes are just sequences:
- ```z80
  se_ve_1:
      .byte $0F, $0E, $0D, $0C, $09, $05, $00
      .byte $FF
  se_ve_2:
      .byte $01, $01, $02, $02, $03, $03, $04, $04, $07, $07
      .byte $08, $08, $0A, $0A, $0C, $0C, $0D, $0D, $0E, $0E
      .byte $0F, $0F
      .byte $FF
  se_ve_3:
      .byte $0D, $0D, $0D, $0C, $0B, $00, $00, $00, $00, $00
      .byte $00, $00, $00, $00, $06, $06, $06, $05, $04, $00
      .byte $FF
  ```
- And a pointer table that holds the addresses of the envelopes
- ```z80
  volume_envelopes:
      .word se_ve_1, se_ve_2, se_ve_3
  ```
- Then an envelope is applied to a stream using a variable, and another to keep track of where we are
- ```z80
  stream_ve .rs 6         ;current volume envelope
  stream_ve_index .rs 6   ;current position within the volume envelope
  ```
- Just as an aside... I just noticed we already have an initial volume byte for each stream in the song header. But I'll still continue I guess.
- Actually you know what... this might actually be where I take it and run with it!
- There's still noise stuff to do... but there's a slight issue that the repo with the ca65 translation didn't do that part... fortunately it shouldn't be hard to add that part myself because it's likely the same.
- I'll put this in [[Nerdy Nights Sound: Part 10: Simple Drums]]
- Ok back to volume envelopes
- yeah, so we have a subroutine called se_set_stream_volume, which reads a value from the stream's volume envelope and advances a pointer. But what I want to do is get rid of the pointer, get rid of the volume envelope, and just have it write a value, like we do for the pitch or the number of ticks.
- Let's see if the volume envelope opcodes actually work by testing if I can change it by inserting the command into the data stream.... wait... no I can't because the functions like `triangle`... wait. maybe it would work
- `triangle` calls `triStream`
- ```js
  function triStream(notes) {
      audio.setTriStream(audio.assembleStream(notes))
      return audio.triStream
  }
  ```
- So all that does is call `assembleStream` on a sequence
- ```js
  export function assembleStream(notes) {
      let stream = []
      for (let i = 0; i < notes.length; i++) {
          let l = notes[i].get("ʞlength")
          // Our maximum length is 30 frames, so need to separate longer notes
          if (l > 30) {
              let n = Math.floor(l / 30)
              for (let j = 0; j < n; j++) {
                  stream.push(30 + 128)
                  // Note A1 is our 0x00 which is MIDI number 33
                  stream.push(notes[i].get("ʞpitch") - 33)
              }
              stream.push((l % 30) + 128)
              stream.push(notes[i].get("ʞpitch") - 33)
          } else {
              stream.push(l + 128)
              stream.push(notes[i].get("ʞpitch") - 33)
          }
      }
      return stream
  }
  ```
- so we need to modify this function to look for opcodes. Which we want to do anyway, because we want to stick `:volume x` into the note map anyway.
- The `se_op_change_ve` opcode subroutine takes one argument, the volume envelope to switch to.
- ```z80
  se_op_change_ve:
  	lda	(sound_ptr), y	; Read the argument
  	sta	stream_ve, x	; Store it in our volume envelope variable
  	lda	#$00
  	sta	stream_ve_index, x ; Reset envelope index to beginning
  	rts
  ```
- So I guess we just write `$A2` to the data stream followed by the number of the envelope
- Maybe I can modify this to just take a single value, and rip out the envelope thing entirely... yes, that's what we want.
- My goal is to remove `stream_ve_index`, but there's actually several places where it's used.
- I'll change `stream_ve` to `stream_vol`
- Also removing the `reset_ve` subroutine, so need to remove all refs to that
- same with `read_ve`
- It could possibly be simplified further by just modifying `stream_vol_duty`, which is what `set_vol` does:
- ```z80
  @set_vol:
  	sta	sound_temp2	; Save our new volume value
  
  	cpx	#TRIANGLE	; If not triangle channel, go ahead
  	bne	@squares
  	lda	sound_temp2	; Else if volume not zero, go ahead
  	bne	@squares
  	lda	#$80
  	bmi	@store_vol	; Else silence the channel with #$80
  @squares:
  	lda	stream_vol_duty, x ; Get current vol/duty settings
  	and	#$F0		   ; Zero out old volume
  	ora	sound_temp2	   ; OR our new volume in
  ```
- So I'm going to just delete the volume envelopes file
- This is going to take awhile to get working again, lol
- huh... it actually produced a valid nsf, with actual sound, how about that
- Saved a bunch of space, too
- Holy shit, it actually works! I was expecting that to be really annoying
- alright, but it did completely destroy the playback when I copied it into my application so time to debug that...
- Eh, no, something is messed up with the driver itself. Which is no surprise, the surprise was that it worked at all
- I might need to revert and try again.
- We can leave the envelope machinery in place for now, and just make each envelope a single value
- Ok I did that but now I want to return to the other one and try to figure it out
- I'm thinking of actually recording the computer reading the entire tutorial. Ok, it's going. I'm actually curious how long it will take... it is 8:15
- 9:30 - it's up to part 6, tempo, note lengths, buffering and rests.
- 10:22 - Stopped it at volume envelopes, part 7
- I'm going to get rid of the note table.
- huh... when I did that, it was 600 bytes longer! Why would that be?
- Hehe I put it all in one file and it works :) it's 721 lines
- I restored the drum track but then I remembered why I disabled it, because it doesn't seem to take rests like the others. But I think I know how to silence it now... I'll just turn the volume down all the way, can I do that?
- Yep! Works great! Now back to figuring out how to send volume change commands.
- Oh... hold up. I finally got volume changes working in the actual NSF to find that it didn't work in the app, and suddenly realized why.... we can't do that.  Nope. We can't just insert values into the stream because we feel like it, it's hardcoded for alternating lengths/pitches, remember? How fucking silly of me.
- If I disable envelopes entirely maybe I can write to the volume registers directly. That's probably a better way to do it anyway.
- I'm gonna sleep now!
- Ok I slept! What are we doing?
- ## Can we write to volume registers?
- We're already watching the emulation and breaking where we get to a note, so how would we...
- ...it's a register write. Wouldn't that be as simple as `write(0x4000, x)`?
- We might just need to change something to stop it from changing it back on us.
- ## There's also the issue of NSF export
- Elephant right here. And it casts a big shadow on the entire playback strategy which is why I bring it up now.
- We could figure out how to assemble an NSF with fixed addresses, so ideally the music data streams would go at the end. That would be amazing.
- I mean I could like... even put it at the end
- This page seems to explain how to do it: https://www.cc65.org/faq.php#ORG
- > ...you should not use the assembler (ca65) to place your code at a specific address. This is the job of the linker. Instead create a new segment containing your code, and use a linker config file to place this segment at the address you want. Here is an example that places some graphics data at a fixed address:
- ```z80
  .segment    "gfx"
  .incbin     "gfx-file"
  .code
  ```
- > In the linker config use something like
- ```
  MEMORY {
      	...
         	GFX:    start = $2000, size = $1000, type = ro, file = %O, fill = yes;
      	...
      }
  
      SEGMENTS {
      	...
      	gfx:    load = GFX, type = ro;
      	...
      }
  ```
- > You define a memory area at $2000 and tell the linker to place the segment with the name "gfx" into this area.
- I guess that solves it?
- We make a segment which includes the song header with the pointer table, so... I guess the most we would need to do is modify the pointer addresses because we still won't know where the actual data streams will be.
- But what if we made it so we did? Could we like, put each channel's data stream in a different bank? This might actually be what FamiStudio does
- This is exactly what jroweboy has been urging Persune to do with FamiTracker.. Just search NESDev Discord for "fixed addresses", lol
- here is the comment from FamiStudio's [NsfFile.cs](https://github.com/BleuBleu/FamiStudio/blob/8fdd492472080dfcad59aeeb3eb31d07eb1cd7d8/FamiStudio/Source/IO/NsfFile.cs#L11):
- ```
   // NSF memory layout (for 1-bank sized driver).
          //   - 8000-cfff: Song data
          //   - e000-efff: DPCM (if any)
          //   - f000-ffff: Engine code + song table + vectors.
          //     - f000: Song table of content.
          //     - f100: nsf_init
          //     - f160: nsf_play
          //     - f180: Driver code
          //     - f?00: Small DPCM or song data if it fits after driver code.
          //     - fffa: Vectors
          //
          // We have drivers that are 1, 2 and 3 bank large. 
          //   - 1 page : DPCM (if any) is in e000-efff and code is in f000-ffff (as above).
          //   - 2 page : DPCM (if any) is in d000-dfff and code is in e000-ffff.
          //   - 3 page : DPCM (if any) is in c000-cfff and code is in d000-ffff.
  ```
- So there we go. the song data goes from 8000-cfff
- WTF, Persune just left the server, dropped a note saying she senses she's not welcome anymore
- The posts are still there at least... including [Dn-FT Development Woes](https://discord.com/channels/352252932953079811/1203018231657398292)
- What if Forple has something to do with it? That would be my guess
- ## But I guess... huh. Back to register writes?
- I don't know. It's fun to see how far we could go with live injection. We were saying, can we do `write(0x4000, x)`?
- At the very least, it's a fun learning project. Quite exciting in fact!
- Since we can't issue opcode commands, we might as well rip the whole thing out of this implementation. And that will also minimize the chances of our volume writes being clobbered.
- Well... we do need the looping functionality.
- Let's see if we can just play all notes at a given volume, for starters.
- We need to not clobber the duty, so we do
- ```z80
  lda	stream_vol_duty, x ; Get current vol/duty settings
  and	#$F0		   ; Zero out old volume
  ora	sound_temp2	   ; OR our new volume in
  ```
- So we need to read the current value of $4000 (which we're already doing in the memory viewer)
- `apu.registers[0]` will return the last written value to $4000
- Yeah something is clobbering our volume change. Which honestly makes sense but let's try to stop it.
- I could do something silly like reject all writes in the cpu that aren't the value we want, lol
- But then what about init?