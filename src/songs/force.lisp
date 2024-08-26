(defn kick [length]
  [{:volume 13 :pitch 6 :length 1}
   {:volume 8 :pitch 2}
   {:volume 6 :pitch 1}
   {:volume 4 :pitch 1}
   {:volume 3 :pitch 0 :length 4}
   {:volume 0 :pitch 0 :length (- length 8)}])

(defn snare [length]
  [{:volume 14 :pitch 8 :length 1}
   {:volume 12 :pitch 6}
   {:volume 11 :pitch 6}
   {:volume 10 :pitch 6}
   {:volume 9 :pitch 6}
   {:envelope [8 6 5 4 3 3 2]
    :pitch 5 :length 9}
   {:volume 0 :pitch 0 :length (- length 14)}])

(defn hat [length]
  [{:volume 9 :pitch 4 :length 1}
   {:volume 6 :pitch 2}
   {:volume 3 :pitch 2 :length 2}
   {:volume 2 :pitch 2 :length 10}
   {:volume 0 :pitch 0 :length (- length 14)}])

(def low-pulse-duties
  (concat
    [0 0 0x10 0x10 0x10 0x10 0x20 0x20 0x20 0x20 0x20]
    (repeat 23 0x30)
    (repeat 6 0x40) [0x50]))

(def dpcm-loop
   [{:sample "kick" :length 10} {:rest 30}
    {:sample "snare" :length 7} {:rest 33}
    {:sample "kick" :length 10} {:rest 30}
    {:sample "snare" :length 7} {:rest 33}
    {:sample "kick" :length 10} {:rest 30}
    {:sample "snare" :length 7} {:rest 33}
    {:sample "kick" :length 10} {:rest 30}
    {:sample "snare" :length 7} {:rest 33}
    {:sample "kick" :length 10} {:rest 30}
    {:sample "snare" :length 7} {:rest 33}
    {:sample "kick" :length 10} {:rest 30}
    {:sample "snare" :length 7} {:rest 33}
    {:sample "kick" :length 10} {:rest 30}
    {:rest 40} {:rest 40} {:rest 40}])

(def noise-loop
  (concat
   (loop1 6
   (concat
     (kick 20) (hat 20) (snare 20) (hat 20)))
     {:length 160 :pitch 0 :volume 0}))

(defn bass1 [notes]
  (concat
     [{:envelope [15 14 13 12 11 10 9 8 8 8 8 7 7 6 6
                  5 5 5 5 4]
       :duty low-pulse-duties}]
     notes))

(defn bass2 [notes]
  (concat
     [{:envelope [9 8 7 7 6 6 5]
       :duty low-pulse-duties}]
     notes))

(defn bass3 [notes]
  (concat
     [{:envelope [5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 3]
       :duty 0}]
     notes))

(defn saw1 [notes]
  (concat
     [{:envelope [5 7 9 11 13 15 17 19 21 22 23 23 22 
                  21 20 19 18 17 16 14 13 12 11 10 9 8 7 6 6]}]
     notes))

(defn saw2 [notes]
  (concat
     [{:envelope [5 7 8 9 11 12 12
                  11 10 9 8 7 6 6]}]
     notes))

(def bass-loop
  [[40 40] [40 40] [20 36] [20 36] [40 160]
   [20 40] [20 40] [20 40] [60 35] [20 160] [20 35]
   [40 36] [40 36] [20 33] [20 33] [20 33] [20 36] [20 160] [40 35]])

(defn guitar-pluck [length pitch]
  [{:envelope
    (concat
      [7 7 7 5 5 5 5 5 5 5 5 5 5]
      (repeat 20 4) [3])
    :vibrato 2
    :duty 0
    :length 1 :pitch pitch}
    {:length (dec length) :pitch pitch}])

(defn guitar-pluck-soft [length pitch]
  [{:envelope
    [5 4 4 4 4 3 3 3 3 3 3 3 3 2 2 2 2 2 2 2 2 2 2 1]
    :vibrato 2
    :duty 0
    :length 1 :pitch pitch}
    {:length (dec length) :pitch pitch}])

