- How to even????
- Ok, so I'll obviously need to add 3 more data streams. I could do that and work backward I guess
- How do I even know what to write? Hmm, I guess I could make a simple nsf in famistudio to reverse-engineer. It doesn't really matter what the period calculation is, because I'll figure that out later. I'll just start with the lowest note and go up in semitones, that way I'll be able to calculate it.
- I mean.. it will basically work exactly the same, this isn't even a question. We have periods and lengths, that's what notes are. We will just have to figure out the extra duties, and count a 12-bit value if it's a vrc6  stream.
- Looks like our first writes to $B001 (low) and $B002 (high) are [06, 01], followed by...
- uh, this seems like it would be easier to just play it in famistudio while recording the register viewer.
- Actually, I don't even need to record it, I can just play a note and look, lol
- C0 =   $44, $8F ($B000 is $1E)
- C#0 = $69, $8E
- D0 =   $9A, $8D
- ok, that's enough to get me started
- Alright, got the new streams added. However, nothing will play if I increase the stream count, probably because it's only set up to handle 5. But it's a start, and it still works fine otherwise.
- soft_apu_ports, currently at 16. Need to increase to 25, or 3 x 3 channels
- And increase *all* the ram variables from 5 to 8.
- It's gonna be weird with the soft apu ports, because
	- There aren't any for the DMC, it's like a "pseudo stream" that only fires opcodes
	  logseq.order-list-type:: number
	- Streams 6-8 only have 3 ports. This is gonna make the math funny because I think it indexes by multiplying by 4 or something.
	  logseq.order-list-type:: number
- Huh, off topic but I just realized that I could simply use the transpose opcode for arps, lol
- hmm, now if I put the stream count up to 8 the first square doesn't play, and then it actually crashes
- I think there's other places I have to change the number
- Oh yeah, the banking table
- Still crashing, now I'll have to do a hardcore debug sesh
- ## Hardcore debug sesh
  collapsed:: true
	- Sound init. Here it enables the Square 1, Square 2, Triangle and Noise channels. Do we have to do this to the others as well? I guess we could check the famistudio driver to see, though it's a bit of a rabbit hole... and right now we're not even trying to get the vrc6 working yet, we're trying to see why the square doesn't work and it crashes so let's continue.
	- Added to the silence routine to write 0 to the 3 channels.
	- hmm, maybe we need to have soft ports for the dmc anyway, because math. Though, if the streams are disabled, idk why it would even need it
	- play frame: for some reason, stream 0 status is... $95? yeah that seems like our bug right there.
	- It still plays the stream, because $95 AND $01 is $01, but the big question is how on earth it got that value in the first place.
	- It happens in the sound load loop for stream 0. Well, that's where it gets written to stream status. But the $95 comes from the sound_ptr
	- Apparently our song header is at $843A.
	- ok loading sound for stream 0.
	- we load the $01 for channel enabled, and write it to the stream status byte
	- Set up Pointer to stream data - $8473
	- on to stream 1, 2, 3, 4, then 5-7 are disabled.
	- wait, what... it just went back to load stream 5 again, and then went back to 0! Whyy?
	- And that's where it goes haywire, and we get the mysterious $95.
	- I need to break down what's happening here better.
		- The only input to the routine is A, the song number, which is always 0.
		- We load 0 into y and get the stream count, the first byte of the song header.
		- then we inc y to 1, and begin the sound load loop.
		- sound pointer + 1 (y) is the first stream number, which is 0.
		- We transfer the 0 to X, which becomes our stream number index.
		- inc y to 2, which reads the status byte.
		- We store the status, and if it is 0, we jump to next stream which increments y, decrements the loop counter, and goes to the next load loop.
		- otherwise, if the stream is enabled, we inc y again to read the channel number.
		- inc y to read Initial duty and volume settings
		- inc y to read envelope
		- inc y to get pointer to stream data, lo then hi
		- the rest is unremarkable, just sets note length counter, note length, ve and loop indexes
	- So. After the first loop for stream 0, y is at 8. So starting from that index in the header, we get:
		- next stream: 1.
		- status: 1.
		- channel: 1
	- Then y is up to $0F.
		- stream: 2. status: 1. channel: 2
	- y: 16. stream: 3. status: 1. channel: 3
	- y: $1D. stream: 4. status: 1. channel: 4
	- Ok, here's where it's about to mess up.
	- y: $24. stream: 5. status: 0. So we go to the next stream.
	- y: $26. stream: 5. That is wrong!
	- I don't get how this is supposed to work. It seems totally wrong. When a stream is disabled, it should increase y the correct number of times to get the pointer to the next one. But it doesn't!
	- I don't understand why they wouldn't have tested this with disabled streams. But it seems we need another label called skip_stream, which does something like iny iny iny iny or whatever, then jumps to next_stream.
	- Instead of the pointer being at $26 where it is, it should go to $2B. So it needs to iny 4 times, and then the iny at next_stream should bring it to the right place.
	- ok, let's see how this works...
	- ok so we're doing stream 5.
	- y= $24. status: 0. we go to skip stream, that bumps y to $29.
	- I think I need to add 1 more.
	- It works! omg wtf
