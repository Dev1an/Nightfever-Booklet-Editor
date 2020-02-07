import {createPageBreakPadding} from "./insertPageBreaks";

export const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false;

export const boldAndItalic = {
    // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
    // Has parse rules that also match `<i>` and `font-style: italic`.
    em: {
        parseDOM: [{tag: "i"}, {tag: "em"}, {style: "font-style=italic"}],
        toDOM() {
            return ["em", 0]
        }
    },

    // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
    // also match `<b>` and `font-weight: bold`.
    strong: {
        parseDOM: [{tag: "strong"},
            // This works around a Google Docs misbehavior where
            // pasted content will be inexplicably wrapped in `<b>`
            // tags with a font-weight normal.
            {
                tag: "b",
                getAttrs: node => node.style.fontWeight != "normal" && null
            },
            {
                style: "font-weight",
                getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
            }],
        toDOM() {
            return ["strong", 0]
        }
    },
}

export const splittedText = {
    parseDOM: [{tag: 'span.splitted'}],
    toDOM() {
        return ['span', {class: 'splitted'}, 0]
    }
}

export const pageBreakPadding = {
    attrs: {height: {default: '20mm'}},
    atom: true,
    selectable: false,
    parseDOM: [{
        tag: 'div.pagebreak-padding',
        getAttrs: dom => ({height: dom.style.height})
    }],
    toDOM(node) {
        return createPageBreakPadding(node.attrs.height)
    }
}
export const hard_break = {
    inline: true,
    selectable: false,
    parseDOM: [{tag: "br"}],
    toDOM() {
        return ["br"]
    }
}