- I wonder if anything like this has been done before.
- I'm still in the middle of building the [[DPCM UI]], but this is such a cool idea I almost want to skip right to it
- ## Lez go - delta modulation plumbing
  collapsed:: true
	- Alright... so the first step is just to generate a tone, like a sine wave. We should make a function that will simply emit the DPCM values for a sine wave of a given frequency. So first let's see what those values look like, by making a wave file of a sine wave and converting it.
	- So first we would calculate it normally, like each sample as a function of time, with a given amplitude and frequency.
	- This seems to work
	- ```clojure
	  (defn sine-wave [amplitude freq sample-rate]
	    (for [t (range 0 0.001 (/ 1 sample-rate))]
	      (* amplitude (sin (* freq t)))))
	  
	  (sine-wave 1 10000 44100)
	  
	  (0
	   0.22481909027920244
	   0.4381276777023811
	   0.6290045851501922
	   0.7876771141138106
	   0.9060213966621807
	   0.9779783290040037
	   0.9998637912800513
	   0.9705572706561109
	   0.8915592304110037
	   0.7669142877822267
	   0.6030041337833663
	   0.4082207972825762
	   0.19253698188039958
	   -0.033004526109502365
	   -0.25685623679805747
	   -0.46755717615496134
	   ...
	  ```
	- So now that we have these we need to modulate them.
	- Do I actually want to sample it at 33.1kHz? Because I think it would need to be resampled anyway...
	- Alright, so that's easy.
	- ```clojure
	  (defn sine-wave [amplitude freq sample-rate]
	    (map (fn [t] (* amplitude (sin (* freq t))))
	      (range 0 0.01 (/ 1 sample-rate))))
	  
	  (take 20 (sine-wave 1 10000 33100))
	  ```
	- ![dpcm.png](../assets/dpcm_1720220830783_0.png)
	- This is cool how it shows how the 44.1kHz source samples follow the 33.1 modulation. And we can see that a simple algorithm that just picks whichever direction results in less difference
	- Also, what's the resolution of the amplitude? 64? i.e. it's an 8 bit value so 0-127. Oh, but it goes by 2s, so it's effectively 64 levels.
	- And we have to remember how it's stored in the .dmc file
	- ```
	  00000000 F7 BE F7 DE:DD 6D DB F6|FF FF FF 4B:92 44 22 42
	  00000010 08 42 10 04:41 08 11 12|89 94 94 00:00 D4 DA B6
	  00000020 DD DD BD F7:BE EF FB DE|7B EF 6E B7:AD FF FF FF
	  00000030 7F 49 92 44:44 08 21 08|82 10 84 10:22 22 49 92
	  00000040 12 00 80 5A:DB B6 DB BD|7B DF FB BE:EF 7B EF DE
	  00000050 6E B7 B6 FF:FF FF 2F 29|91 88 88 10:82 20 08 82
	  
	  ```
	- it's like, packed little endian. So our first value, $F7, is `1 1 1 1 0 1 1 1`. So we read
	- up, up, up, down, up, up, up, up.
	- Since our PCM values are from -1 to 1, we will multiply that by 64
	- Sounds like we'll start with a classic `loop`. We need to track the current value so we know whether to go up or down.
	- ```clojure
	  (defn sine-wave [amplitude freq sample-rate]
	    (map (fn [t] (* amplitude (sin (* freq t))))
	      (range 0 0.02 (/ 1 sample-rate))))
	  
	  a * (sin f * t) 
	  
	  (defn delta-modulate [values]
	    (loop [vals values current-val 64 n 0 dpcm []]
	      (cond
	        (empty? vals) dpcm
	        (<= (abs (- (first vals) (+ 2 current-val)))
	            (abs (- (first vals) (- current-val 2))))
	        (recur (rest vals) (min 127 (+ 2 current-val))
	          (inc n) (conj dpcm 1))
	        (>= (abs (- (first vals) (+ 2 current-val)))
	            (abs (- (first vals) (- current-val 2))))
	        (recur (rest vals) (max 0 (- current-val 2)) 
	          (inc n) (conj dpcm 0)))))
	  
	  (delta-modulate
	    (map #(+ 63.5 (/ % (/ 0xffff 127)))
	      [0x0000 0x0201 0x0404 0x0603 0x0806 0x0a04 0x0c05 0x0e04 0x1001]))
	  
	  (delta-modulate
	    (map #(+ 63.5 %) (take 500 (sine-wave 64 220 33100))))
	  
	  0x8000
	  (- 0x8000 0x10000)
	  0x7fff
	  0xee08
	  0 513 1028 1539 
	  
	  (/ 1 3310)
	  (/ 60 33100)
	  
	  
	  (map #(+ 63.5 %) (take 500 (sine-wave 64 110 33100)))
	  ```
	- However... we need to make it so that it will stay the same if it would take it out of range
	- I got stuck while trying to read the wav file, because they're signed bytes
	- It's two's complement, so I guess to see if it's negative I... look at the MSD? That seems weird but let's see.
	- The first like, 60 or so samples are positive. Then when it goes down, we have numbers like $1F $E1
	- huh... it's actually true
	- But I don't get it. It's a sine wave. So each value has a very minimal change. So when it goes from 0x00ec to 0xfee5, that's 236 followed by... well it must be something like -273. But how?
	- Taku said something about sign extension, which is a way of increasing the number of bytes while preserving the value and sign
	- I'm so confused, I have no idea how to do this
	- Euly to the rescue, nice! if it is greater than or equal to 0x8000, subtract 0x10000
	- That's it! So, our value was 0xfee5, and it's -283.
	- Great! Now I can get back to this thing.
	- So, we have a wave file with a 100Hz sine wave with an amplitude of 1. The first few values:
	- 0 513 1028 1539 2054 2564 3077 3588 4097
	- But we want to scale this to 0 - 127, or even 0-64 so we can add 1 instead of 2
	- Then here we have the first few values as converted by famistudio
	- 1 1 1 0 1 1 1 1 0 1 1 1 1 1 0 1 1 1 1 0 1 1 1 1 0 1 1 1 1 0 1 1 1 0 1 1 1 0 1 1
	- So.. how do I even scale it. Yes, we want it from 0-64, but... we want 32 to be in the middle! So it still has a range of 64, but...
	- ok, so I think I have the values being output. But do I need to pack it into bytes like they are in the file? I suppose I do
	- Let's look at how the player works
	- Yeah, that's what the shift register does, it loads a byte and goes through each bit. Anyway, it obviously needs to go in the rom like any other sample data
	- So we just have a couple of big steps left for the plumbing. We need to get samples playing again in the first place, I had it working but then I sort of got sidetracked with the bankswitching thing
	- And we need to pack our dpcm bits into bytes, that should be pretty easy
	- How do we do that, actually...
	- We can use bit-flip, maybe in a `reduce`
	- It works!
	- ```clojure
	  (defn sine-wave [amplitude freq sample-rate]
	    (map (fn [t] (* amplitude (sin (* (* 2 pi) freq t))))
	      (range 0 0.02 (/ 1 sample-rate))))
	  
	  (defn delta-modulate
	    "Takes a sequence of PCM values scaled from 0-127.
	     Outputs a sequence of 1's and 0's representing
	     its delta modulation."
	    [values]
	    (loop [vals values current-val 64 n 0 dpcm []]
	      (cond
	        (empty? vals) dpcm
	        (<= (abs (- (first vals) (+ 2 current-val)))
	            (abs (- (first vals) (- current-val 2))))
	        (recur (rest vals) (min 127 (+ 2 current-val))
	          (inc n) (conj dpcm 1))
	        (>= (abs (- (first vals) (+ 2 current-val)))
	            (abs (- (first vals) (- current-val 2))))
	        (recur (rest vals) (max 0 (- current-val 2)) 
	          (inc n) (conj dpcm 0)))))
	  
	  (defn pack-bits
	    "Takes a sequence of 8 values consisting of 1's and 0's.
	     Returns an integer representing its little-endian packed byte."
	    [bits]
	    (loop [bits bits
	           val 0 n 0]
	    (cond
	      (empty? bits) val
	      (= 1 (last bits)) (recur (butlast bits) (bit-set val n) (inc n))
	      (= 0 (last bits)) (recur (butlast bits) val (inc n)))))
	  
	  (map pack-bits
	    (partition 8
	      (delta-modulate
	        (map #(+ 64 %) (sine-wave 64 110 33100)))))
	  ```
