(defn kick [length]
  [{:volume 13 :pitch 6 :length 1}
   {:volume 8 :pitch 2}
   {:volume 6 :pitch 1}
   {:volume 4 :pitch 1}
   {:volume 3 :pitch 0 :length 3}
   {:volume 0 :pitch 0 :length (- length 7)}])

(defn snare [length]
  [{:volume 14 :pitch 8 :length 1}
   {:volume 12 :pitch 6}
   {:volume 11 :pitch 6}
   {:volume 10 :pitch 6}
   {:volume 9 :pitch 6}
   {:envelope [8 6 5 4 3 3 2 2 2 2 2 1]
    :pitch 5 :length (- length 5)}])

(defn snare2 [length]
  [{:volume 8 :pitch 9 :length 1}
   {:volume 5 :pitch 7}
   {:volume 3 :pitch 7}
   {:envelope [2 2 2 1]
    :pitch 6 :length (- length 3)}])

(defn hat [length]
  [{:volume 9 :pitch 4 :length 1}
   {:volume 6 :pitch 2}
   {:volume 3 :pitch 2 :length 2}
   {:volume 2 :pitch 2 :length 7}
   {:volume 0 :pitch 0 :length (- length 11)}])

(defn hat4 [length]
  [{:volume 4 :pitch 4 :length 1}
   {:volume 3 :pitch 3}
   {:volume 2 :pitch 0}
   {:volume 1 :pitch 0}
   {:volume 0 :pitch 0 :length (- length 4)}])

(defn hat3 [length]
  [{:volume 3 :pitch 4 :length 1}
   {:volume 2 :pitch 3}
   {:volume 1 :pitch 0}
   {:volume 1 :pitch 0}
   {:volume 0 :pitch 0 :length (- length 4)}])

(defn hat2 [length]
  [{:volume 2 :pitch 4 :length 1}
   {:volume 1 :pitch 3}
   {:volume 1 :pitch 0}
   {:volume 1 :pitch 0}
   {:volume 0 :pitch 0 :length (- length 4)}])

(defn ride [length]
  (if (< 8 length)
    [{:volume 8 :length 1 :pitch 4}
     {:volume 3 :pitch 2 :length 7}
     {:volume 0 :pitch 2 :length (- length 8)}]
  [{:volume 8 :length 1 :pitch 4}
   {:volume 3 :pitch 2 :length (dec length)}]))

(defn tom [length]
  [{:volume 5 :pitch 8 :length 1}
   {:volume 4 :pitch 8}
   {:volume 3 :pitch 9}
   {:volume 2 :pitch 7}
   {:volume 1 :pitch 5}
   {:volume 1 :pitch 3}
   {:volume 1 :pitch 2}
   {:volume 1 :pitch 1}
   {:volume 1 :pitch 0}
   {:volume 0 :pitch 0 :length (- length 9)}])

(defn crash
  ([length attenuation]
   (let [vol [15 15 15 15 15 15 14 14 13 12 12 11 11
             10 9 9 9 8 8 7 7 6 6 5 5 5 4 4 4 4 3 3 3 3 2 2 2 2 2 2 1 1 1 1 1 0]
         vol (map (fn [volume] (max 0 (- volume attenuation))) vol)]
   [{:envelope vol :length 1 :pitch 8} {:pitch 2}
    {:length (- length 2) :pitch 3}]))
  ([length]
   (let [vol [15 15 15 15 15 15 14 14 13 12 12 11 11
             10 9 9 9 8 8 7 7 6 6 5 5 5 4 4 4 4 3 3 3 3 2 2 2 2 2 2 1 1 1 1 1 0]]
     [{:envelope vol :length 1 :pitch 8} {:pitch 2}
    {:length (- length 2) :pitch 3}])))

(defn dk [length]
  (if (< length 11)
    [{:sample "kick" :length (min 10 length)}]
    [{:sample "kick" :length (min 10 length)}
     {:rest (max 0 (- length 10))}]))

(defn ds [length]
  (if (< length 8)
    [{:sample "snare" :length (min 7 length)}]
    [{:sample "snare" :length (min 7 length)}
     {:rest (max 0 (- length 7))}]))

(defn instrument
  "Takes a sequence of length/pitch pairs,
   a volume and duty envelope,
   and a function to call on each pair."
  [notes envelope duty lp-fn]
  (concat
    [{:envelope envelope :vibrato 2 :duty duty}]
    (mapcat lp-fn notes)))

(defn l1 [notes]
  (instrument notes [5 6 7] [0x70 0x30]
    (fn [[l p]]
      [{:length l :pitch p}])))

(def low-pulse-duties
  (concat
    [0 0 0x10 0x10 0x10 0x10 0x20 0x20 0x20 0x20 0x20]
    (repeat 23 0x30) (repeat 6 0x40) (repeat 6 0x50)
    (repeat 6 0x60) [0x70]))

