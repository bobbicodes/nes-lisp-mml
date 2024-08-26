(defn power-chord-5th
  "This instrument has an attack and release envelope,
   between which will be filled with a sustain of 7."
  [l p]
  (let [attack [10 9 8 7 6 5]
        release [4 4 4 4 4 4 4 4 4 4 4 4 3 3 3 3 3 3 2 2 2 2 2 1]]
    (cond
      (< 30 l)
      [{:envelope attack :length 6 :pitch p}
       {:volume 4 :length (- l 30) :pitch p}
       {:envelope release :length 24 :pitch p}]
      (< 7 l)
      [{:envelope attack :length 6 :pitch p}
       {:envelope release :length (- l 6) :pitch p}]
      :else
      [{:envelope attack :length l :pitch p}])))

(defn low-pulse
  "This instrument has 3 envelopes, attack, decay and release.
   Any remaining frames will be the last volume."
  [l p]
  (let [attack [15 14 14 13 13 13 13 13 12 12 12 12 12 12 11 11 11 11 11 10 10 10 10 10]
        decay [10 10 10 10 9 9 9 9 9 9 9 8 8 8 8 8 8 8 7 7 7 7 7 7]
        release [7 7 6 6 6 6 6 6 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 3]]
    (cond
      (< 72 l)
      [{:envelope attack :length 24 :pitch p}
       {:envelope decay :length 24 :pitch p}
       {:envelope release :length 24 :pitch p}
       {:volume 3 :length (- l 72) :pitch p}]
      (< 48 l)
      [{:envelope attack :length 24 :pitch p}
       {:envelope decay :length 24 :pitch p}
       {:envelope release :length (- l 48) :pitch p}]
      (< 24 l)
      [{:envelope attack :length 24 :pitch p}
       {:envelope decay :length (- l 24) :pitch p}]
      :else
      [{:envelope attack :length l :pitch p}])))

(defn swell-lead
  "Applies a soft attack and vibrates the rest of the note."
  [l p]
  (if (< l 6)
    (concat
    [{:vibrato 0}]
    [{:envelope [2 3 4 5 6]} [l p]])
  (concat
    [{:vibrato 0}]
    [{:envelope [2 3 4 5 6]} [5 p]]
    [{:volume 7}]
    [{:vibrato 1} [(- l 5) p]])))

(defn swell-lead3
  "Increased volume"
  [l p]
  (if (< l 6)
    (concat
    [{:vibrato 0}]
    [{:envelope [6 7 8 9 10]} [l p]])
  (concat
    [{:vibrato 0}]
    [{:envelope [6 7 8 9 10]} [5 p]]
    [{:volume 10}]
    [{:vibrato 1} [(- l 5) p]])))

(defn swell-lead-echo
  "Applies a soft attack and vibrates the rest of the note."
  [l p]
  (if (< l 6)
    (concat
    [{:vibrato 0}]
    [{:envelope [1 1 2 2 3]} [l p]])
  (concat
    [{:vibrato 0}]
    [{:envelope [1 1 2 2 3]} [5 p]]
    [{:volume 4}]
    [{:vibrato 1} [(- l 5) p]])))

(defn swell-lead2
  "Reduced volume"
  [l p]
  (if (< l 6)
    (concat
    [{:vibrato 0}]
    [{:envelope [1 2 3 4 5]} [l p]])
  (concat
    [{:vibrato 0}]
    [{:envelope [1 2 3 3 3]} [5 p]]
    [{:volume 5}]
    [{:vibrato 1} [(- l 5) p]])))

(defn attack-lead [l p]
  (concat
    [{:vibrato 0}]
    [{:envelope [10 10 9 7 7 6]} [6 p]]
    [{:volume 6}]
    [{:vibrato 1} [(- l 6) p]]))

(defn attack-lead-echo [l p]
  (concat
    [{:vibrato 0}]
    [{:envelope [4 4 3 3 2 2]} [6 p]]
    [{:volume 2}]
    [{:vibrato 1} [(- l 6) p]]))