(def bass-verse
  (concat
     (bass1
     [[40 40] [20 40] [2 52] [8 160] [2 52] [8 160]
      [20 36] [20 36]])
     (bass2 [[17 71] [3 160] [16 67] [4 160]])
     (bass1 [[20 40] [20 40] [4 64] [16 160] [40 35] [20 35]])
     (bass2 [[6 66] [14 160] [6 66] [4 160]])
     (bass1 [[10 35] [40 36] [20 36] [1 160] [4 60] [6 160] [4 60] [5 160]
             [20 33] [20 33] [20 33] [20 36] [20 160] [60 35] [80 160]])))

(def r1 [1 160])
(def r2 [2 160])
(def r20 [20 160])
(def r40 [40 160])

(def bass-chorus
  [[40 28] r20 [20 28] [20 31] [20 28] [20 31] [20 28]
   [20 33] [20 33] [20 33] [40 35] [20 35] [20 35] [20 31]
   [40 28] r20 [20 28] [20 31] [20 28] [20 31] [20 28]
   [20 38] [20 38] [20 38] [40 40] [60 160]])

(def bass-chorus-5th
  [[40 35] r20 [20 35] [20 38] [20 35] [20 38] [20 35]
   [20 40] [20 40] [20 40] [40 42] [20 42] [20 42] [20 38]
   [40 35] r20 [20 35] [20 38] [20 35] [20 38] [20 35]
   [20 45] [20 45] [20 45] [40 47] [60 160]])

(def tri-verse1
  (concat
     [{:vibrato 2}]
     [[38 64] [2 160] [20 64] [20 62] [20 64] [20 60] [40 160]
      [20 59] [20 67] [20 69] [40 71]]
     (slide 76 78 10) [[90 78]] (slide 78 71 14) [[4 71] [22 160]]
     (slide 78 79 10)
     [[10 79] [20 78] [20 76]
      [40 75] [20 71] [20 69] [20 71]
      [20 75] [20 71] [20 69] [20 66] [40 64]]))

(def tri-chorus
  (concat [{:vibrato 2}]
     (slide 74 76 10) [[29 76] r1 [18 76] r2]
     (slide 74 76 10) [[70 76]]
     (slide 76 52 20) [r40] (slide 74 76 10)
     [[9 76] r1 [18 76] r2 [18 76] r2]
     (slide 69 71 10)
     [[35 71] r1 [17 74] r2]
     (slide 74 76 10) [[29 76] r1 [18 76] r2]
     (slide 74 76 10) [[70 76]]
     (slide 76 74 12) [[8 74] [100 160]]
     [[10 83] [9 81] r1 [9 79] r1 [12 76]]
     (slide 76 79 10) [[9 79] [80 76]]
     (slide 76 52 20) [[100 160] [7 74]]
     (slide 74 71 16) [[17 71]]
     [[7 74]] (slide 74 71 16) [[17 71] [40 74]]
     (slide 74 76 10) [[72 76] [20 160]]
     (slide 69 71 12) [[24 71] [56 69] [40 160]]
     (slide 69 71 12) [[12 71] [20 69] [30 67]]
     (slide 67 64 10)))

(def p1-intro-verse
  (concat
     (bass1 bass-loop)
     {:volume 4 :duty [0x60]}
     [[78 35] [22 160]]
     (bass1 [[40 28]])
     (loop1 5
     [{:volume 3 :length 20 :pitch 28}])
     (loop1 5
     [{:volume 2 :length 20 :pitch 28}])
     (loop1 4
     [{:volume 1 :length 20 :pitch 28}])
     (loop1 8 (r 40))
     bass-verse))

