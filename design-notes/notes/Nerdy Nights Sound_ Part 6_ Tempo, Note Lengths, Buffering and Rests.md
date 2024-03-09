- This one seems to introduce *ticks*. It's how we get tempo.
- For note lengths, we give each stream a note length counter and add it to the note data:
- ```z80
  ;music data for song 0, square 1 channel
  song0_sq1:
      .byte $82, C3 ;play a C eighth note
      .byte $84, D5 ;play a D half note
  ```
- Oh, then they add constants to make it clearer:
- ```z80
  ;note length constants
  thirtysecond = $80
  sixteenth = $81
  eighth = $82
  quarter = $83
  half = $84
  whole = $85
  
  song0_sq1:
      .byte eighth, C3    ;play a C eighth note
      .byte half, D5      ;play a D half note
  ```
- Ah, and the buffering part solves the problem that the tutorial mentioned before, that writing to the apu ports directly is bad form, and apparently that's the cause of that popping sound on the squares.
- > A better method is to buffer our writes.  Instead of writing to the APU ports directly, each stream will instead write its data to temporary ports in RAM.  We'll keep our loop order, so sfx streams will still overwrite the music streams.  Then when all the streams are done, we will copy the contents of our temporary RAM ports directly to the APU ports all at once.
- And finally, rests.
- > We will handle rests by considering a rest to be special case note
- This one adds a couple more songs, and the 4th one uses the rests so I'll hardcode it to that, now doing the familiar dance of removing the drawing stuff
- Did that, and hardcoded the song number.
- And removed the controller stuff! Damn, I'm getting good. Now to do the NSF
- Done! Wow. Amazing, I can go on to the next one, [[Nerdy Nights Sound: Part 7: Volume Envelopes]]