(defn drum
  "Takes a decay length and a volume-pitch sequence."
  [length vol-pitch]
  (let [frame1 {:length 1 :volume (ffirst vol-pitch)
                :pitch (last (first vol-pitch))}
        midframes (for [[volume pitch] (rest (take length vol-pitch))]
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

(defn crash
  ([length attenuation]
   (drum length (map (fn [[volume pitch]] [(max 1 (- volume attenuation 2)) pitch])
               [[15 8] [15 2] [15 3] [15 3] [15 3] [15 3]
                [14 3] [14 3] [13 3] [12 3] [12 3] [11 3] [11 3]
                [10 3] [9 3] [9 3] [9 3] [8 3] [8 3] [7 3] [7 3]
                [6 3] [6 3] [5 3] [5 3] [5 3] [4 3] [4 3] [4 3] [4 3]
                [3 3] [3 3] [3 3] [3 3] [2 3] [2 3] [2 3] [2 3] [1 3]])))
  ([length]
    (drum length [[15 8] [15 2] [15 3] [15 3] [15 3] [15 3]
                [14 3] [14 3] [13 3] [12 3] [12 3] [11 3] [11 3]
                [10 3] [9 3] [9 3] [9 3] [8 3] [8 3] [7 3] [7 3]
                [6 3] [6 3] [5 3] [5 3] [5 3] [4 3] [4 3] [4 3] [4 3]
                [3 3] [3 3] [3 3] [3 3] [2 3] [2 3] [2 3] [2 3] [1 3]])))

(defn r
  "Returns a sequence consisting of a rest of length l."
  [l]
  [{:length l :volume 0 :pitch 0}])

(def sq1a
  (concat 
    [{:length 6 :volume 9 :duty 0 :pitch 38} {:length 1 :volume 8 :pitch 38}
     {:length 1 :volume 7 :pitch 38} {:length 1 :volume 6 :pitch 38}
     {:length 1 :volume 5 :pitch 38} {:pitch 160 :length 10}
     {:pitch 60 :volume 6 :length 5} {:pitch 62} {:pitch 60} {:pitch 50}
     {:length 6 :volume 8 :pitch 38} {:length 1 :volume 7 :pitch 38}
     {:length 1 :volume 6 :pitch 38} {:length 1 :volume 5 :pitch 38}
     {:length 1 :volume 4 :pitch 38} {:pitch 160 :length 10}
     {:pitch 58 :volume 6 :length 5} {:pitch 60} {:pitch 58} {:pitch 50}
     {:length 6 :volume 6 :pitch 38} {:length 1 :volume 5 :pitch 38}
     {:length 1 :volume 4 :pitch 38} {:length 1 :volume 3 :pitch 38}
     {:length 1 :volume 2 :pitch 38} {:pitch 160 :length 10}
     {:pitch 57 :volume 6 :length 5} {:pitch 58} {:pitch 57} {:pitch 50}
     {:pitch 53} {:pitch 55} {:pitch 53} {:pitch 45} {:pitch 52} {:pitch 53}
     {:pitch 52} {:pitch 49} {:length 20 :pitch 45} {:length 2 :pitch 57} 
     {:pitch 64} {:pitch 57} {:pitch 69} {:pitch 160} {:pitch 57} {:pitch 64}
     {:pitch 57} {:pitch 69} {:pitch 57} {:length 20 :pitch 45} 
     {:length 2 :pitch 57} {:pitch 64} {:pitch 57} {:pitch 69} {:pitch 57} 
     {:length 10 :pitch 160} {:length 20 :pitch 50} {:length 2 :pitch 62} 
     {:pitch 69} {:pitch 62} {:pitch 74} {:pitch 160} {:pitch 62} {:pitch 69}
     {:pitch 62} {:pitch 74} {:pitch 62} {:length 20 :pitch 50} 
     {:length 2 :pitch 62} {:pitch 69} {:pitch 62} {:pitch 74} {:pitch 62} 
     {:length 10 :pitch 160}]))

(def sq1b
  (concat 
    [{:length 10 :volume 6 :duty 0 :pitch 50} 
     {:length 9 :volume 5 :pitch 160}
     {:length 1 :pitch 50} {:pitch 57} {:pitch 65}
     {:pitch 69} {:length 2 :pitch 74} 
     {:length 7 :pitch 160} {:length 3 :pitch 74}
     {:length 4 :pitch 160} {:length 1 :pitch 50} 
     {:pitch 57} {:pitch 65} {:pitch 69} 
     {:length 2 :pitch 74} {:length 7 :pitch 160}
     {:length 3 :pitch 74} {:length 4 :pitch 160}
     {:length 1 :pitch 50} {:pitch 57} {:pitch 65} 
     {:pitch 69} {:length 2 :pitch 74} 
     {:length 7 :pitch 160} {:length 3 :pitch 74} 
     {:length 4 :pitch 160}]))

(def sq2a
  (concat [{:length 160 :volume 0 :pitch 160}
           {:length 20 :volume 5 :duty 0 :pitch 33}
           {:length 8 :volume 4 :pitch 61} {:length 2 :pitch 160} {:length 10 :pitch 61}
           {:length 20 :volume 5 :duty 0 :pitch 33}
           {:length 10 :volume 4 :pitch 61} {:length 10 :pitch 160}
           {:length 20 :volume 5 :duty 0 :pitch 38}
           {:length 8 :volume 4 :pitch 65} {:length 2 :pitch 160} {:length 10 :pitch 65}
           {:length 20 :volume 5 :duty 0 :pitch 38}
           {:length 10 :volume 4 :pitch 65} {:length 10 :pitch 160}]))

(def sq2b
  (concat [{:length 20 :volume 5 :duty 0 :pitch 33}
           {:length 8 :volume 4 :pitch 61} {:length 2 :pitch 160} {:length 10 :pitch 61}
           {:length 20 :volume 5 :duty 0 :pitch 33}
           {:length 10 :volume 4 :pitch 61} {:length 10 :pitch 160}
           {:length 20 :volume 5 :duty 0 :pitch 38}
           {:length 8 :volume 4 :pitch 65} {:length 2 :pitch 160} {:length 10 :pitch 65}
           {:length 10 :pitch 160}
           {:length 10 :volume 5 :duty 0 :pitch 38}
           {:length 10 :volume 4 :pitch 65} {:length 10 :pitch 38}]))

(def tri-kick [{:length 1 :pitch 62} {:pitch 58} {:pitch 54} {:pitch 52}])

(def tri-snare [{:length 1 :pitch 70} {:pitch 67} {:pitch 64} {:pitch 54}])

(def tri1
  (concat [{:length 160 :pitch 160}]
    tri-kick [{:length 16 :pitch 45}]
    tri-snare [{:length 4 :pitch 57} {:length 2 :pitch 160}]
    tri-snare [{:length 6 :pitch 57}]
    tri-kick [{:length 16 :pitch 45}]
    tri-snare [{:length 6 :pitch 57} {:length 10 :pitch 160}]
    tri-kick [{:length 16 :pitch 50}]
    tri-snare [{:length 4 :pitch 62}  {:length 2 :pitch 160}]
    tri-snare [{:length 6 :pitch 62}]
    tri-kick [{:length 16 :pitch 50}]
    tri-snare [{:length 6 :pitch 62} {:length 10 :pitch 160}]))

(def tri2
  (concat tri-kick [{:length 6 :pitch 50} {:length 30 :pitch 160}]
          tri-kick [{:length 6 :pitch 50} {:length 30 :pitch 160}]
          tri-kick [{:length 6 :pitch 50} {:length 70 :pitch 160}]
          tri-kick [{:length 16 :pitch 45}]
          tri-snare [{:length 4 :pitch 57} {:length 2 :pitch 160}]
          tri-snare [{:length 6 :pitch 57}]
          tri-kick [{:length 16 :pitch 45}]
          tri-snare [{:length 6 :pitch 57} {:length 10 :pitch 160}]
          tri-kick [{:length 16 :pitch 50}]
          tri-snare [{:length 4 :pitch 62} {:length 2 :pitch 160}]
          tri-snare [{:length 6 :pitch 62}]
          tri-kick [{:length 16 :pitch 50}]
          tri-snare [{:length 6 :pitch 62} {:length 10 :pitch 160}]))

(def tri3
  (concat tri-kick [{:length 16 :pitch 45}]
          tri-snare [{:length 4 :pitch 57} {:length 2 :pitch 160}]
          tri-snare [{:length 6 :pitch 57}]
          tri-kick [{:length 16 :pitch 45}]
          tri-snare [{:length 6 :pitch 57} {:length 10 :pitch 160}]
          tri-kick [{:length 16 :pitch 50}]
          tri-snare [{:length 4 :pitch 62} {:length 2 :pitch 160}]
          tri-snare [{:length 6 :pitch 62} {:length 10 :pitch 160}]
          tri-kick [{:length 6 :pitch 50}]
          tri-snare [{:length 6 :pitch 62}]
          tri-kick [{:length 6 :pitch 50}]))

(def drums1
  (concat [{:length 20 :volume 0 :pitch 0}] 
    (r 140) (crash 20 3) (snare 10) (snare 30) (snare 20)
    (crash 20 3) (snare 10) (snare 30) (snare 20)))

(def drums2
  (concat (crash 10 6) (r 30) (crash 10 6) (r 30) (crash 10 6) (r 70)
    (crash 20 3) (snare 10) (snare 30) (snare 20)
    (crash 20 3) (snare 10) (snare 30) (snare 20)))

(def drums3
  (concat (crash 20 3) (snare 10) (snare 30) (snare 20)
    (crash 20 3) (snare 10) (snare 10) (crash 15 6) (r 5) (snare 20)))

(def sq1c
  (concat 
    [{:length 20 :volume 6 :duty 0 :pitch 45} {:length 2 :pitch 57} 
     {:pitch 64} {:pitch 57} {:pitch 69} {:pitch 160} {:pitch 57}
     {:pitch 64} {:pitch 57} {:pitch 69} {:pitch 57} 
     {:length 20 :pitch 45} {:length 2 :pitch 57} {:pitch 64}
     {:pitch 57} {:pitch 69} {:pitch 57} {:length 10 :pitch 160}
     {:length 20 :pitch 50} {:length 2 :pitch 62} {:pitch 69} 
     {:pitch 62} {:pitch 74} {:pitch 160} {:pitch 62} {:pitch 69}
     {:pitch 62} {:pitch 74} {:pitch 62} {:length 10 :pitch 160}
     {:length 10 :pitch 50} {:length 2 :pitch 62} {:pitch 69} 
     {:pitch 62} {:pitch 74} {:pitch 62} {:length 10 :pitch 50}]))

(def sq1
  (concat (loop1 3 sq1a) (take 56 sq1a) sq1b (loop1 3 sq1c) (take 18 sq1c) sq1b))

(def sq1d
  (concat [{:length 10 :pitch 160}]
  (loop1 3 (concat 
    [{:length 10 :volume 4 :duty 0 :pitch 57} 
     {:pitch 61} {:pitch 64} {:pitch 69} {:pitch 64} {:pitch 61} {:pitch 64}
     {:pitch 160} {:pitch 62} {:pitch 65} {:pitch 69}] {:duty 1 :volume 3}
    (vib-all [{:length 10 :pitch 86} {:length 10 :pitch 81} 
              {:length 10 :pitch 77} {:length 20 :pitch 81}] 0.7 0.4)))
    [{:length 10 :volume 4 :duty 0 :pitch 57} 
     {:pitch 61} {:pitch 64} {:pitch 69} {:pitch 64} {:pitch 61} {:pitch 64}
     {:pitch 160} {:pitch 62} {:pitch 65} {:pitch 69} {:pitch 62} {:length 27 :pitch 160}])))

(def sq2c
  (vib (concat [{:length 80 :duty 0 :pitch 33}
           {:length 80 :pitch 38}]) 0.5 0.12))

(def tri4
  (concat [{:length 80 :pitch 45} {:length 80 :pitch 50} ]))

(def drums4
  (loop1 8 (concat (crash 20 5) (crash 20 7) (crash 20 9) (crash 20 10))))

(def strum
  [{:length 1 :volume 9 :duty 0 :pitch 33} {:pitch 38}
     {:pitch 41} {:pitch 45} {:length 3 :pitch 50} {:length 9 :pitch 160}
     {:length 16 :pitch 62}
     {:length 2 :pitch 50} {:pitch 57} {:pitch 50} {:pitch 62}
     {:pitch 50} {:pitch 57} {:pitch 50} {:pitch 62}
     {:pitch 50} {:pitch 57} {:pitch 50} {:pitch 62}
   {:pitch 50} {:pitch 57} {:pitch 50} {:pitch 62}])

(def strum2
  [{:length 1 :pitch 33} {:pitch 36}
     {:pitch 39} {:pitch 43} {:length 3 :pitch 48} {:length 9 :pitch 160}
     {:length 16 :pitch 60}
     {:length 2 :pitch 48} {:pitch 55} {:pitch 48} {:pitch 60}
     {:pitch 48} {:pitch 55} {:pitch 48} {:pitch 60}
     {:pitch 48} {:pitch 55} {:pitch 48} {:pitch 60}
   {:pitch 48} {:pitch 55} {:pitch 48} {:pitch 60}])

(def strum3
  [{:length 1 :pitch 33} {:pitch 38} {:pitch 41} {:pitch 45} 
     {:length 3 :pitch 50} {:length 7 :pitch 160} {:length 7 :pitch 38} 
     {:length 1 :pitch 160} {:length 15 :pitch 38} {:length 1 :pitch 160}
     {:length 7 :pitch 38} {:length 1 :pitch 160} {:length 18 :pitch 38}])

(def strum4
  [{:length 1 :pitch 33} {:pitch 36}
     {:pitch 39} {:pitch 43} {:length 3 :pitch 48} {:length 9 :pitch 160}
     {:length 2 :pitch 36} {:pitch 43} {:pitch 36} {:pitch 48} 
   {:pitch 36} {:pitch 43} {:pitch 36} {:pitch 48} 
   {:pitch 41} {:pitch 48} {:pitch 41} {:pitch 48} {:pitch 53}
   {:pitch 41} {:pitch 48} {:pitch 41} {:pitch 48} {:pitch 53}
   {:pitch 41} {:pitch 48} {:pitch 41} {:pitch 48} {:pitch 53}])

(def strum5
  [{:length 15 :pitch 46} {:length 2 :pitch 160} {:length 15 :pitch 46}
   {:length 2 :pitch 53} {:pitch 60} {:pitch 53} {:pitch 65} {:length 1 :pitch 160}
   {:length 2 :pitch 53} {:pitch 60} {:pitch 53} {:pitch 65}
   {:pitch 53} {:pitch 60} {:pitch 53} {:pitch 65} {:length 1 :pitch 160}
   {:length 15 :pitch 46} {:length 1 :pitch 160} {:length 8 :pitch 46}
   {:length 2 :pitch 53} {:pitch 60} {:pitch 53} {:pitch 65}
   {:length 2 :pitch 53} {:pitch 60} {:pitch 53} {:pitch 65}
   {:length 7 :pitch 46} {:length 1 :pitch 160} {:length 8 :pitch 46}
   {:length 2 :pitch 53} {:pitch 60} {:pitch 53} {:pitch 65}
   {:length 2 :pitch 53} {:pitch 60} {:pitch 53} {:pitch 65}])

(def strum6
  [{:length 15 :pitch 48} {:length 1 :pitch 160} {:length 16 :pitch 48}
   {:length 2 :pitch 53} {:pitch 60} {:pitch 53} {:pitch 65} {:length 1 :pitch 160}
   {:length 2 :pitch 53} {:pitch 60} {:pitch 53} {:pitch 65}
   {:pitch 53} {:pitch 60} {:pitch 53} {:pitch 65}
   {:pitch 50} {:pitch 57} {:pitch 50} {:pitch 62}
   {:pitch 50} {:pitch 57} {:pitch 50} {:pitch 62}
   {:length 56 :pitch 160}])

(def strum7
  [{:length 15 :pitch 48} {:length 2 :pitch 160} {:length 15 :pitch 48}
   {:length 7 :pitch 53} {:length 1 :pitch 160} {:length 16 :pitch 48}
   {:length 18 :pitch 50} {:length 6 :pitch 55} {:length 7 :pitch 57} {:length 2 :pitch 160}
   {:length 7 :pitch 60} {:length 31 :pitch 62}])

(defn trifn [a b c d]
  (concat
    tri-kick [{:length 4 :pitch a} {:length 8 :pitch 160}]
    tri-kick [{:length 10 :pitch b} {:length 2 :pitch 160}]
    tri-kick [{:length 10 :pitch c} {:length 2 :pitch 160}]
    tri-kick [{:length 10 :pitch d} {:length 2 :pitch 160}]))

(defn k
  "Kick wrapper. Precedes note with relative arpeggio,
   subtracting length as needed. Takes and returns
   sequences of length-pitch pairs."
  [[l p]]
  (let [arp (vec (take l [[1 (+ p 19)] [1 (+ p 15)]
           [1 (+ p 12)] [1 (+ p 7)] [1 (+ p 3)]]))]
    (if (< 5 l) (conj arp [(- l 5) p]) arp)))

(def drums-verse
  (concat (loop1 3 (concat (kick 16) (crash 16 4) (crash 16 5) (crash 16 6)))
    (kick 16) (r 48)))

(def drums-chorus
  (concat
    (loop1 3 (concat
      (kick 16) (kick 16) (snare 8) (snare 16)
      (kick 16) (kick 8) (snare 16) (kick 8) (kick 8) (snare 16)))
      (kick 16) (kick 16) (snare 8) (snare 16)
      (kick 16) (r 56)))

(def tri-verse
  (concat (loop1 2 (concat (trifn 50 50 50 50) (trifn 50 50 50 50)
    (trifn 48 48 48 48)
    tri-kick [{:length 4 :pitch 50} {:length 56 :pitch 160}]))))

(def tri-chorus
  (length-pitch (concat (k [16 46]) (k [16 46]) (k [8 53]) (k [16 53])
        (k [16 46]) (k [8 46]) (k [16 53]) (k [8 46]) (k [8 46]) (k [16 53])
        (k [16 48]) (k [16 48]) (k [8 55]) (k [16 55]) (k [16 50])
        (k [8 50]) (k [8 53]) (k [8 55]) (k [8 57]) (k [8 55]) (k [16 53])
        (k [16 46]) (k [16 46]) (k [8 53]) (k [16 53])
        (k [16 46]) (k [8 46]) (k [16 53]) (k [8 46]) (k [8 46]) (k [16 53])
        (k [16 48]) (k [16 48]) (k [8 55]) (k [16 55]) (k [16 50])
        (k [8 55]) (k [8 57]) (k [8 60]) (k [32 62]))))

(def sq1-verse
  (concat strum strum strum2 strum3 strum strum strum4 strum3))

(def sq1-chorus
  (concat strum5 strum6 strum5 strum7))

(def sq2-solo1
  (concat [{:volume 8 :length 10 :duty 1 :pitch 50}]
    (vib-all (length-pitch 
        [[5 50] [1 160] [12 62] [4 160] [4 65] [4 160] [16 65]
         [12 64] [4 160] [16 65] [13 64] [6 65] [5 64] [16 62]
         [12 60] [4 160] [12 57] [4 160] [8 60] [16 65]
         [16 62] [8 60] [8 57] [8 60] [2 62] [2 62.2] [2 62.3] 
         [2 62.4] [2 62.5] [2 62.4] [2 62.3] [2 62.2] [16 62]
         [8 60] [8 160] [8 60] [8 160] [8 60] [16 57]
         [16 60] [8 65] [16 65] [8 64] [8 65] [16 65]
         [11 67] [5 160] [12 65] [3 160] [8 62] [16 60] [32 62] [40 160]
         [16 50] [16 62] [7 65] [1 160] [16 65] [15 64] [1 160] [8 64]
         [16 65] [7 67] [2 160] [7 67] [16 69] [11 67] [5 160] [12 65] [4 160]
         [8 67] [11 69] [5 160] [32 62] [40 160]
         [15 60] [1 160] [16 60] [1 160] [6 60] [16 57] [16 60]
         [7 57] [1 160] [16 57] [8 55] [1 160] [7 55] [12 52] [4 160]
         [6 52] [10 53] [8 52] [6 52] [10 53] [8 52] [5 52] [6 53] [5 52] [32 50]
         [2 51] [2 52] [2 53] [1 54] [2 55] [1 56] [1 57] [2 58] [1 59] [1 60] [1 61] [16 62]]) 0.7 0.2)))

(def sq2-solo2
  (concat [{:volume 8 :length 2 :duty 1 :pitch 58}]
    (length-pitch 
        [[2 70] [2 58] [2 70] [2 58] [2 70] [4 160]
         [2 58] [2 70] [2 58] [2 70] [2 58] [2 70] [2 58] [3 160]
         [2 58] [2 70] [2 58] [2 160]
         [2 58] [2 70] [2 58] [2 70] [2 58] [2 70] [2 58] [1 70]
         [2 62] [2 74] [2 62] [2 74] [2 62] [2 74] [2 62] [2 74]
         [2 58] [2 70] [2 58] [2 70] [1 58] [2 62] [2 74] [2 62]
         [2 58] [2 70] [2 58] [2 70] [2 62] [2 74] [2 62] [1 74]
         [2 58] [2 70] [2 58] [1 70] 
         [2 62] [2 74] [2 62] [2 74] [2 62] [2 74] [2 62] [2 74]
         [2 60] [2 72] [2 60] [2 72] [2 60] [2 72] [3 160]
         [2 60] [2 72] [2 60] [2 72] [2 60] [2 72] [10 160]
         [2 60] [2 72] [2 60] [2 72]
         [2 58] [2 70] [2 58] [2 70] [2 58] [2 70] [2 58] [1 70]
         [2 57] [2 69] [2 57] [2 69] [2 57] [2 69] [2 57] [2 69]
         [2 57] [2 69] [2 57] [2 69] [1 58] [1 59] [1 67] [1 69] [1 63] [1 65] [1 77] [1 81]
         [2 69] [2 81] [2 69] [2 81] [2 69] [2 81] [2 69] [2 81]
         [2 67] [2 79] [2 67] [2 79] [2 69] [2 81] [2 69] [2 81] [2 70] [2 82] [2 70] [2 82]
         [2 58] [2 70] [2 58] [2 70] [2 58] [2 70] [4 160]
         [2 58] [2 70] [2 58] [2 70] [2 58] [2 70] [2 58] [3 160]
         [2 58] [2 70] [2 58] [2 160]
         [2 58] [2 70] [2 58] [2 70] [2 58] [2 70] [2 58] [1 70]
         [2 62] [2 74] [2 62] [2 74] [2 62] [2 74] [2 62] [2 74]
         [2 58] [2 70] [2 58] [2 70] [1 58] [2 62] [2 74] [2 62]
         [2 58] [2 70] [2 58] [2 70] [2 62] [2 74] [2 62] [1 74]
         [2 58] [2 70] [2 58] [1 70]
         [2 62] [2 74] [2 62] [2 74] [2 62] [2 74] [2 62] [2 74]
         [2 60] [2 72] [2 60] [2 72] [2 60] [2 72] [2 60] [1 72] [1 160]
         [2 60] [2 72] [2 60] [2 72] [2 60] [2 72] [2 60] [1 72] [1 160]
         [2 65] [2 77] [2 65] [1 77] [1 160]
         [2 64] [2 76] [2 64] [2 76] [2 64] [2 76] [2 64] [1 76] [1 160]
         [2 62] [2 74] [2 62] [2 74] [2 62] [2 74] [2 62] [1 74] [2 160]
         [2 67] [2 79] [2 67] [1 79] [2 69] [2 81] [2 69] [1 81]
         [2 72] [2 84] [2 72] [1 84]
         [2 74] [2 86] [2 74] [2 86] [2 74] [2 86] [2 74] [2 86]
         [2 74] [2 86] [2 74] [2 86] [2 74] [2 86]])))

(play
  (concat sq1 [{:length 5 :pitch 160}] sq1d sq1-verse sq1-chorus sq1-verse
    sq1-verse sq1-chorus sq1a)
  (concat (loop1 3 sq2a) (take 9 sq2a) [{:length 60 :pitch 160}] 
    (loop1 3 sq2b) (take 8 sq2b) [{:length 60 :pitch 160 :volume 2}]
    (loop1 4 sq2c) (r 256) (r 256) (r 256) (r 256) sq2-solo1 sq2-solo2 (r 14) sq2a)
  (concat (loop1 2 tri1) tri2 (take 50 tri2)
   [{:length 60 :pitch 160}] (loop1 3 tri3) (take 32 tri3)
    [{:length 60 :pitch 160}] (loop1 4 tri4)
    tri-verse tri-chorus tri-verse tri-verse tri-chorus tri1)
  (concat (loop1 2 drums1) drums2 (take 95 drums2)
    (r 70) (loop1 3 drums3) (take 58 drums3) (r 70) drums4
    drums-verse drums-verse drums-chorus drums-verse drums-verse
    drums-verse drums-verse drums-chorus drums1))
