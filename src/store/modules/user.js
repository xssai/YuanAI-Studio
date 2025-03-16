import { login, getInfo, registerUserState, getEnterpriseInfo, wechatPhoneBind } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      name: '',
      phone: '',
      avatar: '',
      vip: '',
      integral: '',
      userid: '',
      newUsers: 0,
      roles: [],
      permissions: [],
      enterpriseName: '',
      icon: '',
      kefuQr: '',
      policy: '',
      agreement: '',
      add_integral: 0,
      deduct_integral: 0,
      // OSS存储
      oss_region: '',
      oss_accessKeyId: '',
      oss_secretAccessKey: '',
      oss_bucket_name: '',
      oss_targetUrl: '',
      // 微信登录
      wx_appid: '',
      wx_id: '',
      wx_redirect_uri: '',
      wx_scope: '',
      wx_self_redirect: false,
    //   第三方接入密钥
      ApiKey: ""
    }),
    actions: {
      // 登录
      login(info) {
        return new Promise((resolve, reject) => {
          login(info).then(res => {
            if (info.login_type === 'phone_login') {
              setToken(res.data.token, { expires: 180 })
              this.token = res.data.token
            } else if (info.login_type === 'wxchat_login') {
              if (res.code === 200) {
                setToken(res.data.token, { expires: 180 })
                this.token = res.data.token
              }
            }
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            const { nickname, phone_number, vip, integral, avatar_url, user_id, newUsers, add_integral, deduct_integral,api_key } = res.data

            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              this.roles = res.roles // admin 管理员   common 访客
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            
            this.userid = user_id
            this.newUsers = newUsers
            this.name = nickname
            this.phone = phone_number
            this.vip = vip
            this.integral = integral
            this.add_integral = add_integral
            this.deduct_integral = deduct_integral
            this.avatar = (avatar_url == "" || avatar_url == null) ? defAva : avatar_url
            this.ApiKey = api_key
            console.log(res.data, "登录信息")
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          this.token = ''
          this.roles = []
          this.permissions = []
          removeToken()
          resolve()
        })
      },
      // 注册新老用户
      registerUser() {
        return new Promise((resolve, reject) => {
          registerUserState().then(() => {
            resolve();
          })
        })
      },
      // 微信与手机号绑定
      wxPhoneBind(info) {
        return new Promise((resolve, reject) => {
          wechatPhoneBind(info).then((res) => {
            if (res.code === 200) {
              setToken(res.data.token, { expires: 180 })
              this.token = res.data.token
            }
            resolve(res);
          })
        })
      },
      // 获取企业信息（应对多个环境下定制化）
      getEnterprise() {
        return new Promise((resolve, reject) => {
          getEnterpriseInfo().then((result) => {
            const { enterprise_name, icon_url, privacy_policy_url, user_agreement, kefu_qr, oss_region, oss_accessKeyId, oss_secretAccessKey, oss_bucket_name, oss_targetUrl } = result.data
            this.enterpriseName = enterprise_name
            this.icon = icon_url
            this.kefuQr = kefu_qr
            // 协议
            this.policy = privacy_policy_url
            this.agreement = user_agreement
            // OSS 存储
            this.oss_region = oss_region
            this.oss_accessKeyId = oss_accessKeyId
            this.oss_secretAccessKey = oss_secretAccessKey
            this.oss_bucket_name = oss_bucket_name
            this.oss_targetUrl = oss_targetUrl
            // 微信登录
            if (result.data.wxlogin_config) {
              const { appid, id, redirect_uri, scope, self_redirect } = result.data.wxlogin_config
              this.wx_appid = appid
              this.wx_id = id
              this.wx_redirect_uri = redirect_uri
              this.wx_scope = scope
              this.wx_self_redirect = self_redirect
            }
            resolve(result);
          })
        })
      }
    }
  })

export default useUserStore
