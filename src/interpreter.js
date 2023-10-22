import { read_str } from './reader.js'
import { _pr_str } from './printer.js'
import { Env } from './env.js'
import * as types from './types.js'
import * as core from './core.js'
import core_clj from './clj/core.clj?raw'
import pprint from './clj/pprint.clj?raw'
import simLispy from './simlispy/core.clj?raw'

// read
export function READ(str) {
    return read_str(str);
}

// eval 
function qqLoop(acc, elt) {
    if (types._list_Q(elt) && elt.length
        && types._symbol_Q(elt[0]) && elt[0].value == 'splice-unquote') {
        return [types._symbol("concat"), elt[1], acc];
    } else {
        return [types._symbol("cons"), quasiquote(elt), acc];
    }
}
function quasiquote(ast) {
    if (types._list_Q(ast) && 0 < ast.length
        && types._symbol_Q(ast[0]) && ast[0].value == 'unquote') {
        return ast[1];
    } else if (types._list_Q(ast)) {
        return ast.reduceRight(qqLoop, []);
    } else if (types._vector_Q(ast)) {
        return [types._symbol("vec"), ast.reduceRight(qqLoop, [])];
    } else if (types._symbol_Q(ast) || types._hash_map_Q(ast)) {
        return [types._symbol("quote"), ast];
    } else {
        return ast;
    }
}

function is_macro_call(ast, env) {
    return types._list_Q(ast) &&
        types._symbol_Q(ast[0]) &&
        env.find(ast[0]) &&
        env.get(ast[0])._ismacro_;
}

function macroexpand(ast, env) {
    while (is_macro_call(ast, env)) {
        var mac = env.get(ast[0]);
        ast = mac.apply(mac, ast.slice(1));
    }
    return ast;
}

function eval_ast(ast, env) {
    //console.log("eval_ast:", ast, env)
    if (types._symbol_Q(ast)) {
        return env.get(ast);
    } else if (types._list_Q(ast)) {
        return ast.map(function (a) { return EVAL(a, env); });
    } else if (types._set_Q(ast)) {
        var new_set = new Set()
        for (const item of ast) {
            new_set.add(EVAL(item, env))
        }
        return new_set
    } else if (types._vector_Q(ast)) {
        var v = ast.map(function (a) { return EVAL(a, env); });
        v.__isvector__ = true;
        return v;
    } else if (types._hash_map_Q(ast)) {
        var new_hm = new Map();
        for (var [key, value] of ast) {
            new_hm.set(EVAL(key, env), EVAL(ast.get(key), env))
        }
        return new_hm;
    } else {
        return ast;
    }
}

export function clearTests() {
    deftests = []
}

export var deftests = []

