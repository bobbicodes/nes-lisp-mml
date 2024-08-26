- I'm having a hard time even remembering how the noise channel is different.
- And the previous drums from Asterix aren't working. Probably because of volume? Here's the function now:
- ```js
  export function assembleNoise(notes) {
      let stream = []
      let totalLength = 0
      let loopPoint = s1 + streams[0].length + streams[1].length + streams[2].length
      for (let i = 0; i < notes.length; i++) {
          if (notes[i].has("ʞloop")) {
            if (notes[i].get("ʞloop") === "ʞend") {
              // loop opcode $A5 followed by the address to loop to
              stream = stream.concat([0xA5], fmtWord(loopPoint))
            } else {
              // set loop point variable and loop counter
            loopPoint += stream.length + 2
            stream.push(0xA4, notes[i].get("ʞloop"))
            }
          }
          if (notes[i].has("ʞlength")) {
            const l = notes[i].get("ʞlength")
            stream.push(Math.min(25, l) + 0x80)
            noiseLen = l
          }
          if (notes[i].has("ʞvolume")) {
            stream.push(notes[i].get("ʞvolume") + 0xe0)
          }
          if (notes[i].has("ʞduty")) {
            stream.push(notes[i].get("ʞduty") + 0xf0)
          }
          if (notes[i].has("ʞpitch") && (noiseLen != 0)) {
               // deal with lengths > 25
               const reps = Math.floor(noiseLen / 25)
               for (let i = 0; i < reps; i++) {
                  stream.push(notes[i].get("ʞpitch"))
               }
               // switch length to remainder
               stream.push((noiseLen % 25) + 0x80)
               stream.push(notes[i].get("ʞpitch"))
               totalLength += noiseLen
          }
      }
      stream.push(0xa0)
      if (totalLength > songLength) {songLength = totalLength}
      return stream
  }
  ```
- I think I got it.