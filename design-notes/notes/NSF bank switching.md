public:: true

- ## First failed attempt
  collapsed:: true
	- So, how does this work... Need to read wiki again, and look in our code, because afaik it still handles banked NSFs. I might bring back the import button because we're going to want it eventually, and it would be good to use it to check for this.
	- I also have some housekeeping to do because I did something to the assembleNoise function and I'm on a song branch.
	- Cool, that's done. I needed to use the new function.
	- Ok so bank switching. Yes, and put back the import nsf button.
	- There's a conflict with the songlength thing, and I think the proper way to solve it is to pass an option to runframe or whatever is checking the song length.
	- I'm going to need to look in the nsf mapper to see what happens with regard to banking.
	- It's all in mapper.reset:
	- ```js
	  export function reset() {
	      for (let i = 0; i < prgRam.length; i++) {
	          prgRam[i] = 0;
	      }
	      for (let i = 0; i < 8; i++) {
	          banks[i] = origBanks[i];
	      }
	      if (banked) {
	          loadAdr &= 0xfff;
	          let totalData = (data.length - 0x80) + loadAdr;
	          maxBanks = Math.ceil(totalData / 0x1000);
	          romData = new Uint8Array(maxBanks * 0x1000);
	          // fill the romdata
	          for (let i = loadAdr; i < romData.length; i++) {
	              if (0x80 + (i - loadAdr) >= data.length) {
	                  // we reached the end of the file
	                  break;
	              }
	              romData[i] = data[0x80 + (i - loadAdr)];
	          }
	      } else {
	          romData = new Uint8Array(0x8000);
	          // fill the romdata
	          for (let i = loadAdr; i < 0x10000; i++) {
	              if (0x80 + (i - loadAdr) >= data.length) {
	                  // we reached the end of the file
	                  break;
	              }
	              romData[i - 0x8000] = data[0x80 + (i - loadAdr)];
	          }
	      }
	  }
	  ```
	- So when building the rom image, we need to check if it will run over, and if so set the banking values in the header accordingly.
	- This chart looks important:
	- ```
	  NSF    Address      Register
	  ====   ==========   ========
	  $070   $8000-8FFF   $5FF8
	  $071   $9000-9FFF   $5FF9
	  $072   $A000-AFFF   $5FFA
	  $073   $B000-BFFF   $5FFB
	  $074   $C000-CFFF   $5FFC
	  $075   $D000-DFFF   $5FFD
	  $076   $E000-EFFF   $5FFE
	  $077   $F000-FFFF   $5FFF
	  ```
	- Uh... what if all I have to do is literally that, set the bytes in the header
	- The mapper.write function pokes those registers:
	- ```js
	  export function write(adr, val) {
	      if (adr < 0x5ff8) {
	          return;
	      }
	      if (adr < 0x6000) {
	          banks[adr - 0x5ff8] = val % maxBanks;
	          return;
	      }
	      if (adr < 0x8000) {
	          prgRam[adr & 0x1fff] = val;
	          return;
	      }
	      // rom not writable
	      return;
	  }
	  ```
	- I'm confused because if I divide the number of bytes in the music data streams by 0x1000, it would seem that I'd already need
	- Ii could look at the famistudio driver...
	- Do I need to like... write to the register to switch banks? I think that's how it works.
	- I could put a breakpoint where it writes those regs to see.
	- the banks array, when correctly set up, has each element set to the bank number, i.e. `[7 8 3 4 5 6 7 0]`.
	- This is how famistudio does it:
	- ```csharp
	  for (int i = 0, j = 0; i < 8; i++)
	    header.banks[i] = i >= 8 - driverBankCount ? (byte)(j++) : (byte)(i + driverBankCount);
	  ```
	- ok... so if `i` is at least 8 minus the number of banks,
		- then that index in the banks array gets the next digit starting with 0.
		- otherwise, it gets the index plus the bank count.
	- I don't quite understand, even when clearly described.
	- What even is the first question asking? Whether we're past 8-numbanks.
	- So if there are 5 banks, we would be asking whether we're past 3.
	- So the first 3 slots get set to its index + 5. So the final array would be
	- ```
	  [5 6 7 0 1 2 3 4]
	  ```
	- I still don't get what they mean.
	- Example overstuffed data:
	- ```clojure
	  (play
	    (concat sq1a sq1b lead3 lead3)
	    (concat sq2a sq2b sq2c
	      sq2-patt7 sq2-patt7 sq2-patt7 sq2-patt8
	      sq2-patt7 sq2-patt7 sq2-patt7 sq2-patt8)
	    (concat (apply concat (repeat 4 (bass 0)))
	      bass-verse bass-verse bass-bridge (bass 0) (bass 0))
	    (concat beat1 beat2 beat2 beat2 beat2 beat2 beat3))
	  ```
	- Let's print out the number of frames so we know just how many it chokes on.
	- 30098 is fine, that's the verse. I'll slowly add stuff until it fails.
	- 32495 works. Tried 33142 and we lost the last of the drums.
	- That's exactly 0x8000.
	- Let's follow a fs bankswitching. breakpoint at reg.
	- val=7, adr= 24568
	- 8, 24569
	- again, again, x 50
	- oh now it's writing 4 to 24574. Now 6. 4 4 5 1... more writes, all to same adr but different vals
	- so it constantly switches out the `$E000-EFFF` block with what I saw to be 1, 3, 4, 5, 6
	- I'm playing one with heavy dpcm use, and the *val*s being written are larger numbers like 17, 33, 23, 4, 5, 17, 26, 34... What are the numbers? Before, I assumed it was a bank number. What else could it be? They're also all written to the same address, 24574, for the E block.
	- I guess there can be any number of banks. I mean, one of the files, Ya Habib, is 151.7kB.
	- So what do the values mean? The `val` values, written to the register.
	- I'm trying it on mesen. What are the damn registers?
	- `$5FF8`-`$5FFF`.
	- It's a single subroutine which apparently switches banks. Only that one register.
	- I wonder if I can find this in the famistudio driver
	- It is `famistudio_dpcm_bank_callback` I think. At `@start_dmc`.
	- Then we hit `jsr $FC39`, the famistudio_dpcm_bank_callback.
	- It's here where it sets the `$5FF8` register.
	- ```
	  ; Must be enabled if your project uses more than 1 bank of DPCM samples.
	  ; When using this, you must implement the "famistudio_dpcm_bank_callback" callback 
	  ; and switch to the correct bank every time a sample is played.
	  ; FAMISTUDIO_USE_DPCM_BANKSWITCHING = 1
	  ```
