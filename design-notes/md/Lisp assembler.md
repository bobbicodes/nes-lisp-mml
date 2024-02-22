- So... I don't really even have a clear problem statement here, I just:
	- Have an editor/Lisp interpreter - where music data is composed
	- Have an NSF driver - which converts music data to assembly
	- Have an NSF player - which executes the assembly to render audio
- Cool. This is clearer already. And as the page title accurately expresses, the missing link here is how to get the Lisp code - the *music data*, into a form that can be consumed by the NSF driver.
- Let's take a look at the target music data format:
- ```z80
  song0_tri:
      .byte half, E4, G4, B3, Eb4
      .byte Fs4, A4, B3, E4
      .byte G4, B4, quarter, A4, B4, half, C5
      .byte eighth, E4, Fs4, G4, A4, B3, C4, D4, Eb4, A3, E4, d_half, rest
      .byte loop
      .word song0_tri
  ```
- This is just the triangle part to the driver demo song. We'll want to show the Lisp code which will represent the part. But first, I think there's another elephant in the room:
- ## Are we forgetting something?
- The NSF player does not take assembly! It takes an assembled binary!
- So even when we make the Lisp assembler, we still need to assemble it! Right? Yeah. I think so. So basically, we need to write an assembler.
- So I guess we're still within the scope of the title, it's a Lisp assembler. But it seems there are 2 distinct phases that are needed. Compiling the music data, and assembling it into a finished NSF.
- This sure seems rather convoluted. We're bouncing between formats in such a roundabout way that it sort of begs some kind of short cut. Like couldn't we skip one of the steps by like... I don't even know. Maybe not. It was convoluted from the moment I decided to use real 6502 emulation, which is not strictly necessary to produce the desired audio, but once we are going that way, we're stuck with the whole package.
- ## How about if...
- We take the assembled NSF with the driver only, which will have the music data *patched in*. Otherwise, we're just needlessly compiling the same driver every time we play audio. And our assembler will need to be able to handle all the assembly used in the driver.
- This way, we would only need to figure out how to get our music data into *binary*, making the problem much smaller and the execution less redundant.
- It is trivial to figure out where the music data is in the assembled NSF. They're data streams, accessed by pointers in our song header.
- The header is at F452.
- ```
  F452               --------unidentified--------
  F452  00 00 00 00 00 00 00 00 .db $02 $01 $00 $FF $04 $00 $01 $00
  F45A  00 00 00 00 00 00 00 00 .db $B0 $06 $77 $84 $60 $01 $01 $01
  F462  00 00 00 00 00 00 00 00 .db $30 $00 $B0 $84 $60 $02 $01 $02
  F46A  00 00 00 00 00 00 00 00 .db $81 $06 $D4 $84 $60 $03 $01 $03
  F472  00 00 00 00 00 00 00 00 .db $1E $09 $F4 $84 $60 $84 $1F $83
  F47A  00 00 00 00 00 00 00 00 .db $22 $82 $21 $1F $86 $1E $1F $21
  F482  00 00 00 00 00 00 00 00 .db $8B $5E $84 $5E $21 $83 $24 $82
  F48A  00 00 00 00 00 00 00 00 .db $22 $21 $86 $1F $21 $22 $8B $5E
  F492  00 00 00 00 00 00 00 00 .db $84 $5E $22 $83 $26 $82 $24 $22
  F49A  00 00 00 00 00 00 00 00 .db $83 $24 $26 $27 $82 $26 $24 $26
  F4A2  00 00 00 00 00 00 00 00 .db $24 $22 $21 $1E $1F $21 $22 $21
  F4AA  00 00 00 00 00 00 00 00 .db $1F $89 $5E $A1 $77 $84 $83 $13
  F4B2  00 00 00 00 00 00 00 00 .db $1A $1A $1A $0E $15 $15 $15 $15
  F4BA  00 00 00 00 00 00 00 00 .db $18 $18 $18 $0E $13 $13 $13 $13
  F4C2  00 00 00 00 00 00 00 00 .db $1A $1A $1A $1A $18 $16 $15 $13
  F4CA  00 00 00 00 00 00 00 00 .db $1A $18 $15 $13 $13 $13 $13 $A1
  F4D2  00 00 00 00 00 00 00 00 .db $B0 $84 $84 $1F $22 $1A $1E $21
  F4DA  00 00 00 00 00 00 00 00 .db $24 $1A $1F $22 $26 $83 $24 $26
  F4E2  00 00 00 00 00 00 00 00 .db $84 $27 $82 $1F $21 $22 $24 $1A
  F4EA  00 00 00 00 00 00 00 00 .db $1B $1D $1E $18 $1F $89 $5E $A1
  F4F2  00 00 00 00 00 00 00 00 .db $D4 $84 $A4 $03 $84 $0D $07 $0D
  F4FA  00 00 00 00 00 00 00 00 .db $83 $07 $15 $A5 $F6 $84 $83 $0D
  F502  00 00 00 00 00 00 00 00 .db $0D $07 $07 $89 $05 $81 $12 $13
  F50A  00 00 00 00 00 00 00 00 .db $14 $15 $A1 $F4 $84 $FF $FF $FF
  F512  00 00 00 00 00 00 00 00 .db $FF $FF $FF $FF $FF $FF $FF $FF
  
  ```
