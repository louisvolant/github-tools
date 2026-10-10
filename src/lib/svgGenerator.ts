/**
 * SVG Generator for Neofetch GitHub Profile Card
 * Supports Dark & Light modes with syntax highlighted keys, values, and stats
 * Inspired by Andrew6rant/Andrew6rant
 */

import type { NeofetchProfile, FormatterOptions } from './neofetchFormatter'

export interface SvgTheme {
  background: string
  asciiColor: string
  textColor: string
  keyColor: string
  valueColor: string
  dotsColor: string
  addColor: string
  delColor: string
  borderColor?: string
}

export const SVG_THEMES: Record<'dark' | 'light', SvgTheme> = {
  dark: {
    background: '#161b22',
    asciiColor: '#8b949e',
    textColor: '#c9d1d9',
    keyColor: '#ffa657', // warm orange
    valueColor: '#a5d6ff', // calm blue/cyan
    dotsColor: '#484f58', // muted grey
    addColor: '#3fb950', // green
    delColor: '#f85149', // red
    borderColor: '#30363d',
  },
  light: {
    background: '#ffffff',
    asciiColor: '#57606a',
    textColor: '#24292f',
    keyColor: '#bc4c00', // vibrant orange/rust
    valueColor: '#0969da', // github blue
    dotsColor: '#8c959f', // muted grey
    addColor: '#1a7f37', // green
    delColor: '#cf222e', // red
    borderColor: '#d0d7de',
  },
}

