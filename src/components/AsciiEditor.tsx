import React, { useRef, useState } from 'react'
import {
  Upload,
  Image as ImageIcon,
  Sliders,
  Type,
  User,
  Sparkles,
} from 'lucide-react'
import {
  CHAR_SETS,
  PRESET_ASCII_ARTS,
  imageDataToAscii,
} from '../lib/asciiEngine'
import type { CharSetKey, AsciiOptions } from '../lib/asciiEngine'

interface AsciiEditorProps {
  asciiArt: string
  onChange: (val: string) => void
}

export const AsciiEditor: React.FC<AsciiEditorProps> = ({
  asciiArt,
  onChange,
}) => {
  const [activePreset, setActivePreset] = useState<string>('gracey')
  const [charSetKey, setCharSetKey] = useState<CharSetKey>('classicInverted')
  const [customCharSet] = useState<string>('')
  const [width, setWidth] = useState<number>(36)
  const [brightness, setBrightness] = useState<number>(0)
  const [contrast, setContrast] = useState<number>(20)
  const [invert, setInvert] = useState<boolean>(true)
  const [githubAvatarUser, setGithubAvatarUser] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processImageToAscii = (img: HTMLImageElement) => {
    const canvas = canvasRef.current || document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Aspect ratio adjustment: monospace font characters are ~2x taller than wide
    const fontAspect = 0.52
    const targetCols = width
    const targetRows = Math.round((img.height / img.width) * targetCols * fontAspect)

    canvas.width = targetCols
    canvas.height = targetRows

    // Render image resized to canvas
    ctx.drawImage(img, 0, 0, targetCols, targetRows)
    const imgData = ctx.getImageData(0, 0, targetCols, targetRows)

    const chosenCharSet = customCharSet || CHAR_SETS[charSetKey]
    const options: AsciiOptions = {
      width: targetCols,
      brightness,
      contrast,
      invert,
      charSet: chosenCharSet,
    }

    const lines = imageDataToAscii(imgData, options)
    onChange(lines.join('\n'))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setLoadedImage(img)
        processImageToAscii(img)
        setIsProcessing(false)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleFetchAvatar = () => {
    if (!githubAvatarUser.trim()) return
    setIsProcessing(true)
    const clean = githubAvatarUser.trim().replace(/^@/, '')
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      setLoadedImage(img)
      processImageToAscii(img)
      setIsProcessing(false)
    }
    img.onerror = () => {
      alert(`Could not load avatar for GitHub user "${clean}". Make sure the username exists.`)
      setIsProcessing(false)
    }
    img.src = `https://avatars.githubusercontent.com/${clean}`
  }

  const handleApplyParams = () => {
    if (loadedImage) {
      processImageToAscii(loadedImage)
    }
  }

  const handleSelectPreset = (id: string) => {
    setActivePreset(id)
    const preset = PRESET_ASCII_ARTS.find((p) => p.id === id)
    if (preset) {
      onChange(preset.art)
      setLoadedImage(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden canvas for offscreen image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Preset Art Picker */}
      <div>
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          Preset ASCII Art
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_ASCII_ARTS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                activePreset === preset.id && !loadedImage
                  ? 'border-indigo-500 bg-indigo-500/10 text-white'
                  : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-xs font-semibold truncate">{preset.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload / GitHub Avatar */}
      <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-cyan-400" />
          Convert Photo or Avatar to ASCII
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Upload file */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Image File
            </button>
          </div>

          {/* GitHub Avatar */}
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <User className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={githubAvatarUser}
                onChange={(e) => setGithubAvatarUser(e.target.value)}
                placeholder="GitHub Username"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleFetchAvatar}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition cursor-pointer"
            >
              Fetch
            </button>
          </div>
        </div>

        {/* Sliders when image is loaded */}
        {loadedImage && (
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Sliders className="h-3 w-3 text-amber-400" /> Adjust Image Filters
              </span>
              <button
                onClick={handleApplyParams}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Re-render ASCII
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Width:</span>
                  <span>{width} cols</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="50"
                  value={width}
                  onChange={(e) => {
                    setWidth(Number(e.target.value))
                    if (loadedImage) processImageToAscii(loadedImage)
                  }}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Contrast:</span>
                  <span>{contrast}</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="80"
                  value={contrast}
                  onChange={(e) => {
                    setContrast(Number(e.target.value))
                    if (loadedImage) processImageToAscii(loadedImage)
                  }}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Brightness:</span>
                  <span>{brightness}</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={brightness}
                  onChange={(e) => {
                    setBrightness(Number(e.target.value))
                    if (loadedImage) processImageToAscii(loadedImage)
                  }}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={invert}
                    onChange={(e) => {
                      setInvert(e.target.checked)
                      if (loadedImage) processImageToAscii(loadedImage)
                    }}
                    className="accent-indigo-500 rounded"
                  />
                  <span>Invert Dark/Light</span>
                </label>
              </div>
            </div>

            <div className="pt-1">
              <label className="text-[11px] text-slate-400 block mb-1">Character Palette:</label>
              <select
                value={charSetKey}
                onChange={(e) => {
                  const key = e.target.value as CharSetKey
                  setCharSetKey(key)
                  if (loadedImage) {
                    const chosen = customCharSet || CHAR_SETS[key]
                    const options: AsciiOptions = {
                      width,
                      brightness,
                      contrast,
                      invert,
                      charSet: chosen,
                    }
                    const canvas = canvasRef.current
                    if (canvas) {
                      const ctx = canvas.getContext('2d')
                      if (ctx) {
                        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                        onChange(imageDataToAscii(imgData, options).join('\n'))
                      }
                    }
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
              >
                <option value="classicInverted">Classic Portrait (Gracey style: '@%#*+=-:. )</option>
                <option value="classic">Classic Standard ( .:-=+*#%@')</option>
                <option value="andrew">Andrew Grant Density Palette</option>
                <option value="blocks">High Contrast Blocks ( ░▒▓█)</option>
                <option value="minimal">Minimalist ( .:#*)</option>
                <option value="detailed">Ultra Detailed 70-chars</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Manual ASCII Text Editor */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-violet-400" />
            Direct ASCII Text Editor
          </label>
          <span className="text-[11px] text-slate-500">
            {asciiArt.split('\n').length} lines
          </span>
        </div>
        <textarea
          rows={12}
          value={asciiArt}
          onChange={(e) => onChange(e.target.value)}
          className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-lg p-3 text-emerald-400 placeholder-slate-700 focus:outline-none focus:border-indigo-500 whitespace-pre overflow-x-auto leading-tight"
          spellCheck={false}
          placeholder="Paste or type ASCII art here..."
        />
      </div>
    </div>
  )
}
