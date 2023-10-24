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

#_(def bass (concat bass-pat-1 bass-pat-2 bass-pat-3 bass-pat-4 bass-pat-5))

(def bass [{:pitch 45
            :length 0.5
            :time 1.2}
           {:pitch 45
            :length 0.25
            :time 1.8}
           {:pitch 45
            :length 0.5
            :time 2}
           {:pitch 47
            :length 0.25
            :time 2.4}
           {:pitch 43
            :length 0.25
            :time 2.6}
           {:pitch 43
            :length 0.5
            :time 2.8}
           {:pitch 43
            :length 0.25
            :time 3.4}
           {:pitch 43
            :length 0.5
            :time 3.6}
           {:pitch 38
            :length 0.5
            :time 4.4}
           {:pitch 38
            :length 0.25
            :time 5}
           {:pitch 38
            :length 0.5
            :time 5.2}
           {:pitch 38
            :length 0.5
            :time 6}
           {:pitch 38
            :length 0.25
            :time 6.6}
           {:pitch 38
            :length 0.5
            :time 6.8}
           {:pitch 45
            :length 0.5
            :time 7.6}
           {:pitch 45
            :length 0.25
            :time 8.2}
           {:pitch 45
            :length 0.5
            :time 8.4}
           {:pitch 47
            :length 0.25
            :time 8.8}
           {:pitch 43
            :length 0.25
            :time 9}
           {:pitch 43
            :length 0.5
            :time 9.2}
           {:pitch 43
            :length 0.25
            :time 9.8}
           {:pitch 43
            :length 0.5
            :time 10}
           {:pitch 38
            :length 0.5
            :time 10.8}
           {:pitch 38
            :length 0.25
            :time 11.4}
           {:pitch 38
            :length 0.5
            :time 11.6}
           {:pitch 38
            :length 0.5
            :time 12.4}
           {:pitch 38
            :length 0.25
            :time 13}
           {:pitch 38
            :length 0.5
            :time 13.2}
           {:pitch 45
            :length 0.5
            :time 14}
           {:pitch 40
            :length 0.25
            :time 14.6}
           {:pitch 38
            :length 0.25
            :time 14.8}
           {:pitch 36
            :length 0.5
            :time 15}
           {:pitch 33
            :length 0.5
            :time 15.4}
           {:pitch 40
            :length 0.25
            :time 16.2}
           {:pitch 38
            :length 0.5
            :time 16.4}
           {:pitch 36
            :length 0.5
            :time 16.8}
           {:pitch 43
            :length 0.5
            :time 17.2}
           {:pitch 38
            :length 0.25
            :time 17.8}
           {:pitch 36
            :length 0.25
            :time 18}
           {:pitch 35
            :length 0.5
            :time 18.2}
           {:pitch 31
            :length 0.5
            :time 18.6}
           {:pitch 38
            :length 0.25
            :time 19.4}
           {:pitch 36
            :length 0.5
            :time 19.6}
           {:pitch 35
            :length 0.5
            :time 20}
           {:pitch 38
            :length 0.5
            :time 20.4}
           {:pitch 38
            :length 0.25
            :time 21}
           {:pitch 38
            :length 0.5
            :time 21.4}
           {:pitch 40
            :length 0.25
            :time 21.6}
           {:pitch 41
            :length 0.5
            :time 21.8}
           {:pitch 40
            :length 0.25
            :time 22.2}
           {:pitch 38
            :length 0.25
            :time 22.4}
           {:pitch 38
            :length 0.5
            :time 22.6}
           {:pitch 40
            :length 0.5
            :time 23}
           {:pitch 41
            :length 0.5
            :time 23.2}
           {:pitch 43
            :length 0.5
            :time 23.6}
           {:pitch 43
            :length 0.25
            :time 24.2}
           {:pitch 43
            :length 0.5
            :time 24.4}
           {:pitch 38
            :length 0.5
            :time 25.6}
           {:pitch 43
            :length 0.5
            :time 25.8}
           {:pitch 38
            :length 0.25
            :time 26.4}
           {:pitch 40
            :length 0.5
            :time 26.8}
           {:pitch 40
            :length 0.25
            :time 27.4}
           {:pitch 40
            :length 0.5
            :time 27.6}
           {:pitch 43
            :length 0.5
            :time 28}
           {:pitch 38
            :length 0.5
            :time 28.4}
           {:pitch 38
            :length 0.25
            :time 29}
           {:pitch 38
            :length 0.5
            :time 29.2}
           {:pitch 38
            :length 0.5
            :time 30}
           {:pitch 38
            :length 0.25
            :time 30.6}
           {:pitch 38
            :length 0.5
            :time 30.8}
           {:pitch 35
            :length 0.5
            :time 31.2}
           {:pitch 36
            :length 0.5
            :time 31.6}
           {:pitch 36
            :length 0.25
            :time 32.2}
           {:pitch 36
            :length 0.5
            :time 32.4}
           {:pitch 36
            :length 0.5
            :time 33.2}
           {:pitch 36
            :length 0.25
            :time 33.8}
           {:pitch 36
            :length 0.5
            :time 34}
           {:pitch 35
            :length 0.5
            :time 34.8}
           {:pitch 35
            :length 0.25
            :time 35.4}
           {:pitch 35
            :length 0.5
            :time 35.6}
           {:pitch 35
            :length 0.5
            :time 36.4}
           {:pitch 47
            :length 0.5
            :time 37}
           {:pitch 45
            :length 0.25
            :time 37.4}
           {:pitch 43
            :length 0.25
            :time 37.6}
           {:pitch 42
            :length 0.25
            :time 37.8}
           {:pitch 40
            :length 0.5
            :time 38}
           {:pitch 40
            :length 0.25
            :time 38.6}
           {:pitch 40
            :length 0.5
            :time 38.8}
           {:pitch 38
            :length 0.5
            :time 39.6}
           {:pitch 38
            :length 0.25
            :time 40.2}
           {:pitch 38
            :length 0.5
            :time 40.4}
           {:pitch 35
            :length 0.5
            :time 40.8}
           {:pitch 36
            :length 0.5
            :time 41.2}
           {:pitch 36
            :length 0.25
            :time 41.8}
           {:pitch 36
            :length 0.5
            :time 42}
           {:pitch 43
            :length 0.5
            :time 42.8}
           {:pitch 43
            :length 0.25
            :time 43.4}
           {:pitch 43
            :length 0.5
            :time 43.6}
           {:pitch 40
            :length 0.5
            :time 44.4}
           {:pitch 40
            :length 0.25
            :time 45}
           {:pitch 40
            :length 0.5
            :time 45.2}
           {:pitch 38
            :length 0.5
            :time 46}
           {:pitch 38
            :length 0.25
            :time 46.6}
           {:pitch 38
            :length 0.5
            :time 46.8}
           {:pitch 35
            :length 0.5
            :time 47.2}
           {:pitch 36
            :length 0.5
            :time 47.6}
           {:pitch 36
            :length 0.25
            :time 48.2}
           {:pitch 36
            :length 0.5
            :time 48.4}
           {:pitch 43
            :length 0.5
            :time 49.2}
           {:pitch 43
            :length 0.25
            :time 49.8}
           {:pitch 43
            :length 0.5
            :time 50}
           {:pitch 41
            :length 0.5
            :time 50.8}
           {:pitch 40
            :length 0.5
            :time 54}
           {:pitch 38
            :length 0.5
            :time 57.2}
           {:pitch 36
            :length 0.5
            :time 57.6}
           {:pitch 35
            :length 0.5
            :time 58}
           {:pitch 33
            :length 0.5
            :time 58.4}
           {:pitch 45
            :length 0.5
            :time 58.8}
           {:pitch 40
            :length 0.25
            :time 59.4}
           {:pitch 45
            :length 0.25
            :time 59.6}
           {:pitch 40
            :length 0.5
            :time 59.8}
           {:pitch 40
            :length 0.25
            :time 60.2}
           {:pitch 43
            :length 0.5
            :time 60.4}
           {:pitch 43
            :length 0.25
            :time 61}
           {:pitch 43
            :length 0.5
            :time 61.2}
           {:pitch 42
            :length 0.5
            :time 62}
           {:pitch 38
            :length 0.25
            :time 62.6}
           {:pitch 42
            :length 0.25
            :time 62.8}
           {:pitch 38
            :length 0.5
            :time 63}
           {:pitch 38
            :length 0.25
            :time 63.4}
           {:pitch 40
            :length 0.5
            :time 63.6}
           {:pitch 40
            :length 0.25
            :time 64.2}
           {:pitch 40
            :length 0.5
            :time 64.4}
           {:pitch 45
            :length 0.5
            :time 65.2}
           {:pitch 40
            :length 0.25
            :time 65.8}
           {:pitch 45
            :length 0.25
            :time 66}
           {:pitch 40
            :length 0.5
            :time 66.2}
           {:pitch 40
            :length 0.25
            :time 66.6}
           {:pitch 43
            :length 0.5
            :time 66.8}
           {:pitch 43
            :length 0.25
            :time 67.4}
           {:pitch 43
            :length 0.5
            :time 67.6}
           {:pitch 42
            :length 0.5
            :time 68.4}
           {:pitch 38
            :length 0.25
            :time 69}
           {:pitch 42
            :length 0.25
            :time 69.2}
           {:pitch 38
            :length 0.5
            :time 69.4}
           {:pitch 38
            :length 0.25
            :time 69.8}
           {:pitch 40
            :length 0.5
            :time 70}
           {:pitch 40
            :length 0.25
            :time 70.6}
           {:pitch 40
            :length 0.5
            :time 70.8}
           {:pitch 41
            :length 0.5
            :time 71.6}
           {:pitch 36
            :length 0.25
            :time 72}
           {:pitch 38
            :length 0.25
            :time 72.2}
           {:pitch 41
            :length 0.25
            :time 72.4}
           {:pitch 36
            :length 0.25
            :time 72.6}
           {:pitch 41
            :length 0.25
            :time 72.8}
           {:pitch 41
            :length 0.25
            :time 73}
           {:pitch 40
            :length 0.5
            :time 73.2}
           {:pitch 40
            :length 0.25
            :time 73.8}
           {:pitch 40
            :length 0.5
            :time 74}
           {:pitch 41
            :length 0.5
            :time 74.8}
           {:pitch 36
            :length 0.25
            :time 75.2}
           {:pitch 38
            :length 0.25
            :time 75.4}
           {:pitch 41
            :length 0.25
            :time 75.6}
           {:pitch 36
            :length 0.25
            :time 75.8}
           {:pitch 41
            :length 0.25
            :time 76}
           {:pitch 40
            :length 0.25
            :time 76.2}
           {:pitch 38
            :length 0.5
            :time 76.4}
           {:pitch 38
            :length 0.25
            :time 77}
           {:pitch 38
            :length 0.5
            :time 77.2}
           {:pitch 38
            :length 0.5
            :time 78}
           {:pitch 38
            :length 0.25
            :time 78.6}
           {:pitch 38
            :length 0.5
            :time 78.8}
           {:pitch 45
            :length 0.5
            :time 79.6}
           {:pitch 45
            :length 0.25
            :time 80.2}
           {:pitch 45
            :length 0.5
            :time 80.4}
           {:pitch 47
            :length 0.25
            :time 80.8}
           {:pitch 43
            :length 0.25
            :time 81}
           {:pitch 43
            :length 0.5
            :time 81.2}
           {:pitch 43
            :length 0.25
            :time 81.8}
           {:pitch 43
            :length 0.5
            :time 82}
           {:pitch 38
            :length 0.5
            :time 82.8}
           {:pitch 38
            :length 0.25
            :time 83.4}
           {:pitch 38
            :length 0.5
            :time 83.6}
           {:pitch 38
            :length 0.5
            :time 84.4}
           {:pitch 38
            :length 0.25
            :time 85}
           {:pitch 38
            :length 0.5
            :time 85.2}
           {:pitch 45
            :length 0.5
            :time 86}
           {:pitch 45
            :length 0.25
            :time 86.6}
           {:pitch 45
            :length 0.5
            :time 86.8}
           {:pitch 47
            :length 0.25
            :time 87.2}
           {:pitch 43
            :length 0.25
            :time 87.4}
           {:pitch 43
            :length 0.5
            :time 87.6}
           {:pitch 43
            :length 0.25
            :time 88.2}
           {:pitch 43
            :length 0.5
            :time 88.4}
           {:pitch 38
            :length 0.5
            :time 89.2}
           {:pitch 38
            :length 0.25
            :time 89.8}
           {:pitch 38
            :length 0.5
            :time 90}
           {:pitch 38
            :length 0.5
            :time 90.8}
           {:pitch 38
            :length 0.25
            :time 91.4}
           {:pitch 38
            :length 0.5
            :time 91.6}
           {:pitch 45
            :length 0.5
            :time 92.4}
           {:pitch 40
            :length 0.25
            :time 93}
           {:pitch 38
            :length 0.25
            :time 93.2}
           {:pitch 36
            :length 0.5
            :time 93.4}
           {:pitch 33
            :length 0.5
            :time 93.8}
           {:pitch 40
            :length 0.25
            :time 94.6}
           {:pitch 38
            :length 0.5
            :time 94.8}
           {:pitch 36
            :length 0.5
            :time 95.2}
           {:pitch 43
            :length 0.5
            :time 95.6}
           {:pitch 38
            :length 0.25
            :time 96.2}
           {:pitch 36
            :length 0.25
            :time 96.4}
           {:pitch 35
            :length 0.5
            :time 96.6}
           {:pitch 31
            :length 0.5
            :time 97}
           {:pitch 38
            :length 0.25
            :time 97.8}
           {:pitch 36
            :length 0.5
            :time 98}
           {:pitch 35
            :length 0.5
            :time 98.4}
           {:pitch 38
            :length 0.5
            :time 98.8}
           {:pitch 38
            :length 0.25
            :time 99.4}
           {:pitch 38
            :length 0.5
            :time 99.8}
           {:pitch 40
            :length 0.25
            :time 100}
           {:pitch 41
            :length 0.5
            :time 100.2}
           {:pitch 40
            :length 0.25
            :time 100.6}
           {:pitch 38
            :length 0.25
            :time 100.8}
           {:pitch 38
            :length 0.5
            :time 101}
           {:pitch 40
            :length 0.5
            :time 101.4}
           {:pitch 41
            :length 0.5
            :time 101.6}
           {:pitch 43
            :length 0.5
            :time 102}
           {:pitch 43
            :length 0.25
            :time 102.6}
           {:pitch 43
            :length 0.5
            :time 102.8}
           {:pitch 38
            :length 0.5
            :time 104}
           {:pitch 43
            :length 0.5
            :time 104.2}
           {:pitch 38
            :length 0.25
            :time 104.8}
           {:pitch 40
            :length 0.5
            :time 105.2}
           {:pitch 40
            :length 0.25
            :time 105.8}
           {:pitch 40
            :length 0.5
            :time 106}
           {:pitch 43
            :length 0.5
            :time 106.4}
           {:pitch 38
            :length 0.5
            :time 106.8}
           {:pitch 38
            :length 0.25
            :time 107.4}
           {:pitch 38
            :length 0.5
            :time 107.6}
           {:pitch 38
            :length 0.5
            :time 108.4}
           {:pitch 38
            :length 0.25
            :time 109}
           {:pitch 38
            :length 0.5
            :time 109.2}
           {:pitch 35
            :length 0.5
            :time 109.6}
           {:pitch 36
            :length 0.5
            :time 110}
           {:pitch 36
            :length 0.25
            :time 110.6}
           {:pitch 36
            :length 0.5
            :time 110.8}
           {:pitch 36
            :length 0.5
            :time 111.6}
           {:pitch 36
            :length 0.25
            :time 112.2}
           {:pitch 36
            :length 0.5
            :time 112.4}
           {:pitch 35
            :length 0.5
            :time 113.2}
           {:pitch 35
            :length 0.25
            :time 113.8}
           {:pitch 35
            :length 0.5
            :time 114}
           {:pitch 35
            :length 0.5
            :time 114.8}
           {:pitch 47
            :length 0.5
            :time 115.4}
           {:pitch 45
            :length 0.25
            :time 115.8}
           {:pitch 43
            :length 0.25
            :time 116}
           {:pitch 42
            :length 0.25
            :time 116.2}
           {:pitch 40
            :length 0.5
            :time 116.4}
           {:pitch 40
            :length 0.25
            :time 117}
           {:pitch 40
            :length 0.5
            :time 117.2}
           {:pitch 38
            :length 0.5
            :time 118}
           {:pitch 38
            :length 0.25
            :time 118.6}
           {:pitch 38
            :length 0.5
            :time 118.8}
           {:pitch 35
            :length 0.5
            :time 119.2}
           {:pitch 36
            :length 0.5
            :time 119.6}
           {:pitch 36
            :length 0.25
            :time 120.2}
           {:pitch 36
            :length 0.5
            :time 120.4}
           {:pitch 43
            :length 0.5
            :time 121.2}
           {:pitch 43
            :length 0.25
            :time 121.8}
           {:pitch 43
            :length 0.5
            :time 122}
           {:pitch 40
            :length 0.5
            :time 122.8}
           {:pitch 40
            :length 0.25
            :time 123.4}
           {:pitch 40
            :length 0.5
            :time 123.6}
           {:pitch 38
            :length 0.5
            :time 124.4}
           {:pitch 38
            :length 0.25
            :time 125}
           {:pitch 38
            :length 0.5
            :time 125.2}
           {:pitch 35
            :length 0.5
            :time 125.6}
           {:pitch 36
            :length 0.5
            :time 126}
           {:pitch 36
            :length 0.25
            :time 126.6}
           {:pitch 36
            :length 0.5
            :time 126.8}
           {:pitch 43
            :length 0.5
            :time 127.6}
           {:pitch 43
            :length 0.25
            :time 128.2}
           {:pitch 43
            :length 0.5
            :time 128.4}
           {:pitch 41
            :length 0.5
            :time 129.2}
           {:pitch 40
            :length 0.5
            :time 132.4}
           {:pitch 38
            :length 0.5
            :time 135.6}
           {:pitch 36
            :length 0.5
            :time 136}
           {:pitch 35
            :length 0.5
            :time 136.4}
           {:pitch 33
            :length 0.5
            :time 136.8}
           {:pitch 45
            :length 0.5
            :time 137.2}
           {:pitch 40
            :length 0.25
            :time 137.8}
           {:pitch 45
            :length 0.25
            :time 138}
           {:pitch 40
            :length 0.5
            :time 138.2}
           {:pitch 40
            :length 0.25
            :time 138.6}
           {:pitch 43
            :length 0.5
            :time 138.8}
           {:pitch 43
            :length 0.25
            :time 139.4}
           {:pitch 43
            :length 0.5
            :time 139.6}
           {:pitch 42
            :length 0.5
            :time 140.4}
           {:pitch 38
            :length 0.25
            :time 141}
           {:pitch 42
            :length 0.25
            :time 141.2}
           {:pitch 38
            :length 0.5
            :time 141.4}
           {:pitch 38
            :length 0.25
            :time 141.8}
           {:pitch 40
            :length 0.5
            :time 142}
           {:pitch 40
            :length 0.25
            :time 142.6}
           {:pitch 40
            :length 0.5
            :time 142.8}
           {:pitch 45
            :length 0.5
            :time 143.6}
           {:pitch 40
            :length 0.25
            :time 144.2}
           {:pitch 45
            :length 0.25
            :time 144.4}
           {:pitch 40
            :length 0.5
            :time 144.6}
           {:pitch 40
            :length 0.25
            :time 145}
           {:pitch 43
            :length 0.5
            :time 145.2}
           {:pitch 43
            :length 0.25
            :time 145.8}
           {:pitch 43
            :length 0.5
            :time 146}
           {:pitch 42
            :length 0.5
            :time 146.8}
           {:pitch 38
            :length 0.25
            :time 147.4}
           {:pitch 42
            :length 0.25
            :time 147.6}
           {:pitch 38
            :length 0.5
            :time 147.8}
           {:pitch 38
            :length 0.25
            :time 148.2}
           {:pitch 40
            :length 0.5
            :time 148.4}
           {:pitch 40
            :length 0.25
            :time 149}
           {:pitch 40
            :length 0.5
            :time 149.2}
           {:pitch 41
            :length 0.5
            :time 150}
           {:pitch 36
            :length 0.25
            :time 150.4}
           {:pitch 38
            :length 0.25
            :time 150.6}
           {:pitch 41
            :length 0.25
            :time 150.8}
           {:pitch 36
            :length 0.25
            :time 151}
           {:pitch 41
            :length 0.25
            :time 151.2}
           {:pitch 41
            :length 0.25
            :time 151.4}
           {:pitch 40
            :length 0.5
            :time 151.6}
           {:pitch 40
            :length 0.25
            :time 152.2}
           {:pitch 40
            :length 0.5
            :time 152.4}
           {:pitch 41
            :length 0.5
            :time 153.2}
           {:pitch 36
            :length 0.25
            :time 153.6}
           {:pitch 38
            :length 0.25
            :time 153.8}
           {:pitch 41
            :length 0.25
            :time 154}
           {:pitch 36
            :length 0.25
            :time 154.2}
           {:pitch 41
            :length 0.25
            :time 154.4}
           {:pitch 40
            :length 0.25
            :time 154.6}
           {:pitch 38
            :length 0.5
            :time 154.8}
           {:pitch 38
            :length 0.25
            :time 155.4}
           {:pitch 38
            :length 0.5
            :time 155.6}
           {:pitch 38
            :length 0.5
            :time 156.4}
           {:pitch 38
            :length 0.25
            :time 157}
           {:pitch 38
            :length 0.5
            :time 157.2}
           {:pitch 45
            :length 0.5
            :time 158}
           {:pitch 45
            :length 0.25
            :time 158.6}
           {:pitch 45
            :length 0.5
            :time 158.8}
           {:pitch 47
            :length 0.25
            :time 159.2}
           {:pitch 43
            :length 0.25
            :time 159.4}
           {:pitch 43
            :length 0.5
            :time 159.6}
           {:pitch 43
            :length 0.25
            :time 160.2}
           {:pitch 43
            :length 0.5
            :time 160.4}
           {:pitch 38
            :length 0.5
            :time 161.2}
           {:pitch 38
            :length 0.25
            :time 161.8}
           {:pitch 38
            :length 0.5
            :time 162}
           {:pitch 38
            :length 0.5
            :time 162.8}
           {:pitch 38
            :length 0.25
            :time 163.4}
           {:pitch 38
            :length 0.5
            :time 163.6}
           {:pitch 45
            :length 0.5
            :time 164.4}
           {:pitch 45
            :length 0.25
            :time 165}
           {:pitch 45
            :length 0.5
            :time 165.2}
           {:pitch 47
            :length 0.25
            :time 165.6}
           {:pitch 43
            :length 0.25
            :time 165.8}
           {:pitch 43
            :length 0.5
            :time 166}
           {:pitch 43
            :length 0.25
            :time 166.6}
           {:pitch 43
            :length 0.5
            :time 166.8}
           {:pitch 38
            :length 0.5
            :time 167.6}
           {:pitch 38
            :length 0.25
            :time 168.2}
           {:pitch 38
            :length 0.5
            :time 168.4}
           {:pitch 38
            :length 0.5
            :time 169.2}
           {:pitch 38
            :length 0.25
            :time 169.8}
           {:pitch 38
            :length 0.5
            :time 170}
           {:pitch 45
            :length 0.5
            :time 170.8}
           {:pitch 45
            :length 0.25
            :time 171.4}
           {:pitch 45
            :length 0.5
            :time 171.6}
           {:pitch 47
            :length 0.25
            :time 172}
           {:pitch 43
            :length 0.25
            :time 172.2}
           {:pitch 43
            :length 0.5
            :time 172.4}
           {:pitch 43
            :length 0.25
            :time 173}
           {:pitch 43
            :length 0.5
            :time 173.2}
           {:pitch 38
            :length 0.5
            :time 174}
           {:pitch 38
            :length 0.25
            :time 174.6}
           {:pitch 38
            :length 0.5
            :time 174.8}
           {:pitch 38
            :length 0.5
            :time 175.6}
           {:pitch 38
            :length 0.25
            :time 176.2}
           {:pitch 38
            :length 0.5
            :time 176.4}
           {:pitch 45
            :length 0.5
            :time 177.2}
           {:pitch 45
            :length 0.25
            :time 177.8}
           {:pitch 45
            :length 0.5
            :time 178}
           {:pitch 47
            :length 0.25
            :time 178.4}
           {:pitch 43
            :length 0.25
            :time 178.6}
           {:pitch 43
            :length 0.5
            :time 178.8}
           {:pitch 43
            :length 0.25
            :time 179.4}
           {:pitch 43
            :length 0.5
            :time 179.6}
           {:pitch 38
            :length 0.5
            :time 180.4}
           {:pitch 38
            :length 0.25
            :time 181}
           {:pitch 38
            :length 0.5
            :time 181.2}
           {:pitch 38
            :length 0.5
            :time 182}
           {:pitch 38
            :length 0.25
            :time 182.6}
           {:pitch 38
            :length 0.5
            :time 182.8}
           {:pitch 45
            :length 0.5
            :time 183.6}
           {:pitch 45
            :length 0.25
            :time 184.2}
           {:pitch 45
            :length 0.5
            :time 184.4}
           {:pitch 47
            :length 0.25
            :time 184.8}
           {:pitch 43
            :length 0.25
            :time 185}
           {:pitch 43
            :length 0.5
            :time 185.2}
           {:pitch 43
            :length 0.25
            :time 185.8}
           {:pitch 43
            :length 0.5
            :time 186}
           {:pitch 38
            :length 0.5
            :time 186.8}
           {:pitch 38
            :length 0.25
            :time 187.4}
           {:pitch 38
            :length 0.5
            :time 187.6}
           {:pitch 38
            :length 0.5
            :time 188.4}
           {:pitch 38
            :length 0.25
            :time 189}
           {:pitch 38
            :length 0.5
            :time 189.2}
           {:pitch 45
            :length 0.5
            :time 190}
           {:pitch 45
            :length 0.25
            :time 190.6}
           {:pitch 45
            :length 0.5
            :time 190.8}
           {:pitch 47
            :length 0.25
            :time 191.2}
           {:pitch 43
            :length 0.25
            :time 191.4}
           {:pitch 43
            :length 0.5
            :time 191.6}
           {:pitch 43
            :length 0.25
            :time 192.2}
           {:pitch 43
            :length 0.5
            :time 192.4}
           {:pitch 38
            :length 0.5
            :time 193.2}
           {:pitch 38
            :length 0.25
            :time 193.8}
           {:pitch 38
            :length 0.5
            :time 194}
           {:pitch 38
            :length 0.5
            :time 194.8}
           {:pitch 38
            :length 0.25
            :time 195.4}
           {:pitch 38
            :length 0.5
            :time 195.6}
           {:pitch 45
            :length 0.5
            :time 196.4}
           {:pitch 45
            :length 0.25
            :time 197}
           {:pitch 45
            :length 0.5
            :time 197.2}
           {:pitch 47
            :length 0.25
            :time 197.6}
           {:pitch 43
            :length 0.25
            :time 197.8}
           {:pitch 43
            :length 0.5
            :time 198}
           {:pitch 43
            :length 0.25
            :time 198.6}
           {:pitch 43
            :length 0.5
            :time 198.8}
           {:pitch 38
            :length 0.5
            :time 199.6}
           {:pitch 38
            :length 0.25
            :time 200.2}
           {:pitch 38
            :length 0.5
            :time 200.4}
           {:pitch 38
            :length 0.5
            :time 201.2}
           {:pitch 38
            :length 0.25
            :time 201.8}
           {:pitch 38
            :length 0.5
            :time 202}
           {:pitch 45
            :length 0.5
            :time 202.8}
           {:pitch 45
            :length 0.25
            :time 203.4}
           {:pitch 45
            :length 0.5
            :time 203.6}
           {:pitch 47
            :length 0.25
            :time 204}
           {:pitch 43
            :length 0.25
            :time 204.2}
           {:pitch 43
            :length 0.5
            :time 204.4}
           {:pitch 43
            :length 0.25
            :time 205}
           {:pitch 43
            :length 0.5
            :time 205.2}
           {:pitch 38
            :length 0.5
            :time 206}
           {:pitch 38
            :length 0.25
            :time 206.6}
           {:pitch 38
            :length 0.5
            :time 206.8}
           {:pitch 38
            :length 0.5
            :time 207.6}
           {:pitch 38
            :length 0.25
            :time 208.2}
           {:pitch 38
            :length 0.5
            :time 208.4}
           {:pitch 45
            :length 0.5
            :time 209.2}
           {:pitch 45
            :length 0.25
            :time 209.8}
           {:pitch 45
            :length 0.5
            :time 210}
           {:pitch 47
            :length 0.25
            :time 210.4}
           {:pitch 43
            :length 0.25
            :time 210.6}
           {:pitch 43
            :length 0.5
            :time 210.8}
           {:pitch 43
            :length 0.25
            :time 211.4}
           {:pitch 43
            :length 0.5
            :time 211.6}
           {:pitch 38
            :length 0.5
            :time 212.4}
           {:pitch 38
            :length 0.25
            :time 213}
           {:pitch 38
            :length 0.5
            :time 213.2}
           {:pitch 38
            :length 0.5
            :time 214}
           {:pitch 38
            :length 0.25
            :time 214.6}
           {:pitch 38
            :length 0.5
            :time 214.8}])