function _EVAL(ast, env) {
    while (true) {
        //console.log(PRINT(ast))
        //console.log(env)
        if (!types._list_Q(ast)) {
            return eval_ast(ast, env);
        }

        // apply list
        ast = macroexpand(ast, env);
        if (!types._list_Q(ast)) {
            return eval_ast(ast, env);
        }
        if (ast.length === 0) {
            return ast;
        }

        var a0 = ast[0], a1 = ast[1], a2 = ast[2], a3 = ast[3];
        // Keyword functions:
        // If the first element is a keyword,
        // it looks up its value in its argument
        if (types._keyword_Q(a0)) {
            return EVAL([types._symbol("get"), a1, a0], env)
        }
        // hash-maps as functions of keys
        if (types._hash_map_Q(a0)) {
            return EVAL([types._symbol("get"), a0, a1], env)
        }
        // vectors as functions of indices
        if (types._vector_Q(a0)) {
            return EVAL([types._symbol("get"), a0, a1], env)
        }
        // sets check membership
        if (types._set_Q(a0)) {
            return EVAL([types._symbol("contains?"), a0, a1], env)
        }
        switch (a0.value) {
            case "ns":
            case "discard-form":
                return null
            case "dispatch":
                // Regex
                if (types._string_Q(a1)) {
                    return new RegExp(a1, 'g')
                }
                // Anonymous function shorthand
                if (types._list_Q(a1)) {
                    var arg_strs = Array.from(new Set(ast.toString().match(/%\d?/g)))
                    var sort_strs = arg_strs.sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1)))
                    var args = sort_strs.map(x => types._symbol(x))
                    return types._function(EVAL, Env, a1, env, args);
                }
            case "def":
                var res = EVAL(a2, env);
                env.set(a1, res);
                return res
            case "let*":
                //case "let":
                var let_env = new Env(env);
                for (var i = 0; i < a1.length; i += 2) {
                    let_env.set(a1[i], EVAL(a1[i + 1], let_env));
                }
                ast = a2;
                env = let_env;
                break;
            case "loop*":
                var loop_body = [types._symbol('do')].concat(ast.slice(2))
                var loop_env = new Env(env);
                var loopLocals = []
                for (var i = 0; i < a1.length; i += 2) {
                    loopLocals.push(a1[i], EVAL(a1[i + 1], loop_env))
                }
                for (let i = 0; i < loopLocals.length; i += 2) {
                    loop_env.set(a1[i], loopLocals[i + 1])
                }
                ast = loop_body
                env = loop_env
                break
            case "recur":
                loopLocals.__isvector__ = true;
                var recurForms = ast.slice(1).flatMap(i => [i, i])
                for (let i = 1; i < recurForms.length; i += 2) {
                    let f = recurForms[i]
                    loopLocals[i] = f
                }
                ast = [types._symbol('loop*')].concat([loopLocals, loop_body])
                break
            case 'deftest':
                var res = ast.slice(2).map((x) => EVAL(x, env))
                env.set(a1, res);
                deftests.push({ test: a1, result: res })
                return res
            case 'testing':
                return EVAL(a2, env)
            case "quote":
                return a1;
            case "quasiquoteexpand":
                return quasiquote(a1);
            case "quasiquote":
                ast = quasiquote(a1);
                break;
            case 'defmacro':
                if (types._string_Q(a2)) {
                    var body = [types._symbol("do")].concat(ast.slice(4))
                    var func = types._function(EVAL, Env, body, env, a3)
                    func._ismacro_ = true;
                    var meta_map = new Map()
                    func.__meta__ = meta_map
                    meta_map.set("ʞdoc", a2)
                    meta_map.set("ʞname", a1)
                    meta_map.set("ʞarglists", a3)
                    return env.set(a1, func);
                } else {
                    var body = [types._symbol("do")].concat(ast.slice(3))
                    var func = types._function(EVAL, Env, body, env, a2)
                    func._ismacro_ = true;
                    var meta_map = new Map()
                    func.__meta__ = meta_map
                    meta_map.set("ʞname", a1)
                    meta_map.set("ʞarglists", a2)
                    return env.set(a1, func);
                }
            case 'macroexpand':
                return macroexpand(a1, env);
            case "try":
                try {
                    return EVAL(a1, env);
                } catch (exc) {
                    if (a2 && a2[0].value === "catch") {
                        if (exc instanceof Error) { exc = exc.message; }
                        return EVAL(a2[2], new Env(env, [a2[1]], [exc]));
                    } else {
                        throw exc;
                    }
                }
            case "do":
                eval_ast(ast.slice(1, -1), env);
                ast = ast[ast.length - 1];
                break;
            case "if":
                var cond = EVAL(a1, env);
                if (cond === null || cond === false) {
                    ast = (typeof a3 !== "undefined") ? a3 : null;
                } else {
                    ast = a2;
                }
                break;
            case "fn*":
                // need to check each function arity for presence of
                // recur without loop bindings. If found, add implicit
                // bindings to *each* function body that needs them
                if (types.hasRecur(ast)) {
                    let bodies = []
                    for (const body of ast.slice(1)) {
                        if (types.hasRecur(body) && !types.hasLoop(body)) {
                            var loopBindings = body[0]
                            // exclude '&' params
                                .flatMap((i) => i.value != '&' ? [i, i] : [])
                            loopBindings.__isvector__ = true
                            bodies.push(body.slice(0, 1)
                                .concat([[types._symbol('loop*'), loopBindings,
                                [types._symbol('do')].concat(body.slice(1))]]))
                        } else {
                            bodies.push(body)
                        }
                    }
                    //console.log(PRINT(bodies))
                    return types.multifn(EVAL, Env, bodies, env);
                }
                if (types._list_Q(a1)) {
                    //console.log(PRINT(ast.slice(1)))
                    return types.multifn(EVAL, Env, ast.slice(1), env);
                } else {
                    return types._function(EVAL, Env, a2, env, a1);
                }
            case "new":
                var constructor = EVAL(a1, env)
                var args = EVAL([types._symbol('do')].concat(ast.slice(2)), env)
                return new constructor(args)
            default:
                var el = eval_ast(ast, env), f = el[0];
                //console.log("f:", f, PRINT(ast), env)
                if (f.__multifn__) {
                    ast = f.__ast__(el.slice(1))
                    env = f.__gen_env__(el.slice(1));
                } else if (f.__ast__) {
                    ast = f.__ast__;
                    //console.log("calling lambda:", PRINT(ast), " with ", arity, " args")
                    env = f.__gen_env__(el.slice(1));
                } else {
                    if (types._set_Q(f) || types._keyword_Q(f) || types._vector_Q(f) || types._hash_map_Q(f)) {
                        return EVAL([f].concat(el.slice(1)), env)
                    }
                    var res = f.apply(f, el.slice(1));
                    return res
                }
        }
    }
}

