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

#_(def bass [{:time 0
            :length 0.5
            :pitch 71}
           {:time 1.5
            :length 0.25
            :pitch 71}
           {:time 2
            :length 0.5
            :pitch 71}
           {:time 3
            :length 0.25
            :pitch 73}
           {:time 3.5
            :length 0.25
            :pitch 69}
           {:time 4
            :length 0.5
            :pitch 69}
           {:time 5.5
            :length 0.25
            :pitch 69}
           {:time 6
            :length 0.5
            :pitch 69}
           {:time 8
            :length 0.5
            :pitch 64}
           {:time 9.5
            :length 0.25
            :pitch 64}
           {:time 10
            :length 0.5
            :pitch 64}
           {:time 12
            :length 0.5
            :pitch 64}
           {:time 13.5
            :length 0.25
            :pitch 64}
           {:time 14
            :length 0.5
            :pitch 64}
           {:time 16
            :length 0.5
            :pitch 71}
           {:time 17.5
            :length 0.25
            :pitch 71}
           {:time 18
            :length 0.5
            :pitch 71}
           {:time 19
            :length 0.25
            :pitch 73}
           {:time 19.5
            :length 0.25
            :pitch 69}
           {:time 20
            :length 0.5
            :pitch 69}
           {:time 21.5
            :length 0.25
            :pitch 69}
           {:time 22
            :length 0.5
            :pitch 69}
           {:time 24
            :length 0.5
            :pitch 64}
           {:time 25.5
            :length 0.25
            :pitch 64}
           {:time 26
            :length 0.5
            :pitch 64}
           {:time 28
            :length 0.5
            :pitch 64}
           {:time 29.5
            :length 0.25
            :pitch 64}
           {:time 30
            :length 0.5
            :pitch 64}
           {:length 0.5
            :pitch 69
            :time 61.5}
           {:length 0.5
            :pitch 64
            :time 61}
           {:length 0.25
            :pitch 64
            :time 63}
           {:length 0.5
            :pitch 69
            :time 58}
           {:length 0.25
            :pitch 69
            :time 57.5}
           {:length 0.5
            :pitch 69
            :time 56}
           {:length 0.5
            :pitch 67
            :time 55}
           {:length 0.5
            :pitch 66
            :time 54.5}
           {:length 0.25
            :pitch 64
            :time 49.5}
           {:length 0.5
            :pitch 71
            :time 32}
           {:length 0.25
            :pitch 66
            :time 33.5}
           {:length 0.25
            :pitch 64
            :time 34}
           {:length 0.5
            :pitch 62
            :time 34.5}
           {:length 0.5
            :pitch 59
            :time 35.5}
           {:length 0.25
            :pitch 66
            :time 37.5}
           {:length 0.5
            :pitch 64
            :time 38}
           {:length 0.5
            :pitch 62
            :time 39}
           {:length 0.5
            :pitch 69
            :time 40}
           {:length 0.25
            :pitch 64
            :time 41.5}
           {:length 0.25
            :pitch 62
            :time 42}
           {:length 0.5
            :pitch 61
            :time 42.5}
           {:length 0.5
            :pitch 57
            :time 43.5}
           {:length 0.25
            :pitch 64
            :time 45.5}
           {:length 0.5
            :pitch 62
            :time 46}
           {:length 0.5
            :pitch 61
            :time 47}
           {:length 0.5
            :pitch 64
            :time 48}
           {:length 0.5
            :pitch 64
            :time 50.5}
           {:length 0.25
            :pitch 66
            :time 51}
           {:length 0.5
            :pitch 67
            :time 51.5}
           {:length 0.25
            :pitch 66
            :time 52.5}
           {:length 0.25
            :pitch 64
            :time 53}
           {:length 0.5
            :pitch 64
            :time 53.5}
           {:length 0.5
            :pitch 66
            :time 64}
           {:length 0.25
            :pitch 66
            :time 65.5}
           {:length 0.5
            :pitch 66
            :time 66}
           {:length 0.5
            :pitch 69
            :time 67}
           {:length 0.5
            :pitch 64
            :time 68}
           {:length 0.25
            :pitch 64
            :time 69.5}
           {:length 0.5
            :pitch 64
            :time 70}
           {:length 0.5
            :pitch 64
            :time 72}
           {:length 0.25
            :pitch 64
            :time 73.5}
           {:length 0.5
            :pitch 64
            :time 74}
           {:length 0.5
            :pitch 61
            :time 75}
           {:length 0.5
            :pitch 62
            :time 76}
           {:length 0.25
            :pitch 62
            :time 77.5}
           {:length 0.5
            :pitch 62
            :time 78}
           {:length 0.5
            :pitch 62
            :time 80}
           {:length 0.25
            :pitch 62
            :time 81.5}
           {:length 0.5
            :pitch 62
            :time 82}
           {:length 0.5
            :pitch 61
            :time 84}
           {:length 0.25
            :pitch 61
            :time 85.5}
           {:length 0.5
            :pitch 61
            :time 86}
           {:length 0.5
            :pitch 61
            :time 88}
           {:length 0.5
            :pitch 73
            :time 89.5}
           {:length 0.25
            :pitch 71
            :time 90.5}
           {:length 0.25
            :pitch 69
            :time 91}
           {:length 0.25
            :pitch 68
            :time 91.5}
           {:length 0.5
            :pitch 66
            :time 92}
           {:length 0.25
            :pitch 66
            :time 93.5}
           {:length 0.5
            :pitch 66
            :time 94}
           {:length 0.5
            :pitch 64
            :time 96}
           {:length 0.25
            :pitch 64
            :time 97.5}
           {:length 0.5
            :pitch 64
            :time 98}
           {:length 0.5
            :pitch 61
            :time 99}
           {:length 0.5
            :pitch 62
            :time 100}
           {:length 0.25
            :pitch 62
            :time 101.5}
           {:length 0.5
            :pitch 62
            :time 102}
           {:length 0.5
            :pitch 69
            :time 104}
           {:length 0.25
            :pitch 69
            :time 105.5}
           {:length 0.5
            :pitch 69
            :time 106}
           {:length 0.5
            :pitch 66
            :time 108}
           {:length 0.25
            :pitch 66
            :time 109.5}
           {:length 0.5
            :pitch 66
            :time 110}
           {:length 0.5
            :pitch 64
            :time 112}
           {:length 0.25
            :pitch 64
            :time 113.5}
           {:length 0.5
            :pitch 64
            :time 114}
           {:length 0.5
            :pitch 61
            :time 115}
           {:length 0.5
            :pitch 62
            :time 116}
           {:length 0.25
            :pitch 62
            :time 117.5}
           {:length 0.5
            :pitch 62
            :time 118}
           {:length 0.5
            :pitch 69
            :time 120}
           {:length 0.25
            :pitch 69
            :time 121.5}
           {:length 0.5
            :pitch 69
            :time 122}
           {:length 0.5
            :pitch 67
            :time 124}
           {:length 0.5
            :pitch 66
            :time 132}
           {:length 0.5
            :pitch 64
            :time 140}
           {:length 0.5
            :pitch 62
            :time 141}
           {:length 0.5
            :pitch 61
            :time 142}
           {:length 0.5
            :pitch 59
            :time 143}
           {:length 0.5
            :pitch 71
            :time 144}
           {:length 0.25
            :pitch 66
            :time 145.5}
           {:length 0.25
            :pitch 71
            :time 146}
           {:length 0.5
            :pitch 66
            :time 146.5}
           {:length 0.25
            :pitch 66
            :time 147.5}
           {:length 0.5
            :pitch 69
            :time 148}
           {:length 0.25
            :pitch 69
            :time 149.5}
           {:length 0.5
            :pitch 69
            :time 150}
           {:length 0.5
            :pitch 68
            :time 152}
           {:length 0.25
            :pitch 64
            :time 153.5}
           {:length 0.25
            :pitch 68
            :time 154}
           {:length 0.5
            :pitch 64
            :time 154.5}
           {:length 0.25
            :pitch 64
            :time 155.5}
           {:length 0.5
            :pitch 66
            :time 156}
           {:length 0.25
            :pitch 66
            :time 157.5}
           {:length 0.5
            :pitch 66
            :time 158}
           {:length 0.5
            :pitch 71
            :time 160}
           {:length 0.25
            :pitch 66
            :time 161.5}
           {:length 0.25
            :pitch 71
            :time 162}
           {:length 0.5
            :pitch 66
            :time 162.5}
           {:length 0.25
            :pitch 66
            :time 163.5}
           {:length 0.5
            :pitch 69
            :time 164}
           {:length 0.25
            :pitch 69
            :time 165.5}
           {:length 0.5
            :pitch 69
            :time 166}
           {:length 0.5
            :pitch 68
            :time 168}
           {:length 0.25
            :pitch 64
            :time 169.5}
           {:length 0.25
            :pitch 68
            :time 170}
           {:length 0.5
            :pitch 64
            :time 170.5}
           {:length 0.25
            :pitch 64
            :time 171.5}
           {:length 0.5
            :pitch 66
            :time 172}
           {:length 0.25
            :pitch 66
            :time 173.5}
           {:length 0.5
            :pitch 66
            :time 174}
           {:length 0.5
            :pitch 67
            :time 176}
           {:length 0.25
            :pitch 62
            :time 177}
           {:length 0.25
            :pitch 64
            :time 177.5}
           {:length 0.25
            :pitch 67
            :time 178}
           {:length 0.25
            :pitch 62
            :time 178.5}
           {:length 0.25
            :pitch 67
            :time 179}
           {:length 0.25
            :pitch 67
            :time 179.5}
           {:length 0.5
            :pitch 66
            :time 180}
           {:length 0.25
            :pitch 66
            :time 181.5}
           {:length 0.5
            :pitch 66
            :time 182}
           {:length 0.5
            :pitch 67
            :time 184}
           {:length 0.25
            :pitch 62
            :time 185}
           {:length 0.25
            :pitch 64
            :time 185.5}
           {:length 0.25
            :pitch 67
            :time 186}
           {:length 0.25
            :pitch 62
            :time 186.5}
           {:length 0.25
            :pitch 67
            :time 187}
           {:length 0.25
            :pitch 66
            :time 187.5}
           {:length 0.5
            :pitch 64
            :time 188}
           {:length 0.25
            :pitch 64
            :time 189.5}
           {:length 0.5
            :pitch 64
            :time 190}
           {:length 0.5
            :pitch 64
            :time 192}
           {:length 0.25
            :pitch 64
            :time 193.5}
           {:length 0.5
            :pitch 64
            :time 194}
           {:time 196
            :length 0.5
            :pitch 71}
           {:time 197.5
            :length 0.25
            :pitch 71}
           {:time 198
            :length 0.5
            :pitch 71}
           {:time 199
            :length 0.25
            :pitch 73}
           {:time 199.5
            :length 0.25
            :pitch 69}
           {:time 200
            :length 0.5
            :pitch 69}
           {:time 201.5
            :length 0.25
            :pitch 69}
           {:time 202
            :length 0.5
            :pitch 69}
           {:time 204
            :length 0.5
            :pitch 64}
           {:time 205.5
            :length 0.25
            :pitch 64}
           {:time 206
            :length 0.5
            :pitch 64}
           {:time 208
            :length 0.5
            :pitch 64}
           {:time 209.5
            :length 0.25
            :pitch 64}
           {:time 210
            :length 0.5
            :pitch 64}
           {:time 212
            :length 0.5
            :pitch 71}
           {:time 213.5
            :length 0.25
            :pitch 71}
           {:time 214
            :length 0.5
            :pitch 71}
           {:time 215
            :length 0.25
            :pitch 73}
           {:time 215.5
            :length 0.25
            :pitch 69}
           {:time 216
            :length 0.5
            :pitch 69}
           {:time 217.5
            :length 0.25
            :pitch 69}
           {:time 218
            :length 0.5
            :pitch 69}
           {:time 220
            :length 0.5
            :pitch 64}
           {:time 221.5
            :length 0.25
            :pitch 64}
           {:time 222
            :length 0.5
            :pitch 64}
           {:time 224
            :length 0.5
            :pitch 64}
           {:time 225.5
            :length 0.25
            :pitch 64}
           {:time 226
            :length 0.5
            :pitch 64}
           {:length 0.5
            :pitch 69
            :time 257.5}
           {:length 0.5
            :pitch 64
            :time 257}
           {:length 0.25
            :pitch 64
            :time 259}
           {:length 0.5
            :pitch 69
            :time 254}
           {:length 0.25
            :pitch 69
            :time 253.5}
           {:length 0.5
            :pitch 69
            :time 252}
           {:length 0.5
            :pitch 67
            :time 251}
           {:length 0.5
            :pitch 66
            :time 250.5}
           {:length 0.25
            :pitch 64
            :time 245.5}
           {:length 0.5
            :pitch 71
            :time 228}
           {:length 0.25
            :pitch 66
            :time 229.5}
           {:length 0.25
            :pitch 64
            :time 230}
           {:length 0.5
            :pitch 62
            :time 230.5}
           {:length 0.5
            :pitch 59
            :time 231.5}
           {:length 0.25
            :pitch 66
            :time 233.5}
           {:length 0.5
            :pitch 64
            :time 234}
           {:length 0.5
            :pitch 62
            :time 235}
           {:length 0.5
            :pitch 69
            :time 236}
           {:length 0.25
            :pitch 64
            :time 237.5}
           {:length 0.25
            :pitch 62
            :time 238}
           {:length 0.5
            :pitch 61
            :time 238.5}
           {:length 0.5
            :pitch 57
            :time 239.5}
           {:length 0.25
            :pitch 64
            :time 241.5}
           {:length 0.5
            :pitch 62
            :time 242}
           {:length 0.5
            :pitch 61
            :time 243}
           {:length 0.5
            :pitch 64
            :time 244}
           {:length 0.5
            :pitch 64
            :time 246.5}
           {:length 0.25
            :pitch 66
            :time 247}
           {:length 0.5
            :pitch 67
            :time 247.5}
           {:length 0.25
            :pitch 66
            :time 248.5}
           {:length 0.25
            :pitch 64
            :time 249}
           {:length 0.5
            :pitch 64
            :time 249.5}
           {:length 0.5
            :pitch 66
            :time 260}
           {:length 0.25
            :pitch 66
            :time 261.5}
           {:length 0.5
            :pitch 66
            :time 262}
           {:length 0.5
            :pitch 69
            :time 263}
           {:length 0.5
            :pitch 64
            :time 264}
           {:length 0.25
            :pitch 64
            :time 265.5}
           {:length 0.5
            :pitch 64
            :time 266}
           {:length 0.5
            :pitch 64
            :time 268}
           {:length 0.25
            :pitch 64
            :time 269.5}
           {:length 0.5
            :pitch 64
            :time 270}
           {:length 0.5
            :pitch 61
            :time 271}
           {:length 0.5
            :pitch 62
            :time 272}
           {:length 0.25
            :pitch 62
            :time 273.5}
           {:length 0.5
            :pitch 62
            :time 274}
           {:length 0.5
            :pitch 62
            :time 276}
           {:length 0.25
            :pitch 62
            :time 277.5}
           {:length 0.5
            :pitch 62
            :time 278}
           {:length 0.5
            :pitch 61
            :time 280}
           {:length 0.25
            :pitch 61
            :time 281.5}
           {:length 0.5
            :pitch 61
            :time 282}
           {:length 0.5
            :pitch 61
            :time 284}
           {:length 0.5
            :pitch 73
            :time 285.5}
           {:length 0.25
            :pitch 71
            :time 286.5}
           {:length 0.25
            :pitch 69
            :time 287}
           {:length 0.25
            :pitch 68
            :time 287.5}
           {:length 0.5
            :pitch 66
            :time 288}
           {:length 0.25
            :pitch 66
            :time 289.5}
           {:length 0.5
            :pitch 66
            :time 290}
           {:length 0.5
            :pitch 64
            :time 292}
           {:length 0.25
            :pitch 64
            :time 293.5}
           {:length 0.5
            :pitch 64
            :time 294}
           {:length 0.5
            :pitch 61
            :time 295}
           {:length 0.5
            :pitch 62
            :time 296}
           {:length 0.25
            :pitch 62
            :time 297.5}
           {:length 0.5
            :pitch 62
            :time 298}
           {:length 0.5
            :pitch 69
            :time 300}
           {:length 0.25
            :pitch 69
            :time 301.5}
           {:length 0.5
            :pitch 69
            :time 302}
           {:length 0.5
            :pitch 66
            :time 304}
           {:length 0.25
            :pitch 66
            :time 305.5}
           {:length 0.5
            :pitch 66
            :time 306}
           {:length 0.5
            :pitch 64
            :time 308}
           {:length 0.25
            :pitch 64
            :time 309.5}
           {:length 0.5
            :pitch 64
            :time 310}
           {:length 0.5
            :pitch 61
            :time 311}
           {:length 0.5
            :pitch 62
            :time 312}
           {:length 0.25
            :pitch 62
            :time 313.5}
           {:length 0.5
            :pitch 62
            :time 314}
           {:length 0.5
            :pitch 69
            :time 316}
           {:length 0.25
            :pitch 69
            :time 317.5}
           {:length 0.5
            :pitch 69
            :time 318}
           {:length 0.5
            :pitch 67
            :time 320}
           {:length 0.5
            :pitch 66
            :time 328}
           {:length 0.5
            :pitch 64
            :time 336}
           {:length 0.5
            :pitch 62
            :time 337}
           {:length 0.5
            :pitch 61
            :time 338}
           {:length 0.5
            :pitch 59
            :time 339}
           {:length 0.5
            :pitch 71
            :time 340}
           {:length 0.25
            :pitch 66
            :time 341.5}
           {:length 0.25
            :pitch 71
            :time 342}
           {:length 0.5
            :pitch 66
            :time 342.5}
           {:length 0.25
            :pitch 66
            :time 343.5}
           {:length 0.5
            :pitch 69
            :time 344}
           {:length 0.25
            :pitch 69
            :time 345.5}
           {:length 0.5
            :pitch 69
            :time 346}
           {:length 0.5
            :pitch 68
            :time 348}
           {:length 0.25
            :pitch 64
            :time 349.5}
           {:length 0.25
            :pitch 68
            :time 350}
           {:length 0.5
            :pitch 64
            :time 350.5}
           {:length 0.25
            :pitch 64
            :time 351.5}
           {:length 0.5
            :pitch 66
            :time 352}
           {:length 0.25
            :pitch 66
            :time 353.5}
           {:length 0.5
            :pitch 66
            :time 354}
           {:length 0.5
            :pitch 71
            :time 356}
           {:length 0.25
            :pitch 66
            :time 357.5}
           {:length 0.25
            :pitch 71
            :time 358}
           {:length 0.5
            :pitch 66
            :time 358.5}
           {:length 0.25
            :pitch 66
            :time 359.5}
           {:length 0.5
            :pitch 69
            :time 360}
           {:length 0.25
            :pitch 69
            :time 361.5}
           {:length 0.5
            :pitch 69
            :time 362}
           {:length 0.5
            :pitch 68
            :time 364}
           {:length 0.25
            :pitch 64
            :time 365.5}
           {:length 0.25
            :pitch 68
            :time 366}
           {:length 0.5
            :pitch 64
            :time 366.5}
           {:length 0.25
            :pitch 64
            :time 367.5}
           {:length 0.5
            :pitch 66
            :time 368}
           {:length 0.25
            :pitch 66
            :time 369.5}
           {:length 0.5
            :pitch 66
            :time 370}
           {:length 0.5
            :pitch 67
            :time 372}
           {:length 0.25
            :pitch 62
            :time 373}
           {:length 0.25
            :pitch 64
            :time 373.5}
           {:length 0.25
            :pitch 67
            :time 374}
           {:length 0.25
            :pitch 62
            :time 374.5}
           {:length 0.25
            :pitch 67
            :time 375}
           {:length 0.25
            :pitch 67
            :time 375.5}
           {:length 0.5
            :pitch 66
            :time 376}
           {:length 0.25
            :pitch 66
            :time 377.5}
           {:length 0.5
            :pitch 66
            :time 378}
           {:length 0.5
            :pitch 67
            :time 380}
           {:length 0.25
            :pitch 62
            :time 381}
           {:length 0.25
            :pitch 64
            :time 381.5}
           {:length 0.25
            :pitch 67
            :time 382}
           {:length 0.25
            :pitch 62
            :time 382.5}
           {:length 0.25
            :pitch 67
            :time 383}
           {:length 0.25
            :pitch 66
            :time 383.5}
           {:length 0.5
            :pitch 64
            :time 384}
           {:length 0.25
            :pitch 64
            :time 385.5}
           {:length 0.5
            :pitch 64
            :time 386}
           {:length 0.5
            :pitch 64
            :time 388}
           {:length 0.25
            :pitch 64
            :time 389.5}
           {:length 0.5
            :pitch 64
            :time 390}
           {:time 392
            :length 0.5
            :pitch 71}
           {:time 393.5
            :length 0.25
            :pitch 71}
           {:time 394
            :length 0.5
            :pitch 71}
           {:time 395
            :length 0.25
            :pitch 73}
           {:time 395.5
            :length 0.25
            :pitch 69}
           {:time 396
            :length 0.5
            :pitch 69}
           {:time 397.5
            :length 0.25
            :pitch 69}
           {:time 398
            :length 0.5
            :pitch 69}
           {:time 400
            :length 0.5
            :pitch 64}
           {:time 401.5
            :length 0.25
            :pitch 64}
           {:time 402
            :length 0.5
            :pitch 64}
           {:time 404
            :length 0.5
            :pitch 64}
           {:time 405.5
            :length 0.25
            :pitch 64}
           {:time 406
            :length 0.5
            :pitch 64}
           {:time 408
            :length 0.5
            :pitch 71}
           {:time 409.5
            :length 0.25
            :pitch 71}
           {:time 410
            :length 0.5
            :pitch 71}
           {:time 411
            :length 0.25
            :pitch 73}
           {:time 411.5
            :length 0.25
            :pitch 69}
           {:time 412
            :length 0.5
            :pitch 69}
           {:time 413.5
            :length 0.25
            :pitch 69}
           {:time 414
            :length 0.5
            :pitch 69}
           {:time 416
            :length 0.5
            :pitch 64}
           {:time 417.5
            :length 0.25
            :pitch 64}
           {:time 418
            :length 0.5
            :pitch 64}
           {:time 420
            :length 0.5
            :pitch 64}
           {:time 421.5
            :length 0.25
            :pitch 64}
           {:time 422
            :length 0.5
            :pitch 64}
           {:time 424
            :length 0.5
            :pitch 71}
           {:time 425.5
            :length 0.25
            :pitch 71}
           {:time 426
            :length 0.5
            :pitch 71}
           {:time 427
            :length 0.25
            :pitch 73}
           {:time 427.5
            :length 0.25
            :pitch 69}
           {:time 428
            :length 0.5
            :pitch 69}
           {:time 429.5
            :length 0.25
            :pitch 69}
           {:time 430
            :length 0.5
            :pitch 69}
           {:time 432
            :length 0.5
            :pitch 64}
           {:time 433.5
            :length 0.25
            :pitch 64}
           {:time 434
            :length 0.5
            :pitch 64}
           {:time 436
            :length 0.5
            :pitch 64}
           {:time 437.5
            :length 0.25
            :pitch 64}
           {:time 438
            :length 0.5
            :pitch 64}
           {:time 440
            :length 0.5
            :pitch 71}
           {:time 441.5
            :length 0.25
            :pitch 71}
           {:time 442
            :length 0.5
            :pitch 71}
           {:time 443
            :length 0.25
            :pitch 73}
           {:time 443.5
            :length 0.25
            :pitch 69}
           {:time 444
            :length 0.5
            :pitch 69}
           {:time 445.5
            :length 0.25
            :pitch 69}
           {:time 446
            :length 0.5
            :pitch 69}
           {:time 448
            :length 0.5
            :pitch 64}
           {:time 449.5
            :length 0.25
            :pitch 64}
           {:time 450
            :length 0.5
            :pitch 64}
           {:time 452
            :length 0.5
            :pitch 64}
           {:time 453.5
            :length 0.25
            :pitch 64}
           {:time 454
            :length 0.5
            :pitch 64}
           {:time 456
            :length 0.5
            :pitch 71}
           {:time 457.5
            :length 0.25
            :pitch 71}
           {:time 458
            :length 0.5
            :pitch 71}
           {:time 459
            :length 0.25
            :pitch 73}
           {:time 459.5
            :length 0.25
            :pitch 69}
           {:time 460
            :length 0.5
            :pitch 69}
           {:time 461.5
            :length 0.25
            :pitch 69}
           {:time 462
            :length 0.5
            :pitch 69}
           {:time 464
            :length 0.5
            :pitch 64}
           {:time 465.5
            :length 0.25
            :pitch 64}
           {:time 466
            :length 0.5
            :pitch 64}
           {:time 468
            :length 0.5
            :pitch 64}
           {:time 469.5
            :length 0.25
            :pitch 64}
           {:time 470
            :length 0.5
            :pitch 64}
           {:time 472
            :length 0.5
            :pitch 71}
           {:time 473.5
            :length 0.25
            :pitch 71}
           {:time 474
            :length 0.5
            :pitch 71}
           {:time 475
            :length 0.25
            :pitch 73}
           {:time 475.5
            :length 0.25
            :pitch 69}
           {:time 476
            :length 0.5
            :pitch 69}
           {:time 477.5
            :length 0.25
            :pitch 69}
           {:time 478
            :length 0.5
            :pitch 69}
           {:time 480
            :length 0.5
            :pitch 64}
           {:time 481.5
            :length 0.25
            :pitch 64}
           {:time 482
            :length 0.5
            :pitch 64}
           {:time 484
            :length 0.5
            :pitch 64}
           {:time 485.5
            :length 0.25
            :pitch 64}
           {:time 486
            :length 0.5
            :pitch 64}
           {:time 488
            :length 0.5
            :pitch 71}
           {:time 489.5
            :length 0.25
            :pitch 71}
           {:time 490
            :length 0.5
            :pitch 71}
           {:time 491
            :length 0.25
            :pitch 73}
           {:time 491.5
            :length 0.25
            :pitch 69}
           {:time 492
            :length 0.5
            :pitch 69}
           {:time 493.5
            :length 0.25
            :pitch 69}
           {:time 494
            :length 0.5
            :pitch 69}
           {:time 496
            :length 0.5
            :pitch 64}
           {:time 497.5
            :length 0.25
            :pitch 64}
           {:time 498
            :length 0.5
            :pitch 64}
           {:time 500
            :length 0.5
            :pitch 64}
           {:time 501.5
            :length 0.25
            :pitch 64}
           {:time 502
            :length 0.5
            :pitch 64}
           {:time 504
            :length 0.5
            :pitch 71}
           {:time 505.5
            :length 0.25
            :pitch 71}
           {:time 506
            :length 0.5
            :pitch 71}
           {:time 507
            :length 0.25
            :pitch 73}
           {:time 507.5
            :length 0.25
            :pitch 69}
           {:time 508
            :length 0.5
            :pitch 69}
           {:time 509.5
            :length 0.25
            :pitch 69}
           {:time 510
            :length 0.5
            :pitch 69}
           {:time 512
            :length 0.5
            :pitch 64}
           {:time 513.5
            :length 0.25
            :pitch 64}
           {:time 514
            :length 0.5
            :pitch 64}
           {:time 516
            :length 0.5
            :pitch 64}
           {:time 517.5
            :length 0.25
            :pitch 64}
           {:time 518
            :length 0.5
            :pitch 64}
           {:time 520
            :length 0.5
            :pitch 71}
           {:time 521.5
            :length 0.25
            :pitch 71}
           {:time 522
            :length 0.5
            :pitch 71}
           {:time 523
            :length 0.25
            :pitch 73}
           {:time 523.5
            :length 0.25
            :pitch 69}
           {:time 524
            :length 0.5
            :pitch 69}
           {:time 525.5
            :length 0.25
            :pitch 69}
           {:time 526
            :length 0.5
            :pitch 69}
           {:time 528
            :length 0.5
            :pitch 64}
           {:time 529.5
            :length 0.25
            :pitch 64}
           {:time 530
            :length 0.5
            :pitch 64}
           {:time 532
            :length 0.5
            :pitch 64}
           {:time 533.5
            :length 0.25
            :pitch 64}
           {:time 534
            :length 0.5
            :pitch 64}])

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

