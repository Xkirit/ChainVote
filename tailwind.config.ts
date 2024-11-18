import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
			fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
				rajdhani: ['Rajdhani', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif'],
				nunito: ['Nunito', 'sans-serif'], // Add your font here
      },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			"meteor-effect": "meteor 5s linear infinite",
  			shimmer: "shimmer 2s linear infinite",
  			"spotlight": "spotlight 2s ease .75s 1 forwards",
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
				'spin-slow': 'spin 3s linear infinite',
				'bounce': 'bounce 3s infinite',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  		},
  		keyframes: {
  			meteor: {
  				"0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
  				"70%": { opacity: "1" },
  				"100%": {
  					transform: "rotate(215deg) translateX(-500px)",
  					opacity: "0",
  				},
  			},
  			shimmer: {
  				from: {
  					"backgroundPosition": "0 0"
  				},
  				to: {
  					"backgroundPosition": "-200% 0"
  				}
  			},
  			spotlight: {
  				"0%": {
  					opacity: "0",
  					transform: "translate(-72%, -62%) scale(0.5)",
  				},
  				"100%": {
  					opacity: "1",
  					transform: "translate(-50%,-40%) scale(1)",
  				},
  			},
  		},
  	}
  },
  plugins: [require("tailwindcss-animate"),
		require('daisyui'),
	],
} satisfies Config;