- ## NSF scaffolding
	- Producing a minimal driver to support sample playback
	- I should actually just make it so it puts all the samples that are loaded into the rom, I don't like the thing that searches for the strings in the bytecode... there shouldn't be strings in there, and if you don't want samples in the rom you shouldn't have loaded them!
	- Alright, got the sample in the rom at least. Let's get it to play.
	- The sample is at B080 in the file. Let's see if this is a valid sample address first of all.
	- I think it's 0xD000, in which case I think that's great
	- Yes! its value is $40. So let's put that in the stream.
	- Oh I think I need to set the banks correctly, it probably doesn't know how to find the sample
	- ok fetching the first dpcm byte
	- wait the stream status is 0
	- Oh right... we need to add an opcode for playing the sample, silly
	- Though that might not be the actual problem
	- It works!
	- Ok, so now all we need to do is make a function that will add the sample to the samples array, just like it does when it uploads it!
	- I have to message the sample to the main thread, asshole
	- Great! Prototype is done, even cut a video and shared it
- ## Optimize
	- Ok, so this really needs optimization. It takes like forever to calculate the sine wave in Lisp, I should try to fix that.
	- Actually if I just make a javascript function to do this
	- ```clojure
	  (defn sine-wave [amplitude freq sample-rate]
	    (map (fn [t] (* amplitude (sin (* (* 2 pi) freq t))))
	      (range 0 0.04 (/ 1 sample-rate))))
	  ```
	- trying `(sine-wave 1 64 220 31000)` but no luck so far
	- oh wait... it does work, I just can't print that many values, lol
	- I need to port the rest of the functions...
	- ```clojure
	  (add-dpcm "kick"
	    (dpcm (take 10000 (sine-wave 1 64 220 33100))))
	  
	  (play {:dpcm [0xAB 0x40 0xff]})
	  ```
