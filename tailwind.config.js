/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						h1: {
							fontSize: "2.25rem",
							fontWeight: "bold",
							color: "#1F2937",
						},
						h2: {
							fontSize: "1.875rem",
							fontWeight: "semibold",
							color: "#1F2937",
						},
						h3: {
							fontSize: "1.5rem",
							fontWeight: "medium",
							color: "#1F2937",
						},
						h4: {
							fontSize: "1.25rem",
							fontWeight: "medium",
							color: "#1F2937",
						},
						h5: {
							fontSize: "1.125rem",
							fontWeight: "medium",
							color: "#1F2937",
						},
						h6: {
							fontSize: "1rem",
							fontWeight: "medium",
							color: "#1F2937",
						},
						"b, strong": { fontWeight: "bold" },
						i: { fontStyle: "italic" },
						u: { textDecoration: "underline" },
						ul: { listStyleType: "disc", paddingLeft: "1.5rem" },
						ol: { listStyleType: "decimal", paddingLeft: "1.5rem" },
					},
				},
			},
		},
		keyframes: {
			pulseSlow: {
			  "0%, 100%": { opacity: "1", transform: "scale(1)" },
			  "50%": { opacity: "0.7", transform: "scale(1.1)" }
			},
			textColorPulse: {
				'0%': { backgroundPosition: '200% 0%' },
          '100%': { backgroundPosition: '-200% 0%' },
			  },
			  "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },

		  },
		  animation: {
			pulseSlow: "pulseSlow 1.5s infinite ease-in-out",
			'text-color-pulse': 'textColorPulse 5s ease-in-out infinite',
			"accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      
		  }
		
	},
	plugins: [require("@tailwindcss/typography")],
};
