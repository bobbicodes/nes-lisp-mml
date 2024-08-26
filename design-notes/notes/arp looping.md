- So since our problem can be solved by adding another loop, we'll take special care to design a loop system that's meant for arps. We may either find it having unique requirements or relatively the same, we shall see.
- From Nerdy Nights:
	- To add another finite loop opcode you need to:
	- 1) declare another loop counter variable block in RAM (stream_loop2 .rs 6)
	  2) initialize the new loop counter to 0 in the sound_load routine.
	  3) add a new opcode for setting the new loop counter (se_op_set_loop2_counter)
	  4) add a new opcode to check the new counter and loop (se_op_loop2)
	  5) make sure to add the new opcodes to the jump table and give them an alias (set_loop2_counter, loop2).
- Added `stream_arp`. It's one for each channel, and as we know, only one can be going at a time!
- Ok. I've got it as `$AC` and `$AD`, for `se_op_set_arp_counter` and `se_op_arp`.
- Oh goody, now we get to install it my favorite. Fortunately it shouldn't change much.
- ```js
  const defaultEnvelopes = [
    [0x00, 0xFF], [0x01, 0xFF], [0x02, 0xFF], [0x03, 0xFF],  [0x04, 0xFF], [0x05, 0xFF],
    [0x06, 0xFF], [0x07, 0xFF], [0x08, 0xFF], [0x09, 0xFF], [0x0a, 0xFF], [0x0b, 0xFF],
    [0x0c, 0xFF],[0x0d, 0xFF], [0x0e, 0xFF],[0x0f, 0xFF],
    [0x0E, 0x09, 0x08, 0x06, 0x04, 0x03, 0x02, 0x01, 0x00, 0xFF]
  ]
  ```
