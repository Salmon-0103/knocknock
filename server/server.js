require('dotenv').config();
const express = require('express');
const app = express();

// 跨域
app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // 前端開發環境位址
  credentials: true                // 若使用 cookie 登入可打開
}));

// 認證路由 登入、註冊
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// 使用者
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// 貼文
const postsRouter = require('./routes/posts');
app.use('/api/posts', postsRouter);

// 留言 貼文下的留言
const commentsRouter = require('./routes/comments');
app.use('/api/posts/:postId/comments', commentsRouter);

// 按讚
const likesRouter = require('./routes/likes');
app.use('/api/posts/:postId/likes', likesRouter);



// 測試資料庫連線用

// 資料庫連線池
const pool = require('./db');
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1+1 AS result');
    res.json({ db: rows[0].result, status: 'OK' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// 找不到路由
app.use((req, res) => {
  res.status(404).json({ error: '找不到這個 API 路由' });
});


// 啟動伺服器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔑 Server running on http://localhost:${PORT}`);
});
