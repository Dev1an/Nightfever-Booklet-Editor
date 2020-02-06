import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"

export class SegmentEditor extends EditorView {
    constructor(container, editorStateConfig) {
        const properties = {
            state: EditorState.create(editorStateConfig)
        }
        super({mount: container}, properties)
    }
}
