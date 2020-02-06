import {boldAndItalic, hard_break, SegmentEditor, mac} from "./SegmentEditor";
import {inputRules, smartQuotes, undoInputRule} from "prosemirror-inputrules";
import {keymap} from "prosemirror-keymap";
import {history, redo, undo} from "prosemirror-history";
import {baseKeymap, joinDown, joinUp, toggleMark} from "prosemirror-commands";
import {dropCursor} from "prosemirror-dropcursor";
import {gapCursor} from "prosemirror-gapcursor";
import {Schema} from "prosemirror-model";
import {replaceSelectionWith} from "./commands";
import {Plugin} from "prosemirror-state";
import {
    Decoration,
    DecorationSet
} from "prosemirror-view";

const schema = new Schema({
    nodes: {
        doc: {content: 'paragraph+'},
        paragraph: {
            content: "(text|hard_break)*",
            parseDOM: [{tag: "p"}],
            toDOM() { return ['p',0] }
        },
        text: {},
        hard_break
    },
    marks: boldAndItalic
})

const insertHardBreak = replaceSelectionWith(schema.nodes.hard_break)
const placeholderPlugin = new Plugin({
    props: {
        decorations(state) {
            const paragraphs = state.doc.content
            const firstParagraph = paragraphs.content[0]
            if (paragraphs.childCount == 1 && firstParagraph.content.size == 0) {
                const placeholder = document.createElement('span')
                placeholder.appendChild(new Text('Paste reading here...'))
                placeholder.className = 'placeholder'
                return DecorationSet.create(state.doc, [Decoration.widget(1, placeholder)])
            }
        }
    }
})

const plugins = [
    inputRules({ rules: smartQuotes }),
    keymap({
        "Mod-z": undo,
        "Shift-Mod-z": redo,
        "Backspace": undoInputRule,
        "Alt-ArrowUp": joinUp,
        "Alt-ArrowDown": joinDown,
        "Mod-b": toggleMark(schema.marks.strong),
        "Mod-B": toggleMark(schema.marks.strong),
        "Mod-i": toggleMark(schema.marks.em),
        "Mod-I": toggleMark(schema.marks.em),
        "Mod-Enter":   insertHardBreak,
        "Shift-Enter": insertHardBreak,
        [mac ? "Ctrl-Enter": "Enter"]: insertHardBreak,
    }),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    history(),
    placeholderPlugin
]

export class ReadingEditor extends SegmentEditor {
    constructor(content) {
        super(content, {schema, plugins})
    }
}