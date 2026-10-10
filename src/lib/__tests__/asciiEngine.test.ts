import { describe, it, expect } from 'vitest'
import {
  adjustPixel,
  pixelsToAscii,
  normalizeAsciiLines,
  CHAR_SETS,
  PRESET_ASCII_ARTS,
} from '../asciiEngine'

describe('asciiEngine', () => {
  it('adjusts pixel brightness and contrast within [0, 255]', () => {
    expect(adjustPixel(128, 0, 0)).toBe(128)
    expect(adjustPixel(128, 0, 50)).toBeGreaterThan(128)
    expect(adjustPixel(128, 0, -50)).toBeLessThan(128)
    expect(adjustPixel(300, 50, 50)).toBe(255)
    expect(adjustPixel(-50, -50, -50)).toBe(0)
  })

  it('converts pixel grid to ASCII characters properly', () => {
    const grid = [
      [0, 128, 255],
      [255, 128, 0],
    ]
    const chars = ' .#'
    const result = pixelsToAscii(grid, chars, false)

    expect(result).toHaveLength(2)
    expect(result[0]).toBe(' .#')
    expect(result[1]).toBe('#. ')
  })

  it('inverts ASCII characters when invert=true', () => {
    const grid = [[0, 255]]
    const chars = ' #'
    const result = pixelsToAscii(grid, chars, true)

    expect(result[0]).toBe('# ')
  })

  it('normalizes lines to uniform width with padding', () => {
    const raw = 'line 1\nlonger line\nhi'
    const { lines, maxWidth } = normalizeAsciiLines(raw)

    expect(maxWidth).toBe(11) // 'longer line'.length
    expect(lines.every((l) => l.length === 11)).toBe(true)
    expect(lines[0]).toBe('line 1     ')
  })

  it('includes built-in presets like gracey and andrew', () => {
    const gracey = PRESET_ASCII_ARTS.find((p) => p.id === 'gracey')
    const andrew = PRESET_ASCII_ARTS.find((p) => p.id === 'andrew')
    expect(gracey).toBeDefined()
    expect(andrew).toBeDefined()
    expect(gracey?.art.length).toBeGreaterThan(100)
    expect(CHAR_SETS.classic).toBeDefined()
  })
})
