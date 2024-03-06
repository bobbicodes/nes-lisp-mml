# nes-lisp-mml

This is a tool for programmatically composing NES music. Songs are built using a dialect of the Lisp programming language, running in a live interpreter connected to a custom text editor. It is conceptually similar to [MML](https://en.wikipedia.org/wiki/Music_Macro_Language) (Music Macro Language), but benefits from Lisp's structured syntax which facilitates a highly ergonomic style of interactive evaluation. The interpreter is based on [MAL (Make-a-Lisp)](https://github.com/kanaka/mal) and closely follows Clojure including its [destructuring syntax](https://clojure.org/guides/destructuring), powerful [sequence processing library](https://clojure.org/reference/sequences) and [macro system](https://clojure.org/reference/macros). This project also aims to provide a more accessible composition environment for those with impaired vision or who otherwise have difficulty with graphical interfaces. 

## Evaluation key bindings

- Shift+Enter = Eval top-level form
- Alt/Cmd+Enter = Eval all
- Ctrl+Enter = Eval at cursor

The *Eval at cursor* command is particularly powerful - it evaluates the expression that *ends* just to the left of the cursor position, allowing you to quickly test the result at each level of nesting.

## API

A part is represented by a sequence of commands, each of which is a hashmap with various keys representing `length` (expressed in ticks), `pitch` (MIDI numbers, including decimal values for vibrato/microtones), `volume` and `duty`. These sequences are passed to their respective channels.

Valid lengths begin at 0x81, which represents a single tick or 1/60 of a second. (TODO: This should really be 1, this is merely a holdover from driver implementation detail)

The note data can be produced however you like, as long as it ends up a sequence of maps with the right keys. So you could use a literal sequence of maps:

```clojure
[{:volume 0xe9 :length 0x90 :pitch 60} {:length 0x89 :pitch 67} 
   {:length 0x90 :pitch 65} {:pitch 67}
 {:length 0x90 :pitch 68} {:length 0x89 :pitch 67} 
   {:length 0x90 :pitch 65} {:length 0x89 :pitch 67}]
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

To facilitate volume envelopes and duty changes, a note can also be given `volume` and `duty` keys. Volume is in 16 steps, from 0xE0 tto 0xEF. Duty is from 0xF0-0xF3:

- 0xF0 = 12.5%
- 0xF1 = 25%
- 0xF2 = 50%
- 0xF3 = 75%

TODO: Volume should be an integer 0-15, and duty should be 0-3.

A volume or duty change is persistent, i.e. it will affect all subsequent notes until there is another change.

## Playing audio

The `play-nsf` takes 4 arguments which are the 4 sequences for sq1, sq2, triangle and noise. To mute a channel just pass an empty vector.

## NSF/audio export

Call `spit-nsf` with a filename to download the most recently played tune. To render an audio file, pass the same sequences to `export-wav`. TODO: Make this more consistent 

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
