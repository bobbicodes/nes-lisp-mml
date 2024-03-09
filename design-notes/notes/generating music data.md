- Ok so I'm hoping this turns out to be easy and kind of silly to have its own page, but I also know better  than to confidently say things like that. Here we go
- Simplest thing would be to just use the same data format, adhering to it as closely as possible.
- We now have a function called `assembleDriver` which takes 4 arrays representing the channel data streams.
- I connected assembleDriver to playNSF and it works perfectly!
- Now we just need to modify `audio.assembleStream` to handle our volume and duty changes.
- ```js
  export function assembleStream(notes) {
      let stream = []
      for (let i = 0; i < notes.length; i++) {
          let l = notes[i].get("ʞlength")
          // Our maximum length is 30 frames, so need to separate longer notes
          if (l > 30) {
              let n = Math.floor(l / 30)
              for (let j = 0; j < n; j++) {
                  stream.push(30 + 128)
                  // Note A1 is our 0x00 which is MIDI number 33
                  stream.push(notes[i].get("ʞpitch") - 33)
              }
              stream.push((l % 30) + 128)
              stream.push(notes[i].get("ʞpitch") - 33)
          } else {
              stream.push(l + 128)
              stream.push(notes[i].get("ʞpitch") - 33)
          }
      }
      return stream
  }
  ```
- So this only handles length and pitch.
- What I want to do is make each key optional. So first it will look for a length, then volume and duty, and pitch last.
- Basic sine vibrato:
- ```clojure
  (defn vibrato [time rate width]
    (* width (sin (* rate time))))
  
  (for [t (range 0 5 0.1)]
        (vibrato t 1 1))
  ```
- Except to make this work, we need to enable [[literal pitch values]]