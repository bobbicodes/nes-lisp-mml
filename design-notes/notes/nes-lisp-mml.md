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