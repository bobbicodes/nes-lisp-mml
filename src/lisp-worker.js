import { repp, repl_env } from "./lisp/interpreter"

//console.log("loading lisp worker")

// Process the repl env into a form that can be passed in a message

function syms(env) {
  let res = {}
  for (const [key, value] of Object.entries(env.data)) {
    if (Object.hasOwn(value, '__meta__')) {
      res[key.toString()] = value.__meta__
    }
  }
  return res
}

//addEventListener('message', e => {
  //console.log("sending message from lisp worker")
//  postMessage({"type": "repl", "out": repp(e.data.eval), "env": syms(repl_env)})
//});

addEventListener('message', e => {
  //console.log("sending message from lisp worker")
  postMessage({"type": "repl", "out": repp(e.data.eval)})
});

