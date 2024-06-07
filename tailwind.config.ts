import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neutral: {
          100: '#D0D1D6',
          200: '#A8ABB3',
          300: '#878A94',
          400: '#555861',
          500: '#363840',
          600: '#2B2E36',
          700: '#1F2128',
          800: '#13151C',
          900: '#0B0D13',
        },
        greenish: {
          100: '#DDF6EB',
          200: '#BAEED7',
          300: '#75D9AD',
          400: '#47C48E',
          500: '#29A46F',
          600: '#22875B',
          700: '#1B6B49',
          800: '#145136',
          900: '#0E3725',
          1000: '#082015',
        },
        opacityLight: {
          5: 'rgba(208, 209, 214, 0.05)',
          10: 'rgba(208, 209, 214, 0.1)',
          80: 'rgba(208, 209, 214, 0.8)',
        },
        opacityDark: {
          40: 'rgba(11, 13, 19, 0.4)',
          50: 'rgba(11, 13, 19, 0.5)',
          60: 'rgba(11, 13, 19, 0.6)',
          70: 'rgba(11, 13, 19, 0.7)',
          80: 'rgba(11, 13, 19, 0.8)',
          90: 'rgba(11, 13, 19, 0.9)',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config