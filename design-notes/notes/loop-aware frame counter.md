- I'm scared this is going to be annoying. We have 2 levels of loops to account for, which means looking for either `loop` or `arp` in the assembled music data.
- ## What if...
- We could just locate the last byte of the driver, and have it send a stop signal when we get to it.
- I must have thought of this before, but decided against it because it was easier to just count them. Now that is no longer the case.
- So this would happen when we assemble the driver... well it's the last byte.
- There's no reason for the emulator to be running all of the time! We need to just run it in batches that are more comfy for audio buffering. And yes, we will specifically look for when we get to the last byte of each stream so we can stop.
- This data is in the `streams` array, which I'm now exporting from the nsf module.
- In the main thread we're already checking the program counter to see if it's `0x3ffd`. Why that address? It's supposedly the nops after the play-routine, which means it finished, so it sets playReturned to true, and the next time it runs it sets the PC to `0x3ff8`.
- It does a similar thing for init, but looking for address `0x3ff5`. What's with these numbers? I thought the play address was 0x8000, lol
- When the instruction is read, well first we AND the address with 0xffff:
- ```js
  adr &= 0xffff
  ```
- Then, if it's over 0x4020, it's read by the mapper
- ```js
  export function read(adr) {
      if (adr < 0x6000) {
          return 0;
      }
      if (adr < 0x8000) {
          return prgRam[adr & 0x1fff];
      }
      if (banked) {
          let bankNum = (adr >> 12) - 8;
          return romData[banks[bankNum] * 0x1000 + (adr & 0xfff)];
      } else {
          return romData[adr & 0x7fff];
      }
  }
  ```
- hmm, well that doesn't exactly help. We just read the address from the romdata.
- Maybe the key is when we build the romdata:
- ```js
  romData = new Uint8Array(0x8000);
  // fill the romdata
  for (let i = loadAdr; i < 0x10000; i++) {
    if (0x80 + (i - loadAdr) >= data.length) {
     // we reached the end of the file
     break;
     }
     romData[i - 0x8000] = data[0x80 + (i - loadAdr)];
  }
  ```
- 0x8000 is *subtracted* from the address... wait, what
- We loop from the loadAdr to 10000. Ok. *Then* we subtract 0x8000, copying it into 0-whatever.
- Alright. I think I just spent like the past hour getting a little bit less confused.
- So why do we look for `0x3ffd` for the play address? God, I still don't get it.
- I think I need to eep. So uh, note for tomorrow. Maybe like, log some messages, or even put a div on the page to display and update the values to see what is being read where. nini
- The loadAdr is 32768, 0x8000.
- oh. It's because 0x3ff1 - 0x4000 is the special call area used internally by the player!
- This is a different problem from this page. Let's make [[decouple audio emulation from animation loop]]
- ## The first way
- I feel like this shouldn't be so bad. Let's just play around with it.
- What data will the function operate on? Not the assembled driver I hope...
- It could even be in Lisp... it could receive the same streams as play...
- We could do it in assembleStream while it's being already processed.
- We still have the `currentLength` and `totalLength` variables. We just need to make it so when there is a loop, it will multiply the length of the section by the number of times, then add it to the total. ok cool
- But it might be good to make a standalone function.
- Input can be the `streams` array.
- Ok I think I got it. Modified assembleStream and assembleNoise to conditionally update the existing `songLength` variable. That way we get the length of the longest stream.
- That seemed to work great! For once it worked out to be easier than I expected.
- So, I guess back to [[decouple audio emulation from animation loop]]