(defn drums1 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 15, :length 0.5, :pitch 67}
        {:time 14, :length 0.07, :pitch 77}
        {:time 13, :length 0.07, :pitch 77}
        {:time 12, :length 0.07, :pitch 77}
        {:time 11, :length 0.5, :pitch 67}
        {:time 10, :length 0.07, :pitch 77}
        {:time 9, :length 0.07, :pitch 77}
        {:time 8, :length 0.07, :pitch 77}
        {:time 7, :length 0.5, :pitch 67}
        {:time 6, :length 0.07, :pitch 77}
        {:time 5, :length 0.07, :pitch 77}
        {:time 4, :length 0.07, :pitch 77}
        {:time 3, :length 0.5, :pitch 67}
        {:time 2, :length 0.07, :pitch 77}
        {:time 1, :length 0.07, :pitch 77}
        {:time 0, :length 0.07, :pitch 77}]))

(defn drums2 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 7.5, :length 0.07, :pitch 77}
            {:time 7, :length 0.5, :pitch 67}
            {:time 6.5, :length 0.07, :pitch 77}
            {:time 6, :length 0.07, :pitch 77}
            {:time 5.5, :length 0.07, :pitch 77}
            {:time 5, :length 0.5, :pitch 67}
            {:time 4.5, :length 0.07, :pitch 77}
            {:time 4, :length 0.07, :pitch 77}
            {:time 3.5, :length 0.07, :pitch 77}
            {:time 3, :length 0.5, :pitch 67}
            {:time 2.5, :length 0.07, :pitch 77}
            {:time 2, :length 0.07, :pitch 77}
            {:time 1.5, :length 0.07, :pitch 77}
            {:time 1, :length 0.5, :pitch 67}
            {:time 0.5, :length 0.07, :pitch 77}
            {:time 0, :length 0.07, :pitch 77}]))

