require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

// 載入資料庫連線池
const pool = require('./db');

// 載入認證路由
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// 測試資料庫連線用 endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1+1 AS result');
    res.json({ db: rows[0].result, status: 'OK' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔑 Server running on http://localhost:${PORT}`);
});
