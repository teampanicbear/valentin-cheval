import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import swup from '@swup/astro';

import { defineConfig } from 'astro/config';

// https://astro.build/config
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items = []) =>
    hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
    output: 'static',
    site: 'https://valentincheval.design',
    trailingSlash: 'never',
    devToolbar: {
        enabled: false
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'load'
    },
    integrations: [
        solid({ devtools: true }),
        swup({
            theme: false,
            smoothScrolling: false,
            reloadScripts: false,
            containers: ['#swup'],
            globalInstance: true,
            preload: {
                hover: false,
                visible: true
            },
            routes: [
                { name: 'home', path: '/' },
                { name: 'projects', path: '/projects' },
                { name: 'project', path: '/project/:slug' },
                { name: 'any', path: '(.*)' },
            ],
        })
    ],
    vite: {
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
            },
        },
    }
});
