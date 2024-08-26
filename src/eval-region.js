import { Prec } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { syntaxTree } from "@codemirror/language"
import { evalString, repp, PRINT, repl_env } from "./interpreter"
import { out_buffer, appendBuffer, clearBuffer, playNSF, spitNSF, saveWav, compilePattern, saveMp4 } from './core'
import { _symbol } from './types.js'
import {compileDpcm} from './compiler'
import {outView, samples, renderSamples, updateSamples, drawSample} from '../main'

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

// Set up Lisp interpreter web worker

import Worker from './lisp-worker.js?worker'

const lispworker = new Worker();

lispworker.onmessage = function(e) {
  //console.log("received message of type " + e.data.type)
  if (e.data.type === 'repl') {
    updateEditor(outView, out_buffer + e.data.out, 0)
    //console.log(e.data.env)
  }
  if (e.data.type === 'play') {
    playNSF(...e.data.streams)
  }
  if (e.data.type === 'mp4') {
    saveMp4(...e.data.streams)
  }
  if (e.data.type === 'savensf') {
    spitNSF(...e.data.streams)
  }
  if (e.data.type === 'savewav') {
    saveWav(...e.data.streams)
  }
  if (e.data.type === 'savepcm') {
    //console.log("received message w/ pcm data")
    savePCM(e.data.name, e.data.data)
  }
  if (e.data.type === 'pattern') {
    compilePattern(e.data.data)
  }
  if (e.data.type === 'savedmc') {
    //console.log("received message w/ dmc data")
    saveDMC(e.data.name, e.data.data)
  }
  if (e.data.type === 'dpcmstream') {
    //console.log("received message w/ dmc data")
    compileDpcm(e.data.stream)
  }

  if (e.data.type === 'sample') {
    updateSamples(samples.filter(obj => obj.name !== e.data.name))
    samples.push({"name": e.data.name, "bytes": e.data.bytes})
    renderSamples()
    drawSample(e.data.bytes)
  }
}

function saveDMC(name, bytes) {
    let buffer = new ArrayBuffer(bytes.length);
    let view = new DataView(buffer)
    for (let i = 0; i < bytes.length; i++) {
      view.setInt8(i, bytes[i]); 
    }
    const blob = new Blob([view], { type: "application/octet-stream" }); 
    var new_file = URL.createObjectURL(blob);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", new_file);
    downloadAnchorNode.setAttribute("download", name);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function bufferToWave(abuffer, len) {
    var numOfChan = 1,
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
    setUint32(44100);
    setUint32(44100 * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for (i = 0; i < 1; i++)
        channels.push(abuffer);

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {             // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample *= 32768; // scale to 16-bit signed int
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

function buf_download(name, abuffer) {
    var new_file = URL.createObjectURL(bufferToWave(abuffer, abuffer.length));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", new_file);
    downloadAnchorNode.setAttribute("download", name);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function savePCM(name, data) {
  buf_download(name, data)
}

export function tryEval(s) {
    //console.log("Trying to eval", s)
    try {
        //console.log("evalPretty:", evalPretty(s))
        //return evalString(s)
        lispworker.postMessage({"type": "eval", "eval": s});
        //return repp(s)
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

let syms = {}

for (const [key, value] of Object.entries(repl_env.data)) {
  syms[key.toString()] = value.__meta__
}

//console.log(syms)

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
    //updateEditor(outView, out_buffer + evalResult, 0)
    clearBuffer()
    return true
}

export const evalTopLevel = (view) => {
    clearEval(view)
    evalResult = tryEval(topLevelString(view.state))
    //updateEditor(outView, out_buffer + evalResult, 0)
    clearBuffer()
    return true
}

export const evalCell = (view) => {
    clearEval(view)
    evalResult = tryEval("(do " + view.state.doc.toString() + ")")
    //updateEditor(outView, out_buffer + evalResult, 0)
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
