import FlexSearch from 'flexsearch'
import Resources from "./resources.js"

// Get correct logger
const isWebApp = ((typeof window !== 'undefined') && window.isWebApp) || false
var logger;
if (!isWebApp) {
  const log = require('electron-log')
  logger = log.scope('Search')
} else {
  logger = console
}

var archive
var chapterIndex;

function giveArchive(care) {
  archive = care
}

function clearChapterIndex() {
  chapterIndex = undefined
}

function buildChapterIndex(archive){
  logger.info("Building new search index")
  chapterIndex = new FlexSearch({
    doc: {
      id: 'key',
      field: ['mspa_num', 'content', 'command'],
      tag: 'chapter'
    }
  })

  const storytextList = Object.keys(archive.mspa.story).map(page_num => {
    const page = archive.mspa.story[page_num]
    return {
      key: page_num,
      mspa_num: page_num,
      command: page.title,
      chapter: Resources.getChapter(page_num),
      content: page.content
    }
  })

  logger.info("Populating search index with", storytextList.length, "page documents")
  chapterIndex.add(storytextList)

  const footnoteList = Object.keys(archive.footnotes.story).map(page_num => {
    return {
      key: `${page_num}-notes`, // Duplicate keys are not allowed.
      mspa_num: page_num,
      chapter: Resources.getChapter(page_num),
      content: archive.footnotes.story[page_num].map(
        note => note.content
      ).join("###")
    }
  })

  logger.info("Populating search index with", footnoteList.length, "footnote documents")
  chapterIndex.add(footnoteList)
}

function doSearch(payload) {
  if (chapterIndex == undefined)
      buildChapterIndex(archive || window.vm.archive)

  if (payload == undefined)
    return // Just wanted to ensure the index

  const keyAlias = {
    "mc0001": 1892.5,
    "jb2_000000": 135.5,
    "pony": 2838.5,
    "pony2": 6517.5,
    "darkcage": 6273.5,
    "darkcage2": 6927.5
  }

  const limit = 1000

  function separateNonConsecutive(array, delimiter) {
    // Given an array and a delimiter, separate the non-consecutive members of the array.
    // > separateNonConsecutive([1, 2, 3, 5], "f")
    // [1, 2, 3, "f", 5]

    let next_v = array[0]
    const newarray = []
    for (const i in array) {
      const v = array[i]
      if (v != next_v) newarray.push(delimiter)
      newarray.push(v)
      next_v = v + 1
    }
    return newarray
  }

  // Generate results from FlexSearch object
  const sortFn = (a, b) => {
    const aKey = Number.isNaN(parseInt(a.key)) ? keyAlias[a.key] : parseInt(a.key)
    const bKey = Number.isNaN(parseInt(b.key)) ? keyAlias[a.key] : parseInt(b.key)
    return (payload.sort == 'desc')
      ? aKey > bKey ? -1 : aKey < bKey ? 1 : 0
      : aKey < bKey ? -1 : aKey > bKey ? 1 : 0
  }

  // "Where" function to make sure any IN: tag matches the *start* of the chapter
  const where = payload.chapter
    ? (item => item.chapter.toUpperCase().indexOf(payload.chapter) == 0)
    : undefined

  // Run search
  const searchOpts = {
    field: ['command', 'content'],
    where,
    limit,
    sort: sortFn
  }
  const results = chapterIndex.search(payload.input, searchOpts)

  const foundText = []
  for (const page of results) {
    const intraPageSearch = new FlexSearch({
      doc: {
        id: 'index',
        field: ['index', 'content']
      }
    })

    // Split page by breaks, and also split apart very long paragraphs by sentences.
    const page_lines = page.content.split('<br />').map(line => {
      // Detect very long paragraphs, but avoid splitting lines with long or complex attributes.
      const temp_node = document.createElement('div')
      temp_node.innerHTML = line
      const line_text = temp_node.innerText

      if (line_text.length > 160) {
        return line_text.split(/(?<=\. )/).map(substr => { // non-consuming split
          const span = (temp_node.children[0] || temp_node).cloneNode()
          span.innerText = substr
          return span.outerHTML
        })
      } else {
        return [line]
      }
    }).flat()

    for (let i = 0; i < page_lines.length; i++) {
      intraPageSearch.add({index: i, content: page_lines[i]})
    }
    // Search matching lines *again* for input and return matching indexes
    const intraResults = intraPageSearch.search(payload.input, {limit, bool: "or"})
    var indexes = intraResults.map(k => k.index)

    //
    if (indexes.length > 0)
      indexes.push(0) // always include first line, primarily for pesterlog formatting reasons

    const spread_indexes = Array.from(
      indexes.reduce((acc, i) => {
        const spread = 2
        for (let j = Math.max(0, i - spread); j < Math.min(page_lines.length, i + spread); j++) {
          acc.add(j)
        }
        return acc
      }, new Set())
    ).sort()

    const matching_lines = separateNonConsecutive(
      spread_indexes.filter(i => page_lines[i]),
      "..."
    ).map(i => i == '...' ? i : page_lines[i])

    if (matching_lines.length > 0) {
      foundText.push({
        key: page.key,
        mspa_num: page.mspa_num,
        lines: matching_lines
      })
    } else {
      // Couldn't find text within match, despite having already matched. Matching text is spread between lines.
      // Behaviour: Push stub (might be title or footnote).
      foundText.push({
        key: page.key,
        mspa_num: page.mspa_num,
        lines: [] // page_lines
      })
    }
  }
  return foundText
}

function registerIpc(ipc) {
  // Register IPC (usually main, but renderer in webapp) to handle search queries.
  ipc.handle('search', async (event, payload) => {
    return doSearch(payload)
  })
}

export default {
  buildChapterIndex,
  doSearch,
  registerIpc,
  giveArchive,
  clearChapterIndex
}