- That's where the song header is... but then we need the individual pointers, so we can go to the addresses and get the streams...
- ## Or not...
- If we have a way of knowing when we're at the address that... oh god this is making my head spin. Instead of having it read the streams from the file, we feed it the data from the program.
- If we took this approach to the extreme, we would possibly eliminate the assembly entirely, and just manually write to the registers with our music data, replacing our NSF driver with internal logic.
- This falls apart when we consider that we'll want to be able to export the NSF anyway.
- I think we might actually have to detect when we need the data stream, pause execution and manually load in the input. Well not pause execution, but not read the stream from the file but from the data itself. I think this is making sense. Let me just keep repeating that...
- ## This is making sense
- We don't need an assembler! Well, we barely need one. Only to assemble the Lisp into instructions for the emulator.
- We know the addresses of the data streams, so we track the program counter and when we get to it, we say "Hey! Don't actually follow the pointer for the stream, we got it for you right here!"
- I think that makes sense...
- It's a lot clearer now what I need to do. And that is... the Lisp assembler, silly!
- But we're not going to compile the Lisp into assembly text... it will be whatever is expected by the code that is reading the song data stream.  So I guess we need to examine that.
- ## What is a data stream?
- A data stream is a sequence of bytes representing notes and note lengths.
- The consuming subroutine knows how to read them, so it can be presented however is convenient. Namely,
- Our Lisp compiler will output a byte representing a note length, followed by a byte representing the note.
- So here is our data again:
- ```z80
  song0_tri:
      .byte half, E4, G4, B3, Eb4
      .byte Fs4, A4, B3, E4
      .byte G4, B4, quarter, A4, B4, half, C5
      .byte eighth, E4, Fs4, G4, A4, B3, C4, D4, Eb4, A3, E4, d_half, rest
      .byte loop
      .word song0_tri
  ```
- Now, the Lisp code is organized by time, i.e. notes are not sequential, they are indexed, each with an on-time. Which means the first thing we do is sort them:
- ```clojure
  [{:time 0 :length 0.5 :pitch 64}
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
   {:time 5.5 :length 0.5 :pitch 72}]
  ```
- That's enough to get the idea.
- This is going to be in JavaScript, so using the tools available... it will take that and produce this:
- ```js
  [$10, $1f, $22, $1a, $1e, $21, $24, $1a, $1f,
   $22, $26, $08, $24, $26, $10, $27]
  ```
- Here we need our note length table:
- ```z80
  note_length_table:
  	.byte	$01		; 32nd note
  	.byte	$02		; 16th note
  	.byte	$04		; 8th note
  	.byte	$08		; Quarter note
  	.byte	$10		; Half note
  	.byte	$20		; Whole note
  
  	;; Dotted notes
  	.byte	$03		; Dotted 16th note
  	.byte	$06		; Dotted 8th note
  	.byte	$0c		; Dotted quarter note
  	.byte	$18		; Dotted half note
  	.byte	$30		; Dotted whole note?
  
  	;; Other
  	;; Modified quarter to fit after d_sixtength triplets
  	.byte	$07
  	.byte	$14		; 2 quarters plus an 8th
  	.byte	$0a
  ```
