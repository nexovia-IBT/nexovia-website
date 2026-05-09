'use client'

import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'nexovia-copy-edits'
const ORIGINALS_KEY = 'nexovia-copy-originals'
const LEGACY_ENABLE_KEY = 'nexovia-copy-edit-enabled'
const TEXT_NODE_ATTR = 'data-copy-text-node'
const COPY_TEXT_SELECTOR = `[${TEXT_NODE_ATTR}="true"]`
const SKIP_TEXT_SELECTOR = [
  '[data-copy-editor]',
  'script',
  'style',
  'noscript',
  'template',
  'svg',
  'canvas',
  'video',
  'audio',
  'picture',
  'source',
  'iframe',
].join(',')

function readMap(key: string): Record<string, string> {
  try { return JSON.parse(window.localStorage.getItem(key) ?? '{}') } catch { return {} }
}

function writeMap(key: string, map: Record<string, string>) {
  window.localStorage.setItem(key, JSON.stringify(map))
}

function compactText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function shouldWrapTextNode(node: Text) {
  const parent = node.parentElement
  if (!parent) return false
  if (parent.closest(SKIP_TEXT_SELECTOR)) return false
  if (parent.closest(COPY_TEXT_SELECTOR)) return false
  return compactText(node.nodeValue ?? '').length > 0
}

function createTextSpan(value: string, parent: HTMLElement) {
  const span = document.createElement('span')
  span.dataset.copyTextNode = 'true'
  span.dataset.copySourceTag = parent.tagName.toLowerCase()
  span.textContent = compactText(value)
  return span
}

function wrapEditableTextNodes(root: ParentNode = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return shouldWrapTextNode(node as Text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    },
  })

  const textNodes: Text[] = []
  let node = walker.nextNode()
  while (node) {
    textNodes.push(node as Text)
    node = walker.nextNode()
  }

  textNodes.forEach((textNode) => {
    const parent = textNode.parentElement
    if (!parent || !shouldWrapTextNode(textNode)) return

    const raw = textNode.nodeValue ?? ''
    const leading = raw.match(/^\s*/)?.[0] ?? ''
    const trailing = raw.match(/\s*$/)?.[0] ?? ''
    const fragment = document.createDocumentFragment()

    if (leading) fragment.appendChild(document.createTextNode(leading))
    fragment.appendChild(createTextSpan(raw, parent))
    if (trailing) fragment.appendChild(document.createTextNode(trailing))

    textNode.replaceWith(fragment)
  })
}

function getEditableNodes() {
  wrapEditableTextNodes()
  return Array.from(document.querySelectorAll<HTMLElement>(COPY_TEXT_SELECTOR)).filter((el) => {
    if (el.closest('[data-copy-editor]')) return false
    return compactText(el.innerText || el.textContent || '').length > 0
  })
}

function makeKey(el: HTMLElement, index: number) {
  const text = compactText(el.innerText || el.textContent || '')
  const sourceTag = el.dataset.copySourceTag ?? el.tagName.toLowerCase()
  return `${sourceTag}:${index}:${text.slice(0, 96)}`
}

const STYLE_TAG_ID = '__copy-editor-style'
function ensureGlobalStyle(enabled: boolean) {
  const existing = document.getElementById(STYLE_TAG_ID)
  document.documentElement.dataset.copyEditing = enabled ? 'true' : 'false'
  if (!enabled) { existing?.remove(); delete document.documentElement.dataset.copyEditing; return }
  if (existing) return

  const tag = document.createElement('style')
  tag.id = STYLE_TAG_ID
  tag.textContent = `
    [data-copy-editable="true"] {
      pointer-events: auto !important;
      user-select: text !important;
      -webkit-user-select: text !important;
    }
    html[data-copy-editing="true"] body img,
    html[data-copy-editing="true"] body svg,
    html[data-copy-editing="true"] body video,
    html[data-copy-editing="true"] body canvas {
      pointer-events: none !important;
    }
  `
  document.head.appendChild(tag)
}

function setEditableStyles(el: HTMLElement, enabled: boolean) {
  el.contentEditable = enabled ? 'plaintext-only' : 'false'
  el.spellcheck = enabled
  el.dataset.copyEditable = enabled ? 'true' : 'false'
  el.style.outline = enabled ? '1px dashed rgba(237,201,103,0.5)' : ''
  el.style.outlineOffset = enabled ? '4px' : ''
  el.style.cursor = enabled ? 'text' : ''
  el.style.userSelect = enabled ? 'text' : ''
  el.style.webkitUserSelect = enabled ? 'text' : ''
  el.style.pointerEvents = enabled ? 'auto' : ''
}

