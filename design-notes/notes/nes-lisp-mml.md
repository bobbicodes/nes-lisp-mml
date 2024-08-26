- Lol, I just made a new page because there are now so many sub pages for this thing that I don't know where to put this critical issue that I discovered while doing the [[audio export]] or something... our E1 note doesn't work because it works out to be 127 which the driver treats as a rest. At least, I think that's what the problem is...
- This most likely means we'll have to modify the driver again.
- How do the rests work now? I'm having trouble keeping this straight.
- Huh... I'm actually not sure why this is happening. Rests aren't 127 anymore in the driver, they're represented by 0x00 0x00. So we need to do some tests to find out what is going on.
- Indeed, it's because pitch 41 comes out to 5 0:
- ```clojure
  (play-nsf
  []
    [{:length 0x94} {:pitch 41}]
    []
  [])
  => 
  (148 5 0 255) 
  ```
- I'm sort of tempted to simplify the driver further by just making all channels like the noise one, where a rest is done with a volume change.
- It works, and brings the driver size down to 647 bytes.
- The only other thing I'll need to do is make it so it puts the old volume back after the rest...
- Did it! That was really fast too. I feel like Lisa Simpson when she got her sewing finger
- ```clojure
  (def tri-kick
    (concat [{:length 0x81}]
      (for [x (reverse (range 55 69 3))]
        {:pitch x :volume 0xEF})))
  
  (defn drum [pitch]
    (concat [{:length 0x81}]
      (map #(hash-map :volume % :pitch pitch)
        (reverse (range 0xE4 0xEF)))))
  
  (play-nsf
  []
    []
    (concat 
      tri-kick {:length 0x96 :volume 0xE0 :pitch 0}
      tri-kick {:length 0x96 :volume 0xE0 :pitch 0}
      tri-kick {:length 0x96 :volume 0xE0 :pitch 0}
      tri-kick {:length 0x96 :volume 0xE0 :pitch 0}
      tri-kick {:length 0x96 :volume 0xE0 :pitch 0})
  [])
  ```
- Holy shit, this is coming along so well!
- I want to do the thing to make it shut off the audio once it's done. This is the old pause function which I just removed:
- ```js
  el("pause").onclick = function (e) {
    if (paused && loaded) {
      loopId = requestAnimationFrame(update);
      audio.start();
      paused = false;
      el("pause").innerText = "Pause";
    } else {
      cancelAnimationFrame(loopId);
      audio.stop();
      paused = true;
      el("pause").innerText = "Unpause";
    }
  }
  ```
- ## What next?
- debating which feature to try implementing next. just off the top of my head:
	- nsf import (kind of like a pot of gold)
	- dpcm
	- vrc6
	- visualizer
- Just seeing them there kind of makes it obvious. We need to implement [[nes-lisp-mml-dmc]]
- I somehow broke the resume behavior, so I'm not sure how to deal with that
- This is the code:
- ```js
  document.onvisibilitychange = function(e) {
    if(document.hidden) {
      pausedInBg = false;
      if(!paused && loaded) {
        audio.stop();
        pausedInBg = true;
      }
    } else {
      if(pausedInBg && loaded) {
        audio.start();
        pausedInBg = false;
      }
    }
  }
  ```
- I took it out, and it still fails when you switch tabs, requiring a reload. What could it be?
- It only happened since the reorganization. I just recently put that in too. Before that it would choke if you put it in the background, now it permanently kills the audio until refresh.
- Oh! It just happened without changing tabs! This is something that mysteriously started yesterday. So it's unrelated to the reorganization. Before that, we implemented our filter.
- This is going to require an issue.
- It's the biquadfilter. And I can't figure out how to stop it other than removing it, which isn't the worst thing in the world because it's barely noticeable, it's the export where we really care.
- I'm getting another weird bug too while trying to speed up this song (moved to [[Asterix Egypt]] ). `assembleNotes` fails with an error `notes[i]` is null.
  id:: 65f15404-2d05-4289-a8ec-12ab6cfb3ec6