(def drums [{:length 0.5
             :pitch 67
             :time 15}
            {:length 0.07
             :pitch 77
             :time 14}
            {:length 0.07
             :pitch 77
             :time 13}
            {:length 0.07
             :pitch 77
             :time 12}
            {:length 0.5
             :pitch 67
             :time 11}
            {:length 0.07
             :pitch 77
             :time 10}
            {:length 0.07
             :pitch 77
             :time 9}
            {:length 0.07
             :pitch 77
             :time 8}
            {:length 0.5
             :pitch 67
             :time 7}
            {:length 0.07
             :pitch 77
             :time 6}
            {:length 0.07
             :pitch 77
             :time 5}
            {:length 0.07
             :pitch 77
             :time 4}
            {:length 0.5
             :pitch 67
             :time 3}
            {:length 0.07
             :pitch 77
             :time 2}
            {:length 0.07
             :pitch 77
             :time 1}
            {:length 0.07
             :pitch 77
             :time 0}
            {:length 0.5
             :pitch 67
             :time 31}
            {:length 0.07
             :pitch 77
             :time 30}
            {:length 0.07
             :pitch 77
             :time 29}
            {:length 0.07
             :pitch 77
             :time 28}
            {:length 0.5
             :pitch 67
             :time 27}
            {:length 0.07
             :pitch 77
             :time 26}
            {:length 0.07
             :pitch 77
             :time 25}
            {:length 0.07
             :pitch 77
             :time 24}
            {:length 0.5
             :pitch 67
             :time 23}
            {:length 0.07
             :pitch 77
             :time 22}
            {:length 0.07
             :pitch 77
             :time 21}
            {:length 0.07
             :pitch 77
             :time 20}
            {:length 0.5
             :pitch 67
             :time 19}
            {:length 0.07
             :pitch 77
             :time 18}
            {:length 0.07
             :pitch 77
             :time 17}
            {:length 0.07
             :pitch 77
             :time 16}
            {:length 0.5
             :pitch 67
             :time 47}
            {:length 0.07
             :pitch 77
             :time 46}
            {:length 0.07
             :pitch 77
             :time 45}
            {:length 0.07
             :pitch 77
             :time 44}
            {:length 0.5
             :pitch 67
             :time 43}
            {:length 0.07
             :pitch 77
             :time 42}
            {:length 0.07
             :pitch 77
             :time 41}
            {:length 0.07
             :pitch 77
             :time 40}
            {:length 0.5
             :pitch 67
             :time 39}
            {:length 0.07
             :pitch 77
             :time 38}
            {:length 0.07
             :pitch 77
             :time 37}
            {:length 0.07
             :pitch 77
             :time 36}
            {:length 0.5
             :pitch 67
             :time 35}
            {:length 0.07
             :pitch 77
             :time 34}
            {:length 0.07
             :pitch 77
             :time 33}
            {:length 0.07
             :pitch 77
             :time 32}
            {:length 0.5
             :pitch 67
             :time 63}
            {:length 0.07
             :pitch 77
             :time 62}
            {:length 0.07
             :pitch 77
             :time 61}
            {:length 0.07
             :pitch 77
             :time 60}
            {:length 0.5
             :pitch 67
             :time 59}
            {:length 0.07
             :pitch 77
             :time 58}
            {:length 0.07
             :pitch 77
             :time 57}
            {:length 0.07
             :pitch 77
             :time 56}
            {:length 0.5
             :pitch 67
             :time 55}
            {:length 0.07
             :pitch 77
             :time 54}
            {:length 0.07
             :pitch 77
             :time 53}
            {:length 0.07
             :pitch 77
             :time 52}
            {:length 0.5
             :pitch 67
             :time 51}
            {:length 0.07
             :pitch 77
             :time 50}
            {:length 0.07
             :pitch 77
             :time 49}
            {:length 0.07
             :pitch 77
             :time 48}
            {:length 0.5
             :pitch 67
             :time 79}
            {:length 0.07
             :pitch 77
             :time 78}
            {:length 0.07
             :pitch 77
             :time 77}
            {:length 0.07
             :pitch 77
             :time 76}
            {:length 0.5
             :pitch 67
             :time 75}
            {:length 0.07
             :pitch 77
             :time 74}
            {:length 0.07
             :pitch 77
             :time 73}
            {:length 0.07
             :pitch 77
             :time 72}
            {:length 0.5
             :pitch 67
             :time 71}
            {:length 0.07
             :pitch 77
             :time 70}
            {:length 0.07
             :pitch 77
             :time 69}
            {:length 0.07
             :pitch 77
             :time 68}
            {:length 0.5
             :pitch 67
             :time 67}
            {:length 0.07
             :pitch 77
             :time 66}
            {:length 0.07
             :pitch 77
             :time 65}
            {:length 0.07
             :pitch 77
             :time 64}
            {:length 0.5
             :pitch 67
             :time 95}
            {:length 0.07
             :pitch 77
             :time 94}
            {:length 0.07
             :pitch 77
             :time 93}
            {:length 0.07
             :pitch 77
             :time 92}
            {:length 0.5
             :pitch 67
             :time 91}
            {:length 0.07
             :pitch 77
             :time 90}
            {:length 0.07
             :pitch 77
             :time 89}
            {:length 0.07
             :pitch 77
             :time 88}
            {:length 0.5
             :pitch 67
             :time 87}
            {:length 0.07
             :pitch 77
             :time 86}
            {:length 0.07
             :pitch 77
             :time 85}
            {:length 0.07
             :pitch 77
             :time 84}
            {:length 0.5
             :pitch 67
             :time 83}
            {:length 0.07
             :pitch 77
             :time 82}
            {:length 0.07
             :pitch 77
             :time 81}
            {:length 0.07
             :pitch 77
             :time 80}
            {:length 0.5
             :pitch 67
             :time 111}
            {:length 0.07
             :pitch 77
             :time 110}
            {:length 0.07
             :pitch 77
             :time 109}
            {:length 0.07
             :pitch 77
             :time 108}
            {:length 0.5
             :pitch 67
             :time 107}
            {:length 0.07
             :pitch 77
             :time 106}
            {:length 0.07
             :pitch 77
             :time 105}
            {:length 0.07
             :pitch 77
             :time 104}
            {:length 0.5
             :pitch 67
             :time 103}
            {:length 0.07
             :pitch 77
             :time 102}
            {:length 0.07
             :pitch 77
             :time 101}
            {:length 0.07
             :pitch 77
             :time 100}
            {:length 0.5
             :pitch 67
             :time 99}
            {:length 0.07
             :pitch 77
             :time 98}
            {:length 0.07
             :pitch 77
             :time 97}
            {:length 0.07
             :pitch 77
             :time 96}
            {:length 0.5
             :pitch 67
             :time 127}
            {:length 0.07
             :pitch 77
             :time 126}
            {:length 0.07
             :pitch 77
             :time 125}
            {:length 0.07
             :pitch 77
             :time 124}
            {:length 0.5
             :pitch 67
             :time 123}
            {:length 0.07
             :pitch 77
             :time 122}
            {:length 0.07
             :pitch 77
             :time 121}
            {:length 0.07
             :pitch 77
             :time 120}
            {:length 0.5
             :pitch 67
             :time 119}
            {:length 0.07
             :pitch 77
             :time 118}
            {:length 0.07
             :pitch 77
             :time 117}
            {:length 0.07
             :pitch 77
             :time 116}
            {:length 0.5
             :pitch 67
             :time 115}
            {:length 0.07
             :pitch 77
             :time 114}
            {:length 0.07
             :pitch 77
             :time 113}
            {:length 0.07
             :pitch 77
             :time 112}
            {:length 0.5
             :pitch 67
             :time 131}
            {:length 0.07
             :pitch 77
             :time 130}
            {:length 0.07
             :pitch 77
             :time 129}
            {:length 0.07
             :pitch 77
             :time 128}
            {:length 0.07
             :pitch 77
             :time 139.5}
            {:length 0.5
             :pitch 67
             :time 139}
            {:length 0.07
             :pitch 77
             :time 138.5}
            {:length 0.07
             :pitch 77
             :time 138}
            {:length 0.07
             :pitch 77
             :time 137.5}
            {:length 0.5
             :pitch 67
             :time 137}
            {:length 0.07
             :pitch 77
             :time 136.5}
            {:length 0.07
             :pitch 77
             :time 136}
            {:length 0.07
             :pitch 77
             :time 135.5}
            {:length 0.5
             :pitch 67
             :time 135}
            {:length 0.07
             :pitch 77
             :time 134.5}
            {:length 0.07
             :pitch 77
             :time 134}
            {:length 0.07
             :pitch 77
             :time 133.5}
            {:length 0.5
             :pitch 67
             :time 133}
            {:length 0.07
             :pitch 77
             :time 132.5}
            {:length 0.07
             :pitch 77
             :time 132}
            {:length 0.07
             :pitch 77
             :time 147.5}
            {:length 0.5
             :pitch 67
             :time 147}
            {:length 0.07
             :pitch 77
             :time 146.5}
            {:length 0.07
             :pitch 77
             :time 146}
            {:length 0.07
             :pitch 77
             :time 145.5}
            {:length 0.5
             :pitch 67
             :time 145}
            {:length 0.07
             :pitch 77
             :time 144.5}
            {:length 0.07
             :pitch 77
             :time 144}
            {:length 0.07
             :pitch 77
             :time 143.5}
            {:length 0.5
             :pitch 67
             :time 143}
            {:length 0.07
             :pitch 77
             :time 142.5}
            {:length 0.07
             :pitch 77
             :time 142}
            {:length 0.07
             :pitch 77
             :time 141.5}
            {:length 0.5
             :pitch 67
             :time 141}
            {:length 0.07
             :pitch 77
             :time 140.5}
            {:length 0.07
             :pitch 77
             :time 140}
            {:length 0.07
             :pitch 77
             :time 155.5}
            {:length 0.5
             :pitch 67
             :time 155}
            {:length 0.07
             :pitch 77
             :time 154.5}
            {:length 0.07
             :pitch 77
             :time 154}
            {:length 0.07
             :pitch 77
             :time 153.5}
            {:length 0.5
             :pitch 67
             :time 153}
            {:length 0.07
             :pitch 77
             :time 152.5}
            {:length 0.07
             :pitch 77
             :time 152}
            {:length 0.07
             :pitch 77
             :time 151.5}
            {:length 0.5
             :pitch 67
             :time 151}
            {:length 0.07
             :pitch 77
             :time 150.5}
            {:length 0.07
             :pitch 77
             :time 150}
            {:length 0.07
             :pitch 77
             :time 149.5}
            {:length 0.5
             :pitch 67
             :time 149}
            {:length 0.07
             :pitch 77
             :time 148.5}
            {:length 0.07
             :pitch 77
             :time 148}
            {:length 0.07
             :pitch 77
             :time 163.5}
            {:length 0.5
             :pitch 67
             :time 163}
            {:length 0.07
             :pitch 77
             :time 162.5}
            {:length 0.07
             :pitch 77
             :time 162}
            {:length 0.07
             :pitch 77
             :time 161.5}
            {:length 0.5
             :pitch 67
             :time 161}
            {:length 0.07
             :pitch 77
             :time 160.5}
            {:length 0.07
             :pitch 77
             :time 160}
            {:length 0.07
             :pitch 77
             :time 159.5}
            {:length 0.5
             :pitch 67
             :time 159}
            {:length 0.07
             :pitch 77
             :time 158.5}
            {:length 0.07
             :pitch 77
             :time 158}
            {:length 0.07
             :pitch 77
             :time 157.5}
            {:length 0.5
             :pitch 67
             :time 157}
            {:length 0.07
             :pitch 77
             :time 156.5}
            {:length 0.07
             :pitch 77
             :time 156}
            {:length 0.07
             :pitch 77
             :time 171.5}
            {:length 0.5
             :pitch 67
             :time 171}
            {:length 0.07
             :pitch 77
             :time 170.5}
            {:length 0.07
             :pitch 77
             :time 170}
            {:length 0.07
             :pitch 77
             :time 169.5}
            {:length 0.5
             :pitch 67
             :time 169}
            {:length 0.07
             :pitch 77
             :time 168.5}
            {:length 0.07
             :pitch 77
             :time 168}
            {:length 0.07
             :pitch 77
             :time 167.5}
            {:length 0.5
             :pitch 67
             :time 167}
            {:length 0.07
             :pitch 77
             :time 166.5}
            {:length 0.07
             :pitch 77
             :time 166}
            {:length 0.07
             :pitch 77
             :time 165.5}
            {:length 0.5
             :pitch 67
             :time 165}
            {:length 0.07
             :pitch 77
             :time 164.5}
            {:length 0.07
             :pitch 77
             :time 164}
            {:length 0.07
             :pitch 77
             :time 179.5}
            {:length 0.5
             :pitch 67
             :time 179}
            {:length 0.07
             :pitch 77
             :time 178.5}
            {:length 0.07
             :pitch 77
             :time 178}
            {:length 0.07
             :pitch 77
             :time 177.5}
            {:length 0.5
             :pitch 67
             :time 177}
            {:length 0.07
             :pitch 77
             :time 176.5}
            {:length 0.07
             :pitch 77
             :time 176}
            {:length 0.07
             :pitch 77
             :time 175.5}
            {:length 0.5
             :pitch 67
             :time 175}
            {:length 0.07
             :pitch 77
             :time 174.5}
            {:length 0.07
             :pitch 77
             :time 174}
            {:length 0.07
             :pitch 77
             :time 173.5}
            {:length 0.5
             :pitch 67
             :time 173}
            {:length 0.07
             :pitch 77
             :time 172.5}
            {:length 0.07
             :pitch 77
             :time 172}
            {:length 0.07
             :pitch 77
             :time 187.5}
            {:length 0.5
             :pitch 67
             :time 187}
            {:length 0.07
             :pitch 77
             :time 186.5}
            {:length 0.07
             :pitch 77
             :time 186}
            {:length 0.07
             :pitch 77
             :time 185.5}
            {:length 0.5
             :pitch 67
             :time 185}
            {:length 0.07
             :pitch 77
             :time 184.5}
            {:length 0.07
             :pitch 77
             :time 184}
            {:length 0.07
             :pitch 77
             :time 183.5}
            {:length 0.5
             :pitch 67
             :time 183}
            {:length 0.07
             :pitch 77
             :time 182.5}
            {:length 0.07
             :pitch 77
             :time 182}
            {:length 0.07
             :pitch 77
             :time 181.5}
            {:length 0.5
             :pitch 67
             :time 181}
            {:length 0.07
             :pitch 77
             :time 180.5}
            {:length 0.07
             :pitch 77
             :time 180}
            {:length 0.07
             :pitch 77
             :time 195.5}
            {:length 0.5
             :pitch 67
             :time 195}
            {:length 0.07
             :pitch 77
             :time 194.5}
            {:length 0.07
             :pitch 77
             :time 194}
            {:length 0.07
             :pitch 77
             :time 193.5}
            {:length 0.5
             :pitch 67
             :time 193}
            {:length 0.07
             :pitch 77
             :time 192.5}
            {:length 0.07
             :pitch 77
             :time 192}
            {:length 0.07
             :pitch 77
             :time 191.5}
            {:length 0.5
             :pitch 67
             :time 191}
            {:length 0.07
             :pitch 77
             :time 190.5}
            {:length 0.07
             :pitch 77
             :time 190}
            {:length 0.07
             :pitch 77
             :time 189.5}
            {:length 0.5
             :pitch 67
             :time 189}
            {:length 0.07
             :pitch 77
             :time 188.5}
            {:length 0.07
             :pitch 77
             :time 188}
            {:length 0.5
             :pitch 67
             :time 211}
            {:length 0.07
             :pitch 77
             :time 210}
            {:length 0.07
             :pitch 77
             :time 209}
            {:length 0.07
             :pitch 77
             :time 208}
            {:length 0.5
             :pitch 67
             :time 207}
            {:length 0.07
             :pitch 77
             :time 206}
            {:length 0.07
             :pitch 77
             :time 205}
            {:length 0.07
             :pitch 77
             :time 204}
            {:length 0.5
             :pitch 67
             :time 203}
            {:length 0.07
             :pitch 77
             :time 202}
            {:length 0.07
             :pitch 77
             :time 201}
            {:length 0.07
             :pitch 77
             :time 200}
            {:length 0.5
             :pitch 67
             :time 199}
            {:length 0.07
             :pitch 77
             :time 198}
            {:length 0.07
             :pitch 77
             :time 197}
            {:length 0.07
             :pitch 77
             :time 196}
            {:length 0.5
             :pitch 67
             :time 227}
            {:length 0.07
             :pitch 77
             :time 226}
            {:length 0.07
             :pitch 77
             :time 225}
            {:length 0.07
             :pitch 77
             :time 224}
            {:length 0.5
             :pitch 67
             :time 223}
            {:length 0.07
             :pitch 77
             :time 222}
            {:length 0.07
             :pitch 77
             :time 221}
            {:length 0.07
             :pitch 77
             :time 220}
            {:length 0.5
             :pitch 67
             :time 219}
            {:length 0.07
             :pitch 77
             :time 218}
            {:length 0.07
             :pitch 77
             :time 217}
            {:length 0.07
             :pitch 77
             :time 216}
            {:length 0.5
             :pitch 67
             :time 215}
            {:length 0.07
             :pitch 77
             :time 214}
            {:length 0.07
             :pitch 77
             :time 213}
            {:length 0.07
             :pitch 77
             :time 212}
            {:length 0.5
             :pitch 67
             :time 243}
            {:length 0.07
             :pitch 77
             :time 242}
            {:length 0.07
             :pitch 77
             :time 241}
            {:length 0.07
             :pitch 77
             :time 240}
            {:length 0.5
             :pitch 67
             :time 239}
            {:length 0.07
             :pitch 77
             :time 238}
            {:length 0.07
             :pitch 77
             :time 237}
            {:length 0.07
             :pitch 77
             :time 236}
            {:length 0.5
             :pitch 67
             :time 235}
            {:length 0.07
             :pitch 77
             :time 234}
            {:length 0.07
             :pitch 77
             :time 233}
            {:length 0.07
             :pitch 77
             :time 232}
            {:length 0.5
             :pitch 67
             :time 231}
            {:length 0.07
             :pitch 77
             :time 230}
            {:length 0.07
             :pitch 77
             :time 229}
            {:length 0.07
             :pitch 77
             :time 228}
            {:length 0.5
             :pitch 67
             :time 259}
            {:length 0.07
             :pitch 77
             :time 258}
            {:length 0.07
             :pitch 77
             :time 257}
            {:length 0.07
             :pitch 77
             :time 256}
            {:length 0.5
             :pitch 67
             :time 255}
            {:length 0.07
             :pitch 77
             :time 254}
            {:length 0.07
             :pitch 77
             :time 253}
            {:length 0.07
             :pitch 77
             :time 252}
            {:length 0.5
             :pitch 67
             :time 251}
            {:length 0.07
             :pitch 77
             :time 250}
            {:length 0.07
             :pitch 77
             :time 249}
            {:length 0.07
             :pitch 77
             :time 248}
            {:length 0.5
             :pitch 67
             :time 247}
            {:length 0.07
             :pitch 77
             :time 246}
            {:length 0.07
             :pitch 77
             :time 245}
            {:length 0.07
             :pitch 77
             :time 244}
            {:length 0.5
             :pitch 67
             :time 275}
            {:length 0.07
             :pitch 77
             :time 274}
            {:length 0.07
             :pitch 77
             :time 273}
            {:length 0.07
             :pitch 77
             :time 272}
            {:length 0.5
             :pitch 67
             :time 271}
            {:length 0.07
             :pitch 77
             :time 270}
            {:length 0.07
             :pitch 77
             :time 269}
            {:length 0.07
             :pitch 77
             :time 268}
            {:length 0.5
             :pitch 67
             :time 267}
            {:length 0.07
             :pitch 77
             :time 266}
            {:length 0.07
             :pitch 77
             :time 265}
            {:length 0.07
             :pitch 77
             :time 264}
            {:length 0.5
             :pitch 67
             :time 263}
            {:length 0.07
             :pitch 77
             :time 262}
            {:length 0.07
             :pitch 77
             :time 261}
            {:length 0.07
             :pitch 77
             :time 260}
            {:length 0.5
             :pitch 67
             :time 291}
            {:length 0.07
             :pitch 77
             :time 290}
            {:length 0.07
             :pitch 77
             :time 289}
            {:length 0.07
             :pitch 77
             :time 288}
            {:length 0.5
             :pitch 67
             :time 287}
            {:length 0.07
             :pitch 77
             :time 286}
            {:length 0.07
             :pitch 77
             :time 285}
            {:length 0.07
             :pitch 77
             :time 284}
            {:length 0.5
             :pitch 67
             :time 283}
            {:length 0.07
             :pitch 77
             :time 282}
            {:length 0.07
             :pitch 77
             :time 281}
            {:length 0.07
             :pitch 77
             :time 280}
            {:length 0.5
             :pitch 67
             :time 279}
            {:length 0.07
             :pitch 77
             :time 278}
            {:length 0.07
             :pitch 77
             :time 277}
            {:length 0.07
             :pitch 77
             :time 276}
            {:length 0.5
             :pitch 67
             :time 307}
            {:length 0.07
             :pitch 77
             :time 306}
            {:length 0.07
             :pitch 77
             :time 305}
            {:length 0.07
             :pitch 77
             :time 304}
            {:length 0.5
             :pitch 67
             :time 303}
            {:length 0.07
             :pitch 77
             :time 302}
            {:length 0.07
             :pitch 77
             :time 301}
            {:length 0.07
             :pitch 77
             :time 300}
            {:length 0.5
             :pitch 67
             :time 299}
            {:length 0.07
             :pitch 77
             :time 298}
            {:length 0.07
             :pitch 77
             :time 297}
            {:length 0.07
             :pitch 77
             :time 296}
            {:length 0.5
             :pitch 67
             :time 295}
            {:length 0.07
             :pitch 77
             :time 294}
            {:length 0.07
             :pitch 77
             :time 293}
            {:length 0.07
             :pitch 77
             :time 292}
            {:length 0.5
             :pitch 67
             :time 323}
            {:length 0.07
             :pitch 77
             :time 322}
            {:length 0.07
             :pitch 77
             :time 321}
            {:length 0.07
             :pitch 77
             :time 320}
            {:length 0.5
             :pitch 67
             :time 319}
            {:length 0.07
             :pitch 77
             :time 318}
            {:length 0.07
             :pitch 77
             :time 317}
            {:length 0.07
             :pitch 77
             :time 316}
            {:length 0.5
             :pitch 67
             :time 315}
            {:length 0.07
             :pitch 77
             :time 314}
            {:length 0.07
             :pitch 77
             :time 313}
            {:length 0.07
             :pitch 77
             :time 312}
            {:length 0.5
             :pitch 67
             :time 311}
            {:length 0.07
             :pitch 77
             :time 310}
            {:length 0.07
             :pitch 77
             :time 309}
            {:length 0.07
             :pitch 77
             :time 308}
            {:length 0.5
             :pitch 67
             :time 327}
            {:length 0.07
             :pitch 77
             :time 326}
            {:length 0.07
             :pitch 77
             :time 325}
            {:length 0.07
             :pitch 77
             :time 324}
            {:length 0.07
             :pitch 77
             :time 335.5}
            {:length 0.5
             :pitch 67
             :time 335}
            {:length 0.07
             :pitch 77
             :time 334.5}
            {:length 0.07
             :pitch 77
             :time 334}
            {:length 0.07
             :pitch 77
             :time 333.5}
            {:length 0.5
             :pitch 67
             :time 333}
            {:length 0.07
             :pitch 77
             :time 332.5}
            {:length 0.07
             :pitch 77
             :time 332}
            {:length 0.07
             :pitch 77
             :time 331.5}
            {:length 0.5
             :pitch 67
             :time 331}
            {:length 0.07
             :pitch 77
             :time 330.5}
            {:length 0.07
             :pitch 77
             :time 330}
            {:length 0.07
             :pitch 77
             :time 329.5}
            {:length 0.5
             :pitch 67
             :time 329}
            {:length 0.07
             :pitch 77
             :time 328.5}
            {:length 0.07
             :pitch 77
             :time 328}
            {:length 0.07
             :pitch 77
             :time 343.5}
            {:length 0.5
             :pitch 67
             :time 343}
            {:length 0.07
             :pitch 77
             :time 342.5}
            {:length 0.07
             :pitch 77
             :time 342}
            {:length 0.07
             :pitch 77
             :time 341.5}
            {:length 0.5
             :pitch 67
             :time 341}
            {:length 0.07
             :pitch 77
             :time 340.5}
            {:length 0.07
             :pitch 77
             :time 340}
            {:length 0.07
             :pitch 77
             :time 339.5}
            {:length 0.5
             :pitch 67
             :time 339}
            {:length 0.07
             :pitch 77
             :time 338.5}
            {:length 0.07
             :pitch 77
             :time 338}
            {:length 0.07
             :pitch 77
             :time 337.5}
            {:length 0.5
             :pitch 67
             :time 337}
            {:length 0.07
             :pitch 77
             :time 336.5}
            {:length 0.07
             :pitch 77
             :time 336}
            {:length 0.07
             :pitch 77
             :time 351.5}
            {:length 0.5
             :pitch 67
             :time 351}
            {:length 0.07
             :pitch 77
             :time 350.5}
            {:length 0.07
             :pitch 77
             :time 350}
            {:length 0.07
             :pitch 77
             :time 349.5}
            {:length 0.5
             :pitch 67
             :time 349}
            {:length 0.07
             :pitch 77
             :time 348.5}
            {:length 0.07
             :pitch 77
             :time 348}
            {:length 0.07
             :pitch 77
             :time 347.5}
            {:length 0.5
             :pitch 67
             :time 347}
            {:length 0.07
             :pitch 77
             :time 346.5}
            {:length 0.07
             :pitch 77
             :time 346}
            {:length 0.07
             :pitch 77
             :time 345.5}
            {:length 0.5
             :pitch 67
             :time 345}
            {:length 0.07
             :pitch 77
             :time 344.5}
            {:length 0.07
             :pitch 77
             :time 344}
            {:length 0.07
             :pitch 77
             :time 359.5}
            {:length 0.5
             :pitch 67
             :time 359}
            {:length 0.07
             :pitch 77
             :time 358.5}
            {:length 0.07
             :pitch 77
             :time 358}
            {:length 0.07
             :pitch 77
             :time 357.5}
            {:length 0.5
             :pitch 67
             :time 357}
            {:length 0.07
             :pitch 77
             :time 356.5}
            {:length 0.07
             :pitch 77
             :time 356}
            {:length 0.07
             :pitch 77
             :time 355.5}
            {:length 0.5
             :pitch 67
             :time 355}
            {:length 0.07
             :pitch 77
             :time 354.5}
            {:length 0.07
             :pitch 77
             :time 354}
            {:length 0.07
             :pitch 77
             :time 353.5}
            {:length 0.5
             :pitch 67
             :time 353}
            {:length 0.07
             :pitch 77
             :time 352.5}
            {:length 0.07
             :pitch 77
             :time 352}
            {:length 0.07
             :pitch 77
             :time 367.5}
            {:length 0.5
             :pitch 67
             :time 367}
            {:length 0.07
             :pitch 77
             :time 366.5}
            {:length 0.07
             :pitch 77
             :time 366}
            {:length 0.07
             :pitch 77
             :time 365.5}
            {:length 0.5
             :pitch 67
             :time 365}
            {:length 0.07
             :pitch 77
             :time 364.5}
            {:length 0.07
             :pitch 77
             :time 364}
            {:length 0.07
             :pitch 77
             :time 363.5}
            {:length 0.5
             :pitch 67
             :time 363}
            {:length 0.07
             :pitch 77
             :time 362.5}
            {:length 0.07
             :pitch 77
             :time 362}
            {:length 0.07
             :pitch 77
             :time 361.5}
            {:length 0.5
             :pitch 67
             :time 361}
            {:length 0.07
             :pitch 77
             :time 360.5}
            {:length 0.07
             :pitch 77
             :time 360}
            {:length 0.07
             :pitch 77
             :time 375.5}
            {:length 0.5
             :pitch 67
             :time 375}
            {:length 0.07
             :pitch 77
             :time 374.5}
            {:length 0.07
             :pitch 77
             :time 374}
            {:length 0.07
             :pitch 77
             :time 373.5}
            {:length 0.5
             :pitch 67
             :time 373}
            {:length 0.07
             :pitch 77
             :time 372.5}
            {:length 0.07
             :pitch 77
             :time 372}
            {:length 0.07
             :pitch 77
             :time 371.5}
            {:length 0.5
             :pitch 67
             :time 371}
            {:length 0.07
             :pitch 77
             :time 370.5}
            {:length 0.07
             :pitch 77
             :time 370}
            {:length 0.07
             :pitch 77
             :time 369.5}
            {:length 0.5
             :pitch 67
             :time 369}
            {:length 0.07
             :pitch 77
             :time 368.5}
            {:length 0.07
             :pitch 77
             :time 368}
            {:length 0.07
             :pitch 77
             :time 383.5}
            {:length 0.5
             :pitch 67
             :time 383}
            {:length 0.07
             :pitch 77
             :time 382.5}
            {:length 0.07
             :pitch 77
             :time 382}
            {:length 0.07
             :pitch 77
             :time 381.5}
            {:length 0.5
             :pitch 67
             :time 381}
            {:length 0.07
             :pitch 77
             :time 380.5}
            {:length 0.07
             :pitch 77
             :time 380}
            {:length 0.07
             :pitch 77
             :time 379.5}
            {:length 0.5
             :pitch 67
             :time 379}
            {:length 0.07
             :pitch 77
             :time 378.5}
            {:length 0.07
             :pitch 77
             :time 378}
            {:length 0.07
             :pitch 77
             :time 377.5}
            {:length 0.5
             :pitch 67
             :time 377}
            {:length 0.07
             :pitch 77
             :time 376.5}
            {:length 0.07
             :pitch 77
             :time 376}
            {:length 0.07
             :pitch 77
             :time 391.5}
            {:length 0.5
             :pitch 67
             :time 391}
            {:length 0.07
             :pitch 77
             :time 390.5}
            {:length 0.07
             :pitch 77
             :time 390}
            {:length 0.07
             :pitch 77
             :time 389.5}
            {:length 0.5
             :pitch 67
             :time 389}
            {:length 0.07
             :pitch 77
             :time 388.5}
            {:length 0.07
             :pitch 77
             :time 388}
            {:length 0.07
             :pitch 77
             :time 387.5}
            {:length 0.5
             :pitch 67
             :time 387}
            {:length 0.07
             :pitch 77
             :time 386.5}
            {:length 0.07
             :pitch 77
             :time 386}
            {:length 0.07
             :pitch 77
             :time 385.5}
            {:length 0.5
             :pitch 67
             :time 385}
            {:length 0.07
             :pitch 77
             :time 384.5}
            {:length 0.07
             :pitch 77
             :time 384}
            {:length 0.07
             :pitch 77
             :time 399.5}
            {:length 0.5
             :pitch 67
             :time 399}
            {:length 0.07
             :pitch 77
             :time 398.5}
            {:length 0.07
             :pitch 77
             :time 398}
            {:length 0.07
             :pitch 77
             :time 397.5}
            {:length 0.5
             :pitch 67
             :time 397}
            {:length 0.07
             :pitch 77
             :time 396.5}
            {:length 0.07
             :pitch 77
             :time 396}
            {:length 0.07
             :pitch 77
             :time 395.5}
            {:length 0.5
             :pitch 67
             :time 395}
            {:length 0.07
             :pitch 77
             :time 394.5}
            {:length 0.07
             :pitch 77
             :time 394}
            {:length 0.07
             :pitch 77
             :time 393.5}
            {:length 0.5
             :pitch 67
             :time 393}
            {:length 0.07
             :pitch 77
             :time 392.5}
            {:length 0.07
             :pitch 77
             :time 392}
            {:length 0.07
             :pitch 77
             :time 407.5}
            {:length 0.5
             :pitch 67
             :time 407}
            {:length 0.07
             :pitch 77
             :time 406.5}
            {:length 0.07
             :pitch 77
             :time 406}
            {:length 0.07
             :pitch 77
             :time 405.5}
            {:length 0.5
             :pitch 67
             :time 405}
            {:length 0.07
             :pitch 77
             :time 404.5}
            {:length 0.07
             :pitch 77
             :time 404}
            {:length 0.07
             :pitch 77
             :time 403.5}
            {:length 0.5
             :pitch 67
             :time 403}
            {:length 0.07
             :pitch 77
             :time 402.5}
            {:length 0.07
             :pitch 77
             :time 402}
            {:length 0.07
             :pitch 77
             :time 401.5}
            {:length 0.5
             :pitch 67
             :time 401}
            {:length 0.07
             :pitch 77
             :time 400.5}
            {:length 0.07
             :pitch 77
             :time 400}
            {:length 0.07
             :pitch 77
             :time 415.5}
            {:length 0.5
             :pitch 67
             :time 415}
            {:length 0.07
             :pitch 77
             :time 414.5}
            {:length 0.07
             :pitch 77
             :time 414}
            {:length 0.07
             :pitch 77
             :time 413.5}
            {:length 0.5
             :pitch 67
             :time 413}
            {:length 0.07
             :pitch 77
             :time 412.5}
            {:length 0.07
             :pitch 77
             :time 412}
            {:length 0.07
             :pitch 77
             :time 411.5}
            {:length 0.5
             :pitch 67
             :time 411}
            {:length 0.07
             :pitch 77
             :time 410.5}
            {:length 0.07
             :pitch 77
             :time 410}
            {:length 0.07
             :pitch 77
             :time 409.5}
            {:length 0.5
             :pitch 67
             :time 409}
            {:length 0.07
             :pitch 77
             :time 408.5}
            {:length 0.07
             :pitch 77
             :time 408}
            {:length 0.07
             :pitch 77
             :time 423.5}
            {:length 0.5
             :pitch 67
             :time 423}
            {:length 0.07
             :pitch 77
             :time 422.5}
            {:length 0.07
             :pitch 77
             :time 422}
            {:length 0.07
             :pitch 77
             :time 421.5}
            {:length 0.5
             :pitch 67
             :time 421}
            {:length 0.07
             :pitch 77
             :time 420.5}
            {:length 0.07
             :pitch 77
             :time 420}
            {:length 0.07
             :pitch 77
             :time 419.5}
            {:length 0.5
             :pitch 67
             :time 419}
            {:length 0.07
             :pitch 77
             :time 418.5}
            {:length 0.07
             :pitch 77
             :time 418}
            {:length 0.07
             :pitch 77
             :time 417.5}
            {:length 0.5
             :pitch 67
             :time 417}
            {:length 0.07
             :pitch 77
             :time 416.5}
            {:length 0.07
             :pitch 77
             :time 416}
            {:length 0.07
             :pitch 77
             :time 431.5}
            {:length 0.5
             :pitch 67
             :time 431}
            {:length 0.07
             :pitch 77
             :time 430.5}
            {:length 0.07
             :pitch 77
             :time 430}
            {:length 0.07
             :pitch 77
             :time 429.5}
            {:length 0.5
             :pitch 67
             :time 429}
            {:length 0.07
             :pitch 77
             :time 428.5}
            {:length 0.07
             :pitch 77
             :time 428}
            {:length 0.07
             :pitch 77
             :time 427.5}
            {:length 0.5
             :pitch 67
             :time 427}
            {:length 0.07
             :pitch 77
             :time 426.5}
            {:length 0.07
             :pitch 77
             :time 426}
            {:length 0.07
             :pitch 77
             :time 425.5}
            {:length 0.5
             :pitch 67
             :time 425}
            {:length 0.07
             :pitch 77
             :time 424.5}
            {:length 0.07
             :pitch 77
             :time 424}
            {:length 0.07
             :pitch 77
             :time 439.5}
            {:length 0.5
             :pitch 67
             :time 439}
            {:length 0.07
             :pitch 77
             :time 438.5}
            {:length 0.07
             :pitch 77
             :time 438}
            {:length 0.07
             :pitch 77
             :time 437.5}
            {:length 0.5
             :pitch 67
             :time 437}
            {:length 0.07
             :pitch 77
             :time 436.5}
            {:length 0.07
             :pitch 77
             :time 436}
            {:length 0.07
             :pitch 77
             :time 435.5}
            {:length 0.5
             :pitch 67
             :time 435}
            {:length 0.07
             :pitch 77
             :time 434.5}
            {:length 0.07
             :pitch 77
             :time 434}
            {:length 0.07
             :pitch 77
             :time 433.5}
            {:length 0.5
             :pitch 67
             :time 433}
            {:length 0.07
             :pitch 77
             :time 432.5}
            {:length 0.07
             :pitch 77
             :time 432}
            {:length 0.07
             :pitch 77
             :time 447.5}
            {:length 0.5
             :pitch 67
             :time 447}
            {:length 0.07
             :pitch 77
             :time 446.5}
            {:length 0.07
             :pitch 77
             :time 446}
            {:length 0.07
             :pitch 77
             :time 445.5}
            {:length 0.5
             :pitch 67
             :time 445}
            {:length 0.07
             :pitch 77
             :time 444.5}
            {:length 0.07
             :pitch 77
             :time 444}
            {:length 0.07
             :pitch 77
             :time 443.5}
            {:length 0.5
             :pitch 67
             :time 443}
            {:length 0.07
             :pitch 77
             :time 442.5}
            {:length 0.07
             :pitch 77
             :time 442}
            {:length 0.07
             :pitch 77
             :time 441.5}
            {:length 0.5
             :pitch 67
             :time 441}
            {:length 0.07
             :pitch 77
             :time 440.5}
            {:length 0.07
             :pitch 77
             :time 440}
            {:length 0.07
             :pitch 77
             :time 455.5}
            {:length 0.5
             :pitch 67
             :time 455}
            {:length 0.07
             :pitch 77
             :time 454.5}
            {:length 0.07
             :pitch 77
             :time 454}
            {:length 0.07
             :pitch 77
             :time 453.5}
            {:length 0.5
             :pitch 67
             :time 453}
            {:length 0.07
             :pitch 77
             :time 452.5}
            {:length 0.07
             :pitch 77
             :time 452}
            {:length 0.07
             :pitch 77
             :time 451.5}
            {:length 0.5
             :pitch 67
             :time 451}
            {:length 0.07
             :pitch 77
             :time 450.5}
            {:length 0.07
             :pitch 77
             :time 450}
            {:length 0.07
             :pitch 77
             :time 449.5}
            {:length 0.5
             :pitch 67
             :time 449}
            {:length 0.07
             :pitch 77
             :time 448.5}
            {:length 0.07
             :pitch 77
             :time 448}
            {:length 0.07
             :pitch 77
             :time 463.5}
            {:length 0.5
             :pitch 67
             :time 463}
            {:length 0.07
             :pitch 77
             :time 462.5}
            {:length 0.07
             :pitch 77
             :time 462}
            {:length 0.07
             :pitch 77
             :time 461.5}
            {:length 0.5
             :pitch 67
             :time 461}
            {:length 0.07
             :pitch 77
             :time 460.5}
            {:length 0.07
             :pitch 77
             :time 460}
            {:length 0.07
             :pitch 77
             :time 459.5}
            {:length 0.5
             :pitch 67
             :time 459}
            {:length 0.07
             :pitch 77
             :time 458.5}
            {:length 0.07
             :pitch 77
             :time 458}
            {:length 0.07
             :pitch 77
             :time 457.5}
            {:length 0.5
             :pitch 67
             :time 457}
            {:length 0.07
             :pitch 77
             :time 456.5}
            {:length 0.07
             :pitch 77
             :time 456}
            {:length 0.07
             :pitch 77
             :time 471.5}
            {:length 0.5
             :pitch 67
             :time 471}
            {:length 0.07
             :pitch 77
             :time 470.5}
            {:length 0.07
             :pitch 77
             :time 470}
            {:length 0.07
             :pitch 77
             :time 469.5}
            {:length 0.5
             :pitch 67
             :time 469}
            {:length 0.07
             :pitch 77
             :time 468.5}
            {:length 0.07
             :pitch 77
             :time 468}
            {:length 0.07
             :pitch 77
             :time 467.5}
            {:length 0.5
             :pitch 67
             :time 467}
            {:length 0.07
             :pitch 77
             :time 466.5}
            {:length 0.07
             :pitch 77
             :time 466}
            {:length 0.07
             :pitch 77
             :time 465.5}
            {:length 0.5
             :pitch 67
             :time 465}
            {:length 0.07
             :pitch 77
             :time 464.5}
            {:length 0.07
             :pitch 77
             :time 464}
            {:length 0.07
             :pitch 77
             :time 479.5}
            {:length 0.5
             :pitch 67
             :time 479}
            {:length 0.07
             :pitch 77
             :time 478.5}
            {:length 0.07
             :pitch 77
             :time 478}
            {:length 0.07
             :pitch 77
             :time 477.5}
            {:length 0.5
             :pitch 67
             :time 477}
            {:length 0.07
             :pitch 77
             :time 476.5}
            {:length 0.07
             :pitch 77
             :time 476}
            {:length 0.07
             :pitch 77
             :time 475.5}
            {:length 0.5
             :pitch 67
             :time 475}
            {:length 0.07
             :pitch 77
             :time 474.5}
            {:length 0.07
             :pitch 77
             :time 474}
            {:length 0.07
             :pitch 77
             :time 473.5}
            {:length 0.5
             :pitch 67
             :time 473}
            {:length 0.07
             :pitch 77
             :time 472.5}
            {:length 0.07
             :pitch 77
             :time 472}
            {:length 0.07
             :pitch 77
             :time 487.5}
            {:length 0.5
             :pitch 67
             :time 487}
            {:length 0.07
             :pitch 77
             :time 486.5}
            {:length 0.07
             :pitch 77
             :time 486}
            {:length 0.07
             :pitch 77
             :time 485.5}
            {:length 0.5
             :pitch 67
             :time 485}
            {:length 0.07
             :pitch 77
             :time 484.5}
            {:length 0.07
             :pitch 77
             :time 484}
            {:length 0.07
             :pitch 77
             :time 483.5}
            {:length 0.5
             :pitch 67
             :time 483}
            {:length 0.07
             :pitch 77
             :time 482.5}
            {:length 0.07
             :pitch 77
             :time 482}
            {:length 0.07
             :pitch 77
             :time 481.5}
            {:length 0.5
             :pitch 67
             :time 481}
            {:length 0.07
             :pitch 77
             :time 480.5}
            {:length 0.07
             :pitch 77
             :time 480}
            {:length 0.07
             :pitch 77
             :time 495.5}
            {:length 0.5
             :pitch 67
             :time 495}
            {:length 0.07
             :pitch 77
             :time 494.5}
            {:length 0.07
             :pitch 77
             :time 494}
            {:length 0.07
             :pitch 77
             :time 493.5}
            {:length 0.5
             :pitch 67
             :time 493}
            {:length 0.07
             :pitch 77
             :time 492.5}
            {:length 0.07
             :pitch 77
             :time 492}
            {:length 0.07
             :pitch 77
             :time 491.5}
            {:length 0.5
             :pitch 67
             :time 491}
            {:length 0.07
             :pitch 77
             :time 490.5}
            {:length 0.07
             :pitch 77
             :time 490}
            {:length 0.07
             :pitch 77
             :time 489.5}
            {:length 0.5
             :pitch 67
             :time 489}
            {:length 0.07
             :pitch 77
             :time 488.5}
            {:length 0.07
             :pitch 77
             :time 488}
            {:length 0.07
             :pitch 77
             :time 503.5}
            {:length 0.5
             :pitch 67
             :time 503}
            {:length 0.07
             :pitch 77
             :time 502.5}
            {:length 0.07
             :pitch 77
             :time 502}
            {:length 0.07
             :pitch 77
             :time 501.5}
            {:length 0.5
             :pitch 67
             :time 501}
            {:length 0.07
             :pitch 77
             :time 500.5}
            {:length 0.07
             :pitch 77
             :time 500}
            {:length 0.07
             :pitch 77
             :time 499.5}
            {:length 0.5
             :pitch 67
             :time 499}
            {:length 0.07
             :pitch 77
             :time 498.5}
            {:length 0.07
             :pitch 77
             :time 498}
            {:length 0.07
             :pitch 77
             :time 497.5}
            {:length 0.5
             :pitch 67
             :time 497}
            {:length 0.07
             :pitch 77
             :time 496.5}
            {:length 0.07
             :pitch 77
             :time 496}
            {:length 0.07
             :pitch 77
             :time 511.5}
            {:length 0.5
             :pitch 67
             :time 511}
            {:length 0.07
             :pitch 77
             :time 510.5}
            {:length 0.07
             :pitch 77
             :time 510}
            {:length 0.07
             :pitch 77
             :time 509.5}
            {:length 0.5
             :pitch 67
             :time 509}
            {:length 0.07
             :pitch 77
             :time 508.5}
            {:length 0.07
             :pitch 77
             :time 508}
            {:length 0.07
             :pitch 77
             :time 507.5}
            {:length 0.5
             :pitch 67
             :time 507}
            {:length 0.07
             :pitch 77
             :time 506.5}
            {:length 0.07
             :pitch 77
             :time 506}
            {:length 0.07
             :pitch 77
             :time 505.5}
            {:length 0.5
             :pitch 67
             :time 505}
            {:length 0.07
             :pitch 77
             :time 504.5}
            {:length 0.07
             :pitch 77
             :time 504}
            {:length 0.07
             :pitch 77
             :time 519.5}
            {:length 0.5
             :pitch 67
             :time 519}
            {:length 0.07
             :pitch 77
             :time 518.5}
            {:length 0.07
             :pitch 77
             :time 518}
            {:length 0.07
             :pitch 77
             :time 517.5}
            {:length 0.5
             :pitch 67
             :time 517}
            {:length 0.07
             :pitch 77
             :time 516.5}
            {:length 0.07
             :pitch 77
             :time 516}
            {:length 0.07
             :pitch 77
             :time 515.5}
            {:length 0.5
             :pitch 67
             :time 515}
            {:length 0.07
             :pitch 77
             :time 514.5}
            {:length 0.07
             :pitch 77
             :time 514}
            {:length 0.07
             :pitch 77
             :time 513.5}
            {:length 0.5
             :pitch 67
             :time 513}
            {:length 0.07
             :pitch 77
             :time 512.5}
            {:length 0.07
             :pitch 77
             :time 512}
            {:length 0.07
             :pitch 77
             :time 527.5}
            {:length 0.5
             :pitch 67
             :time 527}
            {:length 0.07
             :pitch 77
             :time 526.5}
            {:length 0.07
             :pitch 77
             :time 526}
            {:length 0.07
             :pitch 77
             :time 525.5}
            {:length 0.5
             :pitch 67
             :time 525}
            {:length 0.07
             :pitch 77
             :time 524.5}
            {:length 0.07
             :pitch 77
             :time 524}
            {:length 0.07
             :pitch 77
             :time 523.5}
            {:length 0.5
             :pitch 67
             :time 523}
            {:length 0.07
             :pitch 77
             :time 522.5}
            {:length 0.07
             :pitch 77
             :time 522}
            {:length 0.07
             :pitch 77
             :time 521.5}
            {:length 0.5
             :pitch 67
             :time 521}
            {:length 0.07
             :pitch 77
             :time 520.5}
            {:length 0.07
             :pitch 77
             :time 520}
            {:length 0.07
             :pitch 77
             :time 535.5}
            {:length 0.5
             :pitch 67
             :time 535}
            {:length 0.07
             :pitch 77
             :time 534.5}
            {:length 0.07
             :pitch 77
             :time 534}
            {:length 0.07
             :pitch 77
             :time 533.5}
            {:length 0.5
             :pitch 67
             :time 533}
            {:length 0.07
             :pitch 77
             :time 532.5}
            {:length 0.07
             :pitch 77
             :time 532}
            {:length 0.07
             :pitch 77
             :time 531.5}
            {:length 0.5
             :pitch 67
             :time 531}
            {:length 0.07
             :pitch 77
             :time 530.5}
            {:length 0.07
             :pitch 77
             :time 530}
            {:length 0.07
             :pitch 77
             :time 529.5}
            {:length 0.5
             :pitch 67
             :time 529}
            {:length 0.07
             :pitch 77
             :time 528.5}
            {:length 0.07
             :pitch 77
             :time 528}])

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