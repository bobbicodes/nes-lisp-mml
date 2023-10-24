import { read_str } from './reader.js';
import { _pr_str, _println } from './printer.js'
import * as types from './types.js'
import { repl_env, evalString, PRINT, EVAL } from './interpreter.js';
import zip from './clj/zip.clj?raw'

export var out_buffer = ""

export function appendBuffer(s) {
    out_buffer = out_buffer + s
}

export function clearBuffer() {
    out_buffer = ""
}

function _print(s) {
    appendBuffer(s)
}

function _pr(s) {
    if (arguments.length > 1) {
        appendBuffer(Array.from(arguments).join(' '))
    } else {
        appendBuffer(s)
    }
}

// Errors/Exceptions
function mal_throw(exc) { throw new Error(exc); }

// String functions
function pr_str() {
    return Array.prototype.map.call(arguments, function (exp) {
        return _pr_str(exp, true);
    }).join(" ");
}

function str() {
    const args = Array.from(arguments).filter(v => v !== null);
    return Array.prototype.map.call(args, function (exp) {
        return _pr_str(exp, false);
    }).join("");
}

function prn(s) {
    if (arguments.length > 1) {
        appendBuffer(Array.from(arguments).join(' ') + "\n")
    } else {
        appendBuffer(s + "\n")
    }
}

function println() {
    _println.apply({}, Array.prototype.map.call(arguments, function (exp) {
        appendBuffer(exp + "\n")
        return _pr_str(exp, false);
    }));
}

function consolePrint() {
    _println.apply({}, Array.prototype.map.call(arguments, function (exp) {
        return _pr_str(exp, false);
    }));
}

function slurp(f) {
    if (typeof require !== 'undefined') {
        return require('fs').readFileSync(f, 'utf-8');
    } else {
        var req = new XMLHttpRequest();
        req.open("GET", f, false);
        req.send();
        if (req.status == 200) {
            return req.responseText;
        } else {
            throw new Error("Failed to slurp file: " + f);
        }
    }
}

// Number functions
function time_ms() { return new Date().getTime(); }


// Hash Map functions
function assoc(src_hm) {
    if (src_hm === null) {
        src_hm = new Map()
    }
    var hm = types._clone(src_hm);
    var args = [hm].concat(Array.prototype.slice.call(arguments, 1));
    return types._assoc_BANG.apply(null, args);
}

function dissoc(src_hm) {
    var hm = types._clone(src_hm);
    var args = [hm].concat(Array.prototype.slice.call(arguments, 1));
    return types._dissoc_BANG.apply(null, args);
}

export function get(coll, key, notfound) {
    if (types._vector_Q(coll)) {
        return coll[key]
    }
    if (types._string_Q(coll)) {
        return coll[key]
    }
    if (types._hash_map_Q(coll)) {
        for (const [k, value] of coll) {
            if (types._equal_Q(k, key)) {
                return value
            }
        }
        return notfound
    }
    if (coll != null) {
        return coll.get(key) || notfound
    } else {
        return null;
    }
}

export function contains_Q(coll, key) {
    if (coll === null) {
        return false
    }
    if (types._hash_map_Q(coll)) {
        for (const [k, value] of coll) {
            if (types._equal_Q(k, key)) {
                return true
            }
        }
    }
    if (types._set_Q(coll)) {
        for (const item of coll) {
            if (types._equal_Q(item, key)) {
                return true
            }
        }
        return false
    }
    if (key in coll) { return true; } else { return false; }
}

function keys(hm) { return Array.from(hm.keys()) }
function vals(hm) { return Array.from(hm.values()) }


// Sequence functions
export function cons(a, b) {
    if (b != null && b.name === 'LazySeq') {
        return lazyCons(a, b)
    }
    return [a].concat(b);
}

export function lazyCons(x, coll) {
    return lazy(function* () {
        yield x;
        yield* iterable(coll);
    });
}

function concat(lst) {
    lst = lst || [];
    return lst.concat.apply(lst, Array.prototype.slice.call(arguments, 1));
}
function vec(lst) {
    if (types._list_Q(lst)) {
        var v = Array.prototype.slice.call(lst, 0);
        v.__isvector__ = true;
        return v;
    } else {
        return lst;
    }
}

function re_matches(re, s) {
    let matches = re.exec(s);
    if (matches && s === matches[0]) {
        if (matches.length === 1) {
            return matches[0];
        } else {
            return matches;
        }
    }
}

function re_find(re, s) {
    let matches = re.exec(s);
    if (matches) {
        if (matches.length === 1) {
            return matches[0];
        } else {
            return matches;
        }
    }
}

function re_seq(re, s) {
    if (s === null) {
        return null
    }
    const array = [...s.matchAll(re)];
    const firsts = array.map(x => x[0])
    if (firsts.length === 0) {
        return null
    }
    return firsts
}

export function nth(coll, idx, notfound) {
    if (types._lazy_iterable_Q(coll)) {
        if (coll) {
            var elt = undefined;
            if (coll instanceof Array) {
                elt = coll[idx];
            } else {
                let iter = iterable(coll);
                let i = 0;
                for (let value of iter) {
                    if (i++ == idx) {
                        elt = value;
                        break;
                    }
                }
            }
            if (elt !== undefined) {
                return elt;
            }
        }
        return notfound;
    }
    if (idx < coll.length) { return coll[idx]; }
    else { return notfound }
}

export function first(lst) {
    if (types._lazy_range_Q(lst)) {
        return 0
    }
    return (lst === null || lst.length === 0) ? null : seq(lst)[0];
}

export function second(lst) { return (lst === null || lst.length === 0) ? null : seq(lst)[1]; }
export function last(lst) { return (lst === null || lst.length === 0) ? null : seq(lst)[seq(lst).length - 1]; }

export function rest(lst) {
    //console.log("[rest]", lst)
    if (types._lazy_iterable_Q(lst) || types._lazy_seq_Q(lst)) {
        return lazy(function* () {
            let first = true;
            for (const x of iterable(coll)) {
                if (first) first = false;
                else yield x;
            }
        });
    }
    return (lst == null || lst.length === 0) ? [] : seq(lst).slice(1);
}

function empty_Q(lst) {
    if (types._set_Q(lst) || types._hash_map_Q(lst)) {
        if (lst.size === 0) {
            return true
        } else {
            return false
        }
    }
    if (!lst) {
        return true
    }
    return lst.length === 0;
}

export function count(s) {
    if (types._hash_map_Q(s)) { return s.size; }
    if (Array.isArray(s)) { return s.length; }
    if (types._set_Q(s)) { return s.size; }
    else if (s === null) { return 0; }
    else { return Object.keys(s).length; }
}

function conj(lst) {
    if (types._iterate_Q(lst)) {
        return "TODO: implement iterate on conj"
    }
    if (types._list_Q(lst)) {
        return Array.prototype.slice.call(arguments, 1).reverse().concat(lst);
    } else if (types._vector_Q(lst)) {
        var v = lst.concat(Array.prototype.slice.call(arguments, 1));
        v.__isvector__ = true;
        return v;
    } else if (types._set_Q(lst)) {
        return lst.add(arguments[1])
    } else if (types._hash_map_Q(lst)) {
        if (arguments.length === 2 && arguments[1].size === 0) {
            return lst
        }
        var hm = new Map(lst)
        const args = Array.prototype.slice.call(arguments, 1)
        let seqs = []
        for (const arg of args) {
            if (types._hash_map_Q(arg)) {
                seqs = seqs.concat(seq(arg))
            } else {
                seqs.push(arg)
            }
        }
        for (var i = 0; i < seqs.length; i++) {
            hm.set(seqs[i][0], seqs[i][1])
        }
        return hm
    }
}

function re_pattern(s) {
    return new RegExp(s, 'g')
}

function split(s, re) {
    return s.split(re)
}

export function seq(obj) {
    if (types._list_Q(obj)) {
        return obj.length > 0 ? obj : null;
    } else if (types._iterate_Q(obj)) {
        return obj.realized
    } else if (types._vector_Q(obj)) {
        return obj.length > 0 ? Array.prototype.slice.call(obj, 0) : null;
    } else if (types._string_Q(obj)) {
        return obj.length > 0 ? obj.split('') : null;
    } else if (types._hash_map_Q(obj)) {
        return obj.size > 0 ? [...obj.entries()] : null;
    } else if (types._set_Q(obj)) {
        return Array.from(obj)
    }
    else if (obj === null) {
        return null;
    } else {
        return obj
    }
}


