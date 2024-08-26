(defn crash
  ([length attenuation]
   (let [vol [15 15 15 15 15 15 14 14 13 12 12 11 11
             10 9 9 9 8 8 7 7 6 6 5 5 5 4 4 4 4 3 3 3 3 2 2 2 2 1]
         vol (map (fn [volume] (max 1 (- volume attenuation))) vol)]
   [{:envelope vol :length 1 :pitch 8} {:pitch 2}
    {:length (- length 2) :pitch 3}]))
  ([length]
   (let [vol [15 15 15 15 15 15 14 14 13 12 12 11 11
             10 9 9 9 8 8 7 7 6 6 5 5 5 4 4 4 4 3 3 3 3 2 2 2 2 1]]
     [{:envelope vol :length 1 :pitch 8} {:pitch 2}
    {:length (- length 2) :pitch 3}])))

(defn k
  "Kick wrapper. Precedes note with fixed arpeggio,
   subtracting length as needed. Takes and returns
   sequences of length-pitch pairs."
  [[l p]]
  (let [arp (vec (take l [[1 62] [1 58] [1 54] [1 52]]))]
    (if (< 4 l) (conj arp [(- l 4) p]) arp)))

(defn t
  "Tom wrapper. Precedes note with relative arpeggio,
   subtracting length as needed. Takes and returns
   sequences of length-pitch pairs."
  [[l p]]
  (let [arp (vec (take l [[1 (+ p 12)] [1 (+ p 10)] [1 (+ p 8)]]))]
    (if (< 3 l) (conj arp [(- l 3) p]) arp)))

(defn s
  "Snare arpeggio wrapper."
  [[l p]]
  (let [arp (vec (take l [[1 72] [1 69] [1 66] [1 63]]))]
    (if (< 4 l) (conj arp [(- l 4) p]) arp)))

(def tri1
  (concat (k [16 52])
    [[8 160]] (s [16 55]) [[8 160] [16 52] [8 160]] (s [16 55]) [[8 160]]))

(def tri2
  (concat tri1 (k [16 57])
    [[8 160]] (s [16 57]) [[8 160] [10 55] [2 160] [10 54] [2 160]] (s [16 52]) [[8 160]]))

(def tri3
  (concat tri1 (k [16 52])
    [[8 160]] (s [16 52]) [[8 160] [24 50]] (s [24 160])))

(def tri4
  (concat tri1 (k [16 64])
    [[8 160] [13 64]] (t [3 57]) [[2 160]] (t [3 55]) [[3 160]] (t [3 53]) [[21 52]] (s [24 160])))

(defn drum
  "Takes a decay length and a volume-pitch sequence."
  [length vol-pitch]
  (let [frame1 {:length 1 :volume (ffirst vol-pitch)
                :pitch (last (first vol-pitch))}
        midframes (for [[volume pitch] (rest vol-pitch)]
                    {:volume volume :pitch pitch})
        tail {:length (- length (count vol-pitch))
              :volume 0 :pitch 0}]
    (if (<= length (count vol-pitch))
      (concat [frame1] midframes)
      (concat [frame1] midframes [tail]))))

(defn kick [length]
  (drum length [[12 6] [9 2] [5 1] [4 1] [2 0]]))

(defn snare [length]
  (drum length [[13 8] [11 6] [10 6] [9 6]
                [6 5] [5 5] [4 5] [2 5]]))

(defn hat [length]
  (drum length [[4 3] [3 2] [2 0] [1 0]]))

(defn hat2 [length]
 (drum length [[3 3] [2 2] [1 0] [1 0]]))

(def drums1
  (concat (crash 24 5) (snare 12) (hat 24) (hat 12) (snare 12) (hat 12)
    (crash 24 5) (snare 12) (hat 12) (hat2 12) (hat 12) (snare 12) (hat 12)))

(def drums2
  (concat (crash 24 5) (snare 12) (hat 24) (hat 12) (snare 12) (hat 12)
    (crash 24 5) (snare 13) (hat2 5) (hat2 6) (snare 12) (kick 12) (snare 12) (hat 12)))

(def drums3
  (concat (crash 24 5) (snare 12) (hat 24) (hat 12) (snare 12) (hat 12)))

(def drums4
  (concat (crash 24 5) (snare 12) (hat 12) (kick 12) (kick 12) (snare 12) (hat 12)))