(defn slide [from to frames]
  (length-pitch (take frames 
    (if (< to from)
      (map #(vector 1 %) (reverse (range to from (/ (abs (- from to)) frames))))
      (map #(vector 1 %) (range from to (/ (abs (- from to)) frames)))))))

(defn release [l p]
  [{:vibrato 3
    :envelope [5 5 5 4 4 4 3 3 3 2 2 2 1 1 1]}
      [l p]])

(defn release2 [l p]
  [{:envelope [10 9 9 8 8 7 6 5 4 4 3 2 1 1 1]}
      [l p]])

(defn release-echo [l p]
  [{:envelope [4 4 3 3 3 2 2 2 2 1 1 1 1 1 1]}
      [l p]])

(defn v [l p]
  [{:vibrato 2} [l p]])

(defn va [l p]
  [{:vibrato 2} [l p]])

(defn v3 [l p]
  [{:vibrato 3} [l p]])

(def sq1-intro
  (concat
    (mapcat (fn [[l p]] (swell-lead l p))
         [[27 62] [27 64] [26 65] [27 70] [20 70] [90 69]])
     (release 16 69) [[24 160]]
     (attack-lead 12 74) (attack-lead 30 69) (release 12 69)
     (attack-lead 12 74) (attack-lead 80 70)
     [{:volume 4}] (slide 70 62 22)
     (mapcat (fn [[l p]] (swell-lead l p))
         [[33 62] [27 64] [26 65] [27 70] [20 70] [9 69] [9 67] [70 69]])
     (release 20 69) [[17 160]]
     (attack-lead 12 74) (attack-lead 30 69) (release 12 69)
     (attack-lead 12 74) (attack-lead 80 70)
     [{:volume 4}] (slide 70 62 22)
     (mapcat (fn [[l p]] (swell-lead l p))
         [[33 62] [27 64] [26 65] [27 70] [20 70] [60 69]
          [27 69] [27 74] [27 72] [26 69] [27 72]
          [14 70] [13 72] [13 70] [14 72]])
     (mapcat (fn [[l p]] (swell-lead2 l p))
         [[14 70] [13 72] [13 70] [14 72]])
     (mapcat (fn [[l p]] (swell-lead l p))
         [[27 70] [27 72] [26 74] [27 70] [80 69]])
     (release 20 69) [[44 160]]
     (attack-lead 12 74) (attack-lead 30 69) (release 12 69)
     (attack-lead 12 74) (attack-lead 80 70)
     [{:volume 4}] (slide 70 62 22)))

(def sq1-intro-echo
  (concat
    (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[27 61.95] [27 63.95] [26 64.95] [27 69.95] [20 69.95] [90 68.95]])
     (release-echo 16 68.95) [[24 160]]
     (attack-lead-echo 12 73.95) (attack-lead-echo 30 68.95) (release-echo 12 68.95)
     (attack-lead-echo 12 73.95) (attack-lead-echo 80 69.95)
     [{:volume 2}] (slide 69.95 61.95 22)
     (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[33 61.95] [27 63.95] [26 64.95] [27 69.95]
          [20 69.95] [9 68.95] [9 66.95] [70 68.95]])
     (release-echo 20 68.95) [[17 160]]
     (attack-lead-echo 12 73.95) (attack-lead-echo 30 68.95) (release-echo 12 68.95)
     (attack-lead-echo 12 73.95) (attack-lead-echo 80 69.95)
     [{:volume 2}] (slide 69.95 61.95 22)
     (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[33 61.95] [27 63.95] [26 64.95] [27 69.95] [20 69.95] [60 68.95]
          [27 68.95] [27 73.95] [27 71.95] [26 68.95] [27 71.95]
          [14 69.95] [13 71.95] [13 69.95] [14 71.95]])
     (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[14 69.95] [13 71.95] [13 69.95] [14 71.95]])
     (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[27 69.95] [27 71.95] [26 73.95] [27 69.95] [80 68.95]])
     (release-echo 20 68.95) [[44 160]]
     (attack-lead-echo 12 73.95) (attack-lead-echo 30 68.95) (release-echo 12 68.95)
     (attack-lead-echo 12 73.95) (attack-lead-echo 80 69.95)
     [{:volume 2}] (slide 69.95 61.95 22)))

(- 56 27)

(def sq1-verse1
  (concat
     [{:length 27 :pitch 160}]
     (swell-lead2 26 58) (r 1) (swell-lead2 26 58)
     (slide 63 65 12) (va 15 65) (swell-lead2 27 63)
     (swell-lead2 53 62) (slide 58 60 12) (v 29 60)
     (slide 60 58 12) (swell-lead2 136 58) (release 12 58)
     (loop1 12 (r 8)) (swell-lead2 26 58) (slide 63 65 12)
     (va 15 65) (swell-lead2 27 63) (swell-lead2 13 63)
     (swell-lead2 14 63) (swell-lead2 13 63) (swell-lead2 13 63)
     (swell-lead2 14 63) (swell-lead2 42 62) (slide 63 65 12)
     (v 122 65) (release 12 65)
     (loop1 12 (r 8)) (swell-lead2 13 58) (swell-lead2 13 60)
     (swell-lead2 14 62) (swell-lead2 13 65) (swell-lead2 27 63)
     (swell-lead2 53 62) (slide 58 60 12) (v 29 60)
     (slide 60 58 12) (swell-lead2 116 58) (release 12 58)
     (loop1 12 (r 8)) (swell-lead2 14 58) (swell-lead2 13 58)
     (swell-lead2 13 60) (swell-lead2 13 62) (swell-lead2 13 65)
     (swell-lead2 80 63) (swell-lead2 27 62) (slide 62 65 10)
     (v 17 65) (swell-lead2 27 63) (swell-lead2 26 62)
     (swell-lead2 33 63) (slide 63 65 16) (v 60 65)
     (swell-lead2 27 67)
    (loop1 2
      (concat [{:volume 5}]
        (slide 63 65 16) (va 91 65) (swell-lead2 80 63) (swell-lead2 14 62)
        (swell-lead2 13 60) (swell-lead2 136 62) (release 24 62) (r 54)))
    [{:volume 5}] (slide 63 65 16) (va 91 65) (swell-lead2 80 63) (swell-lead2 14 62)
    (swell-lead2 13 60) (swell-lead2 107 62) (swell-lead2 27 58) (swell-lead2 27 60)
    (swell-lead2 26 62) (swell-lead2 26 63)
    (slide 63 65 16) (v 91 65) (swell-lead2 80 63) (swell-lead2 14 62) (swell-lead2 13 60)
        (swell-lead2 136 62) (release 24 62) (r 54)))

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
  (drum length [[12 6] [9 2] [5 1] [4 1] [2 0]]))

