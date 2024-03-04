# nes-lisp-mml

This is a tool for programmatically composing NES music. Songs are built using a dialect of the Lisp programming language, running in a live interpreter connected to a custom text editor. It is conceptually similar to [MML](https://en.wikipedia.org/wiki/Music_Macro_Language) (Music Macro Language), but benefits from Lisp's structured syntax which facilitates a highly ergonomic style of interactive evaluation. The interpreter is based on [MAL (Make-a-Lisp)](https://github.com/kanaka/mal) and closely follows Clojure including its [destructuring syntax](https://clojure.org/guides/destructuring), powerful [sequence processing library](https://clojure.org/reference/sequences) and [macro system](https://clojure.org/reference/macros). This project also aims to provide a more accessible composition environment for those with impaired vision or who otherwise have difficulty with graphical interfaces. 

## Evaluation key bindings

- Shift+Enter = Eval top-level form
- Alt/Cmd+Enter = Eval all
- Ctrl+Enter = Eval at cursor

## API

A part is represented by a sequence of notes, each of which is a hashmap with a length (expressed in ticks) and a pitch (MIDI numbers). These sequences are passed to the respective channels:

- noise
- triangle
- square1, square2

The note data can be produced however you like, as long as it ends up a sequence of maps with the right keys. So you could use a literal sequence of maps:

```clojure
[{:length 100 :pitch 70}
 {:length 20 :pitch 65}
 {:length 2 :pitch 127}
 {:length 18 :pitch 65}
 {:length 20 :pitch 70}
 {:length 10 :pitch 68}]
```

This is rather verbose however, and does not take advantage of the fact that we have a complete programming language at our disposal. We could be more concise by writing a function which takes a sequence of length/pitch pairs and outputs the appropriate maps:

```clojure
(def data
  [[100 70] [20 65] [2 127] [18 65] [20 70] [10 68] 
   [10 66] [140 68] [100 70] [20 66] [2 127] [20 66]
   [20 70] [10 69] [10 67] [140 69]])

(square1 
  (for [[length pitch] data]
  {:length length :pitch pitch}))
```

### Volume/duty cycle changes

To facilitate volume envelopes and duty changes, a note can also be given `volume` and `duty` keys. Volume is an integer 0-15, and duty is 0-3:


- 0 = 12.5%
- 1 = 25%
- 2 = 50%
- 3 = 75%

A volume or duty change is persistent, i.e. it will affect all subsequent notes until there is another change.

## Building from source

Requires [Node.js](https://nodejs.org/en/) version 14.18+, 16+.


```
npm install
```

## Develop

```
npm run dev
```

## Create optimized build

```
npm run build
npm preview
```
