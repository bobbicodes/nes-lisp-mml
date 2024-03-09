- So how do the note lengths work now anyway?
- They start by using a 32nd note as a basis value:
- ```z80
  note_length_table:
      .byte $01   ;32nd note
      .byte $02   ;16th note
      .byte $04   ;8th note
      .byte $08   ;quarter note
      .byte $10   ;half note
      .byte $20   ;whole note
  ```
- This is based on the idea of the 32nd note being the smallest desired value. But we actually want individual frames. But to get there, we have to walk through how the current system works.
- So there is a running ticker total which gets the tempo added to it which gives us a variable tick rate. So since the ticker counts each frame, we simply want to compute on which frame each note begins and ends. We really want to ditch the entire note lengths deal and in its place, each note value will be expressing a number of frames. It might even be simpler as a result.
- I still don't understand how the note values work... here is the actual code:
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
- uh.... that only handles fetching the byte. Then it looks up the value in the table. I guess the next place it is dealt with is in `se_play_frame`. Here is just the loop part:
- ```z80
  ldx	#$00
  @loop:
  	lda	stream_status, x
  	and	#$01		; Check whether the stream is active
  	beq	@endloop	; If the channel isn't active, skip it
  
  	;; Add the tempo to the ticker total.  If there is an $FF -> 0
  	;; transition, there is a tick
  	lda	stream_ticker_total, x
  	clc
  	adc	stream_tempo, x
  	sta	stream_ticker_total, x
  	;; Carry clear = no tick. If no tick, we are done with this stream.
  	bcc	@set_buffer
  
  	;; Else there is a tick. Decrement the note length counter
  	dec	stream_note_length_counter, x
  	;; If counter is non-zero, our note isn't finished playing yet
  	bne	@set_buffer
  	;; Else our note is finished. Reload the note length counter
  	lda	stream_note_length, x
  	sta	stream_note_length_counter, x
  	
  	jsr	se_fetch_byte
  @set_buffer:
  	;; Copy the current stream's sound data for the current frame into our
  	;; temporary APU vars (soft_apu_ports)
  	jsr	se_set_temp_ports
  @endloop:
  	inx
  	cpx	#$06
  	bne	@loop
  ```
- Ok I'm starting to get it. The note length value is an index into the table. So what I want to do is get rid of the table, and remove the bit where it chops off the 7th bit and looks up the value... instead we will be encoding literal values. Here is our modified subroutine:
- ```z80
  @note_length:
  	;; Do Note Length stuff
  	sty	sound_temp1	; Save Y because we are about to destroy it
  	tay
  	sta	stream_note_length, x
  	sta	stream_note_length_counter, x
  	ldy	sound_temp1	; Restore Y
  	iny
  	jmp	@fetch		; Fetch another byte
  ```
- ok, let's try it!
- oh.. I just realized we need to add 80 to it, otherwise the note length will be interpreted as a note! But it also can't be higher than 160. But we might be able to change that by getting rid of some opcodes.
- Got it! I think I need to find the address again for the watcher function... and of course, update our converter to do the right thing with the note values.
- Specifically, it needs to add $80 (128) to the value, and we ditch the note length table.
- Ha! It's going to be so much simpler now!
- So we're basically rewriting our `assembleStream` function. It starts out the same, We:
	- Sort the notes by time so they're in order
	- Initialize an empty array and currentTime = 0
	- Loop through each of the notes and:
		- Get its time (`t`) and length (`l`)
		- Check if we need a rest before the next note
			- Test: is the current time less than the start time of the note?
			- If so, calculate the length rest we need
			- If not, calculate note length and add to stream
		- Update current time to `t+l`
- How are we translating seconds to note lengths?
- I guess let's start with trial and error
- or... we could just use literal values!
- also for now we will make rests explicit for simplicity.
- ok so now I guess I need to calculate the note lengths for real.
- Can I get rid of all the opcodes? Or at least some of them, so I can get some longer note lengths?
- Also, what is the shortest one?
- Oh and I just realized that time now has no purpose other than ordering
- Oh I know... I'll just add 128 to the length or whatever
- cool, now you can put a length of 1 and it's like pretty short. Not 1 frame short but like, a few frames
- I need to see how to get finer control of both length and pitch, actually. I like this idea of getting it closer to the metal, let's keep going with this trend.
- At this point the "frames" are like 32nd notes. That's got to change.
- What are the lengths actually? I still don't actually get it.
- I can get rid of looping... oh wait... no it actually relies on looping.
- We can get rid of transpose. Done
- Oh. I guess we would... reduce the ticker size, to like... nothing! Hahahaha
- We don't even want a tempo because our program will handle that.. We just want to control frames.
- Wait so if the tempo is added to the ticker... and every time it rolls over there's a tick... then we actually want *maximum* tempo, right? it's backwards?
- Got it. Now... quarter notes are worth 20 frames at zelda tempo
- It works great, except that the squares are not joining together like they should. It's like there's an envelope that I don't know the source of. The volume envelop as far as I can tell is just a fixed volume.
- ```clojure
  (tri-stream
    (for [t (range 70)]
      {:time t :length 1 :pitch (+ t 33)}))
  
  (play-nsf)
  ```
- Ok let me try to figure out these envelopes, and... well we need a way to modify the volume per note. If we can do like we did for the pitch and length....
- See here's the thing. We need finer control of pitch so we can do vibrato, i.e. controlling the actual period value. And that's what I should be trying to target
- There must be a way I can get longer notes without having to concatenate them
- ah, I think I figured it out! There totally is an envelope on the squares, hahahha
- Fixed! It works great!
- I know what I could do for the duration thing... just automatically divide notes that are too long.
- I should also just remove the time parameter from the API because it's pointless rn
- Done! Much, much cleaner. Now, the length divider:
- ```clojure
  {:length 85 :pitch 70}
  
  ;; needs to become:
  {:length 20 :pitch 70}
  {:length 20 :pitch 70}
  {:length 20 :pitch 70}
  {:length 20 :pitch 70}
  {:length 5 :pitch 70}
  ```
- I think I got it:
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
- It works!
- Cool, I updated the demo with a more concise syntax and better function names:
- ```clojure
  (defn zeldabass [note]
    [{:length 40 :pitch note}
     {:length 40 :pitch (+ note 7)}
     {:length 80 :pitch (+ note 12)}])
  
  (triangle
    (apply concat
        (for [note [46 44 42 41]]
          (zeldabass note))))
  
  (square1 
    (for [[length pitch]
        [[100 70] [20 65] [2 127] [18 65] [20 70] [10 68] 
         [10 66] [140 68] [100 70] [20 66] [2 127] [20 66]
         [20 70] [10 69] [10 67] [140 69]]]
    {:length length :pitch pitch}))
  ```
- Alright... I guess note lengths are done! Which was the purpose of this page. Feels good to actually finish something. Even if it was kind of breaking something by getting rid of the note lengths so it just uses ticks. From here, there are a couple more biggish tasks:
- [[noise channel]]
- [[sound engine volume]]
- [[sound engine fine pitch]]