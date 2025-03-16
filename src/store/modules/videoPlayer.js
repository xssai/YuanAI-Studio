

const useVideoPlayerStore = defineStore(
  'videoPlayer',
  {
    state: () => ({
      isVideoPlayer: false,
      videoPlayerUrl: "",
      videoPixel: "",
      videoSize: 0,
      videoDownloadList: [],
      videoTitle: ""
    }),
    actions: {
      openVideoWindow(params) {
        const { videoUrl, pixel, size, title, downloadList } = params
        this.videoTitle = title || "预览视频";
        this.videoPlayerUrl = videoUrl || "";
        this.videoPixel = pixel || "";
        this.videoSize = size || 0;
        this.videoDownloadList = downloadList || [];
        this.isVideoPlayer = true;
      },
      closeVideoWindow() {
        this.isVideoPlayer = false;
        this.videoPlayerUrl = "";
        this.videoPixel = "";
        this.videoSize = 0;
        this.videoDownloadList = [];
        this.videoTitle = null;
      }
    }
  })

export default useVideoPlayerStore