function applyCopyState(enabled: boolean) {
  ensureGlobalStyle(enabled)

  if (!enabled) {
    document.querySelectorAll('[data-copy-editable="true"]').forEach((node) => {
      setEditableStyles(node as HTMLElement, false)
    })
    return 0
  }

  const edits = readMap(STORAGE_KEY)
  const originals = readMap(ORIGINALS_KEY)
  const nodes = getEditableNodes()

  nodes.forEach((el, index) => {
    const key = el.dataset.copyKey ?? makeKey(el, index)
    el.dataset.copyKey = key

    if (!(key in originals)) {
      originals[key] = compactText(el.innerText || el.textContent || '')
    }

    const saved = edits[key]
    if (saved && el.innerText !== saved) el.innerText = saved

    setEditableStyles(el, true)
  })

  writeMap(ORIGINALS_KEY, originals)
  return nodes.length
}

function editModeRequested() {
  return new URLSearchParams(window.location.search).get('edit') === 'copy'
}

function removeEditParam() {
  const url = new URL(window.location.href)
  url.searchParams.delete('edit')
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
}

export default function CopyEditor() {
  const [enabled, setEnabled] = useState(false)
  const [status, setStatus] = useState<string>('Loading page')
  const rescanTimer = useRef<number | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEnabled(editModeRequested())
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    window.localStorage.removeItem(LEGACY_ENABLE_KEY)

    if (!enabled) {
      applyCopyState(false)
      return
    }

    let disposed = false

    const scheduleApply = (label = 'Inline Edit') => {
      if (rescanTimer.current !== null) window.clearTimeout(rescanTimer.current)
      rescanTimer.current = window.setTimeout(() => {
        if (disposed) return
        const count = applyCopyState(true)
        setStatus(`${label} (${count})`)
      }, 180)
    }

    const boot = () => {
      setStatus('Preparing edit mode')
      scheduleApply('Inline Edit')
    }

    if (document.readyState === 'complete') {
      window.setTimeout(boot, 250)
    } else {
      window.addEventListener('load', boot, { once: true })
    }

    const onInput = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target?.dataset.copyKey) return
      const edits = readMap(STORAGE_KEY)
      edits[target.dataset.copyKey] = target.innerText
      writeMap(STORAGE_KEY, edits)
      setStatus('Edited')
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const editable = target?.closest('[data-copy-editable="true"]') as HTMLElement | null
      if (!editable) return
      if (editable.closest('a, button')) {
        event.preventDefault()
        event.stopPropagation()
      }
      editable.focus()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setEnabled(false)
      removeEditParam()
    }

    const onScrollOrResize = () => scheduleApply('Inline Edit')

    document.addEventListener('input', onInput)
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      disposed = true
      window.removeEventListener('load', boot)
      document.removeEventListener('input', onInput)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (rescanTimer.current !== null) window.clearTimeout(rescanTimer.current)
      applyCopyState(false)
    }
  }, [enabled])

  function turnOff() {
    setEnabled(false)
    removeEditParam()
  }

  async function saveToSource() {
    const edits = readMap(STORAGE_KEY)
    const originals = readMap(ORIGINALS_KEY)
    const changes = Object.entries(edits)
      .filter(([key, edited]) => originals[key] && originals[key] !== edited)
      .map(([key, edited]) => ({ original: originals[key], edited }))

    if (changes.length === 0) {
      setStatus('Nothing to save')
      return
    }

    setStatus(`Saving ${changes.length}...`)
    try {
      const res = await fetch('/api/save-copy', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ changes }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'save failed')
      const ok = data.results.filter((r: { status: string }) => r.status === 'ok').length
      const skipped = data.results.length - ok
      setStatus(`Saved ${ok}${skipped ? `, ${skipped} skipped` : ''}`)
      window.localStorage.removeItem(STORAGE_KEY)
      window.localStorage.removeItem(ORIGINALS_KEY)
      if (skipped > 0) {
        console.warn('[CopyEditor] some edits could not be applied:', data.results.filter((r: { status: string }) => r.status !== 'ok'))
      }
    } catch (err) {
      console.error(err)
      setStatus('Save failed')
    }
  }

  function exportEdits() {
    const json = JSON.stringify(readMap(STORAGE_KEY), null, 2)
    navigator.clipboard?.writeText(json)
    setStatus('Copied JSON')
  }

  function resetEdits() {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem(ORIGINALS_KEY)
    removeEditParam()
    window.location.reload()
  }

  if (!enabled) return null


  const btn = {
    border: '1px solid rgba(237,201,103,0.35)',
    color: '#EDC967',
    background: 'transparent',
    padding: '6px 9px',
    cursor: 'pointer',
  } as const

  return (
    <div
      data-copy-editor
      style={{
        position: 'fixed',
        right: 18,
        bottom: 18,
        zIndex: 5003,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        background: 'rgba(26,11,18,0.9)',
        border: '1px solid rgba(237,201,103,0.35)',
        color: '#EDC967',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 11,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span>{status}</span>
      <button type="button" onClick={saveToSource} style={{ ...btn, background: '#EDC967', color: '#1a0b12', fontWeight: 700 }}>
        Save
      </button>
      <button type="button" onClick={exportEdits} style={btn}>Export</button>
      <button type="button" onClick={resetEdits} style={btn}>Reset</button>
      <button type="button" onClick={turnOff} style={btn}>Off</button>
    </div>
  )
}


