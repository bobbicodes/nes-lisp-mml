(ns pprint {:clj-kondo/ignore true})

(defn spaces- [indent]
     (if (> indent 0)
       (str " " (spaces- (dec indent)))
       ""))

(defn pp-seq- [obj indent]
  ;; set char length threshold for newlines
  (if (> (count (str obj)) 65)
    (apply str (pp- (first obj) 0)
           (map (fn [x] (str "\n" (spaces- (inc indent))
                             (pp- x (inc indent))))
                (rest obj)))
    (apply str (pp- (first obj) 0)
           (map (fn [x] (str " " (pp- x (inc indent))))
                (rest obj)))))

;; old pp-seq function
#_(defn pp-seq- [obj indent]
  (apply str (pp- (first obj) 0)
         (map (fn [x] (str "\n" (spaces- (inc indent))
                           (pp- x (inc indent))))
              (rest obj))))

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
  (do #_(console-print "[pp-]" obj)
      (cond
        (= "" obj) "\"\""
        (empty? obj) (str obj)
        (list? obj)   
        (do #_(console-print "[pp-]" "list" obj)
         (str "(" (pp-seq- obj indent) ")"))
        (vector? obj) 
        (do #_(console-print "[pp-]" "vector" obj)
         (str "[" (pp-seq- obj indent) "]"))
        (set? obj) (str "#{" (pp-seq- obj indent) "}")
        (map? obj)    (str "{" (pp-map- obj indent) "}")
        :else         (pr-str obj))))

(defn pprint [obj]
  (if (nil? obj) "nil"
      (do #_(console-print "[pprint]" obj)
          (cond 
            (= "" obj) "\"\""
            (empty? obj) (str obj)
            :else (pp- obj 0)))))