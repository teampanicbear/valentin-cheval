import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import swup from '@swup/astro';
import mdx from '@astrojs/mdx';

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';

// https://astro.build/config
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items = []) =>
    hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
    output: 'static',
    devToolbar: {
        enabled: false
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'viewport'
    },
    integrations: [
        react({ jsxRuntime: 'classic' }),
        markdoc(),
        solid({ devtools: true }),
        swup({
            theme: false,
            smoothScrolling: false,
            reloadScripts: false,
            containers: ['#swup'],
            routes: true,
        }),
        icon(),
        mdx(),
        ...whenExternalScripts(() =>
            partytown({
                config: { forward: ['dataLayer.push'] },
            })
        ),
        compress({
            CSS: true,
            HTML: {
                'html-minifier-terser': {
                    removeAttributeQuotes: false,
                },
            },
            Image: true,
            JavaScript: true,
            SVG: false,
            Logger: 1,
        })
    ],
    // image: {
    //     service: squooshImageService(),
    //     domains: ['cdn.pixabay.com'],
    // },
    vite: {
        resolve: {
            alias: {
            '~': path.resolve(__dirname, './src'),
            },
        },
    }
});