(defn drums-pat-1 [time]
  (map (fn [m] (update m :time #(+ % time)))
       (concat (drums1 0) (drums1 16) (drums1 32) (drums1 48) (drums1 64) (drums1 80) (drums1 96) (drums1 112)
               [{:time 131, :length 0.5, :pitch 67}
            {:time 130, :length 0.07, :pitch 77}
            {:time 129, :length 0.07, :pitch 77}
            {:time 128, :length 0.07, :pitch 77}])))

(defn drums-pat-2 [time]
  (map (fn [m] (update m :time #(+ % time)))
       (concat
        (drums2 132)
        (drums2 140)
        (drums2 148)
        (drums2 156)
        (drums2 164)
        (drums2 172)
        (drums2 180)
        (drums2 188))))

#_(def drums (concat (drums-pat-1 0) (drums-pat-2 0) (drums-pat-1 196) (drums-pat-2 196) (drums-pat-2 260) (drums-pat-2 324) (drums2 520) (drums2 528)))

(def drums [{:length 0.07
             :time 1.2}
            {:length 0.07
             :time 1.6}
            {:length 0.07
             :time 2}
            {:length 0.5
             :time 2.4}
            {:length 0.07
             :time 2.8}
            {:length 0.07
             :time 3.2}
            {:length 0.07
             :time 3.6}
            {:length 0.5
             :time 4}
            {:length 0.07
             :time 4.4}
            {:length 0.07
             :time 4.8}
            {:length 0.07
             :time 5.2}
            {:length 0.5
             :time 5.6}
            {:length 0.07
             :time 6}
            {:length 0.07
             :time 6.4}
            {:length 0.07
             :time 6.8}
            {:length 0.5
             :time 7.2}
            {:length 0.07
             :time 7.6}
            {:length 0.07
             :time 8}
            {:length 0.07
             :time 8.4}
            {:length 0.5
             :time 8.8}
            {:length 0.07
             :time 9.2}
            {:length 0.07
             :time 9.6}
            {:length 0.07
             :time 10}
            {:length 0.5
             :time 10.4}
            {:length 0.07
             :time 10.8}
            {:length 0.07
             :time 11.2}
            {:length 0.07
             :time 11.6}
            {:length 0.5
             :time 12}
            {:length 0.07
             :time 12.4}
            {:length 0.07
             :time 12.8}
            {:length 0.07
             :time 13.2}
            {:length 0.5
             :time 13.6}
            {:length 0.07
             :time 14}
            {:length 0.07
             :time 14.4}
            {:length 0.07
             :time 14.8}
            {:length 0.5
             :time 15.2}
            {:length 0.07
             :time 15.6}
            {:length 0.07
             :time 16}
            {:length 0.07
             :time 16.4}
            {:length 0.5
             :time 16.8}
            {:length 0.07
             :time 17.2}
            {:length 0.07
             :time 17.6}
            {:length 0.07
             :time 18}
            {:length 0.5
             :time 18.4}
            {:length 0.07
             :time 18.8}
            {:length 0.07
             :time 19.2}
            {:length 0.07
             :time 19.6}
            {:length 0.5
             :time 20}
            {:length 0.07
             :time 20.4}
            {:length 0.07
             :time 20.8}
            {:length 0.07
             :time 21.2}
            {:length 0.5
             :time 21.6}
            {:length 0.07
             :time 22}
            {:length 0.07
             :time 22.4}
            {:length 0.07
             :time 22.8}
            {:length 0.5
             :time 23.2}
            {:length 0.07
             :time 23.6}
            {:length 0.07
             :time 24}
            {:length 0.07
             :time 24.4}
            {:length 0.5
             :time 24.8}
            {:length 0.07
             :time 25.2}
            {:length 0.07
             :time 25.6}
            {:length 0.07
             :time 26}
            {:length 0.5
             :time 26.4}
            {:length 0.07
             :time 26.8}
            {:length 0.07
             :time 27.2}
            {:length 0.07
             :time 27.6}
            {:length 0.5
             :time 28}
            {:length 0.07
             :time 28.4}
            {:length 0.07
             :time 28.8}
            {:length 0.07
             :time 29.2}
            {:length 0.5
             :time 29.6}
            {:length 0.07
             :time 30}
            {:length 0.07
             :time 30.4}
            {:length 0.07
             :time 30.8}
            {:length 0.5
             :time 31.2}
            {:length 0.07
             :time 31.6}
            {:length 0.07
             :time 32}
            {:length 0.07
             :time 32.4}
            {:length 0.5
             :time 32.8}
            {:length 0.07
             :time 33.2}
            {:length 0.07
             :time 33.6}
            {:length 0.07
             :time 34}
            {:length 0.5
             :time 34.4}
            {:length 0.07
             :time 34.8}
            {:length 0.07
             :time 35.2}
            {:length 0.07
             :time 35.6}
            {:length 0.5
             :time 36}
            {:length 0.07
             :time 36.4}
            {:length 0.07
             :time 36.8}
            {:length 0.07
             :time 37.2}
            {:length 0.5
             :time 37.6}
            {:length 0.07
             :time 38}
            {:length 0.07
             :time 38.4}
            {:length 0.07
             :time 38.8}
            {:length 0.5
             :time 39.2}
            {:length 0.07
             :time 39.6}
            {:length 0.07
             :time 40}
            {:length 0.07
             :time 40.4}
            {:length 0.5
             :time 40.8}
            {:length 0.07
             :time 41.2}
            {:length 0.07
             :time 41.6}
            {:length 0.07
             :time 42}
            {:length 0.5
             :time 42.4}
            {:length 0.07
             :time 42.8}
            {:length 0.07
             :time 43.2}
            {:length 0.07
             :time 43.6}
            {:length 0.5
             :time 44}
            {:length 0.07
             :time 44.4}
            {:length 0.07
             :time 44.8}
            {:length 0.07
             :time 45.2}
            {:length 0.5
             :time 45.6}
            {:length 0.07
             :time 46}
            {:length 0.07
             :time 46.4}
            {:length 0.07
             :time 46.8}
            {:length 0.5
             :time 47.2}
            {:length 0.07
             :time 47.6}
            {:length 0.07
             :time 48}
            {:length 0.07
             :time 48.4}
            {:length 0.5
             :time 48.8}
            {:length 0.07
             :time 49.2}
            {:length 0.07
             :time 49.6}
            {:length 0.07
             :time 50}
            {:length 0.5
             :time 50.4}
            {:length 0.07
             :time 50.8}
            {:length 0.07
             :time 51.2}
            {:length 0.07
             :time 51.6}
            {:length 0.5
             :time 52}
            {:length 0.07
             :time 52.4}
            {:length 0.07
             :time 52.8}
            {:length 0.07
             :time 53.2}
            {:length 0.5
             :time 53.6}
            {:length 0.07
             :time 54}
            {:length 0.07
             :time 54.2}
            {:length 0.5
             :time 54.4}
            {:length 0.07
             :time 54.6}
            {:length 0.07
             :time 54.8}
            {:length 0.07
             :time 55}
            {:length 0.5
             :time 55.2}
            {:length 0.07
             :time 55.4}
            {:length 0.07
             :time 55.6}
            {:length 0.07
             :time 55.8}
            {:length 0.5
             :time 56}
            {:length 0.07
             :time 56.2}
            {:length 0.07
             :time 56.4}
            {:length 0.07
             :time 56.6}
            {:length 0.5
             :time 56.8}
            {:length 0.07
             :time 57}
            {:length 0.07
             :time 57.2}
            {:length 0.07
             :time 57.4}
            {:length 0.5
             :time 57.6}
            {:length 0.07
             :time 57.8}
            {:length 0.07
             :time 58}
            {:length 0.07
             :time 58.2}
            {:length 0.5
             :time 58.4}
            {:length 0.07
             :time 58.6}
            {:length 0.07
             :time 58.8}
            {:length 0.07
             :time 59}
            {:length 0.5
             :time 59.2}
            {:length 0.07
             :time 59.4}
            {:length 0.07
             :time 59.6}
            {:length 0.07
             :time 59.8}
            {:length 0.5
             :time 60}
            {:length 0.07
             :time 60.2}
            {:length 0.07
             :time 60.4}
            {:length 0.07
             :time 60.6}
            {:length 0.5
             :time 60.8}
            {:length 0.07
             :time 61}
            {:length 0.07
             :time 61.2}
            {:length 0.07
             :time 61.4}
            {:length 0.5
             :time 61.6}
            {:length 0.07
             :time 61.8}
            {:length 0.07
             :time 62}
            {:length 0.07
             :time 62.2}
            {:length 0.5
             :time 62.4}
            {:length 0.07
             :time 62.6}
            {:length 0.07
             :time 62.8}
            {:length 0.07
             :time 63}
            {:length 0.5
             :time 63.2}
            {:length 0.07
             :time 63.4}
            {:length 0.07
             :time 63.6}
            {:length 0.07
             :time 63.8}
            {:length 0.5
             :time 64}
            {:length 0.07
             :time 64.2}
            {:length 0.07
             :time 64.4}
            {:length 0.07
             :time 64.6}
            {:length 0.5
             :time 64.8}
            {:length 0.07
             :time 65}
            {:length 0.07
             :time 65.2}
            {:length 0.07
             :time 65.4}
            {:length 0.5
             :time 65.6}
            {:length 0.07
             :time 65.8}
            {:length 0.07
             :time 66}
            {:length 0.07
             :time 66.2}
            {:length 0.5
             :time 66.4}
            {:length 0.07
             :time 66.6}
            {:length 0.07
             :time 66.8}
            {:length 0.07
             :time 67}
            {:length 0.5
             :time 67.2}
            {:length 0.07
             :time 67.4}
            {:length 0.07
             :time 67.6}
            {:length 0.07
             :time 67.8}
            {:length 0.5
             :time 68}
            {:length 0.07
             :time 68.2}
            {:length 0.07
             :time 68.4}
            {:length 0.07
             :time 68.6}
            {:length 0.5
             :time 68.8}
            {:length 0.07
             :time 69}
            {:length 0.07
             :time 69.2}
            {:length 0.07
             :time 69.4}
            {:length 0.5
             :time 69.6}
            {:length 0.07
             :time 69.8}
            {:length 0.07
             :time 70}
            {:length 0.07
             :time 70.2}
            {:length 0.5
             :time 70.4}
            {:length 0.07
             :time 70.6}
            {:length 0.07
             :time 70.8}
            {:length 0.07
             :time 71}
            {:length 0.5
             :time 71.2}
            {:length 0.07
             :time 71.4}
            {:length 0.07
             :time 71.6}
            {:length 0.07
             :time 71.8}
            {:length 0.5
             :time 72}
            {:length 0.07
             :time 72.2}
            {:length 0.07
             :time 72.4}
            {:length 0.07
             :time 72.6}
            {:length 0.5
             :time 72.8}
            {:length 0.07
             :time 73}
            {:length 0.07
             :time 73.2}
            {:length 0.07
             :time 73.4}
            {:length 0.5
             :time 73.6}
            {:length 0.07
             :time 73.8}
            {:length 0.07
             :time 74}
            {:length 0.07
             :time 74.2}
            {:length 0.5
             :time 74.4}
            {:length 0.07
             :time 74.6}
            {:length 0.07
             :time 74.8}
            {:length 0.07
             :time 75}
            {:length 0.5
             :time 75.2}
            {:length 0.07
             :time 75.4}
            {:length 0.07
             :time 75.6}
            {:length 0.07
             :time 75.8}
            {:length 0.5
             :time 76}
            {:length 0.07
             :time 76.2}
            {:length 0.07
             :time 76.4}
            {:length 0.07
             :time 76.6}
            {:length 0.5
             :time 76.8}
            {:length 0.07
             :time 77}
            {:length 0.07
             :time 77.2}
            {:length 0.07
             :time 77.4}
            {:length 0.5
             :time 77.6}
            {:length 0.07
             :time 77.8}
            {:length 0.07
             :time 78}
            {:length 0.07
             :time 78.2}
            {:length 0.5
             :time 78.4}
            {:length 0.07
             :time 78.6}
            {:length 0.07
             :time 78.8}
            {:length 0.07
             :time 79}
            {:length 0.5
             :time 79.2}
            {:length 0.07
             :time 79.4}
            {:length 0.07
             :time 79.6}
            {:length 0.07
             :time 80}
            {:length 0.07
             :time 80.4}
            {:length 0.5
             :time 80.8}
            {:length 0.07
             :time 81.2}
            {:length 0.07
             :time 81.6}
            {:length 0.07
             :time 82}
            {:length 0.5
             :time 82.4}
            {:length 0.07
             :time 82.8}
            {:length 0.07
             :time 83.2}
            {:length 0.07
             :time 83.6}
            {:length 0.5
             :time 84}
            {:length 0.07
             :time 84.4}
            {:length 0.07
             :time 84.8}
            {:length 0.07
             :time 85.2}
            {:length 0.5
             :time 85.6}
            {:length 0.07
             :time 86}
            {:length 0.07
             :time 86.4}
            {:length 0.07
             :time 86.8}
            {:length 0.5
             :time 87.2}
            {:length 0.07
             :time 87.6}
            {:length 0.07
             :time 88}
            {:length 0.07
             :time 88.4}
            {:length 0.5
             :time 88.8}
            {:length 0.07
             :time 89.2}
            {:length 0.07
             :time 89.6}
            {:length 0.07
             :time 90}
            {:length 0.5
             :time 90.4}
            {:length 0.07
             :time 90.8}
            {:length 0.07
             :time 91.2}
            {:length 0.07
             :time 91.6}
            {:length 0.5
             :time 92}
            {:length 0.07
             :time 92.4}
            {:length 0.07
             :time 92.8}
            {:length 0.07
             :time 93.2}
            {:length 0.5
             :time 93.6}
            {:length 0.07
             :time 94}
            {:length 0.07
             :time 94.4}
            {:length 0.07
             :time 94.8}
            {:length 0.5
             :time 95.2}
            {:length 0.07
             :time 95.6}
            {:length 0.07
             :time 96}
            {:length 0.07
             :time 96.4}
            {:length 0.5
             :time 96.8}
            {:length 0.07
             :time 97.2}
            {:length 0.07
             :time 97.6}
            {:length 0.07
             :time 98}
            {:length 0.5
             :time 98.4}
            {:length 0.07
             :time 98.8}
            {:length 0.07
             :time 99.2}
            {:length 0.07
             :time 99.6}
            {:length 0.5
             :time 100}
            {:length 0.07
             :time 100.4}
            {:length 0.07
             :time 100.8}
            {:length 0.07
             :time 101.2}
            {:length 0.5
             :time 101.6}
            {:length 0.07
             :time 102}
            {:length 0.07
             :time 102.4}
            {:length 0.07
             :time 102.8}
            {:length 0.5
             :time 103.2}
            {:length 0.07
             :time 103.6}
            {:length 0.07
             :time 104}
            {:length 0.07
             :time 104.4}
            {:length 0.5
             :time 104.8}
            {:length 0.07
             :time 105.2}
            {:length 0.07
             :time 105.6}
            {:length 0.07
             :time 106}
            {:length 0.5
             :time 106.4}
            {:length 0.07
             :time 106.8}
            {:length 0.07
             :time 107.2}
            {:length 0.07
             :time 107.6}
            {:length 0.5
             :time 108}
            {:length 0.07
             :time 108.4}
            {:length 0.07
             :time 108.8}
            {:length 0.07
             :time 109.2}
            {:length 0.5
             :time 109.6}
            {:length 0.07
             :time 110}
            {:length 0.07
             :time 110.4}
            {:length 0.07
             :time 110.8}
            {:length 0.5
             :time 111.2}
            {:length 0.07
             :time 111.6}
            {:length 0.07
             :time 112}
            {:length 0.07
             :time 112.4}
            {:length 0.5
             :time 112.8}
            {:length 0.07
             :time 113.2}
            {:length 0.07
             :time 113.6}
            {:length 0.07
             :time 114}
            {:length 0.5
             :time 114.4}
            {:length 0.07
             :time 114.8}
            {:length 0.07
             :time 115.2}
            {:length 0.07
             :time 115.6}
            {:length 0.5
             :time 116}
            {:length 0.07
             :time 116.4}
            {:length 0.07
             :time 116.8}
            {:length 0.07
             :time 117.2}
            {:length 0.5
             :time 117.6}
            {:length 0.07
             :time 118}
            {:length 0.07
             :time 118.4}
            {:length 0.07
             :time 118.8}
            {:length 0.5
             :time 119.2}
            {:length 0.07
             :time 119.6}
            {:length 0.07
             :time 120}
            {:length 0.07
             :time 120.4}
            {:length 0.5
             :time 120.8}
            {:length 0.07
             :time 121.2}
            {:length 0.07
             :time 121.6}
            {:length 0.07
             :time 122}
            {:length 0.5
             :time 122.4}
            {:length 0.07
             :time 122.8}
            {:length 0.07
             :time 123.2}
            {:length 0.07
             :time 123.6}
            {:length 0.5
             :time 124}
            {:length 0.07
             :time 124.4}
            {:length 0.07
             :time 124.8}
            {:length 0.07
             :time 125.2}
            {:length 0.5
             :time 125.6}
            {:length 0.07
             :time 126}
            {:length 0.07
             :time 126.4}
            {:length 0.07
             :time 126.8}
            {:length 0.5
             :time 127.2}
            {:length 0.07
             :time 127.6}
            {:length 0.07
             :time 128}
            {:length 0.07
             :time 128.4}
            {:length 0.5
             :time 128.8}
            {:length 0.07
             :time 129.2}
            {:length 0.07
             :time 129.6}
            {:length 0.07
             :time 130}
            {:length 0.5
             :time 130.4}
            {:length 0.07
             :time 130.8}
            {:length 0.07
             :time 131.2}
            {:length 0.07
             :time 131.6}
            {:length 0.5
             :time 132}
            {:length 0.07
             :time 132.4}
            {:length 0.07
             :time 132.6}
            {:length 0.5
             :time 132.8}
            {:length 0.07
             :time 133}
            {:length 0.07
             :time 133.2}
            {:length 0.07
             :time 133.4}
            {:length 0.5
             :time 133.6}
            {:length 0.07
             :time 133.8}
            {:length 0.07
             :time 134}
            {:length 0.07
             :time 134.2}
            {:length 0.5
             :time 134.4}
            {:length 0.07
             :time 134.6}
            {:length 0.07
             :time 134.8}
            {:length 0.07
             :time 135}
            {:length 0.5
             :time 135.2}
            {:length 0.07
             :time 135.4}
            {:length 0.07
             :time 135.6}
            {:length 0.07
             :time 135.8}
            {:length 0.5
             :time 136}
            {:length 0.07
             :time 136.2}
            {:length 0.07
             :time 136.4}
            {:length 0.07
             :time 136.6}
            {:length 0.5
             :time 136.8}
            {:length 0.07
             :time 137}
            {:length 0.07
             :time 137.2}
            {:length 0.07
             :time 137.4}
            {:length 0.5
             :time 137.6}
            {:length 0.07
             :time 137.8}
            {:length 0.07
             :time 138}
            {:length 0.07
             :time 138.2}
            {:length 0.5
             :time 138.4}
            {:length 0.07
             :time 138.6}
            {:length 0.07
             :time 138.8}
            {:length 0.07
             :time 139}
            {:length 0.5
             :time 139.2}
            {:length 0.07
             :time 139.4}
            {:length 0.07
             :time 139.6}
            {:length 0.07
             :time 139.8}
            {:length 0.5
             :time 140}
            {:length 0.07
             :time 140.2}
            {:length 0.07
             :time 140.4}
            {:length 0.07
             :time 140.6}
            {:length 0.5
             :time 140.8}
            {:length 0.07
             :time 141}
            {:length 0.07
             :time 141.2}
            {:length 0.07
             :time 141.4}
            {:length 0.5
             :time 141.6}
            {:length 0.07
             :time 141.8}
            {:length 0.07
             :time 142}
            {:length 0.07
             :time 142.2}
            {:length 0.5
             :time 142.4}
            {:length 0.07
             :time 142.6}
            {:length 0.07
             :time 142.8}
            {:length 0.07
             :time 143}
            {:length 0.5
             :time 143.2}
            {:length 0.07
             :time 143.4}
            {:length 0.07
             :time 143.6}
            {:length 0.07
             :time 143.8}
            {:length 0.5
             :time 144}
            {:length 0.07
             :time 144.2}
            {:length 0.07
             :time 144.4}
            {:length 0.07
             :time 144.6}
            {:length 0.5
             :time 144.8}
            {:length 0.07
             :time 145}
            {:length 0.07
             :time 145.2}
            {:length 0.07
             :time 145.4}
            {:length 0.5
             :time 145.6}
            {:length 0.07
             :time 145.8}
            {:length 0.07
             :time 146}
            {:length 0.07
             :time 146.2}
            {:length 0.5
             :time 146.4}
            {:length 0.07
             :time 146.6}
            {:length 0.07
             :time 146.8}
            {:length 0.07
             :time 147}
            {:length 0.5
             :time 147.2}
            {:length 0.07
             :time 147.4}
            {:length 0.07
             :time 147.6}
            {:length 0.07
             :time 147.8}
            {:length 0.5
             :time 148}
            {:length 0.07
             :time 148.2}
            {:length 0.07
             :time 148.4}
            {:length 0.07
             :time 148.6}
            {:length 0.5
             :time 148.8}
            {:length 0.07
             :time 149}
            {:length 0.07
             :time 149.2}
            {:length 0.07
             :time 149.4}
            {:length 0.5
             :time 149.6}
            {:length 0.07
             :time 149.8}
            {:length 0.07
             :time 150}
            {:length 0.07
             :time 150.2}
            {:length 0.5
             :time 150.4}
            {:length 0.07
             :time 150.6}
            {:length 0.07
             :time 150.8}
            {:length 0.07
             :time 151}
            {:length 0.5
             :time 151.2}
            {:length 0.07
             :time 151.4}
            {:length 0.07
             :time 151.6}
            {:length 0.07
             :time 151.8}
            {:length 0.5
             :time 152}
            {:length 0.07
             :time 152.2}
            {:length 0.07
             :time 152.4}
            {:length 0.07
             :time 152.6}
            {:length 0.5
             :time 152.8}
            {:length 0.07
             :time 153}
            {:length 0.07
             :time 153.2}
            {:length 0.07
             :time 153.4}
            {:length 0.5
             :time 153.6}
            {:length 0.07
             :time 153.8}
            {:length 0.07
             :time 154}
            {:length 0.07
             :time 154.2}
            {:length 0.5
             :time 154.4}
            {:length 0.07
             :time 154.6}
            {:length 0.07
             :time 154.8}
            {:length 0.07
             :time 155}
            {:length 0.5
             :time 155.2}
            {:length 0.07
             :time 155.4}
            {:length 0.07
             :time 155.6}
            {:length 0.07
             :time 155.8}
            {:length 0.5
             :time 156}
            {:length 0.07
             :time 156.2}
            {:length 0.07
             :time 156.4}
            {:length 0.07
             :time 156.6}
            {:length 0.5
             :time 156.8}
            {:length 0.07
             :time 157}
            {:length 0.07
             :time 157.2}
            {:length 0.07
             :time 157.4}
            {:length 0.5
             :time 157.6}
            {:length 0.07
             :time 157.8}
            {:length 0.07
             :time 158}
            {:length 0.07
             :time 158.2}
            {:length 0.5
             :time 158.4}
            {:length 0.07
             :time 158.6}
            {:length 0.07
             :time 158.8}
            {:length 0.07
             :time 159}
            {:length 0.5
             :time 159.2}
            {:length 0.07
             :time 159.4}
            {:length 0.07
             :time 159.6}
            {:length 0.07
             :time 159.8}
            {:length 0.5
             :time 160}
            {:length 0.07
             :time 160.2}
            {:length 0.07
             :time 160.4}
            {:length 0.07
             :time 160.6}
            {:length 0.5
             :time 160.8}
            {:length 0.07
             :time 161}
            {:length 0.07
             :time 161.2}
            {:length 0.07
             :time 161.4}
            {:length 0.5
             :time 161.6}
            {:length 0.07
             :time 161.8}
            {:length 0.07
             :time 162}
            {:length 0.07
             :time 162.2}
            {:length 0.5
             :time 162.4}
            {:length 0.07
             :time 162.6}
            {:length 0.07
             :time 162.8}
            {:length 0.07
             :time 163}
            {:length 0.5
             :time 163.2}
            {:length 0.07
             :time 163.4}
            {:length 0.07
             :time 163.6}
            {:length 0.07
             :time 163.8}
            {:length 0.5
             :time 164}
            {:length 0.07
             :time 164.2}
            {:length 0.07
             :time 164.4}
            {:length 0.07
             :time 164.6}
            {:length 0.5
             :time 164.8}
            {:length 0.07
             :time 165}
            {:length 0.07
             :time 165.2}
            {:length 0.07
             :time 165.4}
            {:length 0.5
             :time 165.6}
            {:length 0.07
             :time 165.8}
            {:length 0.07
             :time 166}
            {:length 0.07
             :time 166.2}
            {:length 0.5
             :time 166.4}
            {:length 0.07
             :time 166.6}
            {:length 0.07
             :time 166.8}
            {:length 0.07
             :time 167}
            {:length 0.5
             :time 167.2}
            {:length 0.07
             :time 167.4}
            {:length 0.07
             :time 167.6}
            {:length 0.07
             :time 167.8}
            {:length 0.5
             :time 168}
            {:length 0.07
             :time 168.2}
            {:length 0.07
             :time 168.4}
            {:length 0.07
             :time 168.6}
            {:length 0.5
             :time 168.8}
            {:length 0.07
             :time 169}
            {:length 0.07
             :time 169.2}
            {:length 0.07
             :time 169.4}
            {:length 0.5
             :time 169.6}
            {:length 0.07
             :time 169.8}
            {:length 0.07
             :time 170}
            {:length 0.07
             :time 170.2}
            {:length 0.5
             :time 170.4}
            {:length 0.07
             :time 170.6}
            {:length 0.07
             :time 170.8}
            {:length 0.07
             :time 171}
            {:length 0.5
             :time 171.2}
            {:length 0.07
             :time 171.4}
            {:length 0.07
             :time 171.6}
            {:length 0.07
             :time 171.8}
            {:length 0.5
             :time 172}
            {:length 0.07
             :time 172.2}
            {:length 0.07
             :time 172.4}
            {:length 0.07
             :time 172.6}
            {:length 0.5
             :time 172.8}
            {:length 0.07
             :time 173}
            {:length 0.07
             :time 173.2}
            {:length 0.07
             :time 173.4}
            {:length 0.5
             :time 173.6}
            {:length 0.07
             :time 173.8}
            {:length 0.07
             :time 174}
            {:length 0.07
             :time 174.2}
            {:length 0.5
             :time 174.4}
            {:length 0.07
             :time 174.6}
            {:length 0.07
             :time 174.8}
            {:length 0.07
             :time 175}
            {:length 0.5
             :time 175.2}
            {:length 0.07
             :time 175.4}
            {:length 0.07
             :time 175.6}
            {:length 0.07
             :time 175.8}
            {:length 0.5
             :time 176}
            {:length 0.07
             :time 176.2}
            {:length 0.07
             :time 176.4}
            {:length 0.07
             :time 176.6}
            {:length 0.5
             :time 176.8}
            {:length 0.07
             :time 177}
            {:length 0.07
             :time 177.2}
            {:length 0.07
             :time 177.4}
            {:length 0.5
             :time 177.6}
            {:length 0.07
             :time 177.8}
            {:length 0.07
             :time 178}
            {:length 0.07
             :time 178.2}
            {:length 0.5
             :time 178.4}
            {:length 0.07
             :time 178.6}
            {:length 0.07
             :time 178.8}
            {:length 0.07
             :time 179}
            {:length 0.5
             :time 179.2}
            {:length 0.07
             :time 179.4}
            {:length 0.07
             :time 179.6}
            {:length 0.07
             :time 179.8}
            {:length 0.5
             :time 180}
            {:length 0.07
             :time 180.2}
            {:length 0.07
             :time 180.4}
            {:length 0.07
             :time 180.6}
            {:length 0.5
             :time 180.8}
            {:length 0.07
             :time 181}
            {:length 0.07
             :time 181.2}
            {:length 0.07
             :time 181.4}
            {:length 0.5
             :time 181.6}
            {:length 0.07
             :time 181.8}
            {:length 0.07
             :time 182}
            {:length 0.07
             :time 182.2}
            {:length 0.5
             :time 182.4}
            {:length 0.07
             :time 182.6}
            {:length 0.07
             :time 182.8}
            {:length 0.07
             :time 183}
            {:length 0.5
             :time 183.2}
            {:length 0.07
             :time 183.4}
            {:length 0.07
             :time 183.6}
            {:length 0.07
             :time 183.8}
            {:length 0.5
             :time 184}
            {:length 0.07
             :time 184.2}
            {:length 0.07
             :time 184.4}
            {:length 0.07
             :time 184.6}
            {:length 0.5
             :time 184.8}
            {:length 0.07
             :time 185}
            {:length 0.07
             :time 185.2}
            {:length 0.07
             :time 185.4}
            {:length 0.5
             :time 185.6}
            {:length 0.07
             :time 185.8}
            {:length 0.07
             :time 186}
            {:length 0.07
             :time 186.2}
            {:length 0.5
             :time 186.4}
            {:length 0.07
             :time 186.6}
            {:length 0.07
             :time 186.8}
            {:length 0.07
             :time 187}
            {:length 0.5
             :time 187.2}
            {:length 0.07
             :time 187.4}
            {:length 0.07
             :time 187.6}
            {:length 0.07
             :time 187.8}
            {:length 0.5
             :time 188}
            {:length 0.07
             :time 188.2}
            {:length 0.07
             :time 188.4}
            {:length 0.07
             :time 188.6}
            {:length 0.5
             :time 188.8}
            {:length 0.07
             :time 189}
            {:length 0.07
             :time 189.2}
            {:length 0.07
             :time 189.4}
            {:length 0.5
             :time 189.6}
            {:length 0.07
             :time 189.8}
            {:length 0.07
             :time 190}
            {:length 0.07
             :time 190.2}
            {:length 0.5
             :time 190.4}
            {:length 0.07
             :time 190.6}
            {:length 0.07
             :time 190.8}
            {:length 0.07
             :time 191}
            {:length 0.5
             :time 191.2}
            {:length 0.07
             :time 191.4}
            {:length 0.07
             :time 191.6}
            {:length 0.07
             :time 191.8}
            {:length 0.5
             :time 192}
            {:length 0.07
             :time 192.2}
            {:length 0.07
             :time 192.4}
            {:length 0.07
             :time 192.6}
            {:length 0.5
             :time 192.8}
            {:length 0.07
             :time 193}
            {:length 0.07
             :time 193.2}
            {:length 0.07
             :time 193.4}
            {:length 0.5
             :time 193.6}
            {:length 0.07
             :time 193.8}
            {:length 0.07
             :time 194}
            {:length 0.07
             :time 194.2}
            {:length 0.5
             :time 194.4}
            {:length 0.07
             :time 194.6}
            {:length 0.07
             :time 194.8}
            {:length 0.07
             :time 195}
            {:length 0.5
             :time 195.2}
            {:length 0.07
             :time 195.4}
            {:length 0.07
             :time 195.6}
            {:length 0.07
             :time 195.8}
            {:length 0.5
             :time 196}
            {:length 0.07
             :time 196.2}
            {:length 0.07
             :time 196.4}
            {:length 0.07
             :time 196.6}
            {:length 0.5
             :time 196.8}
            {:length 0.07
             :time 197}
            {:length 0.07
             :time 197.2}
            {:length 0.07
             :time 197.4}
            {:length 0.5
             :time 197.6}
            {:length 0.07
             :time 197.8}
            {:length 0.07
             :time 198}
            {:length 0.07
             :time 198.2}
            {:length 0.5
             :time 198.4}
            {:length 0.07
             :time 198.6}
            {:length 0.07
             :time 198.8}
            {:length 0.07
             :time 199}
            {:length 0.5
             :time 199.2}
            {:length 0.07
             :time 199.4}
            {:length 0.07
             :time 199.6}
            {:length 0.07
             :time 199.8}
            {:length 0.5
             :time 200}
            {:length 0.07
             :time 200.2}
            {:length 0.07
             :time 200.4}
            {:length 0.07
             :time 200.6}
            {:length 0.5
             :time 200.8}
            {:length 0.07
             :time 201}
            {:length 0.07
             :time 201.2}
            {:length 0.07
             :time 201.4}
            {:length 0.5
             :time 201.6}
            {:length 0.07
             :time 201.8}
            {:length 0.07
             :time 202}
            {:length 0.07
             :time 202.2}
            {:length 0.5
             :time 202.4}
            {:length 0.07
             :time 202.6}
            {:length 0.07
             :time 202.8}
            {:length 0.07
             :time 203}
            {:length 0.5
             :time 203.2}
            {:length 0.07
             :time 203.4}
            {:length 0.07
             :time 203.6}
            {:length 0.07
             :time 203.8}
            {:length 0.5
             :time 204}
            {:length 0.07
             :time 204.2}
            {:length 0.07
             :time 204.4}
            {:length 0.07
             :time 204.6}
            {:length 0.5
             :time 204.8}
            {:length 0.07
             :time 205}
            {:length 0.07
             :time 205.2}
            {:length 0.07
             :time 205.4}
            {:length 0.5
             :time 205.6}
            {:length 0.07
             :time 205.8}
            {:length 0.07
             :time 206}
            {:length 0.07
             :time 206.2}
            {:length 0.5
             :time 206.4}
            {:length 0.07
             :time 206.6}
            {:length 0.07
             :time 206.8}
            {:length 0.07
             :time 207}
            {:length 0.5
             :time 207.2}
            {:length 0.07
             :time 207.4}
            {:length 0.07
             :time 207.6}
            {:length 0.07
             :time 207.8}
            {:length 0.5
             :time 208}
            {:length 0.07
             :time 208.2}
            {:length 0.07
             :time 208.4}
            {:length 0.07
             :time 208.6}
            {:length 0.5
             :time 208.8}
            {:length 0.07
             :time 209}
            {:length 0.07
             :time 209.2}
            {:length 0.07
             :time 209.4}
            {:length 0.5
             :time 209.6}
            {:length 0.07
             :time 209.8}
            {:length 0.07
             :time 210}
            {:length 0.07
             :time 210.2}
            {:length 0.5
             :time 210.4}
            {:length 0.07
             :time 210.6}
            {:length 0.07
             :time 210.8}
            {:length 0.07
             :time 211}
            {:length 0.5
             :time 211.2}
            {:length 0.07
             :time 211.4}
            {:length 0.07
             :time 211.6}
            {:length 0.07
             :time 211.8}
            {:length 0.5
             :time 212}
            {:length 0.07
             :time 212.2}
            {:length 0.07
             :time 212.4}
            {:length 0.07
             :time 212.6}
            {:length 0.5
             :time 212.8}
            {:length 0.07
             :time 213}
            {:length 0.07
             :time 213.2}
            {:length 0.07
             :time 213.4}
            {:length 0.5
             :time 213.6}
            {:length 0.07
             :time 213.8}
            {:length 0.07
             :time 214}
            {:length 0.07
             :time 214.2}
            {:length 0.5
             :time 214.4}
            {:length 0.07
             :time 214.6}
            {:length 0.07
             :time 214.8}
            {:length 0.07
             :time 215}
            {:length 0.5
             :time 215.2}
            {:length 0.07
             :time 215.4}])

(def lead1 [{:time 1.5, :length 0.3, :pitch 69}
            {:time 2, :length 0.3, :pitch 71}
            {:time 2.5, :length 0.3, :pitch 74}
            {:time 3, :length 0.3, :pitch 76}
            {:time 3.5, :length 0.6, :pitch 78}
            {:time 5, :length 0.3, :pitch 76}
            {:time 6, :length 0.3, :pitch 74}
            {:time 6.5, :length 0.2, :pitch 76}
            {:time 7.5, :length 0.2, :pitch 74}
            {:time 7.75, :length 0.3, :pitch 76}
            {:time 8, :length 0.6, :pitch 74}
            {:time 9.5, :length 0.3, :pitch 71}
            {:time 10.0, :length 0.1, :pitch 71}
            {:time 10.1, :length 0.1, :pitch 70}
            {:time 10.2, :length 0.1, :pitch 69}
            {:time 10.3, :length 0.1, :pitch 68}
            {:time 10.4, :length 0.1, :pitch 67}
            {:time 10.5, :length 0.1, :pitch 66}
            {:time 10.6, :length 0.1, :pitch 65}
            {:time 10.7, :length 0.1, :pitch 64}
            {:time 10.8, :length 0.1, :pitch 63}
            {:time 10.9, :length 0.1, :pitch 62}
            {:time 11.0, :length 0.1, :pitch 61}
            {:time 11.1, :length 0.1, :pitch 60}
            {:time 11.2, :length 0.1, :pitch 60}
            {:time 11.299999999999999, :length 0.1, :pitch 60}
            {:time 12, :length 0.3, :pitch 74}
            {:time 12.5, :length 0.3, :pitch 74}
            {:time 13.5, :length 0.3, :pitch 74}
            {:time 14.5, :length 0.3, :pitch 71}
            {:time 15.5, :length 0.3, :pitch 69}
            {:time 16, :length 0.3, :pitch 71}
            {:time 16.0, :length 0.1, :pitch 71}
            {:time 16.1, :length 0.1, :pitch 70}
            {:time 16.2, :length 0.1, :pitch 69}
            {:time 16.3, :length 0.1, :pitch 68}
            {:time 16.4, :length 0.1, :pitch 67}
            {:time 16.5, :length 0.1, :pitch 66}
            {:time 16.6, :length 0.1, :pitch 65}
            {:time 16.7, :length 0.1, :pitch 64}
            {:time 16.8, :length 0.1, :pitch 64}
            {:time 16.9, :length 0.1, :pitch 64}
            {:time 17.5, :length 0.3, :pitch 64}
            {:time 18, :length 0.3, :pitch 66}
            {:time 18.5, :length 0.3, :pitch 69}
            {:time 19, :length 0.3, :pitch 71}
            {:time 20, :length 0.3, :pitch 71}
            {:time 20.5, :length 0.3, :pitch 73}
            {:time 21.5, :length 0.6, :pitch 69}
            {:time 24, :length 0.3, :pitch 66}
            {:time 24.5, :length 0.3, :pitch 64}
            {:time 25.5, :length 0.6, :pitch 64}])

(def lead2 [{:time 32, :length 0.5, :pitch 66}
            {:time 33.5, :length 1, :pitch 71}
            {:time 39, :length 0.5, :pitch 71}
            {:time 40, :length 0.3, :pitch 71}
            {:time 40.5, :length 0.5, :pitch 69}
            {:time 41.5, :length 1, :pitch 64}
            {:time 47, :length 0.5, :pitch 66}
            {:time 48, :length 0.2, :pitch 67}
            {:time 48.5, :length 0.2, :pitch 64}
            {:time 49, :length 0.2, :pitch 59}
            {:time 49.5, :length 1, :pitch 64}
            {:time 53, :length 0.2, :pitch 61}
            {:time 53.5, :length 0.2, :pitch 61}
            {:time 54.5, :length 0.5, :pitch 62}
            {:time 56, :length 0.5, :pitch 66}
            {:time 57.5, :length 1, :pitch 64}])

(def lead3 [{:time 65, :length 0.2, :pitch 73}
            {:time 65.5, :length 0.5, :pitch 73}
            {:time 67, :length 0.3, :pitch 73}
            {:time 68, :length 0.3, :pitch 73}
            {:time 69, :length 0.2, :pitch 74}
            {:time 69.5, :length 1, :pitch 71}
            {:time 73.5, :length 0.2, :pitch 71}
            {:time 74, :length 0.5, :pitch 71}
            {:time 75, :length 0.5, :pitch 71}
            {:time 76, :length 0.2, :pitch 71}
            {:time 76.5, :length 0.2, :pitch 73}
            {:time 77, :length 0.2, :pitch 71}
            {:time 77.5, :length 1, :pitch 69}
            {:time 81, :length 0.15, :pitch 69}
            {:time 81.5, :length 0.3, :pitch 69}
            {:time 82.5, :length 0.3, :pitch 68}
            {:time 83.5, :length 0.2, :pitch 66}
            {:time 84, :length 0.5, :pitch 68}
            {:time 85.5, :length 0.6, :pitch 66}
            {:time 88, :length 0.2, :pitch 65}
            {:time 88.5, :length 0.5, :pitch 66}
            {:time 89.5, :length 0.5, :pitch 68}
            {:time 91.5, :length 1, :pitch 69}])

(def lead5 [{:time 93.5, :length 0.2, :pitch 64}
            {:time 94, :length 0.2, :pitch 66}
            {:time 94.5, :length 0.2, :pitch 69}
            {:time 95, :length 0.2, :pitch 71}
            {:time 95.5, :length 1, :pitch 73}
            {:time 97, :length 0.3, :pitch 71}
            {:time 98, :length 0.2, :pitch 69}
            {:time 98.5, :length 0.4, :pitch 71}
            {:time 99.5, :length 0.1, :pitch 69}
            {:time 99.75, :length 0.2, :pitch 71}
            {:time 100, :length 0.5, :pitch 69}
            {:time 101.5, :length 1, :pitch 66}
            {:time 105.5, :length 0.1, :pitch 69}
            {:time 106, :length 0.17, :pitch 69}
            {:time 106.5, :length 0.17, :pitch 69}
            {:time 107, :length 0.17, :pitch 68}
            {:time 107.5, :length 0.17, :pitch 68}
            {:time 108, :length 1, :pitch 66}
            {:time 105.5, :length 0.1, :pitch 57}
            {:time 106, :length 0.17, :pitch 57}
            {:time 106.5, :length 0.17, :pitch 57}
            {:time 107, :length 0.17, :pitch 56}
            {:time 107.5, :length 0.17, :pitch 56}
            {:time 108, :length 1, :pitch 54}
            {:time 110, :length 0.2, :pitch 78}
            {:time 110.5, :length 0.2, :pitch 76}
            {:time 111, :length 0.2, :pitch 73}
            {:time 111.5, :length 0.2, :pitch 71}
            {:time 112, :length 1, :pitch 73}
            {:time 114.5, :length 0.2, :pitch 71}
            {:time 115, :length 0.2, :pitch 73}
            {:time 115.5, :length 0.2, :pitch 71}
            {:time 116, :length 0.2, :pitch 71}
            {:time 116.5, :length 0.5, :pitch 69}
            {:time 117.5, :length 0.2, :pitch 69}
            {:time 118, :length 0.5, :pitch 62}
            {:time 119, :length 0.5, :pitch 74}
            {:time 120, :length 1, :pitch 73}])

(def lead6 [{:time 176, :length 0.5, :pitch 74}
            {:time 177, :length 0.5, :pitch 74}
            {:time 178, :length 1, :pitch 74}
            {:time 179.5, :length 0.5, :pitch 74}
            {:time 180.5, :length 1, :pitch 73}
            {:time 184, :length 0.5, :pitch 74}
            {:time 185, :length 0.5, :pitch 74}
            {:time 186, :length 1, :pitch 74}
            {:time 188, :length 0.5, :pitch 76}
            {:time 189, :length 0.2, :pitch 78}
            {:time 189.5, :length 1, :pitch 76}
            {:time 193.5, :length 0.2, :pitch 76}
            {:time 194, :length 0.2, :pitch 76}
            {:time 194.5, :length 0.2, :pitch 74}
            {:time 195, :length 0.2, :pitch 73}
            {:time 195.5, :length 1, :pitch 71}])

(def lead7 [{:time 197.5, :length 0.2, :pitch 69}
            {:time 198, :length 0.2, :pitch 71}
            {:time 198.5, :length 0.2, :pitch 74}
            {:time 199, :length 0.2, :pitch 76}
            {:time 199.5, :length 1, :pitch 78}
            {:time 201, :length 0.2, :pitch 76}
            {:time 202, :length 0.2, :pitch 74}
            {:time 202.5, :length 0.4, :pitch 76}
            {:time 203.5, :length 0.1, :pitch 74}
            {:time 203.75, :length 0.1, :pitch 76}
            {:time 204, :length 0.8, :pitch 74}
            {:time 205.5, :length 0.2, :pitch 71}
            {:time 206.1, :length 0.1, :pitch 70}
            {:time 206.2, :length 0.1, :pitch 69}
            {:time 206.3, :length 0.1, :pitch 68}
            {:time 206.4, :length 0.1, :pitch 67}
            {:time 206.5, :length 0.1, :pitch 66}
            {:time 206.6, :length 0.1, :pitch 65}
            {:time 206.7, :length 0.1, :pitch 64}
            {:time 206.8, :length 0.1, :pitch 63}
            {:time 206.9, :length 0.1, :pitch 62}
            {:time 207.0, :length 0.1, :pitch 61}
            {:time 207.1, :length 0.1, :pitch 60}
            {:time 207.2, :length 0.1, :pitch 60}
            {:time 207.3, :length 0.2, :pitch 60}
            {:time 208, :length 0.2, :pitch 74}
            {:time 208.5, :length 0.2, :pitch 74}
            {:time 209.5, :length 0.2, :pitch 74}
            {:time 210.5, :length 0.2, :pitch 71}
            {:time 211.5, :length 0.2, :pitch 69}
            {:time 212, :length 0.1, :pitch 71}
            {:time 212.1, :length 0.1, :pitch 70}
            {:time 212.2, :length 0.1, :pitch 69}
            {:time 212.3, :length 0.1, :pitch 68}
            {:time 212.4, :length 0.1, :pitch 67}
            {:time 212.5, :length 0.1, :pitch 66}
            {:time 212.6, :length 0.1, :pitch 65}
            {:time 212.7, :length 0.1, :pitch 64}
            {:time 212.8, :length 0.1, :pitch 64}
            {:time 212.9, :length 0.1, :pitch 64}
            {:time 213.5, :length 0.2, :pitch 64}
            {:time 214, :length 0.2, :pitch 66}
            {:time 214.5, :length 0.2, :pitch 69}
            {:time 215, :length 0.5, :pitch 71}
            {:time 216, :length 0.2, :pitch 71}
            {:time 216.5, :length 0.5, :pitch 73}
            {:time 217.5, :length 1, :pitch 69}
            {:time 220, :length 0.2, :pitch 66}
            {:time 220.5, :length 0.5, :pitch 64}
            {:time 221.5, :length 1, :pitch 64}])

(def lead8 [{:time 228, :length 0.6, :pitch 66} 
            {:time 229.5, :length 1, :pitch 71} 
            {:time 235, :length 0.4, :pitch 71} 
            {:time 236, :length 0.2, :pitch 71} 
            {:time 236.5, :length 0.6, :pitch 69} 
            {:time 237.5, :length 1, :pitch 64} 
            {:time 243, :length 0.3, :pitch 66} 
            {:time 244, :length 0.2, :pitch 67} 
            {:time 244.5, :length 0.2, :pitch 64} 
            {:time 245, :length 0.2, :pitch 59} 
            {:time 245.5, :length 1, :pitch 64} 
            {:time 249, :length 0.2, :pitch 61} 
            {:time 249.5, :length 0.5, :pitch 61} 
            {:time 250.5, :length 0.5, :pitch 62} 
            {:time 252, :length 0.5, :pitch 66} 
            {:time 253.5, :length 1, :pitch 64}])
(def lead9 [{:time 261, :length 0.2, :pitch 73} 
            {:time 261.5, :length 0.5, :pitch 73} 
            {:time 263, :length 0.5, :pitch 73} 
            {:time 264, :length 0.5, :pitch 73} 
            {:time 265, :length 0.2, :pitch 74} 
            {:time 265.5, :length 1, :pitch 71} 
            {:time 269.5, :length 0.1, :pitch 71} 
            {:time 270, :length 0.5, :pitch 71} 
            {:time 271, :length 0.5, :pitch 71} 
            {:time 272, :length 0.2, :pitch 71} 
            {:time 272.5, :length 0.2, :pitch 73} 
            {:time 273, :length 0.2, :pitch 71} 
            {:time 273.5, :length 1, :pitch 69} 
            {:time 277, :length 0.1, :pitch 69} 
            {:time 277.5, :length 0.4, :pitch 69} 
            {:time 278.5, :length 0.3, :pitch 68} 
            {:time 279.5, :length 0.2, :pitch 66} 
            {:time 280, :length 0.5, :pitch 68} 
            {:time 281.5, :length 1, :pitch 66} 
            {:time 284, :length 0.2, :pitch 65} 
            {:time 284.5, :length 0.5, :pitch 66} 
            {:time 285.5, :length 1, :pitch 68} 
            {:time 287.5, :length 1, :pitch 69}])
(def lead11 [{:time 289.5, :length 0.2, :pitch 64} 
            {:time 290, :length 0.2, :pitch 66} 
            {:time 290.5, :length 0.2, :pitch 69} 
            {:time 291, :length 0.2, :pitch 71} 
            {:time 291.5, :length 1, :pitch 73} 
            {:time 293, :length 0.3, :pitch 71} 
            {:time 294, :length 0.2, :pitch 69} 
            {:time 294.5, :length 0.4, :pitch 71} 
            {:time 295.5, :length 0.1, :pitch 69} 
            {:time 295.75, :length 0.1, :pitch 71} 
            {:time 296, :length 0.5, :pitch 69} 
            {:time 297.5, :length 1, :pitch 66} 
            {:time 301.5, :length 0.17, :pitch 69} 
            {:time 302, :length 0.17, :pitch 69} 
            {:time 302.5, :length 0.17, :pitch 69} 
            {:time 303, :length 0.17, :pitch 68} 
            {:time 303.5, :length 0.17, :pitch 68} 
            {:time 304, :length 0.5, :pitch 66} 
            {:time 301.5, :length 0.17, :pitch 57} 
            {:time 302, :length 0.17, :pitch 57} 
            {:time 302.5, :length 0.17, :pitch 57} 
            {:time 303, :length 0.17, :pitch 56} 
            {:time 303.5, :length 0.17, :pitch 56} 
            {:time 304, :length 0.5, :pitch 54} 
            {:time 306, :length 0.2, :pitch 78} 
            {:time 306.5, :length 0.2, :pitch 76} 
            {:time 307, :length 0.2, :pitch 73} 
            {:time 307.5, :length 0.4, :pitch 71} 
            {:time 308, :length 0.5, :pitch 73} 
            {:time 310.5, :length 0.2, :pitch 71} 
            {:time 311, :length 0.2, :pitch 73} 
            {:time 311.5, :length 0.2, :pitch 71} 
            {:time 312, :length 0.2, :pitch 71} 
            {:time 312.5, :length 0.4, :pitch 69} 
            {:time 313.5, :length 0.1, :pitch 69} 
            {:time 314, :length 0.4, :pitch 66} 
            {:time 315, :length 0.5, :pitch 74} 
            {:time 316, :length 1, :pitch 73}])
(def lead12 [{:time 372, :length 0.5, :pitch 74} 
            {:time 373, :length 0.5, :pitch 74} 
            {:time 374, :length 1, :pitch 74} 
            {:time 375.5, :length 0.5, :pitch 74} 
            {:time 376.5, :length 1, :pitch 73} 
            {:time 380, :length 0.5, :pitch 74} 
            {:time 381, :length 0.5, :pitch 74} 
            {:time 382, :length 1, :pitch 74} 
            {:time 384, :length 0.4, :pitch 76} 
            {:time 385, :length 0.2, :pitch 78} 
            {:time 385.5, :length 1, :pitch 76} 
            {:time 389.5, :length 0.2, :pitch 76} 
            {:time 390, :length 0.2, :pitch 76} 
            {:time 390.5, :length 0.2, :pitch 74} 
            {:time 391, :length 0.2, :pitch 73} 
            {:time 391.5, :length 1, :pitch 71}])
(def lead13 [{:time 393.5, :length 0.2, :pitch 69} 
            {:time 394, :length 0.2, :pitch 71} 
            {:time 394.5, :length 0.2, :pitch 74} 
            {:time 395, :length 0.2, :pitch 76} 
            {:time 395.5, :length 1, :pitch 78} 
            {:time 397, :length 0.4, :pitch 76} 
            {:time 398, :length 0.2, :pitch 74} 
            {:time 398.5, :length 0.4, :pitch 76} 
            {:time 399.5, :length 0.1, :pitch 74} 
            {:time 399.75, :length 0.1, :pitch 76} 
            {:time 400, :length 0.4, :pitch 74} 
            {:time 401, :length 0.5, :pitch 71} 
            {:time 402.1, :length 0.1, :pitch 70} 
            {:time 402.2, :length 0.1, :pitch 69} 
            {:time 402.3, :length 0.1, :pitch 68} 
            {:time 402.4, :length 0.1, :pitch 67} 
            {:time 402.5, :length 0.1, :pitch 66} 
            {:time 402.6, :length 0.1, :pitch 65} 
            {:time 402.7, :length 0.1, :pitch 64} 
            {:time 402.8, :length 0.1, :pitch 63} 
            {:time 402.9, :length 0.1, :pitch 62} 
            {:time 403.0, :length 0.1, :pitch 61} 
            {:time 403.1, :length 0.1, :pitch 60} 
            {:time 403.2, :length 0.1, :pitch 60} 
            {:time 403.3, :length 0.2, :pitch 60} 
            {:time 404, :length 0.2, :pitch 74} 
            {:time 404.5, :length 0.5, :pitch 74}
            {:time 405.5, :length 0.2, :pitch 74} 
            {:time 406.5, :length 0.2, :pitch 71} 
            {:time 407.5, :length 0.4, :pitch 69} 
            {:time 408, :length 0.2, :pitch 71} 
            {:time 408.1, :length 0.1, :pitch 70} 
            {:time 408.2, :length 0.1, :pitch 69} 
            {:time 408.3, :length 0.1, :pitch 68} 
            {:time 408.4, :length 0.1, :pitch 67} 
            {:time 408.5, :length 0.1, :pitch 66} 
            {:time 408.6, :length 0.1, :pitch 65} 
            {:time 408.7, :length 0.1, :pitch 64} 
            {:time 408.8, :length 0.1, :pitch 64} 
            {:time 408.9, :length 0.1, :pitch 64} 
            {:time 409.5, :length 0.2, :pitch 64} 
            {:time 410, :length 0.2, :pitch 66} 
            {:time 410.5, :length 0.2, :pitch 69} 
            {:time 411, :length 0.4, :pitch 71} 
            {:time 412, :length 0.2, :pitch 71} 
            {:time 412.5, :length 0.4, :pitch 73} 
            {:time 413.5, :length 0.5, :pitch 69} 
            {:time 416, :length 0.2, :pitch 66} 
            {:time 416.5, :length 0.4, :pitch 64} 
            {:time 417.5, :length 1, :pitch 64}])
(def lead14 [{:time 425.5, :length 0.2, :pitch 69} 
            {:time 426, :length 0.2, :pitch 71} 
            {:time 426.5, :length 0.2, :pitch 74} 
            {:time 427, :length 0.2, :pitch 76} 
            {:time 427.5, :length 0.7, :pitch 78} 
            {:time 429, :length 0.3, :pitch 76} 
            {:time 430, :length 0.2, :pitch 74} 
            {:time 430.5, :length 0.4, :pitch 76} 
            {:time 431.5, :length 0.1, :pitch 74} 
            {:time 431.75, :length 0.1, :pitch 76} 
            {:time 432, :length 0.4, :pitch 74} 
            {:time 433.5, :length 0.2, :pitch 71} 
            {:time 434.1, :length 0.1, :pitch 70} 
            {:time 434.2, :length 0.1, :pitch 69} 
            {:time 434.3, :length 0.1, :pitch 68} 
            {:time 434.4, :length 0.1, :pitch 67} 
            {:time 434.5, :length 0.1, :pitch 66} 
            {:time 434.6, :length 0.1, :pitch 65} 
            {:time 434.7, :length 0.1, :pitch 64} 
            {:time 434.8, :length 0.1, :pitch 63} 
            {:time 434.9, :length 0.1, :pitch 62} 
            {:time 435.0, :length 0.1, :pitch 61} 
            {:time 435.1, :length 0.1, :pitch 60} 
            {:time 435.2, :length 0.1, :pitch 60} 
            {:time 435.3, :length 0.2, :pitch 60} 
            {:time 436, :length 0.2, :pitch 74} 
            {:time 436.5, :length 0.2, :pitch 74} 
            {:time 437.5, :length 0.2, :pitch 74} 
            {:time 438.5, :length 0.4, :pitch 71} 
            {:time 439.5, :length 0.2, :pitch 69} 
            {:time 440, :length 0.2, :pitch 71} 
            {:time 440.1, :length 0.1, :pitch 70} 
            {:time 440.2, :length 0.1, :pitch 69} 
            {:time 440.3, :length 0.1, :pitch 68} 
            {:time 440.4, :length 0.1, :pitch 67} 
            {:time 440.5, :length 0.1, :pitch 66} 
            {:time 440.6, :length 0.1, :pitch 65} 
            {:time 440.7, :length 0.1, :pitch 64} 
            {:time 440.8, :length 0.1, :pitch 64} 
            {:time 440.9, :length 0.1, :pitch 64} 
            {:time 441.5, :length 0.2, :pitch 64} 
            {:time 442, :length 0.2, :pitch 66} 
            {:time 442.5, :length 0.2, :pitch 69} 
            {:time 443, :length 0.2, :pitch 71} 
            {:time 444, :length 0.2, :pitch 71} 
            {:time 444.5, :length 0.2, :pitch 73} 
            {:time 445.5, :length 0.2, :pitch 69} 
            {:time 446.5, :length 0.2, :pitch 69} 
            {:time 447.5, :length 0.2, :pitch 64} 
            {:time 448, :length 0.2, :pitch 64} 
            {:time 448.5, :length 0.2, :pitch 64} 
            {:time 449, :length 0.2, :pitch 64} 
            {:time 449.5, :length 0.2, :pitch 59} 
            {:time 450, :length 0.2, :pitch 59} 
            {:time 450.5, :length 0.2, :pitch 59} 
            {:time 451, :length 0.2, :pitch 59} 
            {:time 451.5, :length 0.2, :pitch 54} 
            {:time 452, :length 0.2, :pitch 54} 
            {:time 452.5, :length 0.2, :pitch 54} 
            {:time 453, :length 0.2, :pitch 54} 
            {:time 453.5, :length 0.2, :pitch 52} 
            {:time 454, :length 0.2, :pitch 54} 
            {:time 454.5, :length 0.2, :pitch 52} 
            {:time 448, :length 0.2, :pitch 76} 
            {:time 448.5, :length 0.2, :pitch 76} 
            {:time 449, :length 0.2, :pitch 76} 
            {:time 449.5, :length 0.2, :pitch 71} 
            {:time 450, :length 0.2, :pitch 71} 
            {:time 450.5, :length 0.2, :pitch 71} 
            {:time 451, :length 0.2, :pitch 71} 
            {:time 451.5, :length 0.2, :pitch 66} 
            {:time 452, :length 0.2, :pitch 66} 
            {:time 452.5, :length 0.2, :pitch 66} 
            {:time 453, :length 0.2, :pitch 66} 
            {:time 453.5, :length 0.2, :pitch 64} 
            {:time 454, :length 0.2, :pitch 66} 
            {:time 454.5, :length 0.2, :pitch 64}])
(def lead15 [{:time 458, :length 0.2, :pitch 74} 
            {:time 458.5, :length 0.2, :pitch 74} 
            {:time 459.5, :length 0.5, :pitch 74} 
            {:time 461, :length 0.5, :pitch 76} 
            {:time 464, :length 0.5, :pitch 83} 
            {:time 465.5, :length 0.5, :pitch 80} 
            {:time 468, :length 0.5, :pitch 78} 
            {:time 469.5, :length 0.5, :pitch 80} 
            {:time 472, :length 0.2, :pitch 76} 
            {:time 472.5, :length 0.2, :pitch 74} 
            {:time 473.5, :length 0.2, :pitch 71} 
            {:time 476, :length 0.2, :pitch 69} 
            {:time 476.5, :length 0.5, :pitch 71} 
            {:time 477.5, :length 0.5, :pitch 69} 
            {:time 480, :length 0.5, :pitch 66} 
            {:time 481.5, :length 1, :pitch 64}])
(def lead16 [{:time 488, :length 0.2, :pitch 73} 
            {:time 488, :length 0.2, :pitch 76} 
            {:time 489, :length 0.2, :pitch 73} 
            {:time 489, :length 0.2, :pitch 76} 
            {:time 490.5, :length 0.2, :pitch 73} 
            {:time 490.5, :length 0.2, :pitch 76} 
            {:time 491.5, :length 0.2, :pitch 73} 
            {:time 491.5, :length 0.2, :pitch 76} 
            {:time 492, :length 0.2, :pitch 71} 
            {:time 492, :length 0.2, :pitch 78} 
            {:time 493, :length 0.2, :pitch 71} 
            {:time 493, :length 0.2, :pitch 78} 
            {:time 494.5, :length 0.2, :pitch 71} 
            {:time 494.5, :length 0.2, :pitch 78} 
            {:time 495.5, :length 0.2, :pitch 71} 
            {:time 495.5, :length 0.2, :pitch 78} 
            {:time 496, :length 0.2, :pitch 71} 
            {:time 496, :length 0.2, :pitch 76} 
            {:time 497, :length 0.2, :pitch 71} 
            {:time 497, :length 0.2, :pitch 76} 
            {:time 498.5, :length 0.2, :pitch 71} 
            {:time 498.5, :length 0.2, :pitch 76} 
            {:time 499.5, :length 0.2, :pitch 71} 
            {:time 499.5, :length 0.2, :pitch 76} 
            {:time 500, :length 0.2, :pitch 71} 
            {:time 500, :length 0.2, :pitch 78} 
            {:time 500.5, :length 0.2, :pitch 71} 
            {:time 500.5, :length 0.2, :pitch 78} 
            {:time 501, :length 0.2, :pitch 71} 
            {:time 501, :length 0.2, :pitch 78} 
            {:time 501.5, :length 0.2, :pitch 71} 
            {:time 501.5, :length 0.2, :pitch 76} 
            {:time 502.5, :length 0.2, :pitch 71} 
            {:time 502.5, :length 0.2, :pitch 76} 
            {:time 503.5, :length 0.2, :pitch 71} 
            {:time 503.5, :length 0.2, :pitch 76}])
(def lead17 [{:time 504, :length 0.2, :pitch 73} 
            {:time 504, :length 0.2, :pitch 76} 
            {:time 505, :length 0.2, :pitch 73} 
            {:time 505, :length 0.2, :pitch 76} 
            {:time 506.5, :length 0.2, :pitch 73} 
            {:time 506.5, :length 0.2, :pitch 76} 
            {:time 507.5, :length 0.2, :pitch 73} 
            {:time 507.5, :length 0.2, :pitch 76} 
            {:time 508, :length 0.2, :pitch 71} 
            {:time 508, :length 0.2, :pitch 78} 
            {:time 509, :length 0.2, :pitch 71} 
            {:time 509, :length 0.2, :pitch 78} 
            {:time 510.5, :length 0.2, :pitch 71} 
            {:time 510.5, :length 0.2, :pitch 78} 
            {:time 511.5, :length 0.2, :pitch 71} 
            {:time 511.5, :length 0.2, :pitch 78} 
            {:time 512, :length 0.2, :pitch 71} 
            {:time 512, :length 0.2, :pitch 76} 
            {:time 513, :length 0.2, :pitch 71} 
            {:time 513, :length 0.2, :pitch 76} 
            {:time 514.5, :length 0.2, :pitch 71} 
            {:time 514.5, :length 0.2, :pitch 76} 
            {:time 515.5, :length 0.2, :pitch 71} 
            {:time 515.5, :length 0.2, :pitch 76} 
            {:time 516, :length 0.2, :pitch 71} 
            {:time 516, :length 0.2, :pitch 78} 
            {:time 516.5, :length 0.2, :pitch 71} 
            {:time 516.5, :length 0.2, :pitch 78} 
            {:time 517, :length 0.2, :pitch 71} 
            {:time 517, :length 0.2, :pitch 78} 
            {:time 517.5, :length 0.2, :pitch 71} 
            {:time 517.5, :length 0.2, :pitch 76} 
            {:time 518.5, :length 0.2, :pitch 71} 
            {:time 518.5, :length 0.2, :pitch 76} 
            {:time 519.5, :length 0.2, :pitch 71} 
            {:time 519.5, :length 0.2, :pitch 76}])
(def lead18 [{:time 520, :length 0.2, :pitch 73} 
            {:time 520, :length 0.2, :pitch 76} 
            {:time 521, :length 0.2, :pitch 73} 
            {:time 521, :length 0.2, :pitch 76} 
            {:time 522.5, :length 0.2, :pitch 73} 
            {:time 522.5, :length 0.2, :pitch 76} 
            {:time 523.5, :length 0.2, :pitch 73} 
            {:time 523.5, :length 0.2, :pitch 76} 
            {:time 524, :length 0.2, :pitch 71} 
            {:time 524, :length 0.2, :pitch 78} 
            {:time 525, :length 0.2, :pitch 71} 
            {:time 525, :length 0.2, :pitch 78} 
            {:time 526.5, :length 0.2, :pitch 71} 
            {:time 526.5, :length 0.2, :pitch 78} 
            {:time 527.5, :length 0.2, :pitch 71} 
            {:time 527.5, :length 0.2, :pitch 78} 
            {:time 528, :length 0.2, :pitch 71} 
            {:time 528, :length 0.2, :pitch 76} 
            {:time 529, :length 0.2, :pitch 71} 
            {:time 529, :length 0.2, :pitch 76} 
            {:time 530.5, :length 0.2, :pitch 71} 
            {:time 530.5, :length 0.2, :pitch 76} 
            {:time 531.5, :length 0.2, :pitch 71} 
            {:time 531.5, :length 0.2, :pitch 76} 
            {:time 532, :length 0.2, :pitch 71} 
            {:time 532, :length 0.2, :pitch 78} 
            {:time 532.5, :length 0.2, :pitch 71} 
            {:time 532.5, :length 0.2, :pitch 78} 
            {:time 533, :length 0.2, :pitch 71} 
            {:time 533, :length 0.2, :pitch 78} 
            {:time 533.5, :length 0.2, :pitch 71} 
            {:time 533.5, :length 0.2, :pitch 76} 
            {:time 534.5, :length 0.2, :pitch 71} 
            {:time 534.5, :length 0.2, :pitch 76} 
            {:time 535.5, :length 0.2, :pitch 71} 
            {:time 535.5, :length 0.2, :pitch 76}])

(def lead (concat lead1 lead2 lead3 lead5 lead6 lead7 lead8 lead9 lead11 lead12 lead13 lead14 lead15 lead16 lead17 lead18))


(defn gb1 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 102, :length 0.5, :pitch 66}
        {:time 103, :length 0.5, :pitch 74}
        {:time 104, :length 0.5, :pitch 73}
        {:time 118, :length 0.5, :pitch 66}
        {:time 119, :length 0.5, :pitch 74}
        {:time 120, :length 0.5, :pitch 73} 
        {:time 125.5, :length 0.15, :pitch 71}
        {:time 126, :length 0.15, :pitch 71}
        {:time 126.5, :length 0.5, :pitch 71}
        {:time 128, :length 0.5, :pitch 71}
        {:time 128.5, :length 0.5, :pitch 73}
        {:time 129.5, :length 0.5, :pitch 69}
        {:time 133.5, :length 0.5, :pitch 69}
        {:time 134, :length 0.5, :pitch 69}
        {:time 135, :length 0.5, :pitch 66} 
        {:time 136, :length 0.5, :pitch 69} 
        {:time 137.5, :length 0.5, :pitch 68}]))

(defn plane1 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 125.5, :length 0.5, :pitch 74} {:time 126, :length 0.5, :pitch 74} {:time 126.5, :length 0.5, :pitch 74} {:time 128, :length 0.5, :pitch 74} {:time 128.5, :length 0.5, :pitch 76} {:time 129.5, :length 0.5, :pitch 73} {:time 133.5, :length 0.5, :pitch 73} {:time 134, :length 0.5, :pitch 73} {:time 135, :length 0.5, :pitch 69} {:time 136, :length 0.5, :pitch 73} {:time 137.5, :length 0.5, :pitch 71}]))

