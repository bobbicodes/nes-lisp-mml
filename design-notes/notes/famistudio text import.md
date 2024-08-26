- ```lisp
  (def pat
    "Note Time=\"0\" Value=\"G#3\" Duration=\"12\" Instrument=\"crash\" Volume=\"15\"
     Note Time=\"12\" Value=\"F#3\" Duration=\"12\" Instrument=\"ride\"
     Note Time=\"24\" Value=\"D3\" Duration=\"12\" Instrument=\"noise snare\"
     Note Time=\"36\" Value=\"F#3\" Duration=\"6\" Instrument=\"Hi-Hat Noise\"
     Note Time=\"42\" Value=\"F#3\" Duration=\"6\" Instrument=\"Hi-Hat Noise\"
     Note Time=\"48\" Value=\"G#3\" Duration=\"12\" Instrument=\"crash\" Volume=\"15\"
     Note Time=\"60\" Value=\"F#3\" Duration=\"12\" Instrument=\"ride\"
     Note Time=\"72\" Value=\"D3\" Duration=\"12\" Instrument=\"noise snare\"
     Note Time=\"84\" Value=\"F#3\" Duration=\"12\" Instrument=\"ride\"")
  
  (def notes (str/split-lines pat))
  
  (defn note-time [note]
    (parseInt (second (str/split note "Note Time=\"")) 10))
  
  (defn pitch->midi [pitch]
    (let [letters ["C" "C#" "D" "D#" "E" "F" "F#" "G" "G#" "A" "A#" "B"]
          notes (mapcat (fn [n] (map (fn [note] (str note n)) letters)) (range 1 8))
          note-map (zipmap note-names (range 24 108))]
    (get note-map pitch)))
  
  (defn parse-val [s line]
    (first (str/split (second (str/split line s)) "\"")))
  
  (defn note-value [note]
    (pitch->midi (parse-val "Value=\"" note)))
  
  (defn note-length [note]
    (parseInt (parse-val "Duration=\"" note) 10))
  
  (defn note-instrument [note]
    (parse-val "Instrument=\"" note))
  
  (defn fs-notes [notes]
    (map (fn [note]
           {:time (note-time note)
            :pitch (note-value note)
            :length (note-length note)
            :instrument (note-instrument note)})
  ```
- This is great! Pretty much clear sailing to not having to reinput every note while porting the rest of my songs
- Now it produces proper note attribute maps, so now all I need is that function I made to convert my old mario paint format, where was that? I can't remember which song I was trying to port...
- Well, I think it was just a simple loop/recur... ah, it was in [[Star Trek Motion Picture]]:
- ```clojure
  (defn stmp-trans [part]
    (loop [notes (sort-by :time part)
           time 0
           res []]
      (if (empty? notes) res
        (recur 
          (rest notes)
          (:time (first notes))
          (conj res {:length (* 8 (+ 1 (- (:time (first notes)) time)))
                     :pitch (:pitch (first notes))})))))
  ```
- Wait, this can't be right... we need it to add rests in between the notes too
- Also, I neglected the volume field...