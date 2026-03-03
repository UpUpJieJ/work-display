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
│   │   └── services/             # 业务逻辑
│   ├── scripts/                  # 迁移脚本
│   │   └── migrate_to_mongodb.py # JSON 转 MongoDB 迁移脚本
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
API 文档访问 `http://localhost:8000/docs`（仅在 `DEBUG=True` 时启用）

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

项目数据存储在 **MongoDB** 数据库中，包含以下集合：

- `projects` - 项目数据
- `skills` - 技能数据
- `profile` - 个人资料
- `contact_submissions` - 联系表单提交记录

### 项目链接字段

每个项目可以在管理后台（`/admin/projects`）中配置多个外部链接，例如 GitHub/Gitee 仓库、在线演示地址或飞书文档等：

- 在项目编辑页的「项目链接」区域添加多条记录，每条包含：
  - **title**：链接标题（如“GitHub”“在线演示”“飞书文档”）
  - **url**：实际跳转地址
  - **icon**：可选，当前仅当设置为 `github` 时，前端会显示 GitHub 图标，其它值将使用通用外链图标
- 这些链接会显示在项目卡片和项目详情页中，点击后在新窗口打开。

### 迁移脚本

如需从旧版 JSON 数据迁移，可使用迁移脚本：

```bash
cd backend
python scripts/migrate_to_mongodb.py
```

该脚本会从 `backend/app/data/` 读取 JSON 文件并导入到 MongoDB（注意：JSON 文件已在迁移后删除）。

### 环境变量配置

在 `backend/.env` 中配置 MongoDB 连接：

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=portfolio
```

生产环境请使用远程 MongoDB 实例。

## API 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/projects` | 获取项目列表（支持分类过滤） |
| GET | `/api/projects/{slug}` | 获取单个项目详情 |
| GET | `/api/skills` | 获取技能列表 |
| GET | `/api/profile` | 获取个人资料 |
| POST | `/api/contact` | 提交联系表单 |

## 部署

- **前端**：部署到 [Vercel](https://vercel.com)（推荐）
- **后端**：使用 Docker 部署到自有服务器

详细步骤见 [DEPLOY.md](DEPLOY.md)，包括：
- 后端 Dockerfile 构建与运行
- 环境变量配置
- Vercel 部署与 `NEXT_PUBLIC_API_URL` 设置
- 前后端联调验证清单

## 许可证

MIT License