function apply(f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return f.apply(f, args.slice(0, args.length - 1).concat(args[args.length - 1]));
}


// Metadata functions
export function with_meta(obj, m) {
    var new_obj = types._clone(obj);
    new_obj.__meta__ = m;
    return new_obj;
}

export function meta(obj) {
    // TODO: support atoms
    if ((!types._sequential_Q(obj)) &&
        (!(types._hash_map_Q(obj))) &&
        (!(types._function_Q(obj))) &&
        (!(types._symbol_Q(obj)))) {
        throw new Error("attempt to get metadata from: " + types._obj_type(obj));
    }
    return obj.__meta__;
}


// Atom functions
function deref(atm) { return atm.val; }
function reset_BANG(atm, val) { return atm.val = val; }
function swap_BANG(atm, f) {
    var args = [atm.val].concat(Array.prototype.slice.call(arguments, 2));
    atm.val = f.apply(f, args);
    return atm.val;
}

function js_eval(str) {
    return js_to_mal(eval(str.toString()));
}

function js_method_call(object_method_str) {
    var args = Array.prototype.slice.call(arguments, 1),
        r = resolve_js(object_method_str),
        obj = r[0], f = r[1];
    var res = f.apply(obj, args);
    return js_to_mal(res);
}

function toSet(coll) {
    var new_set = new Set()
    for (const item of seq(coll)) {
        if (!contains_Q(new_set, item)) {
            new_set.add(item)
        }
    }
    return new_set
}

function _union(setA, setB) {
    const _union = new Set(setA);
    for (const elem of setB) {
        if (!contains_Q(_union, elem)) {
            _union.add(elem);
        }
    }
    return _union;
}