(def p2-verse
  (concat
     (bass3
     [[40 47] [20 47] [2 59] [8 160] [2 59] [8 160]
      [20 43] [20 43] [14 64] [6 160] [15 59] [5 160]
      [20 47] [20 47] [4 59] [16 160] [40 42] [20 42]
      [4 59] [6 160] [4 59] [6 160] [4 59] [6 160] [4 59] [1 160] [5 42]
      [40 43] [20 43] [4 67] [6 160] [3 67] [7 160]
      [20 40] [20 40] [20 40] [20 43] [20 160] [60 42] [20 160]
      [20 52] [20 52] [20 52]])))

(def saw-verse
  (concat
     (saw1 [[40 40] [20 40] [2 52] [8 160] [2 52] [8 160]
      [20 36] [20 36]])
     (saw2 [[17 71] [3 160] [16 67] [4 160]])
     (saw1 [[20 40] [20 40] [4 64] [16 160] [40 35] [20 35]
            [6 66] [14 160] [6 66] [4 160]
            [10 35] [40 36] [20 36] [1 160] [4 60] [6 160] [4 60] [9 160]
             [20 33] [20 33] [20 33] [20 36] [20 160] [60 35] [16 160]
            [20 35] [20 38] [20 35]])))

(def end-solo1
  [[19 64] [2 160] [8 64] [2 160] [7 64] [17 64] [3 160] [7 64] [2 160] [9 64]
   [1 160] [9 64] [1 160] [10 66] [18 67] [1 160] [19 67] [2 160] [19 66] [4 160]
   [7 66] [6 67] [7 66] [18 64] [2 160] [19 64] [1 160] [18 62] [2 160]
   [7 62] [5 64] [7 62] [1 160] [18 59] [2 160] [19 62] [1 160] [20 59]])

(def end-solo2
  (concat
    [[19 62] [1 160] [19 64] [1 160] [4 67] [3 160] [4 67] [3 160] [4 67] [2 160]
      [10 66] [10 67] [19 69] [1 160] [18 69]]
     (slide 69 71 24)
     [[26 71] [10 160] [5 74] [2 160] [5 74] [2 160] [5 74] [1 160] [9 74] [1 160]
      [9 71] [1 160] [18 79] [2 160] [39 76] [2 160]]
     (slide 76 52 24) [[4 52] [13 160]]))

(def end-solo2b
  (concat
    [[19 62] [1 160] [19 64] [1 160] [4 67] [3 160] [4 67] [3 160] [4 67] [2 160]
      [10 66] [10 67] [19 69] [1 160] [18 69]]
     (slide 69 71 24)
     [[26 71] [3 160]]
     [{:volume 5}]
     [[5 66] [2 160] [5 66] [2 160] [5 66] [1 160] [9 66] [1 160]
      [9 62] [1 160] [18 71] [2 160] [39 67] [8 160]]
     [{:volume 4}]
     (slide 76 52 24) [[4 52] [13 160]]))

(def end-solo3
  (concat
    [[40 52] [16 64]] (slide 64 67 16)
     [[8 67] [7 52] [6 55] [7 64] [19 67] [1 160]]
    [{:envelope [9 7 5]}]
      [[7 52] [6 55] [7 64] [20 67]
      [7 66] [6 67] [7 66] [7 64] [6 66] [7 64]
      [7 62] [6 64] [7 62] [7 60] [6 62] [7 60]
      [7 59] [6 60] [7 59] [7 57] [6 59] [7 57]
      [7 55] [6 57] [7 55] [7 54] [6 55] [7 54]
      [20 52] [20 160] [20 59] [7 52] [2 160] [8 52] [3 160] [9 52]
      [11 55] [18 52] [2 160] [10 52] [11 55] [20 52]]
     (slide 55 57 8) [[11 57] [1 160] [18 57] [2 160] [19 57]]
     (slide 57 59 12) [[46 59]]))

(def end-solo3b
  (concat
    (r 95)
     [[19 71] [20 160] [20 71]
      [7 69] [6 71] [7 69] [7 67] [6 69] [7 67]
      [7 66] [6 67] [7 66] [7 64] [6 66] [7 64]
      [7 62] [6 64] [7 62] [7 60] [6 62] [7 60]
      [7 59] [6 60] [7 59] [7 57] [6 59] [7 57]
      [20 55]]
    (r 140)
    [[18 60] [2 160] [18 60] [2 160] [18 60] [2 160] [56 62]]))

