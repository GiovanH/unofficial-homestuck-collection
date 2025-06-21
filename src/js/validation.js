const crc = require('crc')
const fs = require('fs')
const _path = require('path')
const path = _path.posix || _path

function * crawlFileTree(root, subroot = './', ignore = []) {
  // Generator for all file leaves

  const dir = fs.opendirSync(path.join(root, subroot))

  const effective_ignore = [...ignore, 'Thumbs.db']

  let dirent
  // eslint-disable-next-line no-cond-assign
  while (dirent = dir.readSync()) {
    if (!effective_ignore.includes(dirent.name)) {
      if (dirent.isDirectory()) {
        yield * crawlFileTree(root, path.join(subroot, dirent.name), ignore)
      } else {
        yield path.join(subroot, dirent.name)
      }
    }
  }
  dir.close()
}

function buildTable(assetDir, ignore = []) {
  const all_paths = []
  const checksums = {}
  for (const p of crawlFileTree(assetDir, './', ignore)) {
    all_paths.push(p)

    const abs_path = path.join(assetDir, p)
    const sum = crc.crc32(fs.readFileSync(abs_path)).toString(16)
    checksums[p] = sum
  }

  const table = {
    // all_paths,
    checksums
  }
  return table
}

/**
 * @param {string} assetDir 
 * @param {object} table 
 * @param {Array<string>} ignore 
 * @param {object} channel 
 * @returns {object}
 */
async function validateFiles(assetDir, table, ignore, channel) {
  const expected_paths = new Set(Object.keys(table.checksums))
  const seen_paths = new Set()

  const extra_paths = []
  const mismatch_files = []

  let abort = false

  if (channel) {
    channel.abort = function() {
      abort = true
    }
  }

  const all_asset_paths = [...crawlFileTree(assetDir, './', ignore)]

  channel && channel.total_paths(all_asset_paths.length)

  var i = 0
  for (const p of all_asset_paths) {
    if (abort) {
      console.log("Aborting (signal)")
      return
    }

    seen_paths.add(p)
    channel && channel.pos(i, p)

    if (expected_paths.has(p)) {
      const abs_path = path.join(assetDir, p)
      const body = await fs.promises.readFile(abs_path)
      const sum = crc.crc32(body).toString(16)
      if (table.checksums[p] == sum) {
        // console.info("OK", p, sum)
      } else {
        console.warn("Path on disk does not match checksum", p, sum, table.checksums[p])
        channel && channel.mismatch_path(p)
        mismatch_files.push(p)
      }
    } else {
      channel && channel.extra_path(p)
      console.warn("Path on disk but not in table", p)
      extra_paths.push(p)
    }
    i += 1
  }

  const missing_paths = [...expected_paths].filter(p => !seen_paths.has(p))

  const state = {
    mismatch_files,
    missing_paths,
    extra_paths
  }
  return state
}

// const assetDir = "D:/UHC/Asset Pack V2/archive"
// fs.writeFileSync('table.json', JSON.stringify(buildTable(assetDir)))

// const table = JSON.parse(fs.readFileSync('table.json'))
// validateFiles(assetDir, table)

if (require.main === module) {
  const asset_root = process.argv[2]
  const out_path = process.argv[3]

  const table = buildTable(asset_root, ['mods'])
  fs.writeFileSync(out_path, JSON.stringify(table, null, 2))
}

module.exports = {
  crawlFileTree,
  buildTable,
  validateFiles
}