(defn flower1 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 144, :length 0.3, :pitch 66}
        {:time 144.5, :length 0.3, :pitch 62}
        {:time 145, :length 0.3, :pitch 59}
        {:time 145.5, :length 0.5, :pitch 66} 
        {:time 146.5, :length 0.3, :pitch 62} 
        {:time 147, :length 0.3, :pitch 59} 
        {:time 147.5, :length 0.5, :pitch 64} 
        {:time 148.5, :length 0.5, :pitch 61} 
        {:time 149.5, :length 0.3, :pitch 59} 
        {:time 150, :length 0.5, :pitch 57}
        {:time 152, :length 0.3, :pitch 68}
        {:time 152.5, :length 0.3, :pitch 64}
        {:time 153, :length 0.3, :pitch 61} 
        {:time 153.5, :length 0.5, :pitch 68}
        {:time 154.5, :length 0.5, :pitch 64}
        {:time 155.5, :length 0.5, :pitch 66}]))

(defn star1 [time]
  (map (fn [m] (update m :time #(+ % time)))
       [{:time 157, :length 0.5, :pitch 70}
        {:time 158, :length 0.5, :pitch 71}
        {:time 159, :length 0.5, :pitch 73}]))

(def leadA (concat (gb1 0) (plane1 0) (flower1 0) 
                   (map (fn [m] (update m :time #(+ % 16)))
                        (flower1 0))
                   (star1 0)
                   (map (fn [m] (update m :time #(+ % 16)))
                        (star1 0))
                   (gb1 196) (plane1 196)
                   (flower1 196)
                   (map (fn [m] (update m :time #(+ % 16)))
                        (flower1 196))
                   (star1 196)
                   (map (fn [m] (update m :time #(+ % 16)))
                        (star1 196))))