function _intersection(setA, setB) {
    const _intersection = new Set();
    for (const elem of setB) {
        if (contains_Q(setA, (elem))) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}

function setDelete(set, item) {
    var new_set = new Set()
    for (const i of set) {
        if (!types._equal_Q(i, item)) {
            new_set.add(i)
        }
    }
    return new_set
}

function symmetricDifference(setA, setB) {
    var _difference = new Set(setA);
    for (const elem of setB) {
        if (contains_Q(_difference, elem)) {
            _difference = setDelete(_difference, elem);
        } else {
            _difference.add(elem);
        }
    }
    return _difference;
}

function _difference(setA, setB) {
    var _difference = new Set(setA);
    for (const elem of setB) {
        _difference = setDelete(_difference, elem);
    }
    return _difference;
}

function _disj(set) {
    var args = Array.from(arguments).slice(1)
    var new_set = types._clone(set)
    for (let i = 0; i < args.length; i++) {
        new_set.delete(args[i])
    }
    return new_set
}

function _is(a) {
    if (a) {
        return true
    } else {
        return false
    }
}

function resolve_js(str) {
    if (str.match(/\./)) {
        var re = /^(.*)\.[^\.]*$/,
            match = re.exec(str);
        return [eval(match[1]), eval(str)];
    } else {
        return [GLOBAL, eval(str)];
    }
}

function js_to_mal(obj) {
    if (obj === null || obj === undefined) {
        return null;
    }
    var cache = [];
    var str = JSON.stringify(obj, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection
    return JSON.parse(str);
}

function map(f, s) {
    if (types._string_Q(s)) {
        s = seq(s)
    }
    return s.map(function (el) { return f(el); });
}

function int(x) {
    if (types._ratio_Q(x)) {
        return x.floor()
    }
    if (types._number_Q(x)) {
        return Math.floor(x)
    } else if (x[0] === '\\') {
        // is a char
        return x.charCodeAt(1)
    } else {
        return x.charCodeAt(0)
    }
}

function double(x) {
    if (types._ratio_Q(x)) {
        return x.n / x.d
    }
    return x
}

function char(int) {
    return String.fromCharCode(int)
}

function filter(f, lst) {
    if (types._lazy_iterable_Q(lst)) {
        return lazy(function* () {
            for (const x of iterable(coll)) {
                if (pred(x)) {
                    yield x;
                }
            }
        });
    }
    if (types._iterate_Q(lst)) {
        return "TODO: filter iterate object"
    }
    if (!lst || lst.length === 0) {
        return []
    }
    if (types._set_Q(f)) {
        return seq(lst).filter(function (el) { return f.has(el); });
    }
    return seq(lst).filter(function (el) { return f(el); })
}

function min() {
    return Math.min.apply(null, arguments);
}

function max() {
    return Math.max.apply(null, arguments);
}

function _pow(x, n) {
    return Math.pow(x, n)
}

function _abs(n) {
    return Math.abs(n)
}

function sum() {
    if (Array.from(arguments).length === 0) {
        return 0
    }
    var res = Array.from(arguments).reduce((acc, a) => acc + a, 0);
    if (Array.from(arguments).every(function (element) { return types._ratio_Q(element) })) {
        res = types._ratio(res)
    }
    return res
}

function subtract() {
    if (arguments.length === 1) {
        return subtract(types._ratio(0), arguments[0])
    }
    var res = Array.from(arguments).slice(1).reduce((acc, a) => acc - a, arguments[0]);
    if (Array.from(arguments).every(function (element) { return types._ratio_Q(element) })) {
        res = types._ratio(res)
    }
    return res
}

function product() {
    if (arguments.length === 0) {
        return 1
    }
    var res = Array.from(arguments).reduce((acc, a) => acc * a, 1);
    if (Array.from(arguments).every(function (element) { return types._ratio_Q(element) })) {
        res = types._ratio(res)
    }
    return res
}

/* function divide() {
    if (arguments[0] === 0) {
        return 0
    }
    if (arguments.length === 2 && Number.isInteger(arguments[0])
        && Number.isInteger(arguments[1]) && arguments[1] != 1) {
        var quotient = types._ratio({ n: arguments[0], d: arguments[1] })
        if (quotient.d === 1) {
            return quotient.n
        } else {
            return quotient
        }
    }
    var divisor = arguments[0]
    var res = Array.from(arguments).slice(1).reduce((acc, a) => acc / a, divisor);
    if (Array.from(arguments).every(function (element) { return types._ratio_Q(element) })) {
        res = types._ratio(res)
    }
    return res
} */

function divide(n, d) {
    return n / d
}

// https://github.com/squint-cljs/squint/blob/main/src/squint/core.js
class LazyIterable {
    constructor(gen) {
        this.name = 'LazyIterable'
        this.gen = gen;
    }
    [Symbol.iterator]() {
        return this.gen();
    }
}

export function lazy(f) {
    //console.log("creating lazy-iterable of", f)
    return new LazyIterable(f);
}

export function seqable_QMARK_(x) {
    // String is iterable but doesn't allow `m in s`
    return typeof x === 'string' || x === null || x === undefined || Symbol.iterator in x;
}

export function iterable(x) {
    // nil puns to empty iterable, support passing nil to first/rest/reduce, etc.
    if (x === null || x === undefined) {
        return [];
    }
    if (seqable_QMARK_(x)) {
        return x;
    }
    return Object.entries(x);
}

export class LazySeq {
    constructor(f) {
        this.name = 'LazySeq'
        this.f = f;
    }
    *[Symbol.iterator]() {
        yield* iterable(this.f());
    }
}

export function take(n, coll) {
    //console.log("[take]", coll)
    if (empty_Q(coll)) {
        return []
    }
    if (types._lazy_range_Q(coll)) {
        return range(0, n)
    }
    if (types._lazy_seq_Q(coll) || types._lazy_iterable_Q(coll)) {
        return lazy(function* () {
            let i = n - 1;
            for (const x of iterable(coll)) {
                if (i-- >= 0) {
                    yield x;
                }
                if (i < 0) {
                    return;
                }
            }
        });
    }
    if (types._iterate_Q(coll)) {
        for (let i = 0; i < n; i++) {
            coll.next()
        }
        return coll.realized.slice(0, -1)
    }
    if (types._cycle_Q(coll)) {
        const cycles = Math.floor(n / coll.coll.length)
        const mod = n % coll.coll.length
        let res = []
        for (let i = 0; i < cycles; i++) {
            res = res.concat(coll.coll)
        }
        if (mod != 0) {
            res = res.concat(coll.coll.slice(0, mod))
        }
        return res
    }
    return seq(coll).slice(0, n)
}

function drop(n, coll) {
    if (coll === null) {
        return []
    }
    if (empty_Q(coll)) {
        return []
    }
    return seq(coll).slice(n)
}

function repeat(n, x) {
    return Array(n).fill(x)
}



// lazy ranges
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#generator_functions
function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
    let iterationCount = 0;
    for (let i = start; i < end; i += step) {
        iterationCount++;
        yield i;
    }
    return iterationCount;
}

function range(start, end, step) {
    if (arguments.length === 0) {
        // uses above generator
        var iterator = makeRangeIterator()
        iterator.name = 'lazyRange'
        return iterator
    }
    if (step < 0) {
        var ans = [];
        for (let i = start; i > end; i += step) {
            ans.push(i);
        }
        return ans
    }
    if (!end) {
        if (start === 0) {
            return []
        }
        return range(0, start)
    }
    var ans = [];
    if (step) {
        for (let i = start; i < end; i += step) {
            ans.push(i);
        }
        return ans
    }
    for (let i = start; i < end; i++) {
        ans.push(i);
    }
    return ans;
}

export function iterate(f, x) {
    var current = x;
    return lazy(function* () {
        while (true) {
            yield current;
            current = f(current);
        }
    });
}

class Cycle {
    constructor(coll) {
        this.name = 'Cycle'
        this.coll = coll
    }
}

function cycle(coll) {
    return new Cycle(coll)
}

function mod(x, y) {
    return x % y
}


function sort(x) {
    if (types._string_Q(x)) {
        return x.split('').sort().join('');
    }
    if (types._list_Q(x)) {
        return x.sort(subtract)
    }
    if (types._hash_map_Q(x)) {
        return new Map(Array.from(x).sort(subtract))
    }
    if (types._set_Q(x)) {
        return new Set(Array.from(x).sort(subtract))
    } else {
        var v = x.sort(subtract)
        v.__isvector__ = true;
        return v;
    }
}

function makeComparator(f) {
    return function (x, y) {
        let r = f(x, y)
        if (types._number_Q(r)) {
            return r
        } else if (r) {
            return -1
        } else if (f(y, x)) {
            return 1
        } else {
            return 0
        }
    }
}

function sort_by() {
    if (arguments.length === 2) {
        var keyfn = arguments[0]
        var x = arguments[1]
        var comp = subtract
    }
    if (arguments.length === 3) {
        var keyfn = arguments[0]
        var comp = makeComparator(arguments[1])
        var x = arguments[2]
    }
    if (types._keyword_Q(keyfn)) {
        var comparator = (a, b) => comp(get(a, keyfn), get(b, keyfn))
    } else {
        var comparator = (a, b) => comp(keyfn(a), keyfn(b))
    }
    if (types._string_Q(x)) {
        return x.split('').sort(comparator).join('');
    }
    if (types._list_Q(x)) {
        return x.sort(comparator)
    }
    if (types._hash_map_Q(x)) {
        return new Map(Array.from(x).sort(comparator))
    }
    if (types._set_Q(x)) {
        return new Set(Array.from(x).sort(comparator))
    } else {
        var v = x.sort(comparator)
        v.__isvector__ = true;
        return v;
    }
}

function pop(lst) {
    if (types._list_Q(lst)) {
        return lst.slice(1);
    } else {
        var v = lst.slice(0, -1);
        v.__isvector__ = true;
        return v;
    }
}

function peek(lst) {
    if (types._list_Q(lst)) {
        return lst[0]
    } else {
        return lst[lst.length - 1]
    }
}

function upperCase(s) {
    return s.toUpperCase()
}

function isLetter(c) {
    return c.toLowerCase() != c.toUpperCase();
}

function lowerCase(s) {
    return s.toLowerCase()
}

function int_Q(x) {
    return Number.isInteger(x)
}

function _join(separator, coll) {
    if (!coll) {
        return separator.join('')
    }
    return coll.join(separator)
}

function _replace(s, match, replacement) {
    return s.replace(match, replacement)
}

function rand_int() {
    return Math.floor(Math.random() * arguments[0]);
}

function rand_nth() {
    const n = Math.floor(Math.random() * arguments[0].length)
    return arguments[0][n]
}

function _round(n) {
    return Math.round(n)
}

function _sqrt(n) {
    return Math.sqrt(n)
}

function _substring(s, start, end) {
    if (!end) {
        return s.substring(start, s.length)
    }
    return s.substring(start, end)
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function repeatedly(n, f) {
    let calls = []
    for (let i = 0; i < n; i++) {
        calls.push(f())
    }
    return calls
}

function _subvec(v, start, end) {
    return v.slice(start, end)
}

function _trim(s) {
    return s.trim()
}

// function to print env for debugging

function printEnv() {
    console.log(repl_env)
}

function _require(lib) {
    switch (lib) {
        case 'zip':
            evalString("(do " + zip + ")")
            break;
        case 'set':
            evalString("(do " + clj_set + ")")
            break;
        default:
            break;
    }
}

function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function spit_json(name, obj) {
    return downloadObjectAsJson(obj, name)
}

function map_indexed(f, coll) {
    let ret = [];
    let i = 0;
    for (const x of coll) {
        ret.push(f(i, x));
        i++;
    }
    return ret;
}

function _isNaN(n) {
    if (isNaN(n)) {
        return true
    } else {
        return false
    }
}

function _map(f, colls) {
    var map_fn = f
    var n = colls.length
    var r = [...Array(n).keys()]
    var loopKeys = r.map(x => types._symbol('s' + x))
    var loopVals = colls.map(x => seq(x))
    var bindings = r.flatMap((n) => {
        var v = loopVals[n]
        v.__isvector__ = true
        var b = [loopKeys[n], v]
        b.__isvector__ = true
        return b
    })
    var res = []
    res.__isvector__ = true
    bindings.push(types._symbol('res'), res)
    bindings.__isvector__ = true
    var pred = [types._symbol('or')]
        .concat(loopKeys.map(x => [types._symbol('empty?'), x]))
    var recur1 = [types._symbol('recur')]
        .concat(loopKeys.map(x => [types._symbol('rest'), x]))
    var recur2 = [types._symbol('conj'), types._symbol('res')]
    recur2.push([map_fn]
        .concat(loopKeys.map(x => [types._symbol('first'), x])))
    var recur = recur1.concat([recur2])
    var loop = [types._symbol('loop')]
    loop.push(bindings)
    loop.push([types._symbol('if'), pred,
    [types._symbol('apply'), types._symbol('list'), types._symbol('res')],
        recur])
    return EVAL(loop, repl_env)
}

var svgDiv = document.getElementById("svg_out")
svgDiv.setAttribute("width", "1000")
svgDiv.setAttribute("height", "1000")
var svgGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
svgDiv.appendChild(svgGroup);

function appendPath(d, color, x, y, scale) {
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    newElement.setAttribute("d", d)
    newElement.style.stroke = color || "black"
    newElement.style.strokeWidth = "1";
    newElement.style.fill = "lightgreen";
    if (scale) {
        newElement.setAttribute("transform", "translate(" + x.toString() + "," + y.toString() + ") scale(" + scale + ")")
    } else if (typeof x === 'number') {
        newElement.setAttribute("transform", "translate(" + x.toString() + "," + y.toString() + ")")
    }
    svgGroup.appendChild(newElement);
}

function clearSVG() {
    svgGroup.innerHTML = ""
}

let x = 1

export const ctx = new AudioContext();
const bufferSize = ctx.sampleRate * 1;
const noiseBuffer = new AudioBuffer({
    length: bufferSize,
    sampleRate: ctx.sampleRate,
});
const data = noiseBuffer.getChannelData(0)
var noise = []
for (let i = 0; i < bufferSize; i++) {
    x = feedback(x)
    noise.push(x)
}

for (let i = 0; i < bufferSize; i++) {
    data[i] = noise[i] / 32767 * 2 - 1;
}

function feedback(x) {
    var f = (x & 1) ^ (x >> 1 & 1)
    x = (f << 14) | (x >> 1)
    return x
}

const squareWave = [-1, 1]
// variable duty cycle, see https://www.nesdev.org/wiki/APU_Pulse
const pulse0 = [-1, -1, -1, -1, -1, -1, -1, 1]
const pulse1 = [-1, -1, -1, -1, -1, -1, 1, 1]
const pulse2 = [-1, -1, -1, -1, 1, 1, 1, 1]
const pulse3 = [1, 1, 1, 1, 1, 1, -1, -1]

function wave(wave, freq) {
    console.log("freq:", freq)
    const reps = Math.floor(ctx.sampleRate / wave.length / freq)
    console.log("reps:", reps)
    return wave.flatMap(x => repeat(reps, x))
}

function audioBuffer(vals) {
    const buffer = new AudioBuffer({
        length: vals.length,
        sampleRate: ctx.sampleRate,
    });
    const data = buffer.getChannelData(0);
    for (let i = 0; i < vals.length; i++) {
        data[i] = vals[i]
    }
    return buffer
}

function channelData(buffer, channel) {
    return buffer.getChannelData(channel)
}

function playBuffer(buffer, time) {
    ctx.resume()
    const noise = new AudioBufferSourceNode(ctx, {
        buffer: buffer,
    });
    noise.connect(ctx.destination);
    noise.start(ctx.currentTime + time || 0);
}

function sq(freq, dur) {
    return audioBuffer(wave(squareWave, freq), dur)
}

function triangleWave(time, period) {
    const f = Math.floor((time / period) + (1 / 2))
    const a = Math.abs(2 * (time / period - f))
    return (2 * a) - 1
}

function quantizeTri(sample) {
    let vals = [0.75, 0.625, 0.5, 0.375, 0.25, 0.125, 0, -0.125, -0.25, -0.375, -0.5, -0.625, -0.75, -0.875, -1, 0.875, 1]
    while (vals.length != 0) {
        if ((Math.abs(vals[0] - sample)) < 0.15) {
            return vals[0]
        } else {
            vals = vals.slice(1)
        }
    }
}

function tri(note, dur) {
    const freq = midiToFreq(note)
    let buf = []
    for (let i = 0; i < ctx.sampleRate * dur; i++) {
        var q = 0.8 * quantizeTri(triangleWave(1 / ctx.sampleRate * i, 1 / freq))
        if (i < 150) {
            buf.push(q / (500 / i))
        } else if (i > (ctx.sampleRate * dur) - 200) {
            buf.push(q / (500 / (ctx.sampleRate * dur - i)))
        } else {
            buf.push(q)
        }
    }
    return audioBuffer(buf)
}

function tri_seq(notes) {
    const lastNote = notes.reduce(
        (prev, current) => {
          return prev.get("ʞtime") > current.get("ʞtime") ? prev : current
        }
      );
    const bufferLength = Math.ceil(ctx.sampleRate * lastNote.get("ʞtime") + lastNote.get("ʞlength"))
    // initialize buffer of proper length filled with zeros
    let buf = Array(bufferLength).fill(0)
    // loop through notes
    for (let i = 0; i < notes.length; i++) {
        // loop through the note's samples
        const start = Math.floor(notes[i].get("ʞtime") * ctx.sampleRate)
         for (let j = 0; j < Math.ceil(notes[i].get("ʞlength") * ctx.sampleRate); j++) {
            const freq = midiToFreq(notes[i].get("ʞpitch"))
            const amplitude = 0.75 * quantizeTri(triangleWave(1 / ctx.sampleRate * j, 1 / freq))
            const duration = ctx.sampleRate * notes[i].get("ʞlength")
            if (j < 150) {
                buf[start+j] = amplitude / (500 / j)
            } else if (j > duration - 200) {
                buf[start+j] = amplitude / (500 / (duration - j))
            } else {
                buf[start+j] = amplitude
            }
        }
    }
    return audioBuffer(buf)
}

function drum_seq(notes) {
    const lastNote = notes.reduce(
        (prev, current) => {
          return prev.get("ʞtime") > current.get("ʞtime") ? prev : current
        }
      );
    const bufferLength = Math.ceil(ctx.sampleRate * lastNote.get("ʞtime") + lastNote.get("ʞlength"))
    // initialize buffer of proper length filled with zeros
    let buf = Array(bufferLength).fill(0)
    // loop through notes
    for (let i = 0; i < notes.length; i++) {
        // loop through the note's samples
        const start = Math.floor(notes[i].get("ʞtime") * ctx.sampleRate)
        const duration = Math.ceil(notes[i].get("ʞlength") * ctx.sampleRate)
         for (let j = 0; j < duration; j++) {
            x = feedback(x)
            var multiplier = 1 - (j * (1 / duration))
            buf[start+j] = multiplier * 0.25 * x / 32767 * 2
        }
    }
    return audioBuffer(buf)
}

function _noise(note, dur) {
    var bufferSize = ctx.sampleRate * dur;
    var noise = []
    for (let i = 0; i < bufferSize; i++) {
        x = feedback(x)
        noise.push(0.4 * x / 32767 * 2 - 1)
    }
    return audioBuffer(noise)
}

function fade(buf) {
    var data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
        var multiplier = 1 - (i * (1 / data.length))
        data[i] = data[i] * multiplier
    }
    return audioBuffer(data)
}

function _pulse0(note, dur) {
    const freq = midiToFreq(note)
    var bufferSize = ctx.sampleRate * dur;
    var buf = []
    for (let i = 0; i < bufferSize; i++) {
        buf.push(0.1 * pulse0[Math.floor(i / (1 / (freq / (ctx.sampleRate / 8)))) % 8])
    }
    return audioBuffer(buf)
}

function pulse0_seq(notes) {
    const lastNote = notes.reduce(
        (prev, current) => {
          return prev.get("ʞtime") > current.get("ʞtime") ? prev : current
        }
      );
    const bufferLength = Math.ceil(ctx.sampleRate * lastNote.get("ʞtime") + lastNote.get("ʞlength"))
    // initialize buffer of proper length filled with zeros
    let buf = Array(bufferLength).fill(0)
    // loop through notes
    for (let i = 0; i < notes.length; i++) {
        // loop through the note's samples
        const start = Math.floor(notes[i].get("ʞtime") * ctx.sampleRate)
         for (let j = 0; j < Math.ceil(notes[i].get("ʞlength") * ctx.sampleRate); j++) {
            const freq = midiToFreq(notes[i].get("ʞpitch"))
            const amplitude = 0.1 * pulse0[Math.floor(j / (1 / (freq / (ctx.sampleRate / 8)))) % 8]
            const duration = ctx.sampleRate * notes[i].get("ʞlength")
            if (j < 150) {
                buf[start+j] = amplitude / (500 / j)
            } else if (j > duration - 200) {
                buf[start+j] = amplitude / (500 / (duration - j))
            } else {
                buf[start+j] = amplitude
            }
        }
    }
    return audioBuffer(buf)
}

function _pulse1(note, dur) {
    const freq = midiToFreq(note)
    var bufferSize = ctx.sampleRate * dur;
    var buf = []
    for (let i = 0; i < bufferSize; i++) {
        buf.push(0.1 * pulse1[Math.floor(i / (1 / (freq / (ctx.sampleRate / 8)))) % 8])
    }
    return audioBuffer(buf)
}

function _pulse2(note, dur) {
    const freq = midiToFreq(note)
    var bufferSize = ctx.sampleRate * dur;
    var buf = []
    for (let i = 0; i < bufferSize; i++) {
        buf.push(0.1 * pulse2[Math.floor(i / (1 / (freq / (ctx.sampleRate / 8)))) % 8])
    }
    return audioBuffer(buf)
}

function pulse2_seq(notes) {
    const lastNote = notes.reduce(
        (prev, current) => {
          return prev.get("ʞtime") > current.get("ʞtime") ? prev : current
        }
      );
    const bufferLength = Math.ceil(ctx.sampleRate * lastNote.get("ʞtime") + lastNote.get("ʞlength"))
    // initialize buffer of proper length filled with zeros
    let buf = Array(bufferLength).fill(0)
    // loop through notes
    for (let i = 0; i < notes.length; i++) {
        // loop through the note's samples
        const start = Math.floor(notes[i].get("ʞtime") * ctx.sampleRate)
         for (let j = 0; j < Math.ceil(notes[i].get("ʞlength") * ctx.sampleRate); j++) {
            const freq = midiToFreq(notes[i].get("ʞpitch"))
            const amplitude = 0.1 * pulse2[Math.floor(j / (1 / (freq / (ctx.sampleRate / 8)))) % 8]
            const duration = ctx.sampleRate * notes[i].get("ʞlength")
            if (j < 150) {
                buf[start+j] = amplitude / (500 / j)
            } else if (j > duration - 200) {
                buf[start+j] = amplitude / (500 / (duration - j))
            } else {
                buf[start+j] = amplitude
            }
        }
    }
    return audioBuffer(buf)
}

function _pulse3(note, dur) {
    const freq = midiToFreq(note)
    var bufferSize = ctx.sampleRate * dur;
    var buf = []
    for (let i = 0; i < bufferSize; i++) {
        buf.push(0.1 * pulse3[Math.floor(i / (1 / (freq / (ctx.sampleRate / 8)))) % 8])
    }
    return audioBuffer(buf)
}

function addSemitone(rate) {
    return rate * Math.pow(2, 1 / 12)
}

function subSemitone(rate) {
    return rate * Math.pow(2, -1 / 12)
}

function incRate(semis) {
    return Array(semis).fill(1).reduce(addSemitone)
}

function decRate(semis) {
    return Array(semis).fill(1).reduce(subSemitone)
}

function pitchToRate(midiNum) {
    if (midiNum > 66) {
        return incRate(midiNum - 66)
    } else {
        return decRate(68 - midiNum)
    }
}

function midiToFreq(n) {
    return 440 * Math.pow(2, (n - 69) / 12)
}

function playBufferAt(buffer, pitch, time) {
    ctx.resume()
    const buf = new AudioBufferSourceNode(ctx, {
        buffer: buffer,
    });
    buf.playbackRate.setValueAtTime(pitchToRate(pitch), ctx.currentTime)
    buf.connect(ctx.destination);
    buf.start(time);
}

function make_download(name, abuffer) {
    var new_file = URL.createObjectURL(bufferToWave(abuffer, abuffer.length));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", new_file);
    downloadAnchorNode.setAttribute("download", name);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Convert an AudioBuffer to a Blob using WAVE representation
function bufferToWave(abuffer, len) {
    console.log("calling bufferToWave")
    var numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        offset = 0,
        pos = 0;
    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {             // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true);          // write 16-bit sample
            pos += 2;
        }
        offset++                                     // next source sample
    }
    // create Blob
    return new Blob([buffer], { type: "audio/wav" });

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
}

var mapTiles = "M430 25 450 15 470 25 450 35 430 25M410 35 430 25 450 35 430 45 410 35M390 45 410 35 430 45 410 55 390 45M370 55 390 45 410 55 390 65 370 55M350 65 370 55 390 65 370 75 350 65M330 75 350 65 370 75 350 85 330 75M310 85 330 75 350 85 330 95 310 85M290 95 310 85 330 95 310 105 290 95M270 105 290 95 310 105 290 115 270 105M250 115 270 105 290 115 270 125 250 115M230 125 250 115 270 125 250 135 230 125M210 135 230 125 250 135 230 145 210 135M190 145 210 135 230 145 210 155 190 145M170 155 190 145 210 155 190 165 170 155M150 165 170 155 190 165 170 175 150 165M130 175 150 165 170 175 150 185 130 175M110 185 130 175 150 185 130 195 110 185M90 195 110 185 130 195 110 205 90 195M70 205 90 195 110 205 90 215 70 205M50 215 70 205 90 215 70 225 50 215M30 225 50 215 70 225 50 235 30 225M10 235 30 225 50 235 30 245 10 235M450 35 470 25 490 35 470 45 450 35M430 45 450 35 470 45 450 55 430 45M410 55 430 45 450 55 430 65 410 55M390 65 410 55 430 65 410 75 390 65M370 75 390 65 410 75 390 85 370 75M350 85 370 75 390 85 370 95 350 85M330 95 350 85 370 95 350 105 330 95M310 105 330 95 350 105 330 115 310 105M290 115 310 105 330 115 310 125 290 115M270 125 290 115 310 125 290 135 270 125M250 135 270 125 290 135 270 145 250 135M230 145 250 135 270 145 250 155 230 145M210 155 230 145 250 155 230 165 210 155M190 165 210 155 230 165 210 175 190 165M170 175 190 165 210 175 190 185 170 175M150 185 170 175 190 185 170 195 150 185M130 195 150 185 170 195 150 205 130 195M110 205 130 195 150 205 130 215 110 205M90 215 110 205 130 215 110 225 90 215M70 225 90 215 110 225 90 235 70 225M50 235 70 225 90 235 70 245 50 235M30 245 50 235 70 245 50 255 30 245M470 45 490 35 510 45 490 55 470 45M450 55 470 45 490 55 470 65 450 55M430 65 450 55 470 65 450 75 430 65M410 75 430 65 450 75 430 85 410 75M390 85 410 75 430 85 410 95 390 85M370 95 390 85 410 95 390 105 370 95M350 105 370 95 390 105 370 115 350 105M330 115 350 105 370 115 350 125 330 115M310 125 330 115 350 125 330 135 310 125M290 135 310 125 330 135 310 145 290 135M270 145 290 135 310 145 290 155 270 145M250 155 270 145 290 155 270 165 250 155M230 165 250 155 270 165 250 175 230 165M210 175 230 165 250 175 230 185 210 175M190 185 210 175 230 185 210 195 190 185M170 195 190 185 210 195 190 205 170 195M150 205 170 195 190 205 170 215 150 205M130 215 150 205 170 215 150 225 130 215M110 225 130 215 150 225 130 235 110 225M90 235 110 225 130 235 110 245 90 235M70 245 90 235 110 245 90 255 70 245M50 255 70 245 90 255 70 265 50 255M490 55 510 45 530 55 510 65 490 55M470 65 490 55 510 65 490 75 470 65M450 75 470 65 490 75 470 85 450 75M430 85 450 75 470 85 450 95 430 85M410 95 430 85 450 95 430 105 410 95M390 105 410 95 430 105 410 115 390 105M370 115 390 105 410 115 390 125 370 115M350 125 370 115 390 125 370 135 350 125M330 135 350 125 370 135 350 145 330 135M310 145 330 135 350 145 330 155 310 145M290 155 310 145 330 155 310 165 290 155M270 165 290 155 310 165 290 175 270 165M250 175 270 165 290 175 270 185 250 175M230 185 250 175 270 185 250 195 230 185M210 195 230 185 250 195 230 205 210 195M190 205 210 195 230 205 210 215 190 205M170 215 190 205 210 215 190 225 170 215M150 225 170 215 190 225 170 235 150 225M130 235 150 225 170 235 150 245 130 235M110 245 130 235 150 245 130 255 110 245M90 255 110 245 130 255 110 265 90 255M70 265 90 255 110 265 90 275 70 265M510 65 530 55 550 65 530 75 510 65M490 75 510 65 530 75 510 85 490 75M470 85 490 75 510 85 490 95 470 85M450 95 470 85 490 95 470 105 450 95M430 105 450 95 470 105 450 115 430 105M410 115 430 105 450 115 430 125 410 115M390 125 410 115 430 125 410 135 390 125M370 135 390 125 410 135 390 145 370 135M350 145 370 135 390 145 370 155 350 145M330 155 350 145 370 155 350 165 330 155M310 165 330 155 350 165 330 175 310 165M290 175 310 165 330 175 310 185 290 175M270 185 290 175 310 185 290 195 270 185M250 195 270 185 290 195 270 205 250 195M230 205 250 195 270 205 250 215 230 205M210 215 230 205 250 215 230 225 210 215M190 225 210 215 230 225 210 235 190 225M170 235 190 225 210 235 190 245 170 235M150 245 170 235 190 245 170 255 150 245M130 255 150 245 170 255 150 265 130 255M110 265 130 255 150 265 130 275 110 265M90 275 110 265 130 275 110 285 90 275M530 75 550 65 570 75 550 85 530 75M510 85 530 75 550 85 530 95 510 85M490 95 510 85 530 95 510 105 490 95M470 105 490 95 510 105 490 115 470 105M450 115 470 105 490 115 470 125 450 115M430 125 450 115 470 125 450 135 430 125M410 135 430 125 450 135 430 145 410 135M390 145 410 135 430 145 410 155 390 145M370 155 390 145 410 155 390 165 370 155M350 165 370 155 390 165 370 175 350 165M330 175 350 165 370 175 350 185 330 175M310 185 330 175 350 185 330 195 310 185M290 195 310 185 330 195 310 205 290 195M270 205 290 195 310 205 290 215 270 205M250 215 270 205 290 215 270 225 250 215M230 225 250 215 270 225 250 235 230 225M210 235 230 225 250 235 230 245 210 235M190 245 210 235 230 245 210 255 190 245M170 255 190 245 210 255 190 265 170 255M150 265 170 255 190 265 170 275 150 265M130 275 150 265 170 275 150 285 130 275M110 285 130 275 150 285 130 295 110 285M550 85 570 75 590 85 570 95 550 85M530 95 550 85 570 95 550 105 530 95M510 105 530 95 550 105 530 115 510 105M490 115 510 105 530 115 510 125 490 115M470 125 490 115 510 125 490 135 470 125M450 135 470 125 490 135 470 145 450 135M430 145 450 135 470 145 450 155 430 145M410 155 430 145 450 155 430 165 410 155M390 165 410 155 430 165 410 175 390 165M370 175 390 165 410 175 390 185 370 175M350 185 370 175 390 185 370 195 350 185M330 195 350 185 370 195 350 205 330 195M310 205 330 195 350 205 330 215 310 205M290 215 310 205 330 215 310 225 290 215M270 225 290 215 310 225 290 235 270 225M250 235 270 225 290 235 270 245 250 235M230 245 250 235 270 245 250 255 230 245M210 255 230 245 250 255 230 265 210 255M190 265 210 255 230 265 210 275 190 265M170 275 190 265 210 275 190 285 170 275M150 285 170 275 190 285 170 295 150 285M130 295 150 285 170 295 150 305 130 295M570 95 590 85 610 95 590 105 570 95M550 105 570 95 590 105 570 115 550 105M530 115 550 105 570 115 550 125 530 115M510 125 530 115 550 125 530 135 510 125M490 135 510 125 530 135 510 145 490 135M470 145 490 135 510 145 490 155 470 145M450 155 470 145 490 155 470 165 450 155M430 165 450 155 470 165 450 175 430 165M410 175 430 165 450 175 430 185 410 175M390 185 410 175 430 185 410 195 390 185M370 195 390 185 410 195 390 205 370 195M350 205 370 195 390 205 370 215 350 205M330 215 350 205 370 215 350 225 330 215M310 225 330 215 350 225 330 235 310 225M290 235 310 225 330 235 310 245 290 235M270 245 290 235 310 245 290 255 270 245M250 255 270 245 290 255 270 265 250 255M230 265 250 255 270 265 250 275 230 265M210 275 230 265 250 275 230 285 210 275M190 285 210 275 230 285 210 295 190 285M170 295 190 285 210 295 190 305 170 295M150 305 170 295 190 305 170 315 150 305M590 105 610 95 630 105 610 115 590 105M570 115 590 105 610 115 590 125 570 115M550 125 570 115 590 125 570 135 550 125M530 135 550 125 570 135 550 145 530 135M510 145 530 135 550 145 530 155 510 145M490 155 510 145 530 155 510 165 490 155M470 165 490 155 510 165 490 175 470 165M450 175 470 165 490 175 470 185 450 175M430 185 450 175 470 185 450 195 430 185M410 195 430 185 450 195 430 205 410 195M390 205 410 195 430 205 410 215 390 205M370 215 390 205 410 215 390 225 370 215M350 225 370 215 390 225 370 235 350 225M330 235 350 225 370 235 350 245 330 235M310 245 330 235 350 245 330 255 310 245M290 255 310 245 330 255 310 265 290 255M270 265 290 255 310 265 290 275 270 265M250 275 270 265 290 275 270 285 250 275M230 285 250 275 270 285 250 295 230 285M210 295 230 285 250 295 230 305 210 295M190 305 210 295 230 305 210 315 190 305M170 315 190 305 210 315 190 325 170 315M610 115 630 105 650 115 630 125 610 115M590 125 610 115 630 125 610 135 590 125M570 135 590 125 610 135 590 145 570 135M550 145 570 135 590 145 570 155 550 145M530 155 550 145 570 155 550 165 530 155M510 165 530 155 550 165 530 175 510 165M490 175 510 165 530 175 510 185 490 175M470 185 490 175 510 185 490 195 470 185M450 195 470 185 490 195 470 205 450 195M430 205 450 195 470 205 450 215 430 205M410 215 430 205 450 215 430 225 410 215M390 225 410 215 430 225 410 235 390 225M370 235 390 225 410 235 390 245 370 235M350 245 370 235 390 245 370 255 350 245M330 255 350 245 370 255 350 265 330 255M310 265 330 255 350 265 330 275 310 265M290 275 310 265 330 275 310 285 290 275M270 285 290 275 310 285 290 295 270 285M250 295 270 285 290 295 270 305 250 295M230 305 250 295 270 305 250 315 230 305M210 315 230 305 250 315 230 325 210 315M190 325 210 315 230 325 210 335 190 325M630 125 650 115 670 125 650 135 630 125M610 135 630 125 650 135 630 145 610 135M590 145 610 135 630 145 610 155 590 145M570 155 590 145 610 155 590 165 570 155M550 165 570 155 590 165 570 175 550 165M530 175 550 165 570 175 550 185 530 175M510 185 530 175 550 185 530 195 510 185M490 195 510 185 530 195 510 205 490 195M470 205 490 195 510 205 490 215 470 205M450 215 470 205 490 215 470 225 450 215M430 225 450 215 470 225 450 235 430 225M410 235 430 225 450 235 430 245 410 235M390 245 410 235 430 245 410 255 390 245M370 255 390 245 410 255 390 265 370 255M350 265 370 255 390 265 370 275 350 265M330 275 350 265 370 275 350 285 330 275M310 285 330 275 350 285 330 295 310 285M290 295 310 285 330 295 310 305 290 295M270 305 290 295 310 305 290 315 270 305M250 315 270 305 290 315 270 325 250 315M230 325 250 315 270 325 250 335 230 325M210 335 230 325 250 335 230 345 210 335M650 135 670 125 690 135 670 145 650 135M630 145 650 135 670 145 650 155 630 145M610 155 630 145 650 155 630 165 610 155M590 165 610 155 630 165 610 175 590 165M570 175 590 165 610 175 590 185 570 175M550 185 570 175 590 185 570 195 550 185M530 195 550 185 570 195 550 205 530 195M510 205 530 195 550 205 530 215 510 205M490 215 510 205 530 215 510 225 490 215M470 225 490 215 510 225 490 235 470 225M450 235 470 225 490 235 470 245 450 235M430 245 450 235 470 245 450 255 430 245M410 255 430 245 450 255 430 265 410 255M390 265 410 255 430 265 410 275 390 265M370 275 390 265 410 275 390 285 370 275M350 285 370 275 390 285 370 295 350 285M330 295 350 285 370 295 350 305 330 295M310 305 330 295 350 305 330 315 310 305M290 315 310 305 330 315 310 325 290 315M270 325 290 315 310 325 290 335 270 325M250 335 270 325 290 335 270 345 250 335M230 345 250 335 270 345 250 355 230 345M670 145 690 135 710 145 690 155 670 145M650 155 670 145 690 155 670 165 650 155M630 165 650 155 670 165 650 175 630 165M610 175 630 165 650 175 630 185 610 175M590 185 610 175 630 185 610 195 590 185M570 195 590 185 610 195 590 205 570 195M550 205 570 195 590 205 570 215 550 205M530 215 550 205 570 215 550 225 530 215M510 225 530 215 550 225 530 235 510 225M490 235 510 225 530 235 510 245 490 235M470 245 490 235 510 245 490 255 470 245M450 255 470 245 490 255 470 265 450 255M430 265 450 255 470 265 450 275 430 265M410 275 430 265 450 275 430 285 410 275M390 285 410 275 430 285 410 295 390 285M370 295 390 285 410 295 390 305 370 295M350 305 370 295 390 305 370 315 350 305M330 315 350 305 370 315 350 325 330 315M310 325 330 315 350 325 330 335 310 325M290 335 310 325 330 335 310 345 290 335M270 345 290 335 310 345 290 355 270 345M250 355 270 345 290 355 270 365 250 355M690 155 710 145 730 155 710 165 690 155M670 165 690 155 710 165 690 175 670 165M650 175 670 165 690 175 670 185 650 175M630 185 650 175 670 185 650 195 630 185M610 195 630 185 650 195 630 205 610 195M590 205 610 195 630 205 610 215 590 205M570 215 590 205 610 215 590 225 570 215M550 225 570 215 590 225 570 235 550 225M530 235 550 225 570 235 550 245 530 235M510 245 530 235 550 245 530 255 510 245M490 255 510 245 530 255 510 265 490 255M470 265 490 255 510 265 490 275 470 265M450 275 470 265 490 275 470 285 450 275M430 285 450 275 470 285 450 295 430 285M410 295 430 285 450 295 430 305 410 295M390 305 410 295 430 305 410 315 390 305M370 315 390 305 410 315 390 325 370 315M350 325 370 315 390 325 370 335 350 325M330 335 350 325 370 335 350 345 330 335M310 345 330 335 350 345 330 355 310 345M290 355 310 345 330 355 310 365 290 355M270 365 290 355 310 365 290 375 270 365M710 165 730 155 750 165 730 175 710 165M690 175 710 165 730 175 710 185 690 175M670 185 690 175 710 185 690 195 670 185M650 195 670 185 690 195 670 205 650 195M630 205 650 195 670 205 650 215 630 205M610 215 630 205 650 215 630 225 610 215M590 225 610 215 630 225 610 235 590 225M570 235 590 225 610 235 590 245 570 235M550 245 570 235 590 245 570 255 550 245M530 255 550 245 570 255 550 265 530 255M510 265 530 255 550 265 530 275 510 265M490 275 510 265 530 275 510 285 490 275M470 285 490 275 510 285 490 295 470 285M450 295 470 285 490 295 470 305 450 295M430 305 450 295 470 305 450 315 430 305M410 315 430 305 450 315 430 325 410 315M390 325 410 315 430 325 410 335 390 325M370 335 390 325 410 335 390 345 370 335M350 345 370 335 390 345 370 355 350 345M330 355 350 345 370 355 350 365 330 355M310 365 330 355 350 365 330 375 310 365M290 375 310 365 330 375 310 385 290 375M730 175 750 165 770 175 750 185 730 175M710 185 730 175 750 185 730 195 710 185M690 195 710 185 730 195 710 205 690 195M670 205 690 195 710 205 690 215 670 205M650 215 670 205 690 215 670 225 650 215M630 225 650 215 670 225 650 235 630 225M610 235 630 225 650 235 630 245 610 235M590 245 610 235 630 245 610 255 590 245M570 255 590 245 610 255 590 265 570 255M550 265 570 255 590 265 570 275 550 265M530 275 550 265 570 275 550 285 530 275M510 285 530 275 550 285 530 295 510 285M490 295 510 285 530 295 510 305 490 295M470 305 490 295 510 305 490 315 470 305M450 315 470 305 490 315 470 325 450 315M430 325 450 315 470 325 450 335 430 325M410 335 430 325 450 335 430 345 410 335M390 345 410 335 430 345 410 355 390 345M370 355 390 345 410 355 390 365 370 355M350 365 370 355 390 365 370 375 350 365M330 375 350 365 370 375 350 385 330 375M310 385 330 375 350 385 330 395 310 385M750 185 770 175 790 185 770 195 750 185M730 195 750 185 770 195 750 205 730 195M710 205 730 195 750 205 730 215 710 205M690 215 710 205 730 215 710 225 690 215M670 225 690 215 710 225 690 235 670 225M650 235 670 225 690 235 670 245 650 235M630 245 650 235 670 245 650 255 630 245M610 255 630 245 650 255 630 265 610 255M590 265 610 255 630 265 610 275 590 265M570 275 590 265 610 275 590 285 570 275M550 285 570 275 590 285 570 295 550 285M530 295 550 285 570 295 550 305 530 295M510 305 530 295 550 305 530 315 510 305M490 315 510 305 530 315 510 325 490 315M470 325 490 315 510 325 490 335 470 325M450 335 470 325 490 335 470 345 450 335M430 345 450 335 470 345 450 355 430 345M410 355 430 345 450 355 430 365 410 355M390 365 410 355 430 365 410 375 390 365M370 375 390 365 410 375 390 385 370 375M350 385 370 375 390 385 370 395 350 385M330 395 350 385 370 395 350 405 330 395M770 195 790 185 810 195 790 205 770 195M750 205 770 195 790 205 770 215 750 205M730 215 750 205 770 215 750 225 730 215M710 225 730 215 750 225 730 235 710 225M690 235 710 225 730 235 710 245 690 235M670 245 690 235 710 245 690 255 670 245M650 255 670 245 690 255 670 265 650 255M630 265 650 255 670 265 650 275 630 265M610 275 630 265 650 275 630 285 610 275M590 285 610 275 630 285 610 295 590 285M570 295 590 285 610 295 590 305 570 295M550 305 570 295 590 305 570 315 550 305M530 315 550 305 570 315 550 325 530 315M510 325 530 315 550 325 530 335 510 325M490 335 510 325 530 335 510 345 490 335M470 345 490 335 510 345 490 355 470 345M450 355 470 345 490 355 470 365 450 355M430 365 450 355 470 365 450 375 430 365M410 375 430 365 450 375 430 385 410 375M390 385 410 375 430 385 410 395 390 385M370 395 390 385 410 395 390 405 370 395M350 405 370 395 390 405 370 415 350 405M790 205 810 195 830 205 810 215 790 205M770 215 790 205 810 215 790 225 770 215M750 225 770 215 790 225 770 235 750 225M730 235 750 225 770 235 750 245 730 235M710 245 730 235 750 245 730 255 710 245M690 255 710 245 730 255 710 265 690 255M670 265 690 255 710 265 690 275 670 265M650 275 670 265 690 275 670 285 650 275M630 285 650 275 670 285 650 295 630 285M610 295 630 285 650 295 630 305 610 295M590 305 610 295 630 305 610 315 590 305M570 315 590 305 610 315 590 325 570 315M550 325 570 315 590 325 570 335 550 325M530 335 550 325 570 335 550 345 530 335M510 345 530 335 550 345 530 355 510 345M490 355 510 345 530 355 510 365 490 355M470 365 490 355 510 365 490 375 470 365M450 375 470 365 490 375 470 385 450 375M430 385 450 375 470 385 450 395 430 385M410 395 430 385 450 395 430 405 410 395M390 405 410 395 430 405 410 415 390 405M370 415 390 405 410 415 390 425 370 415M810 215 830 205 850 215 830 225 810 215M790 225 810 215 830 225 810 235 790 225M770 235 790 225 810 235 790 245 770 235M750 245 770 235 790 245 770 255 750 245M730 255 750 245 770 255 750 265 730 255M710 265 730 255 750 265 730 275 710 265M690 275 710 265 730 275 710 285 690 275M670 285 690 275 710 285 690 295 670 285M650 295 670 285 690 295 670 305 650 295M630 305 650 295 670 305 650 315 630 305M610 315 630 305 650 315 630 325 610 315M590 325 610 315 630 325 610 335 590 325M570 335 590 325 610 335 590 345 570 335M550 345 570 335 590 345 570 355 550 345M530 355 550 345 570 355 550 365 530 355M510 365 530 355 550 365 530 375 510 365M490 375 510 365 530 375 510 385 490 375M470 385 490 375 510 385 490 395 470 385M450 395 470 385 490 395 470 405 450 395M430 405 450 395 470 405 450 415 430 405M410 415 430 405 450 415 430 425 410 415M390 425 410 415 430 425 410 435 390 425M830 225 850 215 870 225 850 235 830 225M810 235 830 225 850 235 830 245 810 235M790 245 810 235 830 245 810 255 790 245M770 255 790 245 810 255 790 265 770 255M750 265 770 255 790 265 770 275 750 265M730 275 750 265 770 275 750 285 730 275M710 285 730 275 750 285 730 295 710 285M690 295 710 285 730 295 710 305 690 295M670 305 690 295 710 305 690 315 670 305M650 315 670 305 690 315 670 325 650 315M630 325 650 315 670 325 650 335 630 325M610 335 630 325 650 335 630 345 610 335M590 345 610 335 630 345 610 355 590 345M570 355 590 345 610 355 590 365 570 355M550 365 570 355 590 365 570 375 550 365M530 375 550 365 570 375 550 385 530 375M510 385 530 375 550 385 530 395 510 385M490 395 510 385 530 395 510 405 490 395M470 405 490 395 510 405 490 415 470 405M450 415 470 405 490 415 470 425 450 415M430 425 450 415 470 425 450 435 430 425M410 435 430 425 450 435 430 445 410 435M850 235 870 225 890 235 870 245 850 235M830 245 850 235 870 245 850 255 830 245M810 255 830 245 850 255 830 265 810 255M790 265 810 255 830 265 810 275 790 265M770 275 790 265 810 275 790 285 770 275M750 285 770 275 790 285 770 295 750 285M730 295 750 285 770 295 750 305 730 295M710 305 730 295 750 305 730 315 710 305M690 315 710 305 730 315 710 325 690 315M670 325 690 315 710 325 690 335 670 325M650 335 670 325 690 335 670 345 650 335M630 345 650 335 670 345 650 355 630 345M610 355 630 345 650 355 630 365 610 355M590 365 610 355 630 365 610 375 590 365M570 375 590 365 610 375 590 385 570 375M550 385 570 375 590 385 570 395 550 385M530 395 550 385 570 395 550 405 530 395M510 405 530 395 550 405 530 415 510 405M490 415 510 405 530 415 510 425 490 415M470 425 490 415 510 425 490 435 470 425M450 435 470 425 490 435 470 445 450 435M430 445 450 435 470 445 450 455 430 445"

function mix(buffers) {
    // make new buffer the length of longest buffer
    const len = Math.max(...buffers.map(buf => buf.length))
    const data = [...buffers.map(buf => buf.getChannelData(0))]
    let buf = []
    for (let i = 0; i < len; i++) {
        // loop through index of each buffer and add them up
        let amplitude = 0
        for (let j = 0; j < data.length; j++) {
            if (data[j].length >= i) {
                amplitude += data[j][i]
            }
        }
        buf.push(amplitude)
    }
    return audioBuffer(buf)
}

// types.ns is namespace of type functions
export var ns = {
    'env': printEnv,
    'map-tiles': mapTiles,
    'fade': fade,
    'noise': _noise,
    'pulse0': _pulse0,
    'pulse1': _pulse1,
    'pulse2': _pulse2,
    'pulse3': _pulse3,
    'play': playBuffer,
    'mix': mix,
    'sq': sq,
    'tri': tri,
    'tri-seq': tri_seq,
    'drum-seq': drum_seq,
    'pulse0-seq': pulse0_seq,
    'pulse2-seq': pulse2_seq,
    'sample-rate': ctx.sampleRate,
    'channel-data': channelData,
    'pitch->rate': pitchToRate,
    'midi->freq': midiToFreq,
    'current-time': ctx.currentTime,
    'ctx-state': ctx.state,
    'audio-buffer': audioBuffer,
    'spit-wav': make_download,
    'append-path': appendPath,
    'clear-svg': clearSVG,
    'console-print': consolePrint,
    '_map': _map,
    'print': _print,
    'Integer/parseInt': parseInt,
    'js/parseInt': parseInt,
    'js/Number.POSITIVE_INFINITY': Number.POSITIVE_INFINITY,
    'js/Number.NEGATIVE_INFINITY': Number.NEGATIVE_INFINITY,
    'nan?': _isNaN,
    'pr': _pr,
    'spit-json': spit_json,
    'LazySeq': LazySeq,
    'lazy-cons': lazyCons,
    'require': _require,
    'type': types._obj_type,
    '=': types.allEqual,
    '==': types.allEqual,
    'throw': mal_throw,
    'nil?': types._nil_Q,
    'true?': types._true_Q,
    'is': _is,
    'false?': types._false_Q,
    'ratio?': types._ratio_Q,
    'number?': types._number_Q,
    'string?': types._string_Q,
    'symbol': types._symbol,
    'symbol?': types._symbol_Q,
    'set?': types._set_Q,
    'keyword': types._keyword,
    'keyword?': types._keyword_Q,
    'map-entry?': types._mapEntry_Q,
    're-matches': re_matches,
    're-find': re_find,
    'fn?': types._fn_Q,
    'macro?': types._macro_Q,
    'char': char,
    'int?': int_Q,
    'repeatedly': repeatedly,
    'rand-int': rand_int,
    'rand-nth': rand_nth,
    'Math/round': _round,
    'Math/sqrt': _sqrt,
    'Math/pow': _pow,
    'Math/abs': _abs,
    'abs': _abs,
    'Integer/toBinaryString': dec2bin,
    'str/trim': _trim,
    'cycle': cycle,
    'str/split': split,
    're-pattern': re_pattern,
    'double': double,
    'pr-str': pr_str,
    'str': str,
    'prn': prn,
    'println': println,
    //'readline': readline.readline,
    'read-string': read_str,
    'slurp': slurp,
    'lt': function (a, b) { return a < b; },
    'lte': function (a, b) { return a <= b; },
    'gt': function (a, b) { return a > b; },
    'gte': function (a, b) { return a >= b; },
    '+': sum,
    '-': subtract,
    '*': product,
    '/': divide,
    'inc': function (a) { return a + 1; },
    "time-ms": time_ms,
    'max': max,
    'min': min,
    'range': range,
    'sort': sort,
    'peek': peek,
    'pop': pop,
    'lower-case': lowerCase,
    'upper-case': upperCase,
    'str/lower-case': lowerCase,
    'str/upper-case': upperCase,
    //'isletter': isLetter,
    'subs': _substring,
    'subvec': _subvec,
    'map-indexed': map_indexed,
    'list': types._list,
    'list?': types._list_Q,
    'vector': types._vector,
    'vector?': types._vector_Q,
    'hash-map': types._hash_map,
    'map?': types._hash_map_Q,
    'assoc': assoc,
    'dissoc': dissoc,
    'get': get,
    're-seq': re_seq,
    'contains?': contains_Q,
    'keys': keys,
    'vals': vals,
    'int': int,
    //'mod': mod,
    'rem': mod,
    'iterate': iterate,
    'walk': types.walk,
    'sort-by': sort_by,
    'sequential?': types._sequential_Q,
    'cons': cons,
    'concat': concat,
    'vec': vec,
    'nth': nth,
    'first': first,
    'second': second,
    'rest': rest,
    'last': last,
    'take': take,
    'drop': drop,
    'empty?': empty_Q,
    'count': count,
    'apply*': apply,
    //'map': map,
    'repeat': repeat,
    'join': _join,
    'str/join': _join,
    'str/replace': _replace,

    'conj': conj,
    'seq': seq,
    'filter': filter,

    'with-meta': with_meta,
    'meta': meta,
    'atom': types._atom,
    'atom?': types._atom_Q,
    "deref": deref,
    "reset!": reset_BANG,
    "swap!": swap_BANG,

    'js-eval': js_eval,
    '.': js_method_call,

    'set': toSet,
    'disj': _disj,
    'set/union': _union,
    'set/intersection': _intersection,
    'set/symmetric-difference': symmetricDifference,
    'set/difference': _difference
};
