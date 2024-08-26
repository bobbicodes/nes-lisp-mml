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

(def crash-envelope
  [[15 8] [15 2] [15 3] [15 3] [15 3] [15 3]
   [14 3] [14 3] [13 3] [12 3] [12 3] [11 3] [11 3]
   [10 3] [9 3] [9 3] [9 3] [8 3] [8 3] [7 3] [7 3]
   [6 3] [6 3] [5 3] [5 3] [5 3] [4 3] [4 3] [4 3] [4 3]
   [3 3] [3 3] [3 3] [3 3] [2 3] [2 3] [2 3] [2 3] [1 3]])

(defn attenuate-env
  "Reduces the volume of an envelope sequence by a given level."
  [level seq]
  (map (fn [[volume pitch]] [(max 1 (- volume level)) pitch]) seq))

(defn crash
  ([length attenuation]
   (take length (drum length (attenuate-env attenuation crash-envelope))))
  ([length]
   (take length (drum length crash-envelope))))

(defn k
  "Kick wrapper. Precedes note with fixed arpeggio,
   subtracting length as needed. Takes and returns
   sequences of length-pitch pairs."
  [[l p]]
  (let [arp (vec (take l [[1 65] [1 61]]))]
    (if (< 2 l) (conj arp [(- l 2) p]) arp)))

(defn k2
  "Kick wrapper. Precedes note with relative arpeggio,
   subtracting length as needed. Takes and returns
   sequences of length-pitch pairs."
  [[l p]]
  (let [arp (vec (take l [[1 (+ p 15)] [1 (+ p 12)] [1 (+ p 7)]
                          [1 (+ p 3)]]))]
    (if (< 4 l) (conj arp [(- l 4) p]) arp)))

(defn t
  "Tom wrapper. Precedes note with relative arpeggio."
  [[l p]]
  (let [arp (vec (take l [[1 (+ p 12)] [1 (+ p 11)] [1 (+ p 10)]
                          [1 (+ p 9)] [1 (+ p 8)] [1 (+ p 7)]
                          [1 (+ p 6)] [1 (+ p 5)] [1 (+ p 4)]
                          [1 (+ p 3)] [1 (+ p 2)] [1 (+ p 1)]
                          [1 p]]))]
    (if (< 12 l) (conj arp [(- l 12) p]) arp)))

(defn s
  "Snare arpeggio wrapper."
  [[l p]]
  (let [arp (vec (take l [[1 76] [1 64]]))]
    (if (< 2 l) (conj arp [(- l 2) p]) arp)))

(def tri1
  (concat (k [16 52])
    [[8 160]] (s [16 55]) [[8 160] [16 52] [8 160]] (s [16 55]) [[8 160]]))


(defn kick [length]
  (drum length [[12 6] [9 2] [5 1] [4 1] [2 0]]))

(defn snare [length]
  (drum length [[14 8] [12 6] [11 6] [10 6]
                [9 5] [7 5] [6 5] [4 5]
                [3 5] [2 5] [1 5]]))

(defn hat [length]
  (drum length [[4 3] [3 2] [2 0] [1 0]]))

(def drums1
  (concat
    (kick 12) (hat 6) (hat 6) (snare 12)
    (kick 12) (hat 12) (kick 12) (snare 12) (hat 12)))

(def drums2
  (concat
    (kick 12) (hat 6) (hat 6) (snare 12) (hat 12)
    (kick 12) (kick 12) (snare 12) (hat 12)))

(def saw-env
  [30 27 23 19 15 11 8 7 7 7 7 7 6 6 6 6 6 6
   5 5 5 5 5 5 4 4 4 4 4 3 3 3 3 3 2 2 2 2 2 1])

(def saw1
  (concat [{:envelope saw-env}]
    (loop2 4
      [[12 33] [12 45] [12 33] [24 38] [12 36] [12 35] [12 36]
       [12 33] [12 45] [12 33] [24 38] [12 36] [12 40] [12 28]])))

