import useAppStore from '@/store/modules/app'
import { getPublicComponent, addPublicComponent, getUserComponent, updateUserComponent, delUserComponent } from '@/api/sheet'

const useCardConfigStore = defineStore(
    'grid',
    {
        state: () => ({
            layout: [],
            presetLayouts: {}
        }),
        actions: {
            // 向后端请求用户组件数据
            getUserComponents() {
                return new Promise(resolve => {
                    // ***device_model: useAppStore().device 校验设备移动或PC决定添加组件以垂直还是横向顺序
                    getUserComponent({ device_model: useAppStore().device }).then(res => {
                        this.presetLayouts = res.data;
                        this.layout = useAppStore().device === 'mobile' ? res.data.xxs : res.data.lg
                        let arrIndex = []
                        // 移动端所有配置文件都关闭
                        res.data.xxs.forEach((item) => {
                            item.config.isDraggable = false;
                            item.config.isResizable = false;
                        })
                        res.data.lg.forEach((item, index) => {
                            if (item.components === 'PhotoRepair') {
                                arrIndex.push(index)
                            }
                        })
                        // 给第一个组件添加引导
                        if (arrIndex.length != 0) {
                            this.layout[arrIndex[0]]['guide'] = true;
                        }
                        console.log(res, "组件数据")
                        resolve(res.data)

                        // {lg:[],xxs[]}

                        // this.presetLayouts = {
                        //     lg: [
                        //         {
                        //             x: 0, y: 0, w: 3, h: 14, i: 0, components: 'VideoMaterial', title: 'AI视频素材', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/video_material.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         },
                        //         {
                        //             x: 3, y: 0, w: 3, h: 14, i: 1, components: 'VideoMaterial', title: 'AI视频素材', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/video_material.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         },
                        //         {
                        //             x: 6, y: 0, w: 3, h: 14, i: 2, components: 'VideoMaterial', title: 'AI视频素材', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/video_material.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         },
                        //         {
                        //             x: 9, y: 0, w: 3, h: 14, i: 3, components: 'VideoMaterial', title: 'AI视频素材123', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/video_material.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         },
                        //         {
                        //             x: 0, y: 14, w: 3, h: 14, i: 4, components: 'VideoMaterial', title: 'AI视频素材123', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/video_material.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         }, {
                        //             x: 3, y: 14, w: 3, h: 14, i: 5, components: 'VideoMaterial', title: 'AI视频素材123', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/video_material.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         }, {
                        //             x: 6, y: 14, w: 3, h: 14, i: 6, components: 'VideoMaterial', title: 'AI视频素材123', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/video_material.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         },
                        //     ],
                        //     xxs: [
                        //         {
                        //             x: 0, y: 0, w: 3, h: 14, i: 0, components: 'ImgReplaceFace', title: '图片换脸', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/photo_replaceFace.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         },
                        //         {
                        //             x: 0, y: 14, w: 3, h: 14, i: 1, components: 'ImgReplaceFace', title: '图片换脸', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/photo_replaceFace.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         },
                        //         {
                        //             x: 0, y: 28, w: 3, h: 14, i: 2, components: 'ImgReplaceFace', title: '图片换脸', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/photo_replaceFace.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         },
                        //         {
                        //             x: 0, y: 32, w: 3, h: 14, i: 3, components: 'ImgReplaceFace', title: '图片换脸', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/photo_replaceFace.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         },
                        //         {
                        //             x: 0, y: 46, w: 3, h: 14, i: 4, components: 'ImgReplaceFace', title: '图片换脸123', minH: 16, minW: 3,
                        //             img: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/photo_replaceFace.png",
                        //             config: {
                        //                 isDraggable: false,
                        //                 isResizable: false
                        //             }
                        //         }
                        //     ]
                        // }

                        // this.layout = this.presetLayouts.xxs

                    })


                })
            },
            // 修改用户组件拖拽开关
            draggableUserComponents(state, item) {
                return new Promise(resolve => {
                    let obj = JSON.parse(JSON.stringify(item));
                    obj.config.isDraggable = state;
                    let arr = [obj];
                    updateUserComponent({ components: arr }).then(res => {
                        resolve(res)
                    })
                })
            },
            // 修改用户组件缩放开关
            resizableUserComponents(state, item) {
                return new Promise(resolve => {
                    let obj = JSON.parse(JSON.stringify(item));
                    obj.config.isResizable = state;
                    let arr = [obj];
                    updateUserComponent({ components: arr }).then(res => {
                        resolve(res)
                    })
                })
            },
            // 修改用户组件大小配置
            resizeUserComponents(i, newH, newW, newHPx, newWPx, item) {
                return new Promise(resolve => {
                    let obj = JSON.parse(JSON.stringify(item));
                    obj.w = newW;
                    obj.h = newH;
                    obj.wPx = newWPx;
                    obj.hPx = newHPx;
                    let arr = [obj];
                    // console.log(newHPx, newWPx,"newHPx, newWPx")
                    updateUserComponent({ components: arr }).then(res => {
                        resolve(res)
                    })
                })
            },
            // 更新 layout 用户组件位置
            movedUserComponents(i, newX, newY, item) {
                return new Promise(resolve => {
                    let obj = JSON.parse(JSON.stringify(item));
                    obj.x = newX;
                    obj.y = newY;
                    let arr = [obj];
                    updateUserComponent({ components: arr }).then(res => {
                        resolve(res)
                    })
                })
            },
            // 关闭用户组件
            delUserComponents(item, index) {
                return new Promise(resolve => {
                    delUserComponent({ id: item.id }).then(res => {
                        // 模拟元素重载，防止 post 延迟
                        this.layout.splice(index, 1)
                        resolve(res)
                    })
                })
            },
            // 添加用户组件
            addPublicComponents(item) {
                return new Promise(resolve => {
                    const { id, type } = item
                    if (type === 'component') {
                        // ***device_model: useAppStore().device 校验设备移动或PC决定添加组件以垂直还是横向顺序
                        // x: 0, y: 16 
                        addPublicComponent({ id, device_model: useAppStore().device }).then(res => {
                            resolve(res)
                        })
                    } else {

                    }
                })
            },
            // 响应式布局更新处理
            updateBreakpoint(newBreakpoint, newLayout) {
                return new Promise(resolve => {
                    if (newLayout.length != 0) {
                        if (newBreakpoint === 'lg') {
                            this.layout = this.presetLayouts.lg
                        } else {
                            this.layout = this.presetLayouts.xxs
                        }
                        resolve()
                    }

                })

            },
            // 获取公共组件
            getPublicComponents(params) {
                return new Promise(resolve => {
                    getPublicComponent({ children_id: params.children_id }).then(res => {
                        resolve(res.data)
                    })
                })
            }

        }
    })

export default useCardConfigStore