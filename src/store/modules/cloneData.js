import { addVideoCloneTemplate, getVideoCloneTemplateCustom, getVideoCloneTemplatePublic, delVideoCloneTemplate, addVideoClone, getVideoClone, delVideoClone } from '@/api/sheet/VideoFigure'
import { getAudioClone, delAudioClone, getAudioPublicTts,getAudioPlatform } from '@/api/sheet/AudioClone'

const useCloneDataStore = defineStore(
    'clone',
    {
        state: () => ({
            videoCloneTemplateCustom: [],
            videoCloneTemplatePublic: [],
            audioCloneTemplateCustom: [],
            audioCloneTemplatePublic: [],
            audioCloneTemplatePlatform: []
        }),
        actions: {
            // 获取视频个人克隆模板
            getVideoCloneTemplateCustoms() {
                return new Promise(resolve => {
                    getVideoCloneTemplateCustom().then(res => {
                        this.videoCloneTemplateCustom = res.data;
                        resolve(res.data)
                    })
                })
            },
            // 获取视频克隆公共模板
            getVideoCloneTemplatePublics() {
                return new Promise(resolve => {
                    getVideoCloneTemplatePublic().then(res => {
                        this.videoCloneTemplatePublic = res.data;
                        resolve(res.data)
                    })
                })
            },
            // 删除视频个人克隆模板
            delVideoCloneTemplateCustom(ids) {
                return new Promise(resolve => {
                    delVideoCloneTemplate({ids}).then(res => {
                        resolve(res)
                    })
                })
            },
            // 获取音频个人克隆模板
            getAudioCloneTemplateCustoms() {
                return new Promise(resolve => {
                    getAudioClone().then(res => {
                        this.audioCloneTemplateCustom = res.data;
                        resolve(res.data)
                    })
                })
            },
            // 删除音频个人克隆模板
            delAudioCloneTemplateCustoms(ids) {
                return new Promise(resolve => {
                    delAudioClone({ids}).then(res => {
                        resolve(res)
                    })
                })
            },
            // 获取音频克隆公共模板
            getAudioCloneTemplatePublics() {
                return new Promise(resolve => {
                    getAudioPublicTts().then(res => {
                        this.audioCloneTemplatePublic = res.data;
                        resolve(res.data)
                    })
                })
            },
            // 获取平台克隆音频模板
            getAudioCloneTemplatePlatform() {
                return new Promise(resolve => {
                    getAudioPlatform().then(res => {
                        this.audioCloneTemplatePlatform = res.data;
                        resolve(res.data)
                    })
                })
            }

        }
    })

export default useCloneDataStore