(def saw2
  [{:envelope saw-env} [12 33] [12 45] [12 33]
   [24 38] [12 36] [12 35] [12 31]
   [24 28] {:volume 2} [24 28] {:envelope saw-env}
   [6 52] [6 160] [6 47] [6 160] [6 43] [6 160]
   [24 40] [5 160] [6 40] [2 160] [4 41] [2 160]
   [4 45] [1 160] [12 47] [12 50] [12 47] [12 50] [12 51]])

(def saw3
  [{:envelope saw-env}
    [24 40] [12 160] [12 55] [24 52] [12 160] [12 50]
    [24 47] [12 160] [12 50] [6 47] [6 160] [12 50]
    [6 47] [6 160] [12 43]
    [24 40] [12 160] [12 55] [24 52] [12 160] [12 50]
    [24 45] [24 160] [6 45] [6 46] [6 160] [6 46] [24 45]])

(def saw3a
  [{:envelope saw-env}
    [24 40] [12 160] [12 55] [24 52] [12 160] [12 50]
    [24 47] [12 160] [12 50] [6 47] [6 160] [12 50]
    [6 47] [6 160] [12 43]
    [24 40] [12 160] [12 55] [24 52] [12 160] [12 50]
    [24 45] [24 160] [6 45] [6 46] [6 160] [6 46] [12 45] [12 40]])

(def saw4
  (concat
     [{:envelope saw-env}
      [24 43] [11 50] [4 160] [4 50] [1 160] [4 50] [12 43] [12 50]]
     {:volume 15} (slide 43 45 24)
     [{:envelope saw-env}
      [24 40] [11 47] [1 160] [4 47] [2 160] [4 47] [2 160]
      [12 40] [12 47] [12 160] [12 47]]))

(def tri1
  (loop1 8 (concat
     (k [3 57]) (r 21) (s [4 69]) (r 8)
     (k [4 57]) (r 20) (k [4 57]) (r 8) (s [4 69]) (r 20))))

(def tri2
  (concat
    [[36 160]] (t [12 66]) [[12 160]] (t [12 64]) (t [12 60])
         (t [12 55]) (t [12 48])))

(def tri3
  (concat
    (k [3 57]) (r 21) (s [4 69]) (r 20)
    (k [3 57]) (r 9) (k [3 57]) (r 9) (s [4 69]) (r 20))))

(def tri4
  (concat
     (k2 [12 45]) (k2 [6 57]) (k2 [6 57]) (s [2 69]) (k2 [10 45])
     (k2 [18 50]) (r 6) (k2 [12 48]) (s [2 69]) (k2 [10 47]) (k2 [12 48])
     (k2 [12 45]) (k2 [6 57]) (k2 [6 57]) (s [2 69]) (k2 [10 45])
     (k2 [18 50]) (r 6) (k2 [12 48]) (s [2 69]) (k2 [10 52]) (k2 [12 40])))

(def tri-pre-chorus
  (concat
     (k2 [12 52]) (k2 [12 52]) (s [2 69]) (r 10) (k2 [12 55])
    (r 12) (k2 [12 55]) (s [2 69]) (k2 [10 52]) (k2 [12 52])
     (k2 [24 57]) (s [2 69]) (k2 [10 57]) (r 2) (k2 [5 57]) (k2 [5 57])
     (k2 [12 57]) (k2 [12 57]) (s [2 69]) (k2 [22 57])))

