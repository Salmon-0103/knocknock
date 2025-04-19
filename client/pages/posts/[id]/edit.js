import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { UserContext } from '@/contexts/userContext';

export default function EditPost() {
	const { user } = useContext(UserContext);
	const router = useRouter();
	const { id } = router.query;

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [errMsg, setErrMsg] = useState('');

	// 載入原本貼文資料
	useEffect(() => {
		if (!id) return;
		axios
			.get(`http://localhost:3001/api/posts/${id}`)
			.then((res) => {
				const post = res.data.post;
				// 檢查是否為作者本人
				if (post.authorId !== user?.id) {
					alert('你沒有權限編輯這篇貼文');
					router.push('/');
				} else {
					setTitle(post.title);
					setContent(post.content);
					setImageUrl(post.imageUrl || '');
				}
			})
			.catch(() => {
				alert('無法載入貼文');
				router.push('/');
			});
	}, [id, user]);

	const handleUpdate = async () => {
		if (!title.trim() || !content.trim()) {
			return setErrMsg('標題與內容不得為空');
		}
		try {
			const token = localStorage.getItem('token');
			await axios.put(
				`http://localhost:3001/api/posts/${id}`,
				{
					title,
					content,
					imageUrl,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			router.push(`/posts/${id}`);
		} catch (err) {
			console.error(err);
			setErrMsg('更新失敗');
		}
	};

	if (!user) {
		return <div className="container py-5 text-center">請先登入</div>;
	}

	return (
		<div className="container py-5" style={{ maxWidth: 600 }}>
			<h2 className="mb-4">✏️ 編輯貼文</h2>
			{errMsg && <div className="alert alert-danger">{errMsg}</div>}

			<div className="mb-3">
				<label>標題</label>
				<input
					className="form-control"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>

			<div className="mb-3">
				<label>內容</label>
				<textarea
					className="form-control"
					rows="5"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				></textarea>
			</div>

			<div className="mb-3">
				<label>圖片網址（選填）</label>
				<input
					className="form-control"
					value={imageUrl}
					onChange={(e) => setImageUrl(e.target.value)}
				/>
			</div>

			<button className="btn btn-primary w-100" onClick={handleUpdate}>
				更新貼文
			</button>
		</div>
	);
}
