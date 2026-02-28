# 管理后台使用指南

## 概述

这是一个轻量级的管理后台系统，让你可以通过 Web 界面管理作品集网站的所有内容，无需手动编辑 JSON 文件。

---

## 快速开始

### 1. 访问管理后台

启动服务后，在浏览器中访问：

```
http://localhost:3000/admin/login
```

### 2. 登录

**默认密码**: `admin123`

> ⚠️ **安全提示**: 生产环境请务必修改默认密码！

### 3. 首页

登录成功后，你会看到管理后台首页，包含：
- 当前项目数量统计
- 技能数量统计
- 个人资料入口
- 快速操作按钮

---

## 功能说明

### 📁 项目管理

**路径**: `/admin/projects`

#### 查看所有项目
- 显示所有项目的列表
- 包含标题、分类、状态、是否精选等信息
- 可以直接预览、编辑或删除项目

#### 新建项目
1. 点击右上角 **"Add Project"** 按钮
2. 填写项目信息：
   - **Title**: 项目名称
   - **Slug**: URL 标识符（只能包含小写字母、数字和连字符）
   - **Short Description**: 简短描述（显示在卡片上）
   - **Description**: 详细描述
   - **Category**: 选择项目分类
   - **Status**: 项目状态（如：completed, in_progress）
   - **Featured**: 是否设为精选项目
   - **Technologies**: 技术栈（用逗号分隔）

#### 编辑项目
1. 在项目列表中点击 **✏️ 图标**
2. 修改信息后保存

#### 删除项目
1. 在项目列表中点击 **🗑️ 图标**
2. 确认删除操作

> 💡 **自动备份**: 每次修改项目数据前，系统会自动创建备份文件。

---

### 🧠 技能管理

**路径**: `/admin/skills`

#### 查看所有技能
- 显示所有技能列表
- 包含名称、分类、熟练度、是否精选等信息

#### 新建技能
1. 点击右上角 **"Add Skill"** 按钮
2. 填写技能信息

#### 编辑/删除技能
操作方式与项目管理相同

---

### 👤 个人资料管理

**路径**: `/admin/profile`

#### 可编辑内容
- **基本信息**: 姓名、职位、标语、简介
- **联系方式**: 邮箱、电话、位置
- **社交链接**: GitHub、LinkedIn 等社交平台
- **工作经历**: 工作历史记录
- **教育背景**: 学历信息

---

## 安全与备份

### 备份机制

当前版本的备份接口尚未实现自动化备份。所有数据存储在 MongoDB 中，建议使用 MongoDB 自带的备份工具进行数据备份。

### MongoDB 备份命令

如需备份数据库，可使用 `mongodump`：

```bash
# 备份整个数据库
mongodump --uri="mongodb://111.231.68.34:27017/portfolio" --out=./backup

# 备份特定集合
mongodump --uri="mongodb://111.231.68.34:27017/portfolio" --collection=projects --out=./backup
```

如需恢复数据，可使用 `mongorestore`：

```bash
mongorestore --uri="mongodb://111.231.68.34:27017/portfolio" ./backup/portfolio
```

---

## 修改管理员密码

### 方法一：使用环境变量

1. 在 `backend` 目录下创建或编辑 `.env` 文件：

```bash
# 生成新的密码哈希
ADMIN_PASSWORD_HASH=your_new_password_hash
```

2. 使用以下 Python 代码生成密码哈希：

```python
import hashlib

# 设置你的密码和盐值（建议修改盐值）
PASSWORD = "你的新密码"
SALT = "your-unique-salt-here"

# 生成哈希
hash_value = hashlib.sha256(f"{SALT}{PASSWORD}".encode('utf-8')).hexdigest()
print(f"ADMIN_PASSWORD_HASH={hash_value}")
print(f"PASSWORD_SALT={SALT}")
```

或在后端目录运行：

```bash
cd backend
uv run python -c "
import hashlib
password = '你的新密码'
salt = 'your-unique-salt'
hash_value = hashlib.sha256(f'{salt}{password}'.encode()).hexdigest()
print(f'ADMIN_PASSWORD_HASH={hash_value}')
print(f'PASSWORD_SALT={salt}')
"
```

### 方法二：临时使用默认密码

如果不设置环境变量，默认密码是：`admin123`

---

## 部署说明

### 环境变量配置

在 `backend/.env` 中配置：

```bash
# JWT 密钥（建议使用随机字符串，至少32位）
JWT_SECRET_KEY=your-super-secret-key-change-in-production

# 密码盐值（用于生成密码哈希，建议修改）
PASSWORD_SALT=your-unique-salt-change-in-production

# 管理员密码哈希（使用上面文档中的方法生成）
# 默认密码 admin123 对应的哈希（使用默认盐值）
ADMIN_PASSWORD_HASH=b6a31c6e4192ca77fec64e177acb8808d2fbc1f4525c046f5070a6d620d19511

# API 配置
API_HOST=0.0.0.0
API_PORT=8000
```

### 前端配置

在 `frontend/.env.local` 中配置：

```bash
# 后端 API 地址
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### CORS 配置

确保 `backend/app/main.py` 中的 CORS 配置包含你的前端域名：

```python
allow_origins=[
    "https://your-frontend-domain.com",
    "http://localhost:3000"
]
```

---

## 常见问题

### Q: 忘记密码怎么办？
A: 重新生成密码哈希并更新 `backend/.env` 文件中的 `ADMIN_PASSWORD_HASH`

### Q: 登录后提示 "Unauthorized"？
A: Token 可能已过期，退出后重新登录即可

### Q: 修改数据后前台没有更新？
A: 检查前端是否正确配置了 API 地址，查看浏览器控制台是否有错误

### Q: 如何查看 API 文档？
A: 访问 `http://your-api-host:8000/docs` 查看 Swagger 文档

---

## 技术架构

- **后端**: FastAPI + JWT 认证 + MongoDB 数据库
- **前端**: Next.js 15 + React 19 + TypeScript
- **认证方式**: JWT Token（24小时有效期）+ SHA-256 密码哈希
- **数据存储**: MongoDB（projects、skills、profiles、contact_submissions 集合）
- **密码加密**: SHA-256 + Salt（无需额外依赖）

---

## 文件结构

```
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py          # 认证路由
│   │   │   ├── projects.py      # 项目 CRUD
│   │   │   ├── skills.py        # 技能 CRUD
│   │   │   └── profile.py       # 资料 CRUD
│   │   ├── dependencies/
│   │   │   └── auth.py          # 认证依赖
│   │   ├── services/
│   │   │   ├── data_loader.py   # 数据读取（MongoDB）
│   │   │   └── data_writer.py   # 数据写入（MongoDB）
│   │   └── config.py            # 应用配置
│   ├── scripts/
│   │   └── migrate_to_mongodb.py # 数据迁移脚本
│   └── .env                     # 环境变量
│
└── frontend/
    └── app/
        └── admin/
            ├── login/
            │   └── page.tsx      # 登录页
            ├── layout.tsx        # 管理后台布局
            ├── page.tsx          # 首页
            ├── projects/
            │   ├── page.tsx      # 项目列表
            │   └── [id]/page.tsx # 项目编辑
            ├── skills/
            │   └── page.tsx      # 技能管理
            └── profile/
                └── page.tsx      # 资料编辑
```

---

## 更新日志

### v1.0.0 (2024-02-27)
- ✅ 完成管理后台基础功能
- ✅ 项目 CRUD 操作
- ✅ 技能 CRUD 操作
- ✅ 个人资料编辑
- ✅ JWT 认证系统
- ✅ 自动备份机制
