/**
 * Neofetch Info Model & Formatting Engine
 */

export type DotAlignmentMode = 'justified' | 'fixed-column'

export interface InfoItem {
  id: string
  category?: string
  label: string
  value: string
}

export interface SectionBlock {
  id: string
  title: string // e.g. "- Contact", "- GitHub Stats"
  items: InfoItem[]
}

export interface NeofetchHeaderConfig {
  user: string
  host: string
  separator?: string
}

export interface NeofetchProfile {
  header: NeofetchHeaderConfig
  mainItems: InfoItem[]
  sections: SectionBlock[]
  stats?: {
    repos?: number
    contributed?: number
    commits?: number
    stars?: number
    followers?: number
    loc?: {
      total: string | number
      added: string | number
      deleted: string | number
    }
  }
}

export interface FormatterOptions {
  totalWidth: number // target width of info column (default: 52)
  gapWidth: number // space between ASCII art and info (default: 7)
  alignmentMode: DotAlignmentMode
  fixedDotColumn?: number // for 'fixed-column' mode (default: 24)
}

export const DEFAULT_PROFILE: NeofetchProfile = {
  header: {
    user: 'louis',
    host: 'portfolio',
  },
  mainItems: [
    { id: 'os', label: 'OS', value: 'macOS Sonoma, Linux, iOS' },
    { id: 'uptime', label: 'Uptime', value: '24 years' },
    { id: 'host', label: 'Host', value: 'Cloudflare Pages, Edge' },
    { id: 'kernel', label: 'Kernel', value: 'Senior Software Engineer' },
    { id: 'ide', label: 'IDE', value: 'VS Code, Neovim, Zed' },
    {
      id: 'lang_prog',
      category: 'Langs',
      label: 'Programming',
      value: 'TypeScript, Python, Rust, Go',
    },
    {
      id: 'lang_comp',
      category: 'Langs',
      label: 'Computer',
      value: 'React, Tailwind, GraphQL, SQL',
    },
    {
      id: 'lang_real',
      category: 'Langs',
      label: 'Real',
      value: 'French, English, Spanish',
    },
    {
      id: 'hob_soft',
      category: 'Hobbies',
      label: 'Software',
      value: 'Open Source, AI Tools, Cloudflare',
    },
    {
      id: 'hob_hard',
      category: 'Hobbies',
      label: 'Hardware',
      value: 'Mechanical Keyboards, Raspberry Pi',
    },
  ],
  sections: [
    {
      id: 'contact',
      title: '- Contact',
      items: [
        {
          id: 'c_email',
          category: 'Email',
          label: 'Personal',
          value: 'louis@example.com',
        },
        {
          id: 'c_work',
          category: 'Email',
          label: 'Work',
          value: 'contact@louis.dev',
        },
        { id: 'c_port', label: 'Portfolio', value: 'louis.dev' },
        { id: 'c_linkedin', label: 'LinkedIn', value: 'in/louis' },
        { id: 'c_x', label: 'Twitter / X', value: '@louis_dev' },
      ],
    },
    {
      id: 'stats',
      title: '- GitHub Stats',
      items: [
        { id: 's_repos', label: 'Repos', value: '42 {Contributed: 15}' },
        { id: 's_commits', label: 'Commits', value: '1,280' },
        {
          id: 's_loc',
          label: 'Lines of Code',
          value: '450,120 (480,200++, 30,080--)',
        },
      ],
    },
  ],
}

/**
 * Format a single key-value line with dot padding
 */
export function formatDottedLine(
  key: string,
  value: string,
  targetWidth: number,
  mode: DotAlignmentMode = 'justified',
  fixedColumn: number = 24
): string[] {
  const fullKey = `${key}: `

  if (mode === 'fixed-column') {
    const dotsCount = Math.max(2, fixedColumn - fullKey.length - 1)
    const dots = '.'.repeat(dotsCount) + ' '
    const combined = `${fullKey}${dots}${value}`
    return wrapOrTruncate(combined, targetWidth, fixedColumn)
  }

  // Justified mode:
  // Key: ........................... Value
  const rawLength = fullKey.length + value.length + 1
  if (rawLength >= targetWidth) {
    // If it exceeds target width, put minimal dots or wrap
    const minDots = '.. '
    const line = `${fullKey}${minDots}${value}`
    return [line]
  }

  const dotsCount = Math.max(2, targetWidth - fullKey.length - value.length - 1)
  const dots = '.'.repeat(dotsCount)
  return [`${fullKey}${dots} ${value}`]
}

function wrapOrTruncate(
  text: string,
  maxWidth: number,
  indentCol: number
): string[] {
  if (text.length <= maxWidth) return [text]

  const lines: string[] = []
  let remaining = text

  while (remaining.length > maxWidth) {
    // Find last space before maxWidth
    let splitIdx = remaining.lastIndexOf(' ', maxWidth)
    if (splitIdx <= indentCol) {
      splitIdx = maxWidth
    }
    lines.push(remaining.substring(0, splitIdx))
    remaining = ' '.repeat(indentCol) + remaining.substring(splitIdx).trimStart()
  }
  if (remaining.trim().length > 0) {
    lines.push(remaining)
  }
  return lines
}

/**
 * Generates the right-hand side Neofetch information lines
 */
export function generateInfoLines(
  profile: NeofetchProfile,
  options: FormatterOptions
): string[] {
  const { totalWidth, alignmentMode, fixedDotColumn } = options
  const lines: string[] = []

  // Header: user@host
  const userHost = `${profile.header.user}@${profile.header.host}`
  lines.push(userHost)
  const underline = '-'.repeat(Math.min(totalWidth, Math.max(userHost.length + 4, 26)))
  lines.push(underline)

  // Main items
  for (const item of profile.mainItems) {
    if (!item.value && !item.label) {
      lines.push('')
      continue
    }
    const key = item.category ? `${item.category}.${item.label}` : item.label
    const formatted = formatDottedLine(
      key,
      item.value,
      totalWidth,
      alignmentMode,
      fixedDotColumn
    )
    lines.push(...formatted)
  }

  // Additional sections (e.g. Contact, Stats)
  for (const section of profile.sections) {
    lines.push('')
    lines.push(section.title)
    for (const item of section.items) {
      if (!item.value && !item.label) {
        lines.push('')
        continue
      }
      const key = item.category ? `${item.category}.${item.label}` : item.label
      const formatted = formatDottedLine(
        key,
        item.value,
        totalWidth,
        alignmentMode,
        fixedDotColumn
      )
      lines.push(...formatted)
    }
  }

  return lines
}

/**
 * Merges ASCII art (left column) and Neofetch lines (right column)
 */
export function composeProfileAscii(
  asciiLines: string[],
  infoLines: string[],
  gapWidth: number = 7
): string {
  const maxAsciiWidth = asciiLines.reduce((m, l) => Math.max(m, l.length), 0)
  const totalRows = Math.max(asciiLines.length, infoLines.length)
  const gap = ' '.repeat(gapWidth)

  const mergedLines: string[] = []

  for (let i = 0; i < totalRows; i++) {
    const left = (asciiLines[i] || '').padEnd(maxAsciiWidth, ' ')
    const right = infoLines[i] || ''
    if (right) {
      mergedLines.push(`${left}${gap}${right}`)
    } else {
      mergedLines.push(left.trimEnd())
    }
  }

  return mergedLines.join('\n')
}
