import { VitePWA } from 'vite-plugin-pwa'

export default function createAppPwa() {
    return VitePWA({
        injectRegister: 'auto',
        registerType: 'autoUpdate',
        devOptions: {
            enabled: true  // 是否支持开发模式下也使 pwa 生效
        },
        workbox: {
            maximumFileSizeToCacheInBytes: 5000000
        },
        // MANIFEST PWA https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
        manifest: {
            name: 'AI工作流平台',
            short_name: 'AI工作流',
            description: "支持各大主流平台批量提取视频、AI数字人、AI智能视频混剪、文案生成等功能的短视频创作",
            theme_color: "#373737",
            start_url: "./",
            display: "standalone",
            background_color: "#373737",
            icons: [		//添加图标， 注意路径和图像像素正确
                {
                    src: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/logo/pwa_logo.png',
                    sizes: '512x512',
                    type: 'image/png',
                },

            ]
        }
    })
}