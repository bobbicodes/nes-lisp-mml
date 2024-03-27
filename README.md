# nes-lisp-mml

This is a tool for programmatically composing NES music. Songs are built using a dialect of the Lisp programming language, running in a live interpreter connected to a custom text editor. It is conceptually similar to [MML](https://en.wikipedia.org/wiki/Music_Macro_Language) (Music Macro Language), but benefits from Lisp's structured syntax which facilitates a highly ergonomic style of interactive evaluation. The interpreter is based on [MAL (Make-a-Lisp)](https://github.com/kanaka/mal) and closely follows Clojure including its [destructuring syntax](https://clojure.org/guides/destructuring), powerful [sequence processing library](https://clojure.org/reference/sequences) and [macro system](https://clojure.org/reference/macros). This project also aims to provide a more accessible composition environment for those with impaired vision or who otherwise have difficulty with graphical interfaces. 

## Evaluation key bindings

- Shift+Enter = Eval top-level form
- Alt/Cmd+Enter = Eval all
- Ctrl+Enter = Eval at cursor

The *Eval at cursor* command is particularly powerful - it evaluates the expression that *ends* just to the left of the cursor position, allowing you to quickly test the result at each level of nesting. The evaluation results are printed right in line, and cleared by pressing any key.

## API

A part is represented by a sequence of commands, each of which is a hashmap with various keys representing `length` (expressed in 1/60 of a second ticks), `pitch` (MIDI numbers, including decimal values for vibrato/microtones), `volume` and `duty`. These sequences are passed to their respective channels.

The note data can be produced however you like, as long as it ends up a sequence of maps with the right keys. So you could use a literal sequence of maps:

```clojure
[{:volume 9 :length 20 :pitch 60} {:pitch 67} 
 {:length 50 :pitch 65} {:length 20 :pitch 67}
 {:length 10 :pitch 68} {:pitch 67} {:pitch 65} 
 {:pitch 67} {:length 20 :pitch 60}]
```

However, it's often more convenient to encode the music as a sequence of length/pitch pairs. There is a convenience function for that called `length-pitch`:

```clojure
(length-pitch
      [[20 60] [20 67] [50 65] [20 67] [10 68]
       [10 67] [10 65] [10 67] [20 60]])
```

### Volume/duty cycle changes

To facilitate volume envelopes and duty changes, a note can also be given `volume` and `duty` keys. Volume is in 16 steps, from 0 to 15. Duty is from 0-3:

- 0 = 12.5%
- 1 = 25%
- 2 = 50%
- 3 = 75%

A volume or duty change is persistent, i.e. it will affect all subsequent notes until there is another change.

### Noise pitches

The noise channel plays at 16 possible pitches from 0 (high) to 15 (low). Mode 1 noise (metallic sound) is from 16 to 32.

## Playing audio

The `play` function takes 4 arguments which are the 4 sequences for sq1, sq2, triangle and noise. To mute a channel just pass an empty vector.

## NSF/audio export

To save an audio file, pass a filename along with your note sequences to `save-wav`:

```clojure
(save-wav "mytune.wav"
  (for [[length pitch]
        [[20 60] [20 67] [50 65] [20 67] [10 68]
         [10 67] [10 65] [10 67] [20 60]]]
    {:length length :pitch pitch})
[] [] [])
```

Saving an NSF file works the same way by calling `save-nsf`:

```clojure
(save-nsf "mytune.nsf"
  (for [[length pitch]
        [[20 60] [20 67] [50 65] [20 67] [10 68]
         [10 67] [10 65] [10 67] [20 60]]]
    {:length length :pitch pitch})
[] [] [])
```

## Example usage

### Rests

A rest is simply a note played at volume 0. To include a rest, just put in in the sequence:

```clojure
[{:length 99 :volume 0 :pitch 0} {:volume 6 :pitch 60}]
```

### Volume envelopes

This function will play noise of a given pitch with the volume linearly decreasing from 16 to 4, making a drum sound:

```clojure
(defn drum [pitch]
  (concat [{:length 1}]
    (map #(hash-map :volume % :pitch pitch)
      (reverse (range 4 16)))))
```

### Looping

There is a built in way of repeating sections of music without taking up additional ROM space. There is currently a 32kB limit because the driver does not do any bank switching, so songs of sufficient length will need to take advantage of this.

There are 2 levels of nesting allowed. These are aliased to `loop1` and `loop2`. Each one receives 2 arguments, a number of repetitions, and a note sequence.

```clojure
(loop1 2
  [{:volume 9 :length 20 :pitch 60}
   {:length 50 :pitch 65} {:pitch 67}
   {:length 10 :pitch 68} {:pitch 65} 
   {:pitch 67} {:length 20 :pitch 60}])
```

### Vibrato

There is a built-in function for doing vibrato efficiently:

```clojure
(vib (length-pitch
    [[36 74] [12 72] [12 74] [12 72] [12 69] [12 67]]) 
  0.5 0.15)
```

Vibrato uses looping under the hood, specifically `loop2`. So any sections using vibrato can only be looped using `loop1`.

### Transposition

Take an existing sequence and map a function over it to adjust the pitch:

```clojure
(map (fn [[pitch length]] [(+ pitch 7) length])
  [[50 2.5] [53 2.5] [52 1.25] [50 1.25] [48 2.5] [50 2.5]
       [53 2.5] [55 1.25] [53 1.25] [52 1.25] [50 5]])
```

### Instruments

Let's say we want a lead instrument where the vibrato increases in width after the attack:

```clojure
(defn lead-inst
  "Creates a note of a given pitch/length, applies linearly 
   increasing vibrato at given rate up to the given depth."
  [pitch length depth rate]
  (apply concat (for [x (range length)]
      (vibrato pitch 10 0.5 (min depth (+ (* x rate)))))))
```

Putting this all together:

```clojure
(def drums
  (concat 
    (drum 0x0D) {:length 53 :volume 0 :pitch 0}
    (drum 0x07) {:length 53 :volume 0 :pitch 0}
    (drum 0x0D) {:length 53 :volume 0 :pitch 0}
    (drum 0x07) {:length 53 :volume 0 :pitch 0}
    (drum 0x0D) {:length 53 :volume 0 :pitch 0}))

(defn lead
  "Takes vector pairs of pitch/length,
   outputs a part using lead-inst."
  [notes]
  (apply concat (for [[pitch length] notes]
            (lead-inst pitch length 0.5 0.25))))

(play
  (lead (map (fn [[pitch length]] [(+ pitch 7) length])
  [[50 2.5] [53 2.5] [52 1.25] [50 1.25] [48 2.5] [50 2.5]
       [53 2.5] [55 1.25] [53 1.25] [52 1.25] [50 5]]))
  (lead [[50 2.5] [53 2.5] [52 1.25] [50 1.25] [48 2.5] [50 2.5]
       [53 2.5] [55 1.25] [53 1.25] [52 1.25] [50 5]])
  (lead [[50 2.5] [53 2.5] [52 1.25] [50 1.25] [48 2.5] [50 2.5]
       [53 2.5] [55 1.25] [53 1.25] [52 1.25] [50 5]])
  drums)
```

### Arpeggios

We could make the common triangle kick by rapidly descending the pitch:

```clojure
(def tri-kick
  (concat [{:length 1}]
    (for [x (reverse (range 55 69 3))]
      {:pitch x})))
```

And we could create a bass instrument that places a kick at the beginning of the note:

```clojure
(defn bass-kick-inst
  "Precedes a note with a fixed 5-note descending arpeggio.
   First 5 frames are replaced to maintain length."
  [{:keys [pitch length]}]
  (conj (vec tri-kick) {:pitch pitch :length (- length 5)}))
```

And put this together for a punchy walking bassline (Brand New Cadillac by The Clash):

```clojure
(defn bass-kick [notes]
  (apply concat (for [[pitch length] notes]
            (bass-kick-inst {:pitch pitch :length length}))))

(defn bass [pitch]
  (bass-kick 
      [[(+ pitch 60) 12] [(+ pitch 60) 12] [(+ pitch 63) 12] [(+ pitch 63) 12] 
       [(+ pitch 65) 12] [(+ pitch 65) 12] [(+ pitch 66) 12] [(+ pitch 65) 12]]))

(defn walking-bass [intervals]
  (apply concat (for [pitch intervals]
    (bass pitch))))

(play [] []
  (walking-bass [0 0 0 0 5 5 0 0 7 5 0 0]) [])
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
