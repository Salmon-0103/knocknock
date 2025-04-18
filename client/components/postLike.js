import { useState, useEffect } from 'react';

export default function PostLikeButton({ postId, token }) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/posts/${postId}/likes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setLikeCount(data.likeCount);
        setLiked(data.liked);
      });
  }, [postId, token]);

  const handleToggleLike = async () => {
    const method = liked ? 'DELETE' : 'POST';
    const res = await fetch(`http://localhost:3001/api/posts/${postId}/likes`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setLiked(!liked);
      setLikeCount(prev => prev + (liked ? -1 : 1));
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      className={`px-4 py-2 rounded-full text-white ${liked ? 'bg-red-500' : 'bg-gray-400'}`}
    >
      {liked ? '💔 取消讚' : '👍 按讚'} ({likeCount})
    </button>
  );
}
