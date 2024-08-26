- Well the good news is our *player* should handle it already
- ## Player functionality
- Here are the variables for the channel:
- ```js
      // dmc
      dmcInterrupt = false;
      dmcLoop = false;
      dmcTimer = 0;
      dmcTimerValue = 0;
      dmcOutput = 0;
      dmcSampleAddress = 0xc000;
      dmcAddress = 0xc000;
      dmcSample = 0;
      dmcSampleLength = 0;
      dmcSampleEmpty = true;
      dmcBytesLeft = 0;
      dmcShifter = 0;
      dmcBitsLeft = 8;
      dmcSilent = true;
  ```
- We could start by putting the registers on the page with the others
- ## Looking at FamiStudio driver
  collapsed:: true
	- This is how the .dmc file is included in `demo_ca65.s`:
	- ```z80
	  .segment "DPCM"
	  .incbin "song_journey_to_silius_ca65.dmc"
	  ```
	- So then this segment needs to be added to the config (modifying the start address and size so they make sense)
	- ```
	  MEMORY {
	    ...
	    DPCM:     start = $e000, size = $1FFA, type = ro, file = %O, fill = yes, fillval = $ff;
	    ...
	  }
	  
	  SEGMENTS {
	      ...
	      DPCM:     load = DPCM,     type = ro;
	      ...
	  }
	  ```
	- So let's find the sample loading/playing routines or whatever
	- ```z80
	  famistudio_music_sample_play:
	  
	      ldx famistudio_dpcm_effect
	      beq sample_play
	      tax
	      lda FAMISTUDIO_APU_SND_CHN
	      and #16
	      beq @not_busy
	      rts
	  
	  @not_busy:
	      sta famistudio_dpcm_effect
	      txa
	      jmp sample_play
	  ```
	- there's `famistuqdio_sfx_init` but I'm not sure if that's used for music samples, probably is because there's no dpcm_init or anything
	- ok so it jumps to `sample_play`, which is the bulk of the routine
	- ```z80
	  sample_play:
	  
	      @tmp = famistudio_r0
	      @sample_index = famistudio_r0
	      @sample_data_ptr = famistudio_ptr0
	  
	  .if FAMISTUDIO_USE_DPCM_BANKSWITCHING || FAMISTUDIO_USE_DPCM_EXTENDED_RANGE
	      ; famistudio_dpcm_list + sample number * (4 or 5)
	      sta @sample_index
	      ldy #0
	      sty @sample_data_ptr+1
	      asl
	      rol @sample_data_ptr+1
	      asl 
	      rol @sample_data_ptr+1 ; Will clear carry
	  .if FAMISTUDIO_USE_DPCM_BANKSWITCHING
	      ; Multiply by 5 instead of 4.
	      adc @sample_index
	      bcc @add_list_ptr
	          inc @sample_data_ptr+1 
	          clc
	      @add_list_ptr:
	  .endif
	          adc famistudio_dpcm_list_lo
	          sta @sample_data_ptr+0
	          lda @sample_data_ptr+1
	          adc famistudio_dpcm_list_hi
	          sta @sample_data_ptr+1    
	  .else
	      asl ; Sample number * 4, offset in the sample table
	      asl ; Carry should be clear now, we dont allow more than 63 sample mappings.
	      adc famistudio_dpcm_list_lo
	      sta @sample_data_ptr+0
	      lda #0
	      adc famistudio_dpcm_list_hi
	      sta @sample_data_ptr+1
	  .endif
	  ```
	- then it continues
	- ```z80
	  @stop_dpcm:
	      lda #%00001111 ; Stop DPCM
	      sta FAMISTUDIO_APU_SND_CHN
	  
	      ldy #0
	      lda (@sample_data_ptr),y ; Sample offset
	      sta FAMISTUDIO_APU_DMC_START
	      iny
	      lda (@sample_data_ptr),y ; Sample length
	      sta FAMISTUDIO_APU_DMC_LEN
	      iny
	      lda (@sample_data_ptr),y ; Pitch and loop
	      sta FAMISTUDIO_APU_DMC_FREQ
	      iny
	  
	  .if FAMISTUDIO_USE_DELTA_COUNTER
	      lda famistudio_dmc_delta_counter
	      bmi @read_dmc_initial_value
	      sta FAMISTUDIO_APU_DMC_RAW
	      lda #$ff
	      sta famistudio_dmc_delta_counter
	      bmi @start_dmc
	  @read_dmc_initial_value:
	  .endif    
	  
	      lda (@sample_data_ptr),y ; Initial DMC counter
	      sta FAMISTUDIO_APU_DMC_RAW
	  
	  @start_dmc:
	  .if FAMISTUDIO_USE_DPCM_BANKSWITCHING
	      iny
	      lda (@sample_data_ptr),y ; Bank number
	      jsr famistudio_dpcm_bank_callback
	  .endif
	  
	      lda #%00011111 ; Start DMC
	      sta FAMISTUDIO_APU_SND_CHN
	  
	      rts
	  ```
