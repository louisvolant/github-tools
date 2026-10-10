import { describe, it, expect } from 'vitest'
import {
  buildShieldBadgeUrl,
  generateBadgesHtml,
  DEFAULT_BADGES,
} from '../badgesBuilder'

describe('badgesBuilder', () => {
  it('builds valid shields.io badge URL', () => {
    const badge = {
      id: 'test',
      label: 'Gmail',
      message: 'test@gmail.com',
      color: 'EA4335',
      logo: 'gmail',
      logoColor: 'white',
      linkUrl: 'mailto:test@gmail.com',
    }

    const url = buildShieldBadgeUrl(badge)
    expect(url).toContain('https://img.shields.io/badge/Gmail-test%40gmail.com-EA4335')
    expect(url).toContain('style=flat-square')
    expect(url).toContain('logo=gmail')
    expect(url).toContain('logoColor=white')
  })

  it('escapes hyphens and underscores for shields.io path components', () => {
    const badge = {
      id: 'test2',
      label: 'Work_Email',
      message: 'user-name',
      color: '#8B5CF6',
      logo: 'mail',
      linkUrl: 'mailto:u@work.com',
    }

    const url = buildShieldBadgeUrl(badge)
    expect(url).toContain('Work__Email')
    expect(url).toContain('user--name')
    expect(url).toContain('-8B5CF6') // '#' stripped
  })

  it('generates centered HTML paragraph with badge links', () => {
    const html = generateBadgesHtml(DEFAULT_BADGES.slice(0, 2))
    expect(html.startsWith('<p align="center">')).toBe(true)
    expect(html.endsWith('</p>')).toBe(true)
    expect(html).toContain('<a href="mailto:louis@example.com"><img src="https://img.shields.io/badge/')
  })

  it('returns empty string if badges list is empty', () => {
    expect(generateBadgesHtml([])).toBe('')
  })
})
