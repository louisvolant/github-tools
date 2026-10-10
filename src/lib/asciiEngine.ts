/**
 * ASCII Art Conversion Engine and Presets
 */

export interface AsciiOptions {
  width: number
  contrast: number // -100 to 100
  brightness: number // -100 to 100
  invert: boolean
  charSet: string
  dither?: boolean
}

export const CHAR_SETS = {
  classic: " .:-=+*#%@'",
  classicInverted: "'@%#*+=-:. ",
  andrew: " `'.:,;!~^|ijlr{}[]()wmkpbhd#NMW%@gQ",
  blocks: ' ░▒▓█',
  minimal: ' .:#*',
  binary: ' 01',
  detailed: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
} as const

export type CharSetKey = keyof typeof CHAR_SETS

export interface AsciiPreset {
  id: string
  name: string
  description: string
  art: string
}

export const PRESET_ASCII_ARTS: AsciiPreset[] = [
  {
    id: 'gracey',
    name: 'Gracey Dugar (Portrait)',
    description: 'Classic ASCII portrait from Gracey Dugar GitHub profile',
    art: `                  '.'
                ,+%@@%*+,
              +#@@*+*=+@@+
            '#@@%=,,:,,,#@%,
           ,%@@*:,:,,:--+@@%'
           *%**:-:==:--:,#@@'
         '+%@*-,:---:=:++#@@*
         *@%@+::::::-+:-:-@@@=
        .+%%@@-:-=::=*+:=#@@@@,
       ',-#%@@+,::::-*==#@@@@@:
      ',*%#@@@@=::::-=+#@@@@@%-
        +%#%@@@*--=+*#@@@@@%%@%
    ::,:+%@@@%%@*::=*%@@@@@@@@*
   ':::=#%%@%%%%%+--=*%@%@@@@%#-'
  ''',,.-%#%@%%##+----*#%%%@@@@*',
 '' '..,:%%%%%%#:--::::=@@@%@%%%-,
' '''.,:*@%%#%%@-.,,.'.-*%@%@%%-+=
  '.',,:#*#%#%*%*,,...,*%#%@%%#=.=
'   .,..-,#%%-,:*:,..',=:=+@@%+*:,
'''' ..':*+:+:.:--,..'-*,.-#@**=,,
  ''''.':+,.':=:.-*'''=-',,-#%*,.,
    '., ',,:.'::,-,'''*: '::*#+=,,
 ''',,.'''.,,:-,,.'-. ..'',:*+*,:,
  '''...'''''.,,'',+,  .''',-=+,,.
    '.,.'' '  '.'' +-..'''',.',.,.`,
  },
  {
    id: 'andrew',
    name: 'Andrew Grant (Art)',
    description: 'Detailed ASCII contour art from Andrew6rant profile',
    art: `           g@M%@%%@N%Nw,,
        ,M*|\`||*%gNM=]mM%g||%N,
       p!\`\`  '! |''\` '''|||jhlj%w
     ,@L \`    ,,        ''!\`|j%M]%M
    ]j'\` .,wp@pw,    \`.     ''''|%Wg
  /{||]@@@@@@@@@pp.             |||||
 '\` ']@@@@@@@@@@@@@@p     , ,'''\` \`
  , :]%%@@@@@%%%%%%k%h '*||mkr     *
  '  j%M\`      |jkk'   ~nrn=|i    ;\`
   !  jrr*^\`             \`"!  L'':!
    j  lp;,.  ,/ @@    ,;\\nmy "  ,~
   i r @@@@mmHM @@@@ \`^****M*,p ;,
   | ]@@@@HHH]g@M%%%%%H,jmgpmb%  j
    ;;%%%%%k%@[,.n|;.;j%%k|%k%%',[
     H|%%k%%%j%k||,;;j;!!'|%ij}]@
     "djjmkL,"]][,,,,wwxw;|#kjk\`
       %;%km%%%%M%M|%%jkkii|||[
        kjj%%kkkl|!||||||j|||"
         |jm%H@@@b%%kkmk%i|!,[
         @p|j%%%%jkk|||j*'\`;j[
        ]@@@g|'''\`'''  \` ,;j%k
        @@@@@mgmp;,,,,:;jj%%k%
       @@@@@@@@%%kgki!|jjjj%k%@ .
. ^['' %@@@@HH%b%k{illljkjj%%%% ; \`,\`.
=[' \` . %HH%%%%%H@gkilljjj%kk%".   \`'i`,
  },
  {
    id: 'octocat',
    name: 'GitHub Octocat',
    description: 'Cute GitHub Mascot Octocat ASCII',
    art: `           MMM.           .MMM
           MMMMMMMMMMMMMMMMMMM
           MMMMMMMMMMMMMMMMMMM
          MMMM   MMMMMMM   MMMM
         MMMMM   MMMMMMM   MMMMM
        MMMMMMM MMMMMMMMM MMMMMMM
        MMMMMMMMMMMMMMMMMMMMMMMMM
        MMMMMMMMMMMMMMMMMMMMMMMMM
         MMMM     MMMMM     MMMM
          MMMMMMMM     MMMMMMMM
            MMMMMMMMMMMMMMMMM
                MMMMMMMMM
                 MMMMMMM`,
  },
  {
    id: 'tux',
    name: 'Linux Tux',
    description: 'Classic Linux mascot Tux Penguin',
    art: `           .--.
          |o_o |
          |:_/ |
         //   \\ \\
        (|     | )
       /'\\_   _/\\'\\
       \\___)=(___/`,
  },
  {
    id: 'apple',
    name: 'Apple Logo',
    description: 'Minimal Apple logo ASCII',
    art: `                 .:'
             __ :'__
          .'\`__\`-'\`__\`.
         :__________.-'
         :_________:
          :_________\`-;
           \`.__.-.__.'`,
  },
  {
    id: 'terminal',
    name: 'Retro Terminal',
    description: 'Neofetch vintage CRT monitor with prompt',
    art: `     .------------------.
     | .--------------. |
     | |  >_ neofetch | |
     | |   system: OK | |
     | '--------------' |
     '--------..--------'
        __..--''--..__
       '--------------'`,
  },
]

