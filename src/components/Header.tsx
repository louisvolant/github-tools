import React from 'react'
import { Terminal, Sparkles, Copy, Check } from 'lucide-react'
import confetti from 'canvas-confetti'
import { PROFILE_PRESETS } from '../lib/profilePresets'
import { GithubIcon } from './GithubIcon'

interface HeaderProps {
  onLoadPreset: (presetId: string) => void
  onCopyReadme: () => void
  isCopied: boolean
}

export const Header: React.FC<HeaderProps> = ({
  onLoadPreset,
  onCopyReadme,
  isCopied,
}) => {
  const triggerConfettiAndCopy = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.1 },
    })
    onCopyReadme()
  }

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight leading-none m-0">
                ASCII Profile Studio
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Neofetch + Shields
              </span>
            </div>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Generate ASCII art, Neofetch specs, and Shields badges for your GitHub Profile
            </p>
          </div>
        </div>

        {/* Presets & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1 font-medium">
              <Sparkles className="h-3 w-3 text-amber-400" /> Presets:
            </span>
            {PROFILE_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => onLoadPreset(p.id)}
                className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition font-medium cursor-pointer"
                title={p.description}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={triggerConfettiAndCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {isCopied ? 'README Copied!' : 'Copy Full README'}
          </button>

          <a
            href="https://github.com/louisvolant/github-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition"
            title="View on GitHub"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