- As well as the note name table, which I won't include here.
- Alright! Time to implement it!
- I guess I'll put this in the audio.js module with the other emulation-like stuff
- So we have to get the keys of the Lisp hashmap in the usual fashion
- Got them sorted
- ```js
  export function assembleNotes(notes) {
      const sorted = notes.sort((a,b) => a.get("ʞtime") - b.get("ʞtime"))
      
  }
  ```
- ok, I spent way too long just creating the test data, lol. what are we doing again? hahaha
- I verified that it sorts the notes by time, which is great
- As we iterate, we'll keep track of:
	- Total time, so we know like, is there a rest
	- The current note length, so we can only include the changes
- That might be all we need
- Of course, now we need to port the note and note length conversion tables
- uh... I guess for now I'll use the numbers, as above, until I know more about what data it will be expecting, but the numbers make more sense to me.
- On each iteration, we check:
	- Is the start time of the next note after the current time?
		- If so, we need to add an appropriate rest. If there isn't a matching one we can undershoot it, then add increasingly smaller rests until it fits or we reach a "close enough" threshold
		- We'll have to have a quantization strategy anyhow... I suppose we'll round them to the nearest... frame, ultimately, but for now I'll just do 32nd notes because it's the smallest value in our engine
		- We uh... need to calculate lengths based on tempo, of course, like we always do, when it comes to quantization.
		- But in interest of trying to just complete this function, I will table *all* of this and just assume that the times are already quantized!
	- If not (i.e. if the current time is not less than the next start time),
		- Then we add the next note's length followed by its pitch to the data stream.
	- In either case, we then update the currentTime and currentLength variables.