- I created a simple nsf with famistudio so I can look at it in mesen. All it does is play 4 kicks.
- I will watch 4010-4015 in the debugger.
- Write `#$0F` to 4015
- write value to 4012 (DmcAddress)
- write value to 4013 (DmcLength)
- write value to 4010 (DmcFreq)
- write value to 4011 (DmcCounter)
- write `#$1F` to 4015
- then I heard the kick.
- # Hardware description
- from NESDEV: https://www.nesdev.org/wiki/APU_DMC
- I should familiarize myself enough that I can clearly explain how it works, which is no doubt a long way from where I am now.
- The DMC channel contains the following: memory reader, interrupt flag, sample buffer, [timer](https://www.nesdev.org/wiki/APU_Misc), output unit, 7-bit output level with up and down counter.
-
- ```
                           Timer
                             |
                             v
  Reader ---> Buffer ---> Shifter ---> Output level ---> (to the mixer)
  ```
- ## Registers
- **$4010** - flags (IRQ, loop) and rate index
- **$4011** - **Direct load** (7 bits)
- **$4012** - 8 bit Sample address, calculated by `%11AAAAAA.AA000000 = $C000 + (A * 64)`
- **$4013** - 8 bit Sample length, calculated `%LLLL.LLLL0001 = (L * 16) + 1 bytes`
- ## DPCM playback
- ### Memory reader
- When the sample buffer is emptied, the memory reader fills the sample buffer with the next byte from the currently playing sample. It has an address counter and a bytes remaining counter.
- When a sample is (re)started, the current address is set to the sample address, and bytes remaining is set to the sample length.
- *how does it know the sample length? Is there a terminal byte, like $FF?*
- It looks like it is $00.
- Oh... of course. It says it above, and it should have been obvious. It's written to $4013. I'm just having a slight bit of trouble understanding *how* the length is read. The byte at the location is $2E. That's the value in the accumulator when it does STA $4013, but the value written becomes $02E1.
- Let me try another one with a really tiny sample length, and see how it works.
- This time the value is $09, and the sample length is 145, or $0091.
- Oh, I guess that's still too long because it doesn't tell me anything.
- $03, which is $0031, or 49 bytes. ok...
- Oh! It's because of this shit: `%LLLL.LLLL0001 = (L * 16) + 1 bytes`
- Alright! mystery solved... as long as I can figure out wtf that means.
- $2E is 46. 46 times 16 is 736. Ok! That's it. That's all that means.
- ## Minimal example
- So now I'm going to try to create a minimal NSF that just loads a sample and plays it.
- So we still need to write $0F to $4015, as per NSF init docs.
- So I have a label at the sample data:
- ```z80
  sample:
      .incbin "bass.dmc"
  ```
- And then we write the address to $4012:
- ```z80
      lda	sample
      sta $4012
  ```
- omg I got it! wait... it plays in mesen but not mine, and won't import into famistudio
- now it works in famistudio but not mine.
- I made a commit  on the dpcm branch of my nerdy nights sound cc65 repo.
- Since I know that dpcm does work in my player, I think it might make sense to move on to the main driver, and try to add in the dmc.
- First I need to increase the number of streams.
- so like... we're not going to be writing to the dmc register each frame like the others. That happens in the se_set_apu routine. I guess I should make a routine called play_sample or something. I don't think this will be included in the soft_apu_ports because it doesn't make sense to.
- I have it fired by an opcode, which might even be reasonable... but it still doesn't work in my player!
- ## debugging dpcm
- Hold on... something's still not quite right in my minimal example.
- It's like... not calculating the address right. It's probably because of this:
- `%11AAAAAA.AA000000 = $C000 + (A * 64)`
- When I get it right, it should also work in mine.
- So... it needs to shift right 6 times and add it to $C000
- The actual sample address is $E000, which has an $A9. Then this becomes $EA40.
- ok so the load address is $8000. And we have to also subtract the header, which is... $40? No, it's $80.
- The sample begins at $C0 in the file. Which is 192. Subtract 128 ($80) gives us  64. So then add $8000?
- That's 32832, or $8040.
- That might be the problem. That's not even a valid address! We need to make it go later in the rom.
- wait... the dpcm segment is at $e000. But how? I'm all sorts of confused.
- ok, I got the address right, it works out to just use `#$01`, which points to $C040.
- These are the values I'm getting right before the sample plays in mesen:
- ![dpcm.png](../assets/dpcm_1719111676234_0.png)
- Now I'll compare it to the one which works in my player:
- ## The samples are being read as zeros
- Found out by sticking a log in the `cycleDmc` function.
- The problem might be in the `cpu.read` function. I'll get to the bottom of this.
- It still reads zeros even if I fill the rom with `$FF`s, so it's not like, reading from the wrong place, it's something else
- The dmcaddresses start at 49216 and go to 51360
- ## debugging
- ok reading adr 49216
- going to nsf mapper
- This rom doesn't go anywhere near that high.
- Wait...  neither do the other, working rom.
- oh, but it uses bankswitching...
- This is getting really muddy because I don't understand bankswitching at all, and I actually need to. But my first question is, how is the sample address read in the working player? I have it loaded into mesen, but how do I even learn this?
- Mesen *has* the sample at address $C040. How?
- It has the code starting at $8000, which is the load address.
- ## Adding to driver
- I made another stream for the sample notes, but something's messed up because the CPU crashes. Mesen reports invalid opcode.
- Now... I need to recalculate the proper sample address, that could be the problem
- ### Tracing
- $809A - sound_play_frame
- $80C5 - se_fetch_byte
- $80E5 - @note_length
- $8130 - se_do_noise
- $8146 - se_check_rest
- $815A - se_opcode_launcher
- $8173 - se_set_temp_ports
- $818E - se_set_stream_volume
- $81E8 - se_set_apu
- $824D - play_sample
- The sample data appears to be at $C400. So how do we calculate that?
- That is 50176, which is (16 * 64) + $C000
- Damn, it still crashes, even though the sample address is correct now.
- I got it! There had to be zeroes after the play_sample opcodes because the launcher assumes there's an argument there