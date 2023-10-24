- Alright so I actually feel like doing a dive into proper DSP. Felipe reminded me of polyBLEP when he linked me this: https://www.martin-finke.de/articles/audio-plugins-018-polyblep-oscillator/
- The article gives sources for 3 different techniques:
	- [Bandlimited Impulse Train (BLIT)](https://ccrma.stanford.edu/~stilti/papers/blit.pdf)
	- [Minimum-Phase Bandlimited Step (MinBLEP)](http://www.cs.cmu.edu/~eli/papers/icmc01-hardsync.pdf)
	- [Polynomial Bandlimited Step (PolyBLEP)](http://www.kvraudio.com/forum/viewtopic.php?t=375517)
- PolyBLEP is supposedly the easiest. The link above is a kvraudio thread... let's try wikipedia
- weird, it doesn't seem to have much here. I'm surprised
- Going through the Nerdy Nights NES sound tutorials. Great stuff.
- I really need to tackle this buffer thing. Basically, I want to compose a buffer instead of having each note be its own buffer.
- That is what I want to do, right? Actually now I'm not so sure. But I guess no harm would be done by trying to do it that way.
- It could be useful to try to make it work more like the NES, where the triangle channel is like a continuous note which changes frequency seamlessly. That sounds like a plan. I should see if I can append several notes together by passing a list of changes or something. So there will only ever be one buffer per channel.
- So... how is a triangle buffer created now?
- ```js
  function tri(note, dur) {
      const freq = midiToFreq(note)
      let buf = []
      for (let i = 0; i < ctx.sampleRate * dur; i++) {
          var q = quantizeTri(triangleWave(1 / ctx.sampleRate * i, 1 / freq))
          //console.log("time:", 1 / ctx.sampleRate * i)
          if (i < 150) {
              buf.push(q / (500 / i))
          } else if (i > (ctx.sampleRate * dur) - 200) {
              buf.push(q / (500 / (ctx.sampleRate * dur - i)))
          } else {
              buf.push(q)
          }
          
      }
      return audioBuffer(buf, dur)
  }
  ```
- So, there's nothing technically wrong with this. It fills an array with a sequence of values and passes it to `audioBuffer`. I'm actually not sure if it should need the duration.
- Ah, it does, because the buffer is cycled. But should it be? This could actually be wrong:
- ```js
  function audioBuffer(wave, duration) {
      const bufferSize = ctx.sampleRate * duration;
      const buffer = new AudioBuffer({
          length: bufferSize,
          sampleRate: ctx.sampleRate,
      });
      const data = buffer.getChannelData(0);
      const samples = take(bufferSize, cycle(wave))
      for (let i = 0; i < bufferSize; i++) {
          data[i] = samples[i]
      }
      return buffer
  }
  ```
- Okay I made the change:
- ```js
  function audioBuffer(vals) {
      const buffer = new AudioBuffer({
          length: vals.length,
          sampleRate: ctx.sampleRate,
      });
      const data = buffer.getChannelData(0);
      for (let i = 0; i < vals.length; i++) {
          data[i] = vals[i]
      }
      return buffer
  }
  ```
- So I think I want to pass an array of arrays, each containing a frequency and a time.
- At each time, what I think needs to happen is it will wait until the next zero point to change frequency. It's the only thing that makes sense I think.
- I'll start by simply creating a buffer consisting of 2 notes.
- I'll make a new version of the `tri` function which takes an array of notes instead of a note and a duration.
- The thing I need to decide is how the times should be expressed. I imagine the end goal will be to express them in beats, which will be converted to seconds with respect to the tempo. So I think right now I should just worry about taking the number of seconds. So the call will be something like
- ```clojure
  (tri [[40 0] [42 0.5]])
  ```
- Should it take a note-off time as well? Yeah, I think I will. So it would actually be
- ```clojure
  (tri [[40 0 0.5] [42 0.5 1]])
  ```
- I'll have to resolve cases of overlap, which will not be allowed, but in the case where overlapping notes are passed in, it will handle it a certain way. It might be tricky, because if it's calculating them in order, and it gets to one with a start point that is already passed, what do we do? I think I would expect it to "override" the previous one but that would require backtracking. Unless... see I don't yet know how it's going to work. Can I just assume for now that there will be no overlaps?
- ## Visualizer
- I want to make an audio graph. This ought to be fun. I have my SVG library to refer to to hook up the element to the editor.
- I added the svg-out element. These are the rendering functions:
- ```js
  var svgDiv = document.getElementById("svg_out")
  var svgGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgDiv.appendChild(svgGroup);
  
  function appendPath(d, color) {
      var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
      newElement.setAttribute("d", d)
      newElement.style.stroke = color || "black"
      newElement.style.strokeWidth = "1";
      newElement.setAttribute("transform", "scale(10)")
      svgGroup.appendChild(newElement);
  }
  
  function clearSVG() {
      svgGroup.innerHTML = ""
  }
  
  function renderSVG(paths) {
      for (const colorPath of paths) {
          var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", colorPath.path)
          path.setAttribute("stroke", colorPath.color)
          path.setAttribute("stroke-width", "1")
          g.appendChild(path);
      }
  }
  ```
- I have it rendering the kitty. So now I'm returning to a thing I wrote last year, where I tried to make an SVG wave rendering.
- ```clojure
  (defn scale
    "Scales a sequence of values to output between t-min and t-max."
    [values t-min t-max]
    (let [maximum (apply max values)
          minimum (apply min values)
          spread (- maximum minimum)]
      (reverse (map #(+ (* (/ (- % minimum)
                              spread)
                           (- t-max t-min))
                        t-min)
                    values))))
  
  (defn make-path [points]
    (str "M" (apply str (interpose " " (for [x (range (count points))]
                                         (str x " " (- 150 (nth points x))))))))
  
  (defn graph [file]
    (let [data (pcm file)
          len (count data)
          parts (.ceil js/Math (/ len 200))
          trimmed (partition parts data)
          mean #(/ (apply + %) (count %))
          median #(first (drop (/ 2 (count %)) (sort %)))]
      [:g
       [:rect#sampleframe
        {:stroke "black"
         :stroke-width 0.2
         :fill "white"
         :height 9 :width 20 :x 25 :y 4.5}]
       [:path {:transform (str "scale(0.1), translate(250,-24)")
               :d (make-path (reverse (scale (map first trimmed) 0 64)))
               :stroke       "blue"
               :stroke-width 1
               :fill         "none"}]]))
  ```
- First of all, how do I get the data from the buffer?
- Oh yeah
- ```clojure
  (channel-data (tri 50 1) 0)
  => 
  0,-0.0017500000540167093,-0.0035000001080334187,-0.005249999929219484,-0.007000000216066837,
  ```
- Here's what I have so far
- ```clojure
  (defn make-path [points]
    (str "M" (apply str (interpose " " (for [x (range (count points))]
                                         (str x " " (- 150 (nth points x))))))))
  
  (defn scale
    "Scales a sequence of values to output between t-min and t-max."
    [values t-min t-max]
    (let [maximum (apply max values)
          minimum (apply min values)
          spread (- maximum minimum)]
      (reverse (map #(+ (* (/ (- % minimum)
                              spread)
                           (- t-max t-min))
                        t-min)
                    values))))
  
  (defn graph [data]
    (let [_ (clear-svg)
          len (count data)
          parts (Math/ceil (/ len 500))
          trimmed (partition parts data)]
      (append-path (make-path (reverse (scale (map first trimmed) 0 128))))))
  
  (graph (channel-data (tri 50 0.04) 0))
  ```
- This renders *something*:
- ![image.png](./assets/image_1697594798274_0.png)
- So what is this function doing? I forgot what I was thinking.
- `parts` here is 16, because there are 4800 samples and we're dividing it by 300... does that mean we're only taking the first of every 300 samples... I'm going to play around with that, actually.
- But anyhoo... yes, that'ss exactly what it's doing, only taking 1 sample out of every 300... wait no, every 16. derp. Must be because we want that many points total... got it.
- I can't even figure out where the SVG size is set... it's 300x150 but it doesn't even seem to be defined anywhere. Could it be a default or something?
- Yeah, apparently it is. I changed the width to 500.
- The problem is... it takes a couple seconds to render.
- It sucks when I'm disappointed when something is too slow because then I have to admit that performance matters.
- I'm thinking maybe I should switch to Canvas, and just follow the Web Audio visualization guide for the oscilloscope view. Bonus, I believe it's animated.
- This, however, will graph whatever audio is currently being played... which is not really what I want. Well... yeah I do. But I also want the option of rendering a static graph of an audio buffer. Still, it will make sense to start with the tutorial.
- I managed to find the old article I remembered about how to "stabilize" the waveform: https://www.mattmontag.com/development/a-phase-aligned-oscilloscope
- Ah, in the comments there is a link to the software used to make the SID oscilloscope videos: https://github.com/maxim-zhao/SidWizPlus
- Apparently there's a simpler way to do it than the way the article describes.
- I kind of want to make mine look like Zeta's program: https://rusticnes.reploid.cafe/wasm/?tab=jam&cartridge=bhop-2a03.nes
- ![image.png](./assets/image_1697764442871_0.png)
- This is the project, but it looks like it's in WASM: https://github.com/zeta0134/rusticnes-wasm
- It's actually plain javascript. But I can't find the code that renders the waves... seems like it might be part of the piano roll app which gets embedded somehow. I think it's this code here: https://github.com/zeta0134/rusticnes-ui-common/blob/master/src/piano_roll_window.rs
- Yep, bingo. But the code is absolutely ridiculous. I mean, it's really well written... but it's nearly 1700 lines of Rust. Ouch. To be fair, it's the visualizer for an entire emulator supporting multiple chips and stuff. But I bet I could do it in like... 500 lines of JavaScript?
- Well, I'm not trying to make the piano thing. Just the oscilloscope windows. And I'm only gonna do 4 of them because I don't care about samples. But first, I need to just figure out how to make one.
- Oh, fuck the SidWiz thing, it's in C#.
- Oh no shit, the article is by Matt Montag, who made Chip Player JS!