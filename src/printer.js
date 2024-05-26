import { _obj_type, _keyword } from './types.js'

export function _println() {
    console.log.apply(console, arguments)
}

export function _pr_str(obj, print_readably) {
    //console.log("printing:", obj)
    //console.log("obj type:", _obj_type(obj))
    if (typeof print_readably === 'undefined') { print_readably = true; }
    var _r = print_readably;
    var ot = _obj_type(obj);
    switch (ot) {
        case 'lazy-range':
            return "(0 1 2 3 4 5 6 7 8 9 10 ...)";
        case 'lazy-seq':
            var ret = [...obj].map(function (e) { return _pr_str(e, _r); });
            return "(" + ret.join(' ') + ")";
        case 'lazy-iterable':
            var ret = [...obj].map(function (e) { return _pr_str(e, _r); });
            return "(" + ret.join(' ') + ")";
        case 'iterate':
            return "#iterate[" + obj.f + "]";
        case 'cycle':
            return "#cycle[" + obj.coll + "]";
        case 'list':
            var ret = obj.map(function (e) { return _pr_str(e, _r); });
            return "(" + ret.join(' ') + ")";
        case 'vector':
            var ret = obj.map(function (e) { return _pr_str(e, _r); });
            return "[" + ret.join(' ') + "]";
        case 'hash-map':
            var ret = [];
            for (const [key, value] of obj) {
                ret.push(_pr_str(key, _r), _pr_str(value, _r));
            }
            return "{" + ret.join(' ') + "}";
        case 'set':
            var arr = Array.from(obj)
            var ret = arr.map(function (e) { return _pr_str(e, _r); });
            return "#{" + ret.join(' ') + "}";
        case 'string':
            if (obj[0] === '\u029e') {
                return ':' + obj.slice(1);
            } else if (_r) {
                return '"' + obj.replace(/\\/g, "\\\\")
                    .replace(/"/g, '\\"')
                    .replace(/\n/g, "\\n") + '"'; // string
            } else {
                return obj;
            }
        case 'keyword':
            return ':' + obj.slice(1);
        case 'nil':
            return "nil";
        case 'function':
            if (obj.__meta__) {
                if (obj._ismacro_) {
                    return "#macro[" + obj.__meta__.get(_keyword("name")) + "]"
                } else {
                    return "#function[" + obj.__meta__.get(_keyword("name")) + "]"
                }
            } else {
                return obj._ismacro_ ? "#macro[]" : "#function[]"
            }
        case 'regex':
            const re_str = obj.toString()
            return "#\"" + re_str.substring(1, re_str.length - 2) + "\""
        case 'ratio':
            if (obj.s === -1) {
                return "-" + obj.n + "/" + obj.d
            } else {
                return obj.n + "/" + obj.d
            }
        case 'atom':
            return "(atom " + _pr_str(obj.val, _r) + ")";
        default:
            return obj.toString();
    }
}