import { readFileSync, writeFileSync } from 'fs'

const filePath = new URL('../src/data/elements.ts', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const raw = readFileSync(filePath, 'utf8')
const eol = raw.includes('\r\n') ? '\r\n' : '\n'
const lines = raw.split(eol)

let count = 0
const fixed = lines.map((line, i) => {
  // Only process description: '...' lines
  if (!line.includes("description: '")) return line

  // Find description: ' at start, then scan for the closing ' followed by ,
  const prefix = "    description: '"
  const prefixIdx = line.indexOf("description: '")
  if (prefixIdx === -1) return line

  const contentStart = prefixIdx + "description: '".length
  // The content ends at the last ',' on the line (trailing comma pattern)
  // But content may contain apostrophes we need to escape
  // The line should end with  '  or ',
  const lineEnd = line.trimEnd()
  const endsWithComma = lineEnd.endsWith("',")

  // Extract content: everything between first ' after "description: " and the trailing ',
  let content
  let trailingSuffix
  if (endsWithComma) {
    content = line.substring(contentStart, line.lastIndexOf("',"))
    trailingSuffix = "',"
  } else if (lineEnd.endsWith("'")) {
    content = line.substring(contentStart, line.lastIndexOf("'"))
    trailingSuffix = "'"
  } else {
    return line
  }

  // Now content should be the description text - escape any unescaped single quotes
  // An unescaped ' is one not preceded by backslash
  if (!content.includes("'")) return line

  const fixedContent = content.replace(/(?<!\\)'/g, "\\'")
  if (fixedContent === content) return line

  count++
  console.log(`Line ${i + 1}: "${content.substring(0, 40)}..."`)

  return line.substring(0, contentStart) + fixedContent + trailingSuffix + (line.endsWith('\r') ? '\r' : '')
})

writeFileSync(filePath, fixed.join(eol), 'utf8')
console.log(`Fixed ${count} description lines with apostrophes`)
