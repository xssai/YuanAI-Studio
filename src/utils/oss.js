import OSS from "ali-oss";
import { v7 as uuidv7 } from 'uuid';
import { vuetifyFileInfo, filterSize } from '@/utils'
import useFileProgressStore from '@/store/modules/fileProgress'
import useUserStore from '@/store/modules/user'

export function sendUpload(option) {
    return new Promise(async (resolve, reject) => {
        // 参数
        const region = useUserStore().oss_region || "";
        // const accessKeyId = useUserStore().oss_accessKeyId || "";
        // const secretAccessKey = useUserStore().oss_secretAccessKey || "";
        // const bucketName = useUserStore().oss_bucket_name || "";
        const targetUrl = useUserStore().oss_targetUrl || ''

        // 初始化OSS
        const aliOSS = new OSS({
            // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
            region: region,
            // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
            accessKeyId: accessKeyId,
            accessKeySecret: secretAccessKey,
            authorizationV4: true,
            // 填写Bucket名称。
            bucket: bucketName,
        })

        // 生成UUID作为当次上传文件名
        const uuid = uuidv7();

        //可能会连续点击上传多个文件，这里用时间戳来区分每一次上传的文件
        let uniSign = Date.now()

        // 获取文件信息
        const { expandName, fileName } = await vuetifyFileInfo(option.Body);
        // 路径
        const key = `/works/${option.taskType}/${useUserStore().userid}/${uuid}.${option.format || expandName}`;

        try {
            const result = await aliOSS.multipartUpload(key, option.Body, {
                progress: (p) => {
                    // 文件大小
                    let totalSize = option.Body.size
                    // 上传进度
                    let uploadProgress = Math.round(p * 100);
                    // 已上传文件大小
                    let uploadedSize = option.Body.size * p

                    // 显示总传输进度
                    useFileProgressStore().setFileProgress('SET_PROGRESS', {
                        path: uniSign,
                        name: `${fileName}.${expandName}`,
                        progress: uploadProgress,
                        loaded: filterSize(uploadedSize),
                        total: filterSize(totalSize),
                        type: 'upload',
                        status: uploadProgress == 100 ? 'success' : 'downloading'
                    }) // 将此次下载的文件名和下载进度组成对象
                }
            });

            console.log(result, "文件上传成功")
            useFileProgressStore().autoCloseFileProgress() // 关闭传输窗口
            const url = `${targetUrl}${key}`;
            console.log(url, ":上传后文件读取地址")
            resolve(url);
        } catch (e) {
            console.log(e);
            reject(e)

        }

    })
}