(def sq-chorus1
  (concat
     [[40 64] [20 64] [100 67] [20 66] [20 66] [20 66] [36 67] [20 66]
      [10 67] [10 69] [10 67] [10 66] [30 64]]
     (slide 64 71 10) [[24 71]] (slide 71 64 10) (r 10)
     [[10 64] [10 67] [10 64] [10 160] [10 64] [10 67] [10 64] [10 160]
      [20 69] [20 69] [20 69] [40 71]]
     (slide 71 74 8) [[12 74] r2 [10 74]]
     (slide 74 64 28)
     [[40 64] [20 66] [60 67] [20 69] [20 66] [20 160]
      [19 66] r1 [19 66] r1 [19 67] r1 [19 69] r1 [19 67] r1
      [9 66] [11 67] [20 66]
      [18 52] r2 [9 52] r1 [8 52] r2 [19 52] [20 64] [18 67] r2
      [20 67] [20 66] [20 67] [7 66] [6 67] [7 66] [18 64] r2
      [19 64] r1 [19 62] r1 [7 62] [6 64] [7 62] [18 59] r2
      [20 59] [20 62]]))

(def solo2a
  (concat
     [{:duty [0x30 0x70]
       :volume 5 :vibrato 2}]
     (slide 69 71 8) [[8 71]]
     (slide 71 64 10)
     [[12 64] r2 [32 64]] (slide 64 60 10)
     [[18 60] r2 [20 60] [40 160]]
     (slide 62 64 10)
     [[10 64] r2 [9 64] [10 62] r1
      [10 64] [9 62] r1 [19 59]]
     (slide 69 71 10) [[9 71] r1 [19 71]]
     (slide 69 71 10) [[9 71] r1 [19 71]]
     (slide 71 72 5) [[16 72] r1 [16 72]]
     [[10 72] [10 71] [10 69] [10 71]
      [20 69] [20 71] [20 72] [20 74] [77 71] [23 160]
      [10 69] [10 71] [10 74] [10 71] [21 74]]))

(def solo2b
  (concat
     [{:duty [0x30 0x70]
       :volume 2 :vibrato 2}]
     (r 3)
     (slide 69 71 8) [[8 71]]
     (slide 71 64 10)
     [[12 64] r2 [32 64]] (slide 64 60 10)
     [[18 60] r2 [20 60] [40 160]]
     (slide 62 64 10)
     [[10 64] r2 [9 64] [10 62] r1
      [10 64] [9 62] r1 [12 59]]
     [{:volume 4}]
     (slide 64 66 10) [[9 66] r1 [19 66]]
     (slide 64 66 10) [[9 66] r1 [19 66]]
     (slide 66 67 5) [[16 67] r1 [16 67]]
     [[10 67] [10 66] [10 64] [10 66]
      [20 64] [20 66] [20 67] [20 64] [77 63] [23 160]]))

(def sq1-intro
  (concat
    (guitar-pluck 40 64)
     (guitar-pluck 40 55)
     (guitar-pluck 40 52)))

(def sq1-verse
  (concat
     (guitar-pluck 20 67)
     (guitar-pluck 20 69)
     (guitar-pluck 20 67) [[3 160]]
     (guitar-pluck 27 67)
     (guitar-pluck 8 66) [[1 160]]
     (guitar-pluck 24 66)
     [{:volume 3 :length 13 :pitch 66}
      {:volume 2 :length 17 :pitch 66}]))

(def sq2-intro
  (concat
    (r 20)
     (guitar-pluck 40 59)
     (guitar-pluck 40 59)))

(def sq2-verse
  (concat
    (guitar-pluck 20 64)
     (guitar-pluck 20 66)
     (guitar-pluck 20 64) [[3 160]]
     (guitar-pluck 27 64)
     (guitar-pluck 8 63) [[1 160]]
     (guitar-pluck 24 63)
     [{:volume 3 :length 13 :pitch 63}
      {:volume 2 :length 17 :pitch 63}]))

