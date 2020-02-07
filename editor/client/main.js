import './insertPageBreaks'

import { SongEditor } from "./SongEditor";
import { PlainTextEditor } from "./PlainTextEditor"
import { ReadingEditor } from "./ReadingEditor";
import {
    insertAutoPageBreaks,
    setSection
} from "./insertPageBreaks";

window.addEventListener('load', function() {
    document.querySelectorAll('.song-editor')
        .forEach(container => new SongEditor(container))

    document.querySelectorAll('.plaintext-editor')
        .forEach(container => new PlainTextEditor(container))

    document.querySelectorAll('.reading-editor')
        .forEach(container => new ReadingEditor(container))

    insertAutoPageBreaks()
})
