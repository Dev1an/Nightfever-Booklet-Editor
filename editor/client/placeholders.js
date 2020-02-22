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

function addPlaces(dictionary, path = []) {
    for (const [field, value] of Object.entries(dictionary)) {
        if (value instanceof SegmentEditor) {
            addPlace(value, ...path.concat(field))
        } else {
            addPlaces(value, path.concat(field))
        }
    }
}

export function findPlaceHolders() {
    const dq = (query) => document.querySelector(query)

    for (const language of ['english', 'dutch']) {
        addPlaces({
            readings: [
                {
                    text: dq(`.first-reading .reading-editor.${language}`).pmEditor,
                    reference: dq('.first-reading.reference').pmEditor
                }
            ],
            psalm: {
                text: dq(`.psalm .reading-editor.${language}`).pmEditor,
                reference: dq('.psalm .reference').pmEditor
            },
            psalmResponse: dq(`.psalm .response.${language}`).pmEditor,
            verseBeforeGospel: dq(`.verse-before-gospel .${language}`).pmEditor,
            verseBeforeGospelReference: dq('.verse-before-gospel .reference').pmEditor,
            gospel: {
                text: dq(`.gospel .reading-editor.${language}`).pmEditor,
                reference: dq('.gospel .reference').pmEditor
            }
        }, [language])
    }

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
