import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import createAutoVersion from './auto-version'
import createAppPwa from './app-pwa'

export default function createVitePlugins(viteEnv, isBuild = false) {
    const vitePlugins = [vue()]
    vitePlugins.push(createAutoImport())
	vitePlugins.push(createSetupExtend())
    vitePlugins.push(vuetify())
    vitePlugins.push(createSvgIcon(isBuild))
    vitePlugins.push(createAutoVersion())
    vitePlugins.push(createAppPwa())
	isBuild && vitePlugins.push(...createCompression(viteEnv))
    return vitePlugins
}
