import { componentSelect } from '@/api/system/enum'

const useEnumStore = defineStore(
    'enum',
    {
        state: () => ({
            componentSelectList: []
        }),
        actions: {
            // 获取用户信息
            getComponentSelect() {
                return new Promise((resolve, reject) => {
                    componentSelect().then(res => {
                        this.componentSelectList = res.data
                        resolve(res.data)
                    }).catch(error => {
                        reject(error)
                    })
                })
            }
        }
    })

export default useEnumStore
