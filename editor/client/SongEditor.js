import {orderedList, splitListItem} from "prosemirror-schema-list"
import {Schema} from "prosemirror-model"
import {inputRules, smartQuotes, undoInputRule} from "prosemirror-inputrules"
import {keymap, base} from "prosemirror-keymap";
import {dropCursor} from "prosemirror-dropcursor";
import {gapCursor} from "prosemirror-gapcursor";
import {history, undo, redo} from "prosemirror-history";
import {joinUp, joinDown, baseKeymap, toggleMark} from "prosemirror-commands";
import {
    replaceSelectionWith,
    toggleNodeAttribute
} from "./commands";

import {SegmentEditor} from "./SegmentEditor";
import {
    boldAndItalic,
    hard_break,
    mac,
    pageBreakPadding
} from "./editorUtils";

export const songSchema = new Schema({
    nodes: {
        doc: {content: 'song'},
        song: {
            ...orderedList,
            content: 'verse (verse|pageBreakPadding)*',
            attrs: {hasTwoColumns: {default: false}},
            toDOM: node => ['ol', {class: node.attrs.hasTwoColumns ? 'two-columns' : ''}, 0],
            parseDOM: [{
                tag: 'ol',
                getAttrs(dom) {
                    if (dom.classList.contains('two-columns')) {
                        return {hasTwoColumns: true}
                    }
                }
            }]
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
        text: {},
        hard_break,
        pageBreakPadding
    },
    marks: boldAndItalic
})

const insertHardBreak = replaceSelectionWith(songSchema.nodes.hard_break)

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
        [mac ? "Ctrl-Enter": null]: insertHardBreak,
        "Enter": splitListItem(songSchema.nodes.list_item),
    }),
    keymap(baseKeymap),
    keymap({ "Ctrl-r": toggleNodeAttribute(songSchema.nodes.verse, 'isRefrain') }),
    keymap({ "Ctrl-t": toggleNodeAttribute(songSchema.nodes.song, 'hasTwoColumns') }),
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