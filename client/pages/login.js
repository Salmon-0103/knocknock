import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      });
      const token = res.data.token;
      localStorage.setItem('token', token); // 儲存 Token

      // 取得使用者資料
      const me = await axios.get('http://localhost:3001/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem('user', JSON.stringify(me.data)); // 暫存 user

      router.push('/'); // 登入成功 → 導回首頁
    } catch (err) {
      setErrMsg(err.response?.data?.error || '登入失敗');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">🔐 使用者登入</h2>
      {errMsg && <div className="alert alert-danger">{errMsg}</div>}
      <div className="mb-3">
        <label>Email</label>
        <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <label>密碼</label>
        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button className="btn btn-primary w-100" onClick={handleLogin}>登入</button>
    </div>
  );
}