(defn snare [length]
  (drum length [[15 8] [10 6] [8 6] [7 6]
                [6 5] [7 5] [6 5] [5 5]]))

(defn ride [l]
  [{:length 1 :pitch 4 :volume 8}
   {:length 2 :pitch 2 :volume 3}
   {:length 2 :pitch 2 :volume 2}
   {:length (- l 5) :pitch 2 :volume 1}])

(def tri-verse1
  (concat
    (loop1 7
     (concat
       [[8 65] [1 160] [8 65] [1 160] [9 65] [1 160]]
       (v 94 70) [[6 67] [7 65]] 
       (v 24 63) [[3 160]] (v 53 63) (v 27 65)
       (v 54 70) (v 40 74) [[6 70] [7 74]]
       (v 24 75) (r 3) (v 23 75) (r 3) (slide 75 77 12) (va 14 77)))
       [[8 65] [1 160] [8 65] [1 160] [9 65] [1 160]]
       (v 94 70) [[6 67] [7 65]] 
       (v 24 63) [[3 160]] (v 53 63) (v 27 65)
       (v 107 70)))

(def dpcm-verse1
  (concat
    (loop1 3
       (map (fn [l] {:sample "soft-ride" :length l})
          [54 43 10 27 53 27 54 43 10 27 53 27]))
       (map (fn [l] {:sample "soft-ride" :length l})
          [54 43 10 27 53 27 54 43])
       {:sample "ride" :length 5} {:sample "hta" :length 5}
       {:sample "ht7" :length 10} {:rest 17}
       {:sample "ht3" :length 10} {:rest 30}
       {:sample "ht0" :length 7} {:sample "ht7" :length 7}
       {:sample "hta" :length 10} {:sample "ht7" :length 7}
       {:sample "ht0" :length 9}))

(def noise-sweep
  [{:length 137 :volume 0 :pitch 15}
   {:length 5 :volume 1 :pitch 15}
   {:length 5 :volume 1 :pitch 14}
   {:length 5 :volume 2 :pitch 13}
   {:length 5 :volume 2 :pitch 12}
   {:length 5 :volume 3 :pitch 11}
   {:length 5 :volume 3 :pitch 10}
   {:length 5 :volume 4 :pitch 9}
   {:length 5 :volume 4 :pitch 8}
   {:length 5 :volume 5 :pitch 7}
   {:length 5 :volume 5 :pitch 6}
   {:length 5 :volume 6 :pitch 5}
   {:length 5 :volume 6 :pitch 4}
   {:length 6 :volume 6 :pitch 3}
   {:length 6 :volume 6 :pitch 2}
   {:length 3 :volume 6 :pitch 2}
   {:length 2 :volume 6 :pitch 2}])

(def dpcm-chorus
  [{:sample "kick-crash" :length 44} {:rest 10}
   {:sample "snare" :length 11} {:rest 15}
   {:sample "ride" :length 14}
   {:sample "kick-ride" :length 13}
   {:sample "kick-ride" :length 27}
   {:sample "kick-ride" :length 27}
   {:sample "snare" :length 11} {:rest 15}
   {:sample "ride" :length 27}])

(defn nt [length]
  (drum length [[4 11] [4 5] [3 5] [2 5] [1 5]]))

(def noise-chorus1
  (concat
    (kick 54) (snare 26) (ride 14)
     (kick 13) (kick 27) (kick 27)
     (snare 26) (ride 27)))

