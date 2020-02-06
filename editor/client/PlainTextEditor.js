import { Schema }              from "prosemirror-model";
import { Plugin }              from "prosemirror-state";
import { keymap }              from "prosemirror-keymap";
import { history, redo, undo } from "prosemirror-history";
import { undoInputRule }       from "prosemirror-inputrules";
import { baseKeymap }          from "prosemirror-commands";
import { gapCursor }           from "prosemirror-gapcursor";
import { dropCursor }          from "prosemirror-dropcursor";
import { DecorationSet, Decoration } from "prosemirror-view";

const schema = new Schema({
    nodes: {
        doc: {content: 'text*'},
        text: {}
    },
    marks: {}
})

const placeholderPlugin = new Plugin({
    props: {
        decorations(state) {
            if (state.doc.childCount === 0)
                return DecorationSet.create(state.doc, [Decoration.widget(0, document.createTextNode('Reference here'))])
        }
    }
})

const editorStateConfig = {
    schema,
    plugins: [
        keymap({
            "Mod-z": undo,
            "Shift-Mod-z": redo,
            "Backspace": undoInputRule,
        }),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        history(),
        placeholderPlugin
    ]
}

import { SegmentEditor } from "./SegmentEditor";

export class PlainTextEditor extends SegmentEditor {
    constructor(container) {
        super(container, editorStateConfig)
    }
}