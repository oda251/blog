/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            animation: {
                "focus-in-expand-fwd": "focus-in-expand-fwd 0.8s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
                typing: 'typing 1.4s steps(18), blink .4s step-end infinite alternate',
            },
            keyframes: {
                "focus-in-expand-fwd": {
                    "0%": {
                        "letter-spacing": "-.5em",
                        transform: "translateZ(-800px)",
                        filter: "blur(12px)",
                        opacity: "0"
                    },
                    to: {
                        transform: "translateZ(0)",
                        filter: "blur(0)",
                        opacity: "1"
                    }
                },
                typing: {
                    from: { width: '0' },
                },
                blink: {
                    '50%': { borderColor: 'transparent' },
                },
            }
        }
    },
    plugins: [],
}