import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';
import { mergeConfig, defineConfig } from 'vite';
import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import baseConfig, { baseManifest, baseBuildOptions } from './vite.config.base'

const outDir = resolve(__dirname, 'dist_chrome');

export default mergeConfig(
	baseConfig,
	defineConfig({
		plugins: [
			viteStaticCopy({
				targets: [
					{
						src: "src/assets/models/",
						dest: "models",
					},
				],
			}),
			crx({
				manifest: {
					...baseManifest,
					background: {
						service_worker: "src/pages/background/index.ts",
						type: "module",
					},
				} as ManifestV3Export,
				browser: "chrome",
				contentScripts: {
					injectCss: true,
				},
			}),
		],
		resolve: {
			alias: {
				"@assets": resolve(__dirname, "src/assets/"),
			},
		},
		build: {
			...baseBuildOptions,
			outDir,
		},
	})
);