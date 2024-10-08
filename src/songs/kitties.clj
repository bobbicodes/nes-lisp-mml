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
  (drum length [[14 15] [12 15] [10 15] [8 15] [5 15] [2 15]]))

(defn hat [length]
  (drum length [[7 4]]))

(defn snare [length]
  (drum length [[14 3] [12 3] [10 3] [8 0] [5 0] [2 0]]))

(def tri-kick [{:length 1 :pitch 66} {:pitch 62} {:pitch 59} {:pitch 54}])

(def tri-snare [{:length 1 :pitch 75} {:pitch 70}])

(defn tri1 [pitch]
  (concat [{:vibrato 1}]
    [[28 pitch] [14 160] [9 pitch] 
     [5 160] [28 pitch] [28 160]]))

(defn bass-note [length pitch]
  (vib (length-pitch [[length pitch]]) 0.5 0.15))

(defn tri2 [pitch]
  (concat 
    tri-kick (bass-note 24 pitch) tri-snare [{:length 12 :pitch 160}]
    tri-kick (bass-note 4 pitch) [{:length 6 :pitch 160}]
    tri-kick (bass-note 24 pitch) tri-snare [{:length 26 :pitch 160}]))

(def tri2a
  (concat 
    tri-kick (bass-note 24 60) tri-snare [{:length 12 :pitch 160}]
    tri-kick (bass-note 4 60) 
    [{:length 6 :pitch 160} {:length 1 :pitch 72} {:length 6 :pitch 60}
     {:length 1 :pitch 72} {:length 6 :pitch 60}]
      tri-kick (bass-note 4 60) (bass-note 7 160)
      tri-snare [{:length 12 :pitch 160}] tri-kick [{:length 9 :pitch 160}]))

