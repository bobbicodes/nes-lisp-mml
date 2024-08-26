(defn release [l p]
  (let [env [4 4 4 3 3 3 3 3 3 3 3 3 3 3 3 3 3 2 2 2 2 2 2 1]]
    (if (< 25 l)
      [{:volume 4 :length (- l 24) :pitch p}
       {:envelope env} [24 p]]
      [{:envelope (drop (- 24 l) env)} [l p]])))

(defn noise-sweep [length]
  (take length
  [{:volume 1 :pitch 13 :length 1}
   {:volume 1 :pitch 10 :length 1}
   {:volume 1 :pitch 7 :length 1}
   {:volume 2 :pitch 4 :length 1}
   {:volume 2 :pitch 1 :length 1}
   {:volume 2 :pitch 0 :length 1}
   {:volume 0 :pitch 0 :length (- length 6)}]))

(def drum-loop
  (concat (noise-sweep 34) (noise-sweep 6)
      (noise-sweep 20) (noise-sweep 20)))

(defn k
  "Kick wrapper. Precedes note with fixed arpeggio,
   subtracting length as needed. Takes and returns
   sequences of length-pitch pairs."
  [[l p]]
  (let [arp (vec (take l [[1 62] [1 58] [1 54] [1 52]]))]
    (if (< 4 l) (conj arp [(- l 4) p]) arp)))

(defn s
  "Snare arpeggio wrapper."
  [[l p]]
  (let [arp (vec (take l [[1 70] [1 67] [1 64] [1 54]]))]
    (if (< 4 l) (conj arp [(- l 4) p]) arp)))

(def tri1 [[180 60] [60 160] [160 58] [80 60]])
(def tri1a [[158 60] [2 160] [30 60] [10 62] [20 63] [20 67] [120 58] [10 53] [10 55] [20 58] [80 60]])


(def tri2a
  (concat
    [[80 60] [80 58]] (slide 58 46 80)
    [[80 46] [80 48]] (slide 53 55 10)
    [[30 55] [40 51] [80 48]] (slide 51 53 10)
    [[30 53] [40 50] [80 46]] (slide 48 50 10)
    [[20 50] [10 48] [20 46] [20 50] [80 48]]
    (k [30 48]) (k [5 48]) (k [5 48]) (s [20 43]) [[20 43]]
    [[20 39]] (k [20 39]) (s [40 41])))

(def tri2b
  (concat
    [[80 48] [80 46]
     [40 50] [40 48] [40 46] [40 50] [145 48] [15 160]
     [40 60] [40 55] [40 58] [40 53] [80 48] [80 46]
     [40 50] [40 48] [40 46] [40 50] [145 48] [95 160]]))

(def sq2a
  (concat [{:volume 4 :duty 1}]
    [[10 55] [10 60] {:duty 0} [10 60]
     {:duty 1} [9 60] [1 160] {:duty 0} [9 60] [1 160]
     {:duty 1} [9 63] [1 160] {:duty 0} [9 63] [1 160]
     {:duty 1} [10 63] [10 60] [10 62] {:duty 0} [9 62] [1 160] 
     {:duty 1} [10 62]] (slide 58 60 10) [{:vibrato 2}] [[10 60]]
    (release 80 58)
    [{:volume 4 :duty 0}]
    [[80 160] [20 160] [10 63] {:duty 1} [10 63]
     {:duty 0} [10 63] {:duty 1} [10 63]]
    (slide 63 65 10) [[10 65]]
    (release 60 60)
    [[40 160]] [{:vibrato 1}]))

(def sq2b
  (concat [{:volume 4 :duty 1}]
    [[10 55] [10 60] {:duty 0} [10 60] 
     {:duty 1} [9 60] [1 160] {:duty 0} [10 60]
     {:duty 1} [9 63] [1 160] {:duty 0} [9 63] [1 160]
     {:duty 1} [10 63] [10 60] [10 62] {:duty 0} [10 62]
     {:duty 1} [10 62]] (slide 58 60 10) [{:vibrato 2}] [[10 60]]
    (release 80 58)
    [{:volume 4 :duty 0}]
    [[20 160] [10 63] {:duty 1} [9 63] [1 160] 
     {:duty 0} [9 63] [1 160]  {:duty 1} [10 63]]
    (slide 63 65 10) [[10 65]]
    (release 20 60) [{:vibrato 1}]))

(def tri3
  (concat
    (k [10 60]) (r 10) [[7 72] [6 67] [7 72]]
    (s [10 63]) (r 10) [[7 75] [6 70] [7 75]]
    (k [10 58]) (r 10) (k [7 65]) [[6 70] [7 65]]
    (s [20 53]) [[20 58]]
    (k [10 58]) (r 10) [[7 70] [6 65] [7 70]]
    (s [10 55]) [[10 67] [10 55] [10 67]]
    (k [20 63]) (k [7 75]) [[6 63] [7 75]] (s [20 65]) [[20 60]]))

(def tri4
  (concat
    (k [20 63]) [[7 70] [6 67] [7 70]]
    (s [20 67]) [[7 70] [6 67] [7 70]]
    (k [20 60]) (k [7 67]) [[6 63] [7 67]]
    (s [20 55]) [[20 67]]
    (k [20 60]) [[7 72] [6 67] [7 72]]
    (s [20 63]) [[20 65]]
    (k [20 58]) (k [7 70]) [[6 65] [7 70]]
    (s [20 62]) [[7 65] [6 62] [7 65]]
    (k [20 58]) [[20 70]]
    (s [10 58]) [[10 65] [10 62] [10 70]]
    (k [20 60]) (k [7 72]) [[6 67] [7 72]]
    (s [20 63]) [[20 65]]))

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