- To convert pitch, we can just subtract 33, because A1 = 0x00 = MIDI 33
- Alright! I have no idea if it will work or even run, but here it is:
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
  
  // find largest note length that will fit without going over
  function largestNote(delta) {
      let l
      for (let i = noteLengths.length; i >= 0; i--) {
          if (delta > noteLengths[i][0]) {
              l = noteLengths[i]
          }
      }
      return l
  }
  
  export function assembleStream(notes) {
      const sorted = notes.sort((a, b) => a.get("ʞtime") - b.get("ʞtime"))
      let stream = []
      let currentTime = 0
      let currentLength
      for (let i = 0; i < sorted.length; i++) {
          // is there a rest before next note?
          if (currentTime < sorted[i].get("ʞtime")) {
              stream.push(largestNote(sorted[i].get("ʞtime") - currentTime)[1])
              stream.push(0x5e)
          } else {
              stream.push(largestNote(sorted[i].get("ʞlength"))[1])
              // Note A1 is our 0x00 which is MIDI number 33
              stream.push(sorted[i].get("ʞpitch") - 33)
          }
      }
      return sorted
  }
  ```
- Even if it works, it's obviously flawed, like if a note doesn't fit perfectly there will be a gap. But for a first cut, it's fine because we can just say you shouldn't have given data with invalid notes!
- And we may have gotten a data stream:
- ```
  [136, 31, 34, 26, 30, 33, 36, 26,
    31, 34, 38, 135, 36, 38, 136, 39]
  ```
- compared to
- ```
  [$10, $1f, $22, $1a, $1e, $21, $24, $1a, $1f,
   $22, $26, $08, $24, $26, $10, $27]
  ```
- oh, we forgot to only add the note length if it's different, hence the repetitions
- Updated it... now it might actually be correct
- ## Lisp to NSF playback pipeline
- So how's about... everything else? We need to connect the NSF player to the Lisp interpreter
- I need to have my NSF template hardcoded in there somewhere, or something.
- It seems to make sense to encode it as actual instructions, rather than an array of bytes like it would be in a file.
- What makes the song loop? I think it might be set up to do that... let me see if I can fix it
- it loops everything, actually, even if the tune doesn't loop.
- I'll figure that out later, I could like... have it play for the duration and then shut off or something
- ## What does an NSF do?
- Let's uh... track the execution of the NSF and see what we can learn, and see how we want to store it. It might be easiest just to store it as a big array but I want to explore other ideas.
- So yeah... let's hardcode it somehow.
- Lol, how is this my entire NSF driver
	- ![image.png](.../assets/image_1708231706768_0.png){:height 1510, :width 681}
- Cool, I made a function called `play-nsf` which when evaluated, just plays the driver demo.
- So that's the first step in connecting the editor to the NSF player
- We're running instruction 32, addressing mode 7 (absolute)
- We know that the stream pointer lookup is an indirect, so that might be something to watch for
- We're reading address 16377. Why? where did that come from? Oh, it must be where the program counter is or something
- Init sets it to 0x3ff0, which is 16368, so I guess we've run 15 steps by now.
- The value at the address is 9,  then we bit-or it with the next one shifted left 8:
- ```js
  case ABS: {
              // absolute
              let adr = read(br[PC]++);
              adr |= (read(br[PC]++) << 8);
              return adr;
  ```
- The effective address ends up being 32777.
- This is the JSR. I guess that's 32? So I guess this must be calling sound_play_frame.
- Unless we did that already, and now we're calling `se_silence`?
- I think I would have noticed if we passed it.
- So now we change the program counter to 32777, and push 16378 onto the stack.
- (Seems that it requires 2 writes, not sure why)
- ```js
  function jsr(adr) {
      // jump to subroutine
      let pushPc = (br[PC] - 1) & 0xffff;
      write(0x100 + r[SP]--, pushPc >> 8);
      write(0x100 + r[SP]--, pushPc & 0xff);
      br[PC] = adr;
  }
  ```
- ## Next cycle
- Instruction is another 32.
- eff == 32934
- next inst = 173 (LDA)
- eff = 512
- next inst = 208 (BNE), eff= 49
- Ok, so let's figure out where we are. We did `jsr	sound_play_frame` at the play_adr.
- ```z80
  sound_play_frame:
  	lda	sound_disable_flag
  	bne	@done		; If disable flag is set, dont' advance a frame
  
  	;; Silence all channels. se_set_apu will set volume later for all
  	;; channels that are enabled. The purpose of this subroutine call is
  	;; to silence all channels that aren't used by any streams
  	jsr	se_silence
  
  	ldx	#$00
  ```
- I guess that's it!
- Yep, we have another jsr(32) eff=32799
- inst=169 (LDA), mode=1, eff=32800
- inst=141 (STA), eff=517
- Yes, now we're doing this:
- ```z80
  se_silence:	
  	lda	#$30
  	sta	soft_apu_ports		; Set Square 1 volume to 0
  	sta	soft_apu_ports+4 	; Set Square 2 volumne to 0
  	sta	soft_apu_ports+12	; Set Noise volume to 0
  	lda	#$80
  	sta	soft_apu_ports+8 	; Silence Triangle
  	
  	rts
  ```
- So if I just keep going with this, I'll have exactly the instructions I'll need to catch in order to inject the data streams.
- I mean, I should be able to figure it out myself now. It's in the `sound_load` routine.
- Ok so I'm realizing how this will work, it's actually easier than I thought, because each stream is terminated with a byte that identifies it:
- ```z80
  song0_tri:
      .byte half, E4, G4, B3, Eb4
      .byte Fs4, A4, B3, E4
      .byte G4, B4, quarter, A4, B4, half, C5
      .byte eighth, E4, Fs4, G4, A4, B3, C4, D4, Eb4, A3, E4, d_half, rest
      .byte loop
      .word song0_tri
  ```
- That means the cpu will happily chug along and munch our data until we feed it the right byte!
- That changed at some point in the tutorial. Originally they were terminated with FF, but I guess the loop feature required something else. I should read about that some time. We might even want to switch back, because we won't be looping at this level in our case.
- Inst 141 (STA), eff 521
- Inst 141 (STA), eff 529
- inst 169 (LDA) eff 32811
- 141 (STA) 525
- 96 (RTS) 0
- ## ok we just silenced the channels
- We're now continuing with sound_play_frame going into the part that loops.
- 162 (LDX) 32943
- 189 (LDA) 539
- 41 (AND) 32948
- 240 (BEQ) 29
- 189 (LDA) 599
- 24 (CLC) 0
- 125 (ADC) 593      ; Add the tempo to the stream ticker total
- 157 (STA) 599 95
- 144 (BCC) 14  ; Carry clear = no tick
- 222 (DEC) 605  ; Else there is a tick. Decrement the note length counter
- BNE 9  ; If counter is non-zero, our note isn't finished playing yet
- 189 (LDA) 611  ;; Else our note is finished. Reload the note length counter
- 157 (STA) 605
- 32 (JSR) 32989  ;; se_fetch_byte
- 189 (LDA) 551
- Wait... did we load the sounds already? No way, that's impossible
- Oh shit... that happened during init.... I am ded
- Well then.... This has sure been fun
- # ok, resetting, back to init
- 32 (JSR) 32768 `sound_init`
- 32 (JSR) 32781
- 169 (LDA) 32782 ; ;; Enable Square 1, Square 2, Triangle and Noise channels
- 141 (STA) 16405
- 169 (LDA) 32787
- 141 (STA) 512    ;; ; Clear disable flag
- 169 (LDA) 32792  ; ;Initializing these to $FF ensures that
- 141 (STA) 515   ; the first notes of these
- 141 (STA) 516   ; songs isn't skipped.
- `se_silence`
- 169 (LDA) 32800
- 141 (STA) 517
- 141 521
- 141 529
- 169 32811
- 141 525
- 96 (RTS) 0
- (back to init_adr):
- ```z80
  init_adr:
  	jsr	sound_init
  	lda	#$00           ;;we are here
  	jsr	sound_load
  rts
  ```
- 169 32772
- 32 (JSR) 32827   ; sound_load (here we go!)
- ### `sound_load`
- 141 (STA) 513  ;  sound_temp1	; Save song number
- 10 (ASLA) 0  ; Multiply by 2. Index into a table of pointers.
- 168 (TAY) 0  ; transfers a to y
- 185 (LDA) 33607  ; `lda	song_headers, y`	; Setup the pointer to our song header
- 133 (STA) 0    ; sound_ptr
- 185 (LDA) 33608  ; `lda	song_headers+1, y`
- 133 (STA) 1    ; sound_ptr+1
- 160 (LDY) 32843
- 177 (LDA) 33893  ; `lda	(sound_ptr), y`	; Read the first byte: # streams
- 141 (STA) 514  ;;; Store in a temp variable. We will use this as a loop counter:
  id:: 65d26a60-2326-4d13-83cf-5429f0ed042c
- 200 (INY) 0         ; how many streams to read stream headers for
- `@loop:`
- 177 (LDA) 33894  ;`lda	(sound_ptr), y` 	; Stream number
- 170 (TAX)  ; ; Stream number acts as our variable index
- INY
- 177 (LDA) 33895  ;`lda	(sound_ptr), y` 	; Status byte. 1=enable, 0=disable
- 157 (STA) 539 ;; `sta	stream_status, x`
- 240 60 ;; `beq	@next_stream`  If status byte is 0, stream disable, so we are done
- INY
- 177 33896 `lda	(sound_ptr), y`  ; channel number
- 157 545 `sta	stream_channel, x`
- 200 INY
- 177 33897 `lda	(sound_ptr), y`	; Initial duty and volume settings
- 157 575 `sta	stream_vol_duty, x`
- 200 INY
- 177 33898 `lda	(sound_ptr), y`	; Initial envelope
- 157 563 `sta	stream_ve, x`
- 200 INY
- 177 33899 `lda	(sound_ptr), y` ;; Pointer to stream data. Little endian, so low byte first
- 157 551 `sta	stream_ptr_lo, x`
- 200 INY
- 177 33900 `lda	(sound_ptr), y`
- 157 557 `sta	stream_ptr_hi, x`
- 200 INY
- 177 33901 `lda	(sound_ptr), y`
- 157 593 `sta	stream_tempo, x`
- 169 32898 `lda	#$ff`
- 157 599 `sta	stream_ticker_total, x`
- 169 32903 `lda	#$01`
- 157 605 `sta	stream_note_length_counter, x`
- 157 611 `sta	stream_note_length, x`
- 169 32911 `lda	#$00`
- 157 569 `sta	stream_ve_index, x`
- 157 617 `sta	stream_loop1, x`
- 157 623 `sta	stream_note_offset, x`
- `@next_stream:`
- 200 INY
- 173 513 `lda	sound_temp1`	; Song number
- 157 533 `sta	stream_curr_sound, x`
- 206 514 `dec	sound_temp2`	; Our loop counter
- 208 -83 `bne	@loop`
- 177 33902 `lda	(sound_ptr), y` 	; Stream number (back up to @loop)
- That's it, that's the whole `sound_load` routine. Once we finish all the streams it hits the RTS
- ## Stream injection strategy
- I can't think of a reason why this wouldn't work to replace the sound-load routine along with any extraneous variables, like tempo.
- The first thing I thought of was to feed it one byte at a time, using the same instructions and just replacing the bytes, but...
- Why not just skip the entire routine?
- What does it do with the streams once they are loaded?
- It just sets the locations of the stream pointers. For each stream, we set:
	- stream_status, whether it is enabled
	- stream_channel, what channel number
	- stream_vol_duty, initial duty and volume settings
	- stream_ve, initial envelope
	- stream_ptr_lo, stream_ptr_hi
	- stream_tempo, The value to add to our ticker each frame
	- stream_ticker_total, Our running ticker total
	- stream_note_length_counter
	- stream_note_length
	- stream_ve_index, Current position within volume envelope
	- stream_loop1, Loop counter
	- stream_note_offset, For key changes
- All of these things will be set according to the evaluated song data. So I guess the sound_load routine will instead consist of storing all those values based on the current song data.
- ## Playing the streams
- Alright so that's *loading* the streams. We actually need to pay more attention to how we *play* them, because that will potentially have a greater impact on the overall strategy.
- That is, it might dictate whether we can just like... eh, let's just see.
- So... where are we? At a
- 170 (TAX)
- right, we're into the second `@loop:`
- Eh... I think I can avoid stepping through it all. I can just look at the code...
- Yeah I guess the simplest thing to do is to swap in values
- So, we have a ticker-total variable that decides whether we tick or not.
- ```z80
  ;; Add the tempo to the ticker total.  If there is an $FF -> 0
  ;; transition, there is a tick
  lda	stream_ticker_total, x
  	clc
  	adc	stream_tempo, x
  	sta	stream_ticker_total, x
  ```
- If the carry bit is clear there is no tick. If no tick, we are done with this stream.
- Otherwise there is a tick. Decrement the note length counter
- If counter is non-zero, our note isn't finished playing yet
- Else our note is finished. Reload the note length counter
- That's when we call `jsr se_fetch_byte`
- So, if the note is *not* finished, we `bne @set_buffer`
- ```z80
  @set_buffer:
  	;; Copy the current stream's sound data for the current from into our
  	;; temporary APU vars (soft_apu_ports)
  	jsr	se_set_temp_ports
  ```
- So let's go see what those do. This is the whole subroutine which copies a stream's sound data to the temporary APU variables. It expects the x register to be set to the stream number.
- ```z80
  se_set_temp_ports:
  	lda	stream_channel, x
  	;; Multiply by 4 so our index will point to the right set of registers
  	asl	a
  	asl	a
  	tay
  
  	;; Volume, using envelopes
  	jsr	se_set_stream_volume
  	
  	;; Sweep
  	lda	#$08
  	sta	soft_apu_ports+1, y
  	
  	;; Period lo
  	lda	stream_note_lo, x
  	sta	soft_apu_ports+2, y
  	
  	;; Period high
  	lda	stream_note_hi, x
  	sta	soft_apu_ports+3, y
  	
  	rts
  ```
- When that runs, `stream_note_lo` and `stream_note_hi` are set already. But we're interested in where they are set, or more accurately, where the stream data is read and copied to memory because there is where we should be able to change it. Maybe `se_fetch_byte`?
- That uses the current value of `stream_ptr_lo` and `stream_ptr_hi`
- So let's try sticking some logs in there, which will at least let us know when it is hitting the instructions we want, and from there we can figure out how to patch the values.
- We're still in the sound_load loop, specifically at the TAX. I want to click through until it hits the rts.
- Hey, I got to it! Ok, onward...
- ```z80
  96 (RTS)
  ```
- Oh... we're returning again. Oh, must be from the init. So now we're going to the actual play_adr.
- ```z80
  234 (NOP)
  ...
  
  ```
- So yeah we returned from the whole init part of the javascript NSF loader, and are now continuing with loading the rom, ok now we're running the cpu again
- Apparently playReturned is true, so we are setting the program counter to 0x3ff8 (16376)
- But I'm a little confused because we didn't return from play, we returned from init
- ```z80
  32 32777 ;; this must be jumping to play_adr
  32 32934 jsr sound_play_frame
  173 512 lda	sound_disable_flag
  208 49 bne	@done	; If disable flag is set, dont' advance a frame
  32 32799 jsr se_silence
  ```
- silencing channels
- I think I want to make it log every instruction so I could just step through and have it show what it is.
- That works great! Now I could put in some other things that will tell us when we jump to certain subroutines.
- Cool, that works great. And it forms the basis of how we'll be interacting with the cpu.
- se_fetch_byte:
- 189 551 lda	stream_ptr_lo, x
- 133 0   sta sound_ptr
- 189 557  lda stream_ptr_hi, x
- 133 1    sta	sound_ptr+1
- 160 33000 `ldy	#$00`
- `@fetch:`
- 177 33926  lda	(sound_ptr), y
- 16 38 bpl	@note		; If < `#$80`, it's a Note
- 201 33006  `cmp	#$A0`
- 144 12  bcc	@note_length	; Else if < `#$A0`, it's a Note Length
- ## ok so I think that's where we inject
- At fetch byte, that is
- Maybe every time we look up the stream pointer (`189 551`) - yep, precisely
- that's `stream_ptr_lo`. Then `stream_ptr_hi` is `189 557`. because they're 6 bytes!
- So we know how to tell when we're about to load the bytes. And the stream_ptr value tells us which one we want
- Wait, so how do the streams work?
	- What is stream_ptr?
	- What is sound_ptr?
- If it's a note, how do we know which channel it is?
- The first thing we read is a note length.
- ```z80
  @note_length:
  	;; Do Note Length stuff
  	and	#%01111111	; Chop off bit 7
  	sty	sound_temp1	; Save Y because we are about to destroy it
  	tay
  	lda	note_length_table, y ; Get the note length count value
  	sta	stream_note_length, x
  	sta	stream_note_length_counter, x
  	ldy	sound_temp1	; Restore Y
  	iny
  	jmp	@fetch		; Fetch another byte
  ```
- ok but that should be irrelevant because it will be handled the same.
- I just positively identified a note read as well. I'm doing this by putting hooks in the instructions:
- ```js
  function bpl(adr) {
      if (adr === 38) {
          if (!n) {
              log("Byte is a note")
          }
      }
      // branches if N is 0
      doBranch(!n, adr);
  }
  ```
- ```js
  function bcc(adr) {
      if (adr === 12) {
          if (!c) {
              log("Byte is a note length")
          } else {
              log("Byte is an opcode")
          }
      }
      // branches if C is 0
      doBranch(!c, adr);
  }
  ```
- So that's my brilliant solution. Instead of those logs, it will just load the accumulator with the appropriate byte.
- Well, except that we need to make it so we give it a note length every time. We could do this by cutting a new NSF that repeats the note length each time, that way it will work.
- I'm not sure I know enough about how the loops work to confidently say whether we could just have a short loop on each channel, and change the notes/lengths as we go. Are they read each time?
- I think so... otherwise it would have to store the entire loop somewhere, silly...
- ok I made a new NSF but now I need to figure out the addresses again because they're different!
- ok so jsr 32777
- jsr 32936
- 173 512
- 208 49
- jsr 32801 se_silence
- should be 32991 for se_fetch_byte
- 189 551
- 133 0
- 189 557
- Alright, got it updated.
- So, it's actually nearing the point where I should come up with some test data.
- Got it, it's the same data I used to test the compiler, waaay up at the top of this page. In fact... let's make a new one, and check this one in
- [[Lisp assembler part 2]]