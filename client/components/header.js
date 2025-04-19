import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '@/contexts/userContext';

export default function Header() {
	const { user, logout } = useContext(UserContext);

	return (
		<nav className="navbar navbar-expand navbar-light bg-light px-4 mb-4">
			<Link className="navbar-brand" href="/">
				KnockKnock
			</Link>

			<div className="ms-auto">
				{user ? (
					<>
						<Link className="btn btn-outline-dark btn-sm me-2" href="/posts/addPost">
							➕ 發文
						</Link>
						<Link className="btn btn-outline-secondary btn-sm me-2" href="/me">
							Hi, {user.username}
						</Link>
						<button className="btn btn-outline-danger btn-sm" onClick={logout}>
							登出
						</button>
					</>
				) : (
					<>
						<Link className="btn btn-outline-primary btn-sm me-2" href="/login">
							登入
						</Link>
						<Link className="btn btn-outline-success btn-sm" href="/login/register">
							註冊
						</Link>
					</>
				)}
			</div>
		</nav>
	);
}
