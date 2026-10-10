# GitHub Neofetch & ASCII Profile Studio

<p align="center">
  <img src="public/favicon.svg" width="64" height="64" alt="Terminal Icon" />
</p>

<p align="center">
  <a href="https://vite.dev"><img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://pages.cloudflare.com"><img src="https://img.shields.io/badge/Cloudflare-Pages%20Ready-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Pages Ready"></a>
</p>

An interactive studio to create aesthetic **Neofetch-style ASCII art** and **dual-mode colored SVG profile headers** with **Shields.io social badges** for your GitHub Profile README.

Inspired by popular GitHub profiles such as [@GraceyDugar](https://github.com/GraceyDugar) (clean monochrome ASCII art with dotted Neofetch alignment and shields buttons) and [@Andrew6rant](https://github.com/Andrew6rant) (colored SVG cards with syntax highlights for dark and light modes).

---

## ✨ Features

- **🖼️ Image to ASCII Converter**:
  - Upload local photos or auto-fetch any GitHub avatar (`https://avatars.githubusercontent.com/{username}`).
  - Fine-tune contrast, brightness, width (cols), and invert dark/light modes in real-time using HTML5 Canvas.
  - Character density palettes: Classic (`@%#*+=-:. `), Andrew Grant contours, High Contrast Blocks (` ░▒▓█`), Minimalist (` .:#*`), Binary (` 01`), and Ultra-Detailed (70-char ramp).
  - Built-in ASCII presets: Gracey Dugar Portrait, Andrew Grant Art, GitHub Octocat, Linux Tux, Apple Logo, Retro CRT Terminal.
  - Direct character-by-character ASCII editor.

- **💻 Neofetch System Information Engine**:
  - Live GitHub API sync: Enter any GitHub username to automatically populate bio, location, account uptime, repositories count, and followers.
  - Auto-formatting with dotted line alignment: supports both **Justified dots** (flushes values right with filled dot leaders) and **Fixed Column dots** (classic left-aligned Neofetch column).
  - Customizable sections: OS, Uptime, Host, Kernel, IDE, Languages (Programming, Computer, Real), Hobbies, Contact, and GitHub Stats.
  - Add, remove, and edit custom fields and sections on the fly.

- **🎨 Dual Dark / Light SVG Card Generator**:
  - Generates standalone `dark_mode.svg` and `light_mode.svg` with syntax highlighting (orange keys, blue values, green additions `++`, red deletions `--`, muted dots).
  - Produces a GitHub-compatible `<picture>` tag that switches automatically according to user system appearance (`prefers-color-scheme`).

- **🛡️ Shields.io Badges Builder**:
  - One-click presets for popular socials: Gmail, Work Email, Portfolio, LinkedIn, X (Twitter), GitHub, Discord, YouTube, Bluesky.
  - Custom badge creator: label, message, hex color picker with brand swatches, Simple Icons slug, and link URL.
  - Configurable styles: `flat-square`, `flat`, `for-the-badge`.
  - Centered `<p align="center">...` HTML block output.

- **👀 Real-Time Multi-View Preview**:
  - **Terminal View**: CRT terminal with macOS window controls and monospace rendering.
  - **GitHub Profile Simulation**: Simulates the exact GitHub repository README container with live dark/light mode switcher.
  - **Dual SVG Cards**: Live inline rendering of dark and light SVGs with instant download buttons.
  - **Raw Markdown**: Complete ready-to-copy `README.md` code block.

- **⚡ Cloudflare Ready**:
  - Client-side Single Page Application with 0 external runtime server dependencies.
  - Pre-configured `wrangler.toml` for Cloudflare Pages deployment with `pages_build_output_dir = "dist"`.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested with Node.js 24)
- npm

### Installation
```bash
# Clone the repository
git clone git@github.com:louisvolant/github-tools.git
cd github-tools

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Testing & Quality

Run the test suite with Vitest:
```bash
npm test
```

Run linter:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

---

## ☁️ Deployment on Cloudflare Pages

This application is built as a static client-side single-page app and is ready for Cloudflare Pages.

### Using Cloudflare Pages Git Integration
1. Connect your GitHub repository to Cloudflare Pages.
2. Build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

### Using Wrangler CLI
```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=github-ascii-tools
```

`wrangler.toml` configuration:
```toml
name = "github-ascii-tools"
compatibility_date = "2024-09-23"
pages_build_output_dir = "dist"

