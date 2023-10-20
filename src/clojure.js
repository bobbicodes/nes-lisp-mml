import { parser, props } from "@nextjournal/lezer-clojure"
import { styleTags, tags } from "@lezer/highlight"
import { indentNodeProp, foldNodeProp, foldInside, LRLanguage, LanguageSupport } from "@codemirror/language"
import { evalExtension } from "./eval-region"
import { repl_env } from "./interpreter";

const { coll } = props

export const clojureLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [styleTags({
      NS: tags.keyword,
      DefLike: tags.keyword,
      "Operator/Symbol": tags.keyword,
      "VarName/Symbol": tags.definition(tags.variableName),
      // Symbol: tags.keyword,
      // "'": tags.keyword, // quote
      Boolean: tags.atom,
      "DocString/...": tags.emphasis,
      "Discard!": tags.comment,
      Number: tags.number,
      StringContent: tags.string,
      "\"\\\"\"": tags.string, // need to pass something, that returns " when being parsed as JSON
      Keyword: tags.atom,
      Nil: tags.null,
      LineComment: tags.lineComment,
      RegExp: tags.regexp
    }),

    indentNodeProp.add((nodeType) => {
      return (context) => {
        let { pos, unit, node, state, baseIndent, textAfter } = context
        if (nodeType.prop(coll)) {
          // same behaviour as in clojure-mode: args after operator are always 2-units indented
          let parentBase = context.column(node.firstChild.to) // column at the right of parent opening-(
          if ("List" == nodeType.name && ["NS", "DefLike", "Operator"].includes(node.firstChild.nextSibling.type.name)) {
            return parentBase + 1
          } else {
            return parentBase
          }
        } else {
          return 0
        }
      }
    }),

    foldNodeProp.add({ ["Vector Map List"]: foldInside })]
  }),

  languageData: { commentTokens: { line: ";;" } }
})

function getCompletions(env) {
  let vars =  [{label: 'macroexpand'}, {label: 'defmacro'}]
  for (const sym of Object.keys(repl_env.data)) {
    vars.push({label: sym})
  }
  return vars
}

function myCompletions(context) {
  let word = context.matchBefore(/\w*/)
  if (word.from == word.to && !context.explicit)
    return null
  return {
    from: word.from,
    options: getCompletions(repl_env)
  }
}

export function clojure() {
  return new LanguageSupport(clojureLanguage, 
    [clojureLanguage.data.of({autocomplete: myCompletions}), evalExtension]
    )
}
