# Codex Vue

Vue 3 登录注册页面 + Express 本地接口 + SQLite 数据库。

```bash
npm install
npm run dev
```

前端地址为 `http://localhost:5173`，接口运行在 `http://localhost:3000`。首次启动会在 `data/codex-vue.db` 自动创建用户表，密码以 bcrypt 哈希保存。
