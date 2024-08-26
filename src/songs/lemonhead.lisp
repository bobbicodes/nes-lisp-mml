(defn pl
  "Guitar pluck"
  [length pitch]
  (let [vol-env [5 5 5 5 5 4 4 4 4 3]]
    (cond
      (< 25 length)
      [{:length 1 :duty 0 :volume 6 :pitch pitch}
       {:envelope vol-env :length 24 :pitch pitch}
       {:envelope [3] :length (- length 25) :pitch pitch}]
      (= length 1)
      [{:length 1 :duty 0 :volume 6 :pitch pitch}]
      :else
      [{:length 1 :duty 0 :volume 6 :pitch pitch}
       {:duty 1 :envelope vol-env :length (dec length) :pitch pitch}])))

(defn po
  "Guitar pull-off."
  [length pitch]
  (let [vol-env [3 3 3 3 3 3 3 2]]
    (cond
      (< 24 length)
      [{:duty 1 :envelope vol-env :length 24 :pitch pitch}
       {:envelope [2] :length (- length 24) :pitch pitch}]
      (= length 1)
      [{:length 1 :duty 1 :volume 3 :pitch pitch}]
      :else
      [{:duty 1 :envelope vol-env :length length :pitch pitch}])))

(def trill
  [{:volume 7 :length 1 :pitch 61 :duty 0}
   {:volume 6 :length 4 :pitch 61 :duty 1}
   {:volume 5 :length 4 :pitch 62}
   {:volume 4 :length 4 :pitch 61}
   {:volume 3 :length 4 :pitch 62}
   {:volume 2 :length 4 :pitch 61}
   {:volume 2 :length 4 :pitch 62}
   {:volume 2 :length 4 :pitch 61}
   {:volume 2 :length 3 :pitch 62}])

(def arp1
  [{:volume 7 :length 1 :pitch 57 :duty 0}
   {:volume 6 :length 1 :pitch 57 :duty 1}
   {:volume 6 :length 1 :pitch 64}
   {:volume 6 :length 1 :pitch 64}
   {:volume 5 :length 1 :pitch 57 :duty 3}
   {:volume 5 :length 1 :pitch 57}
   {:volume 5 :length 1 :pitch 69 :duty 0}
   {:volume 5 :length 1 :pitch 69}
   {:volume 4 :length 1 :pitch 57 :duty 3}
   {:volume 4 :length 1 :pitch 57}
   {:volume 4 :length 1 :pitch 64 :duty 0}
   {:volume 4 :length 1 :pitch 64}
   {:volume 4 :length 1 :pitch 57 :duty 3}
   {:volume 4 :length 1 :pitch 57}
   {:volume 4 :length 1 :pitch 69 :duty 0}
   {:volume 4 :length 1 :pitch 69}])

(def phrase1
  (concat
     (pl 16 70) (po 16 69) (po 16 67) (r 16)
     (pl 16 67) (po 16 65) (po 16 64) (r 16)
     (pl 27 62) (r 5) trill (pl 48 57) (r 16)))

(def phrase2
  (concat
    (pl 16 70) (po 16 69) (po 16 67) (r 16)
    (pl 16 67) (po 16 65) (po 16 64) (r 16)
    (pl 27 62) (r 5) trill (pl 16 66)
    (po 16 67) (po 16 66) (po 20 62) 
    [{:volume 2 :vibrato 2 :length 30 :pitch 62}]
    [{:volume 1 :length 46 :pitch 62}]
    [{:vibrato 0}]))

(def phrase3
  (concat (po 60 45) (r 4) (po 60 50) (r 4)
    (po 60 40) (r 4) (po 16 49) (po 16 61)
    arp1 (po 16 69)))

(def phrase3b
  (concat
    (pl 16 45) (po 16 57) (po 16 61) (po 16 64)
    (pl 16 50) (po 16 62) (po 16 67) (po 16 65)
    (pl 60 40) (r 4) (pl 16 49) (pl 16 61)
    arp1 (pl 16 69)))

(def phrase4
  (concat (pl 60 45) (r 4) (pl 60 50) (r 4)
    (pl 60 40) (r 4) (pl 128 50) (r 4)))

