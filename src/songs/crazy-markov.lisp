(defn k
  "Kick wrapper. Precedes note with relative arpeggio,
   subtracting length as needed. Takes and returns
   sequences of length-pitch pairs."
  [[l p]]
  (let [arp (vec (take l [[1 (+ p 19)] [1 (+ p 15)]
           [1 (+ p 12)] [1 (+ p 7)] [1 (+ p 3)]]))]
    (if (< 5 l) (conj arp [(- l 5) p]) arp)))

(defn k2 [[l p]]
  (let [arp (vec (take l [[1 (+ p 12)] [1 p] [1 (- p 12)]]))]
    (if (< 3 l) (conj arp [(- l 3) p]) arp)))

(defn k3 [[l p]]
  (let [arp (vec (take l [[1 (+ p 12)] [1 (+ p 7)] [1 p]
                          [1 (- p 12)] [3 p] [1 (- p 12)]
                          [1 (+ p 12)] [1 (+ p 7)] [1 p]]))]
    (if (< 11 l) (conj arp [(- l 11) p]) arp)))

(defn h
  "Hihat arpeggio wrapper."
  [[l p]]
  (let [arp (vec (take l [[1 72]]))]
    (if (< 1 l) (conj arp [(dec l) p]) arp)))

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

(defn snare2 [length]
  (drum length [[3 8] [3 6] [3 6] [3 6]
                [2 5] [2 5] [1 5] [1 5]]))

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
  [{:length l :pitch 160}])

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

(def beat1 (randomize (concat 
  (kick 16) (hat 16) (snare 16) (hat 16)
  (kick 16) (kick 16) (snare 16) (hat 8) (snare 8)
  (kick 16) (hat 16) (snare 16) (hat 8) (snare 8)
  (kick 16) (snare 16) (snare 16) (snare 8) (snare 8))))

(def vol-duty
  [[6 2] [5 1] [4 1] [3 1] [2 1] [2 3] [2 2]
   [2 2] [2 2] [2 2] [2 2] [2 2] [2 2] [2 2] 
   [2 2] [2 2] [2 1] [2 1] [2 1] [2 1] [2 1]
   [1 1] [1 1] [1 1] [1 1] [1 1]])

(def swell-vol-duty 
  [[3 2] [2 1] [1 1] [1 1] [1 1] [1 3] [1 3] [1 2]
 [2 2] [2 2] [2 2] [2 2] [2 2] [2 2] [2 2] [2 3]
 [2 3] [2 3] [2 3] [2 3] [2 3] [2 3] [2 3] [3 3]
 [3 3] [3 3] [3 3] [3 3] [3 3] [3 3] [3 3] [3 0]
 [3 0] [3 0] [3 0] [3 0] [3 0] [3 0] [3 0] [3 0]
 [4 0] [4 0] [4 0] [4 0] [4 0]])

(def swell2
  [[6 2] [5 2] [4 1] [3 1] [3 0] [3 0] [3 3] 
   [2 2] [2 2] [2 2] [2 2] [2 2] [2 2] [2 2]
   [2 3] [2 3] [2 3] [2 3] [2 3] [2 3] [2 3] [2 3]
   [3 3] [3 3] [3 3] [3 3] [3 3] [3 3] [3 3] [3 3] 
   [3 0] [3 0] [3 0] [3 0] [3 0] [3 0] [3 0] [3 0]
   [4 0] [4 0] [4 0] [4 0] [4 0] [4 0] [4 0] [4 0]
   [4 1] [4 1] [4 1] [4 1] [4 1] [4 1] [4 1] [4 1]
   [4 1] [4 1] [4 1] [4 1] [4 1] [4 1] [4 1]
   [5 1] [5 1] [5 1] [5 1] [5 1] [5 1] [5 1]])

(def chorus-arp
  [[6 3] [5 2] [4 2] [3 1] [2 1] [2 0] [2 0]
   [2 3] [2 3] [2 3] [2 3] [2 2] [2 2] [2 2] [2 2] [2 2]
   [2 2] [2 2] [2 2] [2 2] [2 2] [1 1] [1 1] [1 1] [1 1]
   [1 1] [1 1] [1 1] [1 1]])