export interface SvgOptions {
  theme: 'dark' | 'light'
  fontSize?: number // default 15
  lineHeight?: number // default 20
  paddingX?: number // default 20
  paddingY?: number // default 30
  borderRadius?: number // default 15
  formatterOptions?: FormatterOptions
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Parses stats with additions/deletions highlighting (e.g. 1,607,958 (1,610,646++, 2,688--))
 */
function renderStatsValueXml(val: string, theme: SvgTheme): string {
  const safe = escapeXml(val)
  // Match patterns like (480,200++, 30,080--)
  const addMatch = /(\+[\d,]+|\b[\d,]+\+\+)/g
  const delMatch = /(-[\d,]+|\b[\d,]+--)/g

  let highlighted = safe.replace(
    addMatch,
    (m) => `<tspan fill="${theme.addColor}">${m}</tspan>`
  )
  highlighted = highlighted.replace(
    delMatch,
    (m) => `<tspan fill="${theme.delColor}">${m}</tspan>`
  )

  return highlighted
}

/**
 * Builds SVG markup for dark or light mode
 */
export function generateSvg(
  profile: NeofetchProfile,
  asciiLines: string[],
  options: SvgOptions
): string {
  const {
    theme: themeMode,
    fontSize = 15,
    lineHeight = 20,
    paddingX = 25,
    paddingY = 30,
    borderRadius = 15,
  } = options

  const theme = SVG_THEMES[themeMode]

  // Calculate widths & coordinates
  const maxAsciiLen = asciiLines.reduce((m, l) => Math.max(m, l.length), 0)
  // Approximate char width in standard monospace (around 0.6 * fontSize)
  const charWidth = fontSize * 0.605
  const asciiPixelWidth = maxAsciiLen * charWidth
  const infoX = Math.round(paddingX + asciiPixelWidth + 35)

  // Generate Info items structure for SVG
  interface SvgLine {
    type: 'header' | 'divider' | 'section' | 'item' | 'empty'
    key?: string
    dots?: string
    value?: string
    rawText?: string
  }

  const rightLines: SvgLine[] = []

  // Header: user@host
  const userHost = `${profile.header.user}@${profile.header.host}`
  rightLines.push({ type: 'header', rawText: userHost })
  rightLines.push({
    type: 'divider',
    rawText: '—'.repeat(Math.min(48, Math.max(userHost.length + 4, 30))),
  })

  const targetWidth = options.formatterOptions?.totalWidth ?? 50

  const processItem = (category: string | undefined, label: string, value: string) => {
    if (!label && !value) {
      rightLines.push({ type: 'empty' })
      return
    }
    const fullKey = category ? `${category}.${label}` : label
    const rawKey = `${fullKey}: `
    const dotsCount = Math.max(
      2,
      targetWidth - rawKey.length - value.length - 1
    )
    const dots = '.'.repeat(dotsCount)
    rightLines.push({
      type: 'item',
      key: fullKey,
      dots: ` ${dots} `,
      value,
    })
  }

  // Main items
  for (const item of profile.mainItems) {
    processItem(item.category, item.label, item.value)
  }

  // Sections
  for (const section of profile.sections) {
    rightLines.push({ type: 'empty' })
    rightLines.push({ type: 'section', rawText: section.title })
    for (const item of section.items) {
      processItem(item.category, item.label, item.value)
    }
  }

  const totalRows = Math.max(asciiLines.length, rightLines.length)
  const totalHeight = paddingY * 2 + totalRows * lineHeight
  const infoPixelWidth = (targetWidth + 5) * charWidth
  const totalWidth = Math.round(infoX + infoPixelWidth + paddingX)

  // Build SVG XML
  const asciiXml = asciiLines
    .map((line, idx) => {
      const y = paddingY + (idx + 1) * lineHeight - 4
      return `    <tspan x="${paddingX}" y="${y}">${escapeXml(line)}</tspan>`
    })
    .join('\n')

  const infoXml = rightLines
    .map((item, idx) => {
      const y = paddingY + (idx + 1) * lineHeight - 4
      switch (item.type) {
        case 'header':
          return `    <tspan x="${infoX}" y="${y}" fill="${theme.keyColor}" font-weight="bold">${escapeXml(item.rawText || '')}</tspan>`
        case 'divider':
          return `    <tspan x="${infoX}" y="${y}" fill="${theme.dotsColor}">${escapeXml(item.rawText || '')}</tspan>`
        case 'section':
          return `    <tspan x="${infoX}" y="${y}" fill="${theme.textColor}" font-weight="bold">${escapeXml(item.rawText || '')}</tspan>`
        case 'empty':
          return ''
        case 'item': {
          const keyXml = `<tspan fill="${theme.keyColor}">${escapeXml(item.key || '')}</tspan>`
          const colonXml = `<tspan fill="${theme.textColor}">:</tspan>`
          const dotsXml = `<tspan fill="${theme.dotsColor}">${escapeXml(item.dots || ' ')}</tspan>`
          const valXml = renderStatsValueXml(item.value || '', theme)
          return `    <tspan x="${infoX}" y="${y}">${keyXml}${colonXml}${dotsXml}<tspan fill="${theme.valueColor}">${valXml}</tspan></tspan>`
        }
      }
    })
    .filter(Boolean)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" font-family="ConsolasFallback, Consolas, Monaco, 'Courier New', monospace" width="${totalWidth}px" height="${totalHeight}px" font-size="${fontSize}px">
  <defs>
    <style>
      @font-face {
        font-family: 'ConsolasFallback';
        src: local('Consolas'), local('SF Mono'), local('Monaco'), local('Menlo');
      }
      text, tspan { white-space: pre; }
    </style>
  </defs>
  <rect width="${totalWidth}px" height="${totalHeight}px" fill="${theme.background}" rx="${borderRadius}" stroke="${theme.borderColor}" stroke-width="1"/>
  
  <!-- Left Column: ASCII Art -->
  <text x="${paddingX}" y="${paddingY}" fill="${theme.asciiColor}">
${asciiXml}
  </text>

  <!-- Right Column: System Info -->
  <text x="${infoX}" y="${paddingY}" fill="${theme.textColor}">
${infoXml}
  </text>
</svg>
`
}

/**
 * Generates the GitHub README <picture> tag markdown/HTML
 */
export function generatePictureTag(
  username: string,
  repo: string = username,
  darkSvgFilename: string = 'dark_mode.svg',
  lightSvgFilename: string = 'light_mode.svg'
): string {
  const baseUrl = `https://raw.githubusercontent.com/${username}/${repo}/main`
  return `<a href="https://github.com/${username}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${baseUrl}/${darkSvgFilename}">
    <img alt="${username}'s GitHub Profile README" src="${baseUrl}/${lightSvgFilename}">
  </picture>
</a>`
}
