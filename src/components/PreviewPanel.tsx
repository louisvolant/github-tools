import React, { useState } from 'react'
import {
  Terminal,
  FileCode,
  Image as ImageIcon,
  Copy,
  Check,
  Download,
  Sun,
  Moon,
  ExternalLink,
  Code2,
} from 'lucide-react'
import type {
  NeofetchProfile,
  FormatterOptions,
} from '../lib/neofetchFormatter'
import {
  composeProfileAscii,
  generateInfoLines,
} from '../lib/neofetchFormatter'
import { generateSvg, generatePictureTag } from '../lib/svgGenerator'
import type { ShieldBadge } from '../lib/badgesBuilder'
import { generateBadgesHtml, buildShieldBadgeUrl } from '../lib/badgesBuilder'

interface PreviewPanelProps {
  profile: NeofetchProfile
  asciiLines: string[]
  badges: ShieldBadge[]
  formatterOptions: FormatterOptions
}

type TabKey = 'terminal' | 'github' | 'svg' | 'markdown'

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  profile,
  asciiLines,
  badges,
  formatterOptions,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('terminal')
  const [ghPreviewTheme, setGhPreviewTheme] = useState<'dark' | 'light'>('dark')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Pre-generate assets
  const infoLines = generateInfoLines(profile, formatterOptions)
  const fullAscii = composeProfileAscii(asciiLines, infoLines, formatterOptions.gapWidth)
  const badgesHtml = generateBadgesHtml(badges)

  const darkSvg = generateSvg(profile, asciiLines, {
    theme: 'dark',
    formatterOptions,
  })
  const lightSvg = generateSvg(profile, asciiLines, {
    theme: 'light',
    formatterOptions,
  })

  const pictureTag = generatePictureTag(profile.header.user)

  // Full complete README markdown
  const fullReadmeMarkdown = `\`\`\`text
${fullAscii}
\`\`\`

${badgesHtml}
`

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Tab Navigation & Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3 py-2 gap-2">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" /> Terminal View
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'github'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ExternalLink className="h-3.5 w-3.5" /> GitHub Profile
          </button>
          <button
            onClick={() => setActiveTab('svg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'svg'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" /> Dual SVG Cards
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'markdown'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" /> Raw Markdown
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleCopy(fullReadmeMarkdown, 'readme')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title="Copy entire README Markdown"
          >
            {copiedKey === 'readme' ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span>{copiedKey === 'readme' ? 'Copied!' : 'Copy README'}</span>
          </button>

          <button
            onClick={() =>
              downloadFile(fullReadmeMarkdown, 'README.md', 'text/markdown')
            }
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title="Download README.md"
          >
            <Download className="h-3.5 w-3.5" />
            <span>.md</span>
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-950/80">
        {/* Terminal Tab */}
        {activeTab === 'terminal' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {profile.header.user}@{profile.header.host} — bash — 80x25
                </span>
                <button
                  onClick={() => handleCopy(fullAscii, 'ascii')}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                >
                  {copiedKey === 'ascii' ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  Copy ASCII
                </button>
              </div>

              {/* Terminal Screen */}
              <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-xs sm:text-[13px] leading-tight text-slate-200 select-all whitespace-pre">
                  {fullAscii}
                </pre>
              </div>
            </div>

            {/* Badges preview below */}
            {badges.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 text-center">
                <span className="text-[11px] text-slate-400 font-medium block mb-2">
                  Social Badges (Centered)
                </span>
                <div className="flex flex-wrap justify-center items-center gap-1.5">
                  {badges.map((b) => (
                    <a
                      key={b.id}
                      href={b.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:opacity-85"
                    >
                      <img
                        src={buildShieldBadgeUrl(b)}
                        alt={b.label}
                        className="h-5"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* GitHub Profile README Simulation Tab */}
        {activeTab === 'github' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Simulating github.com/{profile.header.user}/{profile.header.user}
              </span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setGhPreviewTheme('dark')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded cursor-pointer ${
                    ghPreviewTheme === 'dark'
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Moon className="h-3 w-3" /> Dark
                </button>
                <button
                  onClick={() => setGhPreviewTheme('light')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded cursor-pointer ${
                    ghPreviewTheme === 'light'
                      ? 'bg-white text-slate-900 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="h-3 w-3" /> Light
                </button>
              </div>
            </div>

            {/* Simulated GitHub Card */}
            <div
              className={`rounded-xl border p-5 transition ${
                ghPreviewTheme === 'dark'
                  ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]'
                  : 'bg-white border-[#d0d7de] text-[#24292f]'
              }`}
            >
              {/* GitHub README Header bar */}
              <div
                className={`flex items-center justify-between pb-4 mb-4 border-b text-xs font-semibold ${
                  ghPreviewTheme === 'dark'
                    ? 'border-[#30363d] text-[#8b949e]'
                    : 'border-[#d0d7de] text-[#57606a]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  {profile.header.user} / README.md
                </span>
                <span className="text-[11px] font-normal">Preview</span>
              </div>

              {/* Content: ASCII block */}
              <div
                className={`rounded-lg p-4 font-mono text-xs overflow-x-auto mb-6 ${
                  ghPreviewTheme === 'dark'
                    ? 'bg-[#161b22] border border-[#30363d]'
                    : 'bg-[#f6f8fa] border border-[#d0d7de]'
                }`}
              >
                <pre className="leading-tight whitespace-pre">{fullAscii}</pre>
              </div>

              {/* Centered Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
                  {badges.map((b) => (
                    <a
                      key={b.id}
                      href={b.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-90"
                    >
                      <img
                        src={buildShieldBadgeUrl(b)}
                        alt={b.label}
                        className="h-5"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dual SVG Cards Tab (Andrew6rant style) */}
        {activeTab === 'svg' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
              Dual SVGs render syntax colors (orange keys, blue values, green additions, red deletions) and adapt to GitHub dark/light mode via the <code>&lt;picture&gt;</code> tag!
            </div>

            {/* Dark SVG */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Moon className="h-3.5 w-3.5 text-indigo-400" />
                  dark_mode.svg
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(darkSvg, 'dark_svg')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'dark_svg' ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    Copy SVG
                  </button>
                  <button
                    onClick={() =>
                      downloadFile(darkSvg, 'dark_mode.svg', 'image/svg+xml')
                    }
                    className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-xs text-white flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>
              </div>
              <div className="border border-slate-800 rounded-xl p-2 bg-slate-950 overflow-x-auto">
                <div
                  dangerouslySetInnerHTML={{ __html: darkSvg }}
                  className="flex justify-center"
                />
              </div>
            </div>

            {/* Light SVG */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  light_mode.svg
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(lightSvg, 'light_svg')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'light_svg' ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    Copy SVG
                  </button>
                  <button
                    onClick={() =>
                      downloadFile(lightSvg, 'light_mode.svg', 'image/svg+xml')
                    }
                    className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-xs text-white flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>
              </div>
              <div className="border border-slate-800 rounded-xl p-2 bg-slate-200 overflow-x-auto">
                <div
                  dangerouslySetInnerHTML={{ __html: lightSvg }}
                  className="flex justify-center"
                />
              </div>
            </div>

            {/* Picture Tag Generator */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-violet-400" />
                  GitHub README &lt;picture&gt; Tag (Light/Dark Auto Switch)
                </span>
                <button
                  onClick={() => handleCopy(pictureTag, 'picture')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'picture' ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  Copy Tag
                </button>
              </div>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto">
                {pictureTag}
              </pre>
            </div>
          </div>
        )}

        {/* Raw Markdown Tab */}
        {activeTab === 'markdown' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Full GitHub README.md Source
              </span>
              <button
                onClick={() => handleCopy(fullReadmeMarkdown, 'full_md')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'full_md' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copy Markdown
              </button>
            </div>

            <textarea
              readOnly
              rows={24}
              value={fullReadmeMarkdown}
              className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-400 select-all leading-relaxed focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}
