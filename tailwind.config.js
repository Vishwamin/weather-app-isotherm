/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        void: '#0A1118',
        slate: {
          DEFAULT: '#16212E',
          light: '#1E2C3B',
          border: '#28394B'
        },
        mist: '#B9C6D1',
        paper: '#EDEFF0',
        ember: {
          DEFAULT: '#FF7A45',
          dim: '#C25A31'
        },
        glacier: {
          DEFAULT: '#4FD1C5',
          dim: '#2F8E85'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace']
      },
      backgroundImage: {
        'grain': "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};
