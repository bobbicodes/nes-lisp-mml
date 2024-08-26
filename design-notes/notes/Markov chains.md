- This works in my Lisp (adapted from Jack Rusher's Clojure code)
- ```clojure
  (def wandering-aengus "
  I went out to the hazel wood,
  Because a fire was in my head,
  And cut and peeled a hazel wand,
  And hooked a berry to a thread;
  And when white moths were on the wing,
  And moth-like stars were flickering out,
  I dropped the berry in a stream
  And caught a little silver trout.
  
  When I had laid it on the floor
  I went to blow the fire a-flame,
  But something rustled on the floor,
  And someone called me by my name:
  It had become a glimmering girl
  With apple blossom in her hair
  Who called me by my name and ran
  And faded through the brightening air.
  
  Though I am old with wandering
  Through hollow lands and hilly lands,
  I will find out where she has gone,
  And kiss her lips and take her hands;
  And walk among long dappled grass,
  And pluck till time and times are done,
  The silver apples of the moon,
  The golden apples of the sun.")
  
  (defn transitions
    "Produces a transition table for the production of
     markov chains from one or more sequences"
    [& values]
    (apply merge-with concat
      (map #(reduce (fn [accum [k v]] (assoc accum k (conj (or (get accum k) []) v))) {}
                    (partition 2 1 %)) values)))
  
  (defn markov-chain
    "Return a random chain of length len using transition table trans"
    [trans len]
    (loop [value (rand-nth (keys trans)) part []]
      (if (>= (count part) len)
        part
        (recur (if (not (empty? (trans value)))
                 (rand-nth (trans value))
                 (rand-nth (keys trans)))
               (conj part value)))))
  
  (def words
    (filter #(and (not (nil? %)) (> (count %) 0))
            (str/split (lower-case wandering-aengus) #"[^\\w]")))
  
  (markov-chain (transitions words) 10)
  ```
- It can be used for music by doing something like this
- ```clojure
  (defn randomize [notes]
    (markov-chain (transitions notes) (count notes)))
  
  (def lead2sq1 (vib (release (length-pitch 
        (randomize [[12 74] [12 73] [10 74] [2 160] [12 74]
         [12 69] [12 68] [10 69] [2 160] [12 69]
         [22 66] [2 160] [22 66] [2 160] [12 66]
         [12 63] [24 62] [12 63] [12 62] [12 63]
         [12 65] [12 67] [12 66] [12 67] [12 69]
         [12 70] [12 72] [1 72.2] [1 72.4] [1 72.6]
         [1 72.8] [1 73] [1 73.2] [1 73.4] [1 73.6]
         [1 73.8] [15 74] [24 72] [24 70] [12 74]
         [12 73] [10 74] [2 160] [12 74] [12 69]
         [12 68] [10 69] [2 160] [12 69] [22 66]
         [2 160] [22 66] [2 160] [36 66] [6 67] [6 69]
         [48 67] [48 63] [6 63] [2 160] [6 63] [2 160]
         [6 63] [2 160] [6 67] [2 160] [6 67] [2 160]
         [6 67] [2 160] [6 66] [2 160] [6 66] [2 160]
         [6 66] [2 160] [6 63] [2 160] [6 63] [2 160]
         [6 63] [2 160]]))) 0.7 0.3))
  ```
- Funny mouse song
- ```clojure
  (defn k
    "Kick wrapper. Precedes note with fixed arpeggio,
     subtracting length as needed. Takes and returns
     sequences of length-pitch pairs."
    [[l p]]
    (let [arp (vec (take l [[1 62] [1 58] [1 54] [1 52]]))]
      (if (< 4 l) (conj arp [(- l 4) p]) arp)))
  
  (defn h
    "Hihat arpeggio wrapper."
    [[l p]]
    (let [arp (vec (take l [[1 72]]))]
      (if (< 4 l) (conj arp [(dec l) p]) arp)))
  
  (defn s
    "Snare arpeggio wrapper."
    [[l p]]
    (let [arp (vec (take l [[1 70] [1 67] [1 64] [1 54]]))]
      (if (< 4 l) (conj arp [(- l 4) p]) arp)))
  
  (defn t
    "Tom arpeggio wrapper."
    [[l p]]
    (take l (conj (mapv #(vector 1 (+ p %)) (reverse (range 10)))
      [(- l 9) p])))
  
  (defn drum
    "Takes a decay length and a volume-pitch sequence."
    [length vol-pitch]
    (let [frame1 {:length 1 :volume (ffirst vol-pitch)
                  :pitch (last (first vol-pitch))}
          midframes (for [[volume pitch] (rest vol-pitch)]
                      {:volume volume :pitch pitch})
          tail {:length (if (< length (count vol-pitch))
                          0 (- length (count vol-pitch)))
                      :volume 0 :pitch 0}]
      (concat [frame1] midframes [tail])))
  
  (defn kick [length]
    (drum length [[10 6] [7 2] [4 1] [3 1] [2 0]]))
  
  (defn snare [length]
    (drum length [[11 8] [9 6] [8 6] [7 6]
                  [4 5] [3 5] [2 5] [1 5]]))
  
  (defn hat [length]
    (drum length [[4 3] [3 2] [2 0] [1 0]]))
  
  (defn hat2 [length]
   (drum length [[3 3] [2 2] [1 0] [1 0]]))
  
  (defn oh [length]
    (drum length [[6 3] [5 3] [4 3] [4 3] [4 3] [4 3]
                  [4 3] [4 3] [3 2] [2 0] [1 0] [1 0]]))
  
  (defn tom [length]
    (drum length [[4 12] [4 6] [3 6] [2 6] [1 6]]))
  
  (defn tom2 [length]
    (drum length [[3 12] [3 6] [2 6] [1 6] [1 6]]))
  
  (defn r
    "Returns a sequence consisting of a rest of length l."
    [l]
    [{:length l :volume 0 :pitch 0}])
  
  (defn transitions
    "Produces a transition table for the production of
     markov chains from one or more sequences"
    [& values]
    (apply merge-with concat
      (map #(reduce (fn [accum [k v]] (assoc accum k (conj (or (get accum k) []) v))) {}
                    (partition 2 1 %)) values)))
  
  (defn markov-chain
    "Return a random chain of length len using transition table trans"
    [trans len]
    (loop [value (rand-nth (keys trans)) part []]
      (if (>= (count part) len)
        part
        (recur (if (not (empty? (trans value)))
                 (rand-nth (trans value))
                 (rand-nth (keys trans)))
               (conj part value)))))
  
  (defn randomize [notes]
    (markov-chain (transitions notes) (count notes)))
  
  (def beat1 (concat (loop1 7 
                       (randomize (concat
      (kick 12) (hat2 6) (hat2 6) (hat 12) (hat 12) 
      (snare 12) (hat2 6) (hat2 6) (hat 12) (hat 12))))
      (loop1 4 (concat (tom 7) (tom2 7) (tom2 10)))))
  
  (defn release [notes]
    (let [head (take (- (count notes) 5) notes)
          tail (drop (- (count notes) 5) notes)]
      (if (= (count tail) 5)
        (concat head (map-indexed (fn [index note] 
                   (assoc note :volume (- 6 index)))
            tail)) notes)))
  
  (def bass1 (concat (vib (length-pitch (concat
        (k [48 62]) (k [24 65]) (h [24 67]) (k [96 69]))) 0.5 0.15)
        (loop1 2 (vib (length-pitch (concat         
        (k [24 62]) (h [24 69]) (s [24 66]) (h [24 62])
        (k [24 63]) (h [24 60]) (s [24 67]) (h [24 63])
        (k [24 70]) (h [24 67]) (s [12 70]) (h [12 69])
        (h [12 67]) (h [108 69]))) 0.5 0.15))))
  
  (def bass2a (vib (length-pitch (concat
      (k [48 50]) (k [24 53]) (h [24 55]) (k [36 50]))) 0.5 0.15))
  
  (def bass2b (vib (length-pitch (randomize (concat     
      (h [12 160]) (s [24 57]) (h [12 160]) (h [12 57])
      (k [12 50]) (h [12 57]) (k [24 50]) (s [24 57]) (h [24 50])
      (h [24 160]) (k [24 51]) (h [36 160]) (k [12 50])
      (k [10 51]) [[2 160]] (h [12 50]) (h [24 51]) (s [36 63]) 
      [[6 62] [6 61] [24 62] [12 160]] (h [12 160]) (s [24 57])
      (h [12 160]) (h [12 57]) (k [12 50]) (h [12 57]) 
      (k [24 50]) (s [24 57]) (h [24 50]) (h [24 160]) 
      (k [24 51]) (h [36 160]) (h [12 160]) (t [7 56]) [[1 160]] 
      (t [7 56]) [[1 160]] (t [7 56]) [[1 160]] (t [7 63]) [[1 160]]
      (t [7 63]) [[1 160]] (t [7 63]) [[1 160]] (t [7 61]) [[1 160]]
      (t [7 61]) [[1 160]] (t [7 61]) [[1 160]] (t [7 56]) [[1 160]]
      (t [7 56]) [[1 160]] (t [7 56]) [[1 160]] (k [36 50])))) 0.5 0.15))
  
  (def bass3 (loop1 2 (vib (length-pitch
      (randomize (concat [[7 65] [1 160] [7 65] [1 160] [8 65]
        [84 70] [6 67] [6 65] [20 63] [4 160] [48 63] [24 65]
        [48 70] [36 74] [6 70] [6 74] [20 75] [4 160] [20 75] [4 160]]
        (map #(vector 1 %) (range 75 77 0.1)) [[4 77]]))) 0.5 0.15)))
  
  (defn slide [from to frames]
    (length-pitch (take frames 
      (if (< to from)
        (map #(vector 1 %) (reverse (range to from (/ (abs (- from to)) frames))))
        (map #(vector 1 %) (range from to (/ (abs (- from to)) frames)))))))
  
  (def sq1 (concat (slide 72.5 74 24) (vib (length-pitch [[24 74]]) 0.9 0.4) 
      (slide 68 69 24)
      (vib (length-pitch [[98 69] [6 74] [6 69] [6 74]]) 0.9 0.15)
      (slide 74 75 24) (vib (length-pitch [[24 75]]) 0.9 0.4)
      (slide 68 70 24) 
      (vib (length-pitch [[76 70] [38 75] [6 74] [6 73]]) 0.9 0.4)
      (slide 72.5 74 24) (vib (length-pitch [[30 74]]) 0.9 0.4)
      (slide 68 69 24) 
      (vib (length-pitch [[72 69] [24 69] [6 70] [6 72] 
          [100 70] [36 75] [12 74] [48 73]]) 0.9 0.15)))
  
  (defn detune [notes]
    (map (fn [note] (if (:pitch note)
             (update note :pitch #(- % 0.1)) note)) notes))
  
  (def lead2sq1 (vib (release (length-pitch 
        (randomize [[12 74] [12 73] [10 74] [2 160] [12 74]
         [12 69] [12 68] [10 69] [2 160] [12 69]
         [22 66] [2 160] [22 66] [2 160] [12 66]
         [12 63] [24 62] [12 63] [12 62] [12 63]
         [12 65] [12 67] [12 66] [12 67] [12 69]
         [12 70] [12 72] [1 72.2] [1 72.4] [1 72.6]
         [1 72.8] [1 73] [1 73.2] [1 73.4] [1 73.6]
         [1 73.8] [15 74] [24 72] [24 70] [12 74]
         [12 73] [10 74] [2 160] [12 74] [12 69]
         [12 68] [10 69] [2 160] [12 69] [22 66]
         [2 160] [22 66] [2 160] [36 66] [6 67] [6 69]
         [48 67] [48 63] [6 63] [2 160] [6 63] [2 160]
         [6 63] [2 160] [6 67] [2 160] [6 67] [2 160]
         [6 67] [2 160] [6 66] [2 160] [6 66] [2 160]
         [6 66] [2 160] [6 63] [2 160] [6 63] [2 160]
         [6 63] [2 160]]))) 0.7 0.3))
  
  (def lead2sq2 (vib (release (length-pitch 
        (randomize [[48 45] [72 42] [48 160] [8 45] [8 42] [8 45]
         [48 46] [72 43] [24 46] [24 45] [24 43]
          [48 45] [72 42] [48 160] [8 45] [8 42] [8 45]
         [48 46] [72 43] [24 46] [24 45] [24 43]]))) 0.5 0.15))
  
  (def lead1 (vib (release (length-pitch 
        (randomize [[36 74] [12 72] [12 74] [12 72] [12 69] [12 67]
         [24 66] [24 67] [24 69] [24 72] [96 70] [24 160] [24 74]
         [24 72] [24 70] [12 69] [12 67] [90 66] [4 160] [20 66]
         [4 160] [12 66] [12 63] [24 62] [12 63] [12 62] [12 60]
         [12 62] [4 60] [4 62] [34 60] [6 160] [6 60] [2 160]
         [6 60] [2 160] [6 60] [2 160] [6 62] [2 160] [6 62] 
         [2 160] [6 62] [2 160] [6 63] [2 160] [6 63] [2 160]
         [6 63] [2 160] [6 66] [2 160] [6 66] [2 160] [6 66]
         [2 160]]))) 0.5 0.15))
  
  (def lead2 (vib (release (length-pitch 
        (randomize [[12 66] [12 67] [12 66] [12 67] [12 69] [12 160] [12 69]
         [12 160] [4 66] [4 67] [4 66] [4 67] [4 66] [4 67]
         [12 66] [62 160] [12 67] [12 69] [12 67] [12 69]
         [12 70] [12 160] [12 70] [12 160] [4 67] [4 69] [4 67]
         [4 69] [4 67] [4 69] [12 67] [62 160] [12 66] [12 67]
         [12 66] [8 67] [12 69] [12 160] [12 69] [12 160] [24 67]
         [24 66] [24 67] [24 66] [36 63] [12 62] 
         [6 60] [2 160] [6 60] [2 160] [6 60] [2 160] 
         [6 67] [2 160] [6 67] [2 160] [6 67] [2 160]
         [6 66] [2 160] [6 66] [2 160] [6 66] [2 160]
         [6 63] [2 160] [6 63] [2 160] [6 63] [2 160]
        [48 160]]))) 0.7 0.3))
  
  (def sq2-intro (vib (release (length-pitch 
        (randomize [[12 62] [12 63] [12 65] [12 70] [12 65] 
         [12 67] [48 65] [48 63] [120 62] [96 160]
         [12 62] [12 63] [12 65] [12 70] [48 67] 
         [12 67] [12 67] [48 65] [48 70] [96 72]
         [12 70] [12 69] [48 70]
         [12 62] [12 63] [12 65] [12 70] [12 65] 
         [12 67] [48 65] [48 63] [120 62] [96 160]
         [12 62] [12 63] [12 65] [12 70] [48 67] 
         [12 67] [12 67] [48 65] [48 70] [96 72] [12 70] [12 69]
         [76 70]]))) 0.5 0.15))
  
  (def sq1a
    (randomize [[36 74] [12 72] [12 74] [12 72] [12 69] [12 67]
     [24 66] [24 67] [24 69] [24 72] [96 70] [24 160] [24 74]
     [24 72] [24 70] [12 69] [12 67] [90 66] [4 160] [20 66]
     [4 160] [12 66] [12 63] [24 62] [12 63] [12 62] [12 60]
     [12 62] [4 60] [4 62] [34 60] [6 160] [6 60] [2 160]
     [6 60] [2 160] [6 60] [2 160] [6 62] [2 160] [6 62] 
     [2 160] [6 62] [2 160] [6 63] [2 160] [6 63] [2 160]
     [6 63] [2 160] [6 66] [2 160] [6 66] [2 160] [6 66]
     [2 160] [96 62]]))
  
  (def sq1b
    (randomize [[12 66] [12 67] [12 66] [12 67] [12 69] [12 160] [12 69]
     [12 160] [4 66] [4 67] [4 66] [4 67] [4 66] [4 67]
     [12 66] [62 160] [12 67] [12 69] [12 67] [12 69]
     [12 70] [12 160] [12 70] [12 160] [4 67] [4 69] [4 67]
     [4 69] [4 67] [4 69] [12 67] [62 160] [12 66] [12 67]
     [12 66] [8 67] [12 69] [12 160] [12 69] [12 160] [24 67]
     [24 66] [24 67] [24 66] [36 63] [12 62] 
     [6 60] [2 160] [6 60] [2 160] [6 60] [2 160] 
     [6 67] [2 160] [6 67] [2 160] [6 67] [2 160]
     [6 66] [2 160] [6 66] [2 160] [6 66] [2 160]
     [6 63] [2 160] [6 63] [2 160] [6 63] [2 160] [48 160]]))
  
  (def sq1-part (concat [{:volume 1 :length 1748 :pitch 160}]
      (detune (vib (release (length-pitch (take 5 sq1a)))
                0.5 0.15)) [{:volume 4}]
      (vib (release (length-pitch sq1a)) 0.5 0.15)
      [{:duty 0 :volume 2 :length 160 :pitch 160}]
      (detune (concat (vib (release (length-pitch 
        (concat sq1b (take 66 sq1b)) )) 0.7 0.3)))
      [{:duty 0 :volume 4}]
      sq1 sq1 [{:duty 1}] lead2sq1 lead2sq1
      (vib [{:length 96 :pitch 62}] 0.7 0.3)))
  
  (def sq2-part
    (concat [{:duty 1 :volume 4 :length 72 :pitch 160}]
      sq2-intro [{:volume 5 :length 96 :pitch 160}] lead1
      (vib (release (length-pitch [[96 62]])) 0.5 0.15)
      [{:volume 1}]
      (vib (release (length-pitch 
        (randomize [[16 69] [12 67]
         [24 66] [24 67] [24 69] [24 72] [96 70] [24 160] [24 74]
         [24 72] [24 70] [12 69] [12 67] [90 66] [4 160] [20 66]
         [4 160] [12 66] [12 63] [24 62] [12 63] [12 62] [12 60]
         [12 62] [4 60] [4 62] [34 60] [6 160] [6 60] [2 160]
         [6 60] [2 160] [6 60] [2 160] [6 62] [2 160] [6 62] 
         [2 160] [6 62] [2 160] [6 63] [2 160] [6 63] [2 160]
         [6 63] [2 160] [6 66] [2 160] [6 66] [2 160] [6 66]
         [2 160]]))) 0.5 0.15)
      [{:volume 5 :length 218 :pitch 160}] (loop1 3 lead2)
      (vib (release (length-pitch (take 70 sq1b))) 0.7 0.3)
      lead2sq2 lead2sq2 (vib [{:length 96 :pitch 42}] 0.7 0.3)))
  
  (def tri-part
    (concat bass3 bass3
        (vib (length-pitch (concat 
            [[7 65] [1 160] [7 65] [1 160] [8 65] [72 70]])) 0.5 0.15)
        [{:volume 4}] bass1
        (loop1 2 (vib (length-pitch (randomize (concat         
        (k [24 62]) (h [24 69]) (s [24 66]) (h [24 62])
        (k [24 63]) (h [24 60]) (s [24 67]) (h [24 63])
        (k [24 70]) (h [24 67]) (s [12 70]) (h [12 69])
        (h [12 67]) (h [108 69])))) 0.5 0.15))
        bass2a bass2b bass2b bass2b bass2b bass2b bass2b))
  
  (def noise-part
    (concat [{:volume 0 :length 1638 :pitch 0}]
      (oh 12) (r 36) (oh 12) (r 36)
      (loop1 16 (randomize (concat
        (kick 12) (hat2 6) (hat2 6) (hat 12) (hat 12)
        (snare 12) (hat2 6) (hat2 6) (hat 12) (hat 12))))
      (r 96) (oh 12) (r 36) (oh 12) (r 36)
      (concat beat1 beat1 beat1 beat1)))
  
  (save-wav "mouse-markov.wav"
    sq1-part
    sq2-part
    tri-part
    noise-part)
  ```