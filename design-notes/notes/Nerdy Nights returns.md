- I'm going to go back through it now that I can understand it better. I'll actually go back through each part and summarize what I'm getting out of it.
- ## Part 1
  collapsed:: true
	- This just describes the channels of the APU. We have the status register:
	- ```
	  APUFLAGS ($4015)
	  
	  76543210
	     |||||
	     ||||+- Square 1 (0: disable; 1: enable)
	     |||+-- Square 2
	     ||+--- Triangle
	     |+---- Noise
	     +----- DMC
	  ```
	- We have sq1 vol/duty:
	- ```
	  SQ1_ENV ($4000)
	  
	  76543210
	  ||||||||
	  ||||++++- Volume
	  |||+----- Saw Envelope Disable (0: use internal counter for volume; 1: use Volume for volume)
	  ||+------ Length Counter Disable (0: use Length Counter; 1: disable Length Counter)
	  ++------- Duty Cycle
	  ```
	- And sq1 period:
	- ```
	  SQ1_LO ($4002)
	  
	  76543210
	  ||||||||
	  ++++++++- Low 8-bits of period
	  
	  SQ1_HI ($4003)
	  
	  76543210
	  ||||||||
	  |||||+++- High 3-bits of period
	  +++++---- Length Counter
	  ```
	- That's pretty much it, there's a quick example that would just play a note:
	- ```
	      lda #%00000001
	      sta $4015 ;enable square 1
	   
	      lda #%10111111 ;Duty 10, Volume F
	      sta $4000
	   
	      lda #$C9    ;0C9 is a C# in NTSC mode
	      sta $4002
	      lda #$00
	      sta $4003
	  ```
	- And note that we're ignoring the hardware envelopes and length counters.
- ## Part 2
	- sq1 sweep is $4001, sq2 is $4005, and they work slightly differently but I don't care atm
	- It introduces triangle channel.
	- This example plays a chord on the 3 channels, but whatevs, I won't bother putting it here
- ## Part 3
	- This explains the period lookup table and how to look it up with ASL. That's all really.
- ## Part 4
	- Here's where we actually start building the sound engine. This first version has no tempo, and just uses a counter to wait a certain number of frames before playing the next note.
- ## Part 5: Sound Data, Pointer Tables, Headers
	- Ok this one introduces the data streams and their variables in RAM
	- Lol, I just got to the part that explains the `cpx	#$06`, in `sound_play_frame`, which I was having trouble understanding what it was. It's the number of streams, but it's been wrong this whole time! Which might make sense why we were needing extra variables reserved, which I couldn't explain at the time. Let's change it back to 5.