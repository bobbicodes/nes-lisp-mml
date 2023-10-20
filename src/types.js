//import { Fraction } from 'fraction.js'
import { PRINT, READ } from './interpreter.js'
import { contains_Q, get, iterable } from './core.js'

export function _obj_type(obj) {
    //console.log("[obj_type]", obj)
    //console.log("obj_type:", typeof obj)
    if (_symbol_Q(obj)) { return 'symbol'; }
    else if (_hash_map_Q(obj)) { return 'hash-map'; }
    else if (_list_Q(obj)) { return 'list'; }
    else if (_vector_Q(obj)) { return 'vector'; }
    //else if (_ratio_Q(obj)) { return 'ratio'; }
    else if (_lazy_range_Q(obj)) { return 'lazy-range'; }
    else if (_lazy_iterable_Q(obj)) { return 'lazy-iterable'; }
    else if (_lazy_seq_Q(obj)) { return 'lazy-seq'; }
    else if (_iterate_Q(obj)) { return 'iterate'; }
    else if (_cycle_Q(obj)) { return 'cycle'; }
    else if (_function_Q(obj)) { return 'function'; }
    else if (_set_Q(obj)) { return 'set'; }
    else if (_nil_Q(obj)) { return 'nil'; }
    else if (_regex_Q(obj)) { return 'regex'; }
    else if (_true_Q(obj)) { return 'true'; }
    else if (_false_Q(obj)) { return 'false'; }
    else if (_atom_Q(obj)) { return 'atom'; }
    else {
        switch (typeof (obj)) {
            case 'number': return 'number';
            case 'function': return 'function';
            case 'object': return 'object';
            case 'string': return obj[0] == '\u029e' ? 'keyword' : 'string';
            default: throw new Error("Unknown type '" + typeof (obj) + "'");
        }
    }
}

export function _iterate_Q(x) {
    if (x === null) {
        return false
    }
    if (typeof (x) === "object") {
        return Object.hasOwn(x, 'name') && x.name === 'Iterate'
    }
    return false
}

export function _cycle_Q(x) {
    if (x === null) {
        return false
    }
    if (typeof (x) === "object") {
        return Object.hasOwn(x, 'name') && x.name === 'Cycle'
    }
    return false
}

export function _lazy_range_Q(x) {
    if (x === null) {
        return false
    }
    if (typeof (x) === "object") {
        return Object.hasOwn(x, 'name') && x.name === 'lazyRange'
    }
    return false
}

export function _lazy_iterable_Q(x) {
    if (x === null) {
        return false
    }
    if (typeof (x) === "object") {
        return Object.hasOwn(x, 'name') && x.name === 'LazyIterable'
    }
    return false
}

export function _lazy_seq_Q(x) {
    if (x === null) {
        return false
    }
    if (typeof (x) === "object") {
        return Object.hasOwn(x, 'name') && x.name === 'LazySeq'
    }
    return false
}

export function _sequential_Q(lst) { return _list_Q(lst) || _vector_Q(lst); }

export function _equal_Q(a, b) {
    //console.log("comparing", a, "and", b)
    var ota = _obj_type(a), otb = _obj_type(b);
    if (!(ota === otb || (_sequential_Q(a) && _sequential_Q(b)))) {
        return false;
    }
    switch (ota) {
        case 'symbol': return a.value === b.value;
        case 'set':
            return a.size === b.size && [...a].every((x) => {
                for (const item of b) {
                    if (_equal_Q(item, x)) {
                        return true
                    }
                }
                return false
            });
        case 'list':
        case 'vector':
            //case 'set':
            //console.log("comparing", a, "and", b)
            if (a.length !== b.length) { return false; }
            for (var i = 0; i < a.length; i++) {
                if (!_equal_Q(a[i], b[i])) { return false; }
            }
            return true;
        case 'hash-map':
            if (a.size !== b.size) { return false; }
            for (var [key, value] of a) {
                if (!contains_Q(b, key)) { return false; }
                if (!_equal_Q(get(a, key), get(b, key))) { return false; }
            }
            return true;
        case 'ratio': return a.equals(b);
        default:
            return a === b;
    }
}

