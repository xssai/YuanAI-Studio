import { getCloneModel } from '@/api/selectModel'
import { fileDuration, parseMinute, minuteValidate } from '@/utils/public'

/* 
  clone_type: clone_video 形象模式，clone_voice声音模型， gen_video 视频克隆模式
*/

const useCloneModelStore = defineStore(
  'cloneModel',
  {
    state: () => ({
      figureCloneModel: [],
      voiceCloneModel: [],
      videoCloneModel: []
    }),
    actions: {
      // 获取形象克隆模式
      getFigureCloneModel() {
        const params = { clone_type: 'clone_video' };
        return new Promise((resolve, reject) => {
          getCloneModel(params).then(res => {
            this.figureCloneModel = res.data;
            resolve(res.data)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 验证形象克隆视频限制最小时长是否符合规则
      isFigureFileMinValidates(file, selectModel) {
        return new Promise(async (resolve, reject) => {
          let minDuration = 0;
          let duration = 0;
          let minValidate = false;
          if (file) {
            duration = await fileDuration(file);
            this.figureCloneModel.forEach(item => {
              if (selectModel == item.model) {
                minDuration = item.min;
                minValidate = minuteValidate(item.min);
              }
            })
            const message = `请上传大于${parseMinute(minDuration)}${minValidate ? '分钟' : '秒'}AI分身底板视频`
            resolve(duration >= minDuration || message);
          }

        })
      },
      // 验证形象克隆视频限制最大时长是否符合规则
      isFigureFileMaxValidates(file, selectModel) {
        return new Promise(async (resolve, reject) => {
          let maxDuration = 0;
          let duration = 0;
          let maxValidate = false;
          if (file) {
            duration = await fileDuration(file);
            this.figureCloneModel.forEach(item => {
              if (selectModel == item.model) {
                maxDuration = item.max;
                maxValidate = minuteValidate(item.max);
              }
            })
            const message = `请上传小于${parseMinute(maxDuration)}${maxValidate ? '分钟' : '秒'}AI分身底板视频`
            resolve(duration <= maxDuration || message);
          }

        })
      },
      // 获取音频克隆模式
      getVoiceCloneModel() {
        const params = { clone_type: 'clone_voice' };
        return new Promise((resolve, reject) => {
          getCloneModel(params).then(res => {
            this.voiceCloneModel = res.data;
            resolve(res.data)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 验证形象克隆视频限制最小时长是否符合规则
      isVoiceFileMinValidates(file, selectModel) {
        return new Promise(async (resolve, reject) => {
          let minDuration = 0;
          let duration = 0;
          let minValidate = false;
          if (file) {
            duration = await fileDuration(file);
            this.voiceCloneModel.forEach(item => {
              if (selectModel == item.model) {
                minDuration = item.min;
                minValidate = minuteValidate(item.min);
              }
            })
            const message = `请上传大于${parseMinute(minDuration)}${minValidate ? '分钟' : '秒'}音频文件`
            resolve(duration >= minDuration || message);
          }

        })
      },
      // 验证形象克隆视频限制最大时长是否符合规则
      isVoiceFileMaxValidates(file, selectModel) {
        return new Promise(async (resolve, reject) => {
          let maxDuration = 0;
          let duration = 0;
          let maxValidate = false;
          if (file) {
            duration = await fileDuration(file);
            this.voiceCloneModel.forEach(item => {
              if (selectModel == item.model) {
                maxDuration = item.max;
                maxValidate = minuteValidate(item.max);
              }
            })
            const message = `请上传小于${parseMinute(maxDuration)}${maxValidate ? '分钟' : '秒'}音频文件`
            resolve(duration <= maxDuration || message);
          }
        })
      },
      // 获取视频克隆模式
      getVideoCloneModel() {
        const params = { clone_type: 'gen_video' };
        return new Promise((resolve, reject) => {
          getCloneModel(params).then(res => {
            this.videoCloneModel = res.data;
            resolve(res.data)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 验证视频克隆文字限制最大长度是否符合规则
      isVideoFontSizeMaxValidates(font, selectModel) {
        if (!selectModel == 'text_driven') return
        return new Promise(async (resolve, reject) => {
          let maxFont = 0;
          if (font.length) {
            this.videoCloneModel.forEach(item => {
              if (selectModel == item.model) {
                maxFont = item.max;
                console.log(item.max)
              }
            })
            const message = `请正确填写小于${maxFont}字的驱动文本`
            resolve(font.length <= maxFont || message);
          }
        })
      },
      // 验证视频克隆文字限制最小长度是否符合规则
      isVideoFontSizeMinValidates(font, selectModel) {
        if (!selectModel == 'text_driven') return
        return new Promise(async (resolve, reject) => {
          let minFont = 0;
          if (font.length) {
            this.videoCloneModel.forEach(item => {
              if (selectModel == item.model) {
                minFont = item.min;
              }
            })
            const message = `请正确填写大于${minFont}字的驱动文本`
            resolve(font.length >= minFont || message);
          }
        })
      },
      // 验证视频克隆音频限制最小时长是否符合规则
      isAudioFileMinValidates(file, selectModel) {
        if (!selectModel == 'audio_driven') return
        return new Promise(async (resolve, reject) => {
          let minDuration = 0;
          let duration = 0;
          let minValidate = false;
          if (file) {
            duration = await fileDuration(file);
            this.videoCloneModel.forEach(item => {
              if (selectModel == item.model) {
                minDuration = item.min;
                minValidate = minuteValidate(item.min);
              }
            })
            const message = `请上传大于${parseMinute(minDuration)}${minValidate ? '分钟' : '秒'}音频文件`
            resolve(duration >= minDuration || message);
          }

        })
      },
      // 验证视频克隆音频限制最大时长是否符合规则
      isAudioFileMaxValidates(file, selectModel) {
        if (!selectModel == 'audio_driven') return
        return new Promise(async (resolve, reject) => {
          let maxDuration = 0;
          let duration = 0;
          let maxValidate = false;
          if (file) {
            duration = await fileDuration(file);
            this.videoCloneModel.forEach(item => {
              if (selectModel == item.model) {
                maxDuration = item.max;
                maxValidate = minuteValidate(item.max);
              }
            })
            const message = `请上传小于${parseMinute(maxDuration)}${maxValidate ? '分钟' : '秒'}音频文件`
            resolve(duration <= maxDuration || message);
          }
        })
      },
      // 通用验证视频文件最大时长是否符合规则
      isDefaultVideoMaxValidates(file, maxTime) {
        return new Promise(async (resolve, reject) => {
          if (file) {
            let duration = await fileDuration(file);
            console.log(duration)
            const message = `请上传小于${parseMinute(maxTime)}分钟的视频文件`
            resolve(duration <= maxTime || message);
          }
        })
      }
    }
  })

export default useCloneModelStore