export function EVAL(ast, env) {
    var result = _EVAL(ast, env);
    return (typeof result !== "undefined") ? result : null;
}

// print
export function PRINT(exp) {
    //console.log("PRINT:", exp)
    return _pr_str(exp, true);
}

export var repl_env = new Env();

export const evalString = function (str) {
    return PRINT(EVAL(READ(str), repl_env))
};

// core.js: defined using javascript
for (var n in core.ns) { repl_env.set(types._symbol(n), core.ns[n]); }
repl_env.set(types._symbol('eval'), function (ast) {
    return EVAL(ast, repl_env);
});
repl_env.set(types._symbol('*ARGV*'), []);

// load core.clj
evalString("(do " + core_clj + ")")
evalString("(do " + pprint + ")")
evalString("(do " + simLispy + ")")

export const repp = function (str) {
    //return evalString("(do " + str + ")")
    repl_env.set(types._symbol('*1'), READ(evalString("(do " + str + ")")))
    return EVAL(READ("(pprint " + "(do " + str + "))"), repl_env)
};

function addDoc(sym, arglists, doc) {
    var meta_map = new Map()
    meta_map.set("ʞdoc", doc)
    meta_map.set("ʞarglists", READ(arglists))
    repl_env.data[sym].__meta__ = meta_map
}

