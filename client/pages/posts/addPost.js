import { useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { UserContext } from '@/contexts/userContext';

export default function AddPost() {
	const { user } = useContext(UserContext);
	const router = useRouter();

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [errMsg, setErrMsg] = useState('');

	const handleSubmit = async () => {
		if (!title.trim() || !content.trim()) {
			return setErrMsg('標題與內容不得為空');
		}

		try {
			const token = localStorage.getItem('token');
			await axios.post(
				'http://localhost:3001/api/posts',
				{ title, content, imageUrl },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			router.push('/');
		} catch (err) {
			console.error(err);
			setErrMsg('發文失敗，請稍後再試');
		}
	};

	if (!user) {
		return (
			<div className="container py-5 text-center">
				<h4>請先登入才能發文 ✍️</h4>
				<p className="text-muted">系統無法取得使用者身份，請返回登入頁。</p>
			</div>
		);
	}

	return (
		<div className="container py-5" style={{ maxWidth: 600 }}>
			<h2 className="mb-4">➕ 新增貼文</h2>
			{errMsg && <div className="alert alert-danger">{errMsg}</div>}

			<div className="mb-3">
				<label>標題</label>
				<input
					className="form-control"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="請輸入標題"
				/>
			</div>

			<div className="mb-3">
				<label>內容</label>
				<textarea
					className="form-control"
					rows="5"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="請輸入貼文內容"
				></textarea>
			</div>

			<div className="mb-3">
				<label>圖片網址（選填）</label>
				<input
					className="form-control"
					value={imageUrl}
					onChange={(e) => setImageUrl(e.target.value)}
					placeholder="https://example.com/..."
				/>
			</div>

			<button className="btn btn-primary w-100" onClick={handleSubmit}>
				發佈貼文
			</button>
		</div>
	);
}