- Songheaderadr Supposedly should be `$8342`, or 33602
- That's where it calculates it, and that's where it is.
- Then the first stream is supposed to be `$835f`
- and that is correct! Where's the problem?
- Got it! It was a single byte, right at the fucking beginning. Which I looked over by hand.
- Trying to come up with a repro for the current bug, playing notes that aren't there and messing up time.
- This fails
- ```clojure
  (defn k [[l p]] [[1 62] [1 58] [1 54] [1 52] [(- l 4) p]])
  (defn h [[l p]] [[1 72] [(dec l) p]])
  (defn s [[l p]] [[1 70] [1 67] [1 64] [1 54] [(- l 4) p]])
  
  (defn vibrato [pitch length speed width]
    (concat [{:length 1}]
      (for [x (range length)]
        {:pitch (+ pitch (* width (sin (* speed x))))})))
  
  (def vol-duty
    [[11 2] [10 1] [9 1] [8 1] [7 1] [6 3] [4 2] [4 2]
     [4 2] [4 2] [4 2] [4 2] [3 2] [3 2] [3 2] [3 2]
     [3 2] [3 2] [2 1] [2 1] [2 1] [2 1] [2 1] [2 1]
     [1 1] [1 1] [1 1] [1 1] [1 1] [1 1] [1 1] [1 1]])
  
  (defn arp
      "Takes a note length in frames, and a sequence of 
      pitches. Will loop the pitches for as many frames
      as length allows, and rest for any frames left
      after the vol-duty sequence has played."
    [length arp-seq vol-duty-seq]
    (filter identity
    (let [notes (take length vol-duty-seq)
          pitches (rest (take length (cycle arp-seq)))]
      (concat [{:volume 12 :length 1 :duty 2 
                :pitch (first arp-seq)}]
        (for [frame (range (count (take length vol-duty-seq)))]
          {:volume (first (nth notes frame)) 
           :duty (last (nth notes frame)) 
           :pitch (or (nth pitches frame) 160)})
      (when (< (count vol-duty-seq) length)
        {:length (- length (count vol-duty-seq)) 
         :volume 0 :pitch 160})))))
  
  (def chorus-arp
    [[4 3] [3 2] [3 2] [3 1] [3 1] [3 0] [3 0]
     [2 3] [2 3] [2 3] [2 3] [2 2] [2 2] [2 2] [2 2] [2 2]
     [2 2] [2 2] [2 2] [2 2] [2 2] [2 1] [2 1] [2 1] [2 1]
     [2 1] [1 1] [1 1] [1 1] [1 1] [1 1] [1 1] [1 1] [1 1]])
  
  (def sq1
    (concat [{:loop 2}]
      [{:volume 3 :length 77 :pitch 160}]
       (arp 10 [73 68] chorus-arp)
       (arp 10 [73 68] chorus-arp)
       (arp 10 [73 68] chorus-arp)
       (arp 10 [73 68] chorus-arp)
       [{:length 20 :pitch 61 :volume 4}]
      (vibrato 60 80 0.5 0.2)
      (vibrato 60 100 0.7 0.3)
      [{:loop :end}]
      [{:loop 2}]
      [{:volume 3 :length 77 :pitch 160}]
       (arp 10 [73 66] chorus-arp)
       (arp 10 [73 66] chorus-arp)
       (arp 10 [73 66] chorus-arp)
       (arp 10 [73 66] chorus-arp)
      [{:length 20 :pitch 73 :volume 4}]
      (vibrato 72 55 0.5 0.2)
      (vibrato 72 40 0.7 0.3)
      (vibrato 73 2 0.7 0.3)
      (vibrato 74 2 0.7 0.3)
      (vibrato 75 68 0.7 0.3)
      [{:length 15 :pitch 160}]
      [{:loop :end}]))
  
  (def sq2
    (concat
      [{:loop 2 :length 40 :pitch 160}]
      (arp 80 [61 64 68] vol-duty)
      (arp 80 [61 64 68] vol-duty)
      (arp 80 [61 64 67] vol-duty)
      (arp 35 [61 64 67] vol-duty)
      [{:loop :end}]
      [{:loop 2 :length 40 :pitch 160}]
      (arp 80 [66 69 73] vol-duty)
      (arp 80 [66 69 73] vol-duty)
      (arp 80 [66 69 72] vol-duty)
      (arp 63 [66 69 72] vol-duty)
      [{:loop :end}]))
  
  (def tri
    (concat [{:loop 2}]
      (length-pitch (concat
        (k [20 49]) (h [20 56]) (s [20 52]) (h [20 56])
        (k [20 49]) (h [20 56]) (s [20 52]) (h [20 49])
        (k [20 45]) (h [20 52]) (s [20 49]) (h [20 52])
        (k [20 45]) (h [20 46]) (s [20 47]) (h [20 48])))
      [{:loop :end}]
      (length-pitch (concat
        (k [20 54]) (h [20 61]) (s [20 57]) (h [20 61])
        (k [20 54]) (h [20 61]) (s [20 57]) (h [20 54])
        (k [20 50]) (h [20 57]) (s [20 54]) (h [20 57])
        (k [20 50]) (h [20 51]) (s [20 52]) (h [20 53])
        (k [20 54]) (h [20 61]) (s [20 57]) (h [20 61])
        (k [20 54]) (h [20 61]) (s [20 57]) (h [20 54])
        (k [20 50]) (h [20 57]) (s [20 54]) (h [20 57])
        (k [20 50]) (h [20 51]) (s [20 52]) (h [20 53])))
      [{:loop 2}]
      (length-pitch (concat
        (k [20 49]) (h [20 56]) (s [20 52]) (h [20 56])
        (k [20 49]) (h [20 56]) (s [20 52]) (h [20 49])
        (k [20 45]) (h [20 52]) (s [20 49]) (h [20 52])
        (k [20 45]) (h [20 46]) (s [20 47]) (h [20 48])))
      [{:loop :end}]))
  
  (play
    sq1
    sq2
    tri
    [{:loop 30}
     {:length 20 :pitch 15}
     {:length 20 :pitch 0}
     {:length 20 :pitch 7}
     {:length 20 :pitch 0}
     {:loop :end}
     {:length 20 :pitch 15}])
  ```
