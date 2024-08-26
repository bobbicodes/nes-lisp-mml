- I got out of having to do this before because I just used the built in Web Audio one.
- The wiki article gives this pseudocode impl:
- ```
  // Return RC high-pass filter output samples, given input samples,
  // time interval dt, and time constant RC
  function highpass(real[1..n] x, real dt, real RC)
      var real[1..n] y
      var real α := RC / (RC + dt)
      y[1] := x[1]
      for i from 2 to n
          y[i] := α × y[i−1] + α × (x[i] − x[i−1])
      return y
  ```
- I don't know what kind of filter this is, and there's a whole bunch of them with stupid names.
- This article seems nice, but the code part is in Python with Numpy, which includes all sorts of stupid functions like sinc, blackman and convolve: https://tomroelandts.com/articles/how-to-create-a-simple-high-pass-filter
- Looking at the algorithm above, it actually seems extremely simple compared to the maths shit
- Yeah, the low pass filter article is the one that is much more robust. Looks like we need to read that one first to get the concepts, then do the spectral inverse or some shit
- https://en.wikipedia.org/wiki/Butterworth_filter
- I can probably search the discord to find Zeta talking about them
- Yeah apparently it's a sinc filter with a hamming window that we want
- This looks like a great article: http://liquidsdr.org/blog/basic-fir-filter-design/
- It uses a discrete Fourier transform, which supposedly is very easy to code! Let's go!
- Oh no shit check out what I found at https://github.com/markert/fili.js/blob/master/src/firCoeffs.js:
- ```js
   // note: coefficients are equal to impulse response
    // windowd sinc filter
    var calcImpulseResponse = function (params) {
      var Fs = params.Fs
      var Fc = params.Fc
      var o = params.order
      var omega = 2 * Math.PI * Fc / Fs
      var cnt = 0
      var dc = 0
      var ret = []
      // sinc function is considered to be
      // the ideal impulse response
      // do an idft and use Hamming window afterwards
      for (cnt = 0; cnt <= o; cnt++) {
        if (cnt - o / 2 === 0) {
          ret[cnt] = omega
        } else {
          ret[cnt] = Math.sin(omega * (cnt - o / 2)) / (cnt - o / 2)
          // Hamming window
          ret[cnt] *= (0.54 - 0.46 * Math.cos(2 * Math.PI * cnt / o))
        }
        dc = dc + ret[cnt]
      }
      // normalize
      for (cnt = 0; cnt <= o; cnt++) {
        ret[cnt] /= dc
      }
      return ret
    }
    
     // invert for highpass from lowpass
    var invert = function (h) {
      var cnt
      for (cnt = 0; cnt < h.length; cnt++) {
        h[cnt] = -h[cnt]
      }
      h[(h.length - 1) / 2]++
      return h
    }
  ```
- From the readme:
- ## Generate FIR Filters
- ```js
  //  Instance of a filter coefficient calculator
  var firCalculator = new Fili.FirCoeffs();
  ```
- That's the object where our code above is yanked from.
- ```js
  // calculate filter coefficients
  var firFilterCoeffs = firCalculator.lowpass({
      order: 100, // filter order
      Fs: 1000, // sampling frequency
      Fc: 100 // cutoff frequency
      // forbandpass and bandstop F1 and F2 must be provided instead of Fc
    });
  
  // create a filter instance from the calculated coeffs
  var firFilter = new Fili.FirFilter(firFilterCoeffs);
  ```
- `firCalculator.lowpass` is nothing more than `calcImpulseResponse()`.
- highpass is `invert(calcImpulseResponse())`
- So there we go. Let's see if we can port it!
- Well, that part is calculating the coefficients. Then we need something from the `FirFilter` object. Looks like specifically, multistep:
- ```js
  // run the filter from input array
  // returns array
  console.log(filter.multiStep([1,10,-5,3,1.112,17]));
  ```
- multistep: `runMultiFilter(input, z, doStep, overwrite)`
- Oh, that's in utils:
- ```js
  exports.runMultiFilter = function (input, d, doStep, overwrite) {
    var out = []
    if (overwrite) {
      out = input
    }
    var i
    for (i = 0; i < input.length; i++) {
      out[i] = doStep(input[i], d)
    }
    return out
  }
  ```
