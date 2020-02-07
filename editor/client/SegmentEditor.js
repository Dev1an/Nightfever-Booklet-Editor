import {EditorState} from "prosemirror-state"
import {EditorView} from "./prosemirror-view"
import {DOMParser} from "prosemirror-model"
import {insertAutoPageBreaks} from "./insertPageBreaks";

export class SegmentEditor extends EditorView {
    constructor(container, editorStateConfig) {
        let view;
        const properties = {
            state: EditorState.create({
                ...editorStateConfig,
                doc: DOMParser.fromSchema(editorStateConfig.schema).parse(container)
            }),
            dispatchTransaction(transaction) {
                const changeComesFromPageBreaker = transaction.docChanged && view.dom.querySelector('.inserted-by-pagebreaker') !== null
                if (changeComesFromPageBreaker && this.savedSelection !== null) {
                    const selection = this.savedSelection.resolve(transaction.doc)
                    transaction = transaction.setSelection(selection)
                    this.savedSelection = null
                }
                const newState = view.state.apply(transaction)
                view.updateState(newState)
                if (transaction.docChanged && !changeComesFromPageBreaker) {
                    this.savedSelection = transaction.selection.getBookmark()
                    insertAutoPageBreaks()
                }
            },
            handleScrollToSelection(view) { return true }
        }
        super({mount: container}, properties)
        view = this
        this.savedSelection = null
    }
}