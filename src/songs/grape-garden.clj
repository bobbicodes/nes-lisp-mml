(def tri-kick [[1 62] [1 59] [1 54]])
(def tri-snare [[1 70] [1 65]])

(def b1 [49 51 53])
(def b2 [54 61 68 70 66 49])
(def b3 [53 60 67 68 65 48])
(def b4 [51 58 65 66 63 46])
(def b5 [53 60 67 70 68 53])
(def b6 [68 63 56 58 59 60])

(def b7 [73 49 75 51 77 53])
(def b8 [49 56 63 65 68 61 73 61 51 54 53 49])
(def b9 [56 61 63 66 70 69 68 77 78 79 80 56])

(def a1 [70 73 80 78 85 78])
(def a2 [68 72 79 77 84 77])
(def a3 [68 72 84 82 80 68])
(def a4 [89 85 82 85 82 89 87 84 80 84 80 87
         85 82 78 82 78 85 84 80 77 80 77 83])
(def a5 [89 85 82 85 82 89 87 84 80 84 80 87
         85 82 78 82 78 87 85 82 85])
(def a6 [92 80 82 85 84])

(def c1 [100 94 100 99 92 99 97 90 97 99 92 
         104 100 94 100 99 92 99 97 90 97 96])
(def c2 [77 68 77 68 77 68 75 66 75 66 75 66])
(def c3 [73 64 73 64 73 64 68 59 68 59 68 59])
(def c4 [69 61 69 61 69 61 59 66 75 69 75 69
         77 68 77 68 77 68 66 70 72 75 82 80])
(def c5 [85 82 77 82 77 85 84 80 75 80 75 84
         82 78 73 78 73 82 80 77 72 77 71 80])
(def c6 [85 82 77 82 77 85 84 80 75 80 75 84
         82 78 73 78 73 84 82 78 82])
(def c7 [90 87 90 94 92])


(play [] []
  (length-pitch (f4a [85 82 77 82 77 85 84 80 75 80 75 84
         82 78 73 78 73 82 80 77 72 77 71 80]))
  [])

(play [] []
  (length-pitch (f4a [85 82 77 82 77 85 84 80 75 80 75 84]))
  [])

(play [] []
  (length-pitch (f4a [82 78 73 78 73 84 82 78 82]))
  [])

(defn f1 [notes]
  (mapcat (fn [pitch] [[6 pitch] [16 160]])
    notes))

(defn f2 [notes]
  (mapcat (fn [pitch] [[6 pitch] [5 160]])
    notes))

(defn f2a [notes]
  (mapcat (fn [pitch] [[1 pitch] [10 160]])
    notes))

(defn f2b [notes]
  (mapcat (fn [pitch] [[3 pitch] [8 160]])
    notes))

(defn f2c [notes]
  (mapcat (fn [pitch] [[3 160] [3 pitch] [5 160]])
    notes))

(defn f3 [pitch]
  [[6 pitch] [5 160] [6 (+ pitch 7)] [5 160]
   [10 (+ pitch 12)] [12 160] [6 pitch] 
   [5 160] [6 pitch] [5 160]])

(defn f4 [notes]
  (mapcat (fn [pitch] [[6 pitch] [5 160] [6 pitch] [5 160]])
    notes))

(defn f4a [notes]
  (mapcat (fn [pitch] [[3 pitch] [8 160] [3 pitch] [8 160]])
    notes))

(defn f4b [notes]
  (mapcat (fn [pitch] [[3 160] [3 pitch] [8 160] [3 pitch] [5 160]])
    notes))

(defn f5 [notes]
  (mapcat (fn [pitch] [[1 pitch] [21 160]])
    notes))

(defn part-seq [part]
  (mapcat #(repeat (if (contains? % :length)
                     (:length %) 1)
             (:pitch %))
    part))

(defn multiplex [p1 p2]
  (map (fn [a b] {:length 1 :pitch (if (= 160 b) a b)})
    (part-seq p1) (part-seq p2)))

(def p1
  (length-pitch
    (concat (f1 b1) (f2 b2) (f2 b3) (f2 b4)
      (f2 b5) (f2 b2) (f2 b3) (f2 b4) (f2 b6)
      (f3 61) (f3 59) (f3 57) (f3 52) (f3 54)
      (f3 47) (f3 49) (f3 56) (f3 61) (f3 59)
      (f3 57) (f3 52) (f3 54) (f3 56) (f3 49) (f2 b7)
      (f2 b2) (f2 b2) (f2 b3) (f2 b3) (f2 b4) (f2 b4) (f2 b8)
      (f2 b2) (f2 b2) (f2 b3) (f2 b3) (f2 b4) (f2 b4) (f2 b9)
      (f3 61) (f3 59) (f3 57) (f3 52) (f3 54)
      (f3 47) (f3 49) (f3 56) (f3 61) (f3 59)
      (f3 57) (f3 52) (f3 54) (f3 56) (f3 49) (f2 b7))))

