import React, { useState } from 'react'
import {
  Shield,
  Plus,
  Trash2,
  Sparkles,
  Palette,
} from 'lucide-react'
import type { ShieldBadge } from '../lib/badgesBuilder'
import {
  PRESET_BADGE_TEMPLATES,
  buildShieldBadgeUrl,
} from '../lib/badgesBuilder'
import { generateId } from '../lib/idGenerator'

interface BadgesEditorProps {
  badges: ShieldBadge[]
  onChangeBadges: (badges: ShieldBadge[]) => void
}

const COLOR_SWATCHES = [
  { name: 'Red', hex: 'EA4335' },
  { name: 'Purple', hex: '8B5CF6' },
  { name: 'Blue', hex: '0A66C2' },
  { name: 'Sky', hex: '0285FF' },
  { name: 'Discord Blurple', hex: '5865F2' },
  { name: 'Green', hex: '10B981' },
  { name: 'Amber', hex: 'F59E0B' },
  { name: 'Dark Gray', hex: '222222' },
  { name: 'Black', hex: '000000' },
]

export const BadgesEditor: React.FC<BadgesEditorProps> = ({
  badges,
  onChangeBadges,
}) => {
  const [newLabel, setNewLabel] = useState<string>('Custom')
  const [newMessage, setNewMessage] = useState<string>('badge')
  const [newColor, setNewColor] = useState<string>('6366F1')
  const [newLogo, setNewLogo] = useState<string>('github')
  const [newLink, setNewLink] = useState<string>('https://github.com')
  const [style, setStyle] = useState<
    'flat-square' | 'flat' | 'for-the-badge' | 'plastic'
  >('flat-square')

  const handleAddPreset = (key: string) => {
    const template = PRESET_BADGE_TEMPLATES[key]
    if (!template) return

    const newBadge: ShieldBadge = {
      id: generateId('badge'),
      label: template.defaultLabel,
      message: template.defaultMessage,
      color: template.color,
      logo: template.logo,
      logoColor: 'white',
      style,
      linkUrl: template.linkTemplate.replace('{val}', template.defaultMessage),
    }

    onChangeBadges([...badges, newBadge])
  }

  const handleAddCustom = () => {
    const newBadge: ShieldBadge = {
      id: generateId('badge_custom'),
      label: newLabel.trim() || 'Badge',
      message: newMessage.trim() || 'Label',
      color: newColor.trim().replace(/^#/, '') || '6366F1',
      logo: newLogo.trim(),
      logoColor: 'white',
      style,
      linkUrl: newLink.trim() || '#',
    }

    onChangeBadges([...badges, newBadge])
  }

  const updateBadge = (id: string, patch: Partial<ShieldBadge>) => {
    onChangeBadges(
      badges.map((b) => (b.id === id ? { ...b, ...patch } : b))
    )
  }

  const removeBadge = (id: string) => {
    onChangeBadges(badges.filter((b) => b.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Quick Add Presets */}
      <div>
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          Quick Add Social / Contact Badges
        </label>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(PRESET_BADGE_TEMPLATES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => handleAddPreset(key)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: `#${t.color}` }}
              />
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Global Badge Style */}
      <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-300 font-medium">Badge Style:</span>
        <div className="flex gap-1.5">
          {(['flat-square', 'flat', 'for-the-badge'] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStyle(s)
                onChangeBadges(badges.map((b) => ({ ...b, style: s })))
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer ${
                style === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Active Badges List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            Configured Badges ({badges.length})
          </label>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col gap-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <img
                  src={buildShieldBadgeUrl(badge)}
                  alt={badge.label}
                  className="h-5"
                />
                <button
                  onClick={() => removeBadge(badge.id)}
                  className="p-1 text-slate-500 hover:text-red-400 transition cursor-pointer"
                  title="Remove badge"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Label</span>
                  <input
                    type="text"
                    value={badge.label}
                    onChange={(e) => updateBadge(badge.id, { label: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Message</span>
                  <input
                    type="text"
                    value={badge.message}
                    onChange={(e) => updateBadge(badge.id, { message: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Color (hex)</span>
                  <input
                    type="text"
                    value={badge.color}
                    onChange={(e) => updateBadge(badge.id, { color: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Logo Slug</span>
                  <input
                    type="text"
                    value={badge.logo}
                    onChange={(e) => updateBadge(badge.id, { logo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Target Link URL</span>
                <input
                  type="text"
                  value={badge.linkUrl}
                  onChange={(e) => updateBadge(badge.id, { linkUrl: e.target.value })}
                  placeholder="https://... or mailto:..."
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs font-mono"
                />
              </div>
            </div>
          ))}
          {badges.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No badges added yet. Click one of the quick presets above!
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Badge Form */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2.5">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5 text-indigo-400" />
          Add Custom Badge
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5">Label</span>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5">Message</span>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5">Color Hex</span>
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono"
            />
          </div>
        </div>

        {/* Color presets swatches */}
        <div className="flex items-center gap-1.5 pt-1">
          <Palette className="h-3 w-3 text-slate-500" />
          <div className="flex flex-wrap gap-1">
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch.hex}
                onClick={() => setNewColor(swatch.hex)}
                className="w-4 h-4 rounded-full border border-slate-700 hover:scale-125 transition cursor-pointer"
                style={{ backgroundColor: `#${swatch.hex}` }}
                title={`${swatch.name} (#${swatch.hex})`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5">
              Logo (Simple Icons name)
            </span>
            <input
              type="text"
              value={newLogo}
              onChange={(e) => setNewLogo(e.target.value)}
              placeholder="e.g. github, twitter, linkedin"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5">Link URL</span>
            <input
              type="text"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
            />
          </div>
        </div>

        <button
          onClick={handleAddCustom}
          className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Badge to Profile
        </button>
      </div>
    </div>
  )
}
