- Ok so this is the part of the program that is the messiest. I want to break it into chunks so that each one will be simpler.
- It gets passed a note sequence and a stream number, which is used to index into the `streams` array
- This is how loop points are calculated. It provides a way to count the number of bytes that have been assembled already
- I suppose I'll make a new function called assembleDpcm, because the stream will be significantly different, even more so than noise, which also has its own.
- I need to load a sample into it in the first place...
- This is actually a different topic, like [[DPCM UI]]