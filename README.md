# nes-lisp-mml

This tool faithfully emulates the 4 channels of the [audio processing unit](https://www.nesdev.org/wiki/APU) of the NES. These are:

- White noise (for snares, hihats) produced by linear feedback shift register PRNG, played back at 16 different sample rates
- 16-step quantized triangle waves (for basslines, kicks, toms)
- Variable duty-cycle pulse waves (for leads)
- 1-bit DPCM samples

Songs are built using a dialect of the Lisp programming language, connected to a custom text editor. It is conceptually similar to [MML](https://en.wikipedia.org/wiki/Music_Macro_Language) (Music Macro Language), but benefits from Lisp's highly structured syntax which facilitates a highly ergonomic style of interactive evaluation. The interpreter is based on [MAL (Make-a-Lisp)](https://github.com/kanaka/mal) and closely follows Clojure including its [destructuring syntax](https://clojure.org/guides/destructuring), powerful sequence processing library and macro system.

Note: The code that loads when the tool starts is the classic title theme from Legend of Zelda, by Koji Kondo. It is purely there as a demo.

## Evaluation key bindings

- Shift+Enter = Eval top-level form
- Alt/Cmd+Enter = Eval all
- Ctrl+Enter = Eval at cursor

## Synth/sequence API

### Functions returning audio buffers

- drum-seq
- tri
- pulse0, pulse1, pulse2, pulse3 
- dpcm-seq

These functions take a sequence (list/vector) of notes. Each note is a map with the following keys:

- pitch (triangle/pulse only) - a MIDI number representing frequency (middle C is 60)
- length - note duration in seconds
- time - the number of seconds at which the note occurs
- vibrato (optional) - applies a sine wave to the frequency

The vibrato key also takes a map with the following keys:

- speed - the rate at which the frequency cycles
- width - the degree to which the frequency changes

Recommended vibrato values for speed/width are 1-10, but there is no limit (a speed of 300 makes a pretty crazy sound!)

The 4 different pulse waves are:

- pulse0 - 12.5% duty
- pulse1 - 25% duty
- pulse2 - 50% duty (square)
- pulse3 - 75% duty (inverse of pulse1)

The note data can be produced however you like, as long as it ends up a sequence of maps with the right keys.  Here is an example lead from Megaman 2 by Takashi Tateishi:

```clojure
(defn lead [time]
  (into []
    (for [[beat length note]
          [[0 0.5 61] [1 0.5 61] [1.5 0.5 61] [2 0.5 59]
           [2.5 1 61] [3.5 0.5 69] [4 1 66] [5 1 66] [6 1 64]
           [7 1 63] [8 0.5 63] [9 0.5 64] [9.5 0.5 64] 
           [10.5 0.5 64] [12 0.5 63] [13 0.5 64] [13.5 0.5 64]
           [14.5 0.5 64] [15.5 0.5 63] [16 0.5 61] [17 0.5 61] 
           [17.5 0.5 61] [18 0.5 59] [18.5 1 61] [19.5 0.5 69] 
           [20 1 66] [21 1 66] [22 1 64] [23 1 63] [24.5 0.5 59] 
           [25 0.5 61] [25.5 0.5 59] [26 3 56]]]
     {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note})))

(play (pulse0 (lead 0)))
```

## Mixing, playing and rendering audio files

- mix - takes a sequence of audio buffers, sums them and returns a new buffer
- play - plays an audio buffer
- spit-wav - takes a filename and an audio buffer and downloads it

## Tips

The interpreter was designed for education and is not optimized for performance. Generating long sequences of notes (e.g. with `for`) can be particularly slow, however this can be greatly mitigated by saving audio buffers in vars (i.e. with `def`) while composing, as subsequent operations like mixing and playing are extremely fast. This also makes your song easier to read.

### Triangle kicks

A classic technique for creating drums on the NES is to use rapidly descending notes with the triangle channel, like this excerpt from Asterix by Alberto Jose González:

```clojure
(def tempo 0.6)

(defn triangle-kicks [time root]
  [{:time (* tempo (+ time 0)) :length 0.1 :pitch (+ root 14)}
   {:time (* tempo (+ time 0.07)) :length 0.1 :pitch (+ root 10)}
   {:time (* tempo (+ time 0.09)) :length 0.1 :pitch (+ root 6)}  
   {:time (* tempo (+ time 0.11)) :length 0.1 :pitch (+ root 4)} 
   {:time (* tempo (+ time 0.13)) :length 0.3 :pitch root} 
   {:time (* tempo (+ time 0.5)) :length 0.1 :pitch (+ root 24)} 
   {:time (* tempo (+ time 0.55)) :length 0.3 :pitch (+ root 12)} 
   {:time (* tempo (+ time 1)) :length 0.1 :pitch (+ root 22)} 
   {:time (* tempo (+ time 1.03)) :length 0.1 :pitch (+ root 19)} 
   {:time (* tempo (+ time 1.06)) :length 0.1 :pitch (+ root 16)} 
   {:time (* tempo (+ time 1.06)) :length 0.1 :pitch (+ root 6)}  
   {:time (* tempo (+ time 1.12)) :length 0.3 :pitch (+ root 7)}  
   {:time (* tempo (+ time 1.5)) :length 0.1 :pitch (+ root 24)} 
   {:time (* tempo (+ time 1.53)) :length 0.3 :pitch (+ root 12)}])  

(play (tri (apply concat
  (for [[time note]     
        [[0 36] [2 36] [4 36] [6 36] [8 36] [10 36] [12 41] [14 41]    
        [16 43] [18 43] [20 36] [22 36] [24 44] [26 43] [28 36] [30 36]]]   
    (triangle-kicks time note)))))
```

Layering these with bursts of white noise creates a satisfying percussive effect.

## Building from source

Requires [Node.js](https://nodejs.org/en/) version 14.18+, 16+.

Download and unzip NES-music-engine-source.zip and run:

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
