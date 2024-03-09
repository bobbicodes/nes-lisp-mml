- So this is *slightly* annoying because we will have to redo a lot of what we did already. But it will be worth it because we will be getting rid of the note table which is the largest chunk of the entire driver.
- Let's open up the nsf-sound-driver project again and make a branch called literal-pitch
- So how will this even work? I guess the question to ask is, how does it work now? This is a similar approach to what we did with note lengths.
- The stream data has note pitches in it like this:
- ```z80
  song1_tri:
      .byte $a8, E4, G4, B3, Eb4
      .byte Fs4, A4, B3, E4
      .byte G4, B4, $9e, A4, B4, $a8, C5
      .byte $94, E4, Fs4, G4, A4, B3, C4, D4, Eb4, A3, E4, $da, rest
      .byte $FF
  ```
- Let's first get rid of the table by replacing the constants with their actual values. But first I want to simplify the song drastically to make it easier to know what everything is, or else it will be a jumble of values.
- ok so that's done, I got rid of the pitch constants and both note_table files by moving the note table to the main sound engine file. But our main problem remains, we've only simplified things which is great but here is the thing:
- ## The Thing
- A pitch takes 2 bytes.
- This means we can no longer simply fetch one byte at a time. So we need to make it so if a byte is the first part of a pitch (and luckily, that works out because the first part of a pitch is always less than $80), it will grab *another* byte to complete the period value.
- This is like, what we're already doing when indexing into the note table to get the lo and hi period values. We will just move this logic into the stream byte fetching routine.
- We can't just call fetch again after fetching the first pitch byte. We need a separate routine that gets the second one.
- hmm, I guess we don't need a new routine. Check it:
- ```z80
  @note:
  	;; Do Note stuff
  	sta sound_temp2
      lda stream_channel, x
      cmp #NOISE
      bne @not_noise
      jsr se_do_noise
  @not_noise:
      lda sound_temp2
  	sty	sound_temp1	; Save our index into the data stream
  	asl	a
  	tay
  	lda	note_table, y
  	sta	stream_note_lo, x
  	lda	note_table+1, y
  	sta	stream_note_hi, x
  	ldy	sound_temp1	; Restore data stream index
  
  	;; Check if it's a rest and modify the status flag appropriately
  	jsr	se_check_rest
  @update_pointer:
  	iny
  	tya
  	clc
  	adc	stream_ptr_lo, x
  	sta	stream_ptr_lo, x
  	bcc	@end
  	inc	stream_ptr_hi, x
  @end:
  	rts
  ```
- Noise will still be  handled the same because it has its own note system.
- I think all we really need to do is grab the first byte, store it, advance pointer, store second byte, advance pointer.
- Let's run through how it works
- ## How it works (note lookup)
- Starting from `@not_noise` I guess
- we previously did `sta sound_temp2` - to hold our pitch value
- so now we load it: `lda sound_temp2`
- `sty	sound_temp1`	; Save our index into the data stream
- We need to do that so we can restore it after, since we are now going to shift a and transfer it to y
- Why do we ASL? We do that to Multiply by 2 so we can Index into a table of pointers.
- So this would be a note value, say `$1f`, which, multiplied by 2 would be `$3e`
- Oh I get it... because each word in the table is 2 bytes. Got it.
- So that means we will *not* do this anymore. Good. Good good good.
- So we load from the table and then `sta	stream_note_lo, x`
- That's the part we will keep, so it will just be:
- ```z80
  lda sound_temp2
  sta	stream_note_lo, x
  ```
- And the next part will happen *after* we fetch the next byte:
- ```z80
  lda	???
  sta	stream_note_hi, x
  ```
- Now I'm trying to understand the `@update_pointer` bit:
- ```z80
  @update_pointer:
  	iny
  	tya
  	clc
  	adc	stream_ptr_lo, x
  	sta	stream_ptr_lo, x
  	bcc	@end
  	inc	stream_ptr_hi, x
  ```
