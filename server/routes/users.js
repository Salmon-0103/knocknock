const express = require('express');
const pool    = require('../db');
const router  = express.Router();

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [[user]] = await pool.query(
      'SELECT id, username, email, avatar_url AS avatarUrl, created_at AS createdAt FROM users WHERE id = ?',
      [userId]
    );
    if (!user) return res.status(404).json({ error: '使用者不存在' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '取得使用者失敗' });
  }
});

// 取得使用者發過的所有貼文
// routes/users.js
router.get('/:id/posts', async (req, res) => {
    const userId = req.params.id;
    try {
      const [posts] = await pool.query(`
        SELECT p.id, p.title, p.content, p.image_url AS imageUrl, p.created_at AS createdAt
        FROM posts p
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
      `, [userId]);
      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '取得使用者貼文失敗' });
    }
  });
  

module.exports = router;
