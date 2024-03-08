# nes-lisp-mml

This is a tool for programmatically composing NES music. Songs are built using a dialect of the Lisp programming language, running in a live interpreter connected to a custom text editor. It is conceptually similar to [MML](https://en.wikipedia.org/wiki/Music_Macro_Language) (Music Macro Language), but benefits from Lisp's structured syntax which facilitates a highly ergonomic style of interactive evaluation. The interpreter is based on [MAL (Make-a-Lisp)](https://github.com/kanaka/mal) and closely follows Clojure including its [destructuring syntax](https://clojure.org/guides/destructuring), powerful [sequence processing library](https://clojure.org/reference/sequences) and [macro system](https://clojure.org/reference/macros). This project also aims to provide a more accessible composition environment for those with impaired vision or who otherwise have difficulty with graphical interfaces. 

## Evaluation key bindings

- Shift+Enter = Eval top-level form
- Alt/Cmd+Enter = Eval all
- Ctrl+Enter = Eval at cursor

The *Eval at cursor* command is particularly powerful - it evaluates the expression that *ends* just to the left of the cursor position, allowing you to quickly test the result at each level of nesting.

## API

A part is represented by a sequence of commands, each of which is a hashmap with various keys representing `length` (expressed in ticks), `pitch` (MIDI numbers, including decimal values for vibrato/microtones), `volume` and `duty`. These sequences are passed to their respective channels.

Note lengths are expressed in ticks (1/60 of a second).

The note data can be produced however you like, as long as it ends up a sequence of maps with the right keys. So you could use a literal sequence of maps:

```clojure
[{:volume 9 :length 20 :pitch 60} {:pitch 67} 
 {:length 50 :pitch 65} {:length 20 :pitch 67}
 {:length 10 :pitch 68} {:pitch 67} {:pitch 65} 
 {:pitch 67} {:length 20 :pitch 60}]
```

This is rather verbose however, and does not take advantage of the fact that we have a complete programming language at our disposal. It's often more convenient to encode the music as a sequence of length/pitch pairs. We could accomplish this by writing a function which takes these pairs and outputs the appropriate maps:

```clojure
(for [[length pitch]
      [[20 60] [20 67] [50 65] [20 67] [10 68]
       [10 67] [10 65] [10 67] [20 60]]]
  {:length length :pitch pitch})
```

### Volume/duty cycle changes

To facilitate volume envelopes and duty changes, a note can also be given `volume` and `duty` keys. Volume is in 16 steps, from 0 to 15. Duty is from 0-3:

- 0 = 12.5%
- 1 = 25%
- 2 = 50%
- 3 = 75%

A volume or duty change is persistent, i.e. it will affect all subsequent notes until there is another change.

## Playing audio

The `play-nsf` takes 4 arguments which are the 4 sequences for sq1, sq2, triangle and noise. To mute a channel just pass an empty vector.

## NSF/audio export

To save an audio file, pass a filename along with your note sequences `export-wav`:

```clojure
(export-wav
  (for [[length pitch]
        [[20 60] [20 67] [50 65] [20 67] [10 68]
         [10 67] [10 65] [10 67] [20 60]]]
    {:length length :pitch pitch})
[] [] [])
```

Saving an NSF file works the same way by calling `spit-nsf`:

```clojure
(spit-nsf "mytune.nsf"
  (for [[length pitch]
        [[20 60] [20 67] [50 65] [20 67] [10 68]
         [10 67] [10 65] [10 67] [20 60]]]
    {:length length :pitch pitch})
[] [] [])
```

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