- Getting a weird thing on the attack, even with just a sine wave:
- ```clojure
  (add-dpcm "kick"
    (dpcm (sine-wave 1 50 220 33100)))
  
  (play {:dpcm [0xAB 0x40 0x1f
                0x89 0 0 0 0
                0xAB 0x40 0x1f
                0x89 0 0 0 0
                0xAB 0x40 0x1f
                0x89 0 0 0 0
                0xAB 0x40 0x1f
                0x89 0 0 0 0]})
  ```
- ![kick-hmm.png](../assets/kick-hmm_1720417536110_0.png)
- Picture is from the kick but it comes out that way regardless of what it is.
- The values from the sine-wave function look good.
- (save-pcm "sine.wav" (sine-wave 1, 50, 220, 33100))
- (save-dmc "sine.dmc" (dpcm (sine-wave 1, 50, 220, 33100)))
- everything checks out so far! It must be the driver. Here's what I'm testing:
- ```clojure
  (add-dpcm "sine"
    (dpcm (sine-wave 1, 50, 220, 33100)))
  
  (save-nsf "sine.nsf" {:dpcm [0xAB 0x40 0xff
                0x99 0 0 0 0 0 0
                0xAB 0x40 0xff
                0x99 0 0 0 0 0 0
                0xAB 0x40 0xff
                0x99 0 0 0 0 0 0
                0xAB 0x40 0xff
                0x99 0 0 0 0]})
  ```
- ![sine-driver.png](../assets/sine-driver_1720454907420_0.png)
- Indeed... the sample is supposed to start at $D000 but it actually begins with the $0F, a few rows down
- wtf is that anyway? Oh... it's the dpcm data stream. But why is that there?
- ok so I fixed that part... but not really. Although the *sample* is correct in the NSF, it's still playing them fucky at the beginning
- I'm thinking this might be a banking issue.
- The sample is precisely at $E000 where it is supposed to be.
- And the sample music data is at $D000 where it should be.
- So what could be the problem?
- It still could be banks... right? Jeez, then it would seem that it wouldn't play at all, or play garbage!
- I checked it out in mesen and there's absolutely no reason it shouldn't be playing perfectly.
-