- Alright, so what was I doing?
- I'm silightly concerned about the soft_apu_ports, and whether we are going to be indexing them properly. Let's first take a look at how it works.
- It looks like it's doing volume, sweep, freq lo, freq hi, even though triangle has no sweep
- And yeah, it finds the right set of registers by multiplying the stream number by 4, so for this to still work, we need to expand them to both include dmc, and 4 slots for each of the vrc6 channels. It's fine, that just brings the block up to 32 bytes.
- cool, so that makes it much simpler! We probably just need to handle it in set_apu to write to the correct actual registers, and... it might work?
- Yes, we only need to add them.
- ok, so soft_apu_ports+15 is $400f, so soft_apu_ports+16 is $9000
- hold on, I'm not sure if the values in the registers match up
- The first one is volume, then sweep, freq lo, freq hi.
- So 9000 is volume, then we skip sweep, like with the triangle. ok.
- wait.. need to skip the dmc ones
- ok. I committed that because it was a decent step. I enabled the 3 new streams, but it causes it to... not crash, but stop playing
- the way that it stores the volume (and period?) is going to be different, but first I need to see what's going wrong
- Huhh, it's only loading 6 streams before it starts playing , why?
- ## loading stream 7
- status: 1. channel: 7. vol/duty: 0. ve: 0. stream_ptr: $84FE.
- Wait. It loads 7. Which is indeed the last one! Hahaha, everything is fine so far.
- ok up to play frame.
- wait... somehow we're back up to sound load, how'd that happen?
- Ok now we're setting the temp ports.
- I think this should be fine?
- First, we set the volume.
- This has different paths for triangle and square, which have their volume set differently. The triangle obviously has no volume, but we silence it with `lda #$80` if it's 0.
- The square's volume is done by taking the old vol_duty, ANDing it with `#$F0` to zero out just the volume, and ORing in the new volume level. That works because the APU pulse volume is bits 0-3. And so is the VRC6!
- The saw, on the other hand, is bits 0-5. S we'll need to handle that.
- I'm getting lost in this logic.
- ## set_vol logic
- `cpx	#TRIANGLE` - first we check if it is triangle
- `bne	@squares` if not, we go to squares. But we need to change this now, because it might be a saw.
- For saw volume, we should AND the value with $3F
- I'm still confused by this logic. Here it is, I'm done but not so confident:
- ```z80
  @set_vol:
  	sta	sound_temp2	; Save our new volume value
      cpx #VRC6SAW
      beq @saw
  	cpx	#TRIANGLE	; If not triangle channel, go ahead
  	bne	@squares
  	lda	sound_temp2	; Else if volume not zero, go ahead
  	bne	@squares
  	lda	#$80
  	bmi	@store_vol	; Else silence the channel with #$80
  @saw:
      lda	sound_temp2
      and #3F
      jmp @store_vol
  @squares:
  	lda	stream_vol_duty, x ; Get current vol/duty settings
  	and	#$F0		   ; Zero out old volume
  	ora	sound_temp2	   ; OR our new volume in
  
  @store_vol:
  	ldy	sound_temp1	; Get the index into soft_apu_ports
  	sta	soft_apu_ports, y ; Store the volume in our temp port
  	inc	stream_ve_index, x ; Move volume envelope index to next position
  ```
