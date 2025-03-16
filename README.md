<p align="center">
    <img alt="logo" width="68" height="auto" src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/logo/pwa_logo.png">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">YuanAI-Studio 一元AI工作台 V2.8.3</h1>
<h4 align="center">基于Django+Vue3前后端分离的Python AI工作台 YuanAI-Studio</h4>
<p align="center">


## 新三松简介

广州新三松数字科技有限公司专注于人工智能（AI）技术在内容创作领域的应用，为短视频带货、IP打造、个性化内容生成等，尤其在电商领域提供数字人解决方案，AI克隆技术，支持生成数字人分身、克隆声音及自动生成短视频。用户仅需输入文本或上传音频，即可快速生成高质量短视频，实现人物动作、表情与口型同步，单次使用成本仅需1元，大幅降低创作成本，上线后迅速成为内容创作者的“神器”，推动AI技术普及化。

YuanAI Studio is a one-stop AI creation platform developed by Guangzhou SanSong Digital Technology Co., Ltd. The company focuses on the application of artificial intelligence (AI) technology in content creation, providing solutions for short video marketing, IP development, and personalized content generation. It is especially known for its digital human solutions and AI cloning technology in the e-commerce field. Users can quickly generate high-quality short videos with synchronized actions, expressions, and lip movements by simply inputting text or uploading audio. The cost per use is only 1 yuan, significantly reducing the cost of content creation. Since its launch, YuanAI Studio has become a "must-have tool" for content creators and has accelerated the popularization of AI technology.
    

## 平台简介

* 前端采用Vue、Vuetify UI、Grid-Layout-Plus。
* 后端采用基于Django、Redis & Jwt。
* 权限认证使用Jwt，支持多终端认证系统。
* 支持加载动态权限菜单，多方式轻松权限控制。
* 本仓库为前端技术栈 [Vue3](https://v3.cn.vuejs.org) + [Vuetify3](https://vuetifyjs.com/zh-Hans) + [Vite](https://cn.vitejs.dev) 版本。


The frontend utilizes Vue, Vuetify UI, and Grid-Layout-Plus.
The backend is based on Django, Redis, and Jwt.
Authentication is implemented using Jwt, supporting a multi-terminal authentication system.
Dynamic permission menus are supported, allowing for flexible and easy control of permissions through multiple methods.
This repository is based on the frontend stack of Vue3, Vuetify3, and Vite.



## 前端运行

```bash
# 克隆项目
git clone https://github.com/yangzongzhuan/RuoYi-Vue3.git

# 进入项目目录
cd ai-workbench-github

# 安装依赖
yarn --registry=https://registry.npmmirror.com

# 启动服务
yarn dev

# 构建测试环境 yarn build:stage
# 构建生产环境 yarn build:prod
# 前端访问地址 http://localhost:80
```

## 内置功能

1.  周期热词：统计周期内热门带货视频的黄金3秒台词套路，寻找抓住用户眼球的创作灵感。
2.  图文排行：统计每日带货效果最好的图文，实时掌握图文带货风向标。
3.  抖音排行：掌握抖音热榜实时热门话题动向，快速复刻流量密码。
4.  GPT智能体：给AI人设，目标明确，要求清晰。
5.  视频去水印解析：支持抖音、快手、biibili、知乎、西瓜视频、小红书平台的视频去水印解析工具。
6.  照片生成数字人：让你的照片开口说话。
7.  视频换脸：尝试AI视频换脸，玩转角色扮演，享受智能A换脸视觉的独特魅力。
8.  视频数字人：生成你的短视频直播带货形象，支持短视频口播。
8.  AI混剪：基于强大的类似Sora AI模型，任意文本、图片都能快速生成高质量视频。
9.  AI视频素材：基于输入内容进行AI视频素材匹配，包含高清视频下载。
10. 抖音作品批量提取：获取抖音主页视频、音频作品。
11. 文案生成视频：文字描绘视频内容。
12. 照片变真人：只需一张照片，定制自己的数字人。
13. 声音克隆: 只需上传一段音频，即可克隆属于你的专属音色。

## 在线体验

- 手机号/验证码

演示地址：https://www.ai168.space

## 演示图

<table>
    <tr>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172259.png"/></td>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172317.png"/></td>
    </tr>
    <tr>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172425.png"/></td>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172508.png"/></td>
    </tr>
    <tr>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172523.png"/></td>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172533.png"/></td>
    </tr>
    <tr>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172552.png"/></td>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172637.png"/></td>
    </tr>	 
    <tr>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172645.png"/></td>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172659.png"/></td>
    </tr>
    <tr>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172745.png"/></td>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172830.png"/></td>
    </tr>
    <tr>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172841.png"/></td>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172905.png"/></td>
    </tr>
    <tr>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227172918.png"/></td>
        <td><img src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/cover/20250227174021.png"/></td>
    </tr>
</table>


## 一元AI工作台前后端分离交流群

微信群：  
 <tr>
    <td><img width="180" src="https://ai-workbench.oss-cn-guangzhou.aliyuncs.com/qr/qiwechat_ar.jpg"/></td>
</tr>

微信扫码入群。