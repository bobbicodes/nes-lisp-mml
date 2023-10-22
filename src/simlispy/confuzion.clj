(ns simlispy.confuzion)

(defn bass1 [time]
  [{:time (+ time 0), :length 0.5, :pitch 71}
   {:time (+ time 1.5) :length 0.25, :pitch 71}
   {:time (+ time 2) :length 0.5, :pitch 71}
   {:time (+ time 3) :length 0.25, :pitch 73}
   {:time (+ time 3.5) :length 0.25, :pitch 69}
   {:time (+ time 4) :length 0.5, :pitch 69}
   {:time (+ time 5.5) :length 0.25, :pitch 69}
   {:time (+ time 6) :length 0.5, :pitch 69}
   {:time (+ time 8) :length 0.5, :pitch 64}
   {:time (+ time 9.5) :length 0.25, :pitch 64}
   {:time (+ time 10) :length 0.5, :pitch 64}
   {:time (+ time 12) :length 0.5, :pitch 64}
   {:time (+ time 13.5) :length 0.25, :pitch 64}
   {:time (+ time 14) :length 0.5, :pitch 64}])

(defn bass2 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 29.5, :length 0.5, :pitch 69}
        {:time 29, :length 0.5, :pitch 64}
        {:time 31, :length 0.25, :pitch 64}
        {:time 26, :length 0.5, :pitch 69}
        {:time 25.5, :length 0.25, :pitch 69}
        {:time 24, :length 0.5, :pitch 69}
        {:time 23, :length 0.5, :pitch 67}
        {:time 22.5, :length 0.5, :pitch 66}
        {:time 17.5, :length 0.25, :pitch 64}
        {:time 0, :length 0.5, :pitch 71}
        {:time 1.5, :length 0.25, :pitch 66}
        {:time 2, :length 0.25, :pitch 64}
        {:time 2.5, :length 0.5, :pitch 62}
        {:time 3.5, :length 0.5, :pitch 59}
        {:time 5.5, :length 0.25, :pitch 66}
        {:time 6, :length 0.5, :pitch 64}
        {:time 7, :length 0.5, :pitch 62}
        {:time 8, :length 0.5, :pitch 69}
        {:time 9.5, :length 0.25, :pitch 64}
        {:time 10, :length 0.25, :pitch 62}
        {:time 10.5, :length 0.5, :pitch 61}
        {:time 11.5, :length 0.5, :pitch 57}
        {:time 13.5, :length 0.25, :pitch 64}
        {:time 14, :length 0.5, :pitch 62}
        {:time 15, :length 0.5, :pitch 61}
        {:time 16, :length 0.5, :pitch 64}
        {:time 18.5, :length 0.5, :pitch 64}
        {:time 19, :length 0.25, :pitch 66}
        {:time 19.5, :length 0.5, :pitch 67}
        {:time 20.5, :length 0.25, :pitch 66}
        {:time 21, :length 0.25, :pitch 64}
        {:time 21.5, :length 0.5, :pitch 64}]))

(defn bass3 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 0, :length 0.5, :pitch 66}
        {:time 1.5, :length 0.25, :pitch 66}
        {:time 2, :length 0.5, :pitch 66}
        {:time 3, :length 0.5, :pitch 69}
        {:time 4, :length 0.5, :pitch 64}
        {:time 5.5, :length 0.25, :pitch 64}
        {:time 6, :length 0.5, :pitch 64}
        {:time 8, :length 0.5, :pitch 64}
        {:time 9.5, :length 0.25, :pitch 64}
        {:time 10, :length 0.5, :pitch 64}
        {:time 11, :length 0.5, :pitch 61}
        {:time 12, :length 0.5, :pitch 62}
        {:time 13.5, :length 0.25, :pitch 62}
        {:time 14, :length 0.5, :pitch 62}
        {:time 16, :length 0.5, :pitch 62}
        {:time 17.5, :length 0.25, :pitch 62}
        {:time 18, :length 0.5, :pitch 62}
        {:time 20, :length 0.5, :pitch 61}
        {:time 21.5, :length 0.25, :pitch 61}
        {:time 22, :length 0.5, :pitch 61}
        {:time 24, :length 0.5, :pitch 61}
        {:time 25.5, :length 0.5, :pitch 73}
        {:time 26.5, :length 0.25, :pitch 71}
        {:time 27, :length 0.25, :pitch 69}
        {:time 27.5, :length 0.25, :pitch 68}]))

