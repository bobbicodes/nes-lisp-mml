- Ok so we just added looping which we realized can be coaxed into doing vibrato and arpeggios. The problem would be if we tried to do both. Or even like, arps inside of a loop wouldn't work because they don't nest. The counters are per-stream.
- Hmm, there's also transposition... no, that would still eat up bytes.
- ## How to solve?
- I can think of a couple ways to approach it but tbh I don't really like either... lol. They both seem hard
	- Make it so loops can nest
	- Give arps their own loops
- Yeah, it seems like making arps a first-class construct in the driver is the way to go. It's funny that looping can work... but I'm gonna want to do better.
- Arps can be stored like envelopes and changed with an opcode.
- [[bathtub blues]]
- Was going to port the "Smurf arps", but need to adjust because duties work different now. Actually, this is an `assembleStream` issue, since we now need to push opcodes to change duties.
- wtf do I even write to duty opcode? it passes straight to `stream_vol_duty`.
- Do I need to like... add it to something? Shift left 6 or some shit?
- I can't even find what reads it ever... it appears that it might not be set up to change duties at all.
- It checks it during `@set_vol` in order to OR the volume in.
- There's a whole section on **Multiple Finite Loops** in Nerdy Nights
- This would fix the issue.... and it's precisely why it's called Loop1!
	- To add another finite loop opcode you need to:
	- 1) declare another loop counter variable block in RAM (stream_loop2 .rs 6)
	  2) initialize the new loop counter to 0 in the sound_load routine.
	  3) add a new opcode for setting the new loop counter (se_op_set_loop2_counter)
	  4) add a new opcode to check the new counter and loop (se_op_loop2)
	  5) make sure to add the new opcodes to the jump table and give them an alias (set_loop2_counter, loop2).
- So we could start by having a dedicated one for arps.
- This is weird, though. I can't figure out what changes duty. They just show it being used like
- ```z80
  .byte duty, $B0
  ```
- or
- ```z80
  .byte duty, $30
  ```
- And why those numbers?
- I guess we need to shift left 7 and or it with `$30`
- I guess our possible values are
	- `$30` = 0
	- `$B0` = 1
	- `$70` = 2
	- `$F0` = 3
- I *think*.
- Maybe it goes in numerical order?
- I think this might work:
- ```js
  if (notes[i].has("ʞduty")) {
    stream.push(0xA3)
    const duties = [0x30, 0x70, 0xB0, 0xF0]
    stream.push(duties[notes[i].get("ʞduty")])
  }
  ```
- I miss the old, simple driver.
- I'm here trying to figure out duty when I haven't even implemented volume yet...
- We need to have it make a single volume envelope for every volume level used. I suppose right this moment we could do that manually but it would be a pain just to get a stabby arp chord.
- Nevertheless, that's how it works now
- Another optimization thing I thought of would be to make a function that just takes length/pitch pairs and creates our maps, to speed up the action in the interpreter.
- Another thing we could do is optimize `for` by having a special version that's only used if it's a single collection, and will just use javascript's for. And that would probably be the majority of cases.
- Argh, I'm all over the place today. So much stuff to be done. And for once... I actually feel like making music with this thing! Over at the [[bathtub blues]]