- ## To reproduce bug
- ```clojure
  (defn kick [length]
    (concat [{:volume 10 :length 1 :pitch 6}]
      (for [[volume pitch] [[7 2] [4 1] [3 1] [2 0]]]
        {:volume volume :pitch pitch})
      {:length (- length 5) :volume 0 :pitch 0}))
  
  (defn snare [length] 
    (concat [{:volume 11 :length 1 :pitch 8}]
      (for [[volume pitch]
            (take (dec length) 
              [[9 6] [8 6] [7 6] [4 5] [3 5] [2 5] [1 5]])]
        {:volume volume :pitch pitch})
      (when (< 8 length)
        {:length (- length 8) :volume 0 :pitch 0})))
  
  (defn hat [length] (concat
    [{:volume 4 :length 1 :pitch 3} {:volume 3 :pitch 2}
     {:volume 2 :pitch 0} {:volume 1 :pitch 0}]
    {:length (- length 4) :volume 0 :pitch 0}))
  
  (def beat (concat 
       (kick 14) (hat 14) (snare 14) (hat 14)
       (kick 14) (kick 14) (snare 14) (hat 7) (snare 7)
       (kick 14) (hat 14) (snare 14) (hat 7) (snare 7)
       (kick 14) (snare 14) (snare 14) (snare 7) (snare 7)))
  
  (play []
    []
    []
    beat)
  => 
  Error: notes[i] is null
  ```
- It might just be that I'm doing something wrong in the functions here, because I did a lot to the snare there. I thought I was fixing something... like accounting for lengths that are shorter than the sequence. This was the original:
- ```clojure
  (defn snare [length] 
    (concat [{:volume 11 :length 1 :pitch 8}]
      (for [[volume pitch] [[9 6] [8 6] [7 6] [4 5] [3 5] [2 5] [1 5]]]
        {:volume volume :pitch pitch})
      {:length (- length 8) :volume 0 :pitch 0}))
  ```
- I bet it's because the rest of the function is not accounting for the shortened sequence.
- I like this:
- ```clojure
  (defn kick [length]
    (concat [{:volume 10 :length 1 :pitch 6}]
      (for [[volume pitch] [[7 2] [4 1] [3 1] [2 0]]]
        {:volume volume :pitch pitch})
      {:length (- length 5) :volume 0 :pitch 0}))
  
  (defn snare [length]
    (let [vol-pitch (->> [[11 8] [9 6] [8 6] [7 6]
                          [4 5] [3 5] [2 5] [1 5]]
                         (take length))
          frame1 {:length 1 :volume (ffirst vol-pitch)
                  :pitch (last (first vol-pitch))}
          midframes (for [[volume pitch] (rest vol-pitch)]
                      {:volume volume :pitch pitch})
          last-frame {:length (if (< length 8) 0 (- length 8))
                      :volume 0 :pitch 0}]
    (concat [frame1] midframes [last-frame])))
  
  (defn hat [length] (concat
    [{:volume 4 :length 1 :pitch 3} {:volume 3 :pitch 2}
     {:volume 2 :pitch 0} {:volume 1 :pitch 0}]
    {:length (- length 4) :volume 0 :pitch 0}))
  
  (play []
    []
    []
    (concat 
       (kick 14) (hat 14) (snare 14) (hat 14)
       (kick 14) (kick 14) (snare 14) (hat 7) (snare 7)))
  ```
- It's because of nils! ok... I didn't know it was there because it's not printed... probably a dumb idea.
- I should just make a special case for notes with 0 length, and I'll just put the note on.
- It might even handle it already... nope.
- Now it should. But...
- ## Getting confusing
- Since I fixed a bug (well, half of one I think, since I only did it to the noise one...)
- What I mean is... ugh. There are several things happening now:
	- I think I want it so that the currentLength variable is stateful. So I made a `noiseLen` for the assembleNoise function. But I'm not 100% sure this is correct. Or needed. Or even... a sign of another issue?
	- There's now bugfixing work on this branch which was intended as a song branch.
- Doing a live-app update. See you at [[nes-lisp-mml page 2]]