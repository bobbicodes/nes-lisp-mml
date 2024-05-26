(defn k
  "Kick wrapper. Precedes note with fixed arpeggio,
   subtracting length as needed."
  [[l p]] [[1 62] [1 58] [1 54] [1 52] [(- l 4) p]])

(defn h
  "Hihat arpeggio wrapper."
  [[l p]] [[1 72] [(dec l) p]])

(defn s
  "Snare arpeggio wrapper."
  [[l p]] [[1 70] [1 67] [1 64] [1 54] [(- l 4) p]])

(def bass-intervals
  [[48 60 55 60] [53 65 60 65] [55 67 62 67] [56 68 63 68]])

(defn bass [interval]
  (for [[length pitch] (concat 
    (k [16 (nth (nth bass-intervals interval) 0)])
    (h [16 (nth (nth bass-intervals interval) 1)])
    (s [16 (nth (nth bass-intervals interval) 2)])
    (h [16 (nth (nth bass-intervals interval) 3)]))]
    {:length length :pitch pitch}))

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

(def oh (concat (for [[volume pitch] 
  [[6 3] [5 3] [4 3] [4 3] [4 3] [4 3]
   [4 3] [4 3] [3 2] [2 0] [1 0]]]
  {:length 1 :pitch pitch :volume volume})
  [{:length 5 :pitch 0 :volume 0}]))

(def beat1 (concat 
     (kick 16) (hat 16) (snare 16) (hat 16)
     (kick 16) (kick 16) (snare 16) (hat 8) (snare 8)
     (kick 16) (hat 16) (snare 16) (hat 8) (snare 8)
     (kick 16) (snare 16) (snare 16) (snare 8) (snare 8)))

(def beat2 (concat
     (kick 16) (hat 16) (snare 16) (hat 16)
     (kick 16) (hat 16) (snare 16) (hat 16)
     (kick 16) (hat 16) (snare 16) (hat 16)
     (kick 16) (hat 16) (snare 16) (kick 16)
     (kick 16) (hat 16) (snare 16) (hat 16)
     (kick 16) (hat 16) (snare 16) (hat 16)
     (kick 16) (hat 16) (snare 16) (hat 16)
     (kick 16) (snare 16) (snare 16) (hat 8) (snare 8)))

(def beat3 (concat
     (kick 16) (hat 16) (snare 16) (hat 16)
     (kick 16) (hat 16) (snare 16) (hat 16)
     (kick 16) (hat 16) (snare 16) (hat 16)
     (kick 16) (hat 16) (snare 16) (kick 16)
     (kick 64) (kick 50)
    (for [[volume pitch]
      [[7 3] [5 2] [4 0] [1 2] [7 3] [5 2] [4 0]
       [7 3] [5 2] [4 0] [2 2] [2 0] [1 2]]]
  {:length 1 :volume volume :pitch pitch})
    (kick 8) (hat 8) (hat 8) (hat 8) (snare 16) (hat 8) (hat 8)
    (kick 8) (hat 8) (snare 16) (snare 16) (snare 8) (snare 8)))

(def beat4 (concat 
     (kick 8) (hat 8) (hat 8) (hat 8) (snare 16) (hat 8) (hat 8)
     (kick 8) (hat 8) (hat 8) (hat 8) (snare 16) (hat 5) (hat 5) (hat 6)
     (kick 8) (hat 8) (hat 8) (hat 8) (snare 16) (hat 8) (hat 8)
     (kick 8) (hat 8) oh (snare 16) oh
     (kick 8) (hat 8) (hat 8) (hat 8) (snare 16) (hat 8) (hat 8)
     (kick 8) (hat 8) (hat 8) (hat 8) (snare 16) (hat 5) (hat 5) (hat 6)
     (kick 8) (hat 8) (hat 8) (hat 8) (snare 16) (hat 8) (hat 8)
     (kick 8) (hat 8) (snare 16) (snare 16) (snare 8) (snare 8)))

