- Syntax:
- ```clojure
  (def data 
    [{:time 0 :length 0.5 :pitch 64}
     {:time 0.5 :length 0.5 :pitch 67}
     {:time 1 :length 0.5 :pitch 59}
     {:time 1.5 :length 0.5 :pitch 63}
     {:time 2 :length 0.5 :pitch 66}
     {:time 2.5 :length 0.5 :pitch 69}
     {:time 3 :length 0.5 :pitch 59}
     {:time 3.5 :length 0.5 :pitch 64}
     {:time 4 :length 0.5 :pitch 67}
     {:time 4.5 :length 0.5 :pitch 71}
     {:time 5 :length 0.25 :pitch 69}
     {:time 5.25 :length 0.25 :pitch 71}
     {:time 5.5 :length 0.5 :pitch 72}])
  
  (notes
    [[0 0.5 64] [0.5 0.5 67] [1 0.5 67]
     [1.5 0.5 63] [2 0.5 66] [2.5 0.5 69]
     [3 0.5 59] [3.5 0.5 64] [4 0.5 67]
     [4.5 0.5 71] [5 0.25 69] [5.25 0.25 71]
     [5 0.25 69] [5.25 0.25 71] [5.5 0.5 72]])
  ```