- dostep:
- ```js
  var doStep = function (input, d) {
      d.buf[d.pointer] = input
      var out = 0
      for (cnt = 0; cnt < d.buf.length; cnt++) {
        out += (f[cnt] * d.buf[(d.pointer + cnt) % d.buf.length])
      }
      d.pointer = (d.pointer + 1) % (d.buf.length)
      return out
    }
  ```
- Let's back up and just try to get the coefficients first. One step at a time. I made a new file called filter.js because this is going to be a lot.
- What are our inputs?
- So if we're trying to run `multiStep([1,10,-5,3,1.112,17])`, `runMultiFilter(input, z, doStep, overwrite)` is being called with our input array, and z:
- ```js
  var z = initZero(f.length - 1)
  ```
- Okay, so we need `initZero` and `f`.
- ```js
  var FirFilter = function (filter) {
    // note: coefficients are equal to input response
    var f = filter
    var b = []
    var cnt = 0
    for (cnt = 0; cnt < f.length; cnt++) {
      b[cnt] = {
        re: f[cnt],
        im: 0
      }
    } 
  
  var initZero = function (cnt) {
      var r = []
      var i
      for (i = 0; i < cnt; i++) {
        r.push(0)
      }
      return {
        buf: r,
        pointer: 0
      }
    }
  ```
- ok fine. So f is what is passed in.. which is what?
- `FirFilter` is a function... called by?
- It's the coefficients! `FirFilter(firFilterCoeffs);`
- I see, `Fs` is the sampling frequency we want:
- ```js
  // calculate filter coefficients
  var firFilterCoeffs = firCalculator.lowpass({
      order: 100, // filter order
      Fs: 1000, // sampling frequency
      Fc: 100 // cutoff frequency
      // forbandpass and bandstop F1 and F2 must be provided instead of Fc
    });
  ```
- `filter` is an object that we pass to `calcImpulseResponse`.
- Well I'm getting *some* sound, which changes when I change the parameters, but it's... bad
- ```clojure
  (export-wav "filter-test.wav" sq1 sq2 bass
    (concat drum-pat drum-pat drum-pat drum-pat (drum 13 18 15 8 1)))
  ```
- ## How to test this?
- I guess I should try using the library directly. But I don't know how because it's old javascript.
- I could make a separate node application I guess, then just use some short test data
- I'm calculating the coefficients correctly! I can see they're the same fucking numbers.
- And it works for the test data! Same fucking numbers!
- So it seems that my implementation is good. So why am I getting this ridiculous noise?
- Let's make 2 recordings...
- ```js
    const filtered = highPass(audio_buffer, 1, 41000, 37)
    for (let i = 0; i < audio_buffer.length; i++) {
      audio_buffer[i] = filtered[i]
    }
    processor.port.postMessage({"type": "samples", "samples": filtered});
  ```
- ```clojure
  (export-wav "filter-37hp.wav" [] [] 
    (concat [{:length 30 :pitch 70}]
      (reverse (concat (for [n (range 38 70)]
              {:pitch n})))) [])
  ```
- Also not sure what's happening to my signal, could be I'm completely holding it wrong:
- ![filter.png](../assets/filter_1710198036969_0.png)
- Zeta suggested that I try graphing the data. So I'm thinking I'll put a canvas on the page
- He actually said to print the data, I guess it would have to be a file. Let's try that I guess...
- Eh... I don't even know what I should be graphing. I guess I need a different approach, like learn more about filter design.
- ## Use Web Audio filter
- alright, let's just figure out how to maybe use the offline audio context to give us our buffers.
- I already have the worklet messaging back the buffers... but I think that's not what I want because I want it disconnected from the playback system.
- In the audio handler, I could create a new method called `export` that will connect the graph differently.
- We run exportwav, and have it send the buffer to the offline context, through the biquad filter node. Then I guess we call `offlineCtx.startRendering()` and that sends a `complete` event which we could use to then download it. The `offlineAudioCompletionEvent` has a `renderedBuffer` property with... the rendered buffer
- ```js
  const offlineAudioCtx = new OfflineAudioContext();
  
  offlineAudioCtx.oncomplete = () => {
    download...
  };
  ```
- ```clojure
  (save-wav "demo.wav" sq1 sq2 bass
    (concat drum-pat drum-pat drum-pat drum-pat (drum 13 18 15 8 1)))
  ```