(def drums1
  (loop1 10 (concat (kick 20) (hat 7) (hat2 6) (hat 7)
    (snare 20) (hat 7) (hat2 6) (hat 7)
    (kick 20) (kick 20)
    (snare 20) (hat 7) (hat2 6) (hat 7))))

(def sq1
  (concat [{:volume 3 :duty 0 :pitch 160 :length 120}]
    [[10 63] [10 62] [10 63] [8 65] [2 160]]
    (slide 65 67 16) [[4 160]]
    (vib [{:length 60 :pitch 63}
          {:length 20 :pitch 63}] 0.7 0.15)
    [[120 160] [10 58] [10 60] [10 62] [10 58]]
    [{:volume 4 :duty 1}]
    (vib (length-pitch [[60 60] [20 60]]) 0.7 0.3)
    [[20 160]]))

(def sq2
  (concat [{:volume 4 :duty 1}]
    (slide 65 67 10) [[11 67] [1 160]]
    (slide 66.5 67 8) [[1 160]]
    (slide 67 66.5 9) (slide 65 67 10)
    [[10 65] [20 63]] 
    (vib [{:length 38 :pitch 60}] 0.7 0.15)
    [[2 160] [10 60] [10 58] [10 60] [8 62] [2 160]]
    (slide 62 63 16) [[4 160]]
    (vib [{:length 60 :pitch 60}
          {:length 20 :pitch 60}] 0.7 0.15)
    [{:volume 2}]
    (vib (length-pitch
           [[40 77] [40 74] [40 70]
            [40 65] [80 67]]) 0.7 0.5)
    [[40 160]]))

(def drums
  (concat (loop1 25 drum-loop)
     (hat 20) (kick 20) (snare 20) (hat 7) (hat2 6) (hat 7)
    drums1))

(def sq2-echo
  (concat [{:volume 2 :duty 1}]
    [[6 160] [10 55] [10 60] {:duty 0} [10 60] 
     {:duty 1} [9 60] [1 160] {:duty 0} [10 60]
     {:duty 1} [9 63] [1 160] {:duty 0} [9 63] [1 160]
     {:duty 1} [10 63] [10 60] [10 62] {:duty 0} [10 62]
     {:duty 1} [10 62]] (slide 58 60 10) [[10 60]]
    (release 80 58)
    [{:volume 4 :duty 0}]
    [[20 160] [10 63] {:duty 1} [9 63] [1 160] 
     {:duty 0} [9 63] [1 160]  {:duty 1} [10 63]]
    (slide 63 65 10) [[10 65]]
    (release 14 60)))

(play
  {:square1
   (concat
   (loop1 2
     (concat sq1 sq1
       (loop2 14 (r 80))
       sq2-echo sq2-echo sq2 sq2))
     (loop1 3 
   (concat [{:volume 4 :duty 0 :pitch 160 :length 80}]
    [[80 160] [40 160] [10 58] [10 60] [10 62] [10 58]]))
     [[20 60]])
   :square2
   (concat
   (loop1 2 (concat sq2 sq2 (r 80) sq2a sq2a (r 80) sq2b sq2b sq1 sq1)))
   :triangle
   (concat
   (loop1 2 (concat tri1 tri1a (slide 60 48 80)
    tri2a tri3 tri3 tri4 tri4)))
   :noise drums})

(play
  {:square1
   (concat
   (loop1 2
     (concat sq1 sq1
       (loop2 14 (r 80))
       sq2-echo sq2-echo sq2 sq2))
     (loop1 3 
   (concat [{:volume 4 :duty 0 :pitch 160 :length 80}]
    [[80 160] [40 160] [10 58] [10 60] [10 62] [10 58]]))
     [[20 60]])
   :square2
   (concat
   (loop1 2 (concat sq2 sq2 (r 80) sq2a sq2a (r 80) sq2b sq2b sq1 sq1))
     (loop1 3 
   (concat [{:volume 4 :duty 1}]
    (slide 65 67 10) [[11 67] [1 160]]
    (slide 66.5 67 8) [[1 160]]
    (slide 67 66.5 9) (slide 65 67 10)
    [[10 65] [20 63]] 
    (vib [{:length 38 :pitch 60}] 0.7 0.15)
    [[2 160] [10 60] [10 58] [10 60] [8 62] [2 160]]
    (slide 62 63 16) [[4 160]]
    (vib [{:length 60 :pitch 60}] 0.7 0.15))))
   :triangle
   (concat
   (loop1 2 (concat tri1 tri1a (slide 60 48 80)
    tri2a tri3 tri3 tri4 tri4))
     (loop1 2
       [[40 60] [40 60] [40 60] [40 60] [40 60] [40 160]])
     [[40 60] [40 60] [40 60] [40 60] [40 60]
      [10 58] [10 60] [10 62] [10 58] [20 60]])
   :noise (concat drums drums
            (loop1 3 (concat (kick 20) (hat 7) (hat2 6) (hat 7)
      (snare 20) (hat 7) (hat2 6) (hat 7)
      (kick 20) (kick 20)
      (snare 20) (hat 7) (hat2 6) (hat 7)
                (kick 20) (kick 20)
      (snare 20) (hat 7) (hat2 6) (hat 7)))
     (kick 20))})
