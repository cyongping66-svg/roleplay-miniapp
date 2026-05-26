# 人设工坊 - 微信小程序

一个基于微信小程序的虚拟人设打造与朋友圈内容生成工具。

## 功能特色

- **明亮虚拟形象引导**：首页有一个可爱的虚拟助手"小智"，通过动画和对话引导用户开始人设打造流程
- **苏格拉底式提问**：通过层层深入的对话，帮助用户从模糊的想法中提炼出清晰的人设定位
- **多维能力图谱**：生成包含10个维度的能力雷达图，全面展示人设特征
- **参数微调**：用户可以手动滑动调整每个能力维度，定制内容配比和发布频率
- **朋友圈内容生成**：基于人设自动生成拟真的朋友圈动态，包括行业资讯分享、个人感悟、日常生活和互动内容
- **实时新闻数据**：内置AI/科技/创业领域的新闻数据库，为朋友圈内容提供素材支持
- **角色扮演模拟**：根据人设风格自动调整语言风格和表达方式

## 项目结构

```
roleplay-miniapp/
├── app.js                    # 应用入口，全局数据管理
├── app.json                  # 应用配置，页面路由、TabBar等
├── app.wxss                  # 全局样式，CSS变量、通用组件样式
├── project.config.json       # 微信开发者工具项目配置
├── sitemap.json              # 站点地图
├── pages/
│   ├── index/                # 首页 - 虚拟形象引导页
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── questionnaire/        # 苏格拉底提问页 - AI对话
│   │   ├── questionnaire.js
│   │   ├── questionnaire.json
│   │   ├── questionnaire.wxml
│   │   └── questionnaire.wxss
│   ├── ability-chart/        # 能力图谱页 - 多维能力表
│   │   ├── ability-chart.js
│   │   ├── ability-chart.json
│   │   ├── ability-chart.wxml
│   │   └── ability-chart.wxss
│   ├── adjust/               # 参数调整页 - 微调人设参数
│   │   ├── adjust.js
│   │   ├── adjust.json
│   │   ├── adjust.wxml
│   │   └── adjust.wxss
│   ├── moments/              # 朋友圈页 - 内容生成与管理
│   │   ├── moments.js
│   │   ├── moments.json
│   │   ├── moments.wxml
│   │   └── moments.wxss
│   └── profile/              # 我的页面 - 用户中心
│       ├── profile.js
│       ├── profile.json
│       ├── profile.wxml
│       └── profile.wxss
├── utils/
│   ├── persona-engine.js     # 人设引擎 - 创建、分析、生成人设
│   ├── ai-dialogue.js        # AI对话模块 - 苏格拉底提问逻辑
│   ├── news-data.js          # 新闻数据 - 科技/AI领域资讯库
│   └── moments-generator.js  # 朋友圈生成器 - 内容创作引擎
└── assets/                   # 静态资源（图标等）
```

## 核心流程

1. **首页**：虚拟形象"小智"通过打字动画欢迎用户，引导开始创建
2. **对话页**：通过6轮苏格拉底式提问，深入了解用户的：
   - 活跃领域
   - 角色定位
   - 职业背景
   - 风格调性
   - 核心目标
   - 目标受众
3. **能力图谱**：基于对话生成10维能力雷达图，展示核心优势和提升建议
4. **参数调整**：用户可微调每个维度的数值、内容配比、发布频率
5. **朋友圈生成**：一键生成拟真朋友圈内容，支持复制、刷新、批量操作

## 人设模板

内置5种预设人设模板：
- AI技术专家
- 创业者
- 产品经理
- 自由职业者
- 投资人

系统会根据用户回答自动匹配最合适的模板，并融合用户个性化信息生成独特人设。

## 部署指南

1. 在微信公众平台注册小程序账号，获取 AppID
2. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
3. 打开微信开发者工具，导入本项目文件夹
4. 在 `project.config.json` 中将 `appid` 替换为你的真实 AppID
5. 将 `assets/` 文件夹中的图标替换为你自己的图标文件（tabBar图标需要）
6. 编译预览，确认无误后上传代码
7. 在微信公众平台提交审核并发布

## TabBar 图标说明

需要在 `assets/` 目录下准备以下图标文件（建议 81x81 像素 PNG）：
- `tab-home.png` / `tab-home-active.png` - 首页图标
- `tab-moments.png` / `tab-moments-active.png` - 朋友圈图标
- `tab-profile.png` / `tab-profile-active.png` - 我的图标

## 后续扩展建议

1. **接入真实AI API**：将 `ai-dialogue.js` 中的模拟回复替换为真实的大模型API调用
2. **新闻API接入**：接入 NewsAPI、今日头条等新闻数据源，实现实时资讯更新
3. **用户登录**：接入微信登录，支持多设备同步人设数据
4. **社交分享**：生成人设卡片图片，支持分享到朋友圈
5. **多人设管理**：支持创建和管理多个人设
6. **AI角色扮演**：接入大模型实现真正的角色扮演对话

## 技术栈

- 微信小程序原生框架
- SVG 雷达图
- CSS 动画与过渡
- 本地存储 (wx.setStorageSync)
