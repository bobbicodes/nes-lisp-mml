(defn add-semitone [rate]
  (* rate (Math/pow 2 (/ 1 12))))

(defn sub-semitone [rate]
  (* rate (Math/pow 2 (/ -1 12))))

(defn inc-rate [semis]
  (reduce add-semitone (repeat semis 1)))

(defn dec-rate [semis]
  (reduce sub-semitone (repeat semis 1)))

(defn pitch->rate [midi-num]
  (if (< 66 midi-num)
    (inc-rate (- midi-num 66))
    (dec-rate (- 68 midi-num))))