(defn slide [from to frames]
  (length-pitch (take frames 
    (if (< to from)
      (map #(vector 1 %) (reverse (range to from (/ (abs (- from to)) frames))))
      (map #(vector 1 %) (range from to (/ (abs (- from to)) frames)))))))

(def drums1
  (concat (kick 14) (hat 7) (hat 7) (snare 14) (kick 14)
     (kick 14) (hat 14) (snare 14) (hat 14)))

(def lead1
  [[28 63] [14 160] [7 63]
   [7 160] [14 63] [14 62] [28 60] [28 58] [14 160]
   [14 58] [28 62] [28 63] [28 65] [14 160] [7 65] [7 160]
   [14 65] [14 63] [28 62] [28 60] [14 160] [7 60] [7 160]
   [28 60] [28 62] [28 63] [14 160] [7 63]
   [7 160] [14 63] [14 62] [28 60] [28 58] [14 160] [14 58]
   [28 55] [28 58] [14 60] [14 62] [56 60] [28 160] [12 160]])

(def lead2
  [[14 160] [14 58] [14 63] [14 58] [14 67] [14 63] [14 70] [14 67]
   [14 160] [14 53] [14 58] [14 53] [14 62] [14 58] [14 65] [14 63]
   [28 55] [28 160] [14 62] [14 63] [14 65] [14 67] [14 65] [14 63] [14 160]
   [7 63] [7 160] [28 63] [28 65] [28 67] [14 160] [7 67] [7 160]
   [14 67] [14 65] [28 63] [28 62] [14 160] [14 62] [28 65] [28 62]
   [14 63] [14 65] [84 63]])

(def drums-verse
  (concat
    (loop1 3 drums1)
     (kick 14) (hat 7) (hat 7) (snare 14) (kick 14)
     (snare 7) (snare 7) (kick 14) (snare 14) (kick 14)
     (loop1 3 drums1)))

(def tri-verse
  (concat
    (tri2 63) (tri2 58) (tri2 55) tri2a
    (tri2 63) (tri2 58) (tri2 60)))

(def trigwen1
  (concat [{:vibrato 1}]
    [[12 63] [2 160] [14 63] [12 67] [2 160] [14 67]
    [12 70] [2 160] [14 70] [12 67] [2 160] [14 67]
     [12 68] [2 160] [14 68] [12 65] [2 160] [14 65]
     [42 63] [14 160]]))

(def trigwen2
  (concat [{:vibrato 1}] [[12 58] [2 160] [14 58] [12 63] [2 160] [14 63]
                 [12 67] [2 160] [14 67] [12 63] [2 160] [14 63]
                 [14 56] [14 68] [14 58] [14 70] [28 51] [28 160]]))

(def trigwen3
  (concat [{:vibrato 1}] [[12 58] [2 160] [14 58] [12 63] [2 160] [14 63]
                 [12 67] [2 160] [14 67] [12 63] [2 160] [14 63]
                 [14 56] [14 68] [14 58] [14 70] [28 58] [28 160]]))

(def trigwen4
  (concat [{:vibrato 1}] [[14 68] [14 72] [14 70] [14 68] [28 67] [14 63] [14 160]
                      [14 56] [14 68] [14 58] [14 70] [28 62] [14 58] [14 160]]))

(def trigwen5
  (concat [{:vibrato 1}] [[28 48] [14 60] [14 55] [28 51] [28 48]]))

(def drums2
  (concat (kick 14) (hat 7) (hat 7) (snare 14) (hat 7) (hat 7)
     (kick 14) (kick 14) (snare 14) (hat 7) (hat 7)
    (kick 14) (hat 7) (hat 7) (snare 14) (snare 14)
     (kick 14) (hat 14) (snare 28)))

(def lead3
 (concat [{:vibrato 2}] [[7 55] [7 58] [7 63] [7 67] [7 70] [7 67] [7 63] [7 58]
                   [7 60] [7 63] [7 67] [7 70] [7 72] [7 70] [7 67] [7 63]
                   [7 56] [7 60] [7 63] [7 68] [7 58] [7 62] [7 65] [7 68]
                   [28 67] [7 63] [21 160]]))

(def lead3-echo
  (concat [{:vibrato 2}] [[7 55] [7 58] [7 63] [7 67] [7 70] [7 67] [7 63] [7 58]
                   [7 60] [7 63] [7 67] [7 70] [7 72] [7 70] [7 67] [7 63]
                   [7 56] [7 60] [7 63] [7 68] [7 58] [7 62] [7 65] [7 68]
                   [28 67] [7 63] [9 160]]))

(def lead4
  (concat [{:vibrato 2}] [[7 55] [7 58] [7 63] [7 67] [7 70] [7 67] [7 63] [7 58]
                   [7 60] [7 63] [7 67] [7 70] [7 72] [7 70] [7 67] [7 63]
                   [7 60] [7 63] [7 68] [7 72] [7 62] [7 65] [7 70] [7 74]
                   [28 70] [14 62] [14 160]]))

(def lead5
  (concat [{:vibrato 2}] [[7 60] [7 63] [7 68] [7 72] [7 75] [7 72] [7 68] [7 63]
                   [7 58] [7 63] [7 67] [7 70] [7 75] [7 70] [7 67] [7 63]
                   [7 60] [7 63] [7 68] [7 72] [7 62] [7 65] [7 70] [7 74] [7 77]
                   [7 62] [7 65] [7 70] [7 74] [21 160]]))

(def lead6
  [{:duty 1 :volume 5 :length 12 :pitch 63} {:length 2 :pitch 160} {:length 14 :pitch 63}
   {:length 12 :pitch 67} {:length 2 :pitch 160} {:length 14 :pitch 67}
   {:length 12 :pitch 70} {:length 2 :pitch 160} {:length 14 :pitch 70}
   {:length 12 :pitch 67} {:length 2 :pitch 160} {:length 14 :pitch 67}
   {:length 12 :pitch 68} {:length 2 :pitch 160} {:length 14 :pitch 68}
   {:length 12 :pitch 65} {:length 2 :pitch 160} {:length 14 :pitch 65}
   {:length 28 :pitch 63} {:length 28 :pitch 160}])

(def lead7
  [{:duty 1 :volume 5 :length 12 :pitch 63} {:length 2 :pitch 160} {:length 14 :pitch 63}
   {:length 12 :pitch 67} {:length 2 :pitch 160} {:length 14 :pitch 67}
   {:length 12 :pitch 70} {:length 2 :pitch 160} {:length 14 :pitch 70}
   {:length 12 :pitch 67} {:length 2 :pitch 160} {:length 14 :pitch 67}
   {:length 14 :pitch 68} {:pitch 70} {:pitch 68} {:pitch 67}
   {:length 28 :pitch 65} {:length 28 :pitch 160}])

(def lead8
  [{:length 21 :pitch 68} {:length 7 :pitch 70} {:length 14 :pitch 72} {:pitch 68}
   {:pitch 70} {:pitch 68} {:pitch 67} {:pitch 160}
   {:pitch 68} {:pitch 72} {:pitch 68}
   {:pitch 67} {:length 28 :pitch 65} {:length 14 :pitch 62} {:pitch 160}])

(defn fade-in [n notes]
  (let [head (map-indexed (fn [index note] 
                            (assoc note :volume (min index 5))) (take n notes))
        tail (drop n notes)]
    (concat head tail)))

(defn arp-swell [[n1 n2 n3]]
  (concat 
     (r 16)
     [{:length 1 :volume 1 :duty 2}]
     (loop2 8 [{:pitch n1} {:pitch n2} {:pitch n3}])
     [{:volume 2 :duty 3}]
     (loop2 8 [{:pitch n1} {:pitch n2} {:pitch n3}])
     [{:volume 3 :duty 0}]
     (loop2 8 [{:pitch n1} {:pitch n2} {:pitch n3}])
     [{:volume 4 :duty 1}]
     (loop2 8 [{:pitch n1} {:pitch n2} {:pitch n3}])))

(def sq1
  (concat 
    (loop1 16 (r 20))
    [{:volume 1 :length 95 :pitch 43}
           {:volume 1 :length 95 :pitch 43}
           {:volume 1 :length 95 :pitch 43}
           {:volume 1 :length 95 :pitch 43}
           {:volume 1 :length 95 :pitch 43}
           {:volume 1 :length 33 :pitch 43}
           {:duty 1 :volume 6 :length 7 :pitch 60}]
    (concat [{:vibrato 2}] [[7 160] [28 60] [28 62]] lead1)
    [{:duty 0}] (fade-in 15 (slide 53 68 49))
    [{:length 7 :pitch 160} {:length 14 :pitch 63} {:pitch 62} {:pitch 60}]
    (concat [{:vibrato 2}] lead1)
    [{:volume 1}]
    (concat [{:vibrato 2}] [[2 69.9] [2 70.9] [14 71.9] [14 69.9] 
       [14 66.9] [14 64.9] [28 62.9] [14 59.9]])
    [{:duty 0 :volume 1 :pitch 160 :length 12}] lead3-echo
    lead6 lead7 lead8 lead6
    [{:duty 1 :volume 6 :length 44 :pitch 160} {:length 7 :pitch 60}]
    (concat [{:vibrato 2}] [[7 160] [28 60] [28 62]] lead1
      [{:duty 0}] (fade-in 15 (slide 53 68 49))
    [{:length 7 :pitch 160} {:length 14 :pitch 63} {:pitch 62} {:pitch 60}]
    (concat [{:vibrato 2}] lead1))))

(def arps8
  (concat
    (arp-swell [63 67 70]) (arp-swell [58 62 65])
    (arp-swell [55 58 62]) (arp-swell [60 63 67])
    (arp-swell [63 67 70]) (arp-swell [58 62 65])
    (arp-swell [60 63 67]) (arp-swell [60 63 67])))

(def arps7
  (concat
    (arp-swell [63 67 70]) (arp-swell [58 62 65])
    (arp-swell [55 58 62]) (arp-swell [60 63 67])
    (arp-swell [63 67 70]) (arp-swell [58 62 65])
    (arp-swell [60 63 67])))

(def sq2
  (concat
    arps8 arps7
     [{:length 112 :pitch 160 :duty 1}]
    (concat [{:vibrato 2}] lead2)
    (concat [{:vibrato 3}] [[1 70] [1 71] [14 72] [14 70] [14 67] [14 65] 
     [1 62] [1 62.1] [2 62.2] [2 62.3] [2 62.4] [2 62.5] 
     [2 62.6] [2 62.7] [2 62.8] [2 62.9] [12 63] [14 60]])
    [{:duty 0 :volume 5 :length 12 :pitch 160}]
    lead3 lead3 lead4 lead5 lead3
    [{:volume 5 :duty 2}]
    (concat [[1 58] [1 59] [14 60] [14 58] [14 55] [14 53] 
     [1 50] [1 50.1] [2 50.2] [2 50.3] [2 50.4] [2 50.5] 
     [2 50.6] [2 50.7] [2 50.8] [2 50.9] [8 51] [18 48]])
    arps7 (r 122) (concat [{:vibrato 2}] lead2)))

(def tri
  (concat 
    (tri1 63) (tri1 58) (tri1 55) (tri1 60)
    (tri1 63) (tri1 58) (tri1 60) (tri1 60)
    tri-verse [{:length 112 :pitch 160}] tri-verse
    [{:length 112 :pitch 160}]
    trigwen1 trigwen2 trigwen3 trigwen4 trigwen2 trigwen5
    tri-verse
    [{:length 112 :pitch 160}]
    tri-verse))

(def drums
  (concat 
    [{:length 42 :volume 0 :pitch 0}]
     (loop1 61 [{:length 14 :pitch 0 :volume 0}])
    drums-verse
     [{:length 112 :volume 0 :pitch 0}]
    drums-verse [{:length 112 :volume 0 :pitch 0}]
    [{:length 224 :volume 0 :pitch 0}] (loop1 4 drums2)
     (concat (kick 14) (hat 7) (hat 7) (snare 14) (hat 7) (hat 7)
     (kick 14) (kick 14) (snare 14) (hat 7) (hat 7))
    drums-verse
    [{:length 112 :volume 0 :pitch 0}]
    drums-verse))

(play
  {:square1 sq1
   :square2 sq2
   :triangle tri
   :noise drums})
