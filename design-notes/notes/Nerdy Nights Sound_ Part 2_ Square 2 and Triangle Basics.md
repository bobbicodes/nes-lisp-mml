- Ok, this one went really easy. Other than the different boilerplate these seem exactly the same, so all I had to do was paste in the code for the middle part:
- ```asm
  ;Enable sound channels
      lda #%00000111 
      sta $4015 ;enable Square 1, Square 2 and Triangle
      
  ;Square 1
      lda #%00111000 ;Duty 00, Length Counter Disabled, Saw Envelopes disabled, Volume 8
      sta $4000
      lda #$C9    ;0C9 is a C# in NTSC mode
      sta $4002   ;low 8 bits of period
      lda #$00
      sta $4003   ;high 3 bits of period
      
  ;Square 2
      lda #%01110110  ;Duty 01, Volume 6
      sta $4004
      lda #$A9        ;$0A9 is an E in NTSC mode
      sta $4006
      lda #$00
      sta $4007
  
  ;Triangle    
      lda #$81    ;disable internal counters, channel on
      sta $4008
      lda #$42    ;$042 is a G# in NTSC mode
      sta $400A
      lda #$00
      sta $400B
  ```
- Oh it also added vblankwait1, clearmem, and vblankwait2, and simplified the reset part.
- [[Nerdy Nights Sound: Part 3: Periods and lookup tables]]