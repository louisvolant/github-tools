import { describe, it, expect } from 'vitest'
import {
  formatDottedLine,
  generateInfoLines,
  composeProfileAscii,
  DEFAULT_PROFILE,
} from '../neofetchFormatter'

describe('neofetchFormatter', () => {
  it('formats justified dotted line to target length', () => {
    const lines = formatDottedLine('OS', 'Windows 11', 40, 'justified')
    expect(lines).toHaveLength(1)
    expect(lines[0].startsWith('OS: ..')).toBe(true)
    expect(lines[0].endsWith('Windows 11')).toBe(true)
    expect(lines[0].length).toBe(40)
  })

  it('formats fixed-column line properly', () => {
    const lines = formatDottedLine('OS', 'Linux', 40, 'fixed-column', 20)
    expect(lines[0].startsWith('OS: .')).toBe(true)
    expect(lines[0]).toContain('Linux')
  })

  it('generates complete info lines from profile', () => {
    const lines = generateInfoLines(DEFAULT_PROFILE, {
      totalWidth: 50,
      gapWidth: 7,
      alignmentMode: 'justified',
    })

    expect(lines[0]).toBe('louis@portfolio')
    expect(lines[1].startsWith('---')).toBe(true)
    expect(lines.some((l) => l.includes('Langs.Programming:'))).toBe(true)
    expect(lines.some((l) => l.includes('- Contact'))).toBe(true)
    expect(lines.some((l) => l.includes('- GitHub Stats'))).toBe(true)
  })

  it('composes ASCII art on the left and info lines on the right', () => {
    const ascii = ['  /\\  ', ' /  \\ ', '/____\\']
    const info = ['user@host', '---------', 'OS: Linux']

    const composed = composeProfileAscii(ascii, info, 4)
    const lines = composed.split('\n')

    expect(lines).toHaveLength(3)
    expect(lines[0]).toContain('user@host')
    expect(lines[0].startsWith('  /\\  ')).toBe(true)
  })
})
