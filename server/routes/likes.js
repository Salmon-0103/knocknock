const express = require('express');
const router = express.Router({ mergeParams: true });
const pool = require('../db');
const auth = require('../middleware/auth');

// 👉 按讚 POST /api/posts/:postId/likes
router.post('/', auth, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  try {
    await pool.query(
      'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
      [postId, userId]
    );
    res.status(201).json({ message: '已按讚' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: '已經按過讚' });
    }
    console.error(err);
    res.status(500).json({ error: '按讚失敗' });
  }
});

// 👉 取消讚 DELETE /api/posts/:postId/likes
router.delete('/', auth, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  try {
    const [result] = await pool.query(
      'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '尚未按讚' });
    }
    res.json({ message: '取消讚' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '取消讚失敗' });
  }
});

// 👉 查詢讚數與是否有讚 GET /api/posts/:postId/likes
router.get('/', auth, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  try {
    const [[{ likeCount }]] = await pool.query(
      'SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?',
      [postId]
    );
    const [[{ liked }]] = await pool.query(
      'SELECT COUNT(*) AS liked FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
    res.json({ likeCount, liked: !!liked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '取得讚數失敗' });
  }
});

module.exports = router;