[vars]
ENVIRONMENT = "production"
```

---

## 📁 Project Structure

```
github-tools/
├── public/
│   └── favicon.svg                  # Terminal application icon
├── src/
│   ├── components/
│   │   ├── AsciiEditor.tsx          # Image converter, sliders, and ASCII editor
│   │   ├── BadgesEditor.tsx         # Shields.io badges builder and presets
│   │   ├── GithubIcon.tsx           # GitHub SVG icon
│   │   ├── Header.tsx               # Header with preset loaders and export actions
│   │   ├── InfoEditor.tsx           # Neofetch fields editor and GitHub API auto-fill
│   │   └── PreviewPanel.tsx         # Live preview tabs (Terminal, GitHub, SVG, Markdown)
│   ├── lib/
│   │   ├── __tests__/               # Vitest unit test suite (19 tests)
│   │   ├── asciiEngine.ts           # Pixel processing, dithering, and ASCII presets
│   │   ├── badgesBuilder.ts         # Shields.io badge URL and HTML generation
│   │   ├── githubApi.ts             # GitHub user profile fetcher and uptime helper
│   │   ├── idGenerator.ts           # Unique ID generator
│   │   ├── neofetchFormatter.ts     # Dotted padding calculation and layout composer
│   │   ├── profilePresets.ts        # Gracey Dugar & Andrew Grant presets
│   │   └── svgGenerator.ts          # Syntax-highlighted dark/light SVG generator
│   ├── App.tsx                      # Main Studio application
│   ├── index.css                    # Tailwind CSS v4 styling
│   └── main.tsx                     # React entrypoint
├── index.html                       # HTML shell
├── package.json                     # Scripts and dependencies
├── vite.config.ts                   # Vite & Vitest configuration
└── wrangler.toml                    # Cloudflare Pages deployment config
```

---

## 📄 Output Examples

### ASCII Code Block (Gracey Dugar Style)
````text
                  '.'                gracey@dugar
                ,+%@@%*+,            --------------------------
              +#@@*+*=+@@+           OS: .................... Windows 11, Android, Linux
            '#@@%=,,:,,,#@%,         Uptime: .................................. 20 years
           ,%@@*:,:,,:--+@@%'        Host: ...................... RapidNative, Bangalore
           *%**:-:==:--:,#@@'        Kernel: ........................ AI Product Manager
         '+%@*-,:---:=:++#@@*                                              GTM x Growth
         *@%@+::::::-+:-:-@@@=       IDE: ................................ VS Code 1.103
        .+%%@@-:-=::=*+:=#@@@@,
       ',-#%@@+,::::-*==#@@@@@:      Langs.Programming: .......... Java, Python, JS, C++
      ',*%#@@@@=::::-=+#@@@@@%-      Langs.Computer: ........ HTML, CSS, JSON, YAML, SQL
        +%#%@@@*--=+*#@@@@@%%@%      Langs.Real: ................ English, Hindi, German
    ::,:+%@@@%%@*::=*%@@@@@@@@*
   ':::=#%%@%%%%%+--=*%@%@@@@%#-'    Hobbies.Software: ...... Shipping AI side-projects,
  ''',,.-%#%@%%##+----*#%%%@@@@*',                         prompt tinkering, automation
 '' '..,:%%%%%%#:--::::=@@@%@%%%-,   Hobbies.Hardware: ........... Underground robot for
' '''.,:*@%%#%%@-.,,.'.-*%@%@%%-+=                     mining of iron ores at minesafeai.in
  '.',,:#*#%#%*%*,,...,*%#%@%%#=.=   Hobbies.Analog: ............................ Guitar
'   .,..-,#%%-,:*:,..',=:=+@@%+*:,
'''' ..':*+:+:.:--,..'-*,.-#@**=,,   - Contact
  ''''.':+,.':=:.-*'''=-',,-#%*,.,   Email.Personal: ............. graceydugar@gmail.com
    '., ',,:.'::,-,'''*: '::*#+=,,   Email.Work: .................. gracey@shaper.studio
 ''',,.'''.,,:-,,.'-. ..'',:*+*,:,   Portfolio: .................. graceydugar.github.io
  '''...'''''.,,'',+,  .''',-=+,,.   LinkedIn: ............................ Gracey Dugar
    '.,.'' '  '.'' +-..'''',.',.,.   Twitter / X: ....................... CreativeGracey

                                     - GitHub Stats
                                     Repos: ........................ 43 {Contributed: 2}
                                     Commits: ...................................... 152
                                     Lines of Code: ... 1,607,958 (1,610,646++, 2,688--)
````

### Shields Badges HTML
```html
<p align="center">
<a href="mailto:graceydugar@gmail.com"><img src="https://img.shields.io/badge/Gmail-graceydugar-EA4335?style=flat-square&logo=gmail&logoColor=white"></a>
<a href="mailto:gracey@shaper.studio"><img src="https://img.shields.io/badge/Work-gracey%40shaper.studio-8B5CF6?style=flat-square&logo=maildotru&logoColor=white"></a>
<a href="https://graceydugar.github.io"><img src="https://img.shields.io/badge/Portfolio-graceydugar.github.io-222222?style=flat-square&logo=githubpages&logoColor=white"></a>
<a href="https://www.linkedin.com/in/gracey-dugar"><img src="https://img.shields.io/badge/LinkedIn-Gracey%20Dugar-0A66C2?style=flat-square&logo=linkedin&logoColor=white"></a>
<a href="https://twitter.com/CreativeGracey"><img src="https://img.shields.io/badge/X-@CreativeGracey-000000?style=flat-square&logo=x&logoColor=white"></a>
</p>
```

---

## 📜 License

MIT License. Open source and ready for GitHub profiles.