(def tri-verse2
  (concat
     (slide 79 81 16)
     [[4 81] [1 80] [19 81] [1 80] [19 81] [32 78] [56 79]]
     (slide 79 78 16)
     [[60 76] [20 78] [74 160]
      [20 69] [20 70] [20 71] [20 74]]))

(def sq1-outro
  (concat
     (loop1 8 (r 40)) (r 20)
     (guitar-pluck-soft 20 64)
     (guitar-pluck-soft 20 66)
     (guitar-pluck-soft 20 64)
     (guitar-pluck-soft 20 64)
     (guitar-pluck-soft 20 66) (r 20)
     (guitar-pluck-soft 20 64) (r 20)
     (guitar-pluck-soft 20 63)
     [{:volume 3} [20 63]
      {:volume 2} [12 63]
      {:volume 1} [10 63]]
     (guitar-pluck-soft 40 64)
     (guitar-pluck-soft 40 55)
     (guitar-pluck-soft 60 52)))

(def sq2-outro
  (concat
     (loop1 8 (r 40)) (r 20)
     (guitar-pluck-soft 20 67)
     (guitar-pluck-soft 20 69)
     (guitar-pluck-soft 20 67)
     (guitar-pluck-soft 20 67)
     (guitar-pluck-soft 20 69) (r 20)
     (guitar-pluck-soft 20 67) (r 20)
     (guitar-pluck-soft 20 66)
     [{:volume 3} [20 66]
      {:volume 2} [20 66]
      {:volume 1} [10 66]]
    (r 12)
     (guitar-pluck 40 59)
     (guitar-pluck 60 59)))

(def p2-verse
  (concat
     (bass3
     [[40 47] [20 47] [2 59] [8 160] [2 59] [8 160]
      [20 43] [20 43] [14 64] [6 160] [15 59] [5 160]
      [20 47] [20 47] [4 59] [16 160] [40 42] [20 42]
      [4 59] [6 160] [4 59] [6 160] [4 59] [6 160] [4 59] [1 160] [5 42]
      [40 43] [20 43] [4 67] [6 160] [3 67] [7 160]
      [20 40] [20 40] [20 40] [20 43] [20 160] [60 42] [20 160]
      [20 52] [20 52] [20 52]])))