(def phrase5
  (concat [{:volume 2 :vibrato 2}]
    (loop1 3 [{:length 64 :pitch 45} {:length 64 :pitch 50}])
    [{:length 64 :pitch 45} {:length 16 :pitch 50}] (r 48)
    [{:vibrato 0}]))

(def phrase6
  (concat (pl 16 52) (po 16 57) (pl 16 61)
    (po 16 57) (pl 16 66) (po 16 67) (pl 5 66)
    (po 5 67) (po 6 66) (po 16 62)))

(def phrase7
  (concat (pl 16 52) (po 16 57) (pl 16 61)
    (po 16 64) (pl 16 62) (r 16)
    (pl 8 50) (po 8 52) (pl 16 55)))

(def phrase8
  (concat
     (pl 32 45) (pl 16 57) (pl 8 45) (pl 8 57)
     (pl 8 48) (pl 8 60) (pl 16 48) (pl 16 60) (pl 8 55) (pl 8 60)
     (pl 8 50) (pl 8 57) (pl 16 50) (pl 16 62) (pl 16 57)
     (pl 16 43)
    [{:vibrato 2 :volume 3 :length 16 :pitch 43}]
     [{:volume 2 :length 16 :pitch 43}]
     [{:volume 1 :length 16 :pitch 43}]
    [{:vibrato 0}]))

(def phrase9
  (concat
     (pl 32 45) (pl 16 57) (pl 8 45) (pl 8 57)
     (pl 8 48) (pl 8 60) (pl 16 48) (pl 16 60) (pl 8 55) (pl 8 60)
     (pl 8 50) (pl 8 57) (pl 16 50) (pl 16 62) (pl 16 57)
     (pl 16 49)
    [{:vibrato 2 :volume 3 :length 16 :pitch 49}]
     [{:volume 2 :length 32 :pitch 49}]
    [{:vibrato 0}]))

(def phrase10
  (concat
     (pl 8 57) (po 8 59) (po 16 57) (pl 16 64) (pl 8 62) (po 8 61)
     (pl 8 60) (po 8 62) (po 16 60) (pl 16 65) (po 8 64) (po 8 63)
     (pl 16 62) (pl 16 64) (r 16) (pl 16 62) (r 16) (pl 16 55)
     (pl 8 62) (po 8 55) (pl 8 59) (po 8 55)))

(def phrase11
  (concat
     (pl 8 57) (po 8 59) (po 16 57) (pl 16 64) (r 32)
    (pl 16 60) (pl 16 67) (pl 8 60) (po 8 61)
    (pl 16 62) (pl 16 66) (pl 16 62) (po 16 61)
    [{:volume 2 :vibrato 2 :length 24 :pitch 61}]
     [{:volume 1 :length 8 :pitch 61}]
    [{:vibrato 0}]))

(def phrase12
  (concat
     (pl 24 42) (pl 8 49) (pl 16 57) (po 16 49)
     (pl 24 42) (pl 8 52) (pl 16 54) (po 16 57)
     (pl 24 49) (pl 8 42) (pl 16 44) (pl 16 49)
     (pl 24 44) (pl 8 49) (pl 16 44) (pl 16 49)))

(def phrase13
  (concat
     (pl 24 42) (pl 8 49) (pl 16 57) (po 16 49)
     (pl 24 42) (pl 8 52) (pl 16 54) (po 16 57)
     (pl 24 56) (pl 8 42) (pl 16 44) (pl 16 49)
     (pl 24 52) (pl 8 49) (pl 16 51) (pl 8 45) (po 8 46)
     (pl 32 47) (pl 16 59) (pl 8 47) (pl 8 59) (pl 8 47) (pl 8 59)
     (pl 16 47) (pl 16 59) (pl 8 42) (pl 8 43)
     (pl 32 44) (pl 32 56) (pl 16 56) (pl 16 57) (pl 16 59) (pl 16 60)))

(def phrase14
  (concat (pl 32 61) (r 16) (pl 16 66) (pl 16 69) (pl 16 69) (pl 16 66) (pl 16 69)
              (pl 16 68) (pl 16 61) (pl 8 54) (po 8 56) (pl 8 59) (po 8 61)
              (pl 16 64) (pl 16 64) (pl 8 61) (pl 8 64) (pl 16 61)))

