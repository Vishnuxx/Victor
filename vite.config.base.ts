import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';
import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import { defineConfig, BuildOptions } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths'
import { stripDevIcons, crxI18n } from './custom-vite-plugins';
import manifest from './manifest.json';
// import devManifest from './manifest.dev.json';
import pkg from './package.json';
import { readFileSync } from 'fs';



const isDev = process.env.__DEV__ === 'true';
// set this flag to true, if you want localization support
const localize = false;

export const baseManifest = {
    ...manifest,
    version: pkg.version,
    // ...(isDev ? devManifest : {} as ManifestV3Export),
    ...(localize ? {
      name: '__MSG_extName__',
      description: '__MSG_extDescription__',
      default_locale : 'en'
    } : {})
} as ManifestV3Export

export const baseBuildOptions: BuildOptions = {
  sourcemap: isDev,
  emptyOutDir: !isDev
}

function onnxLoader() {
	return {
		name: "onnx-loader",
		transform(code, id) {
			if (id.endsWith(".onnx")) {
				const contents = readFileSync(id);
				return {
					code: `export default ${JSON.stringify(contents.toString("base64"))};`,
					map: null,
				};
			}
		},
	};
}

export default defineConfig({
	plugins: [tsconfigPaths(), onnxLoader(), react(), stripDevIcons(isDev), crxI18n({ localize, src: "./src/locales" })],
	publicDir: resolve(__dirname, "public"),
});
