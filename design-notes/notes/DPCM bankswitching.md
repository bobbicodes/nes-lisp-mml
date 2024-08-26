- I'm going to try adding all of the bari sax samples that are in the Shadows song
- I guess I'll put the dubstep growls too
- ok so we obviously need the opcode to take more arguments, and we need the samples to be in a pointer table so we can refer to it. Just `play_sample` is obviously not enough :)
- I suppose it will work like the volume envelopes, which is a table of words:
- ```z80
  volume_envelopes:
      .word se_ve_0
      .word se_ve_1
      .word se_ve_2
  ```
- The sequences are terminated with an $FF, so I guess I need to do that.
- ```z80
  samples:
      .word growl_a
      .word growl_f
      .word growl_g
      .word growl_e
  
  growl_a:
      .incbin "growl-a.dmc"
      .byte $FF
  
  growl_f:
      .incbin "growl-f.dmc"
      .byte $FF
  
  growl_g:
      .incbin "growl-g.dmc"
      .byte $FF
  
  growl_e:
      .incbin "growl-e.dmc"
      .byte $FF
  ```
- Oh shit... Here is where I'll need to calculate the address so that it will be (a * 64) + $C000
- for the multiplication I guess I can ASL 4 times
- wait a second... omg I'm dumb. We need to divide, then subtract, silly.
- So like... I think the famistudio driver is doing it in C, because we have this:
- `FAMISTUDIO_DPCM_PTR = (FAMISTUDIO_DPCM_OFF & $3fff) >> 6`
- Is just... how ca65 works? Yeah, you just do math, like in the macro in the header:
- `.res 31-.strlen(str)`
- We have all the math operations, +, -, *, /.
- In fact, we've been using + every time we do `sta	sound_ptr2+1` or something.
- And parens for grouping, lovely.
- Though I guess I need a temporary variable on which to do the operation.
- But how do I store the contents of the A register into the variable? It seems to only show the opposite, which I'll need
- Wait... do I just do `a`?
- hmm, no I don't think that makes sense, because how would the assembler know the value?!
- So I guess we need a variable. Fine.
- Wait I think we can just use sound_temp1. So that will store our *index* into the sample table. Then we look up the value like we do for the volume envelopes:
- ```z80
  se_set_stream_volume:
  	sty	sound_temp1	; Save our index into soft_apu_ports
  	
  	lda	stream_ve, x	; Which volume envelope?
  	asl	a		; Multiply by 2 for table of words
  	tay
  	lda	volume_envelopes, y ; Get the low byte of the address from table
  	sta	sound_ptr
  	lda	volume_envelopes+1, y ; Get the high byte of the address
  	sta	sound_ptr+1
  ```
- I'm confused already, so let's go back through it. The volume envelopes are indexed by constants. Well I guess that doesn't matter, it's just a convenient way to refer to it in the code. So whatever... we pass a sample number. We multiply it by 2 (`asl a`).
- Huh, so I still don't know how to get from the low and high byte of the sample address, to an actual value...
- I guess... shift the high byte and add them? There might be an operator for this... `.HIBYTE` and `.LOBYTE`?
- uh, so let's say our address is $C040. That's 49216. We have $C0 and $40, that's 192 and 64.
- We can multiply $C0 * 0x100 to get $C000, and add $40. Good.
- Alright, so now we have the low and high byte stored in sound_temp2  and sound_temp1.
- To add them together and do the next calculation, here's where I think we can use a ca65 numeric variable, i.e. `four .set 4`
- This is what I have:
- ```z800
  se_op_play_sample:
      lda	(sound_ptr), y	; Read the argument
      asl a               ; Multiply by 2 for table of words
      tay
      lda	samples, y      ; Get the low byte of the address from table
      sta sound_temp1     ; store low byte
      lda	samples, y+1    ; Get the high byte of the address from table  
      sta sound_temp2     ; store high byte
      dmc_adr .set (sound_temp2 * $100) + sound_temp1 ; make 16-bit number
      dmc_val .set (dmc_adr / 64) - $C000 ; value to write to $4012
      lda dmc_val
      sta $4012       ; write dmc sample address
  ```
- I guess I'll try it... so here are the samples again:
- ```z80
  samples:
      .word growl_a
      .word growl_f
      .word growl_g
      .word growl_e
  ```
- Yeah this shit doesn't work like this. I don't know how to deal with a 16-bit number. The ca65 variables need to just be like, a number, it can't be an expression.
- Oh yay, The Thingy came to the rescue and showed me how to do it!
- ## Debugging
- It seems to actually start to play the sample and get stuck in a loop, constantly restarting it. So I'll set a breakpoint at the play_sample routine.
- reading the argument, sound_ptr is 0 and y is 1, and the value is 0, for our first sample.
- `lda samples, y` to get the low byte, which is at $E000, which is $20.
- So that's the low byte eof the *address* of the `growl_a` sample.
- `sta $0201` which is sound_temp1
- lda    samples+1, y    ; Get the high byte of the address from table
- now we have $20 and $0F in sound_temp1 and sound_temp2, which are $0201 and $0202
- Time for the thingy's magic:
- `ldx #5` ; since you need to right shift 6 times for 6-bits
- So I guess we're trying to divide $0F20 (3872) by 64 which is... 60.5, between $3c and $3d
- Let me try to align it, because that might be the issue right there.
- So now we have $00 and $E0 in sound_temp1 and sound_temp2, which are $0201 and $0202
- we're trying to divide $E000 (3872) by 64 which is 896, or $380
- So here is where our loop begins, at the blank label.
- clc
- lsr #$E0 which is $70?
- ror which is $00? what?
- ok then we decrement x, yes, so when we shift 6 times it will throw the negative flag. But I have no idea how this actually works.
- ```z80
  lsr sound_temp2 ; these two lines of code
  ror sound_temp1 ; basically act like a 16-bit LSR (shift right)
  ```