(def phrase15
  (concat (pl 32 54) (pl 8 59) (po 8 61) (pl 8 64) (po 8 66)
              (pl 8 69) (po 8 71) (po 16 69) (pl 16 66) (pl 16 69)
              (pl 16 73) (r 16) (pl 8 73) (po 8 74) (po 8 73) (po 8 74)
              (pl 16 76) (pl 5 74) (po 5 76) (po 6 74) (pl 16 73) (pl 16 69)))

(def phrase16
  (concat (pl 32 49) (pl 16 64) (pl 8 56) (pl 8 64) (pl 8 56) (pl 8 64)
     (pl 16 49) (pl 24 64) (pl 8 64) (pl 8 56) (pl 8 64) (pl 16 42)
     (pl 16 44) (po 16 45) (pl 16 47) (po 16 49) (pl 16 51) (pl 16 52)))

(def phrase17
  (concat (pl 32 45) (pl 16 60) (pl 8 52) (pl 8 60) (pl 8 52) (pl 8 60)
     (pl 16 45) (pl 16 52) (pl 16 51) (pl 32 50) (pl 32 57) (pl 16 47)
    (pl 16 50) (pl 16 55) (pl 16 52) (pl 32 40) (pl 16 43) (pl 8 40)
    (pl 8 43) (pl 16 47) (pl 16 43) (pl 16 47) (pl 32 52) (pl 16 47)
    (pl 16 43) (pl 16 47) (pl 8 47) (pl 8 48) (pl 16 47) (pl 16 43) (pl 16 47)))

(def phrase18
  (concat (pl 24 61) (slide 61.5 68 8)
    [{:volume 4 :vibrato 2 :length 32 :pitch 68}]
     (r 16) (pl 8 61) (slide 61.5 68 8) [{:length 24 :pitch 68}]
     (slide 68 59 8) [{:volume 4 :length 32 :pitch 59}] (r 32)
     (pl 16 64) (po 16 63) (pl 16 59) (po 16 56)
    [{:vibrato 0}]))

(def phrase19
  (concat (pl 24 61) (slide 61.5 68 8)
    [{:volume 4 :vibrato 2 :length 32 :pitch 68}]
     (r 16) (pl 8 61) (slide 61.5 68 8) [{:volume 4 :length 24 :pitch 68}]
     (slide 68 59 8) (r 16) (pl 16 54) (pl 16 56) (po 16 57)
     (pl 16 59) (po 16 61) (pl 16 63) (po 16 64)
    [{:vibrato 0}]))

(def phrase20
  (concat (pl 32 60)
    [{:vibrato 2 :length 32 :pitch 60}]
     [{:length 32 :pitch 60}] (slide 60 62 64)
     [{:length 32 :pitch 62}]
    [{:length 32 :pitch 62}]
     (slide 62 64 32) [{:length 32 :pitch 64}]
    [{:length 32 :pitch 64}]
     [{:length 48 :pitch 59} {:length 48 :pitch 55}]
     [{:length 32 :pitch 55}] (r 64) [{:vibrato 0}]))

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
  (drum length [[10 6] [7 2] [4 1] [3 1] [2 0]]))

(defn snare [length]
  (drum length [[11 8] [9 6] [8 6] [7 6]
                [4 5] [3 5] [2 5] [1 5]]))

(defn hat [length]
  (drum length [[4 3] [3 2] [2 0] [1 0]]))

(defn hat2 [length]
 (drum length [[3 3] [2 2] [1 0] [1 0]]))