(defn arp
    "Takes a note length in frames, and a sequence of 
    pitches. Will loop the pitches for as many frames
    as length allows, and rest for any frames left
    after the vol-duty sequence has played."
  [length arp-seq vol-duty-seq]
  (keep
  (let [notes (take length vol-duty-seq)
        pitches (take length (cycle arp-seq))]
    (concat [{:length 1}]
      (for [frame (range (count (take length vol-duty-seq)))]
        {:volume (first (nth notes frame))
         :duty (last (nth notes frame))
         :pitch (nth pitches frame)})
    (when (< (count vol-duty-seq) length)
      {:length (- length (count vol-duty-seq))
       :volume 0 :pitch 160})))))

(defn slide [from to frames]
  (length-pitch (take frames 
    (if (< to from)
      (map #(vector 1 %) (reverse (range to from (/ (abs (- from to)) frames))))
      (map #(vector 1 %) (range from to (/ (abs (- from to)) frames)))))))

(def bass1
  (randomize (concat (length-pitch (concat
  (k [40 40]) (k [4 52]) [[6 160]] (k [4 47])
  [[6 160]] (k2 [10 45]) (k2 [10 47]) (k2 [3 47])))
  (slide 55 57 7) (r 10) (slide 55 57 10) (r 10)
  (length-pitch (concat (k [4 52]) [[6 160]]
  (k [4 47]) [[6 160]])))) 0.3 0.1))

(def bass (randomize (concat
  bass1 (length-pitch (concat (k [15 38]) [[5 160]]))
  bass1 (length-pitch (concat (k [10 33]) [[10 35]]))
  bass1 (length-pitch (concat (k [10 38]) [[10 40]]
  (k [40 43]) [[1 160]] (k [4 52]) [[5 160]] (k [4 47])
  [[5 160]] (k [10 38]) [[10 40]] (k2 [10 45]) (k2 [4 46])))
  (slide 45 46 7) (slide 46 45 10)
  (length-pitch (concat [[10 45]] (k [31 38]) (k2 [9 39]))))))

(def bass2 (randomize (concat
  bass1 (length-pitch (concat (k [15 38]) [[5 160]]))
  bass1 (length-pitch (concat (k [10 33]) [[10 35]]))
  bass1 (length-pitch (concat (k [10 38]) [[10 40]]
  (k [40 43]) [[1 160]] (k [5 52]) [[5 160]] (k [4 47])
  [[5 160]] (k [10 38]) [[10 40]] (k [10 43]) (k2 [10 45])
  (k2 [20 47]) (k [10 50]) (k2 [10 62]) (k2 [10 51]) (k2 [10 63]))))))

(def bass3 (randomize (length-pitch (concat
  (k [10 52]) [[10 160]] (k [20 52]) (k [18 55]) [[2 160]] (k2 [20 55])
  (k [10 52]) [[10 160]] (k [20 52]) (k [20 55]) (k2 [10 52]) (k2 [10 55])
  (k [10 47]) [[10 160]] (k [20 47]) (k [18 50]) [[2 160]] (k2 [20 50])
  (k [10 47]) [[10 160]] (k [20 47]) (k [10 50]) (k2 [10 52])
  (k2 [10 55]) (k2 [10 57]) (k [5 57]) (k2 [5 57.5]) (k2 [5 58]) (k2 [5 57]) (k2 [20 55])
  (k [10 57]) (k2 [10 55]) (k [20 52])
  (k [10 52]) [[10 160]] (k [20 52]) (k [20 55]) (k2 [10 52]) (k2 [10 55])
  (k [10 47]) [[10 160]] (k [20 47]) (k [18 50]) [[2 160]] (k2 [20 50])
  (k [10 47]) [[10 160]] (k [20 47]) (k [10 50]) (k2 [10 52])
  (k2 [10 55]) (k2 [10 57])))))

(def sq2
  (randomize (concat (arp 20 [64 67 71] vol-duty) (arp 40 [64 67 71] vol-duty)
    (arp 40 [64 67 71] vol-duty) (arp 20 [64 67 71] vol-duty)
    (arp 40 [62 65 69] swell-vol-duty)
    (arp 20 [64 67 71] vol-duty) (arp 40 [64 67 71] vol-duty)
    (arp 40 [64 67 71] vol-duty) (arp 20 [64 67 71] vol-duty)
    (arp 40 [64 69 72] swell-vol-duty)
    (arp 20 [64 67 71] vol-duty) (arp 40 [64 67 71] vol-duty)
    (arp 40 [64 67 71] vol-duty) (arp 20 [64 67 71] vol-duty)
    (arp 40 [62 65 69] swell-vol-duty)
    (arp 20 [67 71 74] vol-duty) (arp 60 [67 71 74] swell2)
    (arp 20 [69 72 76] vol-duty) (arp 60 [69 72 76] swell2))))

(def sq2a (randomize (concat
            (loop2 2 (concat
  (arp 20 [64 67 71] chorus-arp) (arp 60 [64 67 71] chorus-arp)))
            (loop2 2 (concat
  (arp 20 [59 62 66] chorus-arp) (arp 60 [59 62 66] chorus-arp))))))

(def beat (randomize (concat
  (kick 20) (hat 20) (snare 20) (hat 10) (hat 10)
  (kick 20) (kick 20) (hat 10) (hat 10) (kick 10) (snare2 10))))

(defn lead [notes]
  (loop [n notes res [] index 1]
    (if (empty? n) res
      (recur (rest n)
        (concat res
          (if (< 2 (:length (first n)))
            (concat (length-pitch (k2 [3 (:pitch (first n))]))
              (for [frame (range 1 (- (:length (first n)) 3))]
                {:length 1
                 :volume (if (odd? frame) 4 2)
                 :pitch (:pitch (first n))}))
            [{:length (:length (first n))
              :volume (if (odd? index) 4 2)
              :pitch (:pitch (first n))}]))
        (inc index)))))

(defn lead2 [notes]
  (loop [n notes res [] index 1]
    (if (empty? n) res
      (recur (rest n)
        (concat res
          (if (< 2 (:length (first n)))
            (concat (length-pitch (k3 [3 (:pitch (first n))]))
              (for [frame (range 1 (- (:length (first n)) 3))]
                {:length 1
                 :volume (if (odd? frame) 3 1)
                 :pitch (:pitch (first n))}))
            [{:length (:length (first n))
              :volume (if (odd? index) 3 1)
              :pitch (:pitch (first n))}]))
        (inc index)))))

(def sq1
  (lead (concat [{:volume 4 :length 20 :pitch 160}
                 {:length 3 :pitch 69 :duty 2}]
    (randomize (concat
          (slide 69 71 10)
    (length-pitch [[10 71] [23 160] [20 64] [37 64] [40 160] [3 62]])
    (slide 62 64 17) (length-pitch [[20 62] [20 64] [3 65]]) (slide 66 67 10)
    (length-pitch [[20 67] [91 160] [3 69]]) (slide 69 71 17)
    (length-pitch [[10 71] [10 160] [20 74] [3 71]]) (slide 69 71 17)
    (length-pitch [[20 71] [3 71]]) (slide 69 71 17)
    (length-pitch [[20 71] [3 71]]) (slide 69 71 7)
    (length-pitch [[10 71] [20 69] [20 67] [3 69]]) (slide 69 71 7)
    (length-pitch [[10 71] [40 64] [45 160]]))))))

(def sq1a
  (lead2 (concat [{:length 3 :pitch 76}]
    (randomize (concat (slide 76 79 17)
    (length-pitch [[20 79] [40 76] [145 160] [20 74] [20 74] [20 76] [20 79] [20 81] [3 81]])
    (slide 81 83 17) (length-pitch [[25 83] [20 79] [20 76] [240 160]]))))))

(def bass4 (randomize (length-pitch (concat
  (k [10 62]) (k2 [10 63]) (k2 [20 64]) (k2 [3 71]) [[26 160]] (k2 [11 64])
  (k [10 64]) (k2 [10 63]) (k2 [20 62]) (k2 [2 69]) [[27 160]] (k2 [10 62])
  (k [10 62]) (k2 [10 63]) (k2 [20 64]) (k2 [3 71]) [[26 160]] (k2 [11 64])
  (k [10 64]) (k2 [10 63]) (k2 [20 62]) (k2 [2 69]) [[27 160]] (k2 [10 62])
  (k [10 50]) (k2 [10 51]) (k2 [20 52]) (k2 [3 59]) [[26 160]] (k2 [11 52])
  (k [10 52]) (k2 [10 51]) (k2 [20 50]) (k2 [2 57]) [[18 160]]
  (k [7 48]) (k2 [6 50]) (k2 [7 48]) (k [40 47])
  (k [10 59]) [[10 160]] (k [10 59]) [[10 160]] (k [7 59]) (k [6 60]) (k [7 59])
  (k [20 57]) (k [20 55]) (k [10 57]) (k2 [12 59])))))

(def bass5 (randomize (length-pitch (concat
  (k [10 66]) (k2 [10 62]) (k2 [10 67]) [[10 160]] (k2 [10 67]) [[10 160]]
  (k2 [10 67]) (k2 [10 62]) (k [10 67]) (k2 [10 69]) (k2 [10 66]) [[10 160]]
  (k2 [10 66]) [[10 160]] (k2 [10 66]) (k2 [10 62])))))

(def bass6 (randomize (length-pitch (concat
  (k2 [10 69]) (k2 [10 70]) (k2 [10 71]) [[10 160]] (k2 [10 59]) [[10 160]]
  (k2 [10 71]) (k2 [10 59]) (k2 [10 71]) (k2 [10 70]) (k2 [10 69]) [[10 160]]
  (k2 [10 57]) [[10 160]] (k2 [7 67]) (k2 [6 69]) (k2 [7 67]) (k2 [40 54])
  (k2 [10 47]) [[10 160]] (k2 [10 47]) [[10 160]] (k2 [7 47]) (k2 [6 48]) (k2 [7 47])
  (k2 [20 45]) (k2 [20 43]) (k2 [10 45]) (k2 [10 47])))))

(def sq2b (concat (loop2 3 (concat
  (arp 20 [64 67 71] vol-duty) (arp 60 [64 67 71] vol-duty)
  (arp 20 [62 66 69] vol-duty) (arp 60 [62 66 69] vol-duty)))
            (loop2 2 (concat
  (arp 20 [59 62 66] vol-duty) (arp 60 [59 62 66] vol-duty)))))

(def sq1b (randomize (length-pitch
  [[10 50] [10 51] [20 52] [30 160] [10 52]
   [10 52] [10 51] [20 50] [30 160] [10 50]
   [10 50] [10 51] [20 52] [30 160] [10 52]
   [10 52] [10 51] [20 50] [30 160] [10 50]
   [10 50] [10 51] [20 52] [30 160] [10 52]
   [10 52] [10 51] [20 50] [20 160]
   [20 48] [40 47] [10 54] [10 160] [10 47] [10 160]
   [10 54] [10 160] [10 47] [10 160]
   [10 59] [10 160] [10 47] [10 160]])))

(def sq1c
  (lead2 (concat [{:volume 2 :length 3 :pitch 69 :duty 0}]
    (randomize (concat (length-pitch [[10 78] [10 74] [20 79] [33 160] [10 79]
                   [10 79] [10 81] [20 78] [33 160] [10 78]]))))))

(def sq1d
  (lead2 (concat [{:volume 2 :length 3 :pitch 69 :duty 0}]
   (randomize (concat (length-pitch [[10 74] [10 71] [20 76] [33 160] [10 76]
                   [10 76] [10 78] [20 74] [33 160] [10 74]
                   [10 78] [10 74] [20 79] [33 160] [11 79]
                   [11 79] [11 81] [11 83] [10 84] [11 83] [10 81] [11 79] [11 81]]))))))

(def sq1e
  (lead2 (randomize (concat
    (length-pitch [[10 76] [10 160] [10 76]])))))

(def sq2c (concat
  (arp 20 [64 67 71] vol-duty) (arp 140 [64 67 71] vol-duty)))

(def sq2d (concat
  (arp 20 [62 67 71] vol-duty) (arp 60 [62 67 71] vol-duty)
  (arp 20 [69 72 72] vol-duty) (arp 60 [69 72 72] vol-duty)))

(play
  (concat (loop1 2 (concat (loop2 2 sq1c) sq1d)) sq1e)
  (concat (loop2 2 (concat (loop1 3 sq2c) sq2d)) sq2c)
  (loop1 2 bass)
  (concat (loop1 8 beat)))

(play
  (concat (r 1280) (concat [{:duty 2}] (loop1 2 sq1) (loop1 2 sq1a)
    [{:volume 4 :duty 0 :pitch 160 :length 1280}] (loop1 2 sq1b) 
   [{:duty 2}] (loop1 2 sq1) (loop1 2 sq1a) (loop2 2 sq1c)))
  (concat (r 1280) (loop1 2 sq2) (loop1 4 sq2a) (loop1 4 sq2b)
    (loop1 2 sq2) (loop1 4 sq2a))
  (concat (loop1 3 bass) bass2 (loop1 2 bass3)
    (loop1 2 bass4) (loop1 2 bass5) bass6 (loop1 2 bass5) bass6
    bass bass2 (loop1 2 bass3) bass)
  (concat [{:volume 0 :length 640 :pitch 0}]
    (loop1 54 beat)))

