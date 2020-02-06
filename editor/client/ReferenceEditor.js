import { Schema }              from "prosemirror-model";
import { Plugin }              from "prosemirror-state";
import { keymap }              from "prosemirror-keymap";
import { history, redo, undo } from "prosemirror-history";
import { undoInputRule }       from "prosemirror-inputrules";
import { baseKeymap }          from "prosemirror-commands";
import { gapCursor }           from "prosemirror-gapcursor";
import { dropCursor }          from "prosemirror-dropcursor";
import { DecorationSet, Decoration } from "prosemirror-view";

export const referenceSchema = new Schema({
    nodes: {
        doc: {content: 'text*'},
        text: {}
    },
    marks: {}
})

function placeholderPlugin(text) {
    return new Plugin({
        props: {
            decorations(state) {
                let doc = state.doc
                console.log(doc.childCount)
                if (doc.childCount == 0)
                    return DecorationSet.create(doc, [Decoration.widget(0, document.createTextNode(text))])
            }
        }
    })
}

const editorStateConfig = {
    schema: referenceSchema,
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
        placeholderPlugin('Reference here')
    ]
}

import { SegmentEditor } from "./SegmentEditor";

export class ReferenceEditor extends SegmentEditor {
    constructor(container) {
        super(container, editorStateConfig)
    }
}