- I don't understand why, but now we have $00 and $70
- then $00 and $38
- then $00 and $1C
- then $00 and $0E
- then $00 and $07
- then $80 and $03 (how?)
- wait... that's actually right... that's $0380!
- now to do the subtraction.
- ```z80
  sec ; now let's subtract sound_temp by $C000>>6
  lda sound_temp2 ; we only need to subtract the
  sbc #$03        ; high-byte because $C000>>6 only
  ```
- wait, why is it $C000>>6? I'm so confused...
- assuming this is correct, the result should be $80. But I don't understand
- If it's correct, then we'll see the sample address set back to the right location, so let's see...
- so it subtracted 3 from $03, which is 0
- huh? It didn't work, and I'm way too lost to have any clue
- Trying it again, but with the samples at $c000
- This time it gets the correct sample address, but I don't think it's for the right reason.
- So at that point, the sample should have played. But we're debugging so idk
- That puts us back in the fetch byte routine, where we had last called the opcode launcher.
- I think the problem might be that we clobbered the y register, which is now $00 but it should have been 04 before that, which marks our position in the data stream. Which explains why the sample keeps restarting!
- $80C5 is se_fetch_byte
- yeah, so I guess we're gonna need another temporary variable so we can save the y register
- Damn, it still does the same thing...
- oh. it looks like we need to save x as well...
- huh, I might have gotten somewhere. It's playing the sample... but the length is wrong, and, well more than that, it's like... wrong. Like all garbled.
- It should be 4081 bytes, so let's fix that. The length value should be $ff, because that's the maximum length.
- Ok that works, but wtf is wrong with my sample?
- It's because it's actually located at $C400... why?
- This is the current play_sample routine, which I'm gonna save here because it doesn't work...
  collapsed:: true
	- ```z80
	  se_op_play_sample:
	      sty	sound_temp3	; Save Y register
	      stx	sound_temp4	; Save X register
	      lda    (sound_ptr), y    ; Read the argument
	      asl a               ; Multiply by 2 for table of words
	      tay
	      lda    samples, y      ; Get the low byte of the address from table
	      sta sound_temp1     ; store low byte
	      lda    samples+1, y    ; Get the high byte of the address from table  
	      sta sound_temp2     ; store high byte
	      ldx #5 ; since you need to right shift 6 times for 6-bits
	  :          ; this is a temporary label btw
	      clc    ; clear carry just to be sure
	      lsr sound_temp2 ; these two lines of code
	      ror sound_temp1 ; basically act like a 16-bit LSR (shift right)
	      dex
	      bpl :-
	      sec ; now let's subtract sound_temp by $C000>>6
	      lda sound_temp2 ; we only need to subtract the
	      sbc #$03        ; high-byte because $C000>>6 only
	                      ; occupies the high-byte as $03
	      sta $4012       ; write dmc sample address
	  
	      lda #$ff         ; length of sample
	      sta $4013       ; write sample length
	  
	      lda #$0F
	      sta $4010       ; write dmc frequency
	  
	      lda #$40
	      sta $4011       ; dmc counter
	      lda #$1F
	      sta $4015       ; enable dmc
	      ldy sound_temp3  ; Restore Y
	      ldx sound_temp4  ; Restore X
	  rts
	  ```
- Well this is frustrating, I just hardcoded the correct address and it still plays wrong, somehow it's corrupting the sample and I have no idea how to debug it because that part is handled by the memory reader.
- Weird, it actually seems to play properly in my app, which is exceedingly confusing
- Yeah, why the fuck would it play fine in mine, but messed up in both mesen and famistudio?
- I don't like this.
- Anyway, I do need to make it so that the opcode takes 2 arguments, so that we can pass the length as well.
- Did that!
- ## Bankswitching
- Now the first sample is at B500, and the second is at C500
- Oh! The first one is also at E500. Great!
- Oh my god, it actually fixed the glitching issue
- D500, E500, F500, oh, the last one messes up. But also, interestingly...
- it doesn't play in my player. Which is quite weird.
- $8000: 20 0F 80 A9 00
- This is weird... though my driver currently works on mesen, it won't play on anything else...
- I was able to hack my player into playing it... well, only some of it, the first sample doesn't work, well now I see that it's looking for it at $C000, which is actually wrong, it's supposed to be $C500.
- The ones that work are at $D500, $E500 and $F500 which is correct.
- Oh... it might be because I messed it up while trying to make it work before.
- Weird... the value being written to $4012 is 0. Why? For the others it's correct.
- Oh wait... there are only 3 samples, hahaha
- But my player is playing different ones. That's weird! It's the same rom.
- FamiStudio only loads one of the samples (the corrupted one), and plays it for each one! And it won't play at all in VLC or Audacity.
- I at least need to figure out why that is.
- I can get other samples to play by changing the bank values.
- 0,1,1,1,1,1,2,1
- First I just want to get the first sample playing right, in the first position. Then figure it out for the rest, and then make an opcode that will switch banks.
- I'm not sure if the first one is even possible... well, I'll figure it out somehow, even if it means I need to switch which sample is actually called... yeah, actually I'll just do that.
- `0,0,0,0,0,1,2,1`  - gives sample 1, 2 and 3
- `0,0,0,0,0,3,4,1`  - this gives us 4
- So we need to write to $5FFD and $5FFE.
- The bank switch opcode will be $AC.
- And it's merged! Wow, this is absolutely wonderful. I wasn't sure if I'd ever figure this out