- One very weird pulse note early on, then happens to triangle and makes it fall apart.
- Yeah so I'll separate this into 2 repros.
- The square one:
- ```clojure
  (defn vibrato [pitch length speed width]
    (concat [{:length 1}]
      (for [x (range length)]
        {:pitch (+ pitch (* width (sin (* speed x))))})))
  
  (defn arp
      "Takes a note length in frames, and a sequence of 
      pitches. Will loop the pitches for as many frames
      as length allows, and rest for any frames left
      after the vol-duty sequence has played."
    [length arp-seq vol-duty-seq]
    (filter identity
    (let [notes (take length vol-duty-seq)
          pitches (rest (take length (cycle arp-seq)))]
      (concat [{:volume 12 :length 1 :duty 2 
                :pitch (first arp-seq)}]
        (for [frame (range (count (take length vol-duty-seq)))]
          {:volume (first (nth notes frame)) 
           :duty (last (nth notes frame)) 
           :pitch (or (nth pitches frame) 160)})
      (when (< (count vol-duty-seq) length)
        {:length (- length (count vol-duty-seq)) 
         :volume 0 :pitch 160})))))
  
  (def chorus-arp
    [[4 3] [3 2] [3 2] [3 1] [3 1] [3 0] [3 0]
     [2 3] [2 3] [2 3] [2 3] [2 2] [2 2] [2 2] [2 2] [2 2]
     [2 2] [2 2] [2 2] [2 2] [2 2] [2 1] [2 1] [2 1] [2 1]
     [2 1] [1 1] [1 1] [1 1] [1 1] [1 1] [1 1] [1 1] [1 1]])
  
  (def sq1
    (concat [{:loop 2}]
      [{:volume 3 :length 77 :pitch 160}]
       (arp 10 [73 68] chorus-arp)
       (arp 10 [73 68] chorus-arp)
       (arp 10 [73 68] chorus-arp)
       (arp 10 [73 68] chorus-arp)
       [{:length 20 :pitch 61 :volume 4}]
      (vibrato 60 80 0.5 0.2)
      (vibrato 60 100 0.7 0.3)
      [{:loop :end}]
      [{:loop 2}]
      [{:volume 3 :length 77 :pitch 160}]
       (arp 10 [73 66] chorus-arp)
       (arp 10 [73 66] chorus-arp)
       (arp 10 [73 66] chorus-arp)
       (arp 10 [73 66] chorus-arp)
      [{:length 20 :pitch 73 :volume 4}]
      (vibrato 72 55 0.5 0.2)
      (vibrato 72 40 0.7 0.3)
      (vibrato 73 2 0.7 0.3)
      (vibrato 74 2 0.7 0.3)
      (vibrato 75 68 0.7 0.3)
      [{:length 15 :pitch 160}]
      [{:loop :end}]))
  
  (play
    sq1
    []
    []
    [])
  ```
- ```clojure
  (defn k [[l p]] [[1 62] [1 58] [1 54] [1 52] [(- l 4) p]])
  (defn h [[l p]] [[1 72] [(dec l) p]])
  (defn s [[l p]] [[1 70] [1 67] [1 64] [1 54] [(- l 4) p]])
  
  (def tri
    (concat [{:loop 1}]
      (length-pitch (concat
        (k [20 49]) (h [20 56]) (s [20 52]) (h [20 56])
        (k [20 49]) (h [20 56]) (s [20 52]) (h [20 49])))
      [{:loop :end}]
      [{:loop 2}]
      (length-pitch (concat
        (k [20 49]) (h [20 56]) (s [20 52]) (h [20 56])
        (k [20 49]) (h [20 56]) (s [20 52]) (h [20 49])
        (k [20 45]) (h [20 52]) (s [20 49]) (h [20 52])
        (k [20 45]) (h [20 46]) (s [20 47]) (h [20 48])))
      [{:loop :end}]))
  
  (play
    []
    []
    tri
    [{:loop 10}
     {:length 20 :pitch 15}
     {:length 20 :pitch 0}
     {:length 20 :pitch 7}
     {:length 20 :pitch 0}
     {:loop :end}
     {:length 20 :pitch 15}])
  ```
