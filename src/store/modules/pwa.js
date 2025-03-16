const usePwaStore = defineStore(
    'pwa',
    {
        state: () => ({
            isTopAddToHome: false,
            isBottomAddToHome: false
        }),
        actions: {
            installEventList() {
                window.addEventListener('beforeinstallprompt', (e) => {
                    window.deferredPrompt = e;
                    this.isTopAddToHome = true;
                    this.isBottomAddToHome = true;
                    console.log(window.deferredPrompt, "开始监听pwa");
                })
            },
            addToHome() {
                // Show the prompt
                window.deferredPrompt.prompt()
                // Wait for the user to respond to the prompt
                window.deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        this.isTopAddToHome = false;
                        this.isBottomAddToHome = false

                        // window.location.href = '/' // 添加成功就回到首页
                        console.log(choiceResult, 'User accepted the A2HS prompt--pwa回调');
                    } else {
                        console.log(choiceResult, 'User dismissed the A2HS prompt--pwa回调');
                    }
                    window.deferredPrompt = null;
                });

            },
            closeWindow() {
                this.isBottomAddToHome = false;
            }

        }
    })

export default usePwaStore