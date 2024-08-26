- First I need to convert the timer bytes into a value, that''s $400A and bits 0-2 of $400B. It works like this:
- `%HHH.LLLLLLLL`
- So it would be like...
- 1. Take the value of $400B
- 2. bit-and it with 07 to get only the first 3 bits
- 3. multiply by 256
	- wait... this is wrong, right?
- 4. add the value of $400A
- apu.registers[reg] where 10 is 400a and 11 is 400b
- So that seems to work, but I don't know how to center the wave, because I don't even know how it works or how this is accomplished.
- ## Back up... what is an oscview?
- We draw once per frame, so we're showing 1/60 of a second of audio data.
- ## Well what we really want...
- Is the low part of the wave to be in the center of the view.
- This is kind of better done *graphically*, by looking for the lowest part of the wave, then drawing it centered.
- We can keep 2 frames worth of data, so that it gives us room to center it. We'll do that by keeping track of last frame's data.
- What I would do is measure the height of each pixel until we get to the low point.
- ![tri.png](../assets/tri_1719907073078_0.png)
- Here, that would happen at, let's just say that's 150 pixels.
- We would *advance* the current drawing such that that bottom part of the wave will be in the center, which is at 320 pixels.
- Ok so I take 2 frames worth of audio, and find the first part that has the bottom of the wave.
- We have the number of the bottom point. So we'll just add that to the part we draw
- ## What's up with this
- ![](https://cdn.discordapp.com/attachments/1152448123323551754/1257634159359168583/tri-wtf.png?ex=66851e95&is=6683cd15&hm=4b4a697f81ea0545512762eec9e732d0fd45119c38ef8d6ba40582bd8d06cdc2&)
- It's because I can't figure out how to save the previous frame's values, it was being replaced with the current ones
- This is so dumb, why can't I figure it out
- Instead of replacing the array of values, I need to make it twice as long, and append it each time, pushing the previous one back or something
- This seems like the idea
- ```js
  let myarray = new Float32Array(10);
  let myvals = new Float32Array(5);
  let myvals2 = new Float32Array(5);
  
  myvals.set([1, 2, 3, 4, 5])
  myvals2.set([6, 7, 8, 9, 0])
  
  myarray.set(myvals, 5)
  myarray.set(myarray.slice(5), 0)
  myarray.set(myvals2, 5)
  ```
- this builds the array `[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]`
-