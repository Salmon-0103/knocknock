import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '@/contexts/userContext';
import { useRouter } from 'next/router';

export default function MyPage() {
	const { user } = useContext(UserContext);
	const router = useRouter();
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			router.push('/login');
			return;
		}

		if (user?.id) {
			axios
				.get(`http://localhost:3001/api/users/${user.id}/posts`)
				.then((res) => setPosts(res.data))
				.catch((err) => console.error('載入貼文失敗:', err));
		}
	}, [user]);

	if (!user) return <div className="container py-5">載入中...</div>;

	return (
		<div className="container py-5">
			<h2>使用者資訊</h2>
			<p>
				<strong>名稱：</strong> {user.username}
			</p>
			<p>
				<strong>Email：</strong> {user.email}
			</p>
			<p>
				<strong>加入時間：</strong> {new Date(user.createdAt).toLocaleDateString()}
			</p>

			<hr />
			<h4 className="mt-4">📝 我發過的貼文</h4>
			{posts.length === 0 ? (
				<p className="text-muted">你還沒有發過任何貼文。</p>
			) : (
				<ul className="list-group">
					{posts.map((post) => (
						<li key={post.id} className="list-group-item">
							<strong>{post.title}</strong>
							<div className="text-muted small">
								{new Date(post.createdAt).toLocaleString()}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
