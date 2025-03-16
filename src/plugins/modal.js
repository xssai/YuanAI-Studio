import { useToast } from "vue-toastification";

const Toast = useToast()

export default {
  // 消息提示
  msg(content) {
    Toast.info(content)
  },
  // 错误消息
  msgError(content) {
    Toast.error(content)
  },
  // 成功消息
  msgSuccess(content) {
    Toast.success(content)
  },
  // 警告消息
  msgWarning(content) {
    Toast.warning(content)
  }
}
