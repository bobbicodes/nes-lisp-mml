- So I guess what I'll do is make a minimal NSF that just plays a few samples
- The sound engine is 4096 bytes. the DPCM samples take 2 banks, 8192 bytes.
- It also says something interesting in the log - Project uses multiple dpcm banks, separate dmc files will be generated for each banks.
- I wonder if that's how you get past the limit? like have a pointer to another address? Hopefully I can learn how you can use so many.
- The limit is 63 sample mappings.
- ## Analysis
- So, I intend to label this rom in mesen according to the famistudio source
- First step will be to see if I can recognize *anything*
- Hey, I actually seem to have found the sample playback routine, which is just what I'm most interested in... oh yeah, this is how I learned how to do it in the first place...
- Huh, maybe we just need to *stop* the playing sample! I bet that's it!
- ```z80
  famistudio_sample_stop:
      lda #%00001111
      sta FAMISTUDIO_APU_SND_CHN
      rts
  ```
- Is that $4015? Yes it is! Could it be as simple as writing that before playing the sample? Let's try it.
- Unfortunately, changing that might have more of an effect on the rest of the driver than you'd think