(def noise-chorus2
  (concat
    (kick 54) (snare 26) (ride 14) (kick 13) 
         (nt 8) (nt 8) (nt 10)
         (nt 8) (nt 8) (nt 11)
         (snare 8) (nt 8) (nt 11)
         (nt 8) (nt 8) (nt 10)))

(def tri-chorus1
  [[24 50] [30 160] [24 57] [16 160]
   [13 57] [14 50] [13 57] [27 50] [26 57] [26 50]
   [28 160] [26 51]])

(defn t [l p]
  (map #(vector 1 %)
    (take l (reverse (range (+ p l))))))

(def tri-chorus
   (concat tri-chorus1 [[161 160]] tri-chorus1 [[54 160]]
     (t 8 60) (t 8 60) (t 10 55)
     (t 8 65) (t 8 65) (t 11 60)
     (t 8 63) (t 8 63) (t 11 58)
     (t 8 60) (t 8 60) (t 10 55)
     tri-chorus1 [[161 160]] tri-chorus1
     [[54 160] [39 51] [15 160] [26 53]]))

(play {})

(def sq-chorus2a
  (concat
    (mapcat (fn [[l p]] (swell-lead l p))
         [[40 74] [14 72] [13 74] [13 72] [14 69]
          [13 67] [27 66] [27 67] [26 69] [27 72]
          [54 70] [53 67] [27 63] [27 70] [26 69]
          [27 67] [14 66] [13 67] [54 69]])
     (release 26 69) (swell-lead 24 66) (r 3)
     (swell-lead 24 66) (r 3) (swell-lead 13 66)
     (swell-lead 13 63) (swell-lead 27 62)))

(def sq1-chorus2
  (concat
     sq-chorus2a (loop1 2 (r 107)) sq-chorus2a
     (mapcat (fn [[l p]] (swell-lead l p))
         [[14 63] [13 62] [13 60] [14 62] [6 60] [7 62] [40 60]])
     (swell-lead 27 60) (swell-lead 27 62) (swell-lead 26 63) (swell-lead 27 65)))

(def p2-chorus2
  (concat (loop1 4 (r 107)) [{:duty 3}] sq-chorus2a
         (loop1 2 (r 107)) (take 98 sq-chorus2a)))

(def sq1-chorus3-1
  (mapcat (fn [[l p]] (swell-lead3 l p))
         [[14 74] [13 73] [13 74] [14 74]
          [14 69] [13 68] [13 69] [14 69]
          [27 66] [27 66] [13 66] [13 63] [27 62]
          [14 63] [13 62] [13 63] [14 65]
          [13 67] [13 66] [14 67] [13 69]
          [14 67] [17 69] [23 70] [26 69] [27 67]]))

(def sq1-chorus3-2
  (mapcat (fn [[l p]] (swell-lead3 l p))
         [[14 74] [13 73] [13 74] [14 74]
          [14 69] [13 68] [13 69] [14 69]
          [27 66] [27 66] [40 66] [6 67] [7 69] [54 67] [53 63]
          [27 67] [27 69] [26 70] [26 67]]))

(def sq1-chorus3-3
  (mapcat (fn [[l p]] (swell-lead3 l p))
         [[27 69] [27 69] [13 69] [13 67] [27 66]
          [14 67] [13 66] [13 63] [14 62] [53 60]
          [27 60] [27 67] [26 66] [27 63]]))

(def sq1-chorus3-4
  (mapcat (fn [[l p]] (swell-lead3 l p))
         [[54 160] [13 66] [13 67] [14 66] [13 67]
          [21 69] [6 160] [27 69] [5 66] [4 67] [4 66] [5 67] [4 66] [4 67] [27 66]
          [54 160] [13 67] [13 69] [14 67] [13 69]
          [21 70] [6 160] [27 70] [5 67] [4 69] [4 67] [5 69] [4 67] [4 69] [27 67]
          [54 160] [13 66] [13 67] [14 66] [13 67]
          [21 69] [6 160] [27 69] [5 66] [4 67] [4 66] [5 67] [4 66] [4 67] [27 66]
          [27 67] [27 66] [40 63] [13 62]
          [7 60] [7 60] [6 60] [7 60] [7 67] [7 67] [6 67] [7 67]
          [7 66] [6 66] [6 66] [7 66] [7 63] [7 63] [6 63] [7 63]
          [14 62] [13 63] [70 62] [10 160]]))

