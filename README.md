# nes-lisp-mml

This is a tool for programmatically composing NES music. Songs are built using a dialect of the Lisp programming language, running in a live interpreter connected to a custom text editor. It is conceptually similar to [MML](https://en.wikipedia.org/wiki/Music_Macro_Language) (Music Macro Language), but benefits from Lisp's structured syntax which facilitates a highly ergonomic style of interactive evaluation. The interpreter is based on [MAL (Make-a-Lisp)](https://github.com/kanaka/mal) and closely follows Clojure including its [destructuring syntax](https://clojure.org/guides/destructuring), powerful [sequence processing library](https://clojure.org/reference/sequences) and [macro system](https://clojure.org/reference/macros). This project also aims to provide a more accessible composition environment for those with impaired vision or who otherwise have difficulty with graphical interfaces. 

## Evaluation key bindings

- Shift+Enter = Eval top-level form
- Alt/Cmd+Enter = Eval all
- Ctrl+Enter = Eval at cursor

The *Eval at cursor* command is particularly powerful - it evaluates the expression that *ends* just to the left of the cursor position, allowing you to quickly test the result at each level of nesting.

## API

A part is represented by a sequence of commands, each of which is a hashmap with various keys representing `length` (expressed in 1/60 of a second ticks), `pitch` (MIDI numbers, including decimal values for vibrato/microtones), `volume` and `duty`. These sequences are passed to their respective channels.

The note data can be produced however you like, as long as it ends up a sequence of maps with the right keys. So the most basic way would be to use a literal sequence of maps:

```clojure
[{:volume 9 :length 20 :pitch 60} {:pitch 67} 
 {:length 50 :pitch 65} {:length 20 :pitch 67}
 {:length 10 :pitch 68} {:pitch 67} {:pitch 65} 
 {:pitch 67} {:length 20 :pitch 60}]
```

Much of the time, it is enough to encode length/pitch pairs, which can be placed in the sequence using vectors. Thus the above example could be written like this:

```clojure
[{:volume 9 :length 20 :pitch 60} [20 67] [50 65] 
[20 67] [10 68] [10 67] [10 65] [10 67] [20 60]]
```

There is no limit to the number of ways your music can be written. Check out the examples in the [songs folder](https://codeberg.org/bobbicodes/nes-lisp-mml/src/branch/main/src/songs) for inspiration.

### Volume/duty cycle changes

To facilitate volume and duty changes, a note can also be given `volume` and `duty` keys. Volume is in 16 steps, from 0 to 15. Duty is from 0-3 (0-7 for VRC6):

- 0 = 12.5%
- 1 = 25%
- 2 = 50%
- 3 = 75%

A volume or duty change is persistent, i.e. it will affect all subsequent notes until there is another change.

### Noise pitches

The noise channel plays at 16 possible pitches from 0 (high) to 15 (low). Mode 1 noise (metallic sound) is from 16 to 32.

### Volume envelopes

To create instruments using volume envelopes, you can define a sequence:

```clojure
(def saw-env
  [30 27 23 19 15 11 8 7 7 7 7 7 6 6 6 6 6 6
   5 5 5 5 5 5 4 4 4 4 4 3 3 3 3 3 2 2 2 2 2 1])
```

Then in the music sequence, select it with the `:envelope` key:

```clojure
  [{:envelope saw-env}
   [12 33] [12 45] [12 33] [24 38] [12 36] [12 35] [12 36]
   [12 33] [12 45] [12 33] [24 38] [12 36] [12 40] [12 28]]
```

### Looping

Most songs contain many repeated patterns. To facilitate this without consuming additional data, 2 levels of loops are provided, `loop1` and `loop2`. You cannot nest a `loop1` or `loop2` inside another, but you can nest a `loop1` inside a `loop2` or vice versa. Just call `(loop1 <n> <notes>)` where `n` is the number of times to loop, and `notes` is a sequence of notes. 

## Playing audio

The `play` function takes a map containing any combination of the following keys: `square1`, `square2`, `triangle`, `noise` and `dpcm`. For example:

```clojure
(play
  {:square1 (concat [{:volume 4 :duty 0}] arps)
   :square2 (concat [{:volume 1 :duty 0 :length 9 :pitch 160}]
    (detune arps))
   :triangle (concat tri2 tri3 tri2 tri4)
   :noise (concat (loop1 3 drums1) drums2)})
```

## NSF/audio export

To save an audio file, pass a filename along with your note sequences to `save-wav`:

```clojure
(save-wav "mytune.wav"
  {:square1 [[20 60] [20 67] [50 65] [20 67] [10 68]
             [10 67] [10 65] [10 67] [20 60]]})
```

Saving an NSF file works the same way by calling `save-nsf`:

```clojure
(save-nsf "mytune.nsf"
  {:square1 [[20 60] [20 67] [50 65] [20 67] [10 68]
             [10 67] [10 65] [10 67] [20 60]]})
```

These are just the basics - again, check out the example songs for lots of ideas.

## Using DPCM samples

There is an *Import Sample* button on the bottom of the page that allows you to upload .dmc files. Once they are loaded, they can be referred to in the `:dpcm` key of the note maps passed to the above functions. The API is like this:

```clojure
(play
  {:dpcm
    [{:sample "kick" :length 3}
     {:sample "e-sus" :length 12}
     {:sample "mute-e" :length 11}
     {:sample "mute-e" :length 11}
     {:sample "mute-e" :length 11}
     {:sample "e-sus" :length 16}
     {:rest 32}]})
```

The sample names must match the file names. Each note must have a `sample` key and a `length` key. Use `:rest` to insert gaps in the playback.

## Panic!

To stop all audio currently playing, simply play a blank sequence:

```clojure
(play {})
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
