import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        earth: {
          green: "hsl(var(--earth-green))",
          orange: "hsl(var(--earth-orange))",
          brown: "hsl(var(--earth-brown))",
        },
        sky: {
          blue: "hsl(var(--sky-blue))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        glass: "var(--border-radius-glass)",
      },
      backdropBlur: {
        'glass': '20px',
        'glass-light': '10px',
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
        "floating": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "fade-in": {
          "from": { opacity: "0", transform: "translateY(30px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.5)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.8)" },
        },
        "spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulseGlow": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(var(--primary) / 0.4), 0 0 40px hsl(var(--primary) / 0.2)",
          },
          "50%": {
            boxShadow: "0 0 40px hsl(var(--primary) / 0.8), 0 0 80px hsl(var(--primary) / 0.4)",
          },
        },
        "scanLine": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "holoShimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "neonBorder": {
          "0%, 100%": {
            borderColor: "hsl(var(--primary) / 0.5)",
            boxShadow: "inset 0 0 20px hsl(var(--primary) / 0.2)",
          },
          "50%": {
            borderColor: "hsl(var(--secondary) / 0.8)",
            boxShadow: "inset 0 0 40px hsl(var(--secondary) / 0.4)",
          },
        },
        "particleFloat": {
          "0%, 100%": {
            transform: "translate(0, 0) rotate(0deg)",
            opacity: "0.3",
          },
          "25%": {
            transform: "translate(20px, -30px) rotate(90deg)",
            opacity: "0.7",
          },
          "50%": {
            transform: "translate(-15px, -60px) rotate(180deg)",
            opacity: "1",
          },
          "75%": {
            transform: "translate(30px, -40px) rotate(270deg)",
            opacity: "0.5",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "floating": "floating 6s ease-in-out infinite",
        "fade-in": "fade-in 1s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "spin": "spin 4s linear infinite",
        "shimmer": "shimmer 1.5s ease-in-out",
        "pulseGlow": "pulseGlow 2s ease-in-out infinite",
        "scanLine": "scanLine 3s infinite",
        "holoShimmer": "holoShimmer 3s ease infinite",
        "neonBorder": "neonBorder 3s infinite",
        "particleFloat": "particleFloat 15s infinite ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
