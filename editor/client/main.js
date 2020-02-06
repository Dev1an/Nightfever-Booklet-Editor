import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {DOMParser, DOMSerializer} from "prosemirror-model"
import './insertPageBreaks'

import {songSchema, songPlugins} from "./songEditor";

const content = document.createElement('ol')

window.addEventListener('load', function() {
    window.view = new EditorView(document.querySelector(".entrance-editor"), {
        state: EditorState.create({
            doc: DOMParser.fromSchema(songSchema).parse(content),
            plugins: songPlugins,
        }),
    })
})