(defn decode-vol-duty [m]
  (let [decode (fn [v] (mapcat #(repeat (first %) (second %)) v))]
    (partition 2 (interleave (decode (:volume m)) (decode (:duty m))))))

(def vol-duty (decode-vol-duty
  {:volume [[1 11] [1 10] [1 9] [1 8] [1 7]
            [1 6] [5 4] [5 3] [5 2] [5 1]]
   :duty [[1 2] [4 1] [1 3] [10 2] [10 1]]}))

(def swell-vol-duty (decode-vol-duty
  {:volume [[1 11] [1 10] [1 9] [1 8] [1 7]
            [1 6] [5 4] [6 5] [6 6] [6 7] [6 8]]
   :duty [[1 2] [4 1] [1 3] [5 2] [12 3] [12 0]]}))

(def swell2 (decode-vol-duty
  {:volume [[1 12] [1 11] [1 10] [1 9] [1 8] [1 7] [1 6]
            [7 4] [8 5] [8 6] [8 7] [8 8] [8 9] [14 10]]
   :duty [[2 2] [2 1] [2 0] [1 3] [7 2] [16 3] [16 0] [22 1]]}))

(def chorus-arp (decode-vol-duty
  {:volume [[1 13] [1 12] [1 11] [1 10] [1 9] [1 8]
            [1 7] [4 5] [5 4] [5 3] [5 2] [8 1]]
   :duty [[1 3] [2 2] [2 1] [2 0] [4 3] [10 2] [13 1]]}))

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

(def intro-vol-duty
  (for [n (range 64)]
    [(inc (Math/floor (/ n 7)))
     (nth (take 64 (cycle [1 2 3 0]))
       (Math/floor (/ n 14)))]))

(def intro-swell
  (let [pitches (take 64 (cycle [60 63 67]))]
    (for [frame (range 64)]
      {:length 1 :pitch (nth pitches frame)
       :volume (first (nth intro-vol-duty frame))
       :duty (last (nth intro-vol-duty frame))})))

(def sq2-patt (concat (arp 16 [60 63 67] vol-duty)
    (arp 32 [60 63 67] vol-duty) (arp 32 [60 63 67] vol-duty)
    (arp 32 [60 63 67] vol-duty) (arp 16 [61 65 68] vol-duty)
    (arp 16 [60 63 67] vol-duty) (arp 32 [60 63 67] vol-duty) 
    (arp 32 [60 63 67] vol-duty) (arp 16 [60 63 67] vol-duty)
    (arp 32 [61 65 68] swell-vol-duty) (arp 16 [60 63 67] vol-duty) 
    (arp 32 [60 63 67] vol-duty) (arp 32 [60 63 67] vol-duty) 
    (arp 32 [60 63 67] vol-duty) (arp 16 [61 65 68] vol-duty)))

(def sq2-patt2 (concat (arp 16 [65 68 72] vol-duty)
    (arp 32 [65 68 72] vol-duty) (arp 32 [65 68 72] vol-duty)
    (arp 32 [65 68 72] vol-duty) (arp 16 [67 71 74] vol-duty)))

(def sq2-patt3 (concat (arp 16 [67 71 74] vol-duty)
    (arp 32 [67 71 74] vol-duty) (arp 32 [67 71 74] vol-duty)
    (arp 32 [67 71 74] vol-duty) (arp 16 [61 65 68] vol-duty)))

(def sq2-patt4 (concat (arp 16 [60 63 67] vol-duty)
    (arp 32 [60 63 67] vol-duty) (arp 32 [60 63 67] vol-duty)
    (arp 16 [60 63 67] vol-duty) (arp 32 [60 63 67] swell-vol-duty)
    (arp 16 [65 68 72] vol-duty) (arp 32 [65 68 72] vol-duty) 
    (arp 16 [65 68 72] vol-duty) (arp 16 [67 71 74] vol-duty) 
    (arp 32 [67 71 74] vol-duty) (arp 16 [67 71 74] vol-duty)
    (arp 16 [60 63 67] vol-duty) (arp 16 [60 63 67] vol-duty)
    (arp 16 [60 63 67] vol-duty) (arp 16 [61 65 68] vol-duty) 
    (arp 16 [60 63 67] vol-duty)))

(def sq2-patt5
  (concat (arp 16 [65 68 72] vol-duty) (arp 32 [65 68 72] vol-duty) 
    (arp 16 [65 68 72] vol-duty) (arp 16 [67 71 74] vol-duty) 
    (arp 32 [67 71 74] vol-duty) (arp 16 [67 71 74] vol-duty)
    (arp 16 [60 63 67] vol-duty) (arp 16 [60 63 67] vol-duty)
    (arp 16 [60 63 67] vol-duty) (arp 16 [61 65 68] vol-duty)
    (arp 32 [60 63 67] vol-duty) (arp 32 [60 63 67] vol-duty)))

(def sq2-patt6
  (concat (arp 64 [65 68 72] swell2) (arp 64 [67 71 74] swell2)
    (arp 16 [60 63 67] vol-duty) (arp 16 [60 63 67] vol-duty)
    (arp 16 [60 63 67] vol-duty) (arp 16 [61 65 68] vol-duty)
    (arp 32 [60 63 67] vol-duty) (arp 32 [60 63 67] vol-duty)))

(def sq2-patt7
  (concat (arp 16 [72 75 79 60 63 67] chorus-arp)
    (arp 16 [72 75 79 60 63 67] chorus-arp)
    (arp 16 [72] chorus-arp)
    (arp 32 [72 75 79 60 63 67] chorus-arp)
    (arp 16 [72 75 79 60 63 67] chorus-arp)
    (arp 16 [72] chorus-arp)
    (arp 16 [73 77 80 61 65 68] chorus-arp)))

(def sq2-patt8
  (concat (arp 16 [73 77 80 61 65 68] chorus-arp)
    (arp 16 [73 77 80 61 65 68] chorus-arp)
    (arp 16 [72] chorus-arp)
    (arp 32 [73 77 80 61 65 68] chorus-arp)
    (arp 16 [73 77 80 61 65 68] chorus-arp)
    (arp 16 [73 77 80 61 65 68] chorus-arp)
    (arp 16 [73 77 80 61 65 68] chorus-arp)))

(defn vibrato [pitch length speed width]
  (concat [{:length 1}]
    (for [x (range length)]
      {:pitch (+ pitch (* width (sin (* speed x))))})))

(defn release [notes]
  (let [head (take (- (count notes) 5) notes)
        tail (drop (- (count notes) 5) notes)]
    (if (= (count tail) 5)
      (concat head (map-indexed (fn [index note] 
                 (assoc note :volume (- 6 index)))
          tail)) notes)))

(defn lead-inst [length pitch duty]
  (let [attack [{:length 1 :pitch pitch :duty duty :volume 14}
                {:length 2 :pitch (+ 12 pitch) :volume 7}]]
    (if (< length 14)
      (concat attack [{:length (- length 3) :pitch pitch}])
      (concat attack [{:length 11 :pitch pitch}]
               (vibrato pitch (- length 14) 0.7 0.25)))))

(def lead1 (concat (apply concat (for [[length pitch]
      [[56 72] [8 71] [24 72] [8 68] [16 67] [16 66]
       [48 67] [16 63] [36 60] [16 60] [16 62] [32 63]
       [32 60] [32 67] [32 68] [48 65] [8 65] [8 67]
       [4 65] [4 67] [36 65] [16 67] [56 71] [8 70]
       [24 71] [8 68] [16 67] [16 66] [16 67] [16 63]
       [64 60] [16 60] [16 62] [32 63] [16 62] [16 60]
       [16 59] [8 60] [8 59] [16 57] [16 59] [64 60]]]
  (release (lead-inst length pitch 1))))))

(def lead2 (concat (apply concat (for [[length pitch]
      [[16 55] [16 56] [16 58] [48 60] [16 63] 
       [24 62] [8 60] [16 59] [16 62] [8 55] 
       [8 56] [8 55] [8 54] [48 55] [16 55]
       [16 56] [16 58] [32 60] [32 63] [32 62] 
       [32 65] [8 67] [8 68] [8 67] [8 66] [80 67]
       [16 67] [48 68] [16 67] [32 65] [16 67] [16 68]
       [8 67] [8 68] [32 67] [16 63] [32 60] [16 60]
       [16 62] [32 63] [16 62] [16 60] [16 59] [8 60]
       [8 59] [16 57] [16 59] [64 60]]]
  (release (lead-inst length pitch 1))))))

(def lead3 (concat (apply concat (for [[length pitch]
      [[48 60] [8 60] [8 61] [8 64] [8 65] [8 64] [8 61] [32 60]
       [48 60] [8 60] [8 61] [8 64] [8 65] [8 64] 
       [8 61] [16 60] [8 55] [8 58]
       [48 60] [8 60] [8 61] [8 64] [8 65] [8 67] [8 70] [16 72]
       [8 70] [8 65] [32 53] [32 60] [16 56] [32 63] [16 60]]]
  (release (lead-inst length pitch 0))))))

(def sq1a (concat [{:length 256 :pitch 0 :volume 0}]
    lead1 [{:length 32 :pitch 0 :volume 0}]
    (release (lead-inst 32 67 1)) lead1))

(def sq1b (concat [{:length 16 :pitch 0 :volume 0}] lead2
    [{:length 64 :pitch 0 :volume 0}]))

(def sq2a (concat [{:length 192 :pitch 0 :volume 0}] 
    intro-swell sq2-patt sq2-patt2 sq2-patt3
    sq2-patt4 [{:length 48 :pitch 0 :volume 0}]))

(def sq2b (concat sq2-patt sq2-patt2 sq2-patt3 sq2-patt4))

(play
  (concat sq1a sq1b (loop1 2 lead3))
  (concat sq2a sq2b [{:length 48 :pitch 0 :volume 0}]
    (loop1 3 sq2-patt5) sq2-patt6
    (loop2 2 (concat (loop1 3 sq2-patt7) sq2-patt8)))
  (concat (loop1 4 (bass 0)) (loop1 2 (concat (loop2 6 (bass 0))
    (loop2 2 (bass 1)) (loop2 2 (bass 2)) (loop2 2 (bass 0))
    (bass 3) (bass 2) (loop2 2 (bass 0))))
    (loop1 3 (concat (bass 1) (bass 2) (bass 0) (bass 0)))
    [{:length 1 :pitch 62} {:pitch 58} {:pitch 54} {:pitch 52}
    {:length 64 :pitch 56} {:length 1 :pitch 62} {:pitch 58} 
    {:pitch 54} {:pitch 52} {:length 55 :pitch 55}]
    (loop1 2 (bass 0)) (loop2 2 (concat (loop1 6 (bass 0)) 
    (loop1 2 (bass 1)))))
  (concat beat1 (loop1 5 beat2) beat3 (loop1 2 beat4)))