- So we're clearing the carry bit and then adding our pointer index to the stream pointer... why?
- Then if the carry flag is still clear... we *don't* increase the hi pointer. why?
- If it's only to check if we are at the end, then I can ignore it, because we *know* we're not at the end... we need another byte.
- Oh, and the `se_check_rest` is going to be different. Instead of looking for `$5e` the first time, it will look for `$00` the second time.
- This is what I have:
- ```z80
  @not_noise:
      lda sound_temp2
  	sta	stream_note_lo, x   ; store first byte of pitch
      iny              ; Advance pointer for next byte
  	lda	(sound_ptr), y  
      sta	stream_note_hi, x   ; store second byte of pitch
  	;; Check if it's a rest and modify the status flag appropriately
  	jsr	se_check_rest
  ```
- Now updating the song data.w
- Before:
- ```z80
  song1_square1:
      .byte $cb, $1f, $ab, $22, $94, $21, $1f, $1e, $1f, $21, $df, $5e, $a8
      .byte $FF
      
  song1_square2:
      .byte $94, $13, $5e, $1a, $5e, $1a, $5e, $1a, $5e, $0E, $5e, $15
      .byte $FF
      
  song1_tri:
      .byte $a8, $1f, $22, $1a, $1e, $21, $24
      .byte $FF
  
  song1_noise:
      .byte $94, $0D, $5e, $07, $5e, $0D, $5e, $07, $5e, $0D, $5e, $07
      .byte $FF
  ```
- After:
- ```z80
  song1_square1:
      .byte $cb, $01, $51, $ab, $01, $1C, $94, $01, $2D, $01, $51, $01, $67, $01, $51, $01, $2D, $df, $00, $00, $a8
      .byte $FF
      
  song1_square2:
      .byte $94, $02, $A6, $00, $00, $01, $C4, $00, $00, $01, $C4, $00, $00, $01, $C4, $00, $00, $0E, $00, $00, $02, $5C
      .byte $FF
      
  song1_tri:
      .byte $a8, $01, $51, $01, $1C, $01, $C4, $01, $67, $01, $2D, $00, $FD
      .byte $FF
  
  song1_noise:
      .byte $94, $0D, $00, $00, $07, $00, $00, $0D, $00, $00, $07, $00, $00, $0D, $00, $00, $07
      .byte $FF
  ```
- Lol, it plays sound but it's incredibly fucked up
- Oh shit... I think the problem is it's running the code we just did for noise as well, which is not what we intended.
- Yep... I think that's the issue. I thought the `@not_noise` part only ran if it wasn't noise, but that's not the case. So I'm gonna have to do something else.
- Wait.
- That doesn't make sense. From the tutorial:
- > Since we are not using the note table for Noise, we will need to alter our
  Note code to check the channel and branch to different code if we are
  processing the Noise channel
- Oh. I figured it out... I was missing a part that jumps to the part after the table business. Weird that it worked before, actually.
- ok now it's doing the right thing there, but it's also doing this thing where it's skipping the first channel the second time around.
- Also it seems to be not handling the second byte properly, or at all since I change it and it has no effect. It seems to work other than that though...
- What if it's actually backwards? That would be funny. Hmmm, since it's little endian...
- ohh my god... that was it
- it actually works
- So I've got it in a PR. Even got a quick review from TaikikuNinja who pointed out a redundant `cmp #$00`. I guess I should merge it because it seems to be sound hahaha
- ok, that's done. I was just going to say "oh boy, now we get to modify the Lisp application to produce the period values" but quickly realized that no, we don't get to do that until we re-process the driver which will be lots of fun... let's go...
- ## Driver disassembly
- I have it open in the hex editor... I guess we start breaking it down.
- Probably a lot of it will be the same, like the header
- We have to be careful though, because anything could have references to addresses that have changed.
- ```js
  const load = [0x20, 0x0B, 0x80, 0x20, 0x39, 0x80, 0x60, 0x20, 0x88, 0x80, 0x60];
  const init = [0xA9, 0x0F, 0x8D, 0x15, 0x40, 0xA9, 0x00, 0x8D, 0x00, 0x02, 0xA9,
    0xFF, 0x8D, 0x03, 0x02, 0x8D, 0x04, 0x02];
  const silence = [0xA9, 0x30, 0x8D, 0x05, 0x02, 0x8D, 0x09, 0x02, 0x8D, 0x11,
    0x02, 0xA9, 0x80, 0x8D, 0x0D, 0x02, 0x60, 0xA9, 0x00, 0x8D, 0x15, 0x40, 0xA9,
    0x01, 0x8D, 0x00, 0x02, 0x60];
  ```
