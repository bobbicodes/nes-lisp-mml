- I suppose the ultra thorough way to do this would be to do the original tutorial, even though it uses NESASM. That way I'll be familiar with the style and workflow
- I downloaded NESASM3 and the sample project
- There's a fucking batch file that just runs
- ```
  NESASM3 background.asm
  pause
  ```
- And it works at least. So that's cool
- Let's make a repo... done.
- Now, let's look at the first folder of the translation, Nerdy Nights L3, and compare it to the original
- Yes, that's the first lesson with an actual working project, which I just assembled
- ## NESASM header
- ```
    .inesprg 1   ; 1x 16KB PRG code
    .ineschr 1   ; 1x  8KB CHR data
    .inesmap 0   ; mapper 0 = NROM, no bank swapping
    .inesmir 1   ; background mirroring
  ```
- ## ca65 header
- ```
  .segment "HEADER"       ; Setting up the header, needed for emulators to understand what to do with the file, not needed for actual cartridges
      .byte "NES"         ; The beginning of the HEADER of iNES header
      .byte $1a           ; Signature of iNES header that the emulator will look for
      .byte $02           ; 2 * 16KB PRG (program) ROM
      .byte $01           ; 1 * 8KB CHR ROM 
      .byte %00000000     ; mapper and mirroring - no mapper here due to no bank switching, no mirroring - using binary as it's easier to control
      .byte $0            
      .byte $0
      .byte $0
      .byte $0
      .byte $0, $0, $0, $0, $0    ; unused
  .segment "ZEROPAGE"
  .segment "STARTUP"
  .segment "CODE"
  ```
- nesasm sets the banking like this
- ```
    .bank 0
    .org $C000 
  ```
- ## Reset (same on both)
- ```
  RESET:
      SEI             ; disable IRQs
      CLD             ; disable decimal mode
      LDX #$40
      STX $4017       ; disable APU frame counter IRQ - disable sound
      LDX #$ff
      TXS             ; setup stack starting at FF as it decrements instead if increments
      INX             ; overflow X reg to $00
      STX $2000       ; disable NMI - PPUCTRL reg
      STX $2001       ; disable rendering - PPUMASK reg
      STX $4010       ; disable DMC IRQs
  ```
- ```
  vblankwait1:        ; wait for vblank to make sure PPU is ready
      BIT $2002       ; returns bit 7 of ppustatus reg, which holds the vblank status with 0 being no vblank, 1 being vblank
      BPL vblankwait1
  ```
- clearmem has minute differences
- ```
  clearmem:
      LDA #$00        ; can also do TXA as x is $#00
      STA $0000, x
      STA $0100, x
      STA $0300, x
      STA $0400, x
      STA $0500, x
      STA $0600, x
      STA $0700, x
      LDA #$fe
      STA $0200, x    ; Set aside space in RAM for sprite data
      INX 
      BNE clearmem
  ```
- Let's go on to the sound tutorial, and see if we can get that running
- [[Nerdy Nights Sound: Part 1: make a music/sfx engine]]