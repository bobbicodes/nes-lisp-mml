(ns pprint {:clj-kondo/ignore true})

(defn spaces- [indent]
     (if (> indent 0)
       (str " " (spaces- (- indent 1)))
       ""))

(defn pp-seq- [obj indent]
     (let* [xindent (+ 1 indent)]
           (apply str (pp- (first obj) 0)
                  (map (fn [x] (str "\n" (spaces- xindent)
                                     (pp- x xindent)))
                       (rest obj)))))

(defn pp-map- [obj indent]
     (let* [ks (keys obj)
            kindent (+ 1 indent)
            kwidth (count (seq (str (first ks))))
            vindent (+ 1 (+ kwidth kindent))]
           (apply str (pp- (first ks) 0)
                  " "
                  (pp- (get obj (first ks)) 0)
                  (map (fn [k] (str "\n" (spaces- kindent)
                                     (pp- k kindent)
                                     " "
                                     (pp- (get obj k) vindent)))
                       (rest (keys obj))))))

(defn pp- [obj indent]
     (cond
       (list? obj)   (str "(" (pp-seq- obj indent) ")")
       (vector? obj) (str "[" (pp-seq- obj indent) "]")
       (set? obj) (str "#{" (pp-seq- obj indent) "}")
       (map? obj)    (str "{" (pp-map- obj indent) "}")
       :else         (pr-str obj)))

(defn pprint [obj]
  (if (nil? obj) "nil"
      (do ;(console-print obj)
          (cond (empty? obj) (str obj)
                :else (pp- obj 0)))))