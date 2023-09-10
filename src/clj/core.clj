(ns core {:clj-kondo/ignore true})

(defmacro when [x & xs] (list 'if x (cons 'do xs)))

(defmacro cond [& xs]
  (when (> (count xs) 0)
    (list 'if (first xs)
          (if (> (count xs) 1)
            (nth xs 1)
            (throw "odd number of forms to cond"))
          (cons 'cond (rest (rest xs))))))

(def spread (fn* [arglist]
                 (cond
                   (nil? arglist) nil
                   (nil? (next arglist)) (seq (first arglist))
                   :else (cons (first arglist) (spread (next arglist))))))

(def list* (fn*
            ([args] (seq args))
            ([a args] (cons a args))
            ([a b args] (cons a (cons b args)))
            ([a b c args] (cons a (cons b (cons c args))))
            ([a b c d & more]
             (cons a (cons b (cons c (cons d (spread more))))))))

(def apply 
  (fn*
   ([f args]
    (if (keyword? f)
      (get args f)
      (apply* f args)))
   ([f x args]
    (apply f (list* x args)))
   ([f x y args]
    (apply f (list* x y args)))
   ([f x y z args]
    (apply f (list* x y z args)))
   ([f a b c d & args]
    (apply f (cons a (cons b (cons c (cons d (spread args)))))))))

(defmacro map+ [f colls]
  (let [n (range (count colls))
        loop-keys (conj (mapv #(symbol (str "s" %)) n) 'res)
        loop-vals (conj (mapv #(list 'seq (list 'nth colls %)) n) [])
        ors (cons 'or (map #(list 'empty? (symbol (str "s" %))) n))
        recur1 (cons 'recur (map #(list 'rest (symbol (str "s" %))) n))
        recur2 (list 'conj 'res (cons 'f (map #(list 'first (symbol (str "s" %))) n)))]
    `(loop ~(vec (interleave loop-keys loop-vals))
       (if ~ors (apply list res)
           ~(concat recur1 (list recur2))))))

(def map
  (fn* 
   ([f coll]
    (loop* [s (seq coll) res []]
      (if (empty? s) (apply list res)
          (recur (rest s)
                 (conj res (if (keyword? f) (get (first s) f) (f (first s))))))))
   ([f c1 c2]
    (loop* [s1 (seq c1) s2 (seq c2) res []]
      (if (or (empty? s1) (empty? s2)) (apply list res)
          (recur (rest s1) (rest s2)
                 (conj res (f (first s1) (first s2)))))))
   ([f c1 c2 c3]
    (loop* [s1 (seq c1) s2 (seq c2) s3 (seq c3) res []]
      (if (or (empty? s1) (empty? s2) (empty? s3)) (apply list res)
          (recur (rest s1) (rest s2) (rest s3)
                 (conj res (f (first s1) (first s2) (first s3)))))))
   ([f c0 c1 c2 & colls]
    (map+ f (list* c0 c1 c2 colls)))))

(def seq? (fn* [x] (list? x)))

;; first define let, loop, fn without destructuring

(defmacro let [bindings & body]
  `(let* ~bindings ~@body))

(defmacro loop [& decl]
   (cons 'loop* decl))

(defmacro fn [& sigs]
  (let [name (if (symbol? (first sigs)) (first sigs) nil)
        sigs (if name (next sigs) sigs)
        sigs (if (vector? (first sigs))
               (list sigs)
               (if (seq? (first sigs))
                 sigs
                 (throw (if (seq sigs)
                          (str "Parameter declaration "
                               (first sigs)
                               " should be a vector")
                          (str "Parameter declaration missing")))))
        psig (fn* [sig]
                  sig)
        new-sigs (map psig sigs)]
    (if name
      (list* 'fn* name new-sigs)
      (cons 'fn* new-sigs))))

(defmacro defn [name & fdecl]
  (if (string? (first fdecl))
    (if (list? (second fdecl))
      `(def ~name (with-meta (fn ~@(rest fdecl))
                    ~{:name (str name) :doc (first fdecl)}))
      `(def ~name (with-meta (fn ~(second fdecl) (do ~@(nnext fdecl)))
                    ~{:name (str name) :doc (first fdecl)})))
    (if (list? (first fdecl))
      `(def ~name (with-meta (fn ~@fdecl)
                    ~{:name (str name)}))
      `(def ~name (with-meta (fn ~(first fdecl) (do ~@(rest fdecl)))
                    ~{:name (str name)})))))

(defmacro defn- [name & fdecl]
  (if (string? (first fdecl))
    (if (list? (second fdecl))
      `(def ~name (with-meta (fn ~@(rest fdecl))
                    ~{:name (str name) :doc (first fdecl)}))
      `(def ~name (with-meta (fn ~(second fdecl) (do ~@(nnext fdecl)))
                    ~{:name (str name) :doc (first fdecl)})))
    (if (list? (first fdecl))
      `(def ~name (with-meta (fn ~@fdecl)
                    ~{:name (str name)}))
      `(def ~name (with-meta (fn ~(first fdecl) (do ~@(rest fdecl)))
                    ~{:name (str name)})))))

(defmacro lazy-seq [& body]
  `(new LazySeq (fn* [] ~@body)))

(defn not [a] (if a false true))
(defn not= [a b] (not (= a b)))
(defn dec [a] (- a 1))
(defn zero? [n] (= 0 n))
(defn identity [x] x)

(defn next [s]
  (if (or (= 1 (count s)) (= 0 (count s)))
    nil
    (rest s)))

(defn nnext [s]
  (next (next s)))

(defn reduce
  ([f xs] (reduce f (first xs) (rest xs)))
  ([f init xs]
   (if (empty? xs)
     init
     (reduce f (f init (first xs)) (rest xs)))))

(defn reductions [f init xs]
  (loop* [s xs acc init res [init]]
    (if (empty? s)
      res
      (recur (rest s)
             (f acc (first s))
             (conj res (f acc (first s)))))))

(defn reverse [coll]
  (reduce conj '() coll))

(defmacro if-not [test then else]
  (if else
    `(if (not ~test) ~then ~else)
    `(if-not ~test ~then nil)))

(defn sorted-map [& keyvals]
  (into
   (with-meta {} {:sorted-map true})
   (sort (partition 2 keyvals))))

(defn sorted-set [& keys]
  (into
   (with-meta #{} {:sorted-set true})
   (sort keys)))

(defn merge-with [f & maps]
  (when (some identity maps)
    (let [merge-entry (fn* [m e]
                        (let [k (key e) v (val e)]
                          (if (contains? m k)
                            (assoc m k (f (get m k) v))
                            (assoc m k v))))
          merge2 (fn* [m1 m2]
                   (reduce merge-entry (or m1 {}) (seq m2)))]
      (reduce merge2 maps))))

(defn str/escape [s cmap]
  (loop* [index  0
         buffer ""]
    (if (= (count s) index) buffer
        (recur (inc index) 
               (str buffer (get cmap (nth s index) (nth s index)))))))

(defn juxt
  ([f]
   (fn*
     ([] [(f)])
     ([x] [(f x)])
     ([x y] [(f x y)])
     ([x y z] [(f x y z)])
     ([x y z & args] [(apply f x y z args)])))
  ([f g]
   (fn*
     ([] [(f) (g)])
     ([x] [(f x) (g x)])
     ([x y] [(f x y) (g x y)])
     ([x y z] [(f x y z) (g x y z)])
     ([x y z & args] [(apply f x y z args) (apply g x y z args)])))
  ([f g h]
   (fn*
     ([] [(f) (g) (h)])
     ([x] [(f x) (g x) (h x)])
     ([x y] [(f x y) (g x y) (h x y)])
     ([x y z] [(f x y z) (g x y z) (h x y z)])
     ([x y z & args] [(apply f x y z args) (apply g x y z args) (apply h x y z args)])))
  ([f g h & fs]
   (let [fs (list* f g h fs)]
     (fn*
       ([] (reduce #(conj %1 (%2)) [] fs))
       ([x] (reduce #(conj %1 (%2 x)) [] fs))
       ([x y] (reduce #(conj %1 (%2 x y)) [] fs))
       ([x y z] (reduce #(conj %1 (%2 x y z)) [] fs))
       ([x y z & args] (reduce #(conj %1 (apply %2 x y z args)) [] fs))))))

(defn comp
  ([] identity)
  ([f] f)
  ([f g]
   (fn*
     ([] (f (g)))
     ([x] (f (g x)))
     ([x y] (f (g x y)))
     ([x y z] (f (g x y z)))
     ([x y z & args] (f (apply g x y z args)))))
  ([f g & fs]
   (reduce comp (list* f g fs))))

(defn .toUpperCase [s]
  (. (str "'" s "'" ".toUpperCase")))

(defn .toLowerCase [s]
  (. (str "'" s "'" ".toLowerCase")))

(defn _iter-> [acc form]
  (if (list? form)
    `(~(first form) ~acc ~@(rest form))
    (list form acc)))

(defmacro -> [x & xs] (reduce _iter-> x xs))

(defn _iter->> [acc form]
  (if (list? form)
    `(~(first form) ~@(rest form) ~acc) (list form acc)))

(defmacro ->> [x & xs] (reduce _iter->> x xs))

(def gensym-counter
  (atom 0))

(def gensym (fn* [prefix]
                 (symbol (str (if prefix prefix "G__")
                              (swap! gensym-counter inc)))))

(defn memoize [f]
  (let* [mem (atom {})]
        (fn* [& args]
          (let* [key (str args)]
                (if (contains? @mem key)
                  (get @mem key)
                  (let* [ret (apply f args)]
                        (do (swap! mem assoc key ret)
                            ret)))))))

(defn partial [pfn & args]
  (fn* [& args-inner]
    (apply pfn (concat args args-inner))))

(defn every? [pred xs]
  (cond (empty? xs)       true
        (pred (first xs)) (every? pred (rest xs))
        true              false))

(defn postwalk [f form]
  (walk (partial postwalk f) f form))

(defn prewalk [f form]
  (walk (partial prewalk f) identity (f form)))

(defn postwalk-replace [smap form]
  (postwalk (fn* [x] (if (contains? smap x) (smap x) x)) form))

(defn apply-template [argv expr values]
  (postwalk-replace (zipmap argv values) expr))

(defmacro do-template [argv expr & values]
  (let [c (count argv)]
    `(do ~@(map (fn* [a] (apply-template argv expr a))
                (partition c values)))))

(defmacro are [argv expr & args]
  (if (or
       ;; (are [] true) is meaningless but ok
       (and (empty? argv) (empty? args))
       ;; Catch wrong number of args
       (and (pos? (count argv))
            (pos? (count args))
            (zero? (mod (count args) (count argv)))))
    `(do-template ~argv (is ~expr) ~@args)
    (throw "The number of args doesn't match are's argv.")))

(defn not-every? [pred xs]
  (not (every? pred xs)))

(defmacro if-not [test then else]
  `(if (not ~test) ~then ~else))

(defmacro when-not [test & body]
  (list 'if test nil (cons 'do body)))

(defn fnext [x] (first (next x)))

(defmacro or [& xs]
  (if (empty? xs) nil
      (if (= 1 (count xs))
        (first xs)
        (let* [condvar (gensym)]
              `(let* [~condvar ~(first xs)]
                     (if ~condvar ~condvar (or ~@(rest xs))))))))

(defmacro and [& xs]
  (cond (empty? xs)      true
        (= 1 (count xs)) (first xs)
        true
        (let* [condvar (gensym)]
              `(let* [~condvar ~(first xs)]
                     (if ~condvar (and ~@(rest xs)) ~condvar)))))

(defn ffirst [x] (first (first x)))

(defn second [l] (nth l 1))

(defn some [pred xs]
  (if (set? pred)
    (if (empty? xs) nil
      (or (when (contains? pred (first xs))
            (first xs))
          (some pred (rest xs))))
    (if (map? pred)
      (if (empty? xs) nil
          (or (when (contains? pred (first xs))
                (get pred (first xs)))
              (some pred (rest xs))))
      (if (empty? xs) nil
        (or (pred (first xs))
            (some pred (rest xs)))))))

(defn not-any? [pred coll]
  (not (some pred coll)))

(defn quot [n d]
  (int (double (/ n d))))

(defn pos? [n]
  (> n 0))

(defn neg? [n]
  (> 0 n))

(defn even? [n]
  (zero? (mod n 2)))

(defn odd? [n]
  (not (zero? (mod n 2))))

(defn complement [f]
  (fn*
    ([] (not (f)))
    ([x] (not (f x)))
    ([x y] (not (f x y)))
    ([x y & zs] (not (apply f x y zs)))))

(defn mapcat [f & colls]
  (apply concat (apply map f colls)))

(defn remove [pred coll]
  (filter (complement pred) coll))

(defn tree-seq [branch? children node]
  (remove nil?
          (cons node
                (when (branch? node)
                  (mapcat (fn* [x] (tree-seq branch? children x))
                          (children node))))))

(defn flatten [x]
  (filter (complement sequential?)
          (rest (tree-seq sequential? seq x))))

(defn mod [num div]
  (let* [m (rem num div)]
        (if (or (zero? m) (= (pos? num) (pos? div)))
          m
          (+ m div))))

(defn take-while [pred coll]
  (loop* [s (seq coll) res []]
    (if (empty? s) res
        (if (pred (first s))
          (recur (rest s) (conj res (first s)))
          res))))

(defn drop-while [pred coll]
  (loop* [s   (seq coll)]
    (if (empty? s) s
        (if (and s (pred (first s)))
          (recur (rest s))
          s))))

(defn partition 
  ([n coll]
   (partition n n coll))
  ([n step coll]
     (loop* [s coll p []]
       (if (= 0 (count s))
         (filter #(= n (count %)) p)
         (recur (drop step s) (conj p (take n s))))))
  ([n step pad coll]
     (loop* [s coll p []]
           (if (= n (count (take n s)))
             (recur (drop step s) (conj p (take n s)))
             (conj p (concat (take n s) pad))))))

(defn boolean [x]
  (if x true false))

(defn split-at [n coll]
  [(take n coll) (drop n coll)])

(defn split-with [pred coll]
  [(take-while pred coll) (drop-while pred coll)])

(defn str/split-lines [s]
  (str/split s #"\r?\n"))

(defn partition-all
  ([n coll]
   (partition-all n n coll))
  ([n step coll]
     (loop* [s coll p []]
            (if (= 0 (count s)) p
                (recur (drop step s)
                       (conj p (take n s)))))))

(defn partition-by [f coll]
  (loop* [s (seq coll) res []]
    (if (= 0 (count s)) res
        (recur (drop (count (take-while (fn* [x] (= (f (first s)) (f x))) s)) s)
               (conj res (take-while (fn* [x] (= (f (first s)) (f x))) s))))))

(defn coll? [x]
  (or (list? x) (vector? x) (set? x) (map? x)))

(defn group-by [f coll]
  (reduce
   (fn* [ret x]
     (let* [k (f x)]
           (assoc ret k (conj (get ret k []) x))))
   {} coll))

(defn fromCharCode [int]
  (js-eval (str "String.fromCharCode(" int ")")))

(defn Character/isAlphabetic [int]
  (not= (upper-case (fromCharCode int))
        (lower-case (fromCharCode int))))

(defn Character/digit [s r]
  (Integer/parseInt (first s) r))

(defn Character/isLetter [s]
  (not= (upper-case s)
        (lower-case s)))

(defn Character/isUpperCase [x]
  (if (int? x)
    (and (Character/isLetter (fromCharCode x))
         (= (fromCharCode x)
            (upper-case (fromCharCode x))))
    (and (Character/isLetter x)
         (= x (upper-case x)))))

(defn Character/isLowerCase [x]
  (if (int? x)
    (and (Character/isLetter (fromCharCode x))
         (= (fromCharCode x)
            (lower-case (fromCharCode x))))
    (and (Character/isLetter x)
         (= x (lower-case x)))))

(defn zipmap [keys vals]
  (loop* [map {}
         ks (seq keys)
         vs (seq vals)]
    (if-not (and ks vs) map
            (recur (assoc map (first ks) (first vs))
                   (next ks)
                   (next vs)))))

(defn empty [coll]
  (cond
    (list? coll) '()
    (vector? coll) []
    (set? coll) #{}
    (map? coll) {}
    (string? coll) ""))

(defn mapv
  ([f coll]
   (-> (reduce (fn [v o] (conj v (f o))) [] coll)))
  ([f c1 c2]
   (into [] (map f c1 c2)))
  ([f c1 c2 c3]
   (into [] (map f c1 c2 c3)))
  ([f c1 c2 c3 & colls]
   (into [] (apply map f c1 c2 c3 colls))))

(defn drop-last [n coll]
  (if-not coll
    (drop-last 1 n)
    (map (fn* [x _] x) coll (drop n coll))))

(defn interleave [c1 c2]
  (loop* [s1  (seq c1)
         s2  (seq c2)
         res []]
    (if (or (empty? s1) (empty? s2))
      res
      (recur (rest s1)
             (rest s2)
             (conj res (first s1) (first s2))))))

(defn interpose [sep coll]
  (drop 1 (interleave (repeat (count coll) sep) coll)))

(defn into [to from]
  (reduce conj to from))

(defmacro if-let [bindings then else & oldform]
  (if-not else
    `(if-let ~bindings ~then nil)
    (let* [form (get bindings 0) tst (get bindings 1)
           temp# (gensym)]
          `(let [temp# ~tst]
                 (if temp#
                   (let [~form temp#]
                         ~then)
                   ~else)))))

(defn frequencies [coll]
  (reduce (fn* [counts x]
            (assoc counts x (inc (get counts x 0))))
          {} coll))

(defn constantly [x] (fn* [& args] x))

(defn str/capitalize [s]
  (let* [s (str s)]
        (if (< (count s) 2)
          (upper-case s)
          (str (upper-case (subs s 0 1))
               (lower-case (subs s 1))))))

(defn keep [s]
  (remove nil? s))

(defn not-empty [coll] (when (seq coll) coll))

(defn reduce-kv [f init coll]
  (reduce (fn* [ret kv] (f ret (first kv) (last kv))) init coll))

(defn merge [& maps]
  (loop* [maps (mapcat seq maps) res {}]
    (if-not (some identity maps) res
            (recur (rest maps) (conj res (first maps))))))

(defmacro when-let [bindings & body]
  (let* [form (get bindings 0) tst (get bindings 1)
         temp# (gensym)]
        `(let* [temp# ~tst]
               (when temp#
                 (let* [~form temp#]
                       ~@body)))))

(defmacro when-first [bindings & body]
  (let* [x   (first bindings)
         xs  (last bindings)
         xs# (gensym)]
        `(when-let [xs# (seq ~xs)]
           (let* [~x (first xs#)]
                 ~@body))))
  
(defmacro as-> [expr name & forms]
  `(let* [~name ~expr
          ~@(interleave (repeat (count forms) name) (butlast forms))]
         ~(if (empty? forms)
            name
            (last forms))))

(defmacro some-> [expr & forms]
  (let [g (gensym)
        steps (map (fn [step] `(if (nil? ~g) nil (-> ~g ~step)))
                   forms)]
    `(let [~g ~expr
           ~@(interleave (repeat (count forms) g) (butlast steps))]
       ~(if (empty? steps)
          g
          (last steps)))))

(defmacro some->> [expr & forms]
  (let [g (gensym)
        steps (map (fn [step] `(if (nil? ~g) nil (->> ~g ~step)))
                   forms)]
    `(let [~g ~expr
           ~@(interleave (repeat (count forms) g) (butlast steps))]
       ~(if (empty? steps)
          g
          (last steps)))))

(defn distinct? [x y & more]
  (if-not more
    (if-not y
      true
      (not (= x y)))
    (if (not= x y)
      (loop* [s (set [x y]) xs more]
        (if xs
          (if (contains? s (first xs))
            false
            (recur (conj s (first xs)) (next xs)))
          true))
      false)))

(defn distinct [coll]
  (into (empty coll) (set coll)))

(defn parseInt [s r]
  (Integer/parseInt s r))

(defn Math/floor [x]
  (js-eval (str "Math.floor(" x ")")))

(defn Math/ceil [x]
  (js-eval (str "Math.ceil(" x ")")))

(defn get-in [m ks]
  (reduce #(get % %2) m ks))

(defn some? [x] (not (nil? x)))

(defn update
  ([m k f]
   (assoc m k (f (get m k))))
  ([m k f x]
   (assoc m k (f (get m k) x)))
  ([m k f x y]
   (assoc m k (f (get m k) x y)))
  ([m k f x y z]
   (assoc m k (f (get m k) x y z)))
  ([m k f x y z & more]
   (assoc m k (apply f (get m k) x y z more))))

(defn emit-for [bindings body-expr]
  (let [giter (gensym "iter__")
        gxs (gensym "s__")
        iterys# (gensym "iterys__")
        fs#     (gensym "fs__")
        ;; TODO: create named lambdas so won't need to do this
        do-mod (defn do-mod [mod]
                 (cond
                   (= (ffirst mod) :let) `(let ~(second (first mod)) 
                                            ~(do-mod (next mod)))
                   (= (ffirst mod) :while) `(when ~(second (first mod)) 
                                              ~(do-mod (next mod)))
                   (= (ffirst mod) :when) `(if ~(second (first mod))
                                             ~(do-mod (next mod))
                                             (recur (rest ~gxs)))
                   (keyword?  (ffirst mod)) (throw (str "Invalid 'for' keyword " (ffirst mod)))
                   (next bindings)
                   `(let [~iterys# ~(emit-for (next bindings) body-expr)
                          ~fs# (seq (~iterys# ~(second (first (next bindings)))))]
                      (if ~fs#
                        (concat ~fs# (~giter (rest ~gxs)))
                        (recur (rest ~gxs))))
                   :else `(cons ~body-expr (~giter (rest ~gxs)))))]
    (if (next bindings)
      `(defn ~giter [~gxs]
         (loop [~gxs ~gxs]
           (when-first [~(ffirst bindings) ~gxs]
             ~(do-mod (subvec (first bindings) 2)))))
      `(defn ~giter [~gxs]
         (loop [~gxs ~gxs]
           (when-let [~gxs (seq ~gxs)]
             (let [~(ffirst bindings) (first ~gxs)]
               ~(do-mod (subvec (first bindings) 2)))))))))

(defmacro for [seq-exprs body-expr]
  (let [body-expr* body-expr
        iter#      (gensym)
        to-groups  (fn* [seq-exprs]
                        (reduce (fn* [groups kv]
                                     (if (keyword? (first kv))
                                       (conj (pop groups) 
                                             (conj (peek groups) [(first kv) (last kv)]))
                                       (conj groups [(first kv) (last kv)])))
                                [] (partition 2 seq-exprs)))]
    `(let [~iter# ~(emit-for (to-groups seq-exprs) body-expr)]
       (remove nil?
               (~iter# ~(second seq-exprs))))))

(defn key [e]
  (first e))

(defn val [e]
  (last e))

(defn butlast [s]
  (loop* [ret []
         s   s]
    (if (next s)
      (recur (conj ret (first s)) (next s))
      (seq ret))))

(defn assoc-in [m ks v]
  (if (next ks)
    (assoc m (first ks) (assoc-in (get m (first ks)) (rest ks) v))
    (assoc m (first ks) v)))

(defn str/includes? [s substr]
  (js-eval (str "'" s "'" ".includes(" "'" substr "'" ")")))

(defn take-nth [n coll]
  (loop* [s coll res []]
    (if (empty? s) res
        (recur (drop n s) (conj res (first s))))))

(defn namespace [x]
  (when (str/includes? x "/")
    (first (str/split (str x) "/"))))

(defn name [x]
  (if (keyword? x)
    (subs (str x) 1)
    (str x)))

(defn comment [& forms] nil)

(defn pvec [bvec b val]
  (let [gvec (gensym "vec__")
        gseq (gensym "seq__")
        gfirst (gensym "first__")
        has-rest (some #{'&} b)]
        (loop* [ret (let [ret (conj bvec gvec val)]
                         (if has-rest
                           (conj ret gseq (list seq gvec))
                           ret))
               n 0
               bs b
               seen-rest? false]
          (if (seq bs)
            (let [firstb (first bs)]
                  (cond
                    (= firstb '&) (recur (pb ret (second bs) gseq)
                                         n
                                         (nnext bs)
                                         true)
                    (= firstb :as) (pb ret (second bs) gvec)
                    :else (if seen-rest?
                            (throw "Unsupported binding form, only :as can follow & parameter")
                            (recur (pb (if has-rest
                                         (conj ret
                                               gfirst `(~first ~gseq)
                                               gseq `(~next ~gseq))
                                         ret)
                                       firstb
                                       (if has-rest
                                         gfirst
                                         (list 'nth gvec n nil)))
                                   (inc n)
                                   (next bs)
                                   seen-rest?))))
            ret))))

(defn pmap [bvec b v]
  (let* [gmap (gensym "map__")
         defaults (:or b)]
        (loop* [ret (-> bvec (conj gmap) (conj v)
                       (conj gmap) (conj gmap)
                       ((fn* [ret]
                          (if (:as b)
                            (conj ret (:as b) gmap)
                            ret))))
               bes (let* [transforms
                          (reduce
                           (fn* [transforms mk]
                             (if (keyword? mk)
                               (let* [mkns (namespace mk)
                                      mkn (name mk)]
                                     (cond (= mkn "keys") (assoc transforms mk (fn* [k] (keyword (or mkns (namespace k)) (name k))))
                                           (= mkn "syms") (assoc transforms mk (fn* [k] (list `quote (symbol (or mkns (namespace k)) (name k)))))
                                           (= mkn "strs") (assoc transforms mk str)
                                           :else transforms))
                               transforms))
                           {}
                           (keys b))]
                         (reduce
                          (fn* [bes entry] (reduce (fn* [a b] (assoc a b ((val entry) b))) (dissoc bes (key entry)) (get bes (key entry))))
                          (dissoc b :as :or)
                          transforms))]
          bes
          (if (seq bes)
            (let* [bb (key (first bes))
                   bk (val (first bes))
                   local bb
                   bv (if (contains? defaults local)
                        (list `get gmap bk (get defaults local))
                        (list `get gmap bk))]
                  (recur
                   (if (or (keyword? bb) (symbol? bb))
                     (-> ret (conj local bv))
                     (pb ret bb bv))
                   (next bes)))
            ret))))

