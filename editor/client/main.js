import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {DOMParser} from "prosemirror-model"

import {songSchema, songPlugins} from "./songEditor";


window.addEventListener('load', function() {
    const content = document.createElement('ol')
    window.view = new EditorView(document.querySelector("#editor"), {
        state: EditorState.create({
            doc: DOMParser.fromSchema(songSchema).parse(content),
            plugins: songPlugins
        })
    })
})
