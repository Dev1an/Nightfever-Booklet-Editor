import {orderedList, splitListItem} from "prosemirror-schema-list"
import {Schema} from "prosemirror-model"
import {inputRules, smartQuotes, undoInputRule} from "prosemirror-inputrules"
import {keymap, base} from "prosemirror-keymap";
import {dropCursor} from "prosemirror-dropcursor";
import {gapCursor} from "prosemirror-gapcursor";
import {history, undo, redo} from "prosemirror-history";
import {joinUp, joinDown, baseKeymap, toggleMark} from "prosemirror-commands";
import {replaceSelectionWith} from "./commands";
import {findParentNode} from "./commands";

import {SegmentEditor} from "./SegmentEditor";

const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false;

export const songSchema = new Schema({
    nodes: {
        doc: {content: 'song'},
        song: {
            ...orderedList,
            content: 'verse+'
        },
        verse: {
            defining: true,
            content: '(text|hard_break)*',
            attrs: {isRefrain: {default: false}},
            toDOM: node => ['li', {class: node.attrs.isRefrain ? 'refrain avoid-pagebreak' : 'avoid-pagebreak'}, 0],
            parseDOM: [{
                tag: 'li',
                getAttrs(dom) {
                    if (dom.classList.contains('refrain')) {
                        return {isRefrain: true}
                    }
                }
            }]
        },
        text: {
            group: 'inline'
        },
        hard_break: {
            inline: true,
            group: 'inline',
            selectable: false,
            parseDOM: [{tag: "br"}],
            toDOM() { return ["br"] }
        }
    },
    marks: {
        // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
        // Has parse rules that also match `<i>` and `font-style: italic`.
        em: {
            parseDOM: [{tag: "i"}, {tag: "em"}, {style: "font-style=italic"}],
            toDOM() { return ["em", 0] }
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
})

const insertHardBreak = replaceSelectionWith(songSchema.nodes.hard_break)
const isSongVerse = (node => node.type === songSchema.nodes.verse)
function toggleRefrain(state, dispatch) {
    const {pos, node} = findParentNode(isSongVerse)(state.selection)
    if (node && dispatch) {
        dispatch(state.tr.setNodeMarkup(pos, null, {isRefrain: !node.attrs.isRefrain}))
        return true
    }
    return false
}

export const songPlugins = [
    inputRules({ rules: smartQuotes }),
    keymap({
        "Mod-z": undo,
        "Shift-Mod-z": redo,
        "Backspace": undoInputRule,
        "Alt-ArrowUp": joinUp,
        "Alt-ArrowDown": joinDown,
        "Mod-b": toggleMark(songSchema.marks.strong),
        "Mod-B": toggleMark(songSchema.marks.strong),
        "Mod-i": toggleMark(songSchema.marks.em),
        "Mod-I": toggleMark(songSchema.marks.em),
        "Mod-Enter":   insertHardBreak,
        "Shift-Enter": insertHardBreak,
        [mac ? "Ctrl-Enter": "Enter"]: insertHardBreak,
        "Enter": splitListItem(songSchema.nodes.list_item),
    }),
    keymap(baseKeymap),
    keymap({ "Alt-r": toggleRefrain }),
    dropCursor(),
    gapCursor(),
    history()
]

const editorStateConfig = {
    schema: songSchema,
    plugins: songPlugins,
}

export class SongEditor extends SegmentEditor {
    constructor(container) {
        super(container, editorStateConfig)
    }
}