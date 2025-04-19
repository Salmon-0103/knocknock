import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function RegisterPage() {
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [pwdValid, setPwdValid] = useState(false); // 密碼驗證結果
	const [pwdMatch, setPwdMatch] = useState(true); // 密碼一致性
	const validatePassword = (pwd) => {
		const pattern = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
		return pattern.test(pwd);
	};

	const handleRegister = async () => {
		setErrMsg('');
		if (!validatePassword(password)) {
			return setErrMsg('密碼需至少8字，包含小寫英文與數字');
		}

		try {
			await axios.post('http://localhost:3001/api/auth/register', {
				username,
				email,
				password,
			});

			// 自動登入
			const res = await axios.post('http://localhost:3001/api/auth/login', {
				email,
				password,
			});
			const token = res.data.token;
			localStorage.setItem('token', token);

			const me = await axios.get('http://localhost:3001/api/auth/me', {
				headers: { Authorization: `Bearer ${token}` },
			});
			localStorage.setItem('user', JSON.stringify(me.data));

			router.push('/');
		} catch (err) {
			setErrMsg(err.response?.data?.error || '註冊失敗');
		}
	};

	useEffect(() => {
		setPwdValid(validatePassword(password));
		setPwdMatch(password === confirmPassword);
	}, [password, confirmPassword]);

	return (
		<div className="container py-5" style={{ maxWidth: 400 }}>
			<h1 className="mb-4">Sign in</h1>
			{errMsg && <div className="alert alert-danger">{errMsg}</div>}
			{/* 使用者名稱 */}
			<div className="mb-3">
				<label>使用者名稱</label>
				<input
					className="form-control"
					placeholder="請輸入使用者名稱"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			{/* 電子信箱 */}
			<div className="mb-3">
				<label>Email</label>
				<input
					className="form-control"
					placeholder="請輸入電子信箱"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			{/* 密碼 */}
			<div className="mb-3">
				<label>密碼</label>
				<input
					type="password"
					className={`form-control ${password && !pwdValid ? 'is-invalid' : ''}`}
					placeholder="請輸入密碼"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{/* 密碼如果是空的 */}
				{!password && <div className="form-text">請輸入密碼</div>}
				{/* 密碼需符合規定 */}
				{/* 加入眼睛圖示、做開關確認密碼功能 */}
				{!pwdValid && password && (
					<div className="invalid-feedback">
						密碼格式不正確(需至少8字，包含小寫英文、數字)
					</div>
				)}
			</div>
			{/* 生日 */}
			<div className="mb-3"></div>
			{/* checkbox同意使用條款 */}
			{/* 註冊按紐 */}
			<button className="btn btn-success w-100 " onClick={handleRegister}>
				註冊
			</button>
			{/* 已經有帳號了了嗎?<LINK href="/login">登入</=> */}
		</div>
	);
}
