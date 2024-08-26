- Alright, so I guess the first step will be to, well... install it, lol. And first make sure it doesn't break anything else
- Got that done!
- Now it's time to do the bytecode compiler
- Oh yeah... I forgot I'm going to have to revamp the data stream address locations
- I suppose I could claim a bunch of space used by the other squares, which are currently taking up... well, enough to fit all three VRC6 channels tbh.
- square2 starts at $5080 while the base driver and its padding end at $1080
- So it's 4 banks for sq1 and 3 for sq2, I guess... well shit, my driver just uses so much damn space. Wait... maybe I can just make one bank for each channel and switch it as needed. I'll fucking switch banks every note and pay for the data if it means I can make it work. Let's try it.
- Oh anyway.... even if I can't figure it out right away, we could just use the vrc6 pulses for the parts that would otherwise be the 2A03! It's almost a form of bankswitching itself...
- So. Moving sq2 from $5080 to $2080.
- Hold on, let me paste my current banking table and addresses
- ```js
   const baseDriverPadding = new Array(0x1080 - baseDriver.length).fill(0)
    const sq1Padding = new Array(0x5080 - (0x1080 + sq1.length)).fill(0)
    const sq2Padding = new Array(0x8080 - (0x5080 + sq2.length)).fill(0)
    const tPadding = new Array(0xA080 - (0x8080 + t.length)).fill(0)
    const nPadding = new Array(0xB080 - (0xA080 + n.length)).fill(0)
    
    const bankingTable = [
  	// Offset 0x00000149 to 0x00000170
  	0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x0c, 0x0d,
      0x00, 0x00, 0x05, 0x06, 0x07, 0x08, 0x0c, 0x0d,
      0x00, 0x00, 0x00, 0x08, 0x09, 0x0a, 0x0c, 0x0d,
  	0x00, 0x00, 0x00, 0x00, 0x0a, 0x0b, 0x0c, 0x0d,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x0b, 0x0c, 0x0d,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x0b, 0x0c, 0x0d,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x0b, 0x0c, 0x0d,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x0b, 0x0c, 0x0d
  ];
  ```
- Cool, I got it! So now, VRC6 can be from $5080 to $8080.
- This seems to mean that P2 and SAW will both be addressed 0xF000, with just different banking. That's actually the only channel besides samples that will need switching on the first page
- Before I write the VRC6 bytecode assemblers, let's hardcode them to the actual bytecode to see if it works.
- ```
  $AD, $20, $00, $00, 
  $8D, $5B, $00, $00, 
  $8C, $9C, $00, $00, 
  $8B, $E6, $00, $00, 
  $8B, $3B,
  $AD, $10, $00, $00, $A0
  ```
- hmm, so we have a fixed bank which is for the samples, and I need to keep them there, in bank 6.
- So bank 7 will be shared among the vrc6 channels, and switch accordingly.
- For some reason, P1, which is addressed at $F000, needs to be set to bank $12. It's $6080 in the file. How does that make sense?
- Ah, it's because it repeats! It really needs to be $06. Cool. And P2 works too!
- Now for the saw:
- ```
  $AD, $40, $00, $00,
  $8F, $44, $00, $00,
  $8E, $69, $00, $00,
  $8D, $9A, $00, $00,
  $8C, $D6, $00, $00
  ```
- It works! It all works!
- ## Bytecode compiler time
- Alright... here we go. It works with our hardcoded streams, so now the fun begins to generate them.
- The question is... should we have separate assembler functions for the 3 streams. Probably not for the pulses but maybe the saw I think.
- Also like... how different will it be from the other streams? Is the calculation different?
- It's the same formula for the pulses... though I'm having trouble confirming it works...
- With the regular square, C1 is 65.4 Hz, which is $06AD, or period 1709.40.
- Oh! It's because the register value also has the duty, which in famistudio is adding $80 to the pitch hi byte.
- So we'll use the same stream assembler, but just make a new formula for the saw which is different because it divides by 14 instead of 16.
- Oh shit. Why did I just think of this. We do need another function because it works totally differently...
- Alright. So here's how it's different. When there's a note length, we have to push `0xAD, length, 0, 0`.
- I'm getting sound out of it... it's actually playing twice as slow. Why would that be?
- Oh. I think it's because of the extra zeroes I pushed, when it needs to actually do that only if it's a rest I think
- Huh. this is confusing. I don't know why it's not swallowing the rest like it was before. It's putting a rest in between each note and I don't know how to get rid of it and still play the note. I might need to go back to the drawing board.
- ## VRC6- friendly bytecode?
- Ok what's our lowest note again
- Oh wait a minute... the high byte... has the enable bit in the first digit. Meaning that the actual pitch value is not that, as we encountered earlier....
- In other words, **the lowest note is not $8D5B. It is $0D5B.**
- Which means the original bytecode format is fine!
- ## And it's done!
- Cool. It all works. The only thing really left now is to figure out how to change volume and duty.
- Oh shit, it actually almost works, because they work by opcodes iirc. So I might not even have to change the driver, only adjust the bytecode to write the proper duties for the vrc6 pulses