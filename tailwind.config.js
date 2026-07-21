/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand core (manual de identidad)
        ink: '#191919',
        olive: '#2C2D1A',
        lime: '#DEF16B',
        'lime-deep': '#B9CC4A',
        gray: '#ACB0AF',
        cream: '#F5F6ED',
        // Derived dark surfaces
        'bg-0': '#111208',
        'bg-1': '#15160D',
        panel: '#1C1D12',
        'panel-2': '#24251A',
        'panel-3': '#2E2F20',
        // Text
        text: '#F5F6ED',
        'text-mut': '#9DA09A',
        'text-dim': '#6E7167',
        danger: '#F0795E',
      },
      borderRadius: {
        lg: '26px',
        md: '18px',
        sm: '12px',
      },
      fontFamily: {
        sans: ['Montserrat_500Medium'],
        mono: ['JetBrainsMono_600SemiBold'],
      },
    },
  },
  plugins: [],
};
