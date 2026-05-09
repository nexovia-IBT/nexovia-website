import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const ROOTS = ['app', 'components']
const EXT = new Set(['.tsx', '.ts', '.jsx', '.js'])

async function walk(dir: string, out: string[] = []): Promise<string[]> {
  let entries
  try { entries = await fs.readdir(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) await walk(p, out)
    else if (EXT.has(path.extname(e.name))) out.push(p)
  }
  return out
}

type Change = { original: string; edited: string }
type Result = { original: string; edited: string; status: 'ok' | 'unchanged' | 'not-found' | 'ambiguous'; file?: string }
type SearchVariant = { search: string; replacement: (content: string, index: number, search: string) => string }
type Match = { file: string; index: number; search: string; replacement: string }

function compact(value: string) {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

function escapeSingleQuoted(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function escapeDoubleQuoted(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function escapeTemplateQuoted(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replaceAll(String.fromCharCode(96), '\\' + String.fromCharCode(96))
    .replace(/\$/g, '\\$')
}

function escapeJsxText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;')
}

function replacementForContext(content: string, index: number, search: string, edited: string) {
  const before = content[index - 1]
  const after = content[index + search.length]

  if (before === "'" && after === "'") return escapeSingleQuoted(edited)
  if (before === '"' && after === '"') return escapeDoubleQuoted(edited)
  if (before === String.fromCharCode(96) && after === String.fromCharCode(96)) return escapeTemplateQuoted(edited)

  return escapeJsxText(edited)
}

function searchVariants(original: string, edited: string): SearchVariant[] {
  const variants: SearchVariant[] = []
  const seen = new Set<string>()
  const add = (search: string, replacement: SearchVariant['replacement']) => {
    if (!search || seen.has(search)) return
    seen.add(search)
    variants.push({ search, replacement })
  }

  add(original, (content, index, search) => replacementForContext(content, index, search, edited))
  add(escapeSingleQuoted(original), () => escapeSingleQuoted(edited))
  add(escapeDoubleQuoted(original), () => escapeDoubleQuoted(edited))
  add(escapeTemplateQuoted(original), () => escapeTemplateQuoted(edited))
  add(escapeJsxText(original), () => escapeJsxText(edited))

  return variants
}

function findMatches(files: string[], fileContents: Record<string, string>, original: string, edited: string) {
  const matches: Match[] = []
  const variants = searchVariants(original, edited)

  for (const f of files) {
    const content = fileContents[f]
    for (const variant of variants) {
      let from = 0
      while (true) {
        const index = content.indexOf(variant.search, from)
        if (index < 0) break
        matches.push({
          file: f,
          index,
          search: variant.search,
          replacement: variant.replacement(content, index, variant.search),
        })
        from = index + variant.search.length
      }
    }
  }

  return matches
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as { changes?: Change[] } | null
  if (!body || !Array.isArray(body.changes)) {
    return NextResponse.json({ ok: false, error: 'expected { changes: [{original, edited}] }' }, { status: 400 })
  }

  const cwd = process.cwd()
  const files: string[] = []
  for (const r of ROOTS) await walk(path.join(/*turbopackIgnore: true*/ cwd, r), files)
  const fileContents: Record<string, string> = {}
  for (const f of files) fileContents[f] = await fs.readFile(f, 'utf8')

  const results: Result[] = []
  for (const { original, edited } of body.changes) {
    const orig = compact(original)
    const next = compact(edited)
    if (!orig) continue
    if (orig === next) { results.push({ original, edited, status: 'unchanged' }); continue }

    const matches = findMatches(files, fileContents, orig, next)

    if (matches.length === 0) { results.push({ original, edited, status: 'not-found' }); continue }
    if (matches.length > 1) { results.push({ original, edited, status: 'ambiguous' }); continue }

    const match = matches[0]
    const content = fileContents[match.file]
    fileContents[match.file] = content.slice(0, match.index) + match.replacement + content.slice(match.index + match.search.length)
    results.push({ original, edited, status: 'ok', file: path.relative(cwd, match.file) })
  }

  const touched = new Set(results.filter(r => r.status === 'ok' && r.file).map(r => r.file!))
  for (const rel of touched) {
    const abs = path.join(/*turbopackIgnore: true*/ cwd, rel)
    await fs.writeFile(abs, fileContents[abs], 'utf8')
  }

  return NextResponse.json({ ok: true, results, written: Array.from(touched) })
}
