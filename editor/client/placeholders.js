import {insertAutoPageBreaks} from "./insertPageBreaks";
import {SegmentEditor} from "./SegmentEditor";

const places = []

function addPlace(editor, ...keyPath) {
    if (editor instanceof SegmentEditor) {
        places.push({keyPath, editor})
    } else {
        console.error('Editor must be a SegmentEditor')
    }
}

export function findPlaceHolders() {
    const dq = (query) => document.querySelector(query)

    const firstReadingReferenceEditor = dq('.first-reading.reference').pmEditor
    addPlace(firstReadingReferenceEditor, 'english', 'readings', 0, 'reference')
    addPlace(firstReadingReferenceEditor, 'dutch',   'readings', 0, 'reference')
    addPlace(dq('.first-reading .reading-editor.dutch').pmEditor,   'dutch',   'readings', 0, 'text')
    addPlace(dq('.first-reading .reading-editor.english').pmEditor, 'english', 'readings', 0, 'text')

    const referenceEditor = dq('.psalm .reference').pmEditor
    addPlace(referenceEditor, 'english', 'psalm', 'reference')
    addPlace(referenceEditor, 'dutch',   'psalm', 'reference')
    addPlace(dq('.psalm .response.english').pmEditor, 'english', 'psalmResponse')
    addPlace(dq('.psalm .response.dutch').pmEditor,   'dutch',   'psalmResponse')
    addPlace(dq('.psalm .reading-editor.dutch').pmEditor,   'dutch',   'psalm', 'text')
    addPlace(dq('.psalm .reading-editor.english').pmEditor, 'english', 'psalm', 'text')

    const verseBeforeGospel = document.querySelector('.verse-before-gospel')
    const verseBeforeGospelReference = verseBeforeGospel.querySelector('.reference').pmEditor
    addPlace(verseBeforeGospelReference, 'english', 'verseBeforeGospelReference')
    addPlace(verseBeforeGospelReference, 'dutch',   'verseBeforeGospelReference')
    addPlace(verseBeforeGospel.querySelector('.dutch').pmEditor, 'dutch', 'verseBeforeGospel')
    addPlace(verseBeforeGospel.querySelector('.english').pmEditor, 'english', 'verseBeforeGospel')

    const gospelReference = document.querySelector('.gospel .reference').pmEditor
    addPlace(gospelReference, 'english', 'gospel', 'reference')
    addPlace(gospelReference, 'dutch',   'gospel', 'reference')
    addPlace(document.querySelector('.gospel .dutch.reading-editor').pmEditor,   'dutch',   'gospel', 'text')
    addPlace(document.querySelector('.gospel .english.reading-editor').pmEditor, 'english', 'gospel', 'text')

    console.log(places)
}

function resolvePath(object, path) {
    return path.reduce((target, cursor) => target[cursor], object)
}

export function placeReadings(readings) {
    console.log(readings)
    for (const {keyPath, editor} of places) {
        const html = resolvePath(readings, keyPath)
        if (html) editor.setInnerHTML(html)
    }
    insertAutoPageBreaks()
    insertAutoPageBreaks()
}
