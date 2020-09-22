import _ from 'highland'
import fs from 'fs'
import util from 'util'
import stream from 'stream'

const finished = util.promisify(stream.finished)

function randInt(max) {
  // int([0, 1) * max)
  return Math.floor(Math.random() * Math.floor(max))
}

function pickFruit() {
  const fruits = [
    'apple',
    'orange',
    'kiwi',
    'pear',
    'grape',
    'fig',
    'cherry',
    'plum',
  ]
  return fruits[randInt(fruits.length)]
}

function line(id: number) {
  return `id: ${id}; fruit: ${pickFruit()}\n`
}

/**
 * Generate lines with dupes
 */
function* genLines(lineCount: number = 50, dupeEvery: number = 5) {
  for (let idx = 0; idx < lineCount; idx += 1) {
    yield line(idx)
    if (idx % dupeEvery == 0) {
      // Add dupe to filter out later
      yield line(randInt(lineCount))
    }
  }
}

async function generateTestFile(fileName: string, lineCount: number = 50) {
  const stream = _(genLines(lineCount)).pipe(fs.createWriteStream(fileName))
  return finished(stream)
}

interface NameValues {
  [name: string]: string
}
function parseNameValueLine(line: string): NameValues {
  return line.split(';').reduce<NameValues>((acc, cur) => {
    const nv = cur.split(':', 2).map(e => e.trim().toLowerCase())
    if (nv.length == 2 && nv[0].length > 0) {
      acc[nv[0]] = nv[1]
    }
    return acc
  }, {})
}

interface Record {
  id: string
  fruit: string
  line: number
}

/**
 * Returns func that parses line of name-value pairs to Record.
 * Also add incrementing line index.
 */
function lineParser(): (line: string) => Record {
  let curLine = 0
  return (line: string) => {
    const ob = parseNameValueLine(line)
    return { id: ob.id, fruit: ob.fruit, line: curLine++ }
  }
}

function badRecordFilter(rec: Record): Boolean {
  return !!rec.id
}

const seen = new Set<string>()

function dedupeFilter(rec: Record) {
  if (!seen.has(rec.id)) {
    seen.add(rec.id)
    return true
  }
  console.log(`DUPE: id ${rec.id}; line: ${rec.line}`)
  return false
}

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

/**
 * Create handler that simulates async batch operation
 */
function batchHandler() {
  let curBatch = 0
  let pending = 0
  async function handler(batch: Record[]) {
    const bid = `${curBatch}: ${JSON.stringify(batch.map(r => r.id))}`
    curBatch += 1
    pending += 1
    const timeout = randInt(400) + 1000
    console.log(
      `START batch: ${bid} (timeout: ${timeout}; pending: ${pending})}`
    )
    await wait(timeout)
    pending -= 1
    console.log(`FINISH batch: ${bid} (pending: ${pending})`)
    return bid
  }
  return handler
}

const handleBatch = batchHandler()

function processBatch(batch) {
  return _(async function(push, next) {
    try {
      const res = await handleBatch(batch)
      push(undefined, res)
    } catch (err) {
      push(err)
    }
    push(null, _.nil)
  })
}

async function processStream() {
  const fn = './highland_test.txt'
  await generateTestFile(fn).catch(console.error)
  console.log(`Wrote test data to ${fn}`)

  const BATCH_SIZE = 5
  const BATCH_INFLIGHT_LIMIT = 3

  const hls = _(fs.createReadStream(fn))
    .split()
    .doto(console.log)
    .map(lineParser())
    .filter(badRecordFilter)
    .filter(dedupeFilter)
    .batch(BATCH_SIZE)
    .map(processBatch)
    .parallel(BATCH_INFLIGHT_LIMIT)
    .doto(console.log)

  const prom = new Promise((resolve, reject) => {
    hls.done(() => {
      resolve()
    })

    hls.on('error', err => {
      reject(err)
    })
  })
  await prom.catch(err => console.error(`Whoops: ${err}`))
  console.log('Done')
}

processStream()
