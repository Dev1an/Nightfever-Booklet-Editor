import './insertPageBreaks'

import { SongEditor } from "./SongEditor";
import { ReferenceEditor } from "./ReferenceEditor"

window.addEventListener('load', function() {
    document.querySelectorAll('.song-editor')
        .forEach(container => new SongEditor(container))

    document.querySelectorAll('.reference-editor')
        .forEach(container => new ReferenceEditor(container))
})
