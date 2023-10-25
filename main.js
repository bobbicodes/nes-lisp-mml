import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "./src/clojure"
import confuzion from './confuzion.json'

let editorState = EditorState.create({
  doc: `(play (pulse0-seq [{:pitch 60
    :time 0 
    :length 3
    :vibrato {:speed 3
              :depth 3}}]))
  
(play (pulse0-seq [{:pitch 60
    :time 0 
    :length 1
    :vibrato {:speed 3
              :depth 3}}
   {:pitch 55
    :time 1
    :length 1
    :vibrato {:speed 3
              :depth 3}}
   {:pitch 51
    :time 2 
    :length 1
    :vibrato {:speed 3
              :depth 3}}
   {:pitch 48
    :time 3
    :length 3
    :vibrato {:speed 3
              :depth 3}}]))
              
(spit-wav "vibrato-fail" (pulse0-seq [{:pitch 60
    :time 0 
    :length 1
    :vibrato {:speed 3
              :depth 3}}
   {:pitch 55
    :time 1
    :length 1
    :vibrato {:speed 3
              :depth 3}}
   {:pitch 51
    :time 2
    :length 1
    :vibrato {:speed 3
              :depth 3}}
   {:pitch 48
    :time 3
    :length 3
    :vibrato {:speed 3
              :depth 3}}]))`,
  extensions: [basicSetup, clojure()]
})

let view = new EditorView({
  state: editorState,
  parent: document.querySelector('#app')
})