- The part I did makes sense, lol. The other part, well it worked before so I guess it's fine?
- ## Fetch byte - stream 1
- it's $9A, a note length, then $01, pitch high, $13, pitch lo.
- play frame - stream 2
- play frame - stream 3 - noise, this one is blank, just end stream
- same with 4, dmc. now 5... this... is not where it screws up, I don't think. It played a few notes first, curiously.
- we have a note length of 9A.
- oh... I see the problem. The VRC6 notes are in a value that gets picked up as a length!
- It's $8D, $5B. So we're gonna have to make it handle it special. Shit, I can't even think of a way to do it.
- Put all lengths behind opcodes? Seems like the best idea. It's the only thing I can think of.
- We can just make an opcode that changes the length for the current stream to its argument. Bonus, we get up to 255 frames.
- We check if the stream is above 4...
- wait... can we even differentiate between notes and opcodes?
- yes. The highest the high byte can be is $8F. So we're good. Otherwise, we'd have to use opcodes for everything...
- ## New fetch strategy
- So we `lda	(sound_ptr), y` to fetch our byte.
- We can do cpx 5 and that will set the carry bit if it's vrc6.
- Then we can use BCC or BCS to branch
- ok,, I think I got something that will work, so now I need to make the opcode.
- I think this is all that I need:
- ```z80
  se_op_note_length:
      lda	(sound_ptr), y
      sta	stream_note_length, x
  rts
  ```
- then y is increased on return I believe. The opcode is $AD.
- Alright, it doesn't work...
- ## Debug party 2
- ok fetching first byte of stream 0.
- my logic seems sound so far. It's skipping over the vrc6 part.
- wait, no something's not right.
- We loaded $01, which is the first part of a pitch.
- Oh, I see. We lost the negative flag that was needed by the bpl. No biggie, we'll just fetch it again.
- ok, it plays the main channels again now. Cool. Now to find out how to get the others playing.
- ## fetching stream 5
- we have the first byte, $AD.
- It's saving the note length correctly! And it increased y as expected, and fetching the next note which starts with $8D. Followed by $5B. The code seems sound.
- Huh... what if it's just because the volume is off, lol
- Nope, that would have been funny. I turned it on though.
- Why are we setting the temp ports already? we haven't done streams 6 or 7
- Is that how it's supposed to work?
- ok setting volume, that seemed to go right
- And it wrote the pitches to the soft apu ports. we should be golden.
- ok we increased x to 6. Lesgo
- We have the $AD, and we have the pitches.
- Now doing 7. Not sure why this doesn't work tbh.
- Oh! We have to put something in the fucking header!
- ## put it in the fucking header, asshole
- we have to set bit 0 of $07B for VRC6
- ok, did that. but still no sound from VRC6. Let's step through the set_apu routine because that should show us the actual writes.
- Ah, it's not writing them. We have to go check the loading of the soft ports again.
- Yeah it looks like it's not storing the right values. The volume is right
- ## Ugh, I'm so burned out
- Do I have any weed left, lol
- Funny thing is, I actually get sound if I play it in my player. It's just hella wrong. I wonder if my soft port count could be off. But...
- ## Why the fuck isn't it writing to the APU?
- Orr maybe it is, but something else is preventing it from playing. Maybe I'll analyze that famistudio saw output thingy. Eh... it's not even showing the saw registers being written to, strangely enough.
- I'm going to double check my soft apu ports. There are 32 bytes.
- omg I might have found something. Bit 7 needs to be on forr the high freq of all 3 channels.
- So how to do this?
- I'll OR it in right in set_apu!
- ## That fucking did it!
- It still might not be totally right. It's playing a high note on the saw for some reason, when it should be the lowest notes.
- I see, the high byte is writing, but the low is not
- oh fuck, it's also backwards, haha
- the bytecode goes hii, lo but the registers are lo-hi and I guess I never switched them
- but the saw, uh, one of them is all wrong, the low I think
- huh, it does appear that they are switched correct, see
- ```z80
  	;; Period lo
  	lda	stream_note_lo, x
  	sta	soft_apu_ports+2, y
  	
  	;; Period high
  	lda	stream_note_hi, x
  	sta	soft_apu_ports+3, y
  ```