- Good so far.
- `soundLoad` has some differences. So does playFrame. I know fetchbyte will.
- I think I got it! Now to do the assembleStream thing. Let's make a new branch for this in the other thing. The fucking driver is only 670 bytes without the music data.
- ## Lisp integration
- Alright, so now the fun part! We get to make the editor pitches into pitch-words. How will that work?
- It will be whatever the formula is for getting frequency from period:
	- P = C/(F*16) - 1
	- P = Period
	- C = CPU speed (in Hz) (1.789773MHz)
	- F = Frequency of the note (also in Hz).
- The other critical part is that in our note stream assembler, when we get to a pitch we need to put it in as 2 values. Obviously.
- So let's try one. A4 = $00FD
- ```js
  function freqToPeriod(freq) {
    const c = 1789773;
    return c / (freq * 16) - 1
  }
  ```
- That gives us our value.
- Now, we need our good friend midiToFreq:
- ```js
  function midiToFreq(n) {
      return 440 * (Math.pow(2, ((n-69) / 12)))
  }
  ```
- Now to format the period value as a word... I think we have that function already...
- Not quite, because we need to pad it or something. Oh, and we might need to round...
- Because `(253.22911931818183).toString(16)` gives us `fd.3aa7904a7908`. What do we do with that?
- This works:
- ```js
  function fmtWord(n) {
    n = Math.round(n)
    const pad = String(n.toString(16)).padStart(4, '0');
    return [parseInt(pad.slice(2), 16),
            parseInt(pad.slice(0, 2), 16)];
  }
  ```
- Ok, now to actually use this stuff!
- So, in the code where we get to a pitch... just uh... stick it there
- I need a way to actually test the driver itself... how did I do that before? I had a version of play-nsf that didn't take any input.
- ok yeah, something isn't right with the driver.... it isn't locating the streams properly. Only the first channel works
- Got the driver working fine. Just need to fix the data conversion.
- We also need to account for the noise channel handling notes and rests differently.
- ## New day
- So yeah it works if I just load the data streams directly, so let's do what we did before and take a small piece and directly translate it
- So we have a working snippet here
- ```clojure
  (play-nsf
    [0x94, 0x01, 0x51, 0x01, 0x1C, 0x01, 0x2D, 0x01, 0x51, 0x01, 0x67,
  	0x01, 0x51, 0x01, 0x2D, 0xFF],
    [0x94, 0x02, 0xA6, 0x00, 0x00, 0x01, 0xC4,
  	0x00, 0x00, 0x01, 0xAB, 0x00, 0x00, 0x01, 0x93, 0xFF],
    [0xa8, 0x01, 0x87, 0x01, 0x67, 0x01, 0x47, 0x01, 0x27, 0xFF],
    [0x94, 0x0D, 0xE0, 0x00, 0xE9, 0x09, 0xE0, 0x00, 0xEF, 0x0D, 0xE0, 0x07, 0xE9, 0x09, 0xFF])
  ```
- So we just need a function that will produce this sequence from a friendlier one
- Here's one with all a4s:
- ```clojure
  (play-nsf
    [0x94, 0x00, 0x00, 0x00, 0xfd, 0x00, 0x00, 0x00,
     0xfd, 0x00, 0x00, 0x00, 0xfd, 0xFF],
    [0x94, 0x00, 0xfd, 0x00, 0x00, 0x00, 0xfd, 0x00, 
     0x00, 0x00, 0xfd, 0x00, 0x00, 0x00, 0xfd, 0xFF],
    [0xa8, 0x00, 0xfd, 0x00, 0x00, 0x00, 0xfd 0xFF],
    [0x94, 0x0D, 0xE0, 0x00, 0xE9, 0x09, 0xE0, 0x00, 
     0xEF, 0x0D, 0xE0, 0x07, 0xE9, 0x09, 0xFF])
  ```