export function allEqual() {
    const args = Array.from(arguments)
    return args.every(v => _equal_Q(v, args[0]))
}

export function _clone(obj) {
    //console.log("cloning", obj)
    var new_obj;
    switch (_obj_type(obj)) {
        case 'list':
            new_obj = obj.slice(0);
            break;
        case 'vector':
            new_obj = obj.slice(0);
            new_obj.__isvector__ = true;
            break;
        case 'hash-map':
            new_obj = new Map(obj);
            break;
        case 'function':
            new_obj = obj.clone();
            break;
        case 'lazy-iterable':
            new_obj = iterable(obj)
            break;
        case 'set':
            new_obj = new Set(obj);
            break;
        case 'symbol':
            new_obj = _symbol(obj.value)
            break;
        default:
            throw new Error("clone of non-collection: " + _obj_type(obj));
    }
    Object.defineProperty(new_obj, "__meta__", {
        enumerable: false,
        writable: true
    });
    return new_obj;
}


// Scalars
export function _nil_Q(a) { return a === null ? true : false; }
export function _true_Q(a) { return a === true ? true : false; }
export function _false_Q(a) { return a === false ? true : false; }
export function _number_Q(obj) { return typeof obj === 'number'; }
export function _string_Q(obj) {
    return typeof obj === 'string' && obj[0] !== '\u029e';
}


// Symbols
function Symbol(name) {
    this.value = name;
    return this;
}
Symbol.prototype.toString = function () { return this.value; }

export function _symbol(ns, name) {
    if (!name) {
        return new Symbol(ns)
    }
    if (ns === null) {
        return new Symbol(name)
    }
    return new Symbol(ns + "/" + name)
}

export function _symbol_Q(obj) { return obj instanceof Symbol; }

// Ratios

/* export function _ratio(x) {
    return new Fraction(x)
} */

/* export function _ratio_Q(obj) {
    return obj instanceof Fraction
} */

export function _ratio(x) {
    return x
}

export function _ratio_Q(obj) {
    return false
}

// Keywords
export function _keyword(ns, name) {
    if (!name) {
        name = ns
        if (typeof name === 'string' && name[0] === '\u029e') {
            return name;
        } else {
            return "\u029e" + name;
        }
    }
    if (ns === null) {
        return "\u029e" + name
    }
    return "\u029e" + ns + "/" + name
}
export function _keyword_Q(obj) {
    return typeof obj === 'string' && obj[0] === '\u029e';
}

export function _mapEntry_Q(obj) {
    return Object.hasOwn(obj, '__mapEntry__') && obj.__mapEntry__ === true
}

export function _regex_Q(obj) {
    return obj instanceof RegExp
}

export function walk(inner, outer, form) {
    //console.log("Walking form:", form)
    if (typeof form === 'undefined') {
        return null
    }
    if (_list_Q(form)) {
        return outer(form.map(inner))
    } else if (form === null) {
        return null
    }
    else if (_vector_Q(form)) {
        let v = outer(form.map(inner))
        v.__isvector__ = true;
        return v
    } else if (form.__mapEntry__) {
        const k = inner(form[0])
        const v = inner(form[1])
        let mapEntry = [k, v]
        mapEntry.__mapEntry__ = true
        return outer(mapEntry)
    } else if (_hash_map_Q(form)) {
        let newMap = new Map()
        form.forEach((value, key, map) => newMap.set(key, inner(value)))
        return outer(newMap)
    } else {
        return outer(form)
    }
}

export function postwalk(f, form) {
    return walk(x => postwalk(f, x), f, form)
}

export function hasLoop(ast) {
    let loops = []
    postwalk(x => {
        if (x.value == _symbol("loop") || x.value == _symbol("loop*")) {
            loops.push(true)
            return true
        } else {
            return x
        }
        return x
    }, ast)
    if (loops.length > 0) {
        return true
    } else {
        return false
    }
}

export function hasRecur(ast) {
    let loops = []
    postwalk(x => {
        if (x.value == _symbol("recur")) {
            loops.push(true)
            return true
        } else {
            return x
        }
        return x
    }, ast)
    if (loops.length > 0) {
        return true
    } else {
        return false
    }
}

