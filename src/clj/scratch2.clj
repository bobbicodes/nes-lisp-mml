(apply concat
       '(([1 2 3]
          [4 5 6]
          [7 8 9])
         ([4 5 6]
          [1 2 3]
          [7 8 9])
         ([4 5 6]
          [1 2 3]
          [0 1 2])))

(def bass-notes
  [[0 0.25 50] [0.25 0.25 46] [0.5 0.25 42] [0.75 0.25 40] [1 2.4 36]
   [4 0.25 60] [4.25 3.1 48]
   [7.8 0.25 58] [8.05 0.25 55] [8.3 0.25 52] [8.55 0.25 42] [8.8 2.5 43]
   [11.8 0.25 60] [12.05 3 48]])

(for [t (range 0 7 1.3)]
  (map #(vector (last %) (/ (second %) 12) (+ t 2 (/ (first %) 12))) bass-notes))

(defn attenuate
  "n is the number the sample occurs, value is the original amplitude"
  [n value]
  )

(* 1 )

(/ -0.875 (/ (* 10 50) 1))