(play
  {:square1
   (concat
     (loop1 8 (r 40))
     [{:volume 4 :duty 1 :vibrato 2}]
     [[32 67] [8 160] [32 71] [8 160] [18 69] r2 [18 69] r2 [20 71]]
     (slide 71 66 16) (r 24) [[17 66] [3 160] [17 66] r2 [39 66] r2 [18 66] r2]
     (slide 66 67 22) [[200 67] [17 66] [3 160] [17 66] r2 [39 66] r2 [18 66] r2]
     (slide 66 67 22) [[200 67] [17 66] [3 160] [17 66] r2 [39 66] r2 [18 69] r2]
     (slide 66 67 22) [[200 67] [17 66] [3 160] [17 66] r2 [39 66] r2 [18 66] r2]
     (slide 66 67 24)
     [[170 67] [20 69] [20 67] [20 69] [20 71] [20 160]
      [20 69] [10 67]] (slide 67 64 20) [[10 64]]
     [{:duty [0x30 0x70]
       :volume 5 :vibrato 2}]
     end-solo1 end-solo2 end-solo3
     (r 40) sq1-outro)
   :square2
   (concat
     (loop1 48 (r 40))
     [{:volume 3 :vibrato 2 :duty 2}]
     (r 8)
     end-solo1 end-solo2b end-solo3b
     (r 40) sq2-outro)
   :p1
   (concat
   (loop1 6
     (concat (bass1 bass-loop) (r 100)))
     (bass3 [[80 28]]))
   :p2
   (loop1 5
     (bass3
     [[40 47] [20 47] [2 59] [8 160] [2 59] [8 160]
      [20 43] [20 43] [14 64] [6 160] [15 59] [5 160]
      [20 47] [20 47] [4 59] [16 160] [40 42] [20 42]
      [4 59] [6 160] [4 59] [6 160] [4 59] [6 160] [4 59] [1 160] [5 42]
      [40 43] [20 43] [4 67] [6 160] [3 67] [7 160]
      [20 40] [20 40] [20 40] [20 43] [20 160] [60 42] [20 160]
      [20 52] [20 52] [20 52]]))
   :triangle
   (concat
     [{:vibrato 2}]
     [r2 r2 [40 64] r20 [20 64] [20 67] [20 64] [20 67] [20 64]
      [18 69] r2 [18 69] r2 [18 69] [40 71] [18 74] r2 [10 74]]
     (slide 74 62 26)
     [[32 76] [8 160] [32 79] [8 160] [18 78] r2 [18 78] r2 [20 79]]
     (slide 79 74 16) (r 24) [[17 74] [3 160] [17 74] r2 [39 74] r2 [18 74] r2]
     (slide 74 76 22) [[200 76] [17 74] [3 160] [17 74] r2 [39 74] r2 [18 74] r2]
     (slide 74 76 22) [[200 76] [17 71] [3 160] [17 71] r2 [39 71] r2 [18 74] r2]
     (slide 74 76 24) [[200 76] [17 74] [3 160] [17 74] r2 [39 74] r2 [18 74] r2]
     (slide 74 76 24)
     [[170 76] [20 69] [20 67] [20 69] [20 71] [20 160]
      [20 69] [10 67]] (slide 67 64 20) [[10 64]])
   :saw (loop1 5 saw-verse)
   :noise (loop2 6 noise-loop)
   :dpcm (loop1 6 dpcm-loop)})

(play
  {:square1
   (concat
     [{:duty [0x30 0x70]
       :volume 5 :vibrato 2}]
     end-solo1 end-solo2 end-solo3
     (r 40) sq1-outro)
   :square2
   (concat
     [{:volume 3 :vibrato 2 :duty 2}]
     (r 8)
     end-solo1 end-solo2b end-solo3b
     (r 40) sq2-outro)
   :p1
   (concat
     (loop1 2 bass-verse)
     (bass1 bass-loop)
     (r 100) (bass3 [[80 28]]))
   :p2 (loop1 2 p2-verse)
   :saw (loop1 2 saw-verse)
   :noise (loop2 3 noise-loop)
   :dpcm (loop1 3 dpcm-loop)})

(play
  {:square1
  (concat
    (loop1 14 (r 40)) sq1-intro
    (loop1 13 (r 40)) sq1-intro
    (loop1 9 (r 40)) sq1-verse (r 87)
    [{:duty [0x30 0x70]
      :volume 5 :vibrato 2}]
    sq-chorus1 solo2a)
   :square2
   (concat
     (loop1 14 (r 40)) sq2-intro
     (loop1 13 (r 40)) (r 20) sq2-intro
     (loop1 9 (r 40)) (r 20) sq2-verse (r 95)
     [{:duty 2 :volume 2 :vibrato 1}]
     sq-chorus1 solo2b)
   :triangle
   (concat
     (loop1 16 (r 40)) tri-verse1
     (loop1 8 (r 24)) (r 8)
     tri-verse2 tri-chorus
     (loop1 16 (r 40)) tri-verse1)
   :p1
   (concat
     p1-intro-verse
     (loop1 2 (bass1 bass-chorus))
     (loop1 1 bass-verse))
   :p2
   (concat
     (loop1 32 (r 40)) p2-verse
     (loop1 2 (bass3 bass-chorus-5th))
      p2-verse)
   :saw
   (concat
     (loop1 32 (r 40)) saw-verse
     (loop1 2 (saw1 bass-chorus))
     saw-verse)
   :noise (loop2 7 noise-loop)
   :dpcm (loop1 7 dpcm-loop)})
