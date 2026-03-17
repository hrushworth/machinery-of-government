import { readFileSync, writeFileSync } from 'fs'

const filePath = new URL('../src/data/elements.ts', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
let raw = readFileSync(filePath, 'utf8')

const marker = "description: '"
let result = ''
let i = 0
let fixCount = 0

while (i < raw.length) {
  if (raw.startsWith(marker, i)) {
    result += marker
    i += marker.length
    let inStr = ''
    while (i < raw.length) {
      const ch = raw[i]
      const backslash = '\\'
      if (ch === backslash) {
        // Already escaped - keep as-is
        inStr += ch + raw[i + 1]
        i += 2
      } else if (ch === "'") {
        const next = raw[i + 1]
        if (next === ',' || next === '\n' || next === '\r') {
          // Closing quote
          inStr += ch
          i++
          break
        } else {
          // Apostrophe mid-string - escape it
          inStr += "\\'"
          i++
          fixCount++
        }
      } else {
        inStr += ch
        i++
      }
    }
    result += inStr
  } else {
    result += raw[i]
    i++
  }
}

writeFileSync(filePath, result, 'utf8')
console.log('Fixed', fixCount, 'apostrophes')