(def sq1-chorus3-5
  (concat
    (mapcat (fn [[l p]] (swell-lead3 l p))
         [[24 66] [3 160] [27 66] [13 66] [13 63] [27 62]
          [14 63] [13 62] [13 60] [14 62] [4 60] [4 62] [27 60]])
     (release 17 60)
     (mapcat (fn [[l p]] (swell-lead3 l p))
         [[7 60] [7 60] [6 60] [7 60] [7 62] [7 62] [6 62] [7 62]
          [7 63] [6 63] [6 63] [7 63] [7 66] [7 66] [6 66] [7 66]
          [14 62] [13 63] [42 62]])
     (release 24 62)))

(def sq2-chorus3
  (concat [{:duty 1}]
     (mapcat (fn [[l p]] (swell-lead l p))
         [[27 62] [27 64] [26 65] [27 70]])
   (loop1 3
       (mapcat (fn [[l p]] (power-chord-5th l p))
         [[54 45] [107 42] [26 160] [8 45] [9 42] [10 45]
          [54 46] [107 43] [53 160]]))
     (mapcat (fn [[l p]] (power-chord-5th l p))
         [[54 45] [107 42] [26 160] [8 45] [9 42] [10 45]
          [54 46] [53 43]])
     (swell-lead 27 75) (swell-lead 13 75) (swell-lead 14 74)
     (swell-lead 37 73) (release 16 73)))

(def sq2-chorus3a
  (mapcat (fn [[l p]] (power-chord-5th l p))
         [[54 45] [107 42] [26 160] [8 45] [9 42] [10 45]
          [54 46] [107 43] [53 160]]))

(def sq2-chorus3b
  (mapcat (fn [[l p]] (power-chord-5th l p))
         [[54 45] [107 42] [26 160] [8 45] [9 42] [10 45]
          [54 46] [53 43]]))

(def sq2-chorus3c
  (concat
     (swell-lead 27 75) (swell-lead 13 75) (swell-lead 14 74)
     (swell-lead 37 73) (release 16 73)))

(def p2-chorus3a
  (concat
     (mapcat (fn [[l p]] (swell-lead l p))
         [[27 70] [72 69] [8 160] [27 74] [27 72] [26 69] [27 72]
          [14 70] [13 72] [14 70] [13 72]])
     (mapcat (fn [[l p]] (swell-lead l p))
         [[14 70] [13 72] [14 70] [13 72] [27 70]])
     (slide 72 74 16) (v 11 74) (swell-lead 26 72)
     (swell-lead 27 70) (swell-lead 14 69) (swell-lead 13 70)
     (swell-lead 54 69) (release 26 69)
     (slide 72 74 12) (swell-lead 41 74) (swell-lead 40 69)
     (swell-lead 6 70) (swell-lead 7 72)
     (swell-lead 54 70) (release 26 70) (r 29)
     (swell-lead 27 75) (swell-lead 13 75) (swell-lead 14 74)
     (swell-lead 33 73) (release 20 73)))

(def p2-chorus3b
  (mapcat (fn [[l p]] (swell-lead l p))
         [[14 78] [13 77] [27 78] [13 74] [13 73] [27 74]
          [27 69] [27 69] [40 69] [6 70] [7 72] [14 70]
          [13 69] [13 70] [14 72] [13 74] [13 72] [14 70]
          [13 72] [14 70] [13 72] [27 74] [26 72] [27 70]
          [14 78] [13 77] [27 78] [13 74] [13 73] [27 74]
          [27 69] [27 69] [40 69] [6 70] [7 72] [134 70]
          [27 67] [26 66] [27 63] [14 62] [13 63] [40 62]]))

(def p2-chorus3
  (concat [{:duty 3}] (r 107)
     p2-chorus3a p2-chorus3b (r 50)
     (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[27 69] [27 69] [13 69] [13 67] [27 66]
          [14 67] [13 66] [13 63] [14 62] [53 60]
          [27 60] [27 67] [26 66] [13 63]])
     [{:volume 6}] (slide 72 74 12) (v 42 74)
     (slide 67 69 12) (v 52 69) [[96 160]]
     (slide 73 75 12) (v 42 75)
     (slide 68 70 12) (v 52 70) [[96 160]]
     (slide 72 74 12) (v 42 74)
     (slide 67 69 12) (v 82 69) [[10 160]]
     (mapcat (fn [[l p]] (swell-lead l p))
         [[40 69] [6 70] [7 72] [88 70] [52 160]
          [27 70] [26 69] [27 67] [14 66] [14 67] [67 69]])
     (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[24 66] [3 160] [27 66] [13 66] [13 63] [27 62]
          [14 63] [13 62] [13 60] [14 62] [4 60] [4 62] [27 60]])
     (release 17 60)
     (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[7 60] [7 60] [6 60] [7 60] [7 62] [7 62] [6 62] [7 62]
          [7 63] [6 63] [6 63] [7 63] [7 66] [7 66] [6 66] [7 66]
          [14 62] [13 63] [42 62]])
     (release 24 62)))