(play [] []
  p1
  [])

(def p2a
  (length-pitch
    (concat (f2a a1) (f2a a2) (f2a a1) (f2a a3) (f2a a1) (f2a a2))))

(play [] []
  p2a
  [])

(def p2b
  (length-pitch
    [[1 101] [32 160] [1 102] [10 160] [1 99] [10 160]
       [1 97] [10 160] [1 96] [21 160]
       [1 94] [21 160] [1 92] [21 160]]))

(play [] []
  p2b
  [])

(def p3
  (length-pitch [[1 89] [32 160] [1 90] [10 160] [1 92] [21 160]
                 [1 87] [65 160] [1 85] [32 160] [1 87] [10 160] [1 88] [21 160]
                 [1 83] [65 160] [1 85] [21 160] [1 87] [21 160]
                 [1 88] [21 160] [1 97] [21 160] [1 95] [21 160] [1 93] [21 160]
                 [1 92] [65 160] [1 87] [65 160]]))

(play [] []
  p3
  [])

(def p4
  (length-pitch [[1 89] [32 160] [1 90] [10 160] [1 92] [21 160]
                 [1 87] [65 160] [1 85] [32 160] [1 87] [10 160] [1 88] [21 160]
                 [1 83] [65 160] [1 85] [21 160] [1 87] [21 160]
                 [1 88] [21 160] [1 87] [42 160] [1 80] [21 160] [1 85] [63 160] [2 71] [20 160]
                 [2 71] [20 160] [2 71] [20 160]]))

(play [] []
  p4
  [])

(def drum-loop
  (concat [{:length 33 :pitch 160}]
    (apply concat (repeat 8
  (length-pitch
    (concat tri-snare [[9 160]] tri-snare [[9 160]] tri-kick [[8 160]] tri-kick [[19 160]] tri-snare [[20 160]] [[1 106]] [[10 160]]
      tri-kick [[8 160]] tri-kick [[19 160]] tri-snare [[20 160]] tri-snare [[9 160]] tri-kick [[8 160]]
      tri-kick [[19 160]] tri-snare [[20 160]] [[1 106]] [[10 160]] tri-kick [[8 160]] tri-kick [[8 160]] tri-kick [[19 160]]))))))

(def part-b
 (multiplex
   (length-pitch (concat (f2 c2) (f2 c3) (f2 c4)
                         (f2 c2) (f2 c3) (f2 c4)))
   (concat p3 p4)))

(def part-a
 (multiplex p1 drum-loop))

(play [] []
  part-a
  [])

(play [] []
  (concat [{:length 67 :pitch 160}] p2a p2b part-b)
  [])

(play [] []
  (multiplex part-a (concat [{:length 67 :pitch 160}] p2a p2b part-b))
  [])

(play [] []
  (length-pitch (f4b a4))
  [])

(play [] []
  (concat 
    (length-pitch (f4b a4))
    (length-pitch (f4b a5))
    (length-pitch (f2 a6)))
  [])

(play [] []
  (concat 
    (length-pitch (f4a c5))
    (length-pitch (f4a c6))
    (length-pitch (f2 c7)))
  [])

(play [] []
  (multiplex (length-pitch (f4b a4)) 
             (length-pitch (f4a c5)))
  [])

(defn g1 [notes]
  (mapcat (fn [pitch] [[11 pitch]])
    notes))

(defn g2 [pitch]
  [[11 pitch] [11 (+ pitch 7)]
   [22 (+ pitch 12)] [11 pitch] 
   [11 pitch]])

(def verse-a
  (length-pitch
    (concat
      (g1 b2) (g1 b2) (g1 b3) (g1 b3) (g1 b4) (g1 b4) (g1 b8)
      (g1 b2) (g1 b2) (g1 b3) (g1 b3) (g1 b4) (g1 b4) (g1 b9)
      (g2 61) (g2 59) (g2 57) (g2 52) (g2 54)
      (g2 47) (g2 49) (g2 56) (g2 61) (g2 59)
      (g2 57) (g2 52) (g2 54) (g2 56) (g2 49) (f2 b7))))

(def verse-b
  (multiplex
    (concat 
      (length-pitch (f4b a4))
      (length-pitch (f4b a5))
      (length-pitch (f2b a6)))
    (concat 
      (length-pitch (f4a c5))
      (length-pitch (f4a c6))
      (length-pitch (f2c c7)))))

(play [] []
  (multiplex
    verse-a
    verse-b)
  [])

(play [] []
  (length-pitch (concat (f2 c2) (f2 c3) (f2 c4)
                             (f2 c2) (f2 c3) (f2 c4)))
  [])
