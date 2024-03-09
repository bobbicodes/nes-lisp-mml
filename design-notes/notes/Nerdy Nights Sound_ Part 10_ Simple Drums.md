- Noise "notes" are notes. Here is some example drum data:
- ```z80
  example_drum_data:
      .byte eighth, $04
      .byte sixteenth, $1E, $1E, $1F
      .byte d_eighth, $04
      .byte sixteenth, $06, $06, $08, $08
      .byte eighth, $17, $07
      .byte loop
      .word example_drum_data
  ```
- We need to modify the se_fetch_byte routine to check the channel and branch to different code if we are processing the Noise channel:
- ```z80
  .note:
      ;do Note stuff
      sta sound_temp2             ;save the note value
      lda stream_channel, x       ;what channel are we using?
      cmp #NOISE                  ;is it the Noise channel?
      bne .not_noise              
      jsr se_do_noise             ;if so, JSR to a subroutine to handle noise data
      jmp .reset_ve                   ;and skip the note table when we return
  .not_noise:                     ;else grab a period from the note_table
      lda sound_temp2     ;restore note value
      sty sound_temp1     ;save our index into the data stream
      clc
      adc stream_note_offset, x   ;add note offset
      asl a
      tay
      lda note_table, y
      sta stream_note_LO, x
      lda note_table+1, y
      sta stream_note_HI, x
      ldy sound_temp1     ;restore data stream index
   
      ;check if it's a rest and modify the status flag appropriately
      jsr se_check_rest
  ```
- Ok I actually got it! I had to implement it in the full engine with the volume envelopes and opcodes, oh well...
- Now to trim it and rip it...
- Done! And all checked in. This project wrapped up amazingly well.