# Python 开发者作品集网站

一个专业的 Python 软件开发者个人作品集网站，使用 **FastAPI** + **Next.js** 前后端分离架构构建。

## 项目结构

```
f:/works_display/
├── backend/                      # FastAPI 后端
│   ├── app/
│   │   ├── main.py               # FastAPI 应用入口
│   │   ├── models/               # Pydantic 数据模型
│   │   ├── routers/              # API 路由
│   │   ├── data/                 # 静态数据 (JSON)
│   │   └── services/             # 业务逻辑
│   ├── tests/                    # 测试文件
│   └── requirements.txt          # Python 依赖
│
└── frontend/                     # Next.js 前端
    ├── app/                      # App Router 页面
    ├── components/               # React 组件
    ├── lib/                      # 工具函数和类型
    └── package.json              # Node 依赖
```

## 技术栈

### 后端
- **FastAPI** - 现代化 Python Web 框架
- **Pydantic** - 数据验证
- **Uvicorn** - ASGI 服务器

### 前端
- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

## 功能特性

- 首页展示
- 个人简介
- 项目展示（按分类标签页：Web开发、爬虫、数据分析、自动化、机器学习、API开发）
- 项目详情页面
- 联系表单
- 响应式设计
- 深色模式支持

## 快速开始

### 后端启动

```bash
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动后端服务
uvicorn app.main:app --reload --port 8000
```

后端 API 将运行在 `http://localhost:8000`
API 文档访问 `http://localhost:8000/docs`

### 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将运行在 `http://localhost:3000`

## 配置

### 后端环境变量 (backend/.env)

```env
APP_NAME=Portfolio API
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000
```

### 前端环境变量 (frontend/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 数据管理

项目数据以 JSON 格式存储在 `backend/app/data/` 目录：

- `projects.json` - 项目数据
- `skills.json` - 技能数据
- `profile.json` - 个人资料

编辑这些文件来更新你的作品集内容。

## API 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/projects` | 获取项目列表（支持分类过滤） |
| GET | `/api/projects/{slug}` | 获取单个项目详情 |
| GET | `/api/skills` | 获取技能列表 |
| GET | `/api/profile` | 获取个人资料 |
| POST | `/api/contact` | 提交联系表单 |

## 部署

### 后端部署选项
- Railway
- Render
- Fly.io
- DigitalOcean App Platform

### 前端部署选项
- Vercel (推荐)
- Netlify
- Railway

## 许可证

MIT License
