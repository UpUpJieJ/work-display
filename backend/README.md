# Backend - Portfolio API

FastAPI 后端服务，提供作品集数据的 JSON API。

## 开发

### 使用 uv（推荐）

```bash
# 安装 uv（如果还没安装）
pip install uv

# 同步依赖（创建虚拟环境并安装）
uv sync

# 运行开发服务器（方式一：激活虚拟环境）
.venv\Scripts\activate  # Windows
python run.py

# 运行开发服务器（方式二：直接使用 uv run）
uv run python run.py

# 运行测试
uv run pytest
```

### 使用 pip（传统方式）

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
pytest
```

## uv 常用命令

```bash
# 添加新依赖
uv add <package-name>

# 添加开发依赖
uv add --dev <package-name>

# 移除依赖
uv remove <package-name>

# 更新所有依赖
uv sync --upgrade
```

## API 文档

启动服务后访问：
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