- let's check when the bytes are fetched
- ```z80
      lda sound_temp2
  	sta	stream_note_hi, x   ; store first byte of pitch
      iny              ; Advance pointer for next byte
  	lda	(sound_ptr), y  
      sta	stream_note_lo, x   ; store second byte of pitch
  ```
- wait. that's actually fine. they're being stored correctly
- the high byte is always $80. And the low byte is supposed to be the high byte.
- Oh, I found the mistake! I had the registers off by one, silly.
- And it works! Mostly. The first note is short, for some reason. Like only one frame.
- For some reason, the note length setting doesn't take effect until the frame after, which is really weird.
- Hey, at least it's something else to debug besides not fucking making the right sound or fucking sound at all
- ## First note length bug
- There's one place in the sound load routine where the stream_note_length variable is initialized to 1. But it's changed to the proper value I think long before it plays, I don't understand.
- Maybe it has something to do with the counter thingy, which is a relic of the old tempo system and probably ought to be removed. It could almost make sense...
- Nah, we need the counter, that's how note lengths work!
- Weird... putting a rest in front of it didn't help either...
- ok, putting a rest between the note length opcode and the note worked.
- The interesting part is that there isn't a gap at the beginning, maybe because famistudio trims it
- yes, there's the "Remove intro silence" box, and if I uncheck it there's a single frame of silence
- huh, weird. It seems like the note length change takes a frame to take effect. Why would that be?
- Yeah, the way to get around it is to write a rest in between, and for some reason... the rest gets swallowed and the next note appears where you wanted it! So funny. It's also rather wasteful of space. I should try to come up with something better. But for now I'm gonna merge this.
- ## Holy shit
- I wasn't expecting to bang that out in one day, but this is great. Now there's just the integration into the main app, and then I'll be able to do all the songs pretty much.
- ## Not so fast
- So, testing it in Mesen and Famistudio was not enough because they are apparently much more forgiving. In the case of Famistudio what you get is a complete reconstruction. On my player it almost sounds like it's going to crash the page, it audibly struggles and breaks up. On VLC/Audacity, it emits a high-pitched whine in between notes. Will need to track down what's going on, because my player handles other VRC6 tunes perfectly.
- I guess the first step would be to see where the screeching is coming from. It doesn't actually do it on mine though.
- Damn, I'm getting eepy I'm gonna go eep. I sure got plenty done this weekend!
- ## Ok what's going on
- Next day. How fucked is this right now?
- Just VRC6 Pulse1 sounds fine. It's fairly soft though, let me increase it to uh... whatever famistudio does
- Pulses simply get $0F. Mine are at $05, lol
- Saw is $3F at full master volume, $1f at half, and $0F at quarter
- Got it matched now, all at $0f. P1 sounds perfect.
- So does P2. It must be the saw that's fucked.
- Yep! Wtf is it even doing?
- Fixed! Was writing $30 instead of $00 to silence
- Now I suppose we're ready to [[Install VRC6 driver]]