(def trem
  [13 12 10 9 8 9 10 9 8 7 8 7 6 5 5 6 7 8 7 6 5 5 6 7 8 7 6 5 5 4])

(def swell
  [6 7 8 9 10 9 8 7 8 7 6 5 5 6 7 8 7 6 5 5 6 7 8 7 6 5 5 4])

(def swell-duty-env
  [0x70 0x60 0x50 0x50 0x40 0x40 0x30 0x30 0x30 0x30 0x30 0x30 0x20])

(def octave-lead-duty-env
  [0 0x10 0x20 0x30 0x30 0x30 0x30 0x30 0x30 0x30
   0x30 0x30 0x40 0x40 0x50 0x50 0x60 0x60 0x70])

(defn sl [notes]
  (instrument notes swell swell-duty-env
    (fn [[l p]]
      [{:length 1 :pitch (+ 12 p)}
       {:length (dec l) :pitch p}])))

(defn ol [notes]
  (instrument notes trem octave-lead-duty-env
    (fn [[l p]]
      [{:length 1 :pitch (+ 12 p)}
       {:length (dec l) :pitch p}])))

(defn bass1 [notes]
  (concat
     [{:envelope [15 14 13 12 11 10 9 8 8 8 8 7 7 6 6 5 5 5 5 4]
       :duty low-pulse-duties}]
     notes))

(def r2 [2 160])
(def r4 [4 160])
(def r5 [5 160])
(def r6 [6 160])
(def r12 [12 160])
(def r13 [13 160])
(def r24 [24 160])

(def noise-intro
  (concat
    [{:length 26 :volume 0 :pitch 0}]
     (loop1 5 (concat
       (hat4 26) (hat2 25) (hat3 25) (hat2 26)))
     (snare 13) (kick 12) (snare 12) (kick 12)
     (snare 13) (kick 12) (snare 12) (kick 12)
     (loop1 16 (concat (kick 13) (kick 13) (tom 25)))
     (loop1 6 (concat (kick 13) (kick 38)))
     (snare 13) (kick 12) (snare 12) (kick 12)
     (snare 13) (kick 12) (snare 12) (kick 12)))

(def dpcm-intro
  (concat
    (ds 13) (dk 12) (ds 12) (dk 12) (ds 13) (dk 12) (ds 12) (dk 12)))

(def lead-intro1
  [[13 55] [13 57] [9 59] r4 [8 59] r5 [8 59] r4 [9 59] r4 [25 59]
   [13 55] [13 59] [9 57] r5 [12 57] r12 [26 57]
   [12 50] [13 55] [13 59] [9 62] r4 [8 62] r5 [8 62] r4 [9 62] r4 [12 62]
   [25 59] [13 62] [9 64] r4 [13 62] r12 [26 59] [12 55] [13 59] [13 62]
   [13 59] r13 [8 59] r4 [9 59] r4 [25 59] [13 55] [13 59] [9 57] r4
   [8 57] r5 [12 57] [13 54] [13 55] r12])

(def tri-tom
  (slide 63 53 25))

(defn k
  "Kick wrapper. Precedes note with relative arpeggio,
   subtracting length as needed. Takes and returns
   sequences of length-pitch pairs."
  [[l p]]
  (let [arp (vec (take l [[1 (+ p 19)] [1 (+ p 15)]
           [1 (+ p 12)] [1 (+ p 7)] [1 (+ p 3)]]))]
    (if (< 5 l) (conj arp [(- l 5) p]) arp)))

(defn bass-fig [pitch]
  (concat
    (k [13 pitch]) (k [13 pitch]) tri-tom
    (k [13 pitch]) (k [13 pitch]) tri-tom))

(play
  {:noise (concat noise-intro)
   :dpcm (concat (loop1 19 [{:rest 26}]) {:rest 42} dpcm-intro)
   :triangle
   (concat
     (loop1 8 (r 26)) (r 22)
     [[203 42] [108 54]] (loop1 3 (r 26)) (r 15)
     (bass-fig 52) (bass-fig 50) (bass-fig 52) (bass-fig 53)
     (bass-fig 52) (bass-fig 50) (bass-fig 52) (bass-fig 52))
   :p1
   (concat
     (l1 lead-intro1)
     (ol [[13 67] [13 66] [26 64] [8 59] r4 [13 59] [25 52] [26 64]
          [13 50] [13 54] [12 57] [13 54] [13 50] [12 62] [13 55] [13 54]
          [26 52] ]))
   :p2
   (concat (loop1 8 (r 26)) (r 22)
     (sl [[203 30] [178 42]])
     (l1 [[13 55] [13 57] [11 59] r2 [13 59] r12
          [26 64] [12 55] [26 59] [13 57] [25 57] [38 54]]))})