(defn pb [bvec b v]
  (cond
    (symbol? b) (-> bvec (conj (if (namespace b)
                                 (symbol (name b)) b)) (conj v))
    (keyword? b) (-> bvec (conj (symbol (name b))) (conj v))
    (vector? b) (pvec bvec b v)
    (map? b) (pmap bvec b v)
    :else (throw (str "Unsupported binding form: " b))))

(defn destructure [bindings]
  (let* [bents (partition 2 bindings)
         process-entry (fn* [bvec b] (pb bvec (first b) (second b)))]
        (if (every? symbol? (map first bents))
          bindings
          (if-let [kwbs (seq (filter #(keyword? (first %)) bents))]
            (throw (str "Unsupported binding key: " (ffirst kwbs)))
            (reduce process-entry [] bents)))))

(defmacro let [bindings & body]
  `(let* ~(destructure bindings) ~@body))

(defmacro loop [bindings & body]
  (let [db (destructure bindings)]
    (if (= db bindings)
      `(loop* ~bindings ~@body)
      (let [vs (take-nth 2 (drop 1 bindings))
            bs (take-nth 2 bindings)
            gs (map (fn [b] (if (symbol? b) b (gensym))) bs)
            bfs (reduce (fn [ret [b v g]]
                           (if (symbol? b)
                             (conj ret g v)
                             (conj ret g v b g)))
                         [] (map vector bs vs gs))]
        `(let ~bfs
           (loop* ~(vec (interleave gs gs))
                  (let ~(vec (interleave bs gs))
                    ~@body)))))))

(defn maybe-destructured [params body]
  (if (every? symbol? params)
    (cons params body)
    (loop* [params params
           new-params (with-meta [] (meta params))
           lets []]
      (if params
        (if (symbol? (first params))
          (recur (next params) (conj new-params (first params)) lets)
          (let [gparam (gensym "p__")]
            (recur (next params) (conj new-params gparam)
                   (-> lets (conj (first params)) (conj gparam)))))
        `(~new-params
          (let ~lets
            ~@body))))))

;redefine fn with destructuring
(defmacro fn [& sigs]
  (let [name (if (symbol? (first sigs)) (first sigs) nil)
        sigs (if name (next sigs) sigs)
        sigs (if (vector? (first sigs))
               (list sigs)
               (if (seq? (first sigs))
                 sigs
                 (throw (if (seq sigs)
                          (str "Parameter declaration "
                               (first sigs)
                               " should be a vector")
                          (str "Parameter declaration missing")))))
        psig (fn* [sig]
                  (let [[params & body] sig]
                    (maybe-destructured params body)))
        new-sigs (map psig sigs)]
    (if name
      (list* 'fn* name new-sigs)
      (cons 'fn* new-sigs))))

(defmacro cond-> [expr & clauses]
  (let [g (gensym)
        steps (map (fn [[test step]] `(if ~test (-> ~g ~step) ~g))
                   (partition 2 clauses))]
    `(let [~g ~expr
           ~@(interleave (repeat (count clauses) g) (butlast steps))]
       ~(if (empty? steps)
          g
          (last steps)))))

(defmacro cond->> [expr & clauses]
  (let [g (gensym)
        steps (map (fn [[test step]] `(if ~test (->> ~g ~step) ~g))
                   (partition 2 clauses))]
    `(let [~g ~expr
           ~@(interleave (repeat (count clauses) g) (butlast steps))]
       ~(if (empty? steps)
          g
          (last steps)))))

(defn update-in* [m ks f args]
  (let [[k & ks] ks]
    (if ks
      (assoc m k (update-in* (get m k) ks f args))
      (assoc m k (apply f (get m k) args)))))

(defn update-in
  ([m ks f & args]
     (update-in* m ks f args)))

(defmacro condp [pred expr & clauses]
  (let [gpred (gensym "pred__")
        gexpr (gensym "expr__")
        emit-condp (defn emit-condp [pred expr args]
               (let [[[a b c :as clause] more]
                     (split-at (if (= :>> (second args)) 3 2) args)
                     n (count clause)]
                 (cond
                   (= 0 n) `(throw (str "No matching clause: " ~expr))
                   (= 1 n) a
                   (= 2 n) `(if (~pred ~a ~expr)
                              ~b
                              ~(emit-condp pred expr more))
                   :else `(if-let [p# (~pred ~a ~expr)]
                            (~c p#)
                            ~(emit-condp pred expr more)))))]
    `(let [~gpred ~pred
           ~gexpr ~expr]
       ~(emit-condp gpred gexpr clauses))))

(defn Math/log [n]
  (js-eval (str "Math.log(" n ")")))

(def Integer/MIN_VALUE
  (js-eval "Number.MIN_VALUE"))

(def Integer/MAX_VALUE
  (js-eval "Number.MAX_VALUE"))

(defn bit-shift-left [x n]
  (js-eval (str x " << " n)))

(defn bit-shift-right [x n]
  (js-eval (str x " >> " n)))

(defn bit-test [x n]
  (js-eval (str "((" x " >> " n ") % 2 != 0)")))

(defn bit-set [x n]
  (js-eval (str x " | 1 << " n)))

(defn bit-clear [x n]
  (js-eval (str x " & ~(1 << " n ")")))

(defn bit-flip [x n]
  (if (bit-test x n)
    (bit-clear x n)
    (bit-set x n)))

(defn bit-and [x y]
  (js-eval (str x " & " y)))

(defn str/starts-with? [s substr]
  (js-eval (str "'" s "'" ".startsWith ('" substr "')")))

(def max-mask-bits 13)

(def max-switch-table-size (bit-shift-left 1 max-mask-bits))

(defn fits-table? [ints]
  (< (- (apply max (seq ints)) (apply min (seq ints))) max-switch-table-size))

;; I'm flabbergasted at how much more involved `case` is compared to `cond` and `condp`.
;; And this isn't even close to all of it - because here it ends with a call to `case*`,
;; the very last part of the Clojure compiler. I don't understand why we need bitwise
;; operations for a control flow structure...

(defn case-map [case-f test-f tests thens]
  (sort (into {}
              (zipmap (map case-f tests)
                      (map vector
                           (map test-f tests)
                           thens)))))

(defn shift-mask [shift mask x]
  (-> x (bit-shift-right shift) (bit-and mask)))

#_(defn prep-ints
  [tests thens]
  (if (fits-table? tests)
    ; compact case ints, no shift-mask
    [0 0 (case-map int int tests thens) :compact]
    (let [[shift mask] (or (maybe-min-hash (map int tests)) [0 0])]
      (if (zero? mask)
        ; sparse case ints, no shift-mask
        [0 0 (case-map int int tests thens) :sparse]
        ; compact case ints, with shift-mask
        [shift mask (case-map #(shift-mask shift mask (int %)) int tests thens) :compact]))))

#_(defmacro case [e & clauses]
  (let [ge (gensym)
        default (if (odd? (count clauses))
                  (last clauses)
                  `(throw (str "No matching clause: " ~ge)))]
    (if (> 2 (count clauses))
      `(let [~ge ~e] ~default)
      (let [pairs (partition 2 clauses)
            assoc-test (defn assoc-test [m test expr]
                         (if (contains? m test)
                           (throw (str "Duplicate case test constant: " test))
                           (assoc m test expr)))
            pairs (reduce
                   (fn [m test-expr]
                     (if (sequential? (first test-expr))
                       (reduce #(assoc-test %1 %2 (last test-expr)) m (first test-expr))
                       (assoc-test m (first test-expr) (last test-expr))))
                   {} pairs)
            tests (keys pairs)
            thens (vals pairs)
            mode (cond
                   (every? #(and (integer? %) (<= Integer/MIN_VALUE % Integer/MAX_VALUE)) tests)
                   :ints
                   (every? keyword? tests)
                   :identity
                   :else :hashes)]
        (condp = mode
          :ints
          (let [vec__2 (prep-ints tests thens)
                shift (nth vec__2 0 nil)
                mask (nth vec__2 1 nil)
                imap (nth vec__2 2 nil)
                switch-type (nth vec__2 3 nil)]
            `(let [~ge ~e] (case* ~ge ~shift ~mask ~default ~imap ~switch-type :int)))
          :hashes
          (let [vec__19 (prep-hashes ge default tests thens)
                shift (nth vec__19 0 nil)
                mask (nth vec__19 1 nil)
                imap (nth vec__19 2 nil)
                switch-type (nth vec__19 3 nil)
                skip-check (nth vec__19 4 nil)]
            `(let [~ge ~e] (case* ~ge ~shift ~mask ~default ~imap ~switch-type :hash-equiv ~skip-check)))
          :identity
          (let [vec__28 (prep-hashes ge default tests thens)
                shift (nth vec__28 0 nil)
                mask (nth vec__28 1 nil)
                imap (nth vec__28 2 nil)
                switch-type (nth vec__28 3 nil)
                skip-check (nth vec__28 4 nil)]
            `(let [~ge ~e] (case* ~ge ~shift ~mask ~default ~imap ~switch-type :hash-identity ~skip-check))))))))

;; I never use protocols, but this might come in handy if I (or someone else) want(s) to

(defn find-type [obj]
  (cond
    (symbol?  obj) :mal/symbol
    (keyword? obj) :mal/keyword
    (atom?    obj) :mal/atom
    (nil?     obj) :mal/nil
    (true?    obj) :mal/boolean
    (false?   obj) :mal/boolean
    (number?  obj) :mal/number
    (string?  obj) :mal/string
    (macro?   obj) :mal/macro
    true
    (let [metadata (meta obj)
          type     (when (map? metadata) (get metadata :type))]
      (cond
        (keyword? type) type
        (list?   obj)   :mal/list
        (vector? obj)   :mal/vector
        (map?    obj)   :mal/map
        (fn?     obj)   :mal/function
        true            (throw "unknown MAL value in protocols")))))

;; A protocol (abstract class, interface..) is represented by a symbol.
;; It describes methods (abstract functions, contracts, signals..).
;; Each method is described by a sequence of two elements.
;; First, a symbol setting the name of the method.
;; Second, a vector setting its formal parameters.
;; The first parameter is required, plays a special role.
;; It is usually named `this` (`self`..).
;; For example,
;;   (defprotocol protocol
;;     (method1 [this])
;;     (method2 [this argument]))
;; can be thought as:
;;   (def method1 (fn [this]) ..)
;;   (def method2 (fn [this argument]) ..)
;;   (def protocol ..)
;; The return value is the new protocol.
;; A protocol is an atom mapping a type extending the protocol to
;; another map from method names as keywords to implementations.
(defmacro defprotocol [proto-name & methods]
    (let [drop2 (fn [args]
                  (if (= 2 (count args))
                    ()
                    (cons (first args) (drop2 (rest args)))))
          rewrite (fn [method]
                    (let [name     (first method)
                          args     (nth method 1)
                          argc     (count args)
                          varargs? (when (<= 2 argc) (= '& (nth args (- argc 2))))
                          dispatch `(get (get @~proto-name
                                              (find-type ~(first args)))
                                         ~(keyword (str name)))
                          body     (if varargs?
                                     `(apply ~dispatch ~@(drop2 args) ~(nth args (- argc 1)))
                                     (cons dispatch args))]
                      (list 'def name (list 'fn args body))))]
      `(do
         ~@(map rewrite methods)
         (def ~proto-name (atom {})))))

;; A type (concrete class..) extends (is a subclass of, implements..)
;; a protocol when it provides implementations for the required methods.
;;   (extend type protocol {
;;     :method1 (fn [this] ..)
;;     :method2 (fn [this arg1 arg2])})
;; Additional protocol/methods pairs are equivalent to successive
;; calls with the same type.
;; The return value is `nil`.
(defn extend [type proto methods & more]
  (do (swap! proto assoc type methods)
      (when (first more)
        (apply extend type more))))

;; An object satisfies a protocol when its type extends the protocol,
;; that is if the required methods can be applied to the object.
;; If `(satisfies protocol obj)` with the protocol below
;; then `(method1 obj)` and `(method2 obj 1 2)`
;; dispatch to the concrete implementation provided by the exact type.
;; Should the type evolve, the calling code needs not change.
(defn satisfies? [protocol obj]
  (contains? @protocol (find-type obj)))