(def dpcm-intro
  (concat
  (loop1 4
     [{:sample "ride" :length 158} {:rest 29}
      {:sample "ride" :length 27}
      {:sample "ride" :length 158} {:rest 56}])
     (map (fn [l] {:sample "soft-ride" :length l})
       [107 54 26 27 54 53 54 53])))

(def dpcm-verse2
  (concat
  (loop1 7
       [{:sample "ld-kick-ride" :length 27}
        {:sample "soft-ride" :length 27}
        {:sample "snare" :length 11} {:rest 15}
        {:sample "soft-ride" :length 17}
        {:sample "soft-ride" :length 10}
        {:sample "ld-kick-ride" :length 27}
        {:sample "soft-ride" :length 27}
        {:sample "snare" :length 11} {:rest 15}
        {:sample "soft-ride" :length 14}
        {:sample "soft-ride" :length 13}])
  [{:sample "ld-kick-crash" :length 40} {:rest 67}
      {:sample "kick-ride" :length 40} {:rest 14}
      {:sample "kick-ride" :length 39} {:rest 14}]))

(def noise-verse1
  (loop1 8
     (concat
       (ride 54) (ride 43) (ride 10)
       (ride 27) (ride 53) (ride 27))))

(def noise-verse2
  (concat
    (loop1 7
       (concat
         (kick 27) (ride 27) (snare 26) (ride 17) (ride 10)
         (kick 27) (ride 27) (snare 26) (ride 27)))
     noise-sweep))

(def noise-chorus
  (concat (loop1 3 noise-chorus1) noise-chorus2 (loop1 3 noise-chorus1)
      (loop1 8 [{:length 24 :volume 0 :pitch 0}]) [{:length 22 :volume 0 :pitch 0}]))


;; chorus 2

(play
  {:square1
   (concat [{:duty 1}]
     (r 107) sq1-chorus2)
   :square2
   (concat (r 107)
   (loop1 4
       (mapcat (fn [[l p]] (power-chord-5th l p))
         [[54 45] [107 42] [26 160] [8 45] [9 42] [10 45]
          [54 46] [107 43] [53 160]])))
   :triangle
   (concat
   [[26 50] [27 160] [26 53] [27 55]] tri-chorus)
   :dpcm
   (concat
   [{:sample "kick-ride" :length 40} {:rest 14}
      {:sample "kick-ride" :length 39} {:rest 14}]
     (loop1 7 dpcm-chorus))
   :p1
   (concat
      [{:duty 3}]
     (r 107)
     (loop1 4
       (mapcat (fn [[l p]] (low-pulse l p))
         [[54 38] [53 33] [80 26] [8 38] [10 33]
          [9 38] [54 39] [53 34] [107 27]])))
   :p2 (concat (r 107) p2-chorus2)
   :noise
   (concat [{:length 32 :volume 0 :pitch 0}] (drop 1 noise-sweep)
     (loop1 3 noise-chorus) noise-chorus2 (loop1 3 noise-chorus))})

;; chorus 3

(play
  {:square1
   (concat [{:duty 1}] (r 107)
     (loop1 2 (concat
       sq1-chorus3-1 sq1-chorus3-2))
     (swell-lead 14 66) (swell-lead 13 67) (swell-lead 27 69) (release 10 69)
    (r 43) sq1-chorus3-3 sq1-chorus3-4 sq1-chorus3-5)
   :square2
   (concat sq2-chorus3 (loop1 2 sq2-chorus3a) sq2-chorus3b sq2-chorus3c)
   :triangle
   (concat
   [[26 50] [27 160] [26 53] [27 55]] (loop1 2 tri-chorus))
   :dpcm
   (concat
   [{:sample "kick-ride" :length 40} {:rest 14}
      {:sample "kick-ride" :length 39} {:rest 14}]
     (loop1 16 dpcm-chorus))
   :p1
   (concat
      [{:duty 3}]
     (r 107)
     (loop1 8
       (mapcat (fn [[l p]] (low-pulse l p))
         [[54 38] [53 33] [80 26] [8 38] [10 33]
          [9 38] [54 39] [53 34] [107 27]])))
   :p2 p2-chorus3
   :noise
   (concat [{:length 32 :volume 0 :pitch 0}] (drop 1 noise-sweep)
     (loop1 3 noise-chorus) noise-chorus2 (loop1 8 noise-chorus))})

