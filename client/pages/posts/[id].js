import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!id) return;

    // 抓取貼文內容 + 留言 + 按讚數
    axios.get(`http://localhost:3001/api/posts/${id}`)
      .then(res => {
        setPost(res.data.post);
        setComments(res.data.comments);
        setLikeCount(res.data.likeCount);
      })
      .catch(err => console.error('取得貼文失敗:', err));

    // 抓取使用者是否已按讚
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`http://localhost:3001/api/posts/${id}/likes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setLiked(res.data.liked);
      })
      .catch(err => console.error('取得讚狀態失敗:', err));
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3001/api/posts/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      const updated = await axios.get(`http://localhost:3001/api/posts/${id}`);
      setComments(updated.data.comments);
    } catch (err) {
      console.error('留言失敗:', err.response?.data);
    }
  };

  const handleLikeToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('請先登入');

    try {
      if (liked) {
        await axios.delete(`http://localhost:3001/api/posts/${id}/likes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikeCount(prev => prev - 1);
        setLiked(false);
      } else {
        await axios.post(`http://localhost:3001/api/posts/${id}/likes`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikeCount(prev => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error('按讚失敗:', err.response?.data);
    }
  };

  if (!post) return <div className="container py-5">載入中...</div>;

  return (
    <div className="container py-5">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p className="text-muted small">👤 {post.author} ・🕒 {new Date(post.createdAt).toLocaleString()}</p>

      <button
        className={`btn btn-${liked ? 'danger' : 'outline-secondary'} mb-3`}
        onClick={handleLikeToggle}
      >
        ❤️ {liked ? '已按讚' : '按讚'}（{likeCount}）
      </button>

      <hr />
      <h5>💬 留言區</h5>
      <ul className="list-group mb-3">
        {comments.map(c => (
          <li className="list-group-item" key={c.id}>
            <strong>{c.author}</strong>: {c.content}
            <div className="text-muted small">{new Date(c.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      <div className="input-group">
        <input
          className="form-control"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="寫個留言吧..."
        />
        <button className="btn btn-primary" onClick={handleAddComment}>送出</button>
      </div>
    </div>
  );
}