(defn slide [from to frames]
  (length-pitch (take frames 
    (if (< to from)
      (map #(vector 1 %) (reverse (range to from (/ (abs (- from to)) frames))))
      (map #(vector 1 %) (range from to (/ (abs (- from to)) frames)))))))

(def surf-guitar-env1
  [11 8 6 4 4 4 4 4 4 4 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 2])

(def surf-guitar-env2
   [12 9 8 6 5 5 5 4 4 4 4 4 3])

(def echo-env
  [4 3 3 3 3 2 2 2 1])

(def trem-env
  [13 12 7 5 3 5 7 5 3 5 7 5 4 6 8 6 4 6 8 6 4 6 8 6])

(def trem-env2
  [11 10 5 3 1 3 5 3 1 3 5 3 2 4 5 4 2 4 5 4 2 4 5 4])

(def sq1-intro-end
  (concat
     [{:volume 5} [1 76] [1 79]
      {:envelope surf-guitar-env1 :duty 0}]
     [[10 81] [2 160] [5 81] [1 160] [5 81] [1 60] [5 81] [7 160]]
     {:volume 5} (slide 84 86 6) (vib-all [{:length 18 :pitch 86}] 0.7 0.13)
     [[12 84] [12 83] [12 79]] (slide 79 88 4)
     (vib-all [{:length 24 :pitch 88}] 0.7 0.1)
     (vib-all [{:length 24 :pitch 88}] 0.7 0.3)
     (slide 88 73 12)))

(def sq2-intro-end
  (concat
     [{:volume 5} [1 71] [1 74]
      {:envelope surf-guitar-env1 :duty 0}]
     [[10 76] [2 160] [5 76] [1 160] [5 76] [1 60] [5 76] [7 160]]
     {:volume 5} (slide 79 81 6) (vib-all [{:length 18 :pitch 81}] 0.7 0.13)
     [[12 79] [12 78] [12 74]] (slide 74 83 4)
     (vib-all [{:length 24 :pitch 83}] 0.7 0.1)
     (vib-all [{:length 24 :pitch 83}] 0.7 0.3)
     (slide 83 73 12)))

(def p1-intro-end
  (concat
     [{:envelope surf-guitar-env2 :duty 0}]
     [[12 72] [6 72] [6 72] [6 72] [6 160]
      [12 77] {:volume 4} [12 77]
      {:envelope surf-guitar-env2} [12 76] [12 74] [12 71]]
     (vib-all [{:length 24 :pitch 80}] 0.7 0.1)
     (vib-all [{:length 24 :pitch 80}] 0.7 0.3)))

(def sq1-intro2
  (concat
     [{:envelope surf-guitar-env1 :duty 0}]
     [[24 64] [15 160] [4 76] [3 79] [24 76] [14 160]
      [12 74] [24 71] [12 160] [12 74]
      [6 71] [4 74] [1 160] [3 71] [1 160] [2 74] [1 160]
      [2 71] [1 160] [3 74] [12 71] [12 67]
      [24 64] [12 160] [4 79] [4 81] [4 79] [24 76] [12 160] [12 74]
      [24 69] [24 160] [6 81] [6 82] [2 81] [1 160] [2 82] [1 160]
      [2 81] [1 160] [3 82] [24 81]]))

(def sq1-verse1
  (concat
     [{:envelope trem-env :duty 0}
      [10 55] [2 160] [12 55] [12 160] [12 55] [12 160] [24 55] [12 160]
      [10 52] [2 160] [12 52] [12 160] [12 55] [12 160] [12 52] [24 160]
      [10 57] [2 160] [12 57] [12 160] [12 57] [12 160] [10 57] [2 160]
      [10 57] [2 160] [12 57] [10 52] [2 160] [12 52] [12 160] [12 55]]
     {:volume 5} (slide 55 43 12) [[36 160]]))

(def sq1-verse2
  (concat
    [{:envelope trem-env :duty 0}
      [10 57] [2 160] [12 57] [12 160] [12 60] [12 160] [12 60] [12 57] [12 160]
      [10 60] [2 160] [12 60] [12 160] [12 64] [12 160] [12 64] [12 60] [12 160]
      [10 64] [2 160] [12 64] [12 160] [12 64] [10 67] [2 160] [12 67] [24 64]]
     [{:volume 5}] (slide 67 69 12) [{:envelope trem-env} [12 69]]
     [{:volume 5}] (slide 67 69 6) [{:envelope trem-env} [6 69] [2 160] [10 69]]
     [{:volume 5}] (slide 67 69 6) [{:envelope trem-env} [6 69] [2 160] [10 69]]
     [{:volume 5}] (slide 67 69 12) [{:envelope trem-env} [12 69]]))

(def sq2-verse1
  (concat
    [{:envelope trem-env :duty 0}
      [10 52] [2 160] [12 52] [12 160] [12 55] [12 160] [12 55] [12 52] [12 160]
      [10 52] [2 160] [12 52] [12 160] [12 55] [12 160] [12 55] [12 52] [12 160]
      [10 55] [2 160] [12 55] [12 160] [12 55] [10 55] [2 160] [12 55] [24 55]]
     [{:volume 5}] (slide 74 76 12) [{:envelope trem-env} [12 76]]
     [{:volume 5}] (slide 74 76 6) [{:envelope trem-env} [6 76] [2 160] [10 76]]
     [{:volume 5}] (slide 74 76 6) [{:envelope trem-env} [6 76] [2 160] [10 76]]
     [{:volume 5}] (slide 74 76 12) [{:envelope trem-env} [12 76]]))

(def sq1-intro
  (concat
     (loop1 8 (concat
     [{:volume 5} [1 76] [1 79]
      {:envelope surf-guitar-env1 :duty 0}]
     [[8 81] [2 160] [3 81] [3 160] [3 81] [3 160] [3 81] [10 160]
      [1 81] [23 160] [1 81] [11 160] [1 81] [11 160] [1 81] [10 160]]))
     sq1-intro-end))

(def sq2-intro
  (concat
     (loop1 8 (concat
     [{:volume 5} [1 71] [1 74]
      {:envelope surf-guitar-env1 :duty 0}]
     [[8 76] [2 160] [3 76] [3 160] [3 76] [3 160] [3 76] [10 160]
      [1 76] [23 160] [1 76] [11 160] [1 76] [11 160] [1 76] [10 160]]))
     sq2-intro-end))

(def p1-intro
  (concat [[384 160]]
   (loop1 4
   (concat
     [{:envelope surf-guitar-env2 :duty 0}]
     [[12 72] [6 72] [6 72] [6 72] [66 160]]))
     p1-intro-end))

(def p2-intro
  (loop1 8
   (concat
     [{:volume 3} [2 160] [1 76] [1 79]
      {:envelope echo-env :duty 0}]
     [[8 81] [2 160] [3 81] [3 160] [3 81] [3 160] [3 81] [10 160]
      [1 81] [23 160] [1 81] [11 160] [1 81] [11 160] [1 81] [8 160]])))

(def dpcm1
  [{:sample "ld-kick" :length 4} {:rest 32}
   {:sample "ld-kick" :length 4} {:rest 20}
   {:sample "ld-kick" :length 4} {:rest 32}])

(def dpcm2
  [{:sample "ld-kick" :length 4} {:rest 44}
   {:sample "ld-kick" :length 4} {:rest 8}
   {:sample "ld-kick" :length 4} {:rest 32}])

(def saw-chorus1
  (concat
     [{:envelope saw-env}
      [24 43] [11 50] [4 160] [4 50] [1 160] [4 50] [12 43] [12 50]]
     {:volume 15} (slide 43 45 24)
     [{:envelope saw-env}
      [24 40] [11 47] [1 160] [4 47] [2 160] [4 47] [2 160]
      [12 40] [12 47] [12 160] [12 47]]))

(def saw-chorus2
  (concat
     [{:envelope saw-env}
      [24 43] [11 50] [4 160] [4 50] [1 160] [4 50] [12 43] [12 50]]
     {:volume 15} (slide 43 45 24)
     [{:envelope saw-env}
      [24 45] [12 43] [12 40] [12 38] [12 36] [24 33]]))

(def tri-chorus1
  (concat
    (k2 [24 55]) (s [2 69]) (r 10) (k2 [12 62]) (r 12)
    (k2 [12 55]) (s [2 69]) (k2 [22 57])
    (k2 [24 52]) (s [2 69]) (r 10) (k2 [12 59]) (r 12)
    (k2 [12 52]) (s [2 69]) (r 10) (k2 [12 59])))

(def tri-chorus2
  (concat
    (k2 [24 55]) (s [2 69]) (r 10) (k2 [12 62])
    (r 12) (k2 [12 55]) (s [2 69]) (k2 [22 57])
    (k2 [24 52]) (s [2 69]) (r 10) (k2 [12 50])
    (r 12) (k2 [12 48]) (s [2 69]) (k2 [22 45])))

(def sq1-chorus-a
  (concat
    [{:envelope surf-guitar-env1 :duty 0}]
     (r 24) [[12 67] [24 67] [12 67]]
     [{:volume 5}] (slide 67 69 24)
     [{:envelope surf-guitar-env1}
      [12 64] [24 64] [24 62] [12 60] {:volume 5}]
     (vib-all [{:length 24 :pitch 60}] 0.7 0.2)))

(def sq1-chorus-b
  (concat
    [{:envelope surf-guitar-env1}
      [11 67] [2 160] [22 67] [23 67] [2 160] [11 67]]
     [{:volume 5}] (slide 67 69 24)
     [{:envelope surf-guitar-env1}
      [11 64] [2 160] [24 64] [24 69]]
     [{:volume 5}] (slide 69 57 36)))

(def sq1-chorus-c
  (concat
    [{:envelope surf-guitar-env1}
      [11 67] [2 160] [23 67] [23 67] [2 160] [11 67]]
     [{:volume 5}] (slide 67 69 24)
     (slide 59 60 12) [[6 60] [6 160]]
    (slide 59 60 12) [[6 60] [6 160]]
    (slide 59 60 12) [[6 60] [6 160]]
    (slide 59 60 12) [[6 60] [6 160]]))

(def sq2-chorus-a
  (concat
    [{:envelope surf-guitar-env1 :duty 0}]
     (r 24) [[12 74] [24 74] [12 74]]
     [{:volume 4}] (slide 74 76 24)
     (slide 69 71 24)
     (vib-all [{:length 12 :pitch 71}] 0.7 0.2)
     (slide 69 71 12)
     (vib-all [{:length 12 :pitch 71}] 0.7 0.2)
     (slide 69 71 12)
     (vib-all [{:length 24 :pitch 71}] 0.7 0.2)))

(def sq2-chorus-b
  (concat
    [{:envelope surf-guitar-env1 :duty 0}]
     (r 24) [[12 74] [24 74] [12 74]]
     [{:volume 4}] (slide 74 76 24)
     (slide 67 69 12) [[6 69] [6 160]]
     (slide 67 69 12) [[6 69] [6 160]]
     (slide 67 69 12) [[6 69] [6 160]]
     (slide 67 69 12) [[6 69] [6 160]]))

(def sq2-intro2
  (concat (loop1 3 (r 12))
     [{:envelope surf-guitar-env1 :duty 0}]
     [[12 76] [24 71] [12 160] [12 71]] (loop1 3 (r 12)) 
     [[12 71] [6 160] [6 71] [6 160] [6 71] [12 67] [12 71]]
     (loop1 3 (r 12))
     [{:envelope surf-guitar-env1 :duty 0}]
     [[12 76] [24 71] [12 160] [12 71]] (loop1 4 (r 12)) 
     [[12 76] [6 160] [4 76] [2 160] {:volume 4}] 
     (vib-all [{:length 24 :pitch 76}] 0.7 0.2)))

(def saw-fill1
  [[16 45] [2 160] [4 45] [2 160] [6 45] [6 46] [12 47]
   [12 50] [12 52] [12 55] [12 56]])

(def saw-fill1a
  [[18 160] [4 45] [2 160] [6 45] [6 46] [12 47]
   [12 50] [12 52] [12 55] [12 56]])

(def saw-fill1b
  [[18 160] [4 52] [2 160] [6 52] [6 57] [12 59]
   [12 62] [12 59] [12 62] [12 63]])

(def saw-outro
  [[12 52] [9 160] [3 47] [24 52] [24 59] [16 160] [3 50] [1 160] [3 50] [1 160]
   [3 50] [1 160] [6 52] [14 50] [18 47] [6 160] [24 54] [12 47] [12 54]
   [12 160] [12 55] [12 48] [12 160] [24 55] [12 55] [12 55]
   [16 160] [3 55] [1 160] [4 55] [12 62] [12 55]
   [16 160] [3 54] [1 160] [4 54] [12 61] [12 54]])

(def kick-outro1
  [{:sample "kick" :length 7} {:rest 17}
   {:sample "kick" :length 7} {:rest 65}])

(def kick-outro2
  [{:sample "kick" :length 7} {:rest 17}
   {:sample "kick" :length 7} {:rest 29}
   {:sample "kick" :length 7} {:rest 29}])

(def kick-outro3
  [{:sample "kick" :length 7} {:rest 5}
   {:sample "kick" :length 7} {:rest 29}
   {:sample "kick" :length 7} {:rest 5}
   {:sample "kick" :length 7} {:rest 17}
   {:sample "kick" :length 6}
   {:sample "kick" :length 6}])

(def kick-outro4
  [{:sample "kick" :length 7} {:rest 5}
   {:sample "kick" :length 7} {:rest 41}
   {:sample "kick" :length 7} {:rest 5}
   {:sample "kick" :length 7} {:rest 5}
   {:sample "kick" :length 7} {:rest 5}
   {:sample "kick" :length 7}])

(def noise-outro1
  (concat
     (kick 18) (hat 6) (kick 12) (hat 12) (snare 22) (hat 12) (hat 8) (hat 6)))

(def noise-outro2
  (concat
     (kick 12) (kick 12) (snare 24) (kick 12) (kick 12) (snare 24)))

(def noise-outro
  (concat
    noise-outro1 noise-outro1 noise-outro1 noise-outro2))

(def kick-outro
  (concat (loop1 3
     (concat kick-outro1 kick-outro2 kick-outro1 kick-outro3))
     (loop1 3 kick-outro2) kick-outro4))

(def tri-outro
  (concat
     (loop1 2
       (concat
         (k2 [24 45]) (r 72) (k2 [24 52]) (r 72)))
     (loop1 4 (concat
     (k2 [12 52]) (r 12) (k2 [24 52]) (s [4 71]) (r 44)
     (k2 [12 47]) (r 12) (k2 [24 47]) (s [4 71]) (r 44)
     (k2 [12 48]) (r 12) (k2 [24 48]) (s [4 71]) (r 44)
     (k2 [10 55]) (r 2) (k2 [10 55]) (r 2) (s [4 71]) (r 20)
     (k2 [10 54]) (r 2) (k2 [10 54]) (r 2) (s [4 71]) (r 20)))
     (k2 [12 52]))))

(def sq1-outro
  (loop1 4
   (concat
    [{:envelope trem-env2 :duty 0}]
      [[84 76] [12 74] [12 76] [12 74] [72 71] [84 72]]
     [{:volume 6}] (slide 72 60 12) (r 96))))

(def sq2-outro1
  (concat
    [{:envelope trem-env2 :duty 0}
      [96 59] {:volume 4}] (slide 59 54 36)
     [{:envelope trem-env} [60 54] [96 55]]))

(def sq2-outro
  (concat
     (loop1 4 [{:length 96 :volume 0 :pitch 0}])
   (loop1 2
   (concat
    sq2-outro1 (r 96) sq2-outro1 (r 48)
     [{:envelope trem-env} [12 55] [12 57] [12 59] [12 60]])) [[12 59]]))

(def p1-outro1
  (concat
    [{:volume 4 :duty 3}] (slide 56 59 12)
     (vib-all [{:length 36 :pitch 59}] 0.7 0.3)
     (slide 56 59 12) (vib-all [{:length 36 :pitch 59}] 0.7 0.3)
     (slide 52 54 12) (vib-all [{:length 36 :pitch 54}] 0.7 0.3)
     (slide 52 54 12) (vib-all [{:length 36 :pitch 54}] 0.7 0.3)
     (slide 54 55 12) (vib-all [{:length 36 :pitch 55}] 0.7 0.3)
     (slide 54 55 12) (vib-all [{:length 36 :pitch 55}] 0.7 0.3)))

(def p1-outro
  (concat p1-outro1 (r 96) p1-outro1 (r 48) [[12 59] [12 60] [12 59] [12 60]]
     p1-outro1 (r 96) p1-outro1
     [[12 62] [12 67] [12 74] [12 79]
      [12 61] [12 66] [12 73] [12 78] [12 64]]))

(def p2-outro
  (concat
     (loop1 8 [{:length 96 :volume 0 :pitch 0}])
     [{:volume 3 :duty 3}] (slide 76 78 24)
      (vib-all [{:length 72 :pitch 78}] 0.7 0.3)
     (slide 78 73 18) (vib-all [{:length 78 :pitch 73}] 0.7 0.3)
     (slide 73 74 24) (vib-all [{:length 60 :pitch 74}] 0.7 0.3)
     (slide 74 62 12) (r 18) (slide 74 62 10) (r 10)
     (slide 74 62 10) (r 10) (slide 74 62 10) (r 10)
     (slide 74 62 10) (r 10)
     (slide 76 78 24)
      (vib-all [{:length 72 :pitch 78}] 0.7 0.3)
     (slide 78 73 18) (vib-all [{:length 78 :pitch 73}] 0.7 0.3)
     (slide 73 74 24) (vib-all [{:length 60 :pitch 74}] 0.7 0.3)
     (slide 74 62 12)
     [[10 43] [2 160] [10 43] [2 160] [10 43] [2 160] [10 43] [2 160]
      [10 42] [2 160] [10 42] [2 160] [10 42] [2 160] [10 42] [2 160] [12 40]]))

(play
  {:square1
   (concat sq1-intro (r 126) (loop1 2 sq1-intro2)
     (r 96) (loop1 16 (r 24)) sq1-verse1 sq1-verse2
     sq1-chorus-a sq1-chorus-b
     sq1-chorus-a sq1-chorus-c
     sq1-verse1 sq1-verse2
     (loop1 3 (concat sq1-chorus-a sq1-chorus-b))
     sq1-chorus-a sq1-chorus-c
     sq1-intro (r 126) (loop1 2 sq1-intro2)
     (loop1 4 [{:length 96 :volume 0 :pitch 0}]) sq1-outro)
   :square2
   (concat sq2-intro (r 126) sq2-intro2 sq2-intro2
     (r 96) (loop1 32 (r 24)) sq2-verse1
     (loop1 3 sq2-chorus-a) sq2-chorus-b
     (loop1 16 (r 24)) sq2-verse1
     (loop1 7 sq2-chorus-a) sq2-chorus-b
     sq2-intro (r 126) sq2-intro2 sq2-intro2 sq2-outro)
   :p1 (concat p1-intro (loop1 54 (r 96)) (r 48) p1-intro
         (loop1 9 (r 96)) (r 48)
         (loop1 4 [{:length 96 :volume 0 :pitch 0}]) p1-outro)
   :p2 (concat p2-intro (loop1 56 (r 96)) p2-intro
         (loop1 11 (r 96))
         (loop1 4 [{:length 96 :volume 0 :pitch 0}]) p2-outro)
   :noise
   (concat (loop1 9 drums1)
     [{:length 192 :pitch 0 :volume 0}]
     (loop1 8 drums2)
     [{:length 96 :pitch 0 :volume 0}]
     (loop1 53 drums1)
     [{:length 192 :pitch 0 :volume 0}]
     (loop1 8 drums2)
     (loop1 4 [{:length 96 :volume 0 :pitch 0}])
     (loop1 4 noise-outro) (kick 12))
   :triangle
   (concat tri1 tri2 (r 180) (loop1 8 tri3)
     (r 96) (loop1 5 tri4) tri-pre-chorus
     (loop1 3 tri-chorus1) tri-chorus2
     (loop1 3 tri4) tri-pre-chorus
     (loop1 7 tri-chorus1) tri-chorus2
     tri1 tri2 (r 180) (loop1 8 tri3) tri-outro)
   :saw (concat saw1 saw2 saw3 saw3a
     saw-fill1
          (loop1 12 (r 96))
          (loop1 3 saw-chorus1) saw-chorus2
          (loop1 8 (r 96))
          (loop1 7 saw-chorus1) saw-chorus2
          saw1 saw2 saw3 saw3a
      [{:envelope saw-env}]
     (loop1 2 (concat saw-fill1a saw-fill1b))
          (loop1 4 saw-outro) [[12 52]])
   :dpcm
   (concat (loop1 9 dpcm1) [{:rest 192}]
     (loop1 8 dpcm2) [{:rest 96}]
     (loop1 53 dpcm1)
     [{:rest 192}]
     (loop1 8 dpcm2)
     (loop1 4 [{:rest 96}]) kick-outro)})
