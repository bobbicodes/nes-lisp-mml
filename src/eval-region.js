import { Prec, EditorSelection } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { syntaxTree } from "@codemirror/language"
import { evalString } from 'bobbi-lisp-core'
import { out_buffer, appendBuffer, clearBuffer } from 'bobbi-lisp-core/core'

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

function right(node) {
    return up(node).childAfter(node.to)
}

function left(node) {
    return up(node).childBefore(node.from)
}

function rights(node) {
    var rs = []
    if (right(node) != null) {
        rs.push(right(node))
        node = right(node)
    }
    return rs
}

function lefts(node) {
    var ls = []
    if (left(node) != null) {
        ls.push(left(node))
        node = left(node)
    }
    return ls
}

function slurp(view) {
    var doc = view.state.doc.toString()
    var pos = mainSelection(view.state).from
    var node = tree(view.state, pos)
    var parent = up(node)
    console.log("rights")
    var target = rights(node)[0]
    var edge = parent.lastChild
    var s1 = right(node).from
    var e1 = right(node).to
    var s2 = node.from + 1
    var e2 = node.to
    view.dispatch({
        changes: { from: pos, to: 7,
            insert: doc.substring(s1, e1) + doc.substring(s2, e2)}
    })
    return true
}

function barf(view) {
    var doc = view.state.doc.toString()
    var pos = mainSelection(view.state).from
    var node = tree(view.state, pos)
    var parent = up(node)
    var target = lefts(node)[0]
    var edge = parent.lastChild
    var s1 = node.to - 1
    var e1 = node.to
    var s2 = node.from + 1
    var e2 = node.to - 1
    view.dispatch({
        changes: { from: pos, to: 7,
            insert: doc.substring(s1, e1) + doc.substring(s2, e2)}
    })
    return true
}

var evalResult = ""
var codeBeforeEval = ""
export var testCodeBeforeEval = ""
var posBeforeEval = 0
var testPosBeforeEval = 0
var lastEditorEvaluated

export const updateEditor = (view, text, pos) => {
    var parent = view.dom.parentElement.id
    var doc = view.state.doc.toString()
    const end = doc.length
    if (parent === 'app') {
        codeBeforeEval = doc
        posBeforeEval = view.state.selection.main.head
        view.dispatch({
            changes: { from: 0, to: end, insert: text },
            selection: { anchor: pos, head: pos }
        })
    }
    if (parent === 'test') {
        testCodeBeforeEval = doc
        testPosBeforeEval = view.state.selection.main.head
        view.dispatch({
            changes: { from: 0, to: end, insert: text },
            selection: { anchor: pos, head: pos }
        })
    }
}

export function tryEval(s) {
    //console.log("Trying to eval", s)
    try {
        //console.log("evalPretty:", evalPretty(s))
        return evalString(s)
        //return repp(s)
    } catch (err) {
        console.log(err)
        return "\nError: " + err.message
    }
}

export const clearEval = (view) => {
    const parent = view.dom.parentElement.id
    if (parent === 'app' && lastEditorEvaluated === 'app') {
        var previousDoc = codeBeforeEval
        var previousPos = posBeforeEval
        if (evalResult.length != 0) {
            evalResult = ""
            updateEditor(view, previousDoc, previousPos)
        }
    }
    if (parent === 'test' && lastEditorEvaluated === 'test') {
        var previousTestDoc = testCodeBeforeEval
        var previousTestPos = testPosBeforeEval
        if (evalResult.length != 0) {
            evalResult = ""
            updateEditor(view, previousTestDoc, previousTestPos)
        }
    }
}

export const evalAtCursor = (view) => {
    var parent = view.dom.parentElement.id
    clearEval(view)
    var doc = view.state.doc.toString()
    //console.log("doc:", doc)
    if (parent === 'app') {
        codeBeforeEval = doc
        posBeforeEval = view.state.selection.main.head
        var codeBeforeCursor = codeBeforeEval.slice(0, posBeforeEval)
        var codeAfterCursor = codeBeforeEval.slice(posBeforeEval, codeBeforeEval.length)
        evalResult = tryEval(cursorNodeString(view.state))
        var codeWithResult = codeBeforeCursor + " =>" + "\n" + out_buffer + evalResult + " " + codeAfterCursor
        updateEditor(view, codeWithResult, posBeforeEval)
        view.dispatch({ selection: { anchor: posBeforeEval, head: posBeforeEval } })
        clearBuffer()
        lastEditorEvaluated = 'app'
        return true
    }
    if (parent === 'test') {
        testCodeBeforeEval = doc
        testPosBeforeEval = view.state.selection.main.head
        var codeBeforeCursor = codeBeforeEval.slice(0, posBeforeEval)
        var codeAfterCursor = codeBeforeEval.slice(posBeforeEval, codeBeforeEval.length)
        evalResult = tryEval(cursorNodeString(view.state))
        var codeWithResult = codeBeforeCursor + " =>" + "\n" + out_buffer + evalResult + " " + codeAfterCursor
        updateEditor(view, codeWithResult, posBeforeEval)
        view.dispatch({ selection: { anchor: posBeforeEval, head: posBeforeEval } })
        clearBuffer()
        lastEditorEvaluated = 'test'
        return true
    }
}

