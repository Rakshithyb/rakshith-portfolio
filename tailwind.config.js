/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome Reference Palette
        chaos: '#0F0F0F',
        shoewax: '#2B2B2B',
        thunder: '#4D4D4D',
        dull: '#717171',
        kingly: '#DEDEDE',
        dust: '#BCBCBC',
        spanish: '#979797',
        
        // Supporting Tokens
        purewhite: '#FFFFFF',
        darktext: '#171717',
        darkborder: '#363636',
        lightborder: '#D0D0D0',

        // Semantic Role Mappings & Legacy Aliases
        wine: {
          DEFAULT: '#0F0F0F',
          dark: '#0F0F0F',
          deep: '#0F0F0F',
          surface: '#2B2B2B',
          border: '#363636',
          light: '#2B2B2B',
        },
        cream: {
          DEFAULT: '#DEDEDE',
          subtle: '#FFFFFF',
          warm: '#E8E8E8',
          border: '#D0D0D0',
        },
        gold: {
          DEFAULT: '#979797',
          light: '#BCBCBC',
          muted: '#717171',
          dark: '#4D4D4D',
        },
        canvas: {
          DEFAULT: '#DEDEDE',
          subtle: '#FFFFFF',
          muted: '#E8E8E8',
          card: '#FFFFFF',
          dark: '#0F0F0F',
        },
        ink: {
          DEFAULT: '#171717',
          muted: '#4D4D4D',
          faint: '#717171',
          light: '#BCBCBC',
        },
        divider: {
          subtle: '#EAEAEA',
          DEFAULT: '#D0D0D0',
          strong: '#363636',
        }
      },
      fontFamily: {
        serif: [
          '"Cormorant Garamond"',
          '"Playfair Display"',
          'Georgia',
          'serif',
        ],
        display: [
          '"Playfair Display"',
          '"Cormorant Garamond"',
          'Georgia',
          'serif',
        ],
        script: [
          '"Alex Brush"',
          'cursive',
        ],
        sans: [
          '"Plus Jakarta Sans"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.02em',
        widest: '0.2em',
        mega: '0.25em',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}
