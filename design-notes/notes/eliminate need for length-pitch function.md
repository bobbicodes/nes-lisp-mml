- huh, I probably ought to make my mml compiler smarter, so the note sequences can contain either maps of attributes
  ```clojure
  {:volume 5 :length 40 :pitch 67 :duty 0}
  {:volume 6 :length 40 :pitch 63 :duty 1}
  ```
  ...or vectors of length/pitch pairs, which is much more concise when that's all that's needed
  ```clojure
  [40 67] [40 63] [40 60] [40 63]
  ```
  There is already a built-in `length-pitch` function which converts the second into the first, but this often gets annoying when you need to switch between them. If I just make it so they can be mixed interchangeably, it would clean it up considerably.
- It would turn this
  ```lisp
  (concat [{:volume 5 :duty 0}]
    (length-pitch [40 67] [40 63]))
  ```
  ...into this
  ```lisp
  [{:volume 5 :duty 0} [40 67] [40 63]]
  ```
- Did it! Works, pushed to main
- ```javascript
  function expandNotes(notes) {
    let expanded = []
    for (let i = 0; i < notes.length; i++) {
      if (Array.isArray(notes[i])) {
        let m = new Map()
        m.set("ʞlength", notes[i][0])
        m.set("ʞpitch", notes[i][1])
        expanded.push(m)
      } else {
        expanded.push(notes[i])
      }
    }
    return expanded
  }
  ```