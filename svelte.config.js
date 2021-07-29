import sveltePreprocess from 'svelte-preprocess';
//import node from '@sveltejs/adapter-node';
import cfworker from '@sveltejs/adapter-cloudflare-workers';
//import pkg from './package.json';

/** @type {import('@sveltejs/kit').Config} */
export default {
//module.exports = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sveltePreprocess(),
	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		adapter: cfworker(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
            server: {
                hmr: {
                    protocol: 'ws',
                    port: 3001,
                }
            },
            /*
			ssr: {
				noExternal: Object.keys(pkg.dependencies || {})
			}
            */
            ssr: {
                noExternal: ['@popperjs/core']
            }
		}
	}
};