export const evalTopLevel = (view) => {
    var parent = view.dom.parentElement.id
    clearEval(view)
    posAtFormEnd = topLevelNode(view.state).to
    var doc = view.state.doc.toString()
    if (parent === 'app') {
        posBeforeEval = view.state.selection.main.head
        codeBeforeEval = doc
        var codeBeforeFormEnd = codeBeforeEval.slice(0, posAtFormEnd)
        var codeAfterFormEnd = codeBeforeEval.slice(posAtFormEnd, codeBeforeEval.length)
        evalResult = tryEval(topLevelString(view.state))
        const codeWithResult = codeBeforeFormEnd + "\n" + "=> " + "\n" + out_buffer + evalResult + " " + codeAfterFormEnd
        updateEditor(view, codeWithResult, posBeforeEval)
        clearBuffer()
        lastEditorEvaluated = 'app'
        return true
    }
    if (parent === 'test') {
        testPosBeforeEval = view.state.selection.main.head
        testCodeBeforeEval = doc
        var codeBeforeFormEnd = testCodeBeforeEval.slice(0, posAtFormEnd)
        var codeAfterFormEnd = testCodeBeforeEval.slice(posAtFormEnd, testCodeBeforeEval.length)
        evalResult = tryEval(topLevelString(view.state))
        const codeWithResult = codeBeforeFormEnd + "\n" + "=> " + "\n" + out_buffer + evalResult + " " + codeAfterFormEnd
        updateEditor(view, codeWithResult, testPosBeforeEval)
        clearBuffer()
        lastEditorEvaluated = 'test'
        return true
    }
}

export const evalCell = (view) => {
    var parent = view.dom.parentElement.id
    clearEval(view)
    var doc = view.state.doc.toString()
    if (parent === 'app') {
        posBeforeEval = view.state.selection.main.head
        evalResult = tryEval("(do " + view.state.doc.text.join(" ") + ")")
        var codeWithResult = doc + "\n" + "=> " + "\n" + out_buffer + evalResult
        updateEditor(view, codeWithResult, posBeforeEval)
        clearBuffer()
        lastEditorEvaluated = 'app'
        return true
    }
    if (parent === 'test') {
        testPosBeforeEval = view.state.selection.main.head
        evalResult = tryEval("(do " + view.state.doc.text.join(" ") + ")")
        var codeWithResult = doc + "\n" + "=> " + "\n" + out_buffer + evalResult
        updateEditor(view, codeWithResult, testPosBeforeEval)
        clearBuffer()
        lastEditorEvaluated = 'test'
        return true
    }
}

const alpha = Array.from(Array(58)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));
let letterKeys = []
for (let i = 0; i < alphabet.length; i++) {
    letterKeys = letterKeys.concat({ key: alphabet[i], run: clearEval })
}

export const evalExtension =
    Prec.highest(keymap.of(
        [{ key: "Alt-Enter", run: evalCell },
        { key: "Mod-Enter", run: evalAtCursor },
        { key: "Shift-Enter", run: evalTopLevel },
        { key: "Shift-ArrowRight", run: slurp},
        { key: "Shift-ArrowLeft", run: barf},
        { key: "Escape", run: clearEval },
        { key: "ArrowLeft", run: clearEval },
        { key: "ArrowRight", run: clearEval },
        { key: "ArrowUp", run: clearEval },
        { key: "ArrowDown", run: clearEval },
        { key: "Backspace", run: clearEval },
        { key: "Enter", run: clearEval },
        { key: "Tab", run: clearEval },
        { key: "Delete", run: clearEval },
        { key: "0", run: clearEval },
        { key: "1", run: clearEval },
        { key: "2", run: clearEval },
        { key: "3", run: clearEval },
        { key: "4", run: clearEval },
        { key: "5", run: clearEval },
        { key: "6", run: clearEval },
        { key: "7", run: clearEval },
        { key: "8", run: clearEval },
        { key: "9", run: clearEval },
        { key: "!", run: clearEval },
        { key: "@", run: clearEval },
        { key: "#", run: clearEval },
        { key: "$", run: clearEval },
        { key: "%", run: clearEval },
        { key: "^", run: clearEval },
        { key: "&", run: clearEval },
        { key: "*", run: clearEval },
        { key: "-", run: clearEval },
        { key: "=", run: clearEval },
        { key: "+", run: clearEval },
        { key: "/", run: clearEval },
        { key: "`", run: clearEval },
        { key: "\"", run: clearEval },
        { key: "'", run: clearEval },
        { key: ";", run: clearEval },
        { key: ":", run: clearEval },
        { key: "[", run: clearEval },
        { key: "]", run: clearEval },
        { key: "{", run: clearEval },
        { key: "}", run: clearEval },
        { key: "(", run: clearEval },
        { key: ")", run: clearEval },
        { key: "Space", run: clearEval }].concat(letterKeys)))
