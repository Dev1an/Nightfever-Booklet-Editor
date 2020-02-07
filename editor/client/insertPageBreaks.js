let section;
window.addEventListener('load', setSection)

function removePageBreaks() {
    document.querySelectorAll('span.splitted').forEach(text => {
        text.parentNode.replaceChild(text.childNodes[0], text)
    })
    document.querySelectorAll('.pagebreak-padding').forEach(
        pagebreak => pagebreak.parentNode.removeChild(pagebreak)
    )
}

export function insertAutoPageBreaks() {
    removePageBreaks()
    for (let page = 0; page < 3; page++) {
        insertAutoPageBreak(page)
    }
}

window.iAPB = insertAutoPageBreaks

function insertAutoPageBreak(page) {
    const mm = getPixelsPerMillimeter()
    const marge = (210 * (page+1) - 10) * mm

    const manualPageBreak = document.querySelector('.prefer-pagebreak')
    if (manualPageBreak && sectionOffset(manualPageBreak) < marge) {
        // console.log(`found manual page break on page ${page}`)
        insertPageBreakBefore(manualPageBreak, marge, mm)
        manualPageBreak.parentNode.removeChild(manualPageBreak)
    } else {
        // console.log(`Inserting automatic page break on page ${page}`)
        for (const block of findOverflowNodes(marge)) {
            if (block.nodeType === Node.TEXT_NODE) {
                const textNode = splitText(block, marge)
                insertPageBreakBefore(textNode, marge, mm)
            } else {
                insertPageBreakBefore(block, marge, mm)
            }
        }
    }
}

function splitText(node, marge) {
    const range = document.createRange()
    const secondHalf = node.splitText(
        binarySearch(node.nodeValue.length, liesBeforeMarge)
    )
    const span = document.createElement('span')
    node.parentNode.replaceChild(span, node)
    span.appendChild(node)
    span.className = 'splitted'
    return secondHalf

    function liesBeforeMarge(letterIndex) {
        range.setStart(node, letterIndex)
        range.setEnd(node, letterIndex+1)
        return sectionOffset(range, true) > marge
    }
}

/*
 * Return i such that !pred(i - 1) && pred(i) && 0 <= i <= length.
 */
function binarySearch(length, pred) {
    let lo = -1, hi = length;
    while (1 + lo < hi) {
        const mi = lo + ((hi - lo) >> 1);
        if (pred(mi)) hi = mi;
        else lo = mi;
    }
    return hi;
}

export function createPageBreakPadding(height) {
    const space = document.createElement('div')
    space.className = 'pagebreak-padding'
    if (height) space.style.height = height
    return space
}

function insertPageBreakBefore(block, marge, mm) {
    const space = createPageBreakPadding()
    space.classList.add('inserted-by-pagebreaker')
    block.parentNode.insertBefore(space, block)
    const offsetTop = sectionOffset(space, false)
    const correction = (marge - offsetTop)/mm
    space.style.height = (20 + correction) + 'mm'
}

function findOverflowNodes(marge) {
    return smallestPartOf(
        document.querySelectorAll('section > *:not(.page-indicators)').values()
    )

    function smallestPartOf(blocks) {
        for (const block of blocks) {
            if (sectionOffset(block, true) > marge) {
                if (isFlex(block)) {
                    return Array
                        .from(block.children)
                        .flatMap( column => smallestPartOf([column]) )
                } else {
                    if (shouldSplit(block)) {
                        return smallestPartOf(block.childNodes)
                    } else {
                        return [block]
                    }
                }
            }
        }
        return []
    }

    function shouldSplit(block) {
        return mayPageBreak(block) && block.hasChildNodes()
    }
}

function mayPageBreak(block) {
    if (block.classList && (block.classList.contains('avoid-pagebreak') || block.classList.contains('two-columns') || block.classList.contains('plaintext-editor')))
        return false
    return true
}

function isFlex(block) {
    return block.classList && block.classList.contains('flex')
}

function getPixelsPerMillimeter() {
    return section.clientWidth / 148
}

export function setSection() {
    section = document.querySelector('section')
}

function sectionOffset(element, includeHeight) {
    if (element.nodeType === Node.TEXT_NODE) {
        const range = document.createRange()
        range.selectNode(element)
        element = range
    }
    const sectionY = section.getBoundingClientRect().y
    const elementRect = element.getBoundingClientRect()
    return (includeHeight===true ? elementRect.bottom : elementRect.y) - sectionY;
}