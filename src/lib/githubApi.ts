/**
 * GitHub API Helper & Data Extractor
 */

export interface GitHubUserProfile {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  location: string | null
  blog: string | null
  twitter_username: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

/**
 * Calculates human-readable uptime duration from an ISO date string
 */
export function calculateUptime(isoDate: string): string {
  try {
    const created = new Date(isoDate)
    if (isNaN(created.getTime())) return '1 year'
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)

    if (years === 0) {
      return `${months} months`
    }
    if (months === 0) {
      return `${years} years`
    }
    return `${years} years, ${months} months`
  } catch {
    return '1 year'
  }
}

/**
 * Fetches user profile from GitHub public REST API
 */
export async function fetchGitHubUser(
  username: string
): Promise<GitHubUserProfile> {
  const cleanUsername = username.trim().replace(/^@/, '')
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(cleanUsername)}`
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`GitHub user "${cleanUsername}" not found.`)
    }
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.')
    }
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}