- I'm thinking a better approach at the moment is [[music data optimizations]]
- ## bank switch opcode idea
  collapsed:: true
	- So yeah that was when I thought that bank switching was just a thing that you could set up that would magically give you more space, hahaha
	- Then when I realized that the driver has to actually write to the registers to switch the banks in order to use the additional space, I got intimidated and, rather intelligently said that the even lower hanging fruit would be to make the driver more efficient, and I did, massively, by implementing looping, and vibrato, which works by using looping.
	- But then when I implemented DPCM, I had to actually figure it out because once you are using samples you really need the extra space.
	- So I think I did it properly, by making an opcode for switching banks, so that the data streams can simply call them to switch when necessary, like when playing a sample which is located in another bank.
	- But I'm still pretty confused how it's supposed to work, and, well first of all... I still need to properly fill out the opcode that switches the banks because right now it is only able to switch banks 6 and 7, which were the ones I needed in order to play my 4 test samples, which took a whole page each,,  4080 bytes or whatever.
	- I suppose that could be workable. But I still don't really understand how to use it and the only way I think I will is through more experimentation.
	- Maybe I should reimplement the pause button, so I can use it to debug stuff. Yeah, let's do that because it will lead to clearer understanding anyway.
	- I say reimplement because it existed in the debugger version of NesJs which I based the emulator on.
	- I added buttons for pause (which also becomes resume), run frame, and step. Now I need to see how they're wired up
	- pause, resume and run frame work great! I'm gonna hold up on step for now because it's more complicated, and I think this is enough.
	- Cool! Now I can display some information on the page that will be useful for our problem, like showing the banks and where the data falls between them.
	- Ah, so my old modules work if I turn off bank switching. But how do I find out when I need to use it? What information would be useful to get some sort of insight?
	- 0x8000 seems to be the limit for 1 bank.
	- So we can check if the driver + data is more than that and if so, it will use the banking strategy. How will that work?
	- ## Banking strategy
	- What seems logical to me would be to divide it by channel, like put each channel in its own bank. But there will be cases where it's just like... one channel that has a huge amount of data, what then?
	- It could be possible to identify the bytes that are out of range, and change banks in order to make them valid? I think maybe I should experiment in cc65? Nah, I actually think staying within my system is preferable. I want to take a just-failing NSF and try to figure out why it fails, and how it would be fixed.
	- Like, it fails *instantly*. Well, sometimes it doesn't! But this one I made now does. Let's try to find out why.
	- I'm thinking maybe that the file gets corrupted when it loads or something. But here, let's try to step through it
	- ## Debugging an overstuffed NSF
	- Loading at $8000. Init, sound load. Now we're going to play the first frame.
	- Going to fetch the first byte.
	- The sound pointer is at $83A1. It's a $99, a note length
	- Then we have a $00. This is stream 0, which is silent for quite awhile. this track starts with only triangle
	- Now we're up to the noise channel, which is where it messes up. It's supposed to start with rests but it plays noise. Let's see what happens.
	- Fetching byte, it's a 0.
	- Oh wait. That shouldn't be, it should be a note length.
	- At first it plays the triangle for a bit while blanketed in white noise. Then it violently crashes, it sounds pretty neat actually
	- Yeah I'm comparing the code in the disassembler of the emulator to the NSF, and it looks like what might be happening is the code ends up rewriting itself.
	- ```
	  00: 99 00
	  01: 99 00
	  02: A4 81 01 81 02 81 02 81 03
	  03: 00 00 00 00
	  ```
	- This is the magic formula for finding where an address points to in the file:
	- ```clojure
	  (hex (+ 0x80 (- 0xb7ff 0x8000)))
	  ```
	- The pointer to stream 1 is supposed to be $b7ff, but it's instead looking at $bdA5. And indeed, there it is.
	- Triangle stream: $E09F. In Mesen: $E645. And it's there, but... I can already tell that there isn't room for the noise because it's very close to the end!
	- Noise stream: $FAD7. In mesen, this becomes $107D
	- It should start with a 99, for a rest. but it doesn't, because that isn't even there. Great!
	- ## How would we accomplish this with bank switching?
	- Come to think of it, there may not be room for the triangle part either. Actually, I'm pretty sure there isn't, because the beginning of the noise part isn't even there.
	- Would it make sense to just switch out one bank?
	- ## Let's try one
	- Ok, so my idea is to make a song with bank switching that fails, and do what I just did to find out why. Then it will be easier to see how we could switch them.
	- What banking arrangement should I start with?
	- I'm sort of tempted to... well, yikes. I really want to try just switching out the last one, but that would require recompiling my driver to let me switch the last one. Still, it seems like the cleanest way for me to learn it. And I'm gonna want to do that anyway...
	- Alright, here we go... got it built, now the tedious part of installing it. It will be worth it because it was necessary anyway!
	- I think I got it already! That was fucking fast!
	- Damn, it doesn't hold much before it farts out.
	- I'll start with just the triangle. It *almost* holds all of the parts:
	- ```clojure
	  (play
	    {:triangle
	         (concat (loop1 3 bass) bass2 (loop1 2 bass3)
	      (loop1 2 bass4) (loop1 2 bass5) bass6)})
	  ```
	- Hold on, I'll start by analyzing the one that actually works. Same without bass6.
	- Coming back to this, got distracted by making a song, hahaha
	- Triangle stream is at $83E5. Noise: $90BD. DMC: $90BE
	- Tri:
	- ```
	  00000460            :   A4 03 81|01 C4 81 02:3A 81 02 A6
	  00000470 81 03 89 81:04 74 99 05|4C 8A 05 4C:81 00 ...
	  ```
	- Fetching:
	- ```
	  00: A0 (End stream)
	  01: A0
	  02: A4 03 81
	  03:
	  ```
	- ok here we go. Fetching the first (and only) noise byte at $90BD. It's supposed to be a $A0.
	- It has a $20 there. Why?
	- It's because the bank beginning with $9000 is set to bank 0, which repeats the first one, at $8000! That makes sense! So we just need to change it to 1!
	- Which means we should do what famistudio does, and use 0,1,2,3,4,5,6,7
	- And it works! Yes!
	- However... it's still failing when I try to make one bigger than what used to be possible. Why would that be?
	- It fails even before that, actually. It's like there's too much data in the square channels which is causing the triangle to go out of sync.
	- ## New failing file
	- Here we go again. Making progress!
	- sq1 pointer: $83E3
	- sq2: $B55E
	- tri: $DDFE
	- noise: $F836
	- DMC: $F837
	- Let's check these, because there's a chance it could be a bug in the driver. I did just install this, and extremely quickly.
	- sq1
	- ```
	  00000460          99:00 00 00 00|00 00 00 00:00 00 00 00
	  00000470 00 00 00 00:00 00 00 00|00 00 00 00:00 00 00 00
	  00000480 00 00 00 00:00 00 00 00|00 00 00 00:00 00 00 00
	  00000490 00 00 00 00:00 00 00 00|00 00 00 00:00 00 00 00
	  000004A0 00 00 00 00:00 00 00 00|00 00 00 00:00 00 00 00
	  000004B0 00 00 00 00:00 00 00 00|00 00 00 00:00 00 00 00
	  000004C0 00 00 00 00:00 00 00 00|00 00 85 00:00 A3 B0 A4
	  000004D0 02 81 00 00:81 00 00 81|00 00 A2 04:81 00 00 A2
	  ```
	- sq2
	- ```
	  000035D0            :           |           :      99 00
	  000035E0 00 00 00 00:00 00 00 00|00 00 00 00:00 00 00 00
	  000035F0 00 00 00 00:00 00 00 00|00 00 00 00:00 00 00 00
	  00003600 00 00 00 00:00 00 00 00|00 00 00 00:00 00 00 00
	  00003610 00 00 00 00:00 00 00 00|00 00 00 00:00 00 00 00
	  00003620 00 00 00 00:00 00 00 00|00 00 00 00:00 00 00 00
	  00003630 00 00 00 00:00 00 00 00|00 00 00 00:00 00 00 00
	  00003640 00 00 00 00:00 85 00 00|A4 02 A2 06:A3 B0 81 01
	  00003650 52 A2 05 A3:70 81 01 1C|A2 04 A3 70:81 00 E1 A2
	  ```
	- tri
	- ```
	  00005E70            :           |           :      A4 03
	  00005E80 81 01 C4 81:02 3A 81 02|A6 81 03 89:81 04 74 99
	  00005E90 05 4C 8A 05:4C 81 00 E1|81 01 1C 81:01 52 81 01
	  00005EA0 C4 86 00 00:81 01 2D 81|01 7C 81 01:C4 81 02 5C
	  00005EB0 86 00 00 81:01 FB 81 03|F8 81 07 F1:87 03 F8 81
	  00005EC0 01 C4 81 03:89 81 07 13|87 03 89 81:01 C4 81 03
	  00005ED0 89 81 07 13:81 02 3A 81|02 30 81 02:27 81 02 1E
	  00005EE0 81 02 15 81:02 0D 81 02|04 8A 00 00:81 02 3A 81
	  00005EF0 02 33 81 02:2D 81 02 26|81 02 20 81:02 1A 81 02
	  00005F00 14 81 02 0D:81 02 07 81|02 01 8A 00:00 81 00 E1
	  00005F10 81 01 1C 81:01 52 81 01|C4 86 00 00:81 01 2D 81
	  00005F20 01 7C 81 01:C4 81 02 5C|86 00 00 81:01 FB 81 02
	  ```
	- And noise is left empty because it didn't matter, it already fails with the first 3.
	- It's like a looping problem. It's not looping back to the right place. But... it only does this when the square channels are sufficiently populated.
	- It's the very first loop that messes up Let's check it out.
	- ```
	  00: 99 00 00
	  01: 99 00 00
	  02: A4 03 81
	  ```
	- I want to find the part where it loops back
	- hehe it's actually pretty far down. This shit takes a lot of data
	- Anyway, the address is $DE01.
	- It looks like it's wrong, actually. It's pointing back to a note pitch, when it should be getting the length first. That's why it gets out of sync! But why would that happen?
	- It must be because the note length was set by the square channel! That is, it's a bug in the driver assembly that calculates the loop points!
	- I should confirm this by making a smaller example
	- I think I found the bug. Yep, I forgot to change one of the places that was pointing to the first stream, which is how the loop points are calculated. Because the length of the header itself increased from 29 to 36 bytes when dpcm was added, but I only updated one of the places that calculates it.
	- It's these darn volume envelopes, that I don't even use and it just makes the code more complicated.
	- ## Now the actual problem
	- So, that was not actually what was causing the problem where it runs out of space. So now I have this:
	- ```clojure
	  (play
	    (concat (r 1280) (concat [{:duty 2}] (loop1 2 sq1) (loop1 2 sq1a)
	      [{:volume 4 :duty 0 :pitch 160 :length 1280}] (loop1 2 sq1b) 
	     [{:duty 2}] (loop1 2 sq1) (loop1 2 sq1a) (loop1 2 (concat (loop2 2 sq1c) sq1d))))
	    (concat (r 1280) (loop1 2 sq2) (loop1 4 sq2a) (loop1 4 sq2b)
	      (loop1 2 sq2) (loop1 4 sq2a))
	    (concat (loop1 3 bass) bass2 (loop1 2 bass3)
	      (loop1 2 bass4) (loop1 2 bass5) bass6 (loop1 2 bass5) bass6
	      bass bass2 (loop1 2 bass3) bass)
	    (concat [{:volume 0 :length 640 :pitch 0}]
	      (loop1 54 beat)))
	  ```
	- It pretty much immediately crashes. Exactly like when we had the overstuffed thing before, just now, well... ok, so it's the same thing. Same amount of space, we didn't magically get more space because we were using 8 banks before too, not just one.
	- So how the fuck do I make more space available? From what I'm seeing, it's still just the same 8 banks. Unless...
	- Maybe it can be higher than 8?
	- Yes, it looks like that's the case!
	- Here is the NSF mapper read function:
	- ```js
	  export function read(adr) {
	      //console.log("reading adr " + adr)
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
	- What the fuck is this doing?
	- `banks` is the array of 8 bytes from the NSF.
	- `bankNum`... wtf is that? We take the address and shift right 12, then subtract 8. Why?
	- I'm not sure if it matters, actually. I suppose it's good enough to know that the bank number can be anything
	- Let's look in the debugger to see some mapper read examples
	- Ok, here we have one where the address is 65532, or $fffc.
	- so we go right 12, which is $f, and subtract 8, which gives us $7
	- That's the bank number. Huh?
	- okay, so it works out that $8000 is bank 0, $9000 is 1, etc.
	- ## ok! so let's figure out how to switch out the last bank or something
	- So what's with the file here.
	- Everything after 0xffff, which works out to $807f in the file, is after bank 8 (starting from 1)
	- So everything from $8080 to $9080 in the rom are bank 9
	- What I'd do for this particular one, is put the noise in bank 9.
	- Actually, the triangle doesn't even fit!
	- So say we put the triangle on page 9. Seems like then we're gonna have to switch every note... that actually sounds wasteful. Because then it needs to switch back...
	- Also... the loop points are off. The stream locations... everything needs to be recalculated because, well the pointer to the noise stream is listed as $10BF. Why?
	- s4 is 65727. That gets converted to a word and overflows, giving... $10BF. See, this all makes sense somehow... so what do we do?
	- We have to know at assembly time that it's going into bank 9 (or 10? 11?), but the address will be calculated as if it's in bank 8. Make sense?
	- I honestly don't know. It doesn't make sense, because while we can use a higher address for additional banks, we can't use those addresses in the code, because they're not... addressable!
	- This hurts my brain. I need a simple example, like this noise stream. What do we address it as? Whatever it would be if it was in bank 8!
	- See, the purpose of additional banks is not to use higher addresses like I was thinking before. It's so we can treat it like it's in one place when it's actually in another.
	- So the noise stream... well, even the triangle stream will go in bank 9 I guess. Let's try to do it.
	- We're gonna change this:
	- ```js
	    s2 = sq1.length + s1
	    s3 = sq1.length + sq2.length + s1
	    s4 = sq1.length + sq2.length + t.length + s1
	    s5 = sq1.length + sq2.length + t.length + n.length + s1
	  ```
	- We'll just put the triangle in bank 9, which will be switched with 8, and therefore addressed as 8.
	- Same with each of them I guess. Each stream will be placed at the beginning of a bank, and thus will be addressed like so:
	- The driver itself is, well the song header is at $83BF, which is still bank 0.
	- If we put sq1 at page 9, it will waste $c41 bytes. I guess I don't care, because if I do it right it will be fine. So... let's just try that much.
	- I created a new branch for this called bank-switching, because I'm about to tear this shit up.
	- ## New driver layout
	- So, there's this `s1` value, which points to the first stream. It was dependent on the length of the volume envelopes, but now it will not matter because we're just gonna put it on the next page, so we'll call it $9000.
	- So in some ways, it's easier this way! Don't calculate it, just put it on the next page!
	- Ok. `s1` defined as 0x9000 Let's see wherever it is used.
	- First of all in the `addEnvelope` function.
	- That can just come out, because it doesn't need to be recalculated anymore...
	- Cool, and the only other place is where it is used to calculate the other streams! I'll just leave those for now, because it won't hurt anything for now.
	- Testing just the first channel:
	- ```clojure
	  (play
	    {:square1 
	     (concat (r 1280) (concat [{:duty 2}] (loop1 2 sq1) (loop1 2 sq1a)
	      [{:volume 4 :duty 0 :pitch 160 :length 1280}] (loop1 2 sq1b) 
	     [{:duty 2}] (loop1 2 sq1) (loop1 2 sq1a) (loop2 2 sq1c)))})
	  ```
	- So now to make this work... we need to.... well let's cut a file and look at where it put it now.
	- Huh... I haven't even yet, but just looking at the code... it's still putting it right in line which is wrong. What we need to do is pad it with enough zeros.
	- That's between songHeader and sq1 where they will go
	- Let's see, to make it work I need to seal off the other streams with A0, and have them in the header
	- ## fetching bytes
	- We got the $99! And the $00 for the pitch
	- And we're fetching the $A0 for stream 1. Good. Wonder why it don't play.
	- It plays the first frame, then dies. Program just quietly stops.
	- Maybe there are still hardcoded addresses in the thing. But like... everything is the same except for the data streams, which it successfully found!
	- I have an idea. I think it's getting stuck in the A0s, because it's not advancing because the locations are these:
	- ```js
	    s2 = sq1.length + s1
	    s3 = sq1.length + sq2.length + s1
	    s4 = sq1.length + sq2.length + t.length + s1
	    s5 = sq1.length + sq2.length + t.length + n.length + s1
	  ```
	- s1 is $9000. Then s2 is correct, because it's sq1.length + s1, that's how we get the A0.
	- But then next... sq2 doesn't actually exist. Well, it's an empty array so length 0. So it ends up being THE SAME A0! So then it just silences all the streams! It makes sense! And I've been up for quite a long time...
	- right now we can hack it by just making each one +1
	- Eh... That might not actually be what's happening. Damn, I thought it made sense but now that I think a bit more... no, that wouldn't matter
	- Oh wait... it fucking does work!
	- It doesn't play in mesen, maybe because it starts with so many rests so it thinks it's over?
	- Yeah, it works if I remove the rests!
	- Ok, so now we'll put each of the rest of the streams on other pages likewise.
	- To start we'll put them on $a000, $b000, $c000, $d000
	- Alright, it errored when compiling invalid array length, because there is a negative padding length because there is too much data for these sizes.
	- So here is where it seems maybe we could, well we need to insert another blank page.
	- The driver is alrready $44de after sq1. Which means it will need to go at $5080. Then...
	- ## We switch banks, motherfucker
	- So since our address for sq2 is $a000, and in the rom it actually appears at $e000, we should flip bank 3 to block 7. Yep.
- ## switch in driver fetch routine
- Since we're going to be switching banks quite possibly *every time we switch channels*, I'm thinking this should be a routine that occurs in the fetch_byte routine, and there could even be... what? Some way to encode that information. So that it will change x bank to y number depending on which channel it is. I was thinking it could be a value in RAM but then something would have to write to it, when actually this will just be part of the rom much like the song header address. Much like it reads the song header address to know where to jump to, it would read these values to know which bank contains the current stream!
- Damn, now I'm getting eepy, right when I finally got it... at least it's written right here.
- ## New day
- Reviewing this, I think it's a good idea, and one good thing is that it removes the burden of having to manage the bankswitching by the bytecode, which would be quite ridiculous to have to do for *literally every note*.
- So we will add a bit to se_fetch_byte that will switch banks depending on, say, a value in a tiny table we'll have. It will simply be 5 bytes, each one being which bank to switch to for that stream.
- The bank to be switched will be... I guess I'll try just switching 2-8. Is that silly? No, I think it might make sense.
- I've got the driver installed and it makes sound! I might just need to calculate the stream pointers and banks now
- Yeah to get it to build I have to calculate the pointers better.. er, correctly, lol
- sq1 starts at $1080 in the file, and ends at $44de
- which means it's gonna go at $5080
- This seems to work
- `(+ 0x80 (bit-shift-left (inc (bit-shift-right 0x44de 12)) 12))`
- or more readable
- ```clojure
  (-> 0x44de
    (bit-shift-right 12)
    inc
    (bit-shift-left 12)
    (+ 0x80))
  ```
- Alright, so I think it's mostly working but is buggy, and needs to be generalized so that it will calculate the points intelligently, rather than by me hard-coding the banks like I have.
- You know what... I'm just gonna leave it like this... well, I'll iron the bugs out
- I really couldn't care less that the file is 45KB. That's fine... and it means there's a ton of room to spare to fill the song out
- Does this make sense?
- ```js
  loopPoint = (stream.length + [s1, s2, s3][streamNum]) + 2
  ```
- yeah, I think it does. Damn, I was hoping there was a bug, lol. We take the beginning address, add the length of the current stream, and 2 for the loop opcode and the counter variable
- ## Test rom
- I have a minimal failing rom where it loops back too far. It's just one channel, and it won't do it if I make it shorter so it has something to do with its length.
- It's on sq2, which starts at $5080 in the file, and ends at $6284. So it's not a page boundary issue!
- So what possibly could it be? let's find out.
- Oh I just had a nasty thought. What if there are other places that read from the bytecode, and ends up not getting switched at the right time. I sure hope that's not it, because I don't want to have to install the driver yet again so soon
- So. We begin. Stream number is 0. Bank is 1
- ```
  00: A0
  01: A4 02 A2 06 A3 B0 81 01 52 A2 05 A3 70 81 01 1C A2
  02: A0
  03: A0
  04: A0
  ```
- So far, this driver seems solid! I'm thinking it must be a bug in the program, because I don't see how this could be wrong, it's too good
- Where is the byte that contains the faulty loop point?
- The part that's supposed to be there is not even there, it looks like! Why would that happen?
- Ah, I found an even smaller repro:
- ```clojure
  (play
    {:square2 (concat (loop1 2 (loop1 2 sq2a)))})
  ```
- It's just looping infinitely!
- I think I see why... oh, I guess not.
- This even fails:
- `(loop1 1 (loop1 1 {:volume 5 :pitch 50 :length 10}))`
- The bytecode is just this:
- ```
  00005080 A4 01 A4 01:A2 00 8A 02|F9 A5 04 A0:A5 04 A0
  ```
- (hex (+ 0x80 (- 0xb7ff 0x8000)))
- I can see the problem. The second loop is going back to the first, in other words the loop point did not advance 2 more bytes.
- The first loop point is set to $A002, which is correct.
- Oh I see. Hmmm. Yeah, it seems that's just how it works. It's because it's nesting loops, and you can't do that! So why did it work before, is the question?
- Wait... but the original failing one is not like that! Oh! There might still be a bug!
- And I can't seem to reduce it.
- This works:
- ```clojure
  (play
    {:square2 
     [{:loop 2}
   {:length 10}
   {:volume 6 :duty 2 :pitch 64}
   {:volume 5 :duty 1 :pitch 67}
   {:volume 4 :duty 1 :pitch 72}
   {:volume 4 :duty 1 :pitch 76}
   {:loop :end}
   {:loop 2}
   {:arp 2}
   {:volume 6 :duty 3 :pitch 64}
   {:volume 5 :duty 2 :pitch 67}
   {:arp :end}
   {:arp 2}
   {:volume 6 :duty 3 :pitch 59}
   {:arp :end}
   {:loop :end}]})
  ```
- Ah, this fails:
- ```clojure
  (play
    {:square2 (concat (loop1 1 sq2) (loop1 1 sq2))})
  ```
- It seems to only fail if it's a certain length! This is weird.
- It doesn't matter whether I use loop1, loop2 or a combination.
- ## Oh wtf... it's not even a loop issue
- It fucks up even if I remove the loops!
- It's a fucking lot of data, too.
- Oh! It is because we're crossing a page! Holy shit!
- ## ...it's crossing a page.
- alright, so it makes sense now! So what do we do?
- Switching to that block, means it only gets that block.
- We need to make it so the next block gets the next block.
- Right now we are in $d000, block 5.
- What if we set the banks to 5,5,5,5,5,6,7
- Thing is, to do that, we're gonna need an expanded table
- This is what I think will work
- ```z80
  banking:
      .byte 0,0,0,0,0,0,0,0
      .byte 0,0,0,0,0,0,0,0
      .byte 0,0,0,0,0,0,0,0
      .byte 0,0,0,0,0,0,0,0
      .byte 0,0,0,0,0,0,0,0
  
  ;;;
  ;;; se_fetch_byte reads one byte from the sound data stream and handles it
  ;;; Inputs:
  ;;; 	X: stream number
  ;;; 
  se_fetch_byte:
      txa
      asl
      asl
      asl
      tay
      lda (banking), y
      sta $5FF8   ;; switch banks to the blocks indicated by
      iny          ;; the values in the table for the current stream
      lda (banking), y
      sta $5FF9
      iny
      lda (banking), y
      sta $5FFA
      iny
      lda (banking), y
      sta $5FFB
      iny
      lda (banking), y
      sta $5FFC
      iny
      lda (banking), y
      sta $5FFD
      iny
      lda (banking), y
      sta $5FFE
      iny
      lda (banking), y
      sta $5FFF
  ```
- It's an 8-column table because then we can multiply the stream number by 8, transfer the result to y and we have the index of the beginning of that stream's row.
- We then do an indirect lookup 8 times, writing the value to the next register, increasing y each time.
- Checks out as far as I can tell.
- The assembler is telling me these are range errors...
- Maybe indirect is not what we want here...
- I suppose we just want absolute, plus the y value. ok
- y is the address of the beginning of the row, say it's 308.
- yes, y has to be added to banking to get the index. and it builds. Let's test it.
- Looks like it works!
- ## Installed, but confused and running out of gas
- Here's what I'm trying to get working:
- ```clojure
  (play {:triangle (concat (loop1 3 bass) bass2 (loop1 2 bass3)
      (loop1 2 bass4) (loop1 2 bass5) bass6 (loop1 2 bass5) bass6
      bass bass2 (loop1 2 bass3) bass)})
  ```
- Even this doesn't work:
- ```clojure
  (play {:triangle (concat (loop1 3 bass))})
  ```
- ok, I think I got it!