(play
  {:square1 (concat (r 27) sq1-verse1)
   :triangle tri-verse1
   :dpcm (concat [{:rest 27}] dpcm-verse1 dpcm-verse2)
   :saw
   (concat (r 27)
     (mapcat (fn [[l p]] (swell-lead l p))
         [[27 160] [27 62] [27 62] [26 70] [27 67] [54 65] [54 63] [134 62]
          [80 160] [27 62] [27 62] [26 70] [40 67]
          [6 67] [7 67] [6 67] [7 67] [6 67] [7 67] [6 67] [6 67] [54 65]
          [54 70] [90 72] [13 70] [14 69] [107 70]
          [27 67] [54 65] [54 63] [134 62]
          [107 160] [54 65] [107 67] [107 65]
          [27 63] [54 62] [26 60] [107 58]
          [81 55] [14 53] [13 51] [107 53] [107 160]
          [107 58] [81 55] [14 53] [13 51] [107 53] [107 160]
          [107 58] [80 60] [14 58] [13 57] [107 58]
          [27 53] [26 55] [26 58] [27 60]
          [107 62] [80 60] [13 62] [14 60] [107 58]]))})

(def saw-verse
  (mapcat (fn [[l p]] (swell-lead l p))
         [[27 160] [27 62] [27 62] [26 70] [27 67] [54 65] [54 63] [134 62]
          [80 160] [27 62] [27 62] [26 70] [40 67]
          [13 67] [14 67] [13 67] [14 67] [54 65]
          [54 70] [90 72] [13 70] [14 69] [107 70]
          [27 67] [54 65] [54 63] [134 62]
          [107 160] [54 65] [107 67] [107 65]
          [27 63] [54 62] [26 60] [107 58]
          [81 55] [14 53] [13 51] [107 53] [107 160]
          [107 58] [81 55] [14 53] [13 51] [107 53] [107 160]
          [107 58] [80 60] [14 58] [13 57] [107 58]
          [27 53] [26 55] [26 58] [27 60]
          [107 62] [80 60] [13 62] [14 60] [107 58]]))

(+ 107 27)

(def missing-sq
  (concat
       p2-chorus3a p2-chorus3b (r 50)
     (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[27 69] [27 69] [13 69] [13 67] [27 66]
          [14 67] [13 66] [13 63] [14 62] [53 60]
          [27 60] [27 67] [26 66] [13 63]])))



(play
  {:square1
   (concat
     (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[27 69] [27 69] [13 69] [13 67] [27 66]
          [14 67] [13 66] [13 63] [14 62] [53 60]
          [27 60] [27 67] [26 66] [48 63]])
     (loop1 2
       (concat (r 54)
     (mapcat (fn [[l p]] (swell-lead l p))
         [[27 66] [27 66] [13 66] [13 63] [27 62]
          [14 63] [13 62] [13 60] [14 62] [54 60]
          [54 160] [37 63] [6 62] [7 60] [54 62]]))))
   :triangle
   (concat (loop1 3 (r 107)) (r 74)
   (loop1 2 (concat
     (slide 62 74 12) (v 41 74) (slide 74 69 6) (v 35 69) [[5 67] [5 69]]
     (v 57 70) (v 51 67) (r 36) (v 27 67) (v 26 66) (v 28 63) (r 104))))})

