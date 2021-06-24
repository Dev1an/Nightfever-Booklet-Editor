import './insertPageBreaks'

import { SongEditor } from "./SongEditor";
import { PlainTextEditor } from "./PlainTextEditor"
import { ReadingEditor } from "./ReadingEditor";
import {
    insertAutoPageBreaks
} from "./insertPageBreaks";
import {findPlaceHolders} from "./placeholders";


const dynamicStyles = document.createElement('style')
const hideSecondReading = 'section .second-reading { display: none; }'
dynamicStyles.innerHTML = hideSecondReading

window.addEventListener('load', function() {
    document.querySelectorAll('.song-editor')
        .forEach(container => new SongEditor(container))

    document.querySelectorAll('.plaintext-editor')
        .forEach(container => new PlainTextEditor(container))

    document.querySelectorAll('.reading-editor')
        .forEach(container => new ReadingEditor(container))

    document.head.appendChild(dynamicStyles)
    const secondReadingToggle = document.querySelector('.controls input.second-reading-toggle')
    secondReadingToggle.addEventListener('click', toggleSecondReading)

    findPlaceHolders()

    insertAutoPageBreaks()
})

function toggleSecondReading(event) {
    const toggle = event.target
    const shouldShowSecondReading = toggle.checked
    dynamicStyles.innerHTML = shouldShowSecondReading ? '' : hideSecondReading
    insertAutoPageBreaks()
}