(def drums5
  (concat (crash 24 5) (snare 13) (hat2 5) (hat2 6) (snare 12)
    (kick 12) (snare 12) (hat 12)))

(defn arp [pitches]
  (concat [{:envelope [9 9 4 4]}]
  (apply concat
    (for [pitch pitches]
      [{:pitch pitch :length 4}
       {:pitch 160 :length 8}]))))

(defn arp2 [pitches]
  (concat [{:volume 5}]
  (apply concat
    (for [pitch pitches]
      [{:pitch pitch :length 2}
       {:pitch 160 :length 10}]))))

(defn detune [notes]
  (map (fn [note] (if (:pitch note)
           (update note :pitch #(- % 0.1)) note)) notes))

(defn fifth [[l p]]
  [l (+ p 7)])

(def a [59 64 67 64 71 69 67 69])
(def b [64 69 72 69 67 66 64 160])
(def c [64 67 66 64 62 66 69 66])
(def d [64 67 71 76 79 160 160 160])

(def tri5
  (concat
   (k [12 50]) [[12 160]] (s [12 50]) [[12 160] [12 52]] (k [12 52]) (s [12 160]) [[12 52]]))

(def tri6
  (concat
   (k [16 50]) [[8 160]] (s [16 50]) [[8 160] [12 52]] (k [4 52]) [[8 160]] (s [16 55]) [[8 160]]))

(def tri7
  (concat
   (k [24 57]) (s [24 57]) (k [12 50]) (k [12 50]) (s [6 50]) [[18 160]]))

(def tri8
  (concat (k [24 64]) (s [13 64]) (t [3 57]) [[2 64]] (t [3 55]) [[1 64]] (t [3 53])
    [[9 52]] (t [3 51]) [[9 52]] (s [6 52]) [[2 52] [6 160]] (t [3 49]) [[9 160]]))

(def arps
  (concat (arp a) (arp b) (arp a) (arp c)
    (arp a) (arp b) (arp a) (arp d)))

(def arps2
  (concat (arp2 a) (arp2 b) (arp2 a) (arp2 c)
    (arp2 a) (arp2 b) (arp2 a) (arp2 d)))

(def sq1a
  [[24 160] [12 71] [12 64] [12 160] [12 64] [24 71]])

(def sq1b
  [[24 160] [12 71] [12 64] [12 66] [12 64] [12 62] [12 66]])

(def sq1c
  [[24 160] [12 71] [12 64] [12 67] [12 71] [12 76] [12 79]])

(def sq2a
  [[15 160] [12 79] [12 71] [12 160] [12 71] [24 79]])

(def sq2b
  [[24 160] [12 79] [12 71] [12 73] [12 71] [12 69] [12 73]])

(def sq2c
  [[24 160] [12 79] [12 71] [12 74] [12 78] [12 83] [12 86]])

(defn lead [pitch]
  [{:envelope [11 6 4 3 2]}
   {:pitch (+ pitch 7) :length 2 :duty 0}
   {:pitch pitch :length 5}])

(defn echo [pitch]
  [{:envelope [3 2 1]}
   {:pitch (+ pitch 7) :length 2 :duty 0}
   {:pitch pitch :length 3}])

(defn lead2 [pitch]
  [{:envelope [9 8 7 6 5]}
   {:volume 9 :pitch pitch :length 7 :duty 0}])

(defn echo2 [pitch]
  [{:envelope [2 1]}
   {:pitch pitch :length 5 :duty 0}])

(def arp1 [64 67 71 76 79 76 71 76])
(def arp2 [57 64 69 76 59 66 74 78])
(def arp3 [60 64 67 72 76 72 67 72])
(def arp4 [53 60 65 69 55 62 67 71])

(def arp-seq
  (concat arp1 arp2 arp3 arp4
    arp3 arp4 arp3 arp2))

(def echo-seq
  (cons 59 arp-seq))

(def arp-seq2
  [83 76 83 76 83 76 83 76 83 76 83 76 78 71 78 71 79 72 79 72 79
   72 79 72 69 65 69 65 74 67 74 67 79 72 79 72 79 72 79 72 69 65
   69 65 74 67 74 67 79 72 79 72 79 72 79 72 83 76 83 76 78 71 78 71])

(def echo-seq2
  (cons 76 arp-seq2))

(def tri9
  (concat
     (k [22 64]) [[2 160] [10 64] [2 160] [22 64] [2 160]
     [10 64] [2 160] [10 64] [2 160] [12 64]]
     (k [10 57]) [[2 160]] (k [10 57]) [[2 160] [10 58] [2 160] [10 58] [2 160]]
     (k [12 59]) (k [10 59]) [[2 160] [10 59] [2 160] [12 59]]))

(def tri9b
  (concat
     (k [22 64]) [[2 160]] (s [10 64]) [[2 160] [12 64]] (k [10 64])
     [[2 160] [10 64] [2 160]] (s [10 64]) [[2 160] [12 64]]
     (k [10 57]) [[2 160] [10 57] [2 160]] (s [10 58]) [[2 160] [10 58] [2 160]]
     (k [24 59]) (s [10 59]) [[2 160] [12 59]]))

(def tri10
  (concat
     (k [22 60]) [[2 160] [10 60] [2 160] [22 60] [2 160]
     [10 60] [2 160] [10 60] [2 160] [12 60]]
     (k [10 53]) [[2 160]] (k [10 53]) [[2 160] [10 54] [2 160] [10 54] [2 160]]
     (k [12 55]) (k [10 55]) [[2 160] [10 55] [2 160] [12 55]]))

(def tri10b
  (concat
     (k [22 60]) [[2 160]] (s [10 60]) [[2 160] [12 60]] (k [10 60])
     [[2 160] [10 60] [2 160]] (s [10 60]) [[2 160] [12 60]]
     (k [10 53]) [[2 160] [10 53] [2 160]] (s [10 54]) [[2 160] [10 54] [2 160]]
     (k [24 55]) (s [10 55]) [[2 160] [12 55]]))

(def tri11
  (concat
     (k [22 60]) [[2 160] [10 60] [2 160] [24 60]
     [10 55] [2 160] [10 55] [2 160] [12 55]]
     (k [10 57]) [[2 160]] (k [10 57]) [[2 160] [10 58] [2 160] [10 58] [2 160]]
     (k [12 59]) (k [10 59]) [[2 160] [10 59] [2 160] [12 59]]))

(def tri11b
  (concat
     (k [22 60]) [[2 160]] (s [10 60]) [[2 160] [12 60]] (k [12 60])
     [[2 160] [10 55] [2 160]] (s [10 55]) [[2 160] [12 55]]
     (k [10 57]) [[2 160] [10 57] [2 160]] (s [10 58]) [[2 160] [10 58] [2 160]]
     (k [22 59]) [[2 160]] (s [10 59]) [[2 160] [12 59]]))

(def drums6
  (loop1 4 (concat (kick 96) (kick 12) (kick 36) (kick 12) (kick 36))))

(def drums7
  (loop1 8 (concat (crash 12 3) (hat 12) (snare 12) (hat2 6) (hat2 6)
             (crash 12 6) (hat 12) (snare 12) (hat 12))))

(def dpcm-intro1
  [{:sample "kick" :length 4}
    {:sample "e1-sus" :length 8}
    {:sample "e1-mute" :length 11} {:rest 1}
    {:sample "e1-mute" :length 11} {:rest 1}
    {:sample "e1-mute" :length 11} {:rest 1}
    {:sample "e1-sus" :length 24} {:rest 24}])

(def dpcm-intro2
  [{:sample "kick" :length 4}
    {:sample "e2-sus" :length 8}
    {:sample "e1-mute" :length 11} {:rest 1}
    {:sample "e1-mute" :length 11} {:rest 1}
    {:sample "e1-mute" :length 11} {:rest 1}
    {:sample "e2-sus" :length 24} {:rest 24}])

(def dpcm-intro2a
  [{:sample "kick" :length 4}
    {:sample "e2-sus" :length 20}
    {:sample "snare" :length 12} {:rest 1}
    {:sample "tom4" :length 5}
   {:sample "tom4" :length 6}
   {:sample "tom4" :length 6} {:rest 6}
   {:sample "tom-hi" :length 7} {:rest 5}
   {:sample "tom-mid" :length 7} {:rest 5}
   {:sample "tom-low" :length 10} {:rest 2}])

(def dpcm-verse1
  [{:sample "kick" :length 4}
   {:sample "d1-sus" :length 8} {:rest 12}
   {:sample "snare" :length 4}
   {:sample "d1-sus" :length 8} {:rest 12}
   {:sample "e1-sus" :length 12}
   {:sample "kick" :length 12}
   {:sample "snare" :length 7} {:rest 5}
   {:sample "e1-sus" :length 12}])

(def dpcm-verse2
  [{:sample "kick" :length 4}
   {:sample "d1-sus" :length 8} {:rest 12}
   {:sample "snare" :length 4}
   {:sample "d1-sus" :length 8} {:rest 12}
   {:sample "e1-sus" :length 12}
   {:sample "kick" :length 12}
   {:sample "snare" :length 4}
   {:sample "g1-sus" :length 12} {:rest 8}
   {:sample "kick" :length 4}
   {:sample "a1-sus" :length 20}
   {:sample "snare" :length 4}
   {:sample "a1-sus" :length 20}
   {:sample "kick" :length 4}
   {:sample "d1-sus" :length 8}
   {:sample "kick" :length 12}
   {:sample "snare" :length 8} {:rest 16}])

(def dpcm-verse3
  [{:sample "kick" :length 4}
   {:sample "d1-sus" :length 8} {:rest 12}
   {:sample "snare" :length 4}
   {:sample "d1-sus" :length 8} {:rest 12}
   {:sample "e1-sus" :length 12}
   {:sample "kick" :length 12}
   {:sample "snare" :length 4}
   {:sample "g1-sus" :length 12} {:rest 8}
   {:sample "kick" :length 4}
   {:sample "e2-sus" :length 20}
   {:sample "snare" :length 4}
   {:sample "e2-sus" :length 20}
   {:sample "kick" :length 4}
   {:sample "e1-sus" :length 8}
   {:sample "kick" :length 12}
   {:sample "snare" :length 8} {:rest 16}])

(def dpcm-chorus1
  [{:sample "kick" :length 10} {:rest 86}
   {:sample "kick" :length 10} {:rest 2}
   {:sample "kick" :length 10} {:rest 26}
   {:sample "kick" :length 10} {:rest 2}
   {:sample "kick" :length 10} {:rest 26}])

(def dpcm-chorus2
  [{:sample "kick" :length 10} {:rest 14}
   {:sample "kick-snare" :length 10} {:rest 14}])

(def dpcm-fill1
  [{:sample "kick" :length 10} {:rest 2}
    {:sample "tom-hi" :length 5} {:rest 1}
    {:sample "tom-hi" :length 6}
    {:sample "snare" :length 6}
    {:sample "tom-mid" :length 6}
    {:sample "tom-low" :length 6}
    {:sample "tom-mid" :length 6}])

(def tri12
  [[12 160] [12 64] [12 160] [12 64] [12 160] [12 64] [12 160] [12 64]
    [12 160] [12 57] [12 160] [12 58] [12 160] [12 59] [12 160] [12 59]
    [12 160] [12 60] [12 160] [12 60] [12 160] [12 60] [12 160] [12 60]
    [12 160] [12 53] [12 160] [12 54] [12 160] [12 55] [12 160] [12 55]
    [12 160] [12 60] [12 160] [12 60] [12 160] [12 60] [12 160] [12 60]
    [12 160] [12 53] [12 160] [12 54] [12 160] [12 55] [12 160] [12 55]
    [12 160] [12 60] [12 160] [12 60] [12 160] [12 60] [12 160] [12 55]
    [12 160] [12 57] [12 160] [12 58] [12 160] [12 59] [12 160] [12 59]])

(def tri-solo1
  [[11 64] [1 160] [5 64] [1 160] [5 64] [1 160]
   [11 64] [1 160] [5 64] [1 160] [5 64] [1 160]
   [12 64] [12 71] [12 67] [12 71]])

(def tri-solo2
  [[11 59] [1 160] [5 59] [1 160] [5 59] [1 160]
   [11 59] [1 160] [5 62] [1 160] [5 62] [1 160]
   [12 64] [12 71] [12 67] [12 71]])

(def tri-solo3
  (concat
  [[11 64] [1 160] [5 64] [1 160] [5 64] [1 160]
   [11 64] [1 160] [5 67] [1 160] [5 67] [1 160]
   [12 67] [11 66] [1 160]]
    (slide 66 59 12) [[6 59] [6 160]]))

(def tri-solo4
  [[11 59] [1 160] [5 59] [1 160] [5 59] [1 160]
   [11 59] [1 160] [5 59] [1 160] [5 59] [1 160]
   [12 64] [12 71] [12 67] [12 71]
   [5 59] [1 160] [5 59] [1 160] [5 71] [1 160] [5 71] [1 160]
   [12 64] [12 71] [12 62] [5 69] [1 160] [6 69]
   [12 62] [12 69] [12 64] [5 71] [1 160] [6 71]
   [12 64] [5 71] [1 160] [6 71] [11 59] [1 160]
   [5 66] [1 160] [5 66] [1 160] [11 62] [1 160] [5 66] [1 160] [6 66]
   [12 55] [5 67] [1 160] [5 67] [1 160] [11 57] [1 160] [12 69] [19 52] [29 160]])

(def drums8
  (concat (crash 12 3) (hat 12) (snare 12) (hat2 6) (hat2 6)
       (crash 12 6) (hat 12) (snare 12) (hat 12)
      (crash 12 3) (hat 12) (snare 12) (hat2 6) (hat2 6)
       (crash 12 6) (hat 12) (snare 12) (hat 12)
      (crash 12 3) (hat 12) (snare 12) (hat2 6) (hat2 6)
       (crash 12 6) (hat 12) (snare 12) (hat 12)
       (crash 12 3) (hat 12) (snare 12) (hat2 6) (hat2 6)
       (crash 12 6) (hat 12) (snare 24)))

(def drums9
  (concat (loop1 3
     (concat (crash 12 3) (hat 12) (snare 12) (hat2 6) (hat2 6)
      (crash 12 6) (hat 12) (snare 12) (hat 12)))
    (crash 12 6) (hat 12) (snare 12) (hat 12) (crash 48 3)))

(defn arp-19-lead [l p]
  (concat
    [{:envelope
      [5 2 5 3 5 2 5 3 5 2 5 3 5 2 5 3 5 2 5 3 5 2 5 3]
      :vibrato 2 :duty 1}]
    (cond
      (< 24 l)
      [{:length 2 :pitch p} {:length 2 :pitch (+ p 19)}
       {:length 20 :pitch p} {:length (- l 24) :pitch p}]
       (< 4 l)
      [{:length 2 :pitch p} {:length 2 :pitch (+ p 19)}
       {:length (- l 4) :pitch p}]
      :else
      [{:length l :pitch p}])))

(defn echo-lead [l p]
  (concat
    [{:envelope
      [7 7 4 4 7 7 4 4 7 7 4 4 7 7 4 4 7 7 4 4 7 7 4 4]
      :vibrato 2 :duty 1}]
    (cond
      (< 24 l)
      [{:length 4 :pitch p}
       {:length 20 :pitch p} {:length (- l 24) :pitch p}]
       (< 4 l)
      [{:length 4 :pitch p}
       {:length (- l 4) :pitch p}]
      :else
      [{:length l :pitch p}])))

(def solo1
  [[12 160] [6 67] [6 66] [12 67] [6 67] [6 66]
   [12 67] [36 64] [12 160] [6 67] [6 67]
   [12 67] [12 67] [12 66] [12 66]
   [24 67] [12 62] [6 62] [6 62] [12 67]
   [12 67] [12 67] [6 66] [6 66]
   [12 67] [12 67] [12 64] [6 64]
   [6 64] [11 64] [12 67] [12 67]
   [12 66] [12 66] [12 160] [12 59] [6 59]
   [6 59] [6 59] [6 61]
   [6 62] [6 63] [12 64] [12 64]
   [6 64] [6 62] [6 61]
   [6 60] [6 59] [6 64] [6 64]
   [6 64] [12 64] [12 64] [11 62]
   [13 160] [11 62] [13 160] [12 64] [6 64]
   [6 62] [12 64] [6 64] [6 62]
   [4 62] [4 64] [4 62] [12 59] [12 57] [12 59]
   [6 67] [6 69] [12 160] [6 67] [6 69] [12 160] [12 64]])

(def solo2a
  [[12 64] [6 64] [6 64] [6 64] [6 64]
    [6 64] [6 64] [6 64] [6 62] [12 59] [12 59]
    [6 59] [6 59] [12 60] [6 60] [6 60]
    [12 60] [6 60] [6 59] [6 60] [6 59]
    [12 55] [12 55] [6 55] [6 55]
    [12 59] [6 60] [6 60] [12 60] [6 60]
    [6 59] [6 60] [6 59]
    [12 55] [12 55] [6 55] [6 55]
    [12 59] [6 60] [6 60] [12 60]
    [6 55] [6 55] [6 57] [6 57] [6 58]
    [6 58] [12 59] [14 160]])

(def solo2b
  [[12 59] [6 59] [6 59] [12 59]
    [6 59] [6 59]
    [12 52] [6 52] [6 52] [12 52]
    [6 52] [6 52]
    [12 60] [12 60] [12 59] [12 59]
    [12 52] [6 52] [6 52] [12 52]
    [6 52] [6 52]
    [12 64] [6 64] [6 64] [6 64] [6 64]
    [6 64] [6 64] [6 64] [6 62] [12 59] [12 59]
    [6 59] [6 59] [12 60] [6 60] [6 60]
    [6 60] [6 60] [12 55] [12 59] [36 160]
    [12 53] [12 52] [12 52] [6 52] [6 52]
    [12 52] [12 52] [12 52] [1 160]
    [6 52] [6 52]
    [12 52] [12 52] [12 52]
    [12 52] [12 52] [12 52] [12 52]
    [12 50] [12 52] [84 160]])

(play {})

(play
  {:square1
  (loop2 2
  (concat [{:vibrato 0 :volume 4 :duty 0}] arps
     (concat
    [{:duty 1 :vibrato 2}]
    (loop1 3 sq1a) sq1b
    (loop1 3 sq1a) sq1c
    [{:vibrato 0}]
    (loop1 2 (apply concat
    (interleave
      (map lead arp-seq)
      (map echo echo-seq))))
     (mapcat (fn [[l p]] (arp-19-lead l p)) solo1)
     (slide 64 40 28) [[8 40] [2 160]])
    (loop1 2 solo2a) solo2b))
   :square2
  (loop2 2
  (concat [{:volume 2 :duty 0 :length 8 :pitch 160}]
    (detune arps2)
     (concat
    [{:volume 4 :duty 1 :vibrato 2}]
    (loop1 2 (concat sq2a (r 9))) sq2a sq2b
    (r 9) (loop1 2 (concat sq2a (r 9))) sq2a sq2c
    [{:vibrato 0}]
    (loop1 2 (apply concat
    (interleave
      (map lead2 arp-seq2)
      (map echo2 echo-seq2))))
    (mapcat (fn [[l p]] (echo-lead l p)) solo1)
     (slide 64 40 28) [[8 40] [11 160]])
    [{:volume 3}]
   (loop1 2 (concat (map fifth (drop 2 solo2a)) [[10 160]]))
    (map fifth solo2b) (r 2) {:volume 2}))
   :triangle
   (loop2 2
  (concat tri2 tri3 tri2 tri4
    (concat
    (loop1 2 tri5) tri6 tri7 (loop1 2 tri5) tri6 tri8
    tri9 (loop1 2 tri10) tri11 tri12
    (loop1 2 tri-solo1) tri-solo2 tri-solo3 tri-solo4)
    (loop1 2 solo2a)
     solo2b))
   :noise
   (loop2 2
  (concat (loop1 3 drums1) drums2
    (concat
    (loop1 3 drums3) drums4
    (loop1 3 drums3) drums5
    drums6 drums7 drums8 drums9)
    (loop1 3 drums8)
    (loop1 12 [{:length 24 :pitch 0 :volume 0}])))
   :dpcm
   (loop2 2
   (concat
     (loop1 3 (concat dpcm-intro1 dpcm-intro2))
     dpcm-intro1 dpcm-intro2a
     (concat
     (loop1 2 dpcm-verse1) dpcm-verse2
     (loop1 2 dpcm-verse1) dpcm-verse3
     (loop1 4 dpcm-chorus1)
     (loop1 16 dpcm-chorus2) dpcm-fill1
     (loop1 7 dpcm-chorus2) dpcm-fill1
     (loop1 3 dpcm-chorus2) dpcm-fill1 dpcm-chorus2 dpcm-fill1
     [{:sample "kick" :length 10} {:rest 38}])
     dpcm-fill1 (loop1 7 dpcm-chorus2)
     dpcm-fill1 (loop1 3 dpcm-chorus2)
     dpcm-fill1 (loop1 9 dpcm-chorus2) dpcm-fill1
     [{:sample "kick" :length 10} {:rest 38}]
     (loop1 2 dpcm-chorus2) dpcm-fill1 dpcm-fill1
     [{:sample "kick" :length 10} {:rest 62}]
     [{:sample "tom4" :length 6}
      {:sample "tom4" :length 6}
      {:sample "tom5" :length 6}
      {:sample "tom5" :length 6}]))})