/**
 * Adjust pixel brightness and contrast
 */
export function adjustPixel(
  val: number,
  contrast: number,
  brightness: number
): number {
  // Brightness: -100..100
  let v = val + brightness * 2.55

  // Contrast: -100..100
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
  v = factor * (v - 128) + 128

  return Math.max(0, Math.min(255, v))
}

/**
 * Converts image pixel matrix (grayscale) to ASCII lines
 */
export function pixelsToAscii(
  pixels: number[][],
  charSet: string,
  invert: boolean
): string[] {
  const chars = invert ? [...charSet].reverse().join('') : charSet
  const charLen = chars.length

  return pixels.map((row) => {
    return row
      .map((gray) => {
        // gray: 0 (black) to 255 (white)
        const index = Math.min(
          charLen - 1,
          Math.max(0, Math.floor((gray / 256) * charLen))
        )
        return chars[index]
      })
      .join('')
  })
}

/**
 * Converts ImageData from a Canvas into ASCII lines
 */
export function imageDataToAscii(
  imageData: ImageData,
  options: AsciiOptions
): string[] {
  const { width, height, data } = imageData
  const { contrast, brightness, invert, charSet } = options

  const grayscaleMatrix: number[][] = []

  for (let y = 0; y < height; y++) {
    const row: number[] = []
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4
      const r = data[offset]
      const g = data[offset + 1]
      const b = data[offset + 2]
      const a = data[offset + 3]

      // Standard perceptual luminance
      let gray = 0.299 * r + 0.587 * g + 0.114 * b

      // If transparent pixel, treat as white/background
      if (a < 128) {
        gray = 255
      }

      gray = adjustPixel(gray, contrast, brightness)
      row.push(gray)
    }
    grayscaleMatrix.push(row)
  }

  return pixelsToAscii(grayscaleMatrix, charSet, invert)
}

/**
 * Normalizes ASCII string lines to uniform width with trailing space padding
 */
export function normalizeAsciiLines(
  rawAscii: string,
  padToWidth?: number
): { lines: string[]; maxWidth: number } {
  const rawLines = rawAscii.split('\n')
  // Strip empty lines at start and end
  while (rawLines.length > 0 && rawLines[0].trim() === '') rawLines.shift()
  while (rawLines.length > 0 && rawLines[rawLines.length - 1].trim() === '')
    rawLines.pop()

  const detectedMaxWidth = rawLines.reduce(
    (max, l) => Math.max(max, l.length),
    0
  )
  const targetWidth = padToWidth ?? detectedMaxWidth

  const lines = rawLines.map((line) => line.padEnd(targetWidth, ' '))

  return { lines, maxWidth: targetWidth }
}