- It seems to indicate that some loop is being miscalculated.
- Ok that's about all I've got in me tonight... time to eep
- ## ok up
- I've certainly got interesting debugging to do. And I still haven't tried the arp feature.
- Want to take the second example just because it's shorter.
- I can try making it smaller. I think the structure is key, being 2 consecutive loops:
- ```clojure
  (play [] [] [{:loop 1}
   {:length 20 :pitch 48}
   {:loop :end}
   {:loop 2}
   {:length 1 :pitch 70}
   {:length 19 :pitch 48}
   {:loop :end}] [])
  ```
- This must be a bug in the loop assembler. The issue is that it plays the 70 note way longer than 1 frame. It's supposed to be the highest part of a triangle arp for a snare. Cool that I narrowed it down to this.
- And it only does it if both loops are there!
- Let's log the loop assembly.
- That's great but it works as what's seemed to be expected.
- Maybe it's my silly loop code. This might not even make sense.
- The loop point is set like this:
- ```js
  loopPoint += stream.length + 2
  ```
- What? Like wouldn't that only work on the first one?
- LoopPoint is initially set to `s1`
- Wait... that assumes that it's stream 1! wtf!
- Let's break this up. It's time. That way we can write simpler logic because these have to be assembled in order.
- Oh... I already have conditional code setting the loop point correctly. But what about the line above?
- We take the previous loop point and add `stream.length + 2`, which is how many bytes we've assembled of this stream already.
- When we loop back, I think it messes up our count. So it could be we need a program counter type thing. This is hard, my head is so blank
- Gonna need to also do this in a function that will just count the frames by unrolling the loops
- Say our s1 position is `$835f`. That's actually what it is.
- ```
  00008340       04 00:01 00 B0 00|5F 83 01 01:01 30 00 60
  00008350 83 02 01 02:81 01 61 83|03 01 03 1E:10 78 83 A0
  00008360 A0 A4 01 94:94 03 56 A5|63 83 A4 02:81 81 00 EF
  00008370 93 93 03 56:A5 6E 83 A0|A0
  ```
- I adjusted the addresses to CPU addresses.
- We're on triangle which is stream 3 which starts at `$8361`.
- `$A4` is the loop opcode. We set loop point to `$8363` which is the stream pointer plus 2 for the opcode and argument (loop count, or `$01` here).
- Why are there 2 94s?
- It's because it does it once for the multiples of 25 (even if 0) and once for the remainder. Let's stop that.
- This part of the code is confusing me. How do we know whether to push a length and when not to?
- I guess I need to keep track of the last length as well as the current one.
- ```
  00008340       04 00:01 00 B0 00|5F 83 01 01:01 30 00 60
  00008350 83 02 01 02:81 01 61 83|03 01 03 1E:10 78 83 A0
  00008360 A0 A4 01 94:94 03 56 A5|63 83 A4 02:81 81 00 EF
  00008370 93 93 03 56:A5 6E 83 A0|A0
  ```
- God dammit it's the same thing. I can't get it to not repeat them. Making a last length variable doesn't work. This is annoying.
- When we get to a length, we always push. I think we need to have a conditional there. Don't push if it's not over 25.
- ```
  00008340       04 00:01 00 B0 00|5F 83 01 01:01 30 00 60
  00008350 83 02 01 02:81 01 61 83|03 01 03 1E:10 75 83 A0
  00008360 A0 A4 01 94:03 56 A5 63|83 A4 02 81:00 EF 93 03
  00008370 56 A5 6D 83:A0 A0
  ```
