import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Home() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		axios
			.get('http://localhost:3001/api/posts')
			.then((res) => setPosts(res.data))
			.catch((err) => console.error('取得貼文失敗:', err));
	}, []);

	return (
		<>
			<div className="container py-4">
				<h1 className="mb-4"> KnockKnock 貼文區</h1>
				{posts.map((post) => (
					<div className="card mb-3" key={post.id}>
						<Link href={`/posts/${post.id}`}>查看留言</Link>
						<div className="card-body">
							<h5 className="card-title">{post.title}</h5>
							<p className="card-text">{post.content}</p>
							<p className="text-muted small">
								👤by {post.author} ・🕒{new Date(post.createdAt).toLocaleString()}
							</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
