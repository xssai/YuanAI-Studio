/* 状态值配置进度 */
export function rate(status) {
    if (status === 0) {
      return 25
    } else if (status === 1) {
      return 50
    } else if (status === 3) {
        return 75
    }else if (status === 2) {
      return 100
    } else if (status === 4) {
      return 100
    } else if (status === 5) {
      return 100
    }
  }
  
  /* 状态转译 */
  export function translate(status) {
    if (status === 0) {
      return "正在排队"
    } else if (status === 1) {
      return "正在生成"
    } else if (status === 2) {
      return "生成完成"
    } else if (status === 3) {
        return "正在读取"
    } else if (status === 4) {
      return "生成失败"
    } else if (status === 5) {
      return "等待重试"
    }
  }