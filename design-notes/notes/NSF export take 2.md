- Alright, so this one will be based off of the tempo project. I'll build this in a new branch of the nsf sound driver project called note-lengths.
- Got it! The working tempo project, anyway.
- It's 993 bytes, which is amazing. It's just missing drums, which I'll have to add in later, but *without* adding envelopes or opcodes.
- So before we worry about drums, let's try to convert it to our tempoless, note-length-less version. Ah, see so note-lengths wasn't the best name for this branch
- I renamed it note-frame-lengths, which is slightly more accurate.
- Ok so the thing we did before was just crank the tempo all the way up so that the engine ticks once every frame. But that seems like it performs an unnecessary step, huh? Why have a counter if it's gonna overflow every frame anyway? Just fucking run it!
- So we're gonna get rid of 2 variables, stream tempo, and stream ticker total.
- omg I got it on the first try.
- Now I basically just need to change the note lengths, or rather, get rid of them and instead of doing table lookup, just read the value instead.
- Where does this happen? What reads the note lengths? Um... try note_length, lol
- So we're gonna get rid of this line:
- `lda	note_length_table, y ; Get the note length count value`
- ok! That was easy! Now I guess all I have to do is add noise!
- Got it! And it's exactly 1Kb (1024 bytes)!
- Since we're not actually using opcodes, we can extend our note lengths all the way to $FF.
- Pretty sure it's all working, I just miscalculated the demo song when I converted the note lengths to ticks.
- Alright so now I suppose we can do the thing where we... uh, no. We need a way of changing volume.
- ## Volume changes
- I guess we could use some of the range that was previously for opcodes for volume. So it would be:
	- 0 - 0x80 = notes
	- 0x81 - 0xEF = note length
	- 0xf0 - 0xfe = volume
	- 0xff = end
- I'm going to bed. But I think I can jam this out in the morning, it will be basically like the one with opcodes... yes, I'm getting really loopy. Later!
- Ok, I slept. And still kind of remember what I was going to do.
- volume/duty are still shared in this impl, which is good. So we do the OR thing
- It's actually changing the volume, which is a good thing, but it's doing this thing where it's like... fading out. Even the triangle channel which has no volume changes.
- huh... it seems to only do the fade out thing in Mesen...
- ## New day... whole new system
- Kind of forgot what I was doing. Right... was trying to add volume changes to the data format.
- I think I was on the fixed-volume-changes branch.
- Wait no, I guess it was note-lengths2
- Yes! Here we are.
- So, the format is not actually right because we can't use 0xff which is kind of a problem.
- I'm thinking of jumping back to the full opcodes implementation...
- I suppose I could just use 0xef for volume 0, 0xf0 for 1, 0xf1 for 2, etc.
- The volume changes aren't working. It silences the stream. Let's try debugging it in Mesen.
- I guess I want to put a breakpoint on the volume register to find out what's happening.
- It's not doing the volume stuff! It's just ending. As in, like it's an $FF
- I think I understand. This snippet does not do what I think it does:
- ```z80
  @fetch:
  	lda	(sound_ptr), y
  	bpl	@note		; If < #$80, it's a Note
  	cmp	#$EF
  	bcc	@note_length	; Else if < #$EF, it's a Note Length
  	  ;; If $FF, end of stream so disable it and silence
  	cmp	#$ff
  	bne	@end
  @volume:	; Else it's a volume change
  ```
- When we get to the volume change opcode, `$FE`, and do the `cmp #$ff`, the zero flag is clear. So what we actually want to do is jump to the volume subroutine before the `bne`, silly
- my brain hurts trying to figure it out.
- Maybe what I want is `beq`?
- No. I made another cmp and bcc so now we're jumping to volume, which I moved down below the silencing code.
- I changed it so that the `E`s  are for volume changes, because the way we're currently calculating it means we need to go from `E0` to `EF`. That means we lose 16 levels of note lengths but right now I'm just trying to get it to work at all...
- So we correctly jump to the volume code.
- ```z80
  @volume:			; Else it's a volume change
      sta	sound_temp2	; Save our new volume value
  	lda	stream_vol_duty, x ; Get current vol/duty settings
  	and	#$F0		   ; Zero out old volume
  	ora	sound_temp2	   ; OR our new volume in
      sta stream_vol_duty, x
      jmp	@fetch		; Fetch another byte
  ```
- A = $E5. Store it.
- Load the current vol/duty which is $BC.
- AND it with `$F0` which gives us `B0`.
- OR that with `$E5` and then we have `$F5`. Good so far!
- Wait... we want to set it to `$B5`. Why is it `$F5`?
- Huh. I guess that's our problem. B0 | E5 is indeed F5.
- If we want B5, we need to OR B0 with 05.
- Ah... yes, of course! We never zeroed out the E, silly!
- Damn, it still doesn't work.
- So now, our accumulator was E5, and we AND it to 05 and store it.
- We get the current value BC.
- AND it with F0 too get B0.
- OR it with stored value for B5. Yes!
- Now we store it back.
- Oh, I think we just need to INC Y (INY) before fetching another byte!
- Yes! It works!
- OMG this is great! I finally got it how I want it.
- Should I merge this into main? Yeah, I think I will.
- We're still going to need duty changes. That can be the `F`s.
- Oh shit, I need to resolve merge conflicts.
- The command-line instructions are wrong. I'm gonna have to do this manually.
- ok. that was fucking annoying but I got it.
- Time to add duty changes I guess?
- ok so duty is bits 6 and 7.
- Done!
- Ok, so this page is actually about NSF export in our app, but now we'll have to make another page where we'll take this driver and try to generate it from the program! See you at [[NSF export take 3]]