/* addDoc('iterate', '[f x]', "Returns a lazy sequence of x, (f x), (f (f x)) etc. f must be free of side-effects")
addDoc('true?', '[x]', "Returns true if x is the value true, false otherwise.")
addDoc('false?', '[x]', 'Returns true if x is the value false, false otherwise.')
addDoc('ratio?', '[n]', 'Returns true if n is a Ratio')
addDoc('number?', '[x]', 'Returns true if x is a Number')
addDoc('string?', '[x]', 'Return true if x is a String')
addDoc('symbol', "([name] [ns name])", "Returns a Symbol with the given namespace and name. Arity-1 works on strings, keywords, and vars.")
addDoc('symbol?', '[x]', 'Return true if x is a Symbol')
addDoc('set?', '[x]', 'Returns true if x is a set')
addDoc('keyword', "([name] [ns name])", "Returns a Keyword with the given namespace and name.  Do not use `:` in the keyword strings, it will be added automatically.")
addDoc('keyword?', '[x]', 'Returns true if x is a keyword')
addDoc('map-entry?', '[x]', 'Returns true if x is a map entry')
addDoc('re-matches', '[re s]', 'Returns the match, if any, of string to pattern')
addDoc('re-find', '([m] [re s])', 'Returns the next regex match, if any, of string to pattern')
addDoc('fn?', '[x]', 'Returns true if x is a function (not a macro)')
addDoc('macro?', '[x]', 'Returns true if x is a macro')
addDoc('char', '[x]', 'Coerce to char')
addDoc('int?', '[x]', 'Return true if x is a fixed precision integer')
addDoc('repeatedly', '[n f]', 'Takes a function of no args, presumably with side effects, and returns a sequence of length n of calls to it')
addDoc('rand-int', '[n]', 'Returns a random integer between 0 (inclusive) and n (exclusive).')
addDoc('rand-nth', '[coll]', 'Return a random element of the (sequential) collection. Will have the same performance characteristics as nth for the given collection.')
addDoc('Math/round', '[n]', 'Returns the value of a number rounded to the nearest integer')
addDoc('Math/sqrt', '[n]', 'Returns the square root of a number.')
addDoc('Math/pow', '[b n]', 'Returns the value of base b raised to the power of n.')
addDoc('Integer/toBinaryString', '[n]', 'Returns a string representation of the integer argument as an unsigned integer in base 2.')
addDoc('str/trim', '[s]', 'Removes whitespace from both ends of string.')
addDoc('cycle', '[coll]', 'Returns a lazy (infinite!) sequence of repetitions of the items in coll.')
addDoc('str/split', '[s re]', 'Splits string on a regular expression. Returns vector of the splits.')
addDoc('re-pattern', '[s]', 'Returns a regular expression from string s.')
addDoc('double', '[x]', 'Coerce to double')
addDoc('pr-str', '([x] [x & more])', 'Prints the object(s) as a string, separated by spaces if there is more than one.')
addDoc('str', '([] [x] [x & ys])', 'With no args, returns the empty string. With one arg x, returns x.toString().  (str nil) returns the empty string. With more than one arg, returns the concatenation of the str values of the args.')
addDoc('prn', '[& more]', 'Same as pr followed by (newline).')
addDoc('println', '[& more]', 'Outputs the args as a string followed by a newline.')
addDoc('read-string', '[s]', 'Reads one object from string s and outputs a form')
addDoc('slurp', '[f]', 'Opens a reader on f and reads all its contents, returning a string.')
addDoc('+', '([] [x] [x y] [x y & more])', 'Returns the sum of nums. (+) returns 0.')
addDoc('-', '([] [x] [x y] [x y & more])', 'If no ys are supplied, returns the negation of x, else subtracts the ys from x and returns the result.')
addDoc('*', '([] [x] [x y] [x y & more])', 'Returns the product of nums. (*) returns 1.')
addDoc('/', '([] [x] [x y] [x y & more])', 'If no denominators are supplied, returns 1/numerator, else returns numerator divided by all of the denominators.')
addDoc('inc', '[x]', "Returns a number one greater than num.")
addDoc('time', '[expr]', 'Evaluates expr and prints the time it took.  Returns the value of expr.')
addDoc('max', '([x] [x y] [x y & more])', 'Returns the greatest of the nums.')
addDoc('min', '([x] [x y] [x y & more])', 'Returns the least of the nums.')
addDoc('range', '([] [end] [start end] [start end step])', "Returns a seq of nums from start (inclusive) to end (exclusive), by step, where start defaults to 0, step to 1, and end to infinity. When step is equal to 0, returns an infinite sequence of start. When start is equal to end, returns empty list.")
addDoc('sort', '([coll] [comp coll])', 'Returns a sorted sequence of the items in coll. If no comparator is supplied, uses default comparator.')
addDoc('peek', '[coll]', "For a list, same as first, for a vector, same as last. If the collection is empty, returns nil.")
addDoc('pop', '[coll]', "For a list, returns a new list without the first item, for a vector, returns a new vector without the last item.")
addDoc('lower-case', '[coll]', 'Converts string to all lower-case.')
addDoc('upper-case', '[coll]', 'Converts string to all upper-case.')
addDoc('str/lower-case', '[coll]', 'Converts string to all lower-case.')
addDoc('str/upper-case', '[coll]', 'Converts string to all upper-case.')
addDoc('subs', '([s start] [s start end])', 'Returns the substring of s beginning at start inclusive, and ending at end (defaults to length of string), exclusive.')
addDoc('subvec', '([v start] [v start end])', 'Returns a vector of the items in vector from start (inclusive) to end (exclusive).  If end is not supplied, defaults to (count vector).')
addDoc('map-indexed', '([f] [f coll])', 'Returns a lazy sequence consisting of the result of applying f to 0 and the first item of coll, followed by applying f to 1 and the second item in coll, etc, until coll is exhausted. Thus function f should accept 2 arguments, index and item.')
addDoc('list', '[& items]', 'Creates a new list containing the items.')
addDoc('list?', '[x]', 'Returns true if x is a list')
addDoc('vector', '([] [a] [a b] [a b c] [a b c d] [a b c d e] [a b c d e f] [a b c d e f & args])', 'Creates a new vector containing the args.')
addDoc('vector?', '[x]', 'Returns true if x is a vector')
addDoc('hash-map', '[& keyvals]', 'Returns a new hash map with supplied mappings.  If any keys are equal, they are handled as if by repeated uses of assoc.')
addDoc('map?', '[x]', 'Returns true if x is a map')
addDoc('assoc', '([map key val] [map key val & kvs])', 'assoc[iate]. When applied to a map, returns a new map of the same (hashed/sorted) type, that contains the mapping of key(s) to val(s). When applied to a vector, returns a new vector that contains val at index. Note - index must be <= (count vector).')
addDoc('dissoc', '([map] [map key] [map key & ks])', 'dissoc[iate]. Returns a new map of the same (hashed/sorted) type, that does not contain a mapping for key(s).')
addDoc('get', '([map key] [map key not-found])', 'Returns the value mapped to key, not-found or nil if key not present.')
addDoc('re-seq', '[re s]', 'Returns a sequence of successive matches of pattern re in string')
addDoc('contains?', '[coll key]', 'Returns true if key is present in the given collection, otherwise returns false. Note that for numerically indexed collections like vectors, this tests if the numeric key is within the range of indexes.')
addDoc('keys', '[map]', "Returns a sequence of the map's keys, in the same order as (seq map).")
addDoc('vals', '[map]', "Returns a sequence of the map's values, in the same order as (seq map).")
addDoc('int', '[x]', 'Coerce to int')
addDoc('rem', '[num div]', "Remainder of dividing numerator by denominator.")
addDoc('walk', '[inner outer form]', "Traverses form, an arbitrary data structure.  inner and outer are functions.  Applies inner to each element of form, building up a data structure of the same type, then applies outer to the result. Recognizes all data structures. Consumes seqs as with doall.")
addDoc('sort-by', '([keyfn coll] [keyfn comp coll])', "Returns a sorted sequence of the items in coll, where the sort order is determined by comparing (keyfn item).  If no comparator is supplied, uses the default comparator.")
addDoc('sequential?', '[coll]', 'Returns true if coll is a list or a vector.')
addDoc('cons', '[x seq]', 'Returns a new seq where x is the first element and seq is the rest.')
addDoc('concat', '([] [x] [x y] [x y & zs])', 'Returns a lazy seq representing the concatenation of the elements in the supplied colls.')
addDoc('vec', '[coll]', 'Creates a new vector containing the contents of coll.')
addDoc('nth', '([coll index] [coll index not-found])', 'Returns the value at the index. get returns nil if index out of bounds, nth throws an exception unless not-found is supplied.')
addDoc('first', '[coll]', 'Returns the first item in the collection. Calls seq on its argument. If coll is nil, returns nil.')
addDoc('second', '[x]', 'Same as (first (next x))')
addDoc('rest', '[coll]', 'Returns a possibly empty seq of the items after the first. Calls seq on its argument.')
addDoc('last', '[coll]', 'Return the last item in coll')
addDoc('take', '([n] [n coll])', 'Returns a sequence of the first n items in coll, or all items if there are fewer than n.')
addDoc('drop', '([n] [n coll])', 'Returns a sequence of all but the first n items in coll.')
addDoc('empty?', '[coll]', 'Returns true if coll has no items - same as (not (seq coll)).')
addDoc('count', '[coll]', 'Returns the number of items in the collection. (count nil) returns 0.  Also works on strings and maps')
addDoc('repeat', '[n x]', 'Returns a sequence of length n of xs.')
addDoc('join', '([coll] [separator coll])', 'Returns a string of all elements in coll, as returned by (seq coll), separated by an optional separator.')
addDoc('str/join', '([coll] [separator coll])', 'Returns a string of all elements in coll, as returned by (seq coll), separated by an optional separator.')
addDoc('str/replace', '[s match replacement]', 'Replaces all instance of match with replacement in s.')
addDoc('conj', '([coll x] [coll x & xs])', "conj[oin]. Returns a new collection with the xs 'added'. (conj nil item) returns (item).  The 'addition' may happen at different 'places' depending on the concrete type.")
addDoc('seq', '[coll]', 'Returns a seq on the collection. If the collection is empty, returns nil.  (seq nil) returns nil. seq also works on strings and any iterable object.')
addDoc('filter', '[pred coll]', 'Returns a sequence of the items in coll for which (pred item) returns logical true. pred must be free of side-effects.')
addDoc('with-meta', '[obj m]', 'Returns an object of the same type and value as obj, with map m as its metadata.')
addDoc('meta', '[obj]', 'Returns the metadata of obj, returns nil if there is no metadata.')
addDoc('atom', '[x]', 'Creates and returns an Atom with an initial value of x.')
addDoc('atom?', '[x]', 'Returns true if x is an atom type.')
addDoc('deref', '[ref]', 'Returns the current state of an atom.')
addDoc('reset!', '[atom newval]', 'Sets the value of atom to newval without regard for the current value. Returns newval.')
addDoc('swap!', '([atom f] [atom f x] [atom f x y] [atom f x y & args])', 'Atomically swaps the value of atom to be: (apply f current-value-of-atom args). Note that f may be called multiple times, and thus should be free of side effects.  Returns the value that was swapped in.')
addDoc('js-eval', '[s]', 'Evaluates an arbitrary string of JavaScript.')
addDoc('set', '[coll]', 'Returns a set of the distinct elements of coll.')
addDoc('disj', '([set] [set key] [set key & ks])', 'disj[oin]. Returns a new set of the same (hashed/sorted) type, that does not contain key(s).')
addDoc('set/union', '([] [s1] [s1 s2] [s1 s2 & sets])', 'Return a set that is the union of the input sets')
addDoc('set/intersection', '([s1] [s1 s2] [s1 s2 & sets])', 'Return a set that is the intersection of the input sets')
addDoc('set/difference', '([s1] [s1 s2] [s1 s2 & sets])', 'Return a set that is the first set without elements of the remaining sets')
addDoc('set/symmetric-difference', '[s1 s2]', "Returns a set that is the symmetric difference of the input sets.")
 */