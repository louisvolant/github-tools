import { describe, it, expect } from 'vitest'
import { generateSvg, generatePictureTag, SVG_THEMES } from '../svgGenerator'
import { DEFAULT_PROFILE } from '../neofetchFormatter'

describe('svgGenerator', () => {
  const sampleAscii = ['  *  ', ' *** ', '*****']

  it('generates valid SVG XML string for dark mode', () => {
    const svg = generateSvg(DEFAULT_PROFILE, sampleAscii, { theme: 'dark' })
    expect(svg.startsWith("<?xml version='1.0' encoding='UTF-8'?>") || svg.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"')
    expect(svg).toContain(`fill="${SVG_THEMES.dark.background}"`)
    expect(svg).toContain('louis@portfolio')
    expect(svg).toContain('</svg>')
  })

  it('generates valid SVG XML string for light mode', () => {
    const svg = generateSvg(DEFAULT_PROFILE, sampleAscii, { theme: 'light' })
    expect(svg).toContain(`fill="${SVG_THEMES.light.background}"`)
    expect(svg).toContain(`fill="${SVG_THEMES.light.keyColor}"`)
  })

  it('escapes XML special characters in values', () => {
    const profile = {
      ...DEFAULT_PROFILE,
      mainItems: [{ id: 'test', label: 'Tech <X & Y>', value: 'A > B & C' }],
    }
    const svg = generateSvg(profile, sampleAscii, { theme: 'dark' })
    expect(svg).not.toContain('A > B & C')
    expect(svg).toContain('A &gt; B &amp; C')
  })

  it('generates markdown picture tag with fallback', () => {
    const tag = generatePictureTag('louisvolant', 'louisvolant')
    expect(tag).toContain('<picture>')
    expect(tag).toContain('https://raw.githubusercontent.com/louisvolant/louisvolant/main/dark_mode.svg')
    expect(tag).toContain('https://raw.githubusercontent.com/louisvolant/louisvolant/main/light_mode.svg')
    expect(tag).toContain('</picture>')
  })
})
