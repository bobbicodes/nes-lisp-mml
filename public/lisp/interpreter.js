import { read_str } from './reader.js'
import { _pr_str } from './printer.js'
import { Env } from './env.js'
import * as types from './types.js'
import * as core from './core.js'
import core_clj from './clj/core.clj?raw'
import pprint from './clj/pprint.clj?raw'

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
    //console.log(PRINT(ast))
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
    //return (typeof result !== "undefined") ? result : null;
    return result
}

// print
export function PRINT(exp) {
    console.log("PRINT:", exp)
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
//evalString("(do " + pprint + ")")

export function repp(s) {
   return PRINT(EVAL(READ("(do " + s + ")"), repl_env))
  //return EVAL(READ("(pprint " + "(do " + s + "))"), repl_env)
}
