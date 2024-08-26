- Note 41 fails...
- But 41.01 works. so does 40.996
- So if I was persistent enough I could work around it, but how do I even track this down? I need to trace the life of a pitch. Actually it does sound fun when put that way.
- omg, that's it. midi note 41 = 87.307Hz, which is $0500
- ok so this turns out to be easy. I can deal with this by first checking if it's above some note, and return [0, 0]. Otherwise it will just... not return say [0, 5], but [1, 5] which is a negligible difference.
- note 160 is period 0.32560609592366463
- 127 = 12543.853951415975 Hz, period 7.917579312805451
- ```js
  function fmtWord(n) {
    // need to handle edge case of note 41, which happens to
    // return [0, 5], and the driver uses 0 as rests.
    // But we want to return a [0, 0] for 160 because
    // it's convenient to use for rests. So we'll use
    // any pitch above 127, or below period 7.91.
    if (n < 7.91) {
      return [0, 0]
    }
    n = Math.round(n)
    const pad = String(n.toString(16)).padStart(4, '0');
    return [Math.max(1, parseInt(pad.slice(2), 16)),
            parseInt(pad.slice(0, 2), 16)];
  }
  ```