- This code doesn't get the stop message. But other than that it seems right.
- I think we just need to not add 2 the second time.
- No. I've got it. The problem is we can't add the stream length to the loop point again. Or else it's adding the same bytes twice. We need the stream length added to the starting position.
- What if I do this:
- ```js
  loopPoint = (stream.length + [s1, s2, s3][streamNum]) + 2
  ```
- Got it! And guess what... it solved the other issue too.
- There's some timing weirdness going on. The numbers just aren't lining up.
- I'll take the loops out to make it simpler.
- It seems to make no difference, which is good because I don't want it to be a loop problem.
- I wonder if it has something to do with the arps, which I fixed by removing the nils.
- I bet if I add up all of the notes...
- ```clojure
  (loop [s (arp 79 [61 64 68] vol-duty)
         len 0
         total 0]
    (cond
      (empty? s) total
      (:length (first s))
      (recur (rest s) (:length (first s)) (+ total (:length (first s))))
      :else (recur (rest s) len (+ total len))))
  => 
  80 
  ```
- Yep. There's an extra note or something.
- It even does it with a "single frame arp":
- ```clojure
  (arp 1 [61 64 68] vol-duty)
  => 
  ({:volume 12
   :length 1
   :duty 2
   :pitch 61}
   {:volume 11
    :duty 2
    :pitch 160}) 
  ```
- This arp function is kind of bunk anyway, it has the first frame hardcoded in it:
- ```clojure
  (defn arp
      "Takes a note length in frames, and a sequence of 
      pitches. Will loop the pitches for as many frames
      as length allows, and rest for any frames left
      after the vol-duty sequence has played."
    [length arp-seq vol-duty-seq]
    (filter identity
    (let [notes (take length vol-duty-seq)
          pitches (rest (take length (cycle arp-seq)))]
      (concat [{:volume 12 :length 1 :duty 2 
                :pitch (first arp-seq)}]
        (for [frame (range (count (take length vol-duty-seq)))]
          {:volume (first (nth notes frame)) 
           :duty (last (nth notes frame)) 
           :pitch (or (nth pitches frame) 160)})
      (when (< (count vol-duty-seq) length)
        {:length (- length (count vol-duty-seq))
         :volume 0 :pitch 160})))))
  ```
- At least this isn't a problem with the app, just my silly composition code.
- This should fix that
- ```clojure
  (defn arp
      "Takes a note length in frames, and a sequence of 
      pitches. Will loop the pitches for as many frames
      as length allows, and rest for any frames left
      after the vol-duty sequence has played."
    [length arp-seq vol-duty-seq]
    (let [notes (take length vol-duty-seq)
          pitches (take length (cycle arp-seq))]
      (concat [{:length 1}]
        (for [frame (range (count (take length vol-duty-seq)))]
          {:volume (first (nth notes frame))
           :duty (last (nth notes frame))
           :pitch (nth pitches frame)})
      (when (< (count vol-duty-seq) length)
        {:length (- length (count vol-duty-seq))
         :volume 0 :pitch 160}))))
  ```
- No, I don't think it's a good idea to use `take` there, because what about the last note? It assumes they're all 1 frame, but I guess it's fine because it's just meant to cover for a length of 1
- Great! I fixed it.
- I guess the last thing I need to do on this page is actually use the arp loops.
- We're still doing arps by spamming, which is bad for both rom size and application performance. We can generate way fewer notes this way.
- Then there are the arps that are more like envelopes, which just run once. These are not loops as in repetitions, just preprogrammed sequences which are used arbitrarily. This would be an adjacent area of optimization.
- This is old stuff, I was thinking of this before I even thought of the looping thing.
- Point is, we want to add to our note API an `arp` key. It works just like loop, both under the hood and semantically, as in it will be `:arp n` to start, do n repetitions of the notes between there and the `:arp :end` command.
- set arp counter is A9, arp is AA.
- Cool! That works great.
-