- We need a pitch that will represent a rest... hmm I guess that is 0, right?
- No, we need to make it so.
- And we need to make a separate function `assembleNoise`
- The only difference is pitches are not doubled, and rests don't exist, they're just notes with volume 0
- pitches aren't calculated at all actually, just used directly
- So we have something like this:
- ```clojure
  (play-nsf
    [{:length 0x94 :pitch 0}
   {:pitch 69} {:pitch 0} {:pitch 69} {:pitch 0} {:pitch 69}]
  [{:length 0x94 :pitch 69} {:pitch 0} {:pitch 69} {:pitch 0} {:pitch 69}]
  [{:length 0x94 :pitch 69} {:pitch 0} {:pitch 69}]
  [{:length 0x94 :pitch 0x0D} {:volume 0xE0 :pitch 0} {:volume 0xE9 :pitch 0x09}
   {:volume 0xE0 :pitch 0} {:volume 0xE9 :pitch 0x0D}
   {:volume 0xE0 :pitch 0} {:volume 0xE9 :pitch 0x09}])
  ```
- The noise is working, but the others are... silent
- oh hahaha I had the periods backwards again. It works!
- I should merge this... but I think first I want to add a thing that will let us have an empty stream, otherwise we need to put rests to silence it:
- ```clojure
  (play-nsf
    [{:length 0x94 :pitch 56} {:pitch 57} {:pitch 58} {:pitch 59} {:pitch 60}
     {:pitch 61} {:pitch 62} {:pitch 63} {:pitch 64} {:pitch 65}]
  [{:length 0x94 :pitch 0}]
  [{:length 0x94 :pitch 0}]
  [{:length 0x94 :volume 0xE0 :pitch 0}])
  ```
- Oh wait, no we don't
- And this works... we have microtones!
- ```clojure
  (play-nsf
   (concat [{:length 0x94}]
    (for [x (range 69 79 0.5)]
     {:pitch x}))
  []
  []
  [])
  ```
- I want to try making proper drums. Here we have a single drum with an envelope:
- ```clojure
  (play-nsf
    []
  []
  []
  [{:length 0x81 :pitch 0x0D} {:volume 0xEE :pitch 0x0D} {:volume 0xED :pitch 0x0D}
   {:volume 0xEC :pitch 0x0D} {:volume 0xEB :pitch 0x0D} {:volume 0xEA :pitch 0x0D}
   {:volume 0xE9 :pitch 0x0D} {:volume 0xE8 :pitch 0x0D} {:volume 0xE7 :pitch 0x0D}
   {:volume 0xE6 :pitch 0x0D} {:volume 0xE5 :pitch 0x0D} {:volume 0xE4 :pitch 0x0D}])
  ```
- It sounds pretty good! Now let's make it a function.
- ```clojure
  (defn drum [pitch]
    (concat [{:length 0x81}]
      (map #(hash-map :volume % :pitch pitch)
        (reverse (range 0xE4 0xEF)))))
  
  (play-nsf
    [][][]
    (concat 
      (drum 0x0D) {:length 0x96 :volume 0xE0 :pitch 0}
      (drum 0x07) {:length 0x96 :volume 0xE0 :pitch 0}
      (drum 0x0D) {:length 0x96 :volume 0xE0 :pitch 0}
      (drum 0x07) {:length 0x96 :volume 0xE0 :pitch 0}))
  ```
- Here's triangle kicks:
- ```clojure
  (def tri-kick
    (concat [{:length 0x81}]
      (for [x (reverse (range 55 69 3))]
        {:pitch x})))
  
  (play-nsf
  []
  []
    (concat 
      tri-kick {:length 0x94 :pitch 0}
      tri-kick {:length 0x94 :pitch 0}
      tri-kick {:length 0x94 :pitch 0}
      tri-kick {:length 0x94 :pitch 0}
      tri-kick {:length 0x94 :pitch 0})
  [])
  ```
- The playback is like... weird. Like there's really bad glitching at the beginning.
- I should try exporting the NSF to make sure it's good
- I did, and yes, it works great! For some reason I'm surprised that the triangle kicks came out exactly as expected.
- What will be more fun... [[audio export]]