(defn bass4 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 0, :length 0.5, :pitch 66}
        {:time 1.5, :length 0.25, :pitch 66}
        {:time 2, :length 0.5, :pitch 66}
        {:time 4, :length 0.5, :pitch 64}
        {:time 5.5, :length 0.25, :pitch 64}
        {:time 6, :length 0.5, :pitch 64}
        {:time 7, :length 0.5, :pitch 61}
        {:time 8, :length 0.5, :pitch 62}
        {:time 9.5, :length 0.25, :pitch 62}
        {:time 10, :length 0.5, :pitch 62}
        {:time 12, :length 0.5, :pitch 69}
        {:time 13.5, :length 0.25, :pitch 69}
        {:time 14, :length 0.5, :pitch 69}]))

(defn bass5 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 0, :length 0.5, :pitch 67}
        {:time 8, :length 0.5, :pitch 66}
        {:time 16, :length 0.5, :pitch 64}
        {:time 17, :length 0.5, :pitch 62}
        {:time 18, :length 0.5, :pitch 61}
        {:time 19, :length 0.5, :pitch 59}]))

(defn bass6 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 0, :length 0.5, :pitch 71}
        {:time 1.5, :length 0.25, :pitch 66}
        {:time 2, :length 0.25, :pitch 71}
        {:time 2.5, :length 0.5, :pitch 66}
        {:time 3.5, :length 0.25, :pitch 66}
        {:time 4, :length 0.5, :pitch 69}
        {:time 5.5, :length 0.25, :pitch 69}
        {:time 6, :length 0.5, :pitch 69}
        {:time 8, :length 0.5, :pitch 68}
        {:time 9.5, :length 0.25, :pitch 64}
        {:time 10, :length 0.25, :pitch 68}
        {:time 10.5, :length 0.5, :pitch 64}
        {:time 11.5, :length 0.25, :pitch 64}
        {:time 12, :length 0.5, :pitch 66}
        {:time 13.5, :length 0.25, :pitch 66}
        {:time 14, :length 0.5, :pitch 66}]))

(defn bass7 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 0, :length 0.5, :pitch 67}
        {:time 1, :length 0.25, :pitch 62}
        {:time 1.5, :length 0.25, :pitch 64}
        {:time 2, :length 0.25, :pitch 67}
        {:time 2.5, :length 0.25, :pitch 62}
        {:time 3, :length 0.25, :pitch 67}
        {:time 3.5, :length 0.25, :pitch 67}
        {:time 4, :length 0.5, :pitch 66}
        {:time 5.5, :length 0.25, :pitch 66}
        {:time 6, :length 0.5, :pitch 66}
        {:time 8, :length 0.5, :pitch 67}
        {:time 9, :length 0.25, :pitch 62}
        {:time 9.5, :length 0.25, :pitch 64}
        {:time 10, :length 0.25, :pitch 67}
        {:time 10.5, :length 0.25, :pitch 62}
        {:time 11, :length 0.25, :pitch 67}
        {:time 11.5, :length 0.25, :pitch 66}
        {:time 12, :length 0.5, :pitch 64}
        {:time 13.5, :length 0.25, :pitch 64}
        {:time 14, :length 0.5, :pitch 64}
        {:time 16, :length 0.5, :pitch 64}
        {:time 17.5, :length 0.25, :pitch 64}
        {:time 18, :length 0.5, :pitch 64}]))

(def bass-pat-1
  (concat (bass1 0) (bass1 16) (bass2 32) (bass3 64) (bass4 92) (bass4 108) (bass5 124)))

(def bass-pat-2
  (concat (bass6 144) (bass6 160) (bass7 176) (bass1 196) (bass1 212)))

(def bass-pat-3
  (concat (bass2 228) (bass3 260) (bass4 288) (bass4 304) (bass5 320)))

(def bass-pat-4
  (concat (bass6 340) (bass6 356) (bass7 372) (bass1 392) (bass1 408)))

(def bass-pat-5
  (concat (bass1 424) (bass1 440) (bass1 456) (bass1 472) (bass1 488) (bass1 504) (bass1 520)))

(def bass (concat bass-pat-1 bass-pat-2 bass-pat-3 bass-pat-4 bass-pat-5))
