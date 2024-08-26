- So, I don't even know how to do this. The way it works now is by taking the same audio buffer that  gets sent to the speakers, so I don't have a per-channel output at all. I need to figure out how to do it.
- I'm starting with the triangle, but have no idea how to get the output and translate it to the screen.
- The first thing I tried was making a draw routine and a buffer which would be filled in `cycleTriangle` with the current triOutput, but that just gives us the actual tri step values (0-15) in order.... I would expect them to be repeated many, many times.
- Oh I see, I wasn't pushing the values on to the buffer every cycle.
- ok, so now we need to scale 0-15 to 0-360, but it also needs to go backwards
- ok, it's drawing triangles now! Now it just needs to be centered. But I kind of feel like implementing this for the other channels too, then figuring out a way to draw them onto the same canvas.
- To flip the output, I need to what...
	- If it's 0, I want that to be 24.
	- If it's 15
- Ok, got that right.
- ## Performance issues
- The performance seems connected to the actual number of pixels being drawn, so I wonder if I just make it smaller it will work.
- Though the primary goal is not real-time rendering, it's video export, I still want to have a view for now just to make sure I'm getting it right, before I move on to ffmpeg or whatever
- I suppose I'll figure out how to do what I actually need to do, which is render it onto the same canvas rather than separate ones.
- It's gonna get weird adjusting the format to how many channels are being rendered, but we already have that issue with any renderer. But it will have to adapt to the currently set number and number of columns. For now, since my song has 8 channels, I'll set it up for 2 columns and 4 rows
- ![oscview.png](../assets/oscview_1721176985496_0.png)
- So, square 1 will take just the upper left section.
- So if the whole thing is 640 x 360, it will be 0-320 on the X axis, and 0-90 on the Y.
- Cool, figured it out for the first one. Though instead of clearing the entire rectangle, it needs to only clear its corner.
- Here's how that all works:
- ```js
  function drawTri(vals) {
    //el('debug').innerHTML = vals
    p1ViewCtx.fillStyle = "rgb(0,0,0)";
    p1ViewCtx.fillRect(0, p1View.height / 4, p1View.width / 2, p1View.height / 4);
    p1ViewCtx.lineWidth = 4;
    p1ViewCtx.strokeStyle = "rgb(255,62,165)";
    p1ViewCtx.beginPath();
    const sliceWidth = p1View.width / 29781;
    let x = 0
    for (let i = 0; i < 29781; i++) {
      const y = p1View.height / 4 + ((p1View.height - (vals[i] * 24)) / 4)
      if (i === 0) {
        p1ViewCtx.moveTo(x, y);
      } else {
        p1ViewCtx.lineTo(x, y);
      }
     x += sliceWidth / 2;
     }
     p1ViewCtx.stroke();
  }
  ```
- Alright, the 4 basic channels are done! Now... well DPCM might be more complicated?
- So this one is underneath triangle
- Oh, that works great! Just needed to scale it to 0-127.
- Next: VRC6 P1
- Alright, last row!
- Saw is next.