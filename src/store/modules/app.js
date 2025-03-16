import Cookies from 'js-cookie'

const useAppStore = defineStore(
  'app',
  {
    state: () => ({
      sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true, // Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : 
        hide: Cookies.get('sidebarHide') ? !!+Cookies.get('sidebarHide'): false
      },
      device: 'desktop',
      size: Cookies.get('size') || 'default',
      displayHeight: 0
    }),
    actions: {
      toggleSideBar() {
        if (this.device == 'mobile') {
          if (this.sidebar.hide) {
            return false;
          }
          this.sidebar.opened = !this.sidebar.opened
          if (this.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
          } else {
            Cookies.set('sidebarStatus', 0)
          }
        }

        if (this.device == 'desktop') {
          this.sidebar.opened = true
          this.sidebar.hide = !this.sidebar.hide
          if (this.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
          } else {
            Cookies.set('sidebarStatus', 0)
          }
          if (this.sidebar.hide) {
            Cookies.set('sidebarHide', 1)
          } else {
            Cookies.set('sidebarHide', 0)
          }
        }

      },
      closeSideBar() {
        this.sidebar.hide = false
        this.sidebar.opened = false
      },
      toggleDevice(device) {
        this.device = device
      },
      setSize(size) {
        this.size = size;
        Cookies.set('size', size)
      },
      setInnerHeight(displayData) {
        const {height} = displayData
        this.displayHeight = height
      },
      toggleSideBarHide(status) {
        this.sidebar.hide = status
      }
    }
  })

export default useAppStore