(save-nsf "mouse.nsf"
  {:square1
   (concat (loop1 5 (r 64)) [{:duty 0}] sq1-intro (r 114)
     (loop2 2
     (concat
     (loop1 32 (r 107))
     (loop1 4
       (mapcat (fn [[l p]] (power-chord-5th l p))
         [[54 45] [107 42] [26 160] [8 45] [9 42] [10 45]
          [54 46] [107 43] [53 160]]))))
     (loop1 32 (r 107)) missing-sq
     [{:duty 1 :volume 4}]
     (loop1 11 (r 107))
         (v 27 75) (v 13 75) (v 14 74) (v 54 73)
     (r 214)  (r 107) (v 27 75) (v 13 75) (v 14 74) (v 54 73))
   :square2
   (concat
     (loop1 4
       (mapcat (fn [[l p]] (power-chord-5th l p))
         [[54 45] [107 42] [26 160] [8 45] [9 42] [10 45]
          [54 46] [107 43] [53 160]]))
     (mapcat (fn [[l p]] (power-chord-5th l p))
         [[54 45] [107 42] [26 160] [8 45] [9 42] [10 45]
          [54 46] [107 43] [26 160]])
    (loop1 31 (r 107)) (r 27) sq1-intro
    (loop1 33 (r 107)) (r 7) [{:duty 1}] sq1-chorus2
     (loop1 31 (r 107))
     (concat sq2-chorus3 (loop1 2 sq2-chorus3a) sq2-chorus3b sq2-chorus3c)
     (loop1 4 (r 107)) (r 57)
     (loop1 2
       (concat (r 54)
     (mapcat (fn [[l p]] (swell-lead l p))
         [[27 66] [27 66] [13 66] [13 63] [27 62]
          [14 63] [13 62] [13 60] [14 62] [54 60]
          [54 160] [37 63] [6 62] [7 60] [54 62]]))))
   :p1
   (concat [{:duty 3}]
     (loop1 4
       (mapcat (fn [[l p]] (low-pulse l p))
         [[54 38] [53 33] [80 26] [8 38] [10 33]
          [9 38] [54 39] [53 34] [107 27]]))
     (mapcat (fn [[l p]] (low-pulse l p))
         [[54 38] [53 33] [80 26] [8 38] [10 33]
          [9 38] [54 39] [53 34] [54 27] [53 29]])
     (loop2 3
     (concat
     sq1-verse1
     (loop1 4
       (mapcat (fn [[l p]] (low-pulse l p))
         [[54 38] [53 33] [80 26] [8 38] [10 33]
          [9 38] [54 39] [53 34] [107 27]]))))
     (loop1 5
       (mapcat (fn [[l p]] (low-pulse l p))
         [[54 38] [53 33] [80 26] [8 38] [10 33]
          [9 38] [54 39] [53 34] [107 27]])))
   :p2 (concat (loop1 5 (r 64)) (r 12) [{:duty 3}] sq1-intro-echo
         (loop1 32 (r 107)) (r 6) sq1-intro-echo
         (loop1 33 (r 107)) p2-chorus2
         (loop1 52 (r 107))
         [{:volume 6}] (slide 72 74 12) (v 42 74)
     (slide 67 69 12) (v 52 69) [[96 160]]
     (slide 73 75 12) (v 42 75)
     (slide 68 70 12) (v 52 70) [[96 160]]
     (slide 72 74 12) (v 42 74)
     (slide 67 69 12) (v 82 69) [[10 160]]
     (mapcat (fn [[l p]] (swell-lead l p))
         [[40 69] [6 70] [7 72] [88 70] [52 160]
          [27 70] [26 69] [27 67] [14 66] [14 67] [67 69]])
     (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[24 66] [3 160] [27 66] [13 66] [13 63] [27 62]
          [14 63] [13 62] [13 60] [14 62] [4 60] [4 62] [27 60]])
     (release 17 60)
     (mapcat (fn [[l p]] (swell-lead-echo l p))
         [[7 60] [7 60] [6 60] [7 60] [7 62] [7 62] [6 62] [7 62]
          [7 63] [6 63] [6 63] [7 63] [7 66] [7 66] [6 66] [7 66]
          [14 62] [13 63] [42 62]])
     (release 24 62)
         (loop1 7 (r 107)) (r 22) [{:volume 2}] [[83 26]])
   :triangle
   (concat
     (loop1 132 (r 16)) tri-verse1 [[107 160]] tri-chorus
      tri-verse1 [[107 160]] tri-chorus
      tri-verse1 [[107 160]] tri-chorus [[28 160]] tri-chorus
     (r 140)
      (loop1 2 (concat
     (slide 62 74 12) (v 41 74) (slide 74 69 6) (v 35 69) [[5 67] [5 69]]
     (v 57 70) (v 51 67) (r 36) (v 27 67) (v 26 66) (v 28 63) (r 104))))
   :noise
   (concat
     (loop1 132 [{:length 16 :volume 0 :pitch 0}])
     [{:length 28 :volume 0 :pitch 0}]
     noise-verse1 noise-verse2 noise-chorus
     noise-verse1 noise-verse2 noise-chorus
     noise-verse1 noise-verse2 noise-chorus)
   :dpcm
   (concat
     dpcm-intro
     (loop2 3
       (concat dpcm-verse1 dpcm-verse2
         (loop1 7 dpcm-chorus)
         [{:rest 214}]))
     (loop1 7 dpcm-chorus))
   :saw
   (concat
     (loop1 116 (r 107)) saw-verse (r 107)
   (loop1 2 (concat
       sq1-chorus3-1 sq1-chorus3-2))
     (swell-lead 14 66) (swell-lead 13 67) (swell-lead 27 69) (release 10 69)
    (r 43) sq1-chorus3-3 sq1-chorus3-4 sq1-chorus3-5
     (r 66)
     (loop1 2
       (concat
     (mapcat (fn [[l p]] (swell-lead l p))
         [[40 69] [6 70] [7 72] [88 70] [52 160]
          [27 70] [26 69] [27 67] [14 66] [14 67] [43 69]])
       (release 24 69) [[60 160]])))})

(play
  {:triangle
   (loop1 2
   (concat
     (slide 62 74 12) (v 41 74) (slide 74 69 6) (v 35 69) [[5 67] [5 69]]
     (v 57 70) (v 51 67) (r 36) (v 27 67) (v 26 66) (v 28 63) (r 104)))})

(* 13 8)
