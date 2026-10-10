import React, { useState } from 'react'
import {
  Plus,
  Trash2,
  Loader2,
  Server,
  Settings2,
} from 'lucide-react'
import type {
  NeofetchProfile,
  FormatterOptions,
  InfoItem,
} from '../lib/neofetchFormatter'
import { fetchGitHubUser, calculateUptime } from '../lib/githubApi'
import { GithubIcon } from './GithubIcon'
import { generateId } from '../lib/idGenerator'

interface InfoEditorProps {
  profile: NeofetchProfile
  options: FormatterOptions
  onChangeProfile: (profile: NeofetchProfile) => void
  onChangeOptions: (options: FormatterOptions) => void
}

export const InfoEditor: React.FC<InfoEditorProps> = ({
  profile,
  options,
  onChangeProfile,
  onChangeOptions,
}) => {
  const [ghUsername, setGhUsername] = useState<string>('')
  const [isFetchingGh, setIsFetchingGh] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const handleFetchGithub = async () => {
    if (!ghUsername.trim()) return
    setIsFetchingGh(true)
    setFetchError(null)

    try {
      const data = await fetchGitHubUser(ghUsername)
      const uptimeStr = calculateUptime(data.created_at)

      // Update profile with fetched information
      const updatedProfile: NeofetchProfile = {
        ...profile,
        header: {
          user: data.login.toLowerCase(),
          host: (data.name || 'github').toLowerCase().replace(/\s+/g, '-'),
        },
        mainItems: profile.mainItems.map((item) => {
          if (item.label.toLowerCase() === 'uptime') {
            return { ...item, value: uptimeStr }
          }
          if (item.label.toLowerCase() === 'host' && data.location) {
            return { ...item, value: data.location }
          }
          if (item.label.toLowerCase() === 'kernel' && data.bio) {
            return { ...item, value: data.bio }
          }
          return item
        }),
        sections: profile.sections.map((sec) => {
          if (sec.id === 'stats') {
            return {
              ...sec,
              items: sec.items.map((it) => {
                if (it.label.toLowerCase() === 'repos') {
                  return { ...it, value: `${data.public_repos}` }
                }
                return it
              }),
            }
          }
          if (sec.id === 'contact') {
            return {
              ...sec,
              items: sec.items.map((it) => {
                if (it.label.toLowerCase() === 'portfolio' && data.blog) {
                  return { ...it, value: data.blog.replace(/^https?:\/\//, '') }
                }
                if (
                  it.label.toLowerCase().includes('twitter') &&
                  data.twitter_username
                ) {
                  return { ...it, value: `@${data.twitter_username}` }
                }
                return it
              }),
            }
          }
          return sec
        }),
      }

      onChangeProfile(updatedProfile)
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch GitHub profile')
    } finally {
      setIsFetchingGh(false)
    }
  }

  const updateHeader = (field: 'user' | 'host', val: string) => {
    onChangeProfile({
      ...profile,
      header: {
        ...profile.header,
        [field]: val,
      },
    })
  }

  const updateMainItem = (idx: number, patch: Partial<InfoItem>) => {
    const updated = [...profile.mainItems]
    updated[idx] = { ...updated[idx], ...patch }
    onChangeProfile({ ...profile, mainItems: updated })
  }

  const addMainItem = () => {
    const newItem: InfoItem = {
      id: generateId('item'),
      category: '',
      label: 'NewField',
      value: 'Value',
    }
    onChangeProfile({ ...profile, mainItems: [...profile.mainItems, newItem] })
  }

  const removeMainItem = (idx: number) => {
    const updated = profile.mainItems.filter((_, i) => i !== idx)
    onChangeProfile({ ...profile, mainItems: updated })
  }

  const updateSectionItem = (
    secIdx: number,
    itemIdx: number,
    patch: Partial<InfoItem>
  ) => {
    const updatedSections = [...profile.sections]
    const sec = { ...updatedSections[secIdx] }
    const updatedItems = [...sec.items]
    updatedItems[itemIdx] = { ...updatedItems[itemIdx], ...patch }
    sec.items = updatedItems
    updatedSections[secIdx] = sec
    onChangeProfile({ ...profile, sections: updatedSections })
  }

  const addSectionItem = (secIdx: number) => {
    const updatedSections = [...profile.sections]
    const sec = { ...updatedSections[secIdx] }
    const newItem: InfoItem = {
      id: generateId('sec_item'),
      category: '',
      label: 'NewStat',
      value: '0',
    }
    sec.items = [...sec.items, newItem]
    updatedSections[secIdx] = sec
    onChangeProfile({ ...profile, sections: updatedSections })
  }

  const removeSectionItem = (secIdx: number, itemIdx: number) => {
    const updatedSections = [...profile.sections]
    const sec = { ...updatedSections[secIdx] }
    sec.items = sec.items.filter((_, i) => i !== itemIdx)
    updatedSections[secIdx] = sec
    onChangeProfile({ ...profile, sections: updatedSections })
  }

  return (
    <div className="space-y-4">
      {/* GitHub Auto Sync */}
      <div className="p-3 bg-gradient-to-r from-slate-900 to-indigo-950/40 rounded-xl border border-indigo-500/20">
        <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <GithubIcon className="h-3.5 w-3.5" /> Auto-fill from GitHub Profile
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={ghUsername}
            onChange={(e) => setGhUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchGithub()}
            placeholder="e.g. GraceyDugar or Andrew6rant"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleFetchGithub}
            disabled={isFetchingGh}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            {isFetchingGh ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <GithubIcon className="h-3.5 w-3.5" />
            )}
            Auto-fill
          </button>
        </div>
        {fetchError && (
          <p className="text-[11px] text-red-400 mt-1.5">{fetchError}</p>
        )}
      </div>

      {/* Header user@host */}
      <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Server className="h-3.5 w-3.5 text-emerald-400" />
          Terminal Prompt Header (user@host)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">User</span>
            <input
              type="text"
              value={profile.header.user}
              onChange={(e) => updateHeader('user', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Host / Domain</span>
            <input
              type="text"
              value={profile.header.host}
              onChange={(e) => updateHeader('host', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            System Specs & Details
          </label>
          <button
            onClick={addMainItem}
            className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Field
          </button>
        </div>

        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {profile.mainItems.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800/80 hover:border-slate-700"
            >
              <input
                type="text"
                placeholder="Category"
                value={item.category || ''}
                onChange={(e) => updateMainItem(idx, { category: e.target.value })}
                className="w-20 bg-slate-800 border border-slate-700/60 rounded px-1.5 py-1 text-[11px] text-amber-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                title="Category (e.g. Langs, Hobbies)"
              />
              <span className="text-slate-500 text-xs">.</span>
              <input
                type="text"
                placeholder="Label"
                value={item.label}
                onChange={(e) => updateMainItem(idx, { label: e.target.value })}
                className="w-28 bg-slate-800 border border-slate-700/60 rounded px-1.5 py-1 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                title="Label (e.g. OS, Programming)"
              />
              <span className="text-slate-500 text-xs">:</span>
              <input
                type="text"
                placeholder="Value"
                value={item.value}
                onChange={(e) => updateMainItem(idx, { value: e.target.value })}
                className="flex-1 bg-slate-800 border border-slate-700/60 rounded px-1.5 py-1 text-[11px] text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                title="Value (e.g. Windows 11, TypeScript)"
              />
              <button
                onClick={() => removeMainItem(idx)}
                className="p-1 text-slate-500 hover:text-red-400 transition cursor-pointer"
                title="Remove line"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sections (Contact, GitHub Stats) */}
      <div className="space-y-3">
        {profile.sections.map((section, secIdx) => (
          <div
            key={section.id}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                {section.title}
              </span>
              <button
                onClick={() => addSectionItem(secIdx)}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Add Item
              </button>
            </div>

            <div className="space-y-1.5">
              {section.items.map((item, itemIdx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1.5 bg-slate-800/60 p-1.5 rounded-lg border border-slate-750"
                >
                  <input
                    type="text"
                    placeholder="Cat"
                    value={item.category || ''}
                    onChange={(e) =>
                      updateSectionItem(secIdx, itemIdx, {
                        category: e.target.value,
                      })
                    }
                    className="w-16 bg-slate-900 border border-slate-700/60 rounded px-1.5 py-0.5 text-[11px] text-amber-300 placeholder-slate-600"
                  />
                  <input
                    type="text"
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) =>
                      updateSectionItem(secIdx, itemIdx, {
                        label: e.target.value,
                      })
                    }
                    className="w-24 bg-slate-900 border border-slate-700/60 rounded px-1.5 py-0.5 text-[11px] text-slate-200 placeholder-slate-600"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={item.value}
                    onChange={(e) =>
                      updateSectionItem(secIdx, itemIdx, {
                        value: e.target.value,
                      })
                    }
                    className="flex-1 bg-slate-900 border border-slate-700/60 rounded px-1.5 py-0.5 text-[11px] text-cyan-300 placeholder-slate-600"
                  />
                  <button
                    onClick={() => removeSectionItem(secIdx, itemIdx)}
                    className="p-1 text-slate-500 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Formatting & Alignment Settings */}
      <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2.5">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Settings2 className="h-3.5 w-3.5 text-indigo-400" />
          Alignment & Padding Settings
        </label>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Target Width:</span>
              <span>{options.totalWidth} chars</span>
            </div>
            <input
              type="range"
              min="40"
              max="65"
              value={options.totalWidth}
              onChange={(e) =>
                onChangeOptions({
                  ...options,
                  totalWidth: Number(e.target.value),
                })
              }
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Gap Width:</span>
              <span>{options.gapWidth} spaces</span>
            </div>
            <input
              type="range"
              min="3"
              max="14"
              value={options.gapWidth}
              onChange={(e) =>
                onChangeOptions({
                  ...options,
                  gapWidth: Number(e.target.value),
                })
              }
              className="w-full accent-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">Dot Padding Style:</span>
          <div className="flex gap-2">
            <button
              onClick={() =>
                onChangeOptions({ ...options, alignmentMode: 'justified' })
              }
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                options.alignmentMode === 'justified'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Justified (Andrew style)
            </button>
            <button
              onClick={() =>
                onChangeOptions({ ...options, alignmentMode: 'fixed-column' })
              }
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                options.alignmentMode === 'fixed-column'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Column (Gracey style)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
