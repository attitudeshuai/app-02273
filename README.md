# 苏轼社交网络可视化项目

## How to Run

### 使用 Docker Compose（推荐）

```bash
# 启动服务
docker-compose up -d --build

# 访问地址：http://localhost:8081
```

### 本地开发

```bash
# 进入前端目录
cd frontend-admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev

#访问地址： http://localhost:5173
```

## Services

| 服务名称 | 端口 | 描述 |
|---------|------|------|
| frontend-admin | 8081 | 苏轼社交网络可视化前端应用 |

## 测试账号

本项目为纯前端可视化项目，无需登录账号即可使用全部功能。

## 题目内容

在该目录下基于vue,帮我编写实现苏轼社交网络可视化

## 项目介绍

本项目是一个基于 Vue 3 + Vite + Element Plus 构建的苏轼社交网络可视化应用,展示北宋文学家苏轼与其家人、朋友、政敌、学生等人物之间的社交关系网络。

### 主要功能
- **人物列表/详情**：点击节点查看人物详细信息
- **关系筛选**：按关系类型（家人、朋友、政敌、学生等）筛选显示
- **搜索功能**：快速搜索定位特定人物
- **时间线**：展示苏轼生平重要事件

### 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 UI 组件库
- **Pinia** - Vue 状态管理库
- **Axios** - HTTP 请求库
- **SCSS** - CSS 预处理器

### 项目结构

```
├── README.md                # 项目说明文档
├── docker-compose.yml       # Docker Compose 配置
├── .gitignore               # Git 忽略文件
└── frontend-admin/          # 前端项目代码
    ├── Dockerfile           # Docker 构建文件
    ├── nginx.conf           # Nginx 配置
    ├── package.json         # 项目依赖
    ├── vite.config.js       # Vite 配置
    ├── index.html           # 入口 HTML
    ├── public               # 公共资源
    └── src/
        ├── main.js          # 应用入口
        ├── App.vue          # 根组件
        ├── assets/          # 静态资源
        │   └── styles/      # 全局样式
        ├── components/      # 公共组件
        ├── views/           # 页面视图
        ├── stores/          # Pinia 状态管理
        ├── api/             # API 接口
        ├── utils/           # 工具函数
        ├── data/            # 静态数据
        └── router/          # 路由配置
```

### 数据来源

项目中的人物关系数据基于历史文献整理，包括：
- 苏轼的家族成员（父亲苏洵、弟弟苏辙、妻子王弗等）
- 文学挚友（欧阳修、黄庭坚、秦观等）
- 政治人物（王安石、司马光等）
- 学生门人（黄庭坚、秦观、晁补之、张耒等"苏门四学士"）
