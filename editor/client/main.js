import './insertPageBreaks'

import { SongEditor } from "./songEditor";

window.addEventListener('load', function() {
    document.querySelectorAll('.song-editor')
        .forEach(container => new SongEditor(container))
})
