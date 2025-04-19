// routes/comments.js
const express = require('express');
const pool    = require('../db');
const auth    = require('../middleware/auth');
// 讓 router 可以讀到 parent params (postId)
const router  = express.Router({ mergeParams: true });

// POST   /api/posts/:postId/comments
router.post('/', auth, async (req, res) => {
  const { content } = req.body;
  const postId      = req.params.postId;
  if (!content) return res.status(400).json({ error: '留言內容不得為空' });

  try {
    const [r] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, req.user.id, content]
    );
    res.status(201).json({ message: '留言已新增', commentId: r.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '新增留言失敗' });
  }
});

// GET    /api/posts/:postId/comments
router.get('/', async (req, res) => {
  const postId = req.params.postId;
  try {
    const [comments] = await pool.query(`
      SELECT c.id, c.content, c.created_at AS createdAt,
             u.id AS authorId, u.username AS author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [postId]);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '取得留言失敗' });
  }
});

// DELETE /api/posts/:postId/comments/:commentId
router.delete('/:commentId', auth, async (req, res) => {
    const { postId, commentId } = req.params;
    try {
      // 1. 確認這則留言存在並屬於這篇文章
      const [[existing]] = await pool.query(
        'SELECT user_id FROM comments WHERE id = ? AND post_id = ?',
        [commentId, postId]
      );
      if (!existing) {
        return res.status(404).json({ error: '留言不存在' });
      }
      // 2. 確認只有留言作者可以刪除
      if (existing.user_id !== req.user.id) {
        return res.status(403).json({ error: '沒有權限删除' });
      }
      // 3. 刪除動作
      await pool.query(
        'DELETE FROM comments WHERE id = ?',
        [commentId]
      );
      res.json({ message: '已删除' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '删除失败' });
    }
  });

// 取得使用者發過的所有留言
// routes/users.js
router.get('/:id/comments', async (req, res) => {
  const userId = req.params.id;
  try {
    const [comments] = await pool.query(`
      SELECT c.id, c.content, c.created_at AS createdAt, c.post_id AS postId,
             p.title AS postTitle
      FROM comments c
      JOIN posts p ON c.post_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `, [userId]);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '取得留言失敗' });
  }
});


module.exports = router;
