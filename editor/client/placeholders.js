import {insertAutoPageBreaks} from "./insertPageBreaks";

const placeholders = {
    english: {},
    dutch: {}
}

export function findPlaceHolders() {
    placeholders.firstReadingReference = document.querySelector(('.first-reading.reference')).pmEditor
    placeholders.dutch.firstReading   = document.querySelector('.first-reading .reading-editor.dutch').pmEditor
    placeholders.english.firstReading = document.querySelector('.first-reading .reading-editor.english').pmEditor

    placeholders.psalmReference = document.querySelector('.psalm .reference').pmEditor
    placeholders.dutch.psalmResponse = document.querySelector('.psalm .response.dutch').pmEditor
    placeholders.english.psalmResponse = document.querySelector('.psalm .response.english').pmEditor
    placeholders.dutch.psalm = document.querySelector('.psalm .reading-editor.dutch').pmEditor
    placeholders.english.psalm = document.querySelector('.psalm .reading-editor.english').pmEditor

    const verseBeforeGospel = document.querySelector('.verse-before-gospel')
    placeholders.verseBeforeGospelReference = verseBeforeGospel.querySelector('.reference').pmEditor
    placeholders.dutch.verseBeforeGospel   = verseBeforeGospel.querySelector('.dutch').pmEditor
    placeholders.english.verseBeforeGospel = verseBeforeGospel.querySelector('.english').pmEditor

    placeholders.gospelReference = document.querySelector('.gospel .reference').pmEditor
    placeholders.dutch.gospel = document.querySelector('.gospel .dutch.reading-editor').pmEditor
    placeholders.english.gospel = document.querySelector('.gospel .english.reading-editor').pmEditor

    console.log(placeholders)
}

export function placeReadings(readings) {
    console.log(readings)
    for (const lang of ['dutch', 'english']) {
        if (readings[lang]) {
            const data = readings[lang]
            const place = placeholders[lang]
            if (data.readings && data.readings.length > 0) {
                const reading = data.readings[0]
                if (reading.text) place.firstReading.setInnerHTML(reading.text)
                if (reading.reference) placeholders.firstReadingReference.setInnerHTML(reading.reference)
            }
            if (data.psalmResponse) {
                place.psalmResponse.setInnerHTML(data.psalmResponse)
            }
            if (data.psalm) {
                if (data.psalm.text) place.psalm.setInnerHTML(data.psalm.text)
                if (data.psalm.reference) placeholders.psalmReference.setInnerHTML(data.psalm.reference)
            }
            if (data.verseBeforeGospelReference) {
                placeholders.verseBeforeGospelReference.setInnerHTML(data.verseBeforeGospelReference)
            }
            if (data.verseBeforeGospel) {
                place.verseBeforeGospel.setInnerHTML(data.verseBeforeGospel)
            }
            if (data.gospel) {
                if (data.gospel.text) place.gospel.setInnerHTML(data.gospel.text)
                if (data.gospel.reference) placeholders.gospelReference.setInnerHTML(data.gospel.reference)
            }
        }
    }
    insertAutoPageBreaks()
    insertAutoPageBreaks()
}
