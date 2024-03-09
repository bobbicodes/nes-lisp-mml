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