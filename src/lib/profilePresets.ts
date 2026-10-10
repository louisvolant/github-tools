import type { NeofetchProfile } from './neofetchFormatter'
import { PRESET_ASCII_ARTS } from './asciiEngine'
import type { ShieldBadge } from './badgesBuilder'

export interface FullPreset {
  id: string
  name: string
  description: string
  asciiArt: string
  profile: NeofetchProfile
  badges: ShieldBadge[]
}

export const PROFILE_PRESETS: FullPreset[] = [
  {
    id: 'gracey',
    name: 'Gracey Dugar (Terminal ASCII)',
    description: 'Exact replica of Gracey Dugar profile with portrait and badges',
    asciiArt: PRESET_ASCII_ARTS.find((p) => p.id === 'gracey')?.art || '',
    profile: {
      header: {
        user: 'gracey',
        host: 'dugar',
      },
      mainItems: [
        { id: '1', label: 'OS', value: 'Windows 11, Android, Linux' },
        { id: '2', label: 'Uptime', value: '20 years' },
        { id: '3', label: 'Host', value: 'RapidNative, Bangalore' },
        { id: '4', label: 'Kernel', value: 'AI Product Manager' },
        { id: '4b', label: '', value: 'GTM x Growth' },
        { id: '5', label: 'IDE', value: 'VS Code 1.103' },
        { id: 'space1', label: '', value: '' },
        {
          id: '6',
          category: 'Langs',
          label: 'Programming',
          value: 'Java, Python, JS, C++',
        },
        {
          id: '7',
          category: 'Langs',
          label: 'Computer',
          value: 'HTML, CSS, JSON, YAML, SQL',
        },
        {
          id: '8',
          category: 'Langs',
          label: 'Real',
          value: 'English, Hindi, German',
        },
        { id: 'space2', label: '', value: '' },
        {
          id: '9',
          category: 'Hobbies',
          label: 'Software',
          value: 'Shipping AI side-projects,',
        },
        { id: '9b', label: '', value: 'prompt tinkering, automation' },
        {
          id: '10',
          category: 'Hobbies',
          label: 'Hardware',
          value: 'Underground robot for',
        },
        { id: '10b', label: '', value: 'mining of iron ores at minesafeai.in' },
        {
          id: '11',
          category: 'Hobbies',
          label: 'Analog',
          value: 'Guitar',
        },
      ],
      sections: [
        {
          id: 'contact',
          title: '- Contact',
          items: [
            {
              id: 'c1',
              category: 'Email',
              label: 'Personal',
              value: 'graceydugar@gmail.com',
            },
            {
              id: 'c2',
              category: 'Email',
              label: 'Work',
              value: 'gracey@shaper.studio',
            },
            { id: 'c3', label: 'Portfolio', value: 'graceydugar.github.io' },
            { id: 'c4', label: 'LinkedIn', value: 'Gracey Dugar' },
            { id: 'c5', label: 'Twitter / X', value: 'CreativeGracey' },
          ],
        },
        {
          id: 'stats',
          title: '- GitHub Stats',
          items: [
            { id: 's1', label: 'Repos', value: '43 {Contributed: 2}' },
            { id: 's2', label: 'Commits', value: '152' },
            {
              id: 's3',
              label: 'Lines of Code',
              value: '1,607,958 (1,610,646++, 2,688--)',
            },
          ],
        },
      ],
    },
    badges: [
      {
        id: 'b1',
        label: 'Gmail',
        message: 'graceydugar',
        color: 'EA4335',
        logo: 'gmail',
        logoColor: 'white',
        style: 'flat-square',
        linkUrl: 'mailto:graceydugar@gmail.com',
      },
      {
        id: 'b2',
        label: 'Work',
        message: 'gracey@shaper.studio',
        color: '8B5CF6',
        logo: 'maildotru',
        logoColor: 'white',
        style: 'flat-square',
        linkUrl: 'mailto:gracey@shaper.studio',
      },
      {
        id: 'b3',
        label: 'Portfolio',
        message: 'graceydugar.github.io',
        color: '222222',
        logo: 'githubpages',
        logoColor: 'white',
        style: 'flat-square',
        linkUrl: 'https://graceydugar.github.io',
      },
      {
        id: 'b4',
        label: 'LinkedIn',
        message: 'Gracey Dugar',
        color: '0A66C2',
        logo: 'linkedin',
        logoColor: 'white',
        style: 'flat-square',
        linkUrl: 'https://www.linkedin.com/in/gracey-dugar',
      },
      {
        id: 'b5',
        label: 'X',
        message: '@CreativeGracey',
        color: '000000',
        logo: 'x',
        logoColor: 'white',
        style: 'flat-square',
        linkUrl: 'https://twitter.com/CreativeGracey',
      },
    ],
  },
  {
    id: 'andrew',
    name: 'Andrew Grant (SVG Colors)',
    description: 'Replica of Andrew6rant dual dark/light colored SVG card',
    asciiArt: PRESET_ASCII_ARTS.find((p) => p.id === 'andrew')?.art || '',
    profile: {
      header: {
        user: 'andrew',
        host: 'grant',
      },
      mainItems: [
        { id: '1', label: 'OS', value: 'Windows 10, Android 14, Linux' },
        { id: '2', label: 'Uptime', value: '22 years, 5 months, 29 days' },
        { id: '3', label: 'Host', value: 'TTM Technologies, Inc.' },
        {
          id: '4',
          label: 'Kernel',
          value: 'CAM (Computer Aided Manufacturing) Operator',
        },
        { id: '5', label: 'IDE', value: 'IDEA 2023.3.2, VSCode 1.96.0' },
        { id: 'space1', label: '', value: '' },
        {
          id: '6',
          category: 'Languages',
          label: 'Programming',
          value: 'Java, Python, JavaScript, C++',
        },
        {
          id: '7',
          category: 'Languages',
          label: 'Computer',
          value: 'HTML, CSS, JSON, LaTeX, YAML',
        },
        {
          id: '8',
          category: 'Languages',
          label: 'Real',
          value: 'English, Spanish',
        },
        { id: 'space2', label: '', value: '' },
        {
          id: '9',
          category: 'Hobbies',
          label: 'Software',
          value: 'Minecraft Modding, iOS Jailbreaking',
        },
        {
          id: '10',
          category: 'Hobbies',
          label: 'Hardware',
          value: 'Overclocking, Undervolting',
        },
      ],
      sections: [
        {
          id: 'contact',
          title: '- Contact',
          items: [
            {
              id: 'c1',
              category: 'Email',
              label: 'Personal',
              value: 'agrantnmac@gmail.com',
            },
            {
              id: 'c2',
              category: 'Email',
              label: 'Work',
              value: 'Andrew.Grant@ttmtech.com',
            },
            { id: 'c3', label: 'LinkedIn', value: 'Andrew6rant' },
            { id: 'c4', label: 'Discord', value: 'andrew6rant' },
          ],
        },
        {
          id: 'stats',
          title: '- GitHub Stats',
          items: [
            { id: 's1', label: 'Repos', value: '95 {Contributed: 133}' },
            { id: 's2', label: 'Commits', value: '2,116 | Followers: 196' },
            {
              id: 's3',
              label: 'Lines of Code on GitHub',
              value: '446,276 (523,178++, 76,902--)',
            },
          ],
        },
      ],
    },
    badges: [
      {
        id: 'b1',
        label: 'Gmail',
        message: 'agrantnmac',
        color: 'EA4335',
        logo: 'gmail',
        logoColor: 'white',
        style: 'flat-square',
        linkUrl: 'mailto:agrantnmac@gmail.com',
      },
      {
        id: 'b2',
        label: 'LinkedIn',
        message: 'Andrew6rant',
        color: '0A66C2',
        logo: 'linkedin',
        logoColor: 'white',
        style: 'flat-square',
        linkUrl: 'https://linkedin.com/in/Andrew6rant',
      },
      {
        id: 'b3',
        label: 'Discord',
        message: 'andrew6rant',
        color: '5865F2',
        logo: 'discord',
        logoColor: 'white',
        style: 'flat-square',
        linkUrl: 'https://discord.com',
      },
    ],
  },
]
