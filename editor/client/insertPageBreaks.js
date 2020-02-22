let section;
window.addEventListener('load', setSection)

function removePageBreaks() {
    document.querySelectorAll('.prefer-pagebreak').forEach( pagebreak => {
        pagebreak.classList.remove('pagebreak-padding')
        pagebreak.classList.add('unused')
    })
    document.querySelectorAll('span.splitted').forEach( text =>
        text.parentNode.replaceChild(text.childNodes[0], text)
    )
    document.querySelectorAll('.pagebreak-padding').forEach( pagebreak => {
        const parent = pagebreak.parentNode
        parent.removeChild(pagebreak)
        parent.normalize()
    })
}

export function insertAutoPageBreaks() {
    removePageBreaks()
    const manualBreaks = Array.from(document.querySelectorAll('.prefer-pagebreak.unused')).map(node => ({node, offset: sectionOffset(node)}))
    manualBreaks.sort((left, right) => left.offset - right.offset)
    for (let page = 0; page < 3; page++) {
        insertAutoPageBreak(page, manualBreaks)
    }
}

window.iAPB = insertAutoPageBreaks

function insertAutoPageBreak(page, manualBreaks) {
    const mm = getPixelsPerMillimeter()
    const marge = (210 * (page+1) - 10) * mm
    const nextPageMarge = marge + 20*mm

    // const manualPageBreak;
    while (manualBreaks.length > 0) {
        if (manualBreaks[0].offset < marge) {
            const manualPageBreak = manualBreaks.shift().node
            const autoPagebreak = insertPageBreakBefore(manualPageBreak, nextPageMarge, mm)
            autoPagebreak.classList.add('prefer-pagebreak')
            manualPageBreak.parentNode.removeChild(manualPageBreak)
        } else {
            break
        }
    }
    // console.log(`Inserting automatic page break on page ${page}`)
    for (const block of findOverflowNodes(marge, nextPageMarge)) {
        if (block.nodeType === Node.TEXT_NODE) {
            const textNode = splitText(block, marge)
            insertPageBreakBefore(textNode, nextPageMarge, mm)
        } else {
            insertPageBreakBefore(block, nextPageMarge, mm)
        }
    }
}

function splitText(node, marge) {
    const range = document.createRange()
    const splitPosition = binarySearch(node.nodeValue.length, liesBeforeMarge)
    let secondHalf;
    if (splitPosition !== 0) {
        secondHalf = node.splitText(splitPosition)
    } else {
        // No need to split
        if (node.previousSibling === null) {
            return node.parentNode
        } else {
            secondHalf = node
            node = node.previousSibling
        }
    }

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
    const height = (marge - offsetTop)/mm
    space.style.height = height + 'mm'
    return space
}

function findOverflowNodes(endOfPage, startOfNextPage) {
    return smallestPartOf(
        document.querySelectorAll('section > *:not(.page-indicators)').values()
    )

    function smallestPartOf(blocks) {
        for (const block of blocks) {
            const offsets = sectionOffsets(block)
            if (block.className && block.classList.contains('pagebreak-padding')) continue;
            if (offsets.bottom > endOfPage && offsets.top < startOfNextPage) {
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
        return blocks.length > 0 ? [blocks[blocks.length - 1]] : []
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

function sectionOffsets(element) {
    if (element.nodeType === Node.TEXT_NODE) {
        const range = document.createRange()
        range.selectNode(element)
        element = range
    }
    const sectionY = section.getBoundingClientRect().y
    const elementRect = element.getBoundingClientRect()
    return {
        top: elementRect.top - sectionY,
        bottom: elementRect.bottom - sectionY
    }
}