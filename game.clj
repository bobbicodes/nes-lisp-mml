(defn bass1 [time]
  [{:time (+ time 0), :instrument 15, :pitch 71} {:time (+ time 1.5) :instrument 15, :pitch 71} {:time (+ time 2) :instrument 15, :pitch 71} {:time (+ time 3) :instrument 15, :pitch 73} {:time (+ time 3.5) :instrument 15, :pitch 69} {:time (+ time 4) :instrument 15, :pitch 69} {:time (+ time 5.5) :instrument 15, :pitch 69} {:time (+ time 6) :instrument 15, :pitch 69} {:time (+ time 8) :instrument 15, :pitch 64} {:time (+ time 9.5) :instrument 15, :pitch 64} {:time (+ time 10) :instrument 15, :pitch 64} {:time (+ time 12) :instrument 15, :pitch 64} {:time (+ time 13.5) :instrument 15, :pitch 64} {:time (+ time 14) :instrument 15, :pitch 64}])

(defn bass2 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 29.5, :instrument 15, :pitch 69} {:time 29, :instrument 15, :pitch 64} {:time 31, :instrument 15, :pitch 64} {:time 26, :instrument 15, :pitch 69} {:time 25.5, :instrument 15, :pitch 69} {:time 24, :instrument 15, :pitch 69} {:time 23, :instrument 15, :pitch 67} {:time 22.5, :instrument 15, :pitch 66} {:time 17.5, :instrument 15, :pitch 64} {:time 0, :instrument 15, :pitch 71} {:time 1.5, :instrument 15, :pitch 66} {:time 2, :instrument 15, :pitch 64} {:time 2.5, :instrument 15, :pitch 62} {:time 3.5, :instrument 15, :pitch 59} {:time 5.5, :instrument 15, :pitch 66} {:time 6, :instrument 15, :pitch 64} {:time 7, :instrument 15, :pitch 62} {:time 8, :instrument 15, :pitch 69} {:time 9.5, :instrument 15, :pitch 64} {:time 10, :instrument 15, :pitch 62} {:time 10.5, :instrument 15, :pitch 61} {:time 11.5, :instrument 15, :pitch 57} {:time 13.5, :instrument 15, :pitch 64} {:time 14, :instrument 15, :pitch 62} {:time 15, :instrument 15, :pitch 61} {:time 16, :instrument 15, :pitch 64} {:time 18.5, :instrument 15, :pitch 64} {:time 19, :instrument 15, :pitch 66} {:time 19.5, :instrument 15, :pitch 67} {:time 20.5, :instrument 15, :pitch 66} {:time 21, :instrument 15, :pitch 64} {:time 21.5, :instrument 15, :pitch 64}]))

(defn bass3 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 0, :instrument 15, :pitch 66} {:time 1.5, :instrument 15, :pitch 66} {:time 2, :instrument 15, :pitch 66} {:time 3, :instrument 15, :pitch 69} {:time 4, :instrument 15, :pitch 64} {:time 5.5, :instrument 15, :pitch 64} {:time 6, :instrument 15, :pitch 64} {:time 8, :instrument 15, :pitch 64} {:time 9.5, :instrument 15, :pitch 64} {:time 10, :instrument 15, :pitch 64} {:time 11, :instrument 15, :pitch 61} {:time 12, :instrument 15, :pitch 62} {:time 13.5, :instrument 15, :pitch 62} {:time 14, :instrument 15, :pitch 62} {:time 16, :instrument 15, :pitch 62} {:time 17.5, :instrument 15, :pitch 62} {:time 18, :instrument 15, :pitch 62} {:time 20, :instrument 15, :pitch 61} {:time 21.5, :instrument 15, :pitch 61} {:time 22, :instrument 15, :pitch 61} {:time 24, :instrument 15, :pitch 61} {:time 25.5, :instrument 15, :pitch 73} {:time 26.5, :instrument 15, :pitch 71} {:time 27, :instrument 15, :pitch 69} {:time 27.5, :instrument 15, :pitch 68}]))

(defn bass4 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 0, :instrument 15, :pitch 66} {:time 1.5, :instrument 15, :pitch 66} {:time 2, :instrument 15, :pitch 66} {:time 4, :instrument 15, :pitch 64} {:time 5.5, :instrument 15, :pitch 64} {:time 6, :instrument 15, :pitch 64} {:time 7, :instrument 15, :pitch 61} {:time 8, :instrument 15, :pitch 62} {:time 9.5, :instrument 15, :pitch 62} {:time 10, :instrument 15, :pitch 62} {:time 12, :instrument 15, :pitch 69} {:time 13.5, :instrument 15, :pitch 69} {:time 14, :instrument 15, :pitch 69}]))

(defn bass5 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 0, :instrument 15, :pitch 67} {:time 8, :instrument 15, :pitch 66} {:time 16, :instrument 15, :pitch 64} {:time 17, :instrument 15, :pitch 62} {:time 18, :instrument 15, :pitch 61} {:time 19, :instrument 15, :pitch 59}]))

(def bass-pat-1
  (concat (bass1 0) (bass1 16) (bass2 32) (bass3 64) (bass4 92) (bass4 108) (bass5 124)))

(defn parse-note [note]
  (str "{\"instrument\": \"" (:instrument note) ".mp3\", \"pitch\": "
       (:pitch note) ", \"time\": " (:time note) "}"))

(str "[" (str/join ", " (map parse-note bass-pat-1)) "]")