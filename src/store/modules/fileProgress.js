let timer = null;

const useFileProgressStore = defineStore(
  'fileProgress',
  {
    state: () => ({
      showProgress: false,
      progressList: []
    }),
    actions: {
      // 设置进度
      setFileProgress(status, progressObj) {
        if (this.progressList.length) { // 如果进度列表存在
          if (this.progressList.find(item => item.path == progressObj.path)) { // 前面说的path时间戳是唯一存在的，所以如果在进度列表中找到当前的进度对象\
            this.progressList.find(item => item.path == progressObj.path).loaded = progressObj.loaded // 改变当前下载文件大小
            this.progressList.find(item => item.path == progressObj.path).progress = progressObj.progress // 改变当前进度对象的progress
            this.progressList.find(item => item.path == progressObj.path).status = progressObj.status // 改变当前进度对象的status
            this.showProgress = true;
            clearTimeout(timer)
          } else {
            this.progressList.push(progressObj) // 当前进度列表为空，没有下载任务，直接将该进度对象添加到进度数组内
          }

        } else {
          this.progressList.push(progressObj) // 当前进度列表为空，没有下载任务，直接将该进度对象添加到进度数组内
        }
      },
      // 手动关闭文件传输显示
      closeFileProgress() {
        this.showProgress = false;
        this.progressList = [];
      },
      // 自动关闭文件传输显示
      autoCloseFileProgress() {
        timer = setTimeout(() => {
          this.showProgress = false;
          this.progressList = [];
          clearTimeout(timer)
        }, 4000);
      },
      // 开启文件传输显示
      openFileProgress() {
        this.showProgress = false;
      }
    }
  })

export default useFileProgressStore
