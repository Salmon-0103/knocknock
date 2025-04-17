const express = require('express');
const pool    = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// 1. 新增貼文
router.post('/', auth, async (req, res) => {
  const { title, content, imageUrl } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO posts (user_id, title, content, image_url) VALUES (?, ?, ?, ?)',
      [req.user.id, title, content, imageUrl || null]
    );
    res.status(201).json({ message: '貼文已新增', postId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '新增貼文失敗' });
  }
});

// 2. 取得貼文列表（最新在前）
router.get('/', async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT p.id, p.title, p.content, p.image_url AS imageUrl,
             p.created_at AS createdAt,
             u.id AS authorId, u.username AS author
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '取得貼文列表失敗' });
  }
});

// 3. 取得單一貼文（含留言與按讚數）
router.get('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    // 貼文本體
    const [[post]] = await pool.query(`
      SELECT p.id, p.title, p.content, p.image_url AS imageUrl,
             p.created_at AS createdAt,
             u.id AS authorId, u.username AS author
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [postId]);
    if (!post) return res.status(404).json({ error: '貼文不存在' });

    // 留言
    const [comments] = await pool.query(`
      SELECT c.id, c.content, c.created_at AS createdAt,
             u.id AS authorId, u.username AS author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [postId]);

    // 按讚數
    const [[{ likeCount }]] = await pool.query(`
      SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?
    `, [postId]);

    res.json({ post, comments, likeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '取得貼文失敗' });
  }
});

// 4. 編輯自己的貼文
router.put('/:id', auth, async (req, res) => {
  const postId = req.params.id;
  const { title, content, imageUrl } = req.body;
  try {
    // 確認作者
    const [[existing]] = await pool.query(
      'SELECT user_id FROM posts WHERE id = ?',
      [postId]
    );
    if (!existing) return res.status(404).json({ error: '貼文不存在' });
    if (existing.user_id !== req.user.id) 
      return res.status(403).json({ error: '沒有權限編輯此貼文' });

    // 更新
    await pool.query(
      `UPDATE posts
       SET title = ?, content = ?, image_url = ?
       WHERE id = ?`,
      [title, content, imageUrl || null, postId]
    );
    res.json({ message: '貼文已更新' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '更新貼文失敗' });
  }
});

// 5. 刪除自己的貼文
router.delete('/:id', auth, async (req, res) => {
  const postId = req.params.id;
  try {
    // 確認作者
    const [[existing]] = await pool.query(
      'SELECT user_id FROM posts WHERE id = ?',
      [postId]
    );
    if (!existing) return res.status(404).json({ error: '貼文不存在' });
    if (existing.user_id !== req.user.id) 
      return res.status(403).json({ error: '沒有權限刪除此貼文' });

    // 刪除
    await pool.query('DELETE FROM posts WHERE id = ?', [postId]);
    res.json({ message: '貼文已刪除' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '刪除貼文失敗' });
  }
});

module.exports = router;
