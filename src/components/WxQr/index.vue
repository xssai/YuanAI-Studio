<template>
    <div class="header w-100 d-flex justify-center">
        <div id="weiXin"></div>
    </div>
</template>
<script setup>
import { useTheme } from 'vuetify'
import useUserStore from '@/store/modules/user'

const theme = useTheme();
const currentTheme = computed(() => theme.global.name.value)

const darkQr = ref(`data:text/css;base64,LndlYl9xcmNvZGVfdHlwZV9pZnJhbWUge2Rpc3BsYXk6IGZsZXg7anVzdGlmeS1jb250ZW50OiBjZW50ZXI7YWxpZ24taXRlbXM6IGNlbnRlcjtiYWNrZ3JvdW5kLWNvbG9yOiAjMjEyMTIxO30KLmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6MjA0cHg7Ym9yZGVyOiBub25lO2JvcmRlci1yYWRpdXM6MnB4O30KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMDBweDt9Ci5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZX0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30gCi5pbXBvd2VyQm94IC5qc193eF9kZWZhdWx0X3RpcCBwOm50aC1jaGlsZCgyKSB7ZGlzcGxheTogbm9uZTt9`);
const lightQr = ref('data:text/css;base64,LndlYl9xcmNvZGVfdHlwZV9pZnJhbWUge2Rpc3BsYXk6IGZsZXg7anVzdGlmeS1jb250ZW50OiBjZW50ZXI7YWxpZ24taXRlbXM6IGNlbnRlcjt9Ci5pbXBvd2VyQm94IC5xcmNvZGUge3dpZHRoOjIwNHB4O2JvcmRlcjogbm9uZTtib3JkZXItcmFkaXVzOjJweDt9Ci5pbXBvd2VyQm94IC50aXRsZSB7ZGlzcGxheTogbm9uZTt9Ci5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMjAwcHg7fQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9Ci5pbXBvd2VyQm94IC5zdGF0dXMge3RleHQtYWxpZ246IGNlbnRlcjt9IAouaW1wb3dlckJveCAuanNfd3hfZGVmYXVsdF90aXAgcDpudGgtY2hpbGQoMikge2Rpc3BsYXk6IG5vbmU7fQ==');

const WxLogin = function (e) {
    let r = 'default';
    !0 === e.self_redirect ? (r = 'true') : !1 === e.self_redirect && (r = 'false');
    let n = document.createElement('iframe');
    let i =
        'https://open.weixin.qq.com/connect/qrconnect?appid=' +
        e.appid +
        '&scope=' +
        e.scope +
        '&redirect_uri=' +
        e.redirect_uri +
        '&state=' +
        e.state +
        '&login_type=jssdk&self_redirect=' +
        r +
        '&styletype=' +
        (e.styletype || '') +
        '&sizetype=' +
        (e.sizetype || '') +
        '&bgcolor=' +
        (e.bgcolor || '') +
        '&rst=' +
        (e.rst || '');
    (i += e.style ? '&style=' + e.style : ''),
        (i += e.href ? '&href=' + e.href : ''),
        (i += 'en' === e.lang ? '&lang=en' : ''),
        (n.src = i),
        (n.frameBorder = '0'),
        (n.allowTransparency = 'true'),
        (n.sandbox = 'allow-scripts allow-top-navigation allow-same-origin'),
        (n.scrolling = 'no'),
        (n.width = '400px'),
        (n.height = '300px');
    let s = document.getElementById(e.id);
    (s.innerHTML = ''), s.appendChild(n);
};

const shows = () => {
    const wx_appid = useUserStore().wx_appid || "";
    const wx_id = useUserStore().wx_id || "";
    const wx_redirect_uri = useUserStore().wx_redirect_uri || "";
    const wx_scope = useUserStore().wx_scope || "";
    const wx_self_redirect = useUserStore().wx_self_redirect || false

    // 父页面传过来的参数
    const DDNSResolution = encodeURIComponent(wx_redirect_uri); // 'https://www.ai168.space/wxLogin'
    var obj = new WxLogin({
        self_redirect: wx_self_redirect,
        id: wx_id,
        appid: wx_appid,
        scope: wx_scope,
        redirect_uri: DDNSResolution,
        state: Math.random(),
        style: `${currentTheme.value === 'light' ? 'black' : 'white'}`,// "white", // black
        href: `${currentTheme.value === 'light' ? lightQr.value : darkQr.value}`
    });

    console.log(obj);
};

onMounted(() => {
    shows();
});
</script>