// Functions
export function _function(Eval, Env, ast, env, params) {
    var fn = function () {
        return Eval(ast, new Env(env, params, arguments));
    };
    fn.__meta__ = null;
    fn.__ast__ = ast;
    fn.__gen_env__ = function (args) { return new Env(env, params, args); };
    fn._ismacro_ = false;
    return fn;
}

function findVariadic(bodies) {
    for (let i = 0; i < bodies.length; i++) {
        // I don't know how to recognize symbols by value,
        // so it's either this or loop through them all
        if (bodies[i][0].toString().includes('&')) {
            return bodies[i]
        }
    }
}

function findFixedArity(arity, bodies) {
    for (let i = 0; i < bodies.length; i++) {
        if (bodies[i][0].length === arity && !bodies[i][0].toString().includes('&')) {
            return bodies[i]
        }
    }
}

export function multifn(Eval, Env, bodies, env) {
    var fn = function () {
        var arity = arguments.length
        var body = findFixedArity(arity, bodies) || findVariadic(bodies)
        return Eval(body[1],
            new Env(env, body[0], arguments));
    }
    fn.__meta__ = null;
    fn.__multifn__ = true
    fn.__ast__ = function (args) {
        var arity = args.length
        var ast = findFixedArity(arity, bodies) || findVariadic(bodies)
        return ast[1]
    }
    fn.__gen_env__ = function (args) {
        var arity = args.length
        var body = findFixedArity(arity, bodies) || findVariadic(bodies)
        return new Env(env, body[0], args)
    }
    fn._ismacro_ = false;
    return fn;
}

export function _function_Q(obj) { return typeof obj == "function"; }

Function.prototype.clone = function () {
    var that = this;
    var temp = function () { return that.apply(this, arguments); };
    for (var key in this) {
        temp[key] = this[key];
    }
    return temp;
};
export function _fn_Q(obj) { return _function_Q(obj) && !obj._ismacro_; }
export function _macro_Q(obj) { return _function_Q(obj) && !!obj._ismacro_; }


// Lists
export function _list() { return Array.prototype.slice.call(arguments, 0); }
export function _list_Q(obj) { return Array.isArray(obj) && !obj.__isvector__; }


// Vectors
export function _vector() {
    var v = Array.prototype.slice.call(arguments, 0);
    v.__isvector__ = true;
    return v;
}
export function _vector_Q(obj) { return Array.isArray(obj) && !!obj.__isvector__; }

// Hash Maps
export function _hash_map() {
    if (arguments.length % 2 === 1) {
        throw new Error("Odd number of hash map arguments");
    }
    const hm = new Map();
    var args = [hm].concat(Array.prototype.slice.call(arguments, 0));
    return _assoc_BANG.apply(null, args);
}

export function _hash_map_Q(hm) {
    return typeof hm === "object" &&
        (hm instanceof Map)
}

export function _assoc_BANG(hm) {
    if (arguments.length % 2 !== 1) {
        throw new Error("Odd number of assoc arguments");
    }
    if (_vector_Q(hm)) {
        for (let i = 0; i < arguments.length; i++) {
            var ktoken = arguments[i],
                vtoken = arguments[i + 1];
            hm[ktoken] = vtoken
        }
        return hm
    }
    var assoc_keys = new Set()
    for (let i = 1; i < arguments.length; i += 2) {
        assoc_keys.add(arguments[i])
    }
    var new_map = new Map()
    for (const [key, value] of hm) {
        if (!contains_Q(assoc_keys, key)) {
            new_map.set(key, value)
        }
    }
    for (var i = 1; i < arguments.length; i += 2) {
        var ktoken = arguments[i],
            vtoken = arguments[i + 1];
        new_map.set(ktoken, vtoken)
    }
    return new_map;
}

export function _dissoc_BANG(hm) {
    for (var i = 1; i < arguments.length; i++) {
        var ktoken = arguments[i];
        hm.delete(ktoken)
    }
    return hm;
}

// Sets
export function _set() {
    return new Set(arguments)
}

export function _set_Q(set) {
    return typeof set === "object" &&
        (set instanceof Set)
}

// Atoms
function Atom(val) { this.val = val; }
export function _atom(val) { return new Atom(val); }
export function _atom_Q(atm) { return atm instanceof Atom; }