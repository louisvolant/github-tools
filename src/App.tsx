import { useState } from 'react'
import { Header } from './components/Header'
import { AsciiEditor } from './components/AsciiEditor'
import { InfoEditor } from './components/InfoEditor'
import { BadgesEditor } from './components/BadgesEditor'
import { PreviewPanel } from './components/PreviewPanel'
import type {
  NeofetchProfile,
  FormatterOptions,
} from './lib/neofetchFormatter'
import {
  composeProfileAscii,
  generateInfoLines,
} from './lib/neofetchFormatter'
import { normalizeAsciiLines } from './lib/asciiEngine'
import type { ShieldBadge } from './lib/badgesBuilder'
import { generateBadgesHtml } from './lib/badgesBuilder'
import { PROFILE_PRESETS } from './lib/profilePresets'
import { Terminal, Shield, Sliders } from 'lucide-react'

export function App() {
  const initialPreset = PROFILE_PRESETS[0] // Gracey Dugar preset by default
  const [profile, setProfile] = useState<NeofetchProfile>(initialPreset.profile)
  const [asciiArt, setAsciiArt] = useState<string>(initialPreset.asciiArt)
  const [badges, setBadges] = useState<ShieldBadge[]>(initialPreset.badges)
  const [formatterOptions, setFormatterOptions] = useState<FormatterOptions>({
    totalWidth: 52,
    gapWidth: 7,
    alignmentMode: 'justified',
  })
  const [activeControlTab, setActiveControlTab] = useState<
    'ascii' | 'info' | 'badges'
  >('ascii')
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const handleLoadPreset = (presetId: string) => {
    const preset = PROFILE_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      setProfile(preset.profile)
      setAsciiArt(preset.asciiArt)
      setBadges(preset.badges)
    }
  }

  const handleCopyReadme = () => {
    const { lines: asciiLines } = normalizeAsciiLines(asciiArt)
    const infoLines = generateInfoLines(profile, formatterOptions)
    const fullAscii = composeProfileAscii(
      asciiLines,
      infoLines,
      formatterOptions.gapWidth
    )
    const badgesHtml = generateBadgesHtml(badges)

    const markdown = `\`\`\`text
${fullAscii}
\`\`\`

${badgesHtml}
`
    navigator.clipboard.writeText(markdown)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const { lines: asciiLines } = normalizeAsciiLines(asciiArt)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        onLoadPreset={handleLoadPreset}
        onCopyReadme={handleCopyReadme}
        isCopied={isCopied}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Studio Controls */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col shadow-xl">
          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80 mb-5">
            <button
              onClick={() => setActiveControlTab('ascii')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeControlTab === 'ascii'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" /> ASCII Art
            </button>
            <button
              onClick={() => setActiveControlTab('info')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeControlTab === 'info'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" /> Specs & Info
            </button>
            <button
              onClick={() => setActiveControlTab('badges')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeControlTab === 'badges'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="h-3.5 w-3.5" /> Shields Badges
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="flex-1">
            {activeControlTab === 'ascii' && (
              <AsciiEditor asciiArt={asciiArt} onChange={setAsciiArt} />
            )}
            {activeControlTab === 'info' && (
              <InfoEditor
                profile={profile}
                options={formatterOptions}
                onChangeProfile={setProfile}
                onChangeOptions={setFormatterOptions}
              />
            )}
            {activeControlTab === 'badges' && (
              <BadgesEditor badges={badges} onChangeBadges={setBadges} />
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div className="lg:col-span-7 h-[780px]">
          <PreviewPanel
            profile={profile}
            asciiLines={asciiLines}
            badges={badges}
            formatterOptions={formatterOptions}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Inspired by{' '}
            <a
              href="https://github.com/GraceyDugar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              @GraceyDugar
            </a>{' '}
            and{' '}
            <a
              href="https://github.com/Andrew6rant"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              @Andrew6rant
            </a>
          </span>
          <span>Deployable to Cloudflare Pages & Workers</span>
        </div>
      </footer>
    </div>
  )
}

export default App
