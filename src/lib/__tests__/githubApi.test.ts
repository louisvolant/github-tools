import { describe, it, expect } from 'vitest'
import { calculateUptime } from '../githubApi'

describe('githubApi', () => {
  it('calculates uptime correctly from past date', () => {
    // 5 years ago
    const past = new Date()
    past.setFullYear(past.getFullYear() - 5)
    const uptime = calculateUptime(past.toISOString())
    expect(uptime).toContain('5 years')
  })

  it('handles invalid date gracefully', () => {
    expect(calculateUptime('not-a-date')).toBe('1 year')
  })
})
