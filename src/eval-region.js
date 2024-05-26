import { Prec } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { syntaxTree } from "@codemirror/language"
import { evalString, repl_env, repp, PRINT } from "./interpreter"
import { out_buffer, appendBuffer, clearBuffer } from './core'
import { _symbol } from './types.js'
import {outView} from '../main'

const up = (node) => node.parent;
const isTopType = (nodeType) => nodeType.isTop
const isTop = (node) => isTopType(node.type)
const mainSelection = (state) => state.selection.asSingle().ranges[0]
const tree = (state, pos, dir) => syntaxTree(state).resolveInner(pos, dir)
const nearestTouching = (state, pos) => tree(state, pos, -1)

const children = (parent, from, dir) => {
    let child = parent.childBefore(from)
    return children(parent, child.from).unshift(child)
}

const parents = (node, p) => {
    if (isTop(node)) return p;
    return parents(up(node), p.concat(node))
}

const rangeStr = (state, selection) => state.doc.slice(selection.from, selection.to).toString()

// Return node or its highest parent that ends at the cursor position
const uppermostEdge = (pos, node) => {
    const p = parents(node, []).filter(n => pos == n.to && pos == node.to);
    return p[p.length - 1] || node
}

const nodeAtCursor = (state) => {
    const pos = mainSelection(state).from
    const n = nearestTouching(state, pos)
    return uppermostEdge(pos, n)
}

let posAtFormEnd = 0

const topLevelNode = (state) => {
    const pos = mainSelection(state).from
    const p = parents(nearestTouching(state, pos), [])
    if (p.length === 0) {
        return nodeAtCursor(state)
    } else {
        return p[p.length - 1]
    }
}

const cursorNodeString = (state) => rangeStr(state, nodeAtCursor(state))
const topLevelString = (state) => rangeStr(state, topLevelNode(state))

var evalResult = ""
var codeBeforeEval = ""
export var testCodeBeforeEval = ""
var posBeforeEval = 0
var testPosBeforeEval = 0
var lastEditorEvaluated

export const updateEditor = (view, text, pos) => {
  const doc = outView.state.doc.toString()
   view.dispatch({
         changes: { from: 0, to: doc.length, insert: text },
         selection: { anchor: pos, head: pos }
    })
}

export function tryEval(s) {
    //console.log("Trying to eval", s)
    try {
        //console.log("evalPretty:", evalPretty(s))
        //return evalString(s)
        return repp(s)
    } catch (err) {
        console.log(err)
        return "Error: " + err.message
    }
}

const docBar = document.getElementById("results")
const docBar2 = document.getElementById("doc")

export function updateDocBar(view) {
    //console.log("update docbar")
    var pos = view.state.selection.main.head
    var sym = cursorNodeString(view.state)
    if (syntaxTree(view.state).resolveInner(pos, -1).name === 'Symbol'
        && Object.hasOwn(repl_env.data, sym)
        && Object.hasOwn(repl_env.data[sym], '__meta__')
        && repl_env.data[sym].__meta__ != null) {
        var cljDoc = repl_env.data[sym].__meta__.get("ʞdoc")
        if (repl_env.data[sym].__meta__.has("ʞarglists")) {
            var arglists = repl_env.data[sym].__meta__.get("ʞarglists")
            docBar.innerHTML = sym + " " + (PRINT(arglists) || "")
        } else {
            docBar.innerHTML = sym
        }
        docBar.style.color = '#0437F2';
        docBar2.innerHTML = cljDoc || ""
        docBar2.style.color = '#0437F2';
    } else {
        docBar.innerHTML = ''
        docBar2.innerHTML = ''
    }
}

export const clearEval = (view) => {
  updateDocBar(view)
  evalResult = ""
  updateEditor(outView, '', 0)
}

function clearAll(view) {
    clearEval(view)
    docBar.innerHTML = ''
    docBar2.innerHTML = ''
}

export const evalAtCursor = (view) => {
    clearEval(view)
    evalResult = tryEval(cursorNodeString(view.state))
    updateEditor(outView, out_buffer + evalResult, 0)
    clearBuffer()
    return true
}

export const evalTopLevel = (view) => {
    clearEval(view)
    evalResult = tryEval(topLevelString(view.state))
    updateEditor(outView, out_buffer + evalResult, 0)
    clearBuffer()
    return true
}

export const evalCell = (view) => {
    clearEval(view)
    evalResult = tryEval("(do " + view.state.doc.toString() + ")")
    updateEditor(outView, out_buffer + evalResult, 0)
    clearBuffer()
    return true
}

const alpha = Array.from(Array(58)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));
let letterKeys = []
for (let i = 0; i < alphabet.length; i++) {
    letterKeys = letterKeys.concat({ key: alphabet[i], run: updateDocBar })
}

export const evalExtension =
    Prec.highest(keymap.of(
        [{ key: "Alt-Enter", run: evalCell },
        { key: "Mod-Enter", run: evalAtCursor },
        { key: "Shift-Enter", run: evalTopLevel },
        { key: "Escape", run: clearAll },
        { key: "ArrowLeft", run: updateDocBar },
        { key: "ArrowRight", run: updateDocBar },
        { key: "ArrowUp", run: updateDocBar },
        { key: "ArrowDown", run: updateDocBar },
        { key: "Backspace", run: updateDocBar },
        { key: "Enter", run: updateDocBar },
        { key: "Tab", run: updateDocBar },
        { key: "Delete", run: updateDocBar },
        { key: "0", run: updateDocBar },
        { key: "1", run: updateDocBar },
        { key: "2", run: updateDocBar },
        { key: "3", run: updateDocBar },
        { key: "4", run: updateDocBar },
        { key: "5", run: updateDocBar },
        { key: "6", run: updateDocBar },
        { key: "7", run: updateDocBar },
        { key: "8", run: updateDocBar },
        { key: "9", run: updateDocBar },
        { key: "!", run: updateDocBar },
        { key: "@", run: updateDocBar },
        { key: "#", run: updateDocBar },
        { key: "$", run: updateDocBar },
        { key: "%", run: updateDocBar },
        { key: "^", run: updateDocBar },
        { key: "&", run: updateDocBar },
        { key: "*", run: updateDocBar },
        { key: "-", run: updateDocBar },
        { key: "=", run: updateDocBar },
        { key: "+", run: updateDocBar },
        { key: "/", run: updateDocBar },
        { key: "`", run: updateDocBar },
        { key: "\"", run: updateDocBar },
        { key: "'", run: updateDocBar },
        { key: ";", run: updateDocBar },
        { key: ":", run: updateDocBar },
        { key: "[", run: updateDocBar },
        { key: "]", run: updateDocBar },
        { key: "{", run: updateDocBar },
        { key: "}", run: updateDocBar },
        { key: "(", run: updateDocBar },
        { key: ")", run: updateDocBar },
        { key: "Space", run: updateDocBar }].concat(letterKeys)))