(defn slide [from to frames]
  (length-pitch (take frames 
    (if (< to from)
      (map #(vector 1 %) (reverse (range to from (/ (abs (- from to)) frames))))
      (map #(vector 1 %) (range from to (/ (abs (- from to)) frames)))))))

(def drums1
  (concat (kick 24) (hat2 4) (hat2 4) (snare 16) (hat 32)
            (kick 16) (snare 24) (hat2 4) (hat2 4)
            (kick 32) (snare 24) (hat2 4) (hat2 4)
            (kick 16) (kick 16) (snare 16) (hat 16)))

(defn k [l p]
  (keep
  [[1 (+ p 15)] [1 (+ p 12)]
   [1 (+ p 7)] [1 (+ p 5)] [12 p]
   (when (< 16 l) [(- l 16) 160])]))

(defn s [l p]
  [[1 (+ 12 p)] [3 p] [(- l 4) 160]])

(def bass1
  (concat (k 32 49) (s 48 76) (k 16 49) (s 32 76)
     (k 32 47) (s 32 75) (k 16 47) (k 16 47) (s 32 75)))

(def bass2
  (concat (k 32 48) (s 48 72) (k 16 48) (s 32 72)
     (k 32 50) (s 32 74) (k 16 50) (k 16 50) (s 32 74)
    (k 32 52) (s 48 76) (k 16 47) (s 32 76)
     (k 32 52) (s 32 76) (k 16 47) (k 16 47) (s 32 76)))

(def phrase21
  (concat (pl 32 45) (pl 16 60) (pl 8 52) (pl 8 60) (pl 8 52) (pl 8 60)
     (pl 16 45) (pl 16 52) (pl 16 51) (pl 32 50) (r 32)
       (pl 8 42) (pl 8 43) (po 16 42) (pl 8 42) (pl 8 43) (po 16 42)
       (pl 32 40) (slide 40 52 16) [[16 52]]
       (pl 8 55) (po 8 57) (pl 8 55) (po 8 52) (pl 16 55) (po 16 52)))

(def phrase22
  (concat (pl 32 60)
    [{:vibrato 2 :length 32 :pitch 60}]
     [{:length 32 :pitch 60}] (slide 60 62 64)
     [{:length 32 :pitch 62}]
    [{:length 32 :pitch 62}]
     (slide 62 64 32) [{:length 32 :pitch 64}]
    [{:length 32 :pitch 64}]
     [{:length 48 :pitch 59} {:length 48 :pitch 55}]
     [{:length 32 :pitch 55}] (r 64) [{:vibrato 0}]))

(play
  {:square1 (concat (loop1 3 phrase1) phrase2
              (r 64) (loop1 3 phrase6) phrase7
              (loop1 3 phrase10) phrase11 (r 96)
              (loop1 2 (concat phrase14 phrase15))
              (r 256) (loop1 3 phrase18)
              phrase19 (loop1 3 phrase20)
              (pl 32 60)
              [{:vibrato 2 :length 32 :pitch 60}]
              [{:length 32 :pitch 60}] (slide 60 62 64)
              (r 224) (loop1 3 phrase18)
              phrase19 (loop1 3 phrase20)
              (pl 32 60)
              [{:vibrato 2 :length 32 :pitch 60}]
              [{:length 32 :pitch 60}] (slide 60 62 64)
              (r 256) (r 72) (loop1 3 phrase1) phrase2)
   :square2 (concat (loop1 2 phrase3) phrase3b phrase4
              (r 76) phrase5 (loop1 3 phrase8) phrase9 (r 64)
              (loop1 3 phrase12) phrase13
              (loop2 2
                (concat
              (loop1 4 phrase16) (loop1 3 phrase17)
              phrase21))
              (r 32)
              (pl 8 43) (pl 16 45) (r 8) (pl 8 43) (pl 32 45)
         (loop1 2 phrase3) phrase3b phrase4)
   :triangle (concat (loop1 15 (r 256)) (r 208)
               (loop1 4 bass1) (loop1 3 bass2)
               (k 32 48) (s 48 72) (k 16 48) (s 32 72)
               (k 32 50) (r 224)
     (loop1 4 bass1) (loop1 3 bass2)
     (k 32 48) (s 48 72) (k 16 48) (s 32 72)
     (k 32 50))
   :noise (concat [{:volume 0 :length 2048 :pitch 0}
                   {:volume 0 :length 1000 :pitch 0}
                   {:volume 0 :length 744 :pitch 0}]
            (loop1 10 drums1)
            (kick 24) (hat2 4) (hat2 4) (snare 16) (hat 32)
            (kick 16) (snare 24) (hat2 4) (hat2 4)
            (kick 32)
            {:volume 0 :length 224 :pitch 0}
     (loop1 10 drums1)
            (kick 24) (hat2 4) (hat2 4) (snare 16) (hat 32)
            (kick 16) (snare 24) (hat2 4) (hat2 4)
            (kick 32))})
