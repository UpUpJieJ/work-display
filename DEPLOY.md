# 部署指南

本文档说明如何将前端部署到 Vercel，将后端以 Docker 方式部署到自有服务器，并完成前后端联调。

---

## 一、后端 Docker 部署（自有服务器）

### 1. 前置条件

- 服务器已安装 Docker
- MongoDB 已就绪（本机或云服务，如 MongoDB Atlas、自建 MongoDB）
- 可访问的 IP 或域名供前端调用

### 2. 环境变量

在 `backend/` 目录下创建 `.env` 文件（不要提交到 Git），配置以下变量：

```env
# MongoDB
MONGODB_URL=mongodb://your-mongo-host:27017
MONGODB_DATABASE=portfolio

# CORS：允许前端域名访问，逗号分隔
ALLOWED_ORIGINS=http://localhost:3000,https://your-portfolio.vercel.app

# JWT（生产环境务必修改）
JWT_SECRET_KEY=your-secret-key-at-least-32-characters-long
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# 管理密码（使用脚本生成 hash 后填入）
PASSWORD_SALT=your-salt-change-in-production
ADMIN_PASSWORD_HASH=生成的密码哈希
```

生成管理密码哈希（在 backend 目录下）：

```bash
cd backend
python -c "
from app.routers.auth import generate_password_hash
print('ADMIN_PASSWORD_HASH=' + generate_password_hash('你的密码'))
"
```

### 3. 构建镜像

在**项目根目录**执行：

```bash
docker build -t portfolio-backend -f backend/Dockerfile .
```

或进入 backend 目录：

```bash
cd backend
docker build -t portfolio-backend .
```

### 4. 运行容器

```bash
docker run -d \
  -p 8000:8000 \
  --name portfolio-backend \
  --env-file backend/.env \
  --restart unless-stopped \
  portfolio-backend
```

或使用 `-e` 逐个传入环境变量：

```bash
docker run -d \
  -p 8000:8000 \
  --name portfolio-backend \
  -e MONGODB_URL=mongodb://your-host:27017 \
  -e MONGODB_DATABASE=portfolio \
  -e ALLOWED_ORIGINS=https://your-portfolio.vercel.app \
  portfolio-backend
```

### 5. 健康检查

```bash
curl http://your-server-ip:8000/health
# 应返回 {"status":"healthy"}

curl http://your-server-ip:8000/docs
# 应能打开 API 文档
```

### 6. 日志与重启

```bash
# 查看日志
docker logs -f portfolio-backend

# 停止
docker stop portfolio-backend

# 重新构建并运行
docker stop portfolio-backend
docker rm portfolio-backend
docker build -t portfolio-backend -f backend/Dockerfile .
docker run -d -p 8000:8000 --env-file backend/.env --name portfolio-backend portfolio-backend
```

---

## 二、前端 Vercel 部署

### 1. 推送代码

将项目推送到 GitHub / GitLab / Bitbucket。

### 2. 在 Vercel 创建项目

1. 打开 [vercel.com](https://vercel.com)，登录
2. 点击 **New Project**，导入你的 Git 仓库
3. 配置项目：
   - **Root Directory**：选择 `frontend`（若仓库为 monorepo）
   - **Framework Preset**：Next.js（一般自动识别）
   - **Build Command**：`next build`（默认）
   - **Output Directory**：`.next`（默认）

### 3. 环境变量

在 Vercel 项目 **Settings → Environment Variables** 中添加：

| 名称 | 值 | 环境 |
|------|-----|------|
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com` 或 `http://your-server-ip:8000` | Production, Preview |

- 若后端有 HTTPS 域名，使用 `https://api.yourdomain.com`
- 若暂用 IP，使用 `http://your-server-ip:8000`（注意：部分浏览器对 HTTP 有安全限制）

### 4. 部署

点击 **Deploy**，等待构建完成。Vercel 会给出生产域名，如 `https://your-portfolio.vercel.app`。

### 5. 更新后端 CORS

确保后端 `ALLOWED_ORIGINS` 包含该 Vercel 域名，例如：

```env
ALLOWED_ORIGINS=http://localhost:3000,https://your-portfolio.vercel.app
```

修改后重启后端容器。

---

## 三、前后端联调验证清单

部署完成后，按以下清单逐项验证：

### 前台展示

- [ ] 首页：自我介绍、技能、精选项目正常加载
- [ ] 项目列表页 `/projects`：分类切换、项目卡片展示正常
- [ ] 项目详情页 `/projects/[slug]`：点击卡片进入，详情、Markdown、外链正常
- [ ] 关于页 `/about`：个人简介、经历、教育、技能展示正常
- [ ] 联系页 `/contact`：联系表单提交成功，无 CORS 错误

### 管理后台

- [ ] `/admin/login`：使用配置的密码可登录
- [ ] Dashboard `/admin`：项目数、技能数、个人资料统计正确
- [ ] `/admin/profile`：编辑个人资料、社交链接，保存后前台同步
- [ ] `/admin/projects`：列表、新增、编辑、删除项目正常
- [ ] `/admin/skills`：列表、新增、编辑、删除技能正常

### 常见问题

1. **CORS 错误**：检查 `ALLOWED_ORIGINS` 是否包含前端域名，且无多余空格
2. **API 请求 404**：确认 `NEXT_PUBLIC_API_URL` 以 `/` 结尾则不要加，否则会变成 `//api/...`
3. **Mixed Content**：HTTPS 页面请求 HTTP 接口会被浏览器拦截，后端尽量配置 HTTPS
4. **MongoDB 连接失败**：检查 `MONGODB_URL`、网络可达性、防火墙规则
