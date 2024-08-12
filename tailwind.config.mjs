/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            animation: {
                typing: 'typing 1.4s steps(18), blink .4s step-end infinite alternate',
            },
            keyframes: {
                typing: {
                    from: { width: '0' },
                },
                blink: {
                    '50%': { borderColor: 'transparent' },
                },
            },
        },
    },
    plugins: [],
}