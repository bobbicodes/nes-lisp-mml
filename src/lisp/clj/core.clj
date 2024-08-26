(defmacro or
  "Evaluates exprs one at a time, from left to right. If a form
    returns a logical true value, or returns that value and doesn't
    evaluate any of the other expressions, otherwise it returns the
    value of the last expression. (or) returns nil."
  [& xs]
  (if (empty? xs) nil
      (if (= 1 (count xs))
        (first xs)
        (let* [condvar (gensym)]
              `(let* [~condvar ~(first xs)]
                     (if ~condvar ~condvar (or ~@(rest xs))))))))

(defmacro and
  "Evaluates exprs one at a time, from left to right. If a form
    returns logical false (nil or false), and returns that value and
    doesn't evaluate any of the other expressions, otherwise it returns
    the value of the last expr. (and) returns true."
  [& xs]
  (cond (empty? xs)      true
        (= 1 (count xs)) (first xs)
        :else
        (let* [condvar (gensym)]
              `(let* [~condvar ~(first xs)]
                     (if ~condvar (and ~@(rest xs)) ~condvar)))))

(defmacro when
  "Evaluates test. If logical true, evaluates body in an implicit do."
  [x & xs]
  (list 'if x (cons 'do xs)))

(defmacro cond
  "Takes a set of test/expr pairs. It evaluates each test one at a
time.  If a test returns logical true, cond evaluates and returns
the value of the corresponding expr and doesn't evaluate any of the
other tests or exprs. (cond) returns nil."
  [& xs]
  (when (gt (count xs) 0)
    (list 'if (first xs)
          (if (gt (count xs) 1)
            (nth xs 1)
            (throw "odd number of forms to cond"))
          (cons 'cond (rest (rest xs))))))

(def spread (fn* [arglist]
                 (cond
                   (nil? arglist) nil
                   (nil? (next arglist)) (seq (first arglist))
                   :else (cons (first arglist) (spread (next arglist))))))

(def list*
  (with-meta
    (fn*
     ([args] (seq args))
     ([a args] (cons a args))
     ([a b args] (cons a (cons b args)))
     ([a b c args] (cons a (cons b (cons c args))))
     ([a b c d & more]
      (cons a (cons b (cons c (cons d (spread more)))))))
    {:doc      "Creates a new seq containing the items prepended to the rest, the
last of which will be treated as a sequence."
     :arglists '([args] [a args] [a b args] [a b c args] [a b c d & more])}))

(def apply
  (with-meta
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
      (apply f (cons a (cons b (cons c (cons d (spread args))))))))
    {:doc "Applies fn f to the argument list formed by prepending intervening arguments to args."
     :arglists '([f args] [f x args] [f x y args] [f x y z args] [f a b c d & args])}))

(defmacro lazy-seq
  "Takes a body of expressions that returns an ISeq or nil, and yields
    a Seqable object that will invoke the body only the first time seq
    is called, and will cache the result and return it on all subsequent
    seq calls. See also - realized?"
  [& body]
  `(new LazySeq (fn* [] ~@body)))

;; Clojure's lazy map, doesn't work yet

(def map-step
  (fn*
   [cs]
   (lazy-seq
    (let [ss (map seq cs)]
      (when (every? identity ss)
        (cons (map first ss) (map-step (map rest ss))))))))

#_(def map
  (fn*
   ([f coll]
    (lazy-seq
     (when-let [s (seq coll)]
       (cons (f (first s)) (map f (rest s))))))
   ([f c1 c2]
    (lazy-seq
     (let [s1 (seq c1) s2 (seq c2)]
       (when (and s1 s2)
         (cons (f (first s1) (first s2))
               (map f (rest s1) (rest s2)))))))
   ([f c1 c2 c3]
    (lazy-seq
     (let [s1 (seq c1) s2 (seq c2) s3 (seq c3)]
       (when (and  s1 s2 s3)
         (cons (f (first s1) (first s2) (first s3))
               (map f (rest s1) (rest s2) (rest s3)))))))
   ([f c1 c2 c3 & colls]
      (map #(apply f %) (map-step (conj colls c3 c2 c1))))))

(def map
  (with-meta
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
     ([f c1 c2 c3 c4]
      (loop* [s1 (seq c1) s2 (seq c2) s3 (seq c3) s4 (seq c4) res []]
             (if (or (empty? s1) (empty? s2) (empty? s3) (empty? s4)) (apply list res)
                 (recur (rest s1) (rest s2) (rest s3) (rest s4)
                        (conj res (f (first s1) (first s2) (first s3) (first s4)))))))
     ([f c0 c1 c2 & colls]
      (_map f (list* c0 c1 c2 colls))))
      {:doc "Returns a sequence consisting of the result of applying f to
            the set of first items of each coll, followed by applying f to the
            set of second items in each coll, until any one of the colls is
            exhausted.  Any remaining items in other colls are ignored. Function
            f should accept number-of-colls arguments."
       :arglists '([f coll] [f c1 c2] [f c1 c2 c3] [f c1 c2 c3 c4] [f c0 c1 c2 & colls])}))

(def seq? 
  (with-meta
    (fn* [x] (list? x))
    {:doc "Returns true if x can be sequenced"
     :arglists '([x])}))

(def gensym-counter
  (atom 0))

(def gensym 
  (with-meta
    (fn* 
     ([] (symbol (str "G__" (swap! gensym-counter inc))))
     ([prefix]
      (symbol (str prefix (swap! gensym-counter inc)))))
    {:doc      "Returns a new symbol with a unique name. If a prefix string is
supplied, the name is prefix# where # is some unique number. If
prefix is not supplied, the prefix is 'G__'."
     :arglists '([] [prefix])}))

;; prints elapsed time twice for some reason
(defmacro time [exp]
  (let* [start (gensym)
         ret   (gensym)]
        `(let* [~start (time-ms)
                       ~ret   ~exp]
               (do
                 (println "Elapsed time:" (- (time-ms) ~start) "msecs")
                 ~ret))))

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

(def next
  (with-meta
   (fn [coll]
    (if (or (= 1 (count coll)) (= 0 (count coll)))
      nil
      (rest coll)))
    {:doc "Returns a seq of the items after the first. Calls seq on its
argument.  If there are no more items, returns nil."
     :arglists '([coll])}))

(def sigs
  (fn [fdecl]
    (let [asig
          (fn [fdecl]
            (let [arglist (first fdecl)
                  body (next fdecl)]
              (if (map? (first body))
                (if (next body)
                  (with-meta arglist (conj (if (meta arglist) (meta arglist) {}) (first body)))
                  arglist)
                arglist)))]
      (if (seq? (first fdecl))
        (loop [ret [] fdecls fdecl]
          (if fdecls
            (recur (conj ret (asig (first fdecls))) (next fdecls))
            (seq ret)))
        (list (asig fdecl))))))

(defmacro defn
  "Same as (def name (fn [params* ] exprs*)) or (def
  name (fn ([params* ] exprs*)+)) with any doc-string or attrs added
  to the var metadata."
  [name & fdecl]
  (let* [m (if (string? (first fdecl))
             {:doc  (first fdecl)
              :name (str name)}
             {:name (str name)})
         fdecl (if (string? (first fdecl))
                 (next fdecl)
                 fdecl)
         m (if (map? (first fdecl))
             (conj m (first fdecl))
             m)
         fdecl (if (map? (first fdecl))
                 (next fdecl)
                 fdecl)
         fdecl (if (vector? (first fdecl))
                 (list fdecl)
                 fdecl)
         m (if (map? (last fdecl))
             (conj m (last fdecl))
             m)
         fdecl (if (map? (last fdecl))
                 (butlast fdecl)
                 fdecl)
         m (conj {:arglists (list 'quote (sigs fdecl))} m)
         m (conj (if (meta name) (meta name) {}) m)]
    `(def ~(with-meta name m) (with-meta (fn ~@fdecl) ~m))))

(defmacro defn-
  "Same as defn, yielding non-public def"
  [name & decls]
   (list* `defn (with-meta name (assoc (meta name) :private true)) decls))

(defn load-file [f]
  (eval
   (read-string
    (str "(do " (slurp f) ")"))))

(defn not
  "Returns true if x is logical false, false otherwise."
  [a]
  (if a false true))

(defn not=
  "Same as (not (= obj1 obj2))"
  [a b]
  (not (= a b)))

(defn dec
  "Returns a number one less than n."
  [n]
  (- n 1))

(defn zero?
  "Returns true if num is zero, else false"
  [n]
  (= 0 n))

(defn identity
  "Returns its argument."
  [x]
  x)

(defn nnext
  "Same as (next (next x))"
  [s]
  (next (next s)))

(defn reduce
  "f should be a function of 2 arguments. If val is not supplied,
returns the result of applying f to the first 2 items in coll, then
applying f to that result and the 3rd item, etc. If coll contains no
items, f must accept no arguments as well, and reduce returns the
result of calling f with no arguments. If coll has only 1 item, it
is returned and f is not called.  If val is supplied, returns the
result of applying f to val and the first item in coll, then
applying f to that result and the 2nd item, etc. If coll contains no
items, returns val and f is not called."
  ([f xs] (reduce f (first xs) (rest xs)))
  ([f init xs]
   (if (empty? xs)
     init
     (reduce f (f init (first xs)) (rest xs)))))

(defn reductions
  "Returns a sequence of the intermediate values of the reduction (as
per reduce) of coll by f, starting with init."
  [f init xs]
  (loop* [s xs acc init res [init]]
    (if (empty? s)
      res
      (recur (rest s)
             (f acc (first s))
             (conj res (f acc (first s)))))))

(defn reverse
  "Returns a seq of the items in coll in reverse order. Not lazy."
  [coll]
  (reduce conj '() coll))

(defmacro if-not
  "Evaluates test. If logical false, evaluates and returns then expr, 
otherwise else expr, if supplied, else nil."
  [test then else]
  (if else
    `(if (not ~test) ~then ~else)
    `(if-not ~test ~then nil)))

(defn sorted-map
  "Returns a new sorted map with supplied mappings. If any keys are
equal, they are handled as if by repeated uses of assoc."
  [& keyvals]
  (into
   (with-meta {} {:sorted-map true})
   (sort (partition 2 keyvals))))

(defn sorted-set
  "Returns a new sorted set with supplied keys.  Any equal keys are
handled as if by repeated uses of conj."
  [& keys]
  (into
   (with-meta #{} {:sorted-set true})
   (sort keys)))

(defn merge-with
  "Returns a map that consists of the rest of the maps conj-ed onto
the first.  If a key occurs in more than one map, the mapping(s)
from the latter (left-to-right) will be combined with the mapping in
the result by calling (f val-in-result val-in-latter)."
  [f & maps]
  (when (some identity maps)
    (let [merge-entry (fn* [m e]
                        (let [k (key e) v (val e)]
                          (if (contains? m k)
                            (assoc m k (f (get m k) v))
                            (assoc m k v))))
          merge2 (fn* [m1 m2]
                   (reduce merge-entry (or m1 {}) (seq m2)))]
      (reduce merge2 maps))))

(defn str/escape
  "Return a new string, using cmap to escape each character ch
 from s"
  [s cmap]
  (loop* [index  0
         buffer ""]
    (if (= (count s) index) buffer
        (recur (inc index) 
               (str buffer (get cmap (nth s index) (nth s index)))))))

(defn juxt
  "Takes a set of functions and returns a fn that is the juxtaposition
of those fns.  The returned fn takes a variable number of args, and
returns a vector containing the result of applying each fn to the
args (left-to-right). Example: ((juxt a b c) x) => [(a x) (b x) (c x)]"
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
  "Takes a set of functions and returns a fn that is the composition
of those fns.  The returned fn takes a variable number of args,
applies the rightmost of fns to the args, the next
fn (right-to-left) to the result, etc."
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

(defn .toUpperCase
  "Converts string to all upper-case."
  [s]
  (. (str "'" s "'" ".toUpperCase")))

(defn .toLowerCase
  "Converts string to all lower-case."
  [s]
  (. (str "'" s "'" ".toLowerCase")))

(defn _iter-> [acc form]
  (if (list? form)
    `(~(first form) ~acc ~@(rest form))
    (list form acc)))

(defmacro ->
  "Threads the expr through the forms. Inserts x as the
second item in the first form, making a list of it if it is not a
list already. If there are more forms, inserts the first form as the
second item in second form, etc."
  [x & xs]
  (reduce _iter-> x xs))

(defn _iter->> [acc form]
  (if (list? form)
    `(~(first form) ~@(rest form) ~acc) (list form acc)))

(defmacro ->>
  "Threads the expr through the forms. Inserts x as the
last item in the first form, making a list of it if it is not a
list already. If there are more forms, inserts the first form as the
last item in second form, etc."
  [x & xs]
  (reduce _iter->> x xs))

(defn memoize
  "Returns a memoized version of a referentially transparent function. The
memoized version of the function keeps a cache of the mapping from arguments
to results and, when calls with the same arguments are repeated often, has
higher performance at the expense of higher memory use."
  [f]
  (let* [mem (atom {})]
        (fn* [& args]
          (let* [key (str args)]
                (if (contains? @mem key)
                  (get @mem key)
                  (let* [ret (apply f args)]
                        (do (swap! mem assoc key ret)
                            ret)))))))

(defn partial
  "Takes a function f and fewer than the normal arguments to f, and
returns a fn that takes a variable number of additional args. When
called, the returned function calls f with args + additional args."
  [pfn & args]
  (fn* [& args-inner]
    (apply pfn (concat args args-inner))))

(defn every?
  "Returns true if (pred x) is logical true for every x in coll, else
false."
  [pred xs]
  (cond (empty? xs)       true
        (pred (first xs)) (every? pred (rest xs))
        true              false))

(defn postwalk
  "Performs a depth-first, post-order traversal of form.  Calls f on
each sub-form, uses f's return value in place of the original.
Recognizes all Clojure data structures. Consumes seqs as with doall."
  [f form]
  (walk (partial postwalk f) f form))

(defn prewalk
  "Like postwalk, but does pre-order traversal."
  [f form]
  (walk (partial prewalk f) identity (f form)))

(defn postwalk-replace
  "Recursively transforms form by replacing keys in smap with their
values. Like clojure/replace but works on any data structure. Does
replacement at the leaves of the tree first."
  [smap form]
  (postwalk (fn* [x] (if (contains? smap x) (smap x) x)) form))

(defn not-every?
  "Returns false if (pred x) is logical true for every x in
coll, else true."
  [pred xs]
  (not (every? pred xs)))

(defmacro if-not
  "Evaluates test. If logical false, evaluates and returns then expr, 
otherwise else expr, if supplied, else nil."
  [test then else]
  `(if (not ~test) ~then ~else))

(defmacro when-not
  "Evaluates test. If logical false, evaluates body in an implicit do."
  [test & body]
  (list 'if test nil (cons 'do body)))

(defn fnext
  "Same as (first (next x))"
  [x]
  (first (next x)))

(defn ffirst
  "Same as (first (first x))"
  [x]
  (first (first x)))

(defn second
  "Same as (first (next x))"
  [l] (nth l 1))

(defn some
  "Returns the first logical true value of (pred x) for any x in coll,
else nil.  One common idiom is to use a set as pred, for example
this will return :fred if :fred is in the sequence, otherwise nil:
(some #{:fred} coll)"
  [pred xs]
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

(defn not-any?
  "Returns false if (pred x) is logical true for any x in coll,
else true."
  [pred coll]
  (not (some pred coll)))

(defn quot
  "quot[ient] of dividing numerator by denominator."
  [n d]
  (int (double (/ n d))))

(defn pos?
  "Returns true if num is greater than zero, else false"
  [n]
  (> n 0))

(defn neg?
  "Returns true if num is less than zero, else false"
  [n]
  (> 0 n))

(defn even?
  "Returns true if n is even, throws an exception if n is not an integer"
  [n]
  (zero? (mod n 2)))

(defn odd?
  "Returns true if n is odd, throws an exception if n is not an integer"
  [n]
  (not (zero? (mod n 2))))

(defn complement
  "Takes a fn f and returns a fn that takes the same arguments as f,
has the same effects, if any, and returns the opposite truth value."
  [f]
  (fn*
    ([] (not (f)))
    ([x] (not (f x)))
    ([x y] (not (f x y)))
    ([x y & zs] (not (apply f x y zs)))))

(defn mapcat
  "Returns the result of applying concat to the result of applying map
to f and colls.  Thus function f should return a collection."
  [f & colls]
  (apply concat (apply map f colls)))

(defn remove
  "Returns a lazy sequence of the items in coll for which
(pred item) returns logical false. pred must be free of side-effects."
  [pred coll]
  (filter (complement pred) coll))

(defn tree-seq
  "Returns a lazy sequence of the nodes in a tree, via a depth-first walk.
 branch? must be a fn of one arg that returns true if passed a node
 that can have children (but may not).  children must be a fn of one
 arg that returns a sequence of the children. Will only be called on
 nodes for which branch? returns true. Root is the root node of the
tree."
  [branch? children node]
  (remove nil?
          (cons node
                (when (branch? node)
                  (mapcat (fn* [x] (tree-seq branch? children x))
                          (children node))))))

(defn flatten
  "Takes any nested combination of sequential things (lists, vectors,
etc.) and returns their contents as a single, flat lazy sequence.
(flatten nil) returns an empty sequence."
  [x]
  (filter (complement sequential?)
          (rest (tree-seq sequential? seq x))))

(defn mod
  "Modulus of num and div. Truncates toward negative infinity."
  [num div]
  (let* [m (rem num div)]
        (if (or (zero? m) (= (pos? num) (pos? div)))
          m
          (+ m div))))

(defn take-while
  "Returns a lazy sequence of successive items from coll while
(pred item) returns logical true. pred must be free of side-effects."
  [pred coll]
  (loop* [s (seq coll) res []]
    (if (empty? s) res
        (if (pred (first s))
          (recur (rest s) (conj res (first s)))
          res))))

(defn drop-while
  "Returns a lazy sequence of the items in coll starting from the
first item for which (pred item) returns logical false."
  [pred coll]
  (loop* [s   (seq coll)]
    (if (empty? s) s
        (if (and s (pred (first s)))
          (recur (rest s))
          s))))

(defn partition
  "Returns a lazy sequence of lists of n items each, at offsets step
apart. If step is not supplied, defaults to n, i.e. the partitions
do not overlap. If a pad collection is supplied, use its elements as
necessary to complete last partition upto n items. In case there are
not enough padding elements, return a partition with less than n items."
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

(defn boolean
  "Coerce to boolean"
  [x]
  (if x true false))

(defn split-at
  "Returns a vector of [(take n coll) (drop n coll)]"
  [n coll]
  [(take n coll) (drop n coll)])

(defn split-with
  "Returns a vector of [(take-while pred coll) (drop-while pred coll)]"
  [pred coll]
  [(take-while pred coll) (drop-while pred coll)])

(defn str/split-lines
  "Splits s on \\n or \\r\\n."
  [s]
  (str/split s #"\r?\n"))

(defn partition-all
  "Returns a lazy sequence of lists like partition, but may include
partitions with fewer than n items at the end."
  ([n coll]
   (partition-all n n coll))
  ([n step coll]
     (loop* [s coll p []]
            (if (= 0 (count s)) p
                (recur (drop step s)
                       (conj p (take n s)))))))

(defn partition-by
  "Applies f to each value in coll, splitting it each time f returns a
 new value.  Returns a sequenc of partitions."
  [f coll]
  (loop* [s (seq coll) res []]
    (if (= 0 (count s)) res
        (recur (drop (count (take-while (fn* [x] (= (f (first s)) (f x))) s)) s)
               (conj res (take-while (fn* [x] (= (f (first s)) (f x))) s))))))

(defn coll?
  "Returns true if x is a list, vector, set or map"
  [x]
  (or (list? x) (vector? x) (set? x) (map? x)))

(defn group-by
  "Returns a map of the elements of coll keyed by the result of
f on each element. The value at each key will be a vector of the
corresponding elements, in the order they appeared in coll."
  [f coll]
  (reduce
   (fn* [ret x]
     (let* [k (f x)]
           (assoc ret k (conj (get ret k []) x))))
   {} coll))

(defn fromCharCode
  "Returns a string created from the specified sequence of UTF-16 code units."
  [int]
  (js-eval (str "String.fromCharCode(" int ")")))

(defn Character/isAlphabetic
  "Returns true if char code represents a letter."
  [int]
  (not= (upper-case (fromCharCode int))
        (lower-case (fromCharCode int))))

(defn Character/digit
  "Returns the numerical value of char using radix r."
  [char r]
  (Integer/parseInt (first char) r))

(defn Character/isLetter
  "Returns true if char is a letter."
  [char]
  (not= (upper-case char)
        (lower-case char)))

(defn Character/isUpperCase
  "Takes a character or a code point. Returns true if x is uppercase."
  [x]
  (if (int? x)
    (and (Character/isLetter (fromCharCode x))
         (= (fromCharCode x)
            (upper-case (fromCharCode x))))
    (and (Character/isLetter x)
         (= x (upper-case x)))))

(defn Character/isLowerCase
  "Takes a character or a code point. Returns true if x is lowercase."
  [x]
  (if (int? x)
    (and (Character/isLetter (fromCharCode x))
         (= (fromCharCode x)
            (lower-case (fromCharCode x))))
    (and (Character/isLetter x)
         (= x (lower-case x)))))

(defn zipmap
  "Returns a map with the keys mapped to the corresponding vals."
  [keys vals]
  (loop* [map {}
         ks (seq keys)
         vs (seq vals)]
    (if-not (and ks vs) map
            (recur (assoc map (first ks) (first vs))
                   (next ks)
                   (next vs)))))

(defn empty
  "Returns an empty collection of the same category as coll, or nil"
  [coll]
  (cond
    (list? coll) '()
    (vector? coll) []
    (set? coll) #{}
    (map? coll) {}
    (string? coll) ""))

(defn mapv
  "Returns a vector consisting of the result of applying f to the
set of first items of each coll, followed by applying f to the set
of second items in each coll, until any one of the colls is
exhausted.  Any remaining items in other colls are ignored. Function
f should accept number-of-colls arguments."
  ([f coll]
   (-> (reduce (fn [v o] (conj v (f o))) [] coll)))
  ([f c1 c2]
   (into [] (map f c1 c2)))
  ([f c1 c2 c3]
   (into [] (map f c1 c2 c3)))
  ([f c1 c2 c3 & colls]
   (into [] (apply map f c1 c2 c3 colls))))

(defn drop-last
  "Return a sequence of all but the last n (default 1) items in coll"
  [n coll]
  (if-not coll
    (drop-last 1 n)
    (map (fn* [x _] x) coll (drop n coll))))

(defn interleave
  "Returns a seq of the first item in each coll, then the second etc."
  [c1 c2]
  (loop* [s1  (seq c1)
         s2  (seq c2)
         res []]
    (if (or (empty? s1) (empty? s2))
      res
      (recur (rest s1)
             (rest s2)
             (conj res (first s1) (first s2))))))

(defn interpose
  "Returns a seq of the elements of coll separated by sep."
  [sep coll]
  (drop 1 (interleave (repeat (count coll) sep) coll)))

(defn into
  "Returns a new coll consisting of to-coll with all of the items of
from-coll conjoined."
  [to from]
  (reduce conj to from))

(defmacro if-let
    "If test is true, evaluates then with binding-form bound to the value of 
  test, if not, yields else"
  [bindings then else & oldform]
  (if-not else
    `(if-let ~bindings ~then nil)
    (let* [form (get bindings 0) tst (get bindings 1)
           temp# (gensym)]
          `(let [temp# ~tst]
             (if temp#
               (let [~form temp#]
                 ~then)
               ~else)))))


(defn frequencies
  "Returns a map from distinct items in coll to the number of times
they appear."
  [coll]
  (reduce (fn* [counts x]
            (assoc counts x (inc (get counts x 0))))
          {} coll))

(defn constantly
  "Returns a function that takes any number of arguments and returns x."
  [x]
  (fn* [& args] x))

(defn str/capitalize
  "Converts first character of the string to upper-case, all other
characters to lower-case."
  [s]
  (let* [s (str s)]
        (if (< (count s) 2)
          (upper-case s)
          (str (upper-case (subs s 0 1))
               (lower-case (subs s 1))))))

(defn keep
  "Returns a sequence of the non-nil results of (f item). Note,
this means false return values will be included.  f must be free of
side-effects."
  [s]
  (remove nil? s))

(defn not-empty
  "If coll is empty, returns nil, else coll"
  [coll]
  (when (seq coll) coll))

(defn reduce-kv
  "Reduces an associative collection. f should be a function of 3
arguments. Returns the result of applying f to init, the first key
and the first value in coll, then applying f to that result and the
2nd key and value, etc. If coll contains no entries, returns init
and f is not called. Note that reduce-kv is supported on vectors,
where the keys will be the ordinals."
  [f init coll]
  (reduce (fn* [ret kv] (f ret (first kv) (last kv))) init coll))

(defn merge
  "Returns a map that consists of the rest of the maps conj-ed onto
the first.  If a key occurs in more than one map, the mapping from
the latter (left-to-right) will be the mapping in the result."
  [& maps]
  (loop* [maps (mapcat seq maps) res {}]
    (if-not (some identity maps) res
            (recur (rest maps) (conj res (first maps))))))

(defmacro when-let
  "When test is true, evaluates body with binding-form bound to the value of test"
  [bindings & body]
  (let* [form (get bindings 0) tst (get bindings 1)
         temp# (gensym)]
        `(let* [temp# ~tst]
               (when temp#
                 (let* [~form temp#]
                       ~@body)))))

(defmacro when-first
  "Roughly the same as (when (seq xs) (let [x (first xs)] body)) but xs is evaluated only once."
  [bindings & body]
  (let* [x   (first bindings)
         xs  (last bindings)
         xs# (gensym)]
        `(when-let [xs# (seq ~xs)]
           (let* [~x (first xs#)]
                 ~@body))))
  
(defmacro as->
  "Binds name to expr, evaluates the first form in the lexical context
of that binding, then binds name to that result, repeating for each
successive form, returning the result of the last form."
  [expr name & forms]
  `(let* [~name ~expr
          ~@(interleave (repeat (count forms) name) (butlast forms))]
         ~(if (empty? forms)
            name
            (last forms))))

(defmacro some->
  "When expr is not nil, threads it into the first form (via ->),
and when that result is not nil, through the next etc"
  [expr & forms]
  (let [g (gensym)
        steps (map (fn [step] `(if (nil? ~g) nil (-> ~g ~step)))
                   forms)]
    `(let [~g ~expr
           ~@(interleave (repeat (count forms) g) (butlast steps))]
       ~(if (empty? steps)
          g
          (last steps)))))

(defmacro some->>
  "When expr is not nil, threads it into the first form (via ->>),
and when that result is not nil, through the next etc"
  [expr & forms]
  (let [g (gensym)
        steps (map (fn [step] `(if (nil? ~g) nil (->> ~g ~step)))
                   forms)]
    `(let [~g ~expr
           ~@(interleave (repeat (count forms) g) (butlast steps))]
       ~(if (empty? steps)
          g
          (last steps)))))

(defn distinct?
  "Returns true if no two of the arguments are ="
  [x y & more]
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

(defn distinct
  "Returns a sequence of the elements of coll with duplicates removed."
  [coll]
  (into (empty coll) (set coll)))

(defn parseInt
  "Parses a string argument and returns an integer of the specified radix."
  [s r]
  (Integer/parseInt s r))

(defn Math/floor
  "Rounds down and returns the largest integer less than or equal to a given number."
  [x]
  (js-eval (str "Math.floor(" x ")")))

(defn Math/ceil
  "Rounds up and returns the smallest integer greater than or equal to a given number."
  [x]
  (js-eval (str "Math.ceil(" x ")")))

(defn get-in
  "Returns the value in a nested associative structure,
where ks is a sequence of keys. Returns nil if the key
is not present, or the not-found value if supplied."
  [m ks]
  (reduce #(get % %2) m ks))

(defn some?
  "Returns true if x is not nil, false otherwise."
  [x]
  (not (nil? x)))

(defn nthnext
  "Returns the nth next of coll, (seq coll) when n is 0."
  [coll n]
  (loop [n n xs (seq coll)]
    (if (and xs (pos? n))
      (recur (dec n) (next xs))
      xs)))

(defn update
  "'Updates' a value in an associative structure, where k is a
key and f is a function that will take the old value
and any supplied args and return the new value, and returns a new
structure.  If the key does not exist, nil is passed as the old value."
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

(defmacro for
  "List comprehension. Takes a vector of one or more
 binding-form/collection-expr pairs, each followed by zero or more
 modifiers, and yields a lazy sequence of evaluations of expr.
 Collections are iterated in a nested fashion, rightmost fastest,
 and nested coll-exprs can refer to bindings created in prior
 binding-forms.  Supported modifiers are: :let [binding-form expr ...],
 :while test, :when test. Example:
 (take 100 (for [x (range 100000000) y (range 1000000) :while (< y x)] [x y]))"
  [seq-exprs body-expr]
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

(defn key
  "Returns the key of the map entry."
  [e]
  (first e))

(defn val
  "Returns the value of the map entry."
  [e]
  (last e))

(defn butlast
  "Return a seq of all but the last item in coll, in linear time"
  [s]
  (loop* [ret []
         s   s]
    (if (next s)
      (recur (conj ret (first s)) (next s))
      (seq ret))))

(defn assoc-in
  "Associates a value in a nested associative structure, where ks is a
sequence of keys and v is the new value and returns a new nested structure.
If any levels do not exist, hash-maps will be created."
  [m ks v]
  (if (next ks)
    (assoc m (first ks) (assoc-in (get m (first ks)) (rest ks) v))
    (assoc m (first ks) v)))

(defn str/includes?
  "Returns true if s includes substr."
  [s substr]
  (js-eval (str "'" s "'" ".includes(" "'" substr "'" ")")))

(defn take-nth
  "Returns a seq of every nth item in coll."
  [n coll]
  (loop* [s coll res []]
    (if (empty? s) res
        (recur (drop n s) (conj res (first s))))))

(defn namespace
  "Returns the namespace String of a symbol or keyword, or nil if not present."
  [x]
  (when (str/includes? x "/")
    (first (str/split (str x) "/"))))

(defn name
  "Returns the name String of a string, symbol or keyword."
  [x]
  (if (keyword? x)
    (subs (str x) 1)
    (str x)))

(defn comment
  "Ignores body, yields nil"
  [& forms])

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

(defn destructure
  "Takes a binding form and outputs bindings with all destructuring forms expanded."
  [bindings]
  (let* [bents (partition 2 bindings)
         process-entry (fn* [bvec b] (pb bvec (first b) (second b)))]
        (if (every? symbol? (map first bents))
          bindings
          (if-let [kwbs (seq (filter #(keyword? (first %)) bents))]
            (throw (str "Unsupported binding key: " (ffirst kwbs)))
            (reduce process-entry [] bents)))))

(defmacro let
    "Evaluates the exprs in a lexical context in which the symbols in
  the binding-forms are bound to their respective init-exprs or parts
  therein."
  [bindings & body]
  `(let* ~(destructure bindings) ~@body))

(defmacro loop
  "Evaluates the exprs in a lexical context in which the symbols in
the binding-forms are bound to their respective init-exprs or parts
therein. Acts as a recur target."
  [bindings & body]
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
(defmacro fn
  "Defines a function."
  [& sigs]
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

(defmacro cond->
  "Takes an expression and a set of test/form pairs. Threads expr (via ->)
through each form for which the corresponding test
expression is true. Note that, unlike cond branching, cond-> threading does
not short circuit after the first true test expression."
  [expr & clauses]
  (let [g (gensym)
        steps (map (fn [[test step]] `(if ~test (-> ~g ~step) ~g))
                   (partition 2 clauses))]
    `(let [~g ~expr
           ~@(interleave (repeat (count clauses) g) (butlast steps))]
       ~(if (empty? steps)
          g
          (last steps)))))

(defmacro cond->>
  "Takes an expression and a set of test/form pairs. Threads expr (via ->>)
through each form for which the corresponding test expression
is true.  Note that, unlike cond branching, cond->> threading does not short circuit
after the first true test expression."
  [expr & clauses]
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
  "'Updates' a value in a nested associative structure, where ks is a
sequence of keys and f is a function that will take the old value
and any supplied args and return the new value, and returns a new
nested structure.  If any levels do not exist, hash-maps will be
created."
  ([m ks f & args]
     (update-in* m ks f args)))

(defmacro condp
  "Takes a binary predicate, an expression, and a set of clauses.
   For each clause, (pred test-expr expr) is evaluated. If it returns
logical true, the clause is a match. If a binary clause matches, the
result-expr is returned, if a ternary clause matches, its result-fn,
which must be a unary function, is called with the result of the
predicate as its argument, the result of that call being the return
value of condp. A single default expression can follow the clauses,
and its value will be returned if no clause matches. If no default
expression is provided and no clause matches, an exception is thrown."
  [pred expr & clauses]
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

(defn Math/log
  "Returns the natural logarithm (base e) of a number."
  [n]
  (js-eval (str "Math.log(" n ")")))

(def Integer/MIN_VALUE
  (js-eval "Number.MIN_VALUE"))

(def Integer/MAX_VALUE
  (js-eval "Number.MAX_VALUE"))

(defn bit-shift-left
  "Bitwise shift left"
  [x n]
  (js-eval (str x " << " n)))

(defn bit-shift-right
  "Bitwise shift right"
  [x n]
  (js-eval (str x " >> " n)))

(defn bit-test
  "Test bit at index n"
  [x n]
  (js-eval (str "((" x " >> " n ") % 2 != 0)")))

(defn bit-set
  "Set bit at index n"
  [x n]
  (js-eval (str x " | 1 << " n)))

(defn bit-clear
  "Clear bit at index n"
  [x n]
  (js-eval (str x " & ~(1 << " n ")")))

(defn bit-flip
  "Flip bit at index n"
  [x n]
  (if (bit-test x n)
    (bit-clear x n)
    (bit-set x n)))

(defn bit-and
  "Bitwise and"
  [x y]
  (js-eval (str x " & " y)))

(defn str/starts-with?
  "Returns true if s starts with substr."
  [s substr]
  (js-eval (str "'" s "'" ".startsWith ('" substr "')")))


(defn <
  "Returns non-nil if nums are in monotonically increasing order,
  otherwise false."
  ([x] true)
  ([x y] (lt x y))
  ([x y & more]
   (if (< x y)
     (if (next more)
       (recur y (first more) (next more))
       (< y (first more)))
     false)))

(defn <=
  "Returns non-nil if nums are in monotonically non-decreasing order,
  otherwise false."
  ([x] true)
  ([x y] (lte x y))
  ([x y & more]
   (if (<= x y)
     (if (next more)
       (recur y (first more) (next more))
       (<= y (first more)))
     false)))


(defn >
  "Returns non-nil if nums are in monotonically decreasing order,
  otherwise false."
  ([x] true)
  ([x y] (gt x y))
  ([x y & more]
   (if (> x y)
     (if (next more)
       (recur y (first more) (next more))
       (> y (first more)))
     false)))

(defn >=
  "Returns non-nil if nums are in monotonically non-increasing order,
  otherwise false."
  ([x] true)
  ([x y] (gte x y))
  ([x y & more]
   (if (>= x y)
     (if (next more)
       (recur y (first more) (next more))
       (>= y (first more)))
     false)))

(defn loop1
  "Takes a sequence of music and loops it n times. Can be nested inside a loop2 but not another loop1."
  [n notes]
  (concat [{:loop1 n}] notes [{:loop1 :end}]))

(defn loop2
 "Takes a sequence of music and loops it n times. Can be nested inside a loop1 but not another loop2."
  [n notes]
  (concat [{:loop2 n}] notes [{:loop2 :end}]))

(defn slide
  "Creates a sequence of frames of a given length
   from one pitch to another."
  [from to frames]
  (take frames 
    (if (< to from)
      (map #(vector 1 %) 
        (reverse (range to from 
                   (/ (abs (- from to)) frames))))
      (map #(vector 1 %) 
        (range from to
          (/ (abs (- from to)) frames))))))

(defn r [l] [[l 160]])

(defn arp [l seq]
  [{:arp seq}
    [l 60]])
