/**
 * Shields.io Badges Builder
 * Generates badge URLs and centered GitHub README markdown/HTML
 */

export interface ShieldBadge {
  id: string
  label: string
  message: string
  color: string // Hex code without '#', e.g. "EA4335"
  logo: string // Simple Icons slug e.g. "gmail", "linkedin"
  logoColor?: string // e.g. "white"
  style?: 'flat-square' | 'flat' | 'for-the-badge' | 'plastic'
  linkUrl: string
}

export interface PresetBadgeTemplate {
  name: string
  defaultLabel: string
  defaultMessage: string
  color: string
  logo: string
  linkTemplate: string
}

export const PRESET_BADGE_TEMPLATES: Record<string, PresetBadgeTemplate> = {
  gmail: {
    name: 'Gmail',
    defaultLabel: 'Gmail',
    defaultMessage: 'username',
    color: 'EA4335',
    logo: 'gmail',
    linkTemplate: 'mailto:{val}@gmail.com',
  },
  workEmail: {
    name: 'Work Email',
    defaultLabel: 'Work',
    defaultMessage: 'contact@work.com',
    color: '8B5CF6',
    logo: 'maildotru',
    linkTemplate: 'mailto:{val}',
  },
  portfolio: {
    name: 'Portfolio',
    defaultLabel: 'Portfolio',
    defaultMessage: 'portfolio.dev',
    color: '222222',
    logo: 'githubpages',
    linkTemplate: 'https://{val}',
  },
  linkedin: {
    name: 'LinkedIn',
    defaultLabel: 'LinkedIn',
    defaultMessage: 'Your Name',
    color: '0A66C2',
    logo: 'linkedin',
    linkTemplate: 'https://www.linkedin.com/in/{val}',
  },
  x: {
    name: 'X (Twitter)',
    defaultLabel: 'X',
    defaultMessage: '@username',
    color: '000000',
    logo: 'x',
    linkTemplate: 'https://x.com/{val}',
  },
  github: {
    name: 'GitHub',
    defaultLabel: 'GitHub',
    defaultMessage: 'username',
    color: '181717',
    logo: 'github',
    linkTemplate: 'https://github.com/{val}',
  },
  discord: {
    name: 'Discord',
    defaultLabel: 'Discord',
    defaultMessage: 'community',
    color: '5865F2',
    logo: 'discord',
    linkTemplate: 'https://discord.gg/{val}',
  },
  youtube: {
    name: 'YouTube',
    defaultLabel: 'YouTube',
    defaultMessage: '@channel',
    color: 'FF0000',
    logo: 'youtube',
    linkTemplate: 'https://youtube.com/{val}',
  },
  bluesky: {
    name: 'Bluesky',
    defaultLabel: 'Bluesky',
    defaultMessage: 'handle.bsky.social',
    color: '0285FF',
    logo: 'bluesky',
    linkTemplate: 'https://bsky.app/profile/{val}',
  },
}

export const DEFAULT_BADGES: ShieldBadge[] = [
  {
    id: 'badge-gmail',
    label: 'Gmail',
    message: 'louis@example.com',
    color: 'EA4335',
    logo: 'gmail',
    logoColor: 'white',
    style: 'flat-square',
    linkUrl: 'mailto:louis@example.com',
  },
  {
    id: 'badge-work',
    label: 'Work',
    message: 'contact@louis.dev',
    color: '8B5CF6',
    logo: 'maildotru',
    logoColor: 'white',
    style: 'flat-square',
    linkUrl: 'mailto:contact@louis.dev',
  },
  {
    id: 'badge-portfolio',
    label: 'Portfolio',
    message: 'louis.dev',
    color: '222222',
    logo: 'githubpages',
    logoColor: 'white',
    style: 'flat-square',
    linkUrl: 'https://louis.dev',
  },
  {
    id: 'badge-linkedin',
    label: 'LinkedIn',
    message: 'Louis Volant',
    color: '0A66C2',
    logo: 'linkedin',
    logoColor: 'white',
    style: 'flat-square',
    linkUrl: 'https://www.linkedin.com/in/louisvolant',
  },
  {
    id: 'badge-x',
    label: 'X',
    message: '@louis_dev',
    color: '000000',
    logo: 'x',
    logoColor: 'white',
    style: 'flat-square',
    linkUrl: 'https://x.com/louis_dev',
  },
]

/**
 * Escapes characters for Shields.io URL path syntax:
 * Underscore _ -> __
 * Hyphen - -> --
 */
function escapeShieldsPathComponent(text: string): string {
  return encodeURIComponent(
    text
      .replace(/_/g, '__')
      .replace(/-/g, '--')
  )
}

/**
 * Constructs a Shields.io badge image URL
 */
export function buildShieldBadgeUrl(badge: ShieldBadge): string {
  const label = escapeShieldsPathComponent(badge.label)
  const message = escapeShieldsPathComponent(badge.message)
  const color = badge.color.replace(/^#/, '')
  const style = badge.style || 'flat-square'
  const logoColor = badge.logoColor || 'white'

  let url = `https://img.shields.io/badge/${label}-${message}-${color}?style=${style}`
  if (badge.logo) {
    url += `&logo=${encodeURIComponent(badge.logo)}&logoColor=${encodeURIComponent(logoColor)}`
  }
  return url
}

/**
 * Formats an array of badges into centered GitHub README HTML
 */
export function generateBadgesHtml(badges: ShieldBadge[]): string {
  if (badges.length === 0) return ''

  const lines = badges.map((badge) => {
    const imgUrl = buildShieldBadgeUrl(badge)
    const href = badge.linkUrl || '#'
    return `<a href="${href}"><img src="${imgUrl}"></a>`
  })

  return `<p align="center">